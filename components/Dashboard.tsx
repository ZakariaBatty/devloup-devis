'use client'
import { useEffect, useMemo, useState } from 'react'
import { FilePlus2, LayoutDashboard, Trash2, Printer, Save, ArrowLeft, Pencil, Download } from 'lucide-react'
import QuotePreview from './QuotePreview'
import { Quote } from '../lib/types'


const KEY = 'devloup-quotes-v1'
const blankQuote = (): Quote => ({
  id: crypto.randomUUID(), number: `DV-${new Date().getFullYear()}-${String(Date.now()).slice(-5)}`,
  date: new Date().toISOString().slice(0, 10), clientName: '', clientAddress: '', clientEmail: '', clientPhone: '',
  subject: 'Développement web / CRM et prestations associées.', note: '', status: 'Brouillon',
  lines: [{ id: crypto.randomUUID(), label: 'Prestation de développement', qty: 1, price: 0 }]
})

export default function Dashboard() {
  const [quotes, setQuotes] = useState<Quote[]>([])
  const [editing, setEditing] = useState<Quote | null>(null)
  const [ready, setReady] = useState(false)
  useEffect(() => { const raw = localStorage.getItem(KEY); if (raw) setQuotes(JSON.parse(raw)); setReady(true) }, [])
  useEffect(() => { if (ready) localStorage.setItem(KEY, JSON.stringify(quotes)) }, [quotes, ready])
  const total = (q: Quote) => q.lines.reduce((s, l) => s + l.qty * l.price, 0)
  const stats = useMemo(() => ({ count: quotes.length, amount: quotes.reduce((s, q) => s + total(q), 0) }), [quotes])

  const save = () => { if (!editing) return; setQuotes(prev => { const i = prev.findIndex(q => q.id === editing.id); return i >= 0 ? prev.map(q => q.id === editing.id ? editing : q) : [editing, ...prev] }); setEditing(null) }
  const remove = (id: string) => { if (confirm('Supprimer ce devis ?')) setQuotes(q => q.filter(x => x.id !== id)) }

  const downloadPdf = async () => {
    if (!editing) return
    const paper = document.getElementById('quote-paper')
    if (!paper) return

    const [{ default: html2canvas }, { jsPDF }] = await Promise.all([import('html2canvas'), import('jspdf')])
    const canvas = await html2canvas(paper, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff',
      logging: false,
      windowWidth: paper.scrollWidth,
      windowHeight: paper.scrollHeight,
    })

    const img = canvas.toDataURL('image/jpeg', 0.98)
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4', compress: true })
    const pageW = 210
    const pageH = 297
    const imgH = (canvas.height * pageW) / canvas.width

    if (imgH <= pageH) {
      pdf.addImage(img, 'JPEG', 0, 0, pageW, imgH, undefined, 'FAST')
    } else {
      // The preview is designed as an A4 sheet. Scale it to one A4 page when content grows slightly.
      pdf.addImage(img, 'JPEG', 0, 0, pageW, pageH, undefined, 'FAST')
    }

    const safeNumber = (editing.number || 'devis').replace(/[^a-zA-Z0-9-_]/g, '-')
    const safeClient = (editing.clientName || 'client').replace(/[^a-zA-Z0-9-_]/g, '-')
    pdf.save(`${safeNumber}-${safeClient}.pdf`)
  }

  if (editing) return <div className="app-shell editor-shell">
    <aside className="sidebar no-print"><div className="brand">DL<span>Devis</span></div><button onClick={() => setEditing(null)} className="side-link"><ArrowLeft size={18} /> Retour</button><button onClick={save} className="side-link active"><Save size={18} /> Enregistrer</button><button onClick={downloadPdf} className="side-link"><Download size={18} /> Télécharger PDF</button><button onClick={() => window.print()} className="side-link"><Printer size={18} /> Imprimer</button></aside>
    <main className="editor-main">
      <section className="form-panel no-print">
        <div className="panel-head"><div><h2>Éditer le devis</h2><p>Les changements apparaissent dans l’aperçu.</p></div><div className="panel-actions"><button className="btn" onClick={downloadPdf}><Download size={17} /> Télécharger PDF</button><button className="btn primary" onClick={save}><Save size={17} /> Enregistrer</button></div></div>
        <div className="form-grid two">
          <label>N° devis<input value={editing.number} onChange={e => setEditing({ ...editing, number: e.target.value })} /></label>
          <label>Date<input type="date" value={editing.date} onChange={e => setEditing({ ...editing, date: e.target.value })} /></label>
        </div>
        <h3>Client</h3>
        <div className="form-grid two">
          <label>Nom<input value={editing.clientName} onChange={e => setEditing({ ...editing, clientName: e.target.value })} /></label>
          <label>Téléphone<input value={editing.clientPhone} onChange={e => setEditing({ ...editing, clientPhone: e.target.value })} /></label>
          <label>Email<input value={editing.clientEmail} onChange={e => setEditing({ ...editing, clientEmail: e.target.value })} /></label>
          <label>Adresse<input value={editing.clientAddress} onChange={e => setEditing({ ...editing, clientAddress: e.target.value })} /></label>
        </div>
        <label>Objet<textarea rows={2} value={editing.subject} onChange={e => setEditing({ ...editing, subject: e.target.value })} /></label>
        <h3>Prestations</h3>
        <div className="lines">{editing.lines.map((l, idx) => <div className="line-row" key={l.id}>
          <input className="grow" placeholder="Désignation" value={l.label} onChange={e => setEditing({ ...editing, lines: editing.lines.map(x => x.id === l.id ? { ...x, label: e.target.value } : x) })} />
          <input type="number" min="1" value={l.qty} onChange={e => setEditing({ ...editing, lines: editing.lines.map(x => x.id === l.id ? { ...x, qty: Number(e.target.value) } : x) })} />
          <input type="number" min="0" value={l.price} onChange={e => setEditing({ ...editing, lines: editing.lines.map(x => x.id === l.id ? { ...x, price: Number(e.target.value) } : x) })} />
          <button className="icon-btn" onClick={() => setEditing({ ...editing, lines: editing.lines.filter(x => x.id !== l.id) })}><Trash2 size={16} /></button>
        </div>)}</div>
        <button className="btn" onClick={() => setEditing({ ...editing, lines: [...editing.lines, { id: crypto.randomUUID(), label: '', qty: 1, price: 0 }] })}>+ Ajouter une ligne</button>
        <label>Note<textarea rows={3} value={editing.note} onChange={e => setEditing({ ...editing, note: e.target.value })} /></label>
      </section>
      <section className="preview-wrap"><QuotePreview quote={editing} /></section>
    </main>
  </div>

  return <div className="app-shell">
    <aside className="sidebar"><div className="brand">DL<span>Devis</span></div><button className="side-link active"><LayoutDashboard size={18} /> Dashboard</button><button className="side-link" onClick={() => setEditing(blankQuote())}><FilePlus2 size={18} /> Nouveau devis</button></aside>
    <main className="dashboard-main">
      <div className="dash-head"><div><p className="eyebrow">DEVLOUP SOLUTIONS WEB</p><h1>Mes devis</h1><p>Crée, modifie et exporte tes devis depuis une seule interface.</p></div><button className="btn primary big" onClick={() => setEditing(blankQuote())}><FilePlus2 size={18} /> Nouveau devis</button></div>
      <div className="stats"><div className="stat"><span>Devis</span><strong>{stats.count}</strong></div><div className="stat"><span>Montant total</span><strong>{new Intl.NumberFormat('fr-FR').format(stats.amount)} DH</strong></div><div className="stat"><span>Stockage</span><strong>Local</strong><small>Aucun backend requis</small></div></div>
      <div className="card"><div className="card-head"><h2>Liste des devis</h2><span>{quotes.length} document(s)</span></div>
        {quotes.length === 0 ? <div className="empty"><FilePlus2 size={34} /><h3>Aucun devis</h3><p>Crée ton premier devis pour commencer.</p><button className="btn primary" onClick={() => setEditing(blankQuote())}>Créer un devis</button></div> :
          <div className="table-wrap"><table className="dash-table"><thead><tr><th>N°</th><th>Client</th><th>Date</th><th>Montant</th><th>Statut</th><th></th></tr></thead><tbody>{quotes.map(q => <tr key={q.id}><td><strong>{q.number}</strong></td><td>{q.clientName || '—'}</td><td>{new Date(q.date + 'T00:00:00').toLocaleDateString('fr-FR')}</td><td>{new Intl.NumberFormat('fr-FR').format(total(q))} DH</td><td><span className="badge">{q.status}</span></td><td className="actions"><button className="icon-btn" onClick={() => setEditing(q)}><Pencil size={16} /></button><button className="icon-btn danger" onClick={() => remove(q.id)}><Trash2 size={16} /></button></td></tr>)}</tbody></table></div>}
      </div>
    </main>
  </div>
}
