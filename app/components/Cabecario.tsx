import Image from "next/image";
import FotoPerfil from "../../public/globe.svg"; 

export default function Cabecario() {
  return (
    <header className="w-full  flex items-center sticky top-0 z-50 justify-between bg-pink-500 text-white p-4 shadow">
      <div className="ml-6">
        <Image 
          src={FotoPerfil} 
          alt="foto de perfil" 
          width={50} 
          height={50} 
        />
      </div>

      <div className="mr-8 w-5/7 text-2xl font-bold">
        <h1>Cantinho da Vih</h1>
      </div>
    </header>
  );
}