import Link from "next/link"
export default function Atalhos() {
    return (
        <div>
        <nav className="flex justify-around w-full font-bold">
        <Link href="/#Bolos">Bolo</Link>
        <Link href="/#Salgados">Salgados</Link>
        <Link href="/#Garrafa">Garrafa</Link>
        <Link href="/#Marmita">Marmita</Link>
        <Link href="/#Bebida">Bebida</Link>
        </nav>
        </div>
    )
}