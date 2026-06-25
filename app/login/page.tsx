'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase' 
import Image from 'next/image'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    // Faz o login no Supabase usando e-mail e senha
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

  if (error) {
  // Traduz a mensagem caso as credenciais estejam erradas
  if (error.message.includes('Invalid login credentials')) {
    setError('E-mail ou senha incorretos. Verifique os dados.')
  } else {
    // Caso aconteça outro tipo de erro (ex: sem internet, problema no servidor)
    setError('Ocorreu um erro ao entrar. Tente novamente mais tarde.')
  }
  setLoading(false)
} else {
  // Login com sucesso! Redireciona o utilizador para a página inicial
  router.push('/')
  router.refresh()
}
  }

  return (
    <div className="w-full min-h-screen flex justify-center items-center text-center">
     


   

      <form onSubmit={handleLogin} 
      className='
      w-1/2  flex flex-col 
      text-center items-center 
      justify-center
      -mt-50
      '>
       <div>
      <Image className='mb-5 rounded-full object-cover'
      src="/perfil.png"
      alt="Minha foto"
      width={100}
      height={100}
    />
    </div>
      <h1 className='text-center'>Entrar</h1>
        <div className='mb-5'>
          <label>E-mail:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
           className='border-b  border-pink-500 text-white-50 ml-1 focus:outline-none
  focus:border-pink-500'
          />
        </div>
        
        <div style={{ marginBottom: '15px' }}>
          <label>Senha:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className='border-b  border-pink-500 text-white-50 ml-1 focus:outline-none
              focus:border-pink-500'
          />
        </div>

        {error && <p style={{ color: 'red', fontSize: '14px' }}>{error}</p>}

        <button 
          type="submit" 
          disabled={loading}
         
        >
          {loading ? 'A entrar...' : 'Entrar'}
        </button>
      </form>
    </div>
  )
}