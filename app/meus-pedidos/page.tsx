"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase"; // Ajuste o caminho se necessário
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Pedido {
  id: number;
  created_at: string;
  descricao_bolo: string;
  total: number;
  status: string;
}

export default function MeusPedidos() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [carregando, setCarregando] = useState(true);
  const router = useRouter();

  useEffect(() => {
    let canalRealtime: any;

    async function iniciarSessaoEBuscarPedidos() {
      try {
        // 1. Verifica se o usuário está logado
        const { data: { session } } = await supabase.auth.getSession();

        if (!session) {
          router.push("/login");
          return;
        }

        const emailUsuario = session.user.email;

        // 2. Busca a lista inicial de pedidos do cliente
        const { data, error } = await supabase
          .from("pedidos")
          .select("id, created_at, descricao_bolo, total, status")
          .eq("nome_cliente", emailUsuario)
          .order("created_at", { ascending: false });

        if (error) throw error;
        setPedidos(data || []);
        setCarregando(false);

        // 3. ⚡ ATIVA O REALTIME: Escuta alterações apenas nos pedidos deste cliente
        canalRealtime = supabase
          .channel("mudancas_pedidos_cliente")
          .on(
            "postgres_changes",
            {
              event: "UPDATE", // Escuta quando o admin atualiza um pedido
              schema: "public",
              table: "pedidos",
              filter: `nome_cliente=eq.${emailUsuario}`, // Apenas atualizações do próprio cliente
            },
            (payload) => {
              console.log("Pedido atualizado em tempo real:", payload.new);
              
              // Atualiza o estado instantaneamente na tela
              setPedidos((pedidosAtuais) =>
                pedidosAtuais.map((pedido) =>
                  pedido.id === payload.new.id
                    ? { ...pedido, status: payload.new.status }
                    : pedido
                )
              );
            }
          )
          .subscribe();

      } catch (err) {
        console.error("Erro no fluxo de pedidos:", err);
        setCarregando(false);
      }
    }

    iniciarSessaoEBuscarPedidos();

    // Limpa a conexão com o Realtime quando o cliente sai da página
    return () => {
      if (canalRealtime) {
        supabase.removeChannel(canalRealtime);
      }
    };
  }, [router]);

  // Função auxiliar para mudar a cor da etiqueta de status
  const obtenerCorStatus = (status: string) => {
    switch (status?.toLowerCase()) {
      case "pendente":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "em produção":
      case "preparando":
      case "em preparo":
        return "bg-blue-100 text-blue-800 border-blue-200 animate-pulse"; // Adicionado um pulsar suave para o preparo!
      case "entregue":
      case "concluído":
      case "concluido":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  if (carregando) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-pink-50">
        <p className="text-pink-600 font-semibold animate-pulse text-lg">Carregando seus pedidos... 🍰</p>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-pink-50 pt-24 pb-12 px-4 md:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-pink-100 p-6 md:p-8">
        
        <div className="flex flex-col sm:flex-row justify-between items-center border-b border-gray-100 pb-4 mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Meus Pedidos</h1>
            <p className="text-sm text-gray-500">Acompanhe o andamento das suas delícias em tempo real ⚡</p>
          </div>
          <Link 
            href="/" 
            className="text-xs bg-pink-400 hover:bg-pink-500 text-white font-bold py-2 px-4 rounded-lg transition-colors"
          >
            Voltar para a Loja
          </Link>
        </div>

        {pedidos.length === 0 ? (
          <div className="text-center py-12">
            <span className="text-4xl">🧁</span>
            <p className="text-gray-500 mt-4 font-medium">Você ainda não fez nenhum pedido.</p>
            <Link href="/" className="text-pink-500 underline text-sm mt-2 inline-block">
              Que tal escolher seu primeiro bolo agora?
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {pedidos.map((pedido) => (
              <div 
                key={pedido.id} 
                className="border border-pink-100 rounded-xl p-4 bg-pink-50/30 hover:shadow-sm transition-shadow flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
              >
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="font-bold text-gray-700 text-sm">Pedido #{pedido.id}</span>
                    <span className="text-xs text-gray-400">
                      {new Date(pedido.created_at).toLocaleDateString("pt-BR", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit"
                      })}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 font-medium">
                    {pedido.descricao_bolo}
                  </p>
                </div>

                <div className="flex sm:flex-col justify-between sm:justify-center items-center sm:items-end w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-dashed border-pink-200 gap-2">
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${obtenerCorStatus(pedido.status)}`}>
                    {pedido.status}
                  </span>
                  <span className="font-extrabold text-pink-600 text-base">
                    R$ {Number(pedido.total).toFixed(2)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}