"use client";

import { useEffect, useState } from "react";
import { useCarrinho } from "../store/useCarrinho";
import { supabase } from "../../lib/supabase";
import Link from "next/link";

export default function Sucesso() {
  const limparCarrinho = useCarrinho((state) => state.limparCarrinho);
  const [statusEnvio, setStatusEnvio] = useState("processando");

  useEffect(() => {
    async function registrarPedidoNoBanco() {
      try {
        // 1. Tenta buscar os itens salvos no sessionStorage de segurança antes do checkout
        const carrinhoSalvo = sessionStorage.getItem("carrinho_checkout");
        
        if (!carrinhoSalvo) {
          // Se não houver nada no cache, o pedido já pode ter sido enviado em um refresh de página
          setStatusEnvio("concluido");
          return;
        }

        const itensCarrinho = JSON.parse(carrinhoSalvo);

        if (itensCarrinho.length === 0) {
          setStatusEnvio("concluido");
          return;
        }

        // 2. Pega a sessão do usuário logado
        const { data: { session } } = await supabase.auth.getSession();
        const clienteEmail = session?.user?.email || "Cliente Anônimo";

        // 3. Monta a string dos itens descritos
        const descricaoItens = itensCarrinho
          .map((item: any) => `${item.quantidade}x ${item.nome}`)
          .join(", ");

        // 4. Calcula o total final
        const totalPedido = itensCarrinho.reduce((acc: number, item: any) => acc + item.preco * item.quantidade, 0);

        // 5. Insere diretamente na tabela do Supabase
        const { error } = await supabase.from("pedidos").insert([
          {
            cliente: clienteEmail,
            itens: descricaoItens,
            total: totalPedido,
            status: "Pendente", 
            criado_em: new Date().toISOString(),
          },
        ]);

        if (error) throw error;

        // Limpa o carrinho global e o cache temporário para evitar duplicar em f5
        limparCarrinho();
        sessionStorage.removeItem("carrinho_checkout");
        
        setStatusEnvio("concluido");
      } catch (err) {
        console.error("Erro ao enviar pedido para o admin:", err);
        setStatusEnvio("erro");
      }
    }

    registrarPedidoNoBanco();
  }, [limparCarrinho]);

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center bg-pink-50 p-6 text-center">
      <div className="bg-white p-8 rounded-2xl shadow-md max-w-md w-full border border-pink-100">
        {statusEnvio === "processando" && (
          <>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Processando Pedido...</h1>
            <p className="text-gray-500">Estamos confirmando os detalhes e enviando para a cozinha da Vih! 👩‍🍳</p>
          </>
        )}

        {statusEnvio === "concluido" && (
          <>
            <span className="text-5xl">🎉</span>
            <h1 className="text-3xl font-bold text-pink-600 mt-4 mb-2">Pedido Confirmado!</h1>
            <p className="text-gray-600 mb-6">
              Obrigado pela compra! Seu pedido já está visível no painel de produção da nossa equipe.
            </p>
            <Link 
              href="/" 
              className="bg-pink-400 hover:bg-pink-500 text-white font-semibold py-3 px-6 rounded-xl transition-colors inline-block"
            >
              Voltar para a Loja
            </Link>
          </>
        )}

        {statusEnvio === "erro" && (
          <>
            <span className="text-5xl">⚠️</span>
            <h1 className="text-2xl font-bold text-red-500 mt-4 mb-2">Quase lá!</h1>
            <p className="text-gray-600 mb-6">
              Seu pagamento foi processado, mas houve uma oscilação ao atualizar o painel.
            </p>
            <Link href="/" className="text-pink-500 underline font-medium">
              Voltar ao início
            </Link>
          </>
        )}
      </div>
    </div>
  );
}