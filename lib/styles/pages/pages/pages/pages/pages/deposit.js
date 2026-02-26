import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { useRouter } from 'next/router'

export default function Deposit() {

  const router = useRouter()

  const [phone, setPhone] = useState('')
  const [amount, setAmount] = useState('')
  const [otp, setOtp] = useState('')

  async function handleDeposit(){

    const { data: { user } } = await supabase.auth.getUser()

    if(!user){
      alert("Connectez-vous")
      router.push('/login')
      return
    }

    if(!phone || !amount || !otp){
      alert("Remplissez tous les champs")
      return
    }

    const { error } = await supabase
    .from('deposit')
    .insert([
      {
        user_id: user.id,
        phone: phone,
        amount: amount,
        otp: otp,
        status: 'pending'
      }
    ])

    if(error){

      alert(error.message)

    }else{

      alert("Recharge envoyée. Validation sous 10 minutes.")
      router.push('/')

    }

  }

  return(

    <div className="container">

      <h2>Recharge Orange Money</h2>

      <input
        className="input"
        placeholder="Numéro Orange Money"
        onChange={(e)=>setPhone(e.target.value)}
      />

      <input
        className="input"
        type="number"
        placeholder="Montant"
        onChange={(e)=>setAmount(e.target.value)}
      />

      <input
        className="input"
        placeholder="OTP"
        onChange={(e)=>setOtp(e.target.value)}
      />

      <button
        className="button deposit"
        onClick={handleDeposit}
      >
        Confirmer Recharge
      </button>

    </div>

  )

          }
