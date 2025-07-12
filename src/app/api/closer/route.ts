import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { input } = await req.json();

  if (!input) {
    return NextResponse.json({ output: 'No input provided.' }, { status: 400 });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ output: 'OpenAI API key not set.' }, { status: 500 });
  }

  const prompt = `You're a sales expert. Here's a convo: ${input}\nWrite the perfect next message to close the deal.`;

  try {
    const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: "You're a sales expert." },
          { role: 'user', content: prompt },
        ],
        max_tokens: 200,
        temperature: 0.7,
      }),
    });

    const data = await openaiRes.json();
    const output = data.choices?.[0]?.message?.content?.trim() || 'No response from AI.';
    return NextResponse.json({ output });
  } catch (error) {
    return NextResponse.json({ output: 'Error contacting OpenAI.' }, { status: 500 });
  }
}
