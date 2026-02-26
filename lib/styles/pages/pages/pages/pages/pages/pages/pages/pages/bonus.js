import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useRouter } from 'next/router'

export default function Bonus(){

  const router = useRouter()

  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)

  async function claimBonus(){

    if(loading) return

    setLoading(true)

    const { data: { user } } = await supabase.auth.getUser()

    if(!user){

      router.push('/login')
      return

    }

    // vérifier dernier bonus
    const { data } = await supabase
    .from('bonus_history')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(1)

    if(data.length > 0){

      const last = new Date(data[0].created_at)
      const now = new Date()

      const diff = (now - last) / 1000 / 60 / 60

      if(diff < 24){

        setMessage("Bonus déjà réclamé aujourd'hui")
        setLoading(false)
        return

      }

    }

    // ajouter bonus
    await supabase
    .from('bonus_history')
    .insert([
      {
        user_id: user.id,
        amount: 100
      }
    ])

    // récupérer solde
    const { data: userData } = await supabase
    .from('users')
    .select('balance')
    .eq('id', user.id)
    .single()

    const newBalance = userData.balance + 100

    await supabase
    .from('users')
    .update({ balance: newBalance })
    .eq('id', user.id)

    setMessage("Bonus 100 FCFA ajouté avec succès")

    setLoading(false)

  }

  return(

    <div className="container">

      <h2>Bonus quotidien</h2>

      <div className="card">

        <p>Recevez 100 FCFA chaque jour</p>

        <button
          className="button vip-button"
          onClick={claimBonus}
        >

          Réclamer bonus

        </button>

        <p>{message}</p>

      </div>

    </div>

  )

            }
