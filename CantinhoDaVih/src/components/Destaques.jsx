import { useEffect, useState } from "react";
import { supabase } from "../supabase";

function Destaques() {
    const [produtos, setProdutos] = useState([]);

    useEffect(() => {
        // Declarar a função assíncrona aqui dentro isola o efeito colateral
        async function carregarProdutos() {
            const { data, error } = await supabase
                .from("produtos")
                .select("*");

            if (error) {
                console.error("Erro ao buscar produtos:", error);
                return;
            }

            setProdutos(data);
        }

        carregarProdutos();
    }, []); // Array de dependências vazio significa que roda apenas uma vez ao montar

    return (
        <div id="produtos" className="w-full">
            <h1 className="w-full p-1">Destaques</h1>

            <div
                id="produto"
                className="flex gap-2 overflow-x-auto border-b pb-2"
            >
                {produtos.map((produto) => (
                    <div
                        key={produto.id}
                        className="text-center m-1"
                    >
                        <img
                            className="w-30 rounded-xl"
                            src={produto.image}
                            alt={produto.nome}
                        />

                        <h2>{produto.nome}</h2>

                        <p>R$ {produto.preco}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Destaques;