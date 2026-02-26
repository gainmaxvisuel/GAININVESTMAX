import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useRouter } from 'next/router'

export default function History(){

  const router = useRouter()

  const [deposits, setDeposits] = useState([])
  const [withdrawals, setWithdrawals] = useState([])
  const [investments, setInvestments] = useState([])

  useEffect(()=>{

    loadHistory()

  },[])

  async function loadHistory(){

    const { data: { user } } = await supabase.auth.getUser()

    if(!user){

      router.push('/login')
      return

    }

    // deposits
    const { data: depositData } = await supabase
    .from('deposit')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

    if(depositData){
      setDeposits(depositData)
    }

    // withdrawals
    const { data: withdrawalData } = await supabase
    .from('withdrawals')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

    if(withdrawalData){
      setWithdrawals(withdrawalData)
    }

    // investments
    const { data: investData } = await supabase
    .from('investments')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

    if(investData){
      setInvestments(investData)
    }

  }

  return(

    <div className="container">

      <h2>Historique</h2>

      {/* deposits */}

      <h3>Recharges</h3>

      {

        deposits.map(item => (

          <div key={item.id} className="card">

            <p>Montant : {item.amount} FCFA</p>

            <p>Statut : {item.status}</p>

            <p>Date : {new Date(item.created_at).toLocaleString()}</p>

          </div>

        ))

      }

      {/* withdrawals */}

      <h3>Retraits</h3>

      {

        withdrawals.map(item => (

          <div key={item.id} className="card">

            <p>Montant : {item.amount} FCFA</p>

            <p>Reçu : {item.received} FCFA</p>

            <p>Statut : {item.status}</p>

            <p>Date : {new Date(item.created_at).toLocaleString()}</p>

          </div>

        ))

      }

      {/* investments */}

      <h3>Investissements</h3>

      {

        investments.map(item => (

          <div key={item.id} className="card">

            <p>VIP : {item.vip_level}</p>

            <p>Montant : {item.amount} FCFA</p>

            <p>Revenu quotidien : {item.daily_income} FCFA</p>

            <p>Statut : {item.status}</p>

            <p>Date : {new Date(item.created_at).toLocaleString()}</p>

          </div>

        ))

      }

    </div>

  )

}
