"use client";

import { useUI } from "../providers/UIProvider";

export default function Carrinho() {
  const { carrinhoAberto, setCarrinhoAberto } = useUI();

  if (!carrinhoAberto) return null;

  return (
    <div className="fixed right-0 top-0 h-full w-80 bg-blue-400 flex items-center justify-center">
      <h1 className="text-4xl font-bold">Carrinho</h1>

    </div>
  );
}