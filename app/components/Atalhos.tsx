"use client";

export default function Atalhos() {
  const itensMenu = [
    { nome: "Bolo", idAlvo: "Bolo" },
    { nome: "Salgados", idAlvo: "salgados" },
    { nome: "Garrafas", idAlvo: "garrafa" },
    { nome: "Marmitas", idAlvo: "comida" },
    { nome: "Bebidas", idAlvo: "bebidas" }, // ajuste para bater exato com o nome no banco
  ];

  // A mesma função certeira que funcionou no código único!
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
    <div className="w-full  fixed top-12  ">
      <nav className="max-w-5xl mx-auto flex items-center gap-1 px-4 py-1 overflow-x-auto whitespace-nowrap scrollbar-none md:justify-center">
        {itensMenu.map((item, index) => (
          <button
            key={index}
            onClick={() => rolarParaCategoria(item.idAlvo)}
            className="inline-block  hover: text-pink-200 hover:text-pink-600 font-semibold px-4 py-2  text-sm  hover: transition-all duration-200 active:scale-95 cursor-pointer"
          >
            {item.nome}
          </button>
        ))}
      </nav>
    </div>
  );
}