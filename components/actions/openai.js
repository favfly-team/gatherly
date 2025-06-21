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
      model: "gpt-4.1",
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

export async function generateChatName(messages) {
  const apiKey = process.env.OPENAI_API_KEY;

  // Create a system prompt that instructs the model to generate a concise, descriptive name
  const systemPrompt =
    "Generate a concise, descriptive title (maximum 50 characters) for this conversation that captures its main purpose or topic. Return ONLY the title text with no additional explanation or formatting.";

  // Filter out any special markers from messages
  const cleanMessages = messages.map((message) => ({
    ...message,
    content: message.content.replace("###GATHERLY_DONE###", "").trim(),
  }));

  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4.1",
        messages: [{ role: "system", content: systemPrompt }, ...cleanMessages],
        max_tokens: 60,
        temperature: 0.7,
        stream: false,
      }),
    });

    if (!res.ok) throw new Error("OpenAI API error when generating chat name");
    const data = await res.json();
    const chatName = data.choices?.[0]?.message?.content || "";

    // Ensure the name isn't too long
    return chatName.substring(0, 50);
  } catch (error) {
    console.error("Error generating chat name:", error);
    return "Untitled Conversation";
  }
}
