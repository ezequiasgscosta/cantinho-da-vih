"use client";

import Image from "next/image";
import ImageIlustrativa from "@/public/window.svg";
import { supabase } from "../../lib/supabase";
import { useEffect, useState } from "react";
import { useCarrinho } from "../store/useCarrinho";

interface Bolo {
  id: number;
  nome: string;
  preco: number;
  descricao: string;
  categoria: string; // Adaptado para receber a string da categoria vinda do Admin
  imagem_url?: string; // Coluna adicionada para exibir as fotos cadastradas
}

export default function Produtos() {
  const [bolos, setBolos] = useState<Bolo[]>([]);

  const adicionarAoCarrinho = useCarrinho(
    (state) => state.adicionarAoCarrinho
  );

  useEffect(() => {
    async function buscarProdutos() {
      // Puxa os dados diretamente da tabela 'produtos' unificada
      const { data, error } = await supabase
        .from("produtos") 
        .select("id, nome, preco, descricao, categoria, imagem_url")
        .order("categoria", { ascending: true });

      if (error) {
        console.error("Erro ao conectar:", error.message);
        return;
      }

      setBolos((data || []) as Bolo[]);
    }

    buscarProdutos();
  }, []);

  // Agrupa os bolos usando diretamente a string do nome da categoria
  const bolosAgrupados = bolos.reduce((acc: any, bolo) => {
    const catNome = bolo.categoria || "Geral";
    if (!acc[catNome]) {
      acc[catNome] = [];
    }
    acc[catNome].push(bolo);
    return acc;
  }, {});

  return (
    <div className="w-full min-h-screen p-4 scroll-smooth">
      <div className="grid gap-6">
        {Object.entries(bolosAgrupados).map(([nomeCategoria, bolosDaCategoria]) => {
          return (
            <div 
              key={nomeCategoria} 
              id={nomeCategoria} 
              className="mb-6 scroll-mt-6"
            >
              {/* TÍTULO DA CATEGORIA (DINÂMICO) */}
              <h2 className="text-2xl text-pink-900 font-bold ml-5 mb-4">
                {nomeCategoria}
              </h2> 

              {/* BOLOS DA CATEGORIA */}
              <div className="grid gap-4">
                {(bolosDaCategoria as Bolo[]).map((bolo) => (
                  <div
                    key={bolo.id}
                    className="bg-white border border-black/10 rounded-xl p-4 flex items-center justify-between gap-4 shadow-sm"
                  >
                    <div className="flex-1">
                      <h3 className="font-bold text-xl text-gray-800">
                        {bolo.nome}
                      </h3>

                      <p className="text-sm text-gray-500 my-1">{bolo.descricao || "Sem descrição disponível."}</p>

                      <p className="text-lg font-bold text-pink-600 mt-2">
                        R$ {Number(bolo.preco).toFixed(2)}
                      </p>

                      <button
                        className="bg-pink-400 hover:bg-pink-500 text-white font-semibold py-2 px-5 rounded-xl cursor-pointer mt-4 transition-colors text-xs"
                        onClick={() => adicionarAoCarrinho(bolo)}
                      >
                        Adicionar ao Carrinho 🛒
                      </button>
                    </div>

                    {/* IMAGEM DINÂMICA CADASTRADA NO ADMIN */}
                    <div className="w-24 h-24 relative flex-shrink-0">
                      <img
                        src={bolo.imagem_url || "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500"}
                        alt={bolo.nome}
                        className="w-full h-full object-cover rounded-xl border border-gray-100"
                        onError={(e) => {
                          // Caso o link da imagem quebre, substitui pela ilustrativa padrão
                          (e.target as HTMLImageElement).src = ImageIlustrativa;
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}