"use client"
import Image from "next/image"
import ImageIlustrativa from "../../public/window.svg"
import { supabase } from "../../lib/supabase"
import { useEffect, useState } from "react"


export default function Produtos() {
    const [bolos, setBolos] = useState([]);
    useEffect(() => {
        async function buscarproduto() {
            const { data, error } = await supabase.from("bolo").select("*")

            if (error) {
                console.error("erro ao conectar", error.message)
            } else {
                setBolos(data)
                console.log("conectado com sucesso", data)
            }

        }
        buscarproduto()
    },
        []
    )
    return (

        interface bolo{
            id:number
            nome:text
            preco:number
        }

        <div className="border w-full h-screen bg-blue-400 ">
            {bolos.map((bolo) => (

                <div key={bolo.id}
                    className="border w-1/5 h-1/3 text-center">
                    <Image className="m-auto"
                        src={ImageIlustrativa}
                        alt="bolo de pote"
                        width={50}
                        height={50}
                    />
                    <h2>{bolo.nome}</h2>
                    <h1>Preço ${bolo.preco}</h1>
                </div>
            ))
            }
        </div>
    )
}