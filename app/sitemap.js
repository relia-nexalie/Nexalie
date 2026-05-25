const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://nexalie-ecqc.vercel.app';

export default function sitemap() {
  const staticRoutes = [
    { url: BASE_URL, priority: 1.0, changeFrequency: 'weekly' },
    { url: `${BASE_URL}/pricing`, priority: 0.9, changeFrequency: 'monthly' },
    { url: `${BASE_URL}/audit`, priority: 0.9, changeFrequency: 'weekly' },
    { url: `${BASE_URL}/about`, priority: 0.7, changeFrequency: 'monthly' },
    { url: `${BASE_URL}/blog`, priority: 0.7, changeFrequency: 'weekly' },
    { url: `${BASE_URL}/contact`, priority: 0.6, changeFrequency: 'monthly' },
    { url: `${BASE_URL}/faq`, priority: 0.6, changeFrequency: 'monthly' },
    { url: `${BASE_URL}/marque-blanche`, priority: 0.7, changeFrequency: 'monthly' },
    { url: `${BASE_URL}/beta`, priority: 0.8, changeFrequency: 'weekly' },
    { url: `${BASE_URL}/comment-ca-marche`, priority: 0.8, changeFrequency: 'monthly' },

    { url: `${BASE_URL}/legal`, priority: 0.3, changeFrequency: 'yearly' },
  ];

  return staticRoutes.map(route => ({
    ...route,
    lastModified: new Date().toISOString(),
  }));
}
