"use client";

import Image from "next/image";
import ImageIlustrativa from "@/public/window.svg";
import { supabase } from "../../lib/supabase";
import { useEffect, useState } from "react";

interface Categoria {
  id: number;
  nome: string;
}

interface Bolo {
  id: number;
  nome: string;
  preco: number;
  descricao: string;
  categorias?: Categoria[];
}

export default function Produtos() {
  const [bolos, setBolos] = useState<Bolo[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);

  useEffect(() => {
    async function buscarProdutos() {
      const { data, error } = await supabase
        .from("bolo")
        .select(`
          id,
          nome,
          preco,
          descricao,
          categorias (
            id,
            nome
          )
        `);

      if (error) {
        console.error("Erro ao conectar:", error.message);
        return;
      }

      setBolos((data || []) as Bolo[]);
      console.log("Bolos carregados:", data);
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
      console.log("Categorias carregadas:", data);
    }

    buscarProdutos();
    buscarCategorias();
  }, []);

  return (
    <div className="w-full min-h-screen border p-4">
      <h1 className="text-3xl font-bold mb-6">Bolos</h1>

      <div className="grid gap-4">
        {bolos.map((bolo) => (
          <div
            key={bolo.id}
            className="border border-black/10 rounded-lg p-4 flex items-center justify-between"
          >
            <div>
              <h2 className="font-bold text-xl">{bolo.nome}</h2>

              <p>{bolo.descricao}</p>

              <p className="text-lg font-medium">
                Preço: R$ {bolo.preco}
              </p>

              <div className="flex gap-2 mt-2">
                {Array.isArray(bolo.categorias) &&
                  bolo.categorias.map((cat) => (
                    <span
                      key={cat.id}
                      className="bg-blue-500 text-white px-2 py-1 rounded-md text-sm"
                    >
                      {cat.nome}
                    </span>
                  ))}
              </div>
              <button className="bg-pink-400 hover:bg-pink-500 text-white py-2 px-4 rounded-md cursor-pointer mt-4">
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