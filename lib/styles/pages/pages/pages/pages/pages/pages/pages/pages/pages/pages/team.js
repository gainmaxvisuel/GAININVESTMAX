import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useRouter } from 'next/router'

export default function Team(){

  const router = useRouter()

  const [referrals, setReferrals] = useState([])
  const [totalCommission, setTotalCommission] = useState(0)

  useEffect(()=>{

    loadTeam()

  },[])

  async function loadTeam(){

    const { data: { user } } = await supabase.auth.getUser()

    if(!user){

      router.push('/login')
      return

    }

    // récupérer filleuls
    const { data } = await supabase
      .from('users')
      .select('id, phone')
      .eq('referrer_id', user.id)

    if(data){

      setReferrals(data)

    }

    // récupérer commissions
    const { data: commissions } = await supabase
      .from('commissions')
      .select('amount')
      .eq('referrer_id', user.id)

    if(commissions){

      let total = 0

      commissions.forEach(item => {

        total += item.amount

      })

      setTotalCommission(total)

    }

  }

  function maskPhone(phone){

    if(!phone) return ''

    return phone.substring(0,4) + "****" + phone.substring(phone.length-2)

  }

  return(

    <div className="container">

      <h2>Mon Équipe</h2>

      <div className="card">

        <p>Total membres : {referrals.length}</p>

        <p>Total commissions : {totalCommission} FCFA</p>

      </div>

      <h3>Liste des membres</h3>

      {

        referrals.map(user => (

          <div key={user.id} className="card">

            <p>Téléphone : {maskPhone(user.phone)}</p>

          </div>

        ))

      }

    </div>

  )

    }
