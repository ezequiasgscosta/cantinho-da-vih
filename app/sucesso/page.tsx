import Link from "next/link";

export default function Sucesso() {
  return (
    // overflow-hidden impede qualquer rolagem na página
    <div className="flex flex-col items-center justify-center h-screen w-screen bg-pink-50 px-4 text-center overflow-hidden fixed inset-0">
      
      {/* Ícone ou Emoji de celebração */}
      <div className="text-6xl mb-4 animate-bounce">🍰</div>
      
      {/* Mensagem de Sucesso */}
      <h1 className="text-3xl font-bold text-pink-600 mb-2">
        Pedido Confirmado! 🎉
      </h1>
      <p className="text-gray-600 mb-8 max-w-md">
        Obrigado por comprar no Cantinho da Vih! Seu pedido já foi recebido e estamos preparando tudo com muito carinho.
      </p>

      {/* Botão para voltar */}
      <Link 
        href="/" 
        className="bg-pink-500 hover:bg-pink-600 text-white font-bold py-3 px-6 rounded-md shadow-md transition-all hover:scale-105"
      >
        Voltar para a Página Inicial
      </Link>

    </div>
  );
}