"use client";

import Image from "next/image";
import Link from "next/link";
import FotoPerfil from "../../public/globe.svg";
import { useUI } from "../providers/UIProvider";

export default function Cabecario() {
  const { carrinhoAberto, setCarrinhoAberto } = useUI();

  return (
    <header className="w-full flex items-center sticky top-0 z-50 justify-between bg-pink-500 text-white px-4 md:px-6 py-2 shadow
                      md:h-20">
      
      {/* LADO ESQUERDO: Foto de Perfil */}
      <div className="flex-shrink-0">
        <Image 
          src={FotoPerfil} 
          alt="foto de perfil" 
          width={45} 
          height={45} 
          className="md:w-[50px] md:h-[50px]" // Um pouquinho menor no mobile, tamanho normal no PC
        />
      </div>

      {/* CENTRO: Título da Loja (Centralizado e responsivo) */}
      <div className="text-center px-2 flex-1">
        <h1 className="text-lg sm:text-xl md:text-2xl font-bold tracking-wide line-clamp-1">
          Cantinho da Vih
        </h1>
      </div>

      {/* LADO DIREITO: Botão do Carrinho */}
      <div className="flex-shrink-0">
        <button
          className="bg-white cursor-pointer text-pink-500 font-semibold py-1.5 px-3 rounded-lg text-xs sm:text-sm hover:bg-pink-50 active:scale-95 transition-all shadow-sm"
          onClick={() => setCarrinhoAberto(!carrinhoAberto)}
        >
          🛒 Carrinho
        </button>
      </div>

    </header>
  );
}