import Link from 'next/link'

export default function Home() {
  return (
    <div className="container">

      {/* Carte solde */}
      <div className="balance-card">
        <h2>Gain Max</h2>
        <p>Solde : 0 FCFA</p>
      </div>

      {/* Boutons */}
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

      {/* VIP aperçu */}
      <div className="card">
        <h3>VIP 1</h3>
        <p>Investissement : 3000 FCFA</p>
        <p>Revenu quotidien : 450 FCFA</p>

        <button className="button vip-button">
          Investir
        </button>
      </div>

      {/* Menu bas */}
      <div className="navbar">

        <Link href="/">
          Accueil
        </Link>

        <Link href="/vip">
          VIP
        </Link>

        <Link href="/team">
          Équipe
        </Link>

        <Link href="/account">
          Compte
        </Link>

      </div>

    </div>
  )
        }
