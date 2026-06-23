import Image from "next/image";
import Atalhos from "./components/Atalhos"
import Produtos from "./components/Produtos";
import Carrinho from "./components/Carrinho";
import { useState } from "react";
export default function Home() {
  const [onAbrirCarrinho, setonAbrirCarrinho] = useState(false)
  return (
    <div>
      
      <Atalhos/>

      
      <Produtos/>
    </div>
  );
}
