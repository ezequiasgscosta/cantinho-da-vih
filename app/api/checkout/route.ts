import { NextResponse } from "next/server";
import Stripe from "stripe";
import { supabase } from "../../../lib/supabase"; // 🌟 Caminho de 3 níveis corrigido para acessar a pasta /lib fora de app/api/checkout

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

interface ItemSimplificado {
  id: number;
  quantidade: number;
}

export async function POST(request: Request) {
  try {
    const { itens, cupom }: { itens: ItemSimplificado[]; cupom?: string | null } = await request.json();

    if (!itens || itens.length === 0) {
      return NextResponse.json({ error: "Carrinho vazio." }, { status: 400 });
    }

    const idsProdutos = itens.map((item) => item.id);

    // BUSCA DO BANCO: Pega os dados reais
    const { data: produtosDoBanco, error: errProdutos } = await supabase
      .from("produtos")
      .select("id, nome, preco") // 🌟 Removemos a requisição do imagem_url por segurança para blindar o Stripe
      .in("id", idsProdutos);

    if (errProdutos || !produtosDoBanco || produtosDoBanco.length === 0) {
      return NextResponse.json({ error: "Erro ao validar produtos no banco de dados." }, { status: 500 });
    }

    // VALIDAÇÃO DO CUPOM DIRETO DO BANCO
    let descontoPorcentagem = 0;
    if (cupom) {
      const { data: dadosCupom, error: errCupom } = await supabase
        .from("cupons")
        .select("desconto_porcentagem, ativo")
        .eq("codigo", cupom.trim().toUpperCase())
        .eq("ativo", true)
        .single();

      if (!errCupom && dadosCupom) {
        descontoPorcentagem = dadosCupom.desconto_porcentagem;
      }
    }

    let subtotalBanco = 0;
    const mapaProdutosBanco = new Map();
    
    produtosDoBanco.forEach((prod) => {
      mapaProdutosBanco.set(prod.id, prod);
      const itemCarrinho = itens.find((i) => i.id === prod.id);
      if (itemCarrinho) {
        subtotalBanco += Number(prod.preco) * itemCarrinho.quantidade;
      }
    });

    const valorDesconto = subtotalBanco * (descontoPorcentagem / 100);
    const totalFinalBanco = subtotalBanco - valorDesconto;
    const fatorDesconto = totalFinalBanco / subtotalBanco;

    // Monta os itens do Stripe blindados
    const line_items = itens.map((item) => {
      const produtoBanco = mapaProdutosBanco.get(item.id);

      if (!produtoBanco) {
        throw new Error(`Produto com ID ${item.id} não foi encontrado.`);
      }

      const precoUnitarioComDesconto = Math.round((Number(produtoBanco.preco) * fatorDesconto) * 100);

      return {
        price_data: {
          currency: "brl",
          product_data: {
            name: produtoBanco.nome,
            images: [], // 🌟 Passando vazio eliminamos o erro da URL estourada para strings longas
          },
          unit_amount: precoUnitarioComDesconto,
        },
        quantity: item.quantidade,
      };
    });

    // Cria a sessão com os dados processados e limpos
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items,
      mode: "payment",
      success_url: `https://cantinhodavih.vercel.app/sucesso`,
      cancel_url: `https://cantinhodavih.vercel.app/`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error("Erro no Checkout Protegido:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}