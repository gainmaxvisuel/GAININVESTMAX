import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useRouter } from 'next/router'
import Link from 'next/link'

export default function Account(){

  const router = useRouter()

  const [userData, setUserData] = useState(null)

  useEffect(()=>{

    async function loadUser(){

      const { data: { user } } = await supabase.auth.getUser()

      if(!user){
        router.push('/login')
        return
      }

      const { data } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single()

      if(data){
        setUserData(data)
      }

    }

    loadUser()

  },[])

  function maskPhone(phone){

    if(!phone) return ''

    return phone.substring(0,4) + "****" + phone.substring(phone.length-2)

  }

  if(!userData){

    return(
      <div className="container">
        Chargement...
      </div>
    )

  }

  return(

    <div className="container">

      <h2>Mon Compte</h2>

      <div className="card">

        <p><strong>Nom :</strong> {userData.full_name}</p>

        <p><strong>Téléphone :</strong> {maskPhone(userData.phone)}</p>

        <p><strong>Email :</strong> {userData.email}</p>

        <p><strong>Solde :</strong> {userData.balance} FCFA</p>

      </div>

      <Link href="/deposit">
        <button className="button deposit">
          Recharger
        </button>
      </Link>

      <Link href="/withdrawal">
        <button className="button withdraw">
          Retirer
        </button>
      </Link>

      <Link href="/">
        <button className="button vip-button">
          Accueil
        </button>
      </Link>

    </div>

  )

    }
