import Image from "next/image";
import Atalhos from "./components/Atalhos"
import Produtos from "./components/Produtos";
export default function Home() {
  return (
    <div>
      <Atalhos/>

      <h1>teste de texto</h1>
      <Produtos/>
    </div>
  );
}
