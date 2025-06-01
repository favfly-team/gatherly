"use server";

export async function fetchOpenAIChat({ messages, systemPrompt }) {
  const apiKey = process.env.OPENAI_API_KEY;
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [
        ...(systemPrompt ? [{ role: "system", content: systemPrompt }] : []),
        ...messages,
      ],
      stream: false,
    }),
  });
  if (!res.ok) throw new Error("OpenAI API error");
  const data = await res.json();
  return data.choices?.[0]?.message?.content || "";
}
