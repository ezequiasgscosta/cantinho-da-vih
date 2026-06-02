// Importamos os hooks do React: useEffect (para ações ao abrir a tela) e useState (para guardar dados)
import { useEffect, useState } from "react";
// Importamos a conexão do banco de dados que configuramos no arquivo supabase.js
import { supabase } from "../supabase";

export default function Categoria() {
    // Criamos um estado chamado 'bolos' (começa como uma lista vazia []) para guardar os bolos do banco
    const [bolos, setBolos] = useState([]);
    // Criamos um estado de 'carregando' (começa como true) para mostrar um aviso enquanto os dados não chegam
    const [carregando, setCarregando] = useState(true);

    // O useEffect roda automaticamente assim que o componente aparece na tela do usuário
    useEffect(() => {
        // Criamos uma função assíncrona porque a busca no banco de dados leva um tempinho para responder
        async function carregarBolos() {
            try {
                // Conectamos no Supabase, pegamos a tabela "Bolos" e selecionamos todas as colunas (*)
                const { data, error } = await supabase
                    .from("Bolos") 
                    .select("*");

                // Se o banco de dados responder com algum erro, joga o erro direto para o bloco 'catch' abaixo
                if (error) throw error;

                // Se os dados existirem e chegarem com sucesso, guardamos eles dentro do nosso estado 'bolos'
                if (data) {
                    setBolos(data);
                }
            } catch (error) {
                // Caso aconteça qualquer problema (como falta de internet), mostra o erro detalhado no console do F12
                console.error("Erro ao buscar bolos:", error);
            } finally {
                // Dando certo ou dando errado, o carregamento acabou, então mudamos o estado para false
                setCarregando(false);
            }
        }

        // Executamos a função que acabamos de criar aqui em cima
        carregarBolos();
    }, []); // Este array vazio [] garante que a busca só vai rodar uma única vez quando a tela abrir

    // Se o estado 'carregando' for verdadeiro, o React para aqui e mostra essa mensagem na tela
    if (carregando) {
        return <p className="text-center p-4 text-gray-500">Carregando cardápio...</p>;
    }

    // Quando o carregamento termina, o React renderiza o HTML (JSX) abaixo:
    return (
        // Container principal da categoria com fundo branco, bordas suaves e sombra leve
        <div className="w-full bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-4">
            
            {/* Bloco do título da categoria */}
            <div id="categoria" className="mb-4">
                {/* Título "Bolos" com uma barrinha decorativa laranja na lateral esquerda (border-l-4) */}
                <h1 className="text-2xl font-bold text-gray-800 border-l-4 border-amber-500 pl-2">
                    Bolos
                </h1>
            </div>

            {/* Caixa que vai agrupar a lista de bolos colocados um abaixo do outro (flex-col) */}
            <div className="flex flex-col gap-4">
                {/* Se a quantidade de bolos no banco for maior que zero, fazemos um mapeamento (loop) */}
                {bolos.length > 0 ? (
                    // O .map() percorre cada 'bolo' da lista e gera o HTML abaixo para cada um deles
                    bolos.map((bolo) => (
                        <div 
                            key={bolo.id} // O React exige uma chave única (id) para cada item de uma lista
                            id="produtos-por-categoria" 
                            // Layout em linha (flex), empurrando os textos para a esquerda e a foto para a direita (justify-between)
                            className="flex justify-between items-center bg-gray-50 p-3 rounded-xl hover:shadow-inner transition-all"
                        >
                            {/* Bloco da esquerda: Textos (Nome, Categoria e Preço) */}
                            <div id="descricao" className="flex flex-col gap-1 pr-2">
                                {/* Exibe o nome do bolo cadastrado no Supabase */}
                                <h2 className="font-semibold text-gray-900 text-base">
                                    {bolo.nome}
                                </h2>
                                
                                {/* Exibe a categoria como uma etiqueta (badge) arredondada e com fundo âmbar claro */}
                                <p className="text-xs text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full w-fit font-medium">
                                    {bolo.categoria || "Bolo Caseiro"} 
                                </p>
                                
                                {/* Pega o preço numérico do banco, força 2 casas decimais e troca o ponto por vírgula */}
                                <span className="text-gray-900 font-bold text-base mt-1">
                                    R$ {Number(bolo.preco).toFixed(2).replace('.', ',')}
                                </span>
                            </div>

                            {/* Bloco da direita: Foto do bolo */}
                            <div id="foto-produto" className="flex-shrink-0">
                                <img 
                                    // Pega o link da imagem do banco. Se estiver vazio, usa uma imagem cinza de teste
                                    src={bolo.image || "https://via.placeholder.com/80"} 
                                    alt={bolo.nome} // Texto alternativo de acessibilidade com o nome do bolo
                                    // Define tamanho fixo de 80x80px (w-20 h-20) e impede que a foto fique esticada (object-cover)
                                    className="w-20 h-20 object-cover rounded-xl shadow-sm"
                                />
                            </div>
                        </div>
                    ))
                ) : (
                    // Se a lista de bolos do banco estiver totalmente vazia, mostra esta mensagem secundária
                    <p className="text-sm text-gray-500 p-2">Nenhum bolo cadastrado no momento.</p>
                )}
            </div>
        </div>
    );
}