import OpenAI from "openai";
import { createClient } from "@supabase/supabase-js";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

export async function POST(req) {
  const { message, userId = "u1" } = await req.json();

  await supabase.from("memory").insert({
    user_id: userId,
    role: "user",
    content: message,
  });

  const { data } = await supabase
    .from("memory")
    .select("role, content")
    .eq("user_id", userId)
    .order("id", { ascending: true })
    .limit(30);

  const messages = (data || [])
    .filter(m => m.role && m.content)
    .slice(-10)
    .map(m => ({
      role: m.role,
      content: m.content,
    }));

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: "你是龙虾AI，可以写诗、聊天，不复读。",
      },
      ...messages,
    ],
  });

  const reply =
    completion.choices?.[0]?.message?.content || "（空回复）";

  await supabase.from("memory").insert({
    user_id: userId,
    role: "assistant",
    content: reply,
  });

  return Response.json({ reply });
}
