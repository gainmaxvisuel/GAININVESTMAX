import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useRouter } from 'next/router'

export default function Withdrawal(){

  const router = useRouter()

  const [phone, setPhone] = useState('')
  const [amount, setAmount] = useState('')
  const [fee, setFee] = useState(0)
  const [received, setReceived] = useState(0)
  const [balance, setBalance] = useState(0)

  // charger solde utilisateur
  useEffect(()=>{

    async function getBalance(){

      const { data: { user } } = await supabase.auth.getUser()

      if(user){

        const { data } = await supabase
        .from('users')
        .select('balance')
        .eq('id', user.id)
        .single()

        if(data){
          setBalance(data.balance)
        }

      }

    }

    getBalance()

  },[])

  // calcul frais
  function calculate(value){

    const amountValue = parseFloat(value) || 0

    const feeValue = amountValue * 0.10
    const receivedValue = amountValue - feeValue

    setFee(feeValue)
    setReceived(receivedValue)
    setAmount(value)

  }

  async function handleWithdrawal(){

    const { data: { user } } = await supabase.auth.getUser()

    if(!user){
      alert("Connectez-vous")
      router.push('/login')
      return
    }

    if(amount < 1500){
      alert("Minimum retrait : 1500 FCFA")
      return
    }

    if(amount > balance){
      alert("Solde insuffisant")
      return
    }

    if(!phone){
      alert("Entrez numéro")
      return
    }

    const { error } = await supabase
    .from('withdrawals')
    .insert([
      {
        user_id: user.id,
        phone: phone,
        amount: amount,
        fee: fee,
        received: received,
        status: 'pending'
      }
    ])

    if(error){

      alert(error.message)

    }else{

      alert("Demande envoyée. Traitement 24 à 48h.")
      router.push('/')

    }

  }

  return(

    <div className="container">

      <h2>Retrait Mobile Money</h2>

      <div className="card">
        <p>Solde disponible : {balance} FCFA</p>
      </div>

      <input
        className="input"
        placeholder="Numéro Mobile Money"
        onChange={(e)=>setPhone(e.target.value)}
      />

      <input
        className="input"
        type="number"
        placeholder="Montant"
        onChange={(e)=>calculate(e.target.value)}
      />

      <div className="card">

        <p>Frais (10%) : {fee} FCFA</p>

        <p>Montant reçu : {received} FCFA</p>

        <p>Délai : 24 à 48h (09h à 20h)</p>

      </div>

      <button
        className="button withdraw"
        onClick={handleWithdrawal}
      >
        Confirmer Retrait
      </button>

    </div>

  )

      }
