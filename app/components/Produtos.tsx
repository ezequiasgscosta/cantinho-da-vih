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
  categorias?: {
    id: number;
    nome: string}
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
          categorias(
          id,
          nome
          )
          `);

      if (error) {
        console.error("Erro ao conectar:", error.message);
      } else {
        setBolos(data || []);
        console.log("Conectado com sucesso:", data);
      }
    }

    async function buscarCategorias() {
      const { data, error } = await supabase
        .from("categorias")
        .select("*");

      if (error) {
        console.error("Erro ao buscar categorias:", error.message);
      } else {
        setCategorias(data || []);
        console.log("Categorias carregadas: hehehehe", data);
      }
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
              <p>{bolo.categorias?.nome}</p>
            </div>

            <Image
              src={ImageIlustrativa}
              alt={bolo.nome}
              width={100}
              height={100}
            />
          </div>
        ))}
      </div>
    </div>
  );
}