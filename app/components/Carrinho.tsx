"use client";

import { useUI } from "../providers/UIProvider";
import { useCarrinho } from "../store/useCarrinho"; // Ajuste o caminho se necessário!

export default function Carrinho() {
  const { carrinhoAberto } = useUI();
  
  const carrinho = useCarrinho((state) => state.carrinho);
  const removerDoCarrinho = useCarrinho((state) => state.removerDoCarrinho);

  // Calcula o valor total usando as propriedades de cada bolo
  const valorTotal = carrinho.reduce((acc, bolo) => {
    return acc + bolo.preco * bolo.quantidade;
  }, 0);

  if (!carrinhoAberto) return null;

  return (
    <div className="fixed right-0 top-0 h-full w-80 bg-pink-50 mt-20 flex flex-col p-4 shadow-xl z-50 justify-between">
      
      {/* Topo: Título e Lista embrulhados juntos */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <h1 className="text-2xl font-bold mt-5 mb-4 text-center">Carrinho</h1>
        
        {/* Lista de Bolos com rolagem interna bem definida */}
        <div className="w-full flex-1 overflow-y-auto pr-1 max-h-[calc(100vh-280px)]">
          {carrinho.length === 0 ? (
            <p className="text-center text-gray-500 mt-10">Seu carrinho está sem bolos 😢</p>
          ) : (
            carrinho.map((bolo) => (
              <div 
                key={bolo.id} 
                className="flex justify-between items-center p-2 border-b border-pink-200 w-full mb-2 bg-white rounded shadow-sm"
              >
                <img 
                  src={"img" in bolo ? (bolo.img as string) : "/window.svg"} 
                  alt={bolo.nome} 
                  className="w-12 h-12 object-cover rounded flex-shrink-0" 
                />
                
                <div className="flex-1 ml-3 min-w-0">
                  <p className="font-semibold text-sm truncate">{bolo.nome}</p>
                  <p className="text-xs text-gray-600">Qtd: {bolo.quantidade}</p>
                </div>
                
                <div className="flex flex-col items-end gap-1 flex-shrink-0">
                  <p className="font-bold text-sm text-pink-600">
                    R$ {(bolo.preco * bolo.quantidade).toFixed(2)}
                  </p>
                  
                  <button
                    onClick={() => removerDoCarrinho(bolo.id)}
                    className="text-xs text-red-500 hover:text-red-700 font-medium underline cursor-pointer"
                  >
                    Remover
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Rodapé: Total e Finalizar travados embaixo (Sempre visíveis) */}
      <div className="w-full border-t border-pink-200 pt-4 mt-auto bg-pink-50 pb-24">
        <div className="flex justify-between items-center mb-4 font-bold text-lg text-gray-800">
          <span>Total:</span>
          <span className="text-pink-600">R$ {valorTotal.toFixed(2)}</span>
        </div>
        
        <button 
          className="w-full bg-pink-500 hover:bg-pink-600 text-white font-bold py-3 px-4 rounded-md shadow transition-colors text-center cursor-pointer block z-50 relative"
          onClick={() => alert("Pedido de bolos finalizado! 🍰🎉")}
        >
          Finalizar Pedido
        </button>
      </div>

    </div>
  );
}