// Seule constante à modifier lors du passage vers le domaine personnalisé.
// Aujourd'hui (bêta) : domaine Vercel. Demain : nexalie.co.
// ATTENTION : ne jamais pointer canonicals ni og:url vers nexalie.co
// avant que le domaine soit configuré dans Vercel (sinon désindexation Google).
//
// Pour basculer : changer la valeur ici OU définir NEXT_PUBLIC_SITE_URL
// dans les variables d'environnement Vercel.
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || 'https://nexalie-ecqc.vercel.app';
