'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase' 
import Image from 'next/image'

export default function LoginPage() {
  const [nome, setNome] = useState('')
  const [telefone, setTelefone] = useState('')
  const [cpf, setCpf] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  // 🌟 Estados para o Endereço Completo
  const [cep, setCep] = useState('')
  const [rua, setRua] = useState('')
  const [numero, setNumero] = useState('')
  const [bairro, setBairro] = useState('')
  const [cidade, setCidade] = useState('')
  const [estado, setEstado] = useState('')

  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [isSignUp, setIsSignUp] = useState(false)
  const router = useRouter()

  // Formatação de CPF (000.000.000-00)
  const formatarCPF = (valor: string) => {
    return valor
      .replace(/\D/g, '')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
      .substring(0, 14)
  }

  // ⚡ Busca automática de CEP Ajustada e Higienizada
  const handleCEPPreenchimento = async (valorCEP: string) => {
    const cepLimpo = valorCEP.replace(/\D/g, '')
    
    // Atualiza o estado visual com a máscara 00000-000
    setCep(cepLimpo.replace(/^(\d{5})(\d)/, '$1-$2').substring(0, 9))

    // Dispara a busca EXATAMENTE quando atingir os 8 dígitos numéricos
    if (cepLimpo.length === 8) {
      try {
        setError(null)
        // Usando HTTPS estrito para não ser barrado pelo proxy do Dev enviando dados limpos
        const res = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`)
        const data = await res.json()
        
        if (!data.erro) {
          setRua(data.logradouro || '')
          setBairro(data.bairro || '')
          setCidade(data.localidade || '')
          setEstado(data.uf || '')
        } else {
          setError('CEP não encontrado. Digite o endereço manualmente.')
        }
      } catch (err) {
        console.error('Erro ao buscar CEP:', err)
        setError('Não foi possível autocompletar o CEP. Preencha manualmente.')
      }
    }
  }

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    if (isSignUp) {
      if (!nome.trim()) return (setError('Insira seu nome completo.'), setLoading(false))
      if (cpf.replace(/\D/g, '').length !== 11) return (setError('Insira um CPF válido.'), setLoading(false))
      if (cep.replace(/\D/g, '').length !== 8) return (setError('Insira um CEP válido.'), setLoading(false))
      if (!rua || !numero || !cidade) return (setError('Preencha os campos obrigatórios do endereço.'), setLoading(false))
      if (password.length < 6) return (setError('A senha deve ter pelo menos 6 caracteres.'), setLoading(false))
      if (password !== confirmPassword) return (setError('As senhas não coincidem.'), setLoading(false))
    }

    try {
      if (isSignUp) {
        // 1. Cadastro no Auth do Supabase com metadados completos
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { nome, telefone, cpf: cpf.replace(/\D/g, '') }
          }
        })

        if (authError) throw authError

        // 2. Gravação de Segurança na Tabela Pública
        if (authData?.user) {
          const { error: dbError } = await supabase
            .from('usuarios')
            .insert({
              id: authData.user.id,
              email: authData.user.email,
              nome,
              telefone,
              cpf: cpf.replace(/\D/g, ''),
              cep: cep.replace(/\D/g, ''),
              rua,
              numero,
              bairro,
              cidade,
              estado
            })

          if (dbError) throw dbError
        }

        // 3. Login automático
        await supabase.auth.signInWithPassword({ email, password })
        router.push('/')
        router.refresh()

      } else {
        const { error: loginError } = await supabase.auth.signInWithPassword({ email, password })
        if (loginError) throw loginError
        router.push('/')
        router.refresh()
      }
    } catch (err: any) {
      if (err.message?.includes('Invalid login credentials')) {
        setError('E-mail ou senha incorretos.')
      } else {
        setError(err.message || 'Ocorreu um erro no processo.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full min-h-screen flex justify-center items-center text-center py-12">
      <form onSubmit={handleAuth} className='w-1/2 flex flex-col text-center items-center justify-center'>
        <div>
          <Image className='mb-5 rounded-full object-cover' src="/perfil.png" alt="Minha foto" width={100} height={100} priority />
        </div>
        
        <h1 className='text-center mb-6'>{isSignUp ? 'Criar Conta' : 'Entrar'}</h1>
        
        {isSignUp && (
          <>
            <div className='mb-5'>
              <label>Nome Completo:</label>
              <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} required className='border-b border-pink-500 text-white-50 ml-1 focus:outline-none focus:border-pink-500' />
            </div>

            <div className='mb-5'>
              <label>CPF:</label>
              <input type="text" value={cpf} onChange={(e) => setCpf(formatarCPF(e.target.value))} placeholder="000.000.000-00" required className='border-b border-pink-500 text-white-50 ml-1 focus:outline-none focus:border-pink-500' />
            </div>

            <div className='mb-5'>
              <label>WhatsApp/Telefone:</label>
              <input type="tel" value={telefone} onChange={(e) => setTelefone(e.target.value)} placeholder="(00) 00000-0000" className='border-b border-pink-500 text-white-50 ml-1 focus:outline-none focus:border-pink-500' />
            </div>

            {/* 🏠 BLOCO DE ENDEREÇO */}
            <h3 className="text-pink-500 font-bold text-sm mt-2 mb-4">Dados de Entrega</h3>

            <div className='mb-5'>
              <label>CEP:</label>
              {/* 🌟 Removido security='true' para o input funcionar livremente */}
              <input type="text" value={cep} onChange={(e) => handleCEPPreenchimento(e.target.value)} placeholder="00000-000" required className='border-b border-pink-500 text-white-50 ml-1 focus:outline-none focus:border-pink-500' />
            </div>

            <div className='mb-5'>
              <label>Rua/Logradouro:</label>
              <input type="text" value={rua} onChange={(e) => setRua(e.target.value)} required className='border-b border-pink-500 text-white-50 ml-1 focus:outline-none focus:border-pink-500' />
            </div>

            <div className='mb-5'>
              <label>Número:</label>
              <input type="text" value={numero} onChange={(e) => setNumero(e.target.value)} required className='border-b border-pink-500 text-white-50 ml-1 focus:outline-none focus:border-pink-500' />
            </div>

            <div className='mb-5'>
              <label>Bairro:</label>
              <input type="text" value={bairro} onChange={(e) => setBairro(e.target.value)} required className='border-b border-pink-500 text-white-50 ml-1 focus:outline-none focus:border-pink-500' />
            </div>

            <div className='mb-5'>
              <label>Cidade:</label>
              <input type="text" value={cidade} onChange={(e) => setCidade(e.target.value)} required className='border-b border-pink-500 text-white-50 ml-1 focus:outline-none focus:border-pink-500' />
            </div>

            <div className='mb-5'>
              <label>Estado (UF):</label>
              <input type="text" value={estado} onChange={(e) => setEstado(e.target.value)} maxLength={2} required className='border-b border-pink-500 text-white-50 ml-1 focus:outline-none focus:border-pink-500' />
            </div>
          </>
        )}

        <div className='mb-5'>
          <label>E-mail:</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className='border-b border-pink-500 text-white-50 ml-1 focus:outline-none focus:border-pink-500' />
        </div>
        
        <div className='mb-5'>
          <label>Senha:</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className='border-b border-pink-500 text-white-50 ml-1 focus:outline-none focus:border-pink-500' />
        </div>

        {isSignUp && (
          <div className='mb-5'>
            <label>Confirmar Senha:</label>
            <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required className='border-b border-pink-500 text-white-50 ml-1 focus:outline-none focus:border-pink-500' />
          </div>
        )}

        {error && <p style={{ color: 'red', fontSize: '14px', marginBottom: '15px' }}>{error}</p>}

        <button type="submit" disabled={loading}>
          {loading ? 'A processar...' : isSignUp ? 'Cadastrar' : 'Entrar'}
        </button>

        <button type="button" onClick={() => { setIsSignUp(!isSignUp); setError(null); }} style={{ marginTop: '15px', fontSize: '12px', color: '#ec4899', cursor: 'pointer', background: 'none', border: 'none' }}>
          {isSignUp ? 'Já tem uma conta? Entre aqui' : 'Não tem uma conta? Cadastre-se'}
        </button>
      </form>
    </div>
  )
}