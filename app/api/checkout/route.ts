import { NextResponse } from "next/server";
import Stripe from "stripe";

// Inicializa o Stripe (coloque sua chave aqui ou garanta que ela está no .env)
// A Vercel vai injetar a chave aqui automaticamente em produção
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);// Definindo o tipo do item que vem do seu carrinho
interface ItemCarrinho {
  id: string | number;
  nome: string;
  preco: number;
  quantidade: number;
  img?: string;
}

export async function POST(request: Request) {
  try {
    const { itens }: { itens: ItemCarrinho[] } = await request.json();

    // Transforma os itens do seu carrinho no formato que o Stripe exige
    const line_items = itens.map((item) => ({
      price_data: {
        currency: "brl",
        product_data: {
          name: item.nome,
          images: item.img ? [item.img] : [],
        },
        unit_amount: Math.round(item.preco * 100), // Em centavos
      },
      quantity: item.quantidade,
    }));

    // Cria a sessão de pagamento
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items,
      mode: "payment",
      success_url: `https://cantinhodavih.vercel.app/sucesso`,
cancel_url: `https://cantinhodavih.vercel.app/`,
});

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}