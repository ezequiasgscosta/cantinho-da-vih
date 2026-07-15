"use client";

import { useState } from "react";
import { useUI } from "../providers/UIProvider";
import { useCarrinho } from "../store/useCarrinho";
import { supabase } from "../../lib/supabase"; 
import { useRouter } from "next/navigation"; 

export default function Carrinho() {
  const { carrinhoAberto } = useUI();
  const carrinho = useCarrinho((state) => state.carrinho);
  const removerDoCarrinho = useCarrinho((state) => state.removerDoCarrinho);
  
  const [carregando, setCarregando] = useState(false);
  const router = useRouter(); 

  // ESTADOS PARA O SISTEMA DE CUPONS
  const [cupomTexto, setCupomTexto] = useState("");
  const [descontoPorcentagem, setDescontoPorcentagem] = useState(0);
  const [cupomAplicado, setCupomAplicado] = useState("");
  const [erroCupom, setErroCupom] = useState("");

  // CÁLCULO DE VALORES
  const subtotal = carrinho.reduce((acc, bolo) => acc + bolo.preco * bolo.quantidade, 0);
  const valorDesconto = subtotal * (descontoPorcentagem / 100);
  const valorTotal = subtotal - valorDesconto;

  // FUNÇÃO PARA VALIDAR E APLICAR O CUPOM DO ADMIN
  const handleAplicarCupom = async () => {
    if (!cupomTexto.trim()) return;
    setErroCupom("");

    try {
      const { data, error } = await supabase
        .from("cupons")
        .select("*")
        .eq("codigo", cupomTexto.trim().toUpperCase())
        .eq("ativo", true)
        .single();

      if (error || !data) {
        setErroCupom("Cupom inválido ou expirado! 🏷️");
        setDescontoPorcentagem(0);
        setCupomAplicado("");
        return;
      }

      setDescontoPorcentagem(data.desconto_porcentagem);
      setCupomAplicado(data.codigo);
    } catch (err) {
      console.error(err);
      setErroCupom("Erro ao validar cupom.");
    }
  };

  const handleFinalizarPedido = async () => {
    if (carrinho.length === 0) return;
    
    setCarregando(true);
    
    try {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        alert("Para concluir o seu pedido, por favor faça login ou crie uma conta.");
        router.push("/login");
        setCarregando(false);
        return;
      }

      // 🌟 SALVA O CARRINHO NO CACHE DE SEGURANÇA ANTES DO REDIRECIONAMENTO DO STRIPE
      sessionStorage.setItem("carrinho_checkout", JSON.stringify(carrinho));

      // Passa apenas as informações essenciais (o ID e a Quantidade serão validados pelo banco na API)
      const response = await fetch("./api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          itens: carrinho.map(item => ({ id: item.id, quantidade: item.quantidade })),
          cupom: cupomAplicado || null
        }),
      });

      const dados = await response.json();

      if (dados.url) {
        window.location.href = dados.url;
      } else {
        alert("Erro ao iniciar o pagamento. Tente novamente.");
      }
    } catch (error) {
      console.error(error);
      alert("Houve um erro na conexão.");
    } finally {
      setCarregando(false);
    }
  };

  if (!carrinhoAberto) return null;

  return (
    /* ADAPTAÇÃO DE LARGURA: 
      - Celular: w-80 (320px)
      - Tablet/Notebook (md): w-[380px]
      - Telas Grandes (lg/2xl): w-[420px] 
    */
    <div className="fixed right-0 top-0 h-full w-80 md:w-[380px] lg:w-[420px] bg-pink-50 mt-20 flex flex-col p-4 md:p-6 lg:p-8 shadow-xl z-50 justify-between transition-all">
      
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Título aumenta em telas maiores */}
        <h1 className="text-2xl lg:text-3xl font-bold mt-5 mb-4 text-center text-gray-800">
          Carrinho
        </h1>
        
        {/* LISTAGEM DE ITENS */}
        <div className="w-full flex-1 overflow-y-auto pr-1 max-h-[calc(100vh-360px)] md:max-h-[calc(100vh-400px)]">
          {carrinho.length === 0 ? (
            <p className="text-center text-gray-500 mt-10 md:text-base">Seu carrinho está sem bolos 😢</p>
          ) : (
            carrinho.map((bolo) => (
              <div 
                key={bolo.id} 
                className="flex justify-between items-center p-2 md:p-3 border-b border-pink-200 w-full mb-2 bg-white rounded-lg shadow-sm"
              >
                {/* Imagem aumenta um pouco em telas maiores */}
                <img 
                  src={(bolo as any).imagem_url || (bolo as any).img || "/window.svg"}  
                  alt={bolo.nome} 
                  className="w-12 h-12 md:w-14 md:h-14 object-cover rounded flex-shrink-0 border border-gray-100" 
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/window.svg";
                  }}
                />
                
                <div className="flex-1 ml-3 min-w-0">
                  {/* Título do produto se ajusta para md:text-base */}
                  <p className="font-semibold text-sm md:text-base truncate text-gray-800">{bolo.nome}</p>
                  <p className="text-xs md:text-sm text-gray-500">Qtd: {bolo.quantidade}</p>
                </div>
                
                <div className="flex flex-col items-end gap-1 flex-shrink-0">
                  {/* Valor do item se ajusta para md:text-base */}
                  <p className="font-bold text-sm md:text-base text-pink-600">
                    R$ {(bolo.preco * bolo.quantidade).toFixed(2)}
                  </p>
                  <button
                    onClick={() => removerDoCarrinho(bolo.id)}
                    className="text-xs md:text-sm text-red-500 hover:text-red-700 font-medium underline cursor-pointer"
                  >
                    Remover
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* FOOTER DO CARRINHO COM CUPOM E TOTAIS */}
      <div className="w-full border-t border-pink-200 pt-3 mt-auto bg-pink-50 pb-24 md:pb-28">
        
        {/* BLOCO DE CUPOM DE DESCONTO */}
        {carrinho.length > 0 && (
          <div className="mb-4">
            <div className="flex gap-2">
              <input 
                type="text" 
                placeholder="CUPOM"
                value={cupomTexto}
                onChange={(e) => setCupomTexto(e.target.value)}
                className="flex-1 bg-white border border-pink-200 rounded px-3 py-1.5 text-xs md:text-sm font-semibold focus:outline-none focus:border-pink-400 uppercase text-gray-700 shadow-sm"
              />
              <button 
                onClick={handleAplicarCupom}
                className="bg-pink-400 hover:bg-pink-500 text-white font-bold px-3 py-1.5 rounded text-xs md:text-sm transition-colors cursor-pointer active:scale-95 duration-100"
              >
                Aplicar
              </button>
            </div>
            {erroCupom && <p className="text-[11px] md:text-xs text-red-500 mt-1 font-medium">{erroCupom}</p>}
            {cupomAplicado && (
              <p className="text-[11px] md:text-xs text-green-600 mt-1 font-bold">
                ✓ Cupom {cupomAplicado} aplicado ({descontoPorcentagem}% OFF)
              </p>
            )}
          </div>
        )}

        {/* RESUMO FINANCEIRO */}
        <div className="space-y-1.5 mb-4 text-sm md:text-base text-gray-600">
          {descontoPorcentagem > 0 && (
            <>
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>R$ {subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-green-600 font-medium">
                <span>Desconto:</span>
                <span>- R$ {valorDesconto.toFixed(2)}</span>
              </div>
            </>
          )}
          <div className="flex justify-between items-center font-bold text-lg lg:text-xl text-gray-800 pt-1">
            <span>Total:</span>
            <span className="text-pink-600">R$ {valorTotal.toFixed(2)}</span>
          </div>
        </div>
        
        {/* Botão de Finalizar com os efeitos de clique e hover ajustados */}
        <button 
          className="w-full bg-pink-500 hover:bg-pink-600 disabled:bg-gray-400 text-white font-bold py-3 px-4 rounded-md shadow transition-all duration-150 active:scale-[0.98] text-center cursor-pointer block z-50 relative text-sm md:text-base"
          onClick={handleFinalizarPedido}
          disabled={carregando || carrinho.length === 0}
        >
          {carregando ? "Processando..." : "Finalizar Pedido"}
        </button>
      </div>

    </div>
  );
}