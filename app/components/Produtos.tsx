"use client"
import Image from "next/image"
import ImageIlustrativa from "../../public/window.svg"
import { supabase } from "../../lib/supabase"
import { useEffect, useState } from "react"

export default function Produtos() {
    const [bolos, setBolos] = useState<bolo[]>([]);
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

    //falta criar a tabela aqui 
    //e puxar do banco de dados

    interface categorias {
        id:number
        nome:string
    }

      interface bolo{
            id:number
            nome:string
            preco:number
            descricao:string
        }

    return (

      

        <div className="border w-full h-screen  ">
            <h1 className="">Bolos</h1>
            {bolos.map((bolo) => (

                <div key={bolo.id}
                    className="border border-black/10 h-32 items-center  grid
                                grid-cols-2
                                sm:grid-cols-2
                                md:grid-cols-3
                                lg:grid-cols-4
                                xl:grid-cols-5
                                gap-4 text-center
                                ">
                                    

                    <div className="ml-6">
                    <h2 className="text-bold text-xl text-center">{bolo.nome}</h2>
                       <h2>{bolo.descricao}</h2>
                    <h1 className="text-lg font-medium">Preço ${bolo.preco}</h1> 
                    </div>
                    

                    <Image className="m-auto"
                        src={ImageIlustrativa}
                        alt="bolo de pote"
                        width={100}
                        height={90}
                    />
                </div>
            ))
            }
        </div>
    )
}