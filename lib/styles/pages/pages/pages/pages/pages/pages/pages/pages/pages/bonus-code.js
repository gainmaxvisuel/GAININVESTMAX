import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { useRouter } from 'next/router'

export default function BonusCode(){

  const router = useRouter()

  const [code, setCode] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  async function useCode(){

    if(loading) return

    setLoading(true)
    setMessage("")

    const { data: { user } } = await supabase.auth.getUser()

    if(!user){

      router.push('/login')
      return

    }

    if(!code){

      setMessage("Entrez un code")
      setLoading(false)
      return

    }

    // vérifier code
    const { data: bonus, error } = await supabase
      .from('bonus_codes')
      .select('*')
      .eq('code', code)
      .eq('active', true)
      .single()

    if(error || !bonus){

      setMessage("Code invalide")
      setLoading(false)
      return

    }

    // vérifier utilisation
    const { data: used } = await supabase
      .from('bonus_code_use')
      .select('*')
      .eq('user_id', user.id)
      .eq('code_id', bonus.id)

    if(used.length > 0){

      setMessage("Code déjà utilisé")
      setLoading(false)
      return

    }

    // créditer bonus
    const { data: userData } = await supabase
      .from('users')
      .select('balance')
      .eq('id', user.id)
      .single()

    const newBalance = userData.balance + bonus.amount

    await supabase
      .from('users')
      .update({ balance: newBalance })
      .eq('id', user.id)

    // enregistrer utilisation
    await supabase
      .from('bonus_code_use')
      .insert([
        {
          user_id: user.id,
          code_id: bonus.id,
          amount: bonus.amount
        }
      ])

    setMessage("Bonus ajouté : " + bonus.amount + " FCFA")

    setLoading(false)

  }

  return(

    <div className="container">

      <h2>Code Bonus</h2>

      <div className="card">

        <input
          className="input"
          placeholder="Entrer code bonus"
          onChange={(e)=>setCode(e.target.value)}
        />

        <button
          className="button vip-button"
          onClick={useCode}
        >

          Utiliser Code

        </button>

        <p>{message}</p>

      </div>

    </div>

  )

    }
