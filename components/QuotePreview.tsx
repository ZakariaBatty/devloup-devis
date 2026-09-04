'use client'
import { Quote } from '../lib/types'

const money = (n: number) => new Intl.NumberFormat('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n) + ' DH'
// test
export default function QuotePreview({ quote }: { quote: Quote }) {
  const total = quote.lines.reduce((s, l) => s + l.qty * l.price, 0)
  return <div className="paper" id="quote-paper">
    <div className="q-top">
      <div><strong>DEVLOUP SOLUTIONS WEB</strong><div className="muted">Auto-Entrepreneur - Maroc</div></div>
      <div className="right"><strong>DEVIS / SOLDE DE PRESTATIONS</strong><div className="muted">N° {quote.number}</div></div>
    </div>
    <div className="q-title"><h1>DEVIS</h1><strong>Date : {new Date(quote.date + 'T00:00:00').toLocaleDateString('fr-FR')}</strong></div>

    <div className="party-grid">
      <div><strong>PRESTATAIRE</strong><br />Zakaria Batty - DevLoup Solutions Web<br />Auto-Entrepreneur - Maroc<br />ICE : 003828284000017<br />TP : 43904745 &nbsp; IF : 68719398<br />N° dossier AE : AE-250922-952039</div>
      <div><strong>CLIENT</strong><br />{quote.clientName || '—'}<br />{quote.clientAddress || '—'}<br />{quote.clientEmail || '—'}{quote.clientPhone ? ` - ${quote.clientPhone}` : ''}</div>
    </div>

    <p className="subject"><strong>Objet :</strong> {quote.subject || 'Prestations de développement web.'}</p>

    <table className="quote-table">
      <thead><tr><th>DÉSIGNATION</th><th>QTÉ</th><th>PRIX</th><th>TOTAL</th></tr></thead>
      <tbody>{quote.lines.map(l => <tr key={l.id}><td>{l.label || 'Prestation'}</td><td className="num">{l.qty}</td><td className="num">{money(l.price)}</td><td className="num strong">{money(l.qty * l.price)}</td></tr>)}</tbody>
    </table>

    <div className="total-row"><span>TOTAL À RÉGLER</span><strong>{money(total)}</strong></div>

    <div className="party-grid lower">
      <div><strong>COORDONNÉES BANCAIRES - CIH BANK</strong><br />Titulaire : BATTY ZAKARIA AE<br />Banque : 230 &nbsp; Ville : 201<br />N° de compte : 6447937225030700<br />SWIFT / BIC : CIHMMAMC &nbsp; - &nbsp; Clé RIB : 38</div>
      <div><strong>NOTE</strong><br />{quote.note || 'Merci pour votre confiance.'}</div>
    </div>

    <p>Arrêté le présent devis à la somme de : <strong>{money(total)}</strong>.</p>
    <div className="signatures"><div><strong>Le prestataire</strong><br />Zakaria Batty<br />DevLoup Solutions Web</div><div><strong>Bon pour accord - Client</strong><br />Signature / cachet :</div></div>
  </div>
}
