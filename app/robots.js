const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://nexalie.co';

export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/dashboard/', '/platform/', '/api/', '/onboarding'],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
