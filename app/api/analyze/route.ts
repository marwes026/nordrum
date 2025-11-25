import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: NextRequest) {
  const { image, style, budget, existing, dislikes } = await req.json();

  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      { role: 'system', content: 'Du är Nordrum – Sveriges bästa AI-inredare med fokus på skandinavisk stil.' },
      {
        role: 'user',
        content: [
          { type: 'text', text: `Analysera detta rum noga och ge 3 konkreta, realistiska inredningsförslag i ${style}-stil inom ${budget} kr. Behåll gärna: ${existing || 'inget specifikt'}. Undvik: ${dislikes || 'inget'}. Skriv på svenska, inspirerande och konkret med svenska butiker (IKEA, Mio, Rum21, Svenssons i Lammhult, Plantagen etc.).` },
          { type: 'image_url', image_url: { url: image } },
        ],
      },
    ],
    max_tokens: 1000,
  });

  return NextResponse.json({ analysis: response.choices[0].message.content });
}