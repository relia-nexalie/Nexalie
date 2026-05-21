'use client'
export default function GlobalError({ error, reset }) {
  return (
    <html>
      <body>
        <div style={{padding: '40px', textAlign: 'center'}}>
          <h2>Erreur critique</h2>
          <button onClick={() => reset()}>Réessayer</button>
        </div>
      </body>
    </html>
  )
}
