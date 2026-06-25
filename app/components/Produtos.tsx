"use client";

import Image from "next/image";
import ImageIlustrativa from "@/public/window.svg";
import { supabase } from "../../lib/supabase";
import { useEffect, useState } from "react";
import { useCarrinho } from "../store/useCarrinho";

interface Categoria {
  id: number;
  nome: string;
}

interface Bolo {
  id: number;
  nome: string;
  preco: number;
  descricao: string;
  categoria_id?: number;
  categorias?: Categoria[];
}

export default function Produtos() {
  const [bolos, setBolos] = useState<Bolo[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);

  const adicionarAoCarrinho = useCarrinho(
    (state) => state.adicionarAoCarrinho
  );

  useEffect(() => {
    async function buscarProdutos() {
      const { data, error } = await supabase
        .from("bolo")
        .select(
          `
          id,
          nome,
          preco,
          descricao,
          categoria_id,
          categorias (
            id,
            nome
          )
        `
        )
        .order("categoria_id", { ascending: true });

      if (error) {
        console.error("Erro ao conectar:", error.message);
        return;
      }

      setBolos((data || []) as Bolo[]);
    }

    async function buscarCategorias() {
      const { data, error } = await supabase
        .from("categorias")
        .select("*");

      if (error) {
        console.error("Erro ao buscar categorias:", error.message);
        return;
      }

      setCategorias(data || []);
    }

    buscarProdutos();
    buscarCategorias();
  }, []);

  const bolosAgrupados = bolos.reduce((acc: any, bolo) => {
    if (!acc[bolo.categoria_id!]) {
      acc[bolo.categoria_id!] = [];
    }
    acc[bolo.categoria_id!].push(bolo);
    return acc;
  }, {});

  return (
    /* 🌟 Adicionada a classe 'scroll-smooth' aqui para o Next.js rolar suavemente */
    <div className="w-full min-h-screen p-4 scroll-smooth">

      <div className="grid gap-6">
        {Object.entries(bolosAgrupados).map(
          ([categoriaId, bolosDaCategoria]) => {
            const nomeCategoria =
              categorias.find((c) => c.id === Number(categoriaId))
                ?.nome || "Categoria";

            return (
              /* 🌟 O id agora recebe o nome exato da categoria (ex: id="Bolo")
                🌟 'scroll-mt-6' evita que o título fique colado no topo ao rolar
              */
              <div 
                key={categoriaId} 
                id={nomeCategoria} 
                className="mb-6 scroll-mt-6"
              >
                {/* TÍTULO DA CATEGORIA */}
                <h2 className="text-2xl text-pink-900  font-bold ml-5 ">
                  {nomeCategoria}
                </h2>

                {/* BOLOS DA CATEGORIA */}
                <div className="grid gap-4">
                  {(bolosDaCategoria as Bolo[]).map((bolo) => (
                    <div
                      key={bolo.id}
                      className="border border-black/10 rounded-lg p-4 flex items-center justify-between"
                    >
                      <div>
                        <h3 className="font-bold text-xl">
                          {bolo.nome}
                        </h3>

                        <p>{bolo.descricao}</p>

                        <p className="text-lg font-medium">
                          Preço: R$ {bolo.preco}
                        </p>

                        <button
                          className="bg-pink-400 hover:bg-pink-500 text-white py-2 px-4 rounded-md cursor-pointer mt-4"
                          onClick={() => adicionarAoCarrinho(bolo)}
                        >
                          Adicionar
                        </button>
                      </div>

                      <Image
                        src={ImageIlustrativa}
                        alt={bolo.nome}
                        width={100}
                        height={100}
                        loading="eager"
                      />
                    </div>
                  ))}
                </div>
              </div>
            );
          }
        )}
      </div>
    </div>
  );
}