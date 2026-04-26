/**
 * Integração com a API do DeepSeek.
 *
 * Utiliza o SDK da OpenAI apontando para o endpoint do DeepSeek,
 * com thinking habilitado e reasoning_effort alto.
 *
 * @author Dev Gui
 */
import OpenAI from "openai";
import { DEEPSEEK_API_KEY } from "../config.js";

const client = new OpenAI({
  baseURL: "https://api.deepseek.com",
  apiKey: DEEPSEEK_API_KEY,
});

/**
 * Envia uma mensagem ao DeepSeek e retorna a resposta.
 *
 * @param {string} userMessage - Mensagem do usuário
 * @returns {Promise<string>} Resposta gerada pelo modelo
 */
export async function askDeepSeek(userMessage) {
  const completion = await client.chat.completions.create({
    messages: [
      { role: "system", content: "You are a helpful assistant." },
      { role: "user", content: userMessage },
    ],
    model: "deepseek-v4-pro",
    thinking: { type: "enabled" },
    reasoning_effort: "high",
    stream: false,
  });

  return completion.choices?.[0]?.message?.content ?? null;
}
