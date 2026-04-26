export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.XAI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'API key not configured' });
  }

  const { action, messages, prompt } = req.body;

  try {
    // action: "suggest" → プロンプト提案, "generate" → 画像生成
    if (action === 'suggest') {
      // 会話の流れからプロンプトを提案
      const systemPrompt = `あなたは画像生成プロンプトの専門家です。会話の内容をもとに、重要なシーンの画像生成用のプロンプトを日本語で1つ提案してください。プロンプトのテキストのみを返してください。説明や引用符は不要です。`;

      const response = await fetch('https://api.x.ai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'grok-3',
          messages: [
            { role: 'system', content: systemPrompt },
            ...(messages || []),
            { role: 'user', content: '会話の内容をもとに画像生成プロンプトを提案してください。' },
          ],
          max_tokens: 200,
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        return res.status(response.status).json({ error });
      }

      const data = await response.json();
      const suggestedPrompt = data.choices[0].message.content.trim();
      return res.status(200).json({ prompt: suggestedPrompt });

    } else if (action === 'generate') {
      // 画像生成
      const response = await fetch('https://api.x.ai/v1/images/generations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'grok-imagine-image',
          prompt: prompt,
          n: 1,
          response_format: 'b64_json',
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        return res.status(response.status).json({ error });
      }

      const data = await response.json();
      return res.status(200).json(data);
    } else {
      return res.status(400).json({ error: 'Invalid action' });
    }
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
