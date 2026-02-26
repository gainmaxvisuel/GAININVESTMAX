import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { useRouter } from 'next/router'
import Link from 'next/link'

export default function Register() {

  const router = useRouter()

  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [referral, setReferral] = useState('')

  async function handleRegister() {

    if(password !== confirmPassword){
      alert("Les mots de passe ne correspondent pas")
      return
    }

    // Créer utilisateur Auth
    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password
    })

    if(error){
      alert(error.message)
      return
    }

    const user = data.user

    if(user){

      // Créer profil dans table users
      const { error: profileError } = await supabase
      .from('users')
      .insert([
        {
          id: user.id,
          email: email,
          full_name: fullName,
          phone: phone,
          referral_code: user.id.slice(0,6),
          referred_by: referral,
          balance: 0
        }
      ])

      if(profileError){
        alert(profileError.message)
        return
      }

      alert("Inscription réussie")
      router.push('/login')

    }

  }

  return (

    <div className="container">

      <h2>Inscription Gain Max</h2>

      <input
        className="input"
        placeholder="Nom complet"
        onChange={(e)=>setFullName(e.target.value)}
      />

      <input
        className="input"
        placeholder="Téléphone"
        onChange={(e)=>setPhone(e.target.value)}
      />

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

      <input
        className="input"
        type="password"
        placeholder="Confirmer mot de passe"
        onChange={(e)=>setConfirmPassword(e.target.value)}
      />

      <input
        className="input"
        placeholder="Code de parrainage (optionnel)"
        onChange={(e)=>setReferral(e.target.value)}
      />

      <button
        className="button vip-button"
        onClick={handleRegister}
      >
        S'inscrire
      </button>

      <p>
        Déjà un compte ?
        <Link href="/login"> Se connecter</Link>
      </p>

    </div>

  )

}
