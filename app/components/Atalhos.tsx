"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase"; // Ajuste o caminho se necessário

export default function Navbar() {
  const [usuarioLogado, setUsuarioLogado] = useState(false);

  useEffect(() => {
    // Verifica se o usuário está logado para exibir o link de pedidos
    async function checarUsuario() {
      const { data: { session } } = await supabase.auth.getSession();
      setUsuarioLogado(!!session);
    }
    checarUsuario();

    // Escuta mudanças na autenticação (login/logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUsuarioLogado(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const itensMenu = [
    { nome: "Bolo", idAlvo: "Bolo" },
    { nome: "Salgados", idAlvo: "salgados" },
    { nome: "Garrafas", idAlvo: "garrafa" },
    { nome: "Marmitas", idAlvo: "comida" },
    { nome: "Bebidas", idAlvo: "bebidas" },
  ];

  const rolarParaCategoria = (id: string) => {
    const elemento = document.getElementById(id);
    if (elemento) {
      elemento.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      const elementoMinusculo = document.getElementById(id.toLowerCase());
      if (elementoMinusculo) {
        elementoMinusculo.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  return (
    <div className="w-full fixed top-14 left-0 bg-white shadow-sm border-b border-pink-100 z-50 px-4 py-2
                    md:top-20">
      <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
        
  

        {/* NAVEGAÇÃO DE CATEGORIAS (SCROLL) */}
        <nav className="flex items-center gap-1 overflow-x-auto whitespace-nowrap scrollbar-none flex-1 justify-start md:justify-center">
          {itensMenu.map((item, index) => (
            <button
              key={index}
              onClick={() => rolarParaCategoria(item.idAlvo)}
              className="inline-block text-gray-500 hover:text-pink-600 font-semibold px-3 py-1.5 text-sm transition-all duration-200 active:scale-95 cursor-pointer"
            >
              {item.nome}
            </button>
          ))}
        </nav>

        {/* BOTÃO DOS MEUS PEDIDOS / LOGIN */}
        <div className="flex-shrink-0">
          {usuarioLogado ? (
            <Link
              href="/meus-pedidos"
              className="text-xs bg-pink-500 hover:bg-pink-600 text-white font-bold py-2 px-3 rounded-lg transition-colors flex items-center gap-1 shadow-sm"
            >
              <span>📋</span> Meus Pedidos
            </Link>
          ) : (
            <Link
              href="/login"
              className="text-xs border border-pink-400 text-pink-500 hover:bg-pink-50 font-bold py-2 px-3 rounded-lg transition-colors"
            >
              Entrar
            </Link>
          )}
        </div>

      </div>
    </div>
  );
}