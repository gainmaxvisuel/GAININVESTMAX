import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { useRouter } from 'next/router'
import Link from 'next/link'

export default function Login() {

  const router = useRouter()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  async function handleLogin() {

    const { error } = await supabase.auth.signInWithPassword({

      email: email,
      password: password

    })

    if (error) {

      alert(error.message)

    } else {

      alert("Connexion réussie")
      router.push('/')

    }

  }

  return (

    <div className="container">

      <h2>Connexion</h2>

      <input
        className="input"
        type="email"
        placeholder="Email"
        onChange={(e)=>setEmail(e.target.value)}
      />

      <input
        className="input"
        type="password"
        placeholder="Mot de passe"
        onChange={(e)=>setPassword(e.target.value)}
      />

      <button
        className="button vip-button"
        onClick={handleLogin}
      >
        Se connecter
      </button>

      <p>
        Pas de compte ?
        <Link href="/register"> S'inscrire</Link>
      </p>

    </div>

  )

          }
