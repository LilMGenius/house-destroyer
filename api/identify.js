import { generateObject } from 'ai';
import { gateway } from '@ai-sdk/gateway';
import { z } from 'zod';

const resultSchema = z.object({
  name: z.string().min(1).max(48),
  material: z.string().min(1).max(48),
  breakStyle: z.string().min(1).max(48),
});

const fallback = { name: 'mystery object', material: 'mixed material', breakStyle: 'shatter' };

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'method_not_allowed' });
  try {
    const image = req.body?.image;
    if (!image || !image.startsWith('data:image/')) return res.status(400).json(fallback);
    const { object } = await generateObject({
      model: gateway('google/gemini-2.5-flash'),
      schema: resultSchema,
      messages: [{ role: 'user', content: [{ type: 'text', text: 'Identify the unlabeled household object. Return its common name, main material, and a concise destruction style.' }, { type: 'image', image }] }],
    });
    return res.json(object);
  } catch {
    return res.json(fallback);
  }
}
