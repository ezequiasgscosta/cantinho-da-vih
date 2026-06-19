"use client"
import Image from "next/image"
import ImageIlustrativa from "../../public/window.svg"
import {supabase} from "../../lib/supabase"
import { useEffect } from "react"

export default function Produtos() {

      useEffect(()=> {
            async function buscarproduto(){
                const {data, error} = await supabase.from("bolo").select("*")

                if(error){
                    console.error("erro ao conectar",error.message)
                }else{
                    console.log("conectado com sucesso",data)
                }

            }
            buscarproduto()
        },
        []
        )

    return (

      

        <div className="border w-2">
          <Image 
          src={ImageIlustrativa} 
          alt="bolo de pote" 
          width={50} 
          height={50} 
        />  
        <h2>bolo de pote</h2>
        <h1>Preço $19.99</h1>
        </div>
    )
}