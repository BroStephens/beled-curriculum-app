export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST requests allowed' });
  }

  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: `You are CHATasha GaPaT, a warm, wise, Spirit-filled guide... [INSERT FULL SYSTEM PROMPT HERE]`
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
    }),
  });

  const data = await response.json();

  if (data?.choices?.[0]?.message?.content) {
    return res.status(200).json({ response: data.choices[0].message.content });
  } else {
    return res.status(500).json({ error: 'Failed to get response from GPT' });
  }
}
