"use client";

import Image from "next/image";
import FotoPerfil from "../../public/globe.svg";
import { useUI } from "../providers/UIProvider";

export default function Cabecario() {
  const { carrinhoAberto, setCarrinhoAberto } = useUI();

  return (
    <header className="w-full flex items-center sticky top-0 z-50 justify-between bg-pink-500 text-white p-4 shadow">
      
      <div className="ml-6">
        <Image 
          src={FotoPerfil} 
          alt="foto de perfil" 
          width={50} 
          height={50} 
        />
      </div>

      <div className="mr-8 w-3/7 text-2xl font-bold">
        <h1>Cantinho da Vih</h1>
      </div>

      <div>
        <button
          className="bg-white cursor-pointer text-pink-500 py-1 px-2 rounded-md hover:bg-gray-200"
          onClick={() => setCarrinhoAberto(!carrinhoAberto)}
        >
          carrinho
        </button>
      </div>

    </header>
  );
}