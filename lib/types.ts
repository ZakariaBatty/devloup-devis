export type QuoteLine = { id:string; label:string; qty:number; price:number }
export type Quote = {
  id:string
  number:string
  date:string
  clientName:string
  clientAddress:string
  clientEmail:string
  clientPhone:string
  subject:string
  note:string
  status:'Brouillon'|'Envoyé'|'Payé'
  lines:QuoteLine[]
}
