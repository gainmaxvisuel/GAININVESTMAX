import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useRouter } from 'next/router'

export default function VIP(){

  const router = useRouter()

  const [user, setUser] = useState(null)
  const [balance, setBalance] = useState(0)
  const [loading, setLoading] = useState(false)

  const vipPlans = [

    { level: 1, price: 3000, daily: 450 },
    { level: 2, price: 5000, daily: 750 },
    { level: 3, price: 10000, daily: 1500 },
    { level: 4, price: 20000, daily: 3000 },
    { level: 5, price: 50000, daily: 7500 },

    { level: 6, price: 75000, daily: 11250 },
    { level: 7, price: 100000, daily: 15000 },
    { level: 8, price: 150000, daily: 22500 },
    { level: 9, price: 200000, daily: 30000 },
    { level: 10, price: 300000, daily: 45000 },

    { level: 11, price: 500000, daily: 75000 },
    { level: 12, price: 750000, daily: 112500 },
    { level: 13, price: 1000000, daily: 150000 },
    { level: 14, price: 1500000, daily: 225000 },
    { level: 15, price: 2000000, daily: 300000 }

  ]

  useEffect(()=>{

    loadUser()

  },[])

  async function loadUser(){

    const { data: { user } } = await supabase.auth.getUser()

    if(!user){

      router.push('/login')
      return

    }

    setUser(user)

    const { data } = await supabase
    .from('users')
    .select('balance')
    .eq('id', user.id)
    .single()

    if(data){

      setBalance(data.balance)

    }

  }

  async function invest(plan){

    if(loading) return

    if(balance < plan.price){

      alert("Solde insuffisant")
      return

    }

    const confirm1 = confirm(
      `Confirmer investissement VIP ${plan.level} ?`
    )

    if(!confirm1) return

    const confirm2 = confirm(
      `Investissement : ${plan.price} FCFA\nRevenu quotidien : ${plan.daily} FCFA\nDurée : 30 jours`
    )

    if(!confirm2) return

    setLoading(true)

    try{

      // enregistrer investissement
      const { error } = await supabase
      .from('investments')
      .insert([
        {
          user_id: user.id,
          vip_level: plan.level,
          amount: plan.price,
          daily_income: plan.daily,
          total_days: 30,
          days_completed: 0,
          status: 'active'
        }
      ])

      if(error) throw error

      // nouveau solde
      const newBalance = balance - plan.price

      const { error: updateError } = await supabase
      .from('users')
      .update({ balance: newBalance })
      .eq('id', user.id)

      if(updateError) throw updateError

      alert("Investissement réussi")

      loadUser()

    }catch(err){

      alert(err.message)

    }

    setLoading(false)

  }

  return(

    <div className="container">

      <h2>Plans VIP Gain Max</h2>

      <div className="card">

        <strong>Solde disponible :</strong> {balance} FCFA

      </div>

      {

        vipPlans.map(plan => (

          <div key={plan.level} className="card">

            <h3>VIP {plan.level}</h3>

            <p>Investissement : {plan.price.toLocaleString()} FCFA</p>

            <p>Revenu quotidien : {plan.daily.toLocaleString()} FCFA</p>

            <p>Durée : 30 jours</p>

            <p>Total revenu : {(plan.daily * 30).toLocaleString()} FCFA</p>

            <button
              className="button vip-button"
              onClick={()=>invest(plan)}
              disabled={loading}
            >

              {loading ? "Traitement..." : "Investir"}

            </button>

          </div>

        ))

      }

    </div>

  )

        }
