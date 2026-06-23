import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ItemCarrinho {
  id: number;
  nome: string;
  preco: number;
  descricao: string;
  quantidade: number;
}

interface CarrinhoState {
  carrinho: ItemCarrinho[];
  adicionarAoCarrinho: (bolo: Omit<ItemCarrinho, "quantidade">) => void;
  removerDoCarrinho: (id: number) => void;
}

export const useCarrinho = create<CarrinhoState>()(
  persist(
    (set) => ({
      carrinho: [],

      adicionarAoCarrinho: (bolo) =>
        set((state) => {
          // Verifica se o bolo já está no carrinho pelo ID
          const boloJaExiste = state.carrinho.find((item) => item.id === bolo.id);

          if (boloJaExiste) {
            const carrinhoAtualizado = state.carrinho.map((item) =>
              item.id === bolo.id
                ? { ...item, quantidade: item.quantidade + 1 }
                : item
            );
            return { carrinho: carrinhoAtualizado };
          }

          return {
            carrinho: [...state.carrinho, { ...bolo, quantidade: 1 }],
          };
        }),

      removerDoCarrinho: (id) =>
        set((state) => ({
          carrinho: state.carrinho.filter((item) => item.id !== id),
        })),
    }),
    {
      name: "carrinho-bolos-storage", // Salva no LocalStorage do aparelho do usuário
    }
  )
);