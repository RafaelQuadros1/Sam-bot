/**
 * Serviço de fallback com DeepSeek para conversas privadas (DMs).
 *
 * Responde automaticamente quando o bot principal não consegue
 * processar a mensagem. Funciona APENAS em PVs — nunca em grupos.
 *
 * @author Dev Gui
 */
import { DEEPSEEK_API_KEY } from "../config.js";
import { askDeepSeek } from "../integrations/deepseek.js";
import { errorLog } from "../utils/logger.js";

const deepseekConfigured =
  DEEPSEEK_API_KEY &&
  DEEPSEEK_API_KEY.trim() !== "" &&
  DEEPSEEK_API_KEY !== "sua_chave_aqui";

/**
 * Tenta responder usando o DeepSeek como fallback.
 * Silenciosamente ignora se a chave não estiver configurada.
 *
 * @param {Object} params
 * @param {import('../@types/index.d.ts').CommandHandleProps} params.commonFunctions
 */
export async function deepseekFallback({ commonFunctions }) {
  if (!deepseekConfigured) {
    return;
  }

  const { isGroup, fullMessage, sendReply, sendTypingState } = commonFunctions;

  // Garantia extra: nunca responder em grupos
  if (isGroup) {
    return;
  }

  try {
    await sendTypingState();
    const response = await askDeepSeek(fullMessage);

    if (response) {
      await sendReply(response);
    }
  } catch (error) {
    errorLog(`Erro no fallback DeepSeek: ${error.message}`);
  }
}
