"use client";

import { usePathname } from "next/navigation";
import Cabecario from "./Cabecario";
import Carrinho from "./Carrinho";

export default function LayoutContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const ocultarCabecario = pathname === "/login";

  return (
    <>
      {!ocultarCabecario && (
        <>
          <Cabecario />
          <Carrinho />
        </>
      )}

      <main className="pt-6">
        {children}
      </main>
    </>
  );
}