import React from 'react';
import { renderToBuffer } from '@react-pdf/renderer';
import { BetaPDFDocument } from '@/lib/pdf/BetaPDFDocument';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req) {
  try {
    const body = await req.json();
    const { score, recoCards, profil, mode, sector } = body;

    if (typeof score !== 'number') {
      return new Response(JSON.stringify({ error: 'score (number) requis' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const element = React.createElement(BetaPDFDocument, {
      score,
      recoCards: Array.isArray(recoCards) ? recoCards : [],
      profil: profil || {},
      mode: mode || 'fr',
      sector: sector || null,
    });

    const pdfBuffer = await renderToBuffer(element);

    return new Response(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="rapport-nexalie.pdf"',
        'Cache-Control': 'no-store',
      },
    });
  } catch (err) {
    console.error('[/api/report/pdf]', err);
    return new Response(JSON.stringify({ error: 'Erreur génération PDF' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
