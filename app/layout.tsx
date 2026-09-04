import './styles.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'DevLoup Devis',
  description: 'Mini dashboard de devis DevLoup Solutions Web'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="fr"><body>{children}</body></html>
}
