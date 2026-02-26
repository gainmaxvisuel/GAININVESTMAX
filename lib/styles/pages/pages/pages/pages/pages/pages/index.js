import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import Link from 'next/link'
import { useRouter } from 'next/router'

export default function Home(){

  const router = useRouter()

  const [userData, setUserData] = useState(null)

  useEffect(()=>{

    loadUser()

  },[])

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

      {/* Carte utilisateur */}

      <div className="card">

        <h3>{userData.full_name}</h3>

        <p>{maskPhone(userData.phone)}</p>

        <h2>{userData.balance} FCFA</h2>

      </div>

      {/* Recharge / Retrait */}

      <div style={{display:'flex', gap:'10px'}}>

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

      </div>

      {/* Bonus */}

      <div style={{display:'flex', gap:'10px', marginTop:'10px'}}>

        <Link href="/bonus">
          <button className="button vip-button">
            Bonus quotidien
          </button>
        </Link>

        <Link href="/bonus-code">
          <button className="button vip-button">
            Code bonus
          </button>
        </Link>

      </div>

      {/* Telegram */}

      <div style={{marginTop:'15px'}}>

        <a href="https://t.me/+0zCgmok_gac4Zjk0">

          <button className="button">
            Rejoindre Telegram
          </button>

        </a>

      </div>

      {/* VIP aperçu */}

      <h3 style={{marginTop:'20px'}}>VIP populaires</h3>

      <div style={{display:'flex', gap:'10px'}}>

        <Link href="/vip">
          <div className="card">

            <h4>VIP 1</h4>

            <p>3000 FCFA</p>

            <p>450 FCFA / jour</p>

          </div>
        </Link>

        <Link href="/vip">
          <div className="card">

            <h4>VIP 2</h4>

            <p>5000 FCFA</p>

            <p>750 FCFA / jour</p>

          </div>
        </Link>

      </div>

    </div>

  )

    }
