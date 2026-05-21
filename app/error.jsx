'use client'
export default function Error({ error, reset }) {
  return (
    <div style={{padding: '40px', textAlign: 'center'}}>
      <h2>Une erreur est survenue</h2>
      <button onClick={() => reset()}>Réessayer</button>
    </div>
  )
}
