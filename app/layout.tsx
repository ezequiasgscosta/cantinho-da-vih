import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Cabecario from "./components/Cabecario";
import { UIProvider } from "./providers/UIProvider";
import Carrinho from "./components/Carrinho"
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Cantinho da Vih",
  description:
    "Doces artesanais, salgados e sobremesas! A melhor comida da cidade com entrega grátis, promoções e brindes imperdíveis. Venha aproveitar!",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="pt-br"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">

        <UIProvider>

          <Cabecario />
          <Carrinho/>
          <main className="pt-6 ">
            {children}
          </main>

        </UIProvider>

      </body>
    </html>
  );
}