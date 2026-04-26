/**
 * Middleware customizado para adicionar lógica personalizada
 * sem modificar os arquivos principais do bot.
 *
 * Este middleware é chamado em dois momentos:
 * 1. Antes de processar qualquer mensagem (type: "message")
 * 2. Antes de processar eventos de participantes add/remove (type: "participant")
 *
 * @param {CustomMiddlewareProps} params - Parâmetros do middleware
 *
 * Para exemplos de uso, consulte:
 * - README.md (seção "Custom Middleware")
 *
 * @author Dev Gui
 */
import { deepseekFallback } from "../services/deepseekFallback.js";
import { getPrefix } from "../utils/database.js";

export async function customMiddleware({
  socket,
  webMessage,
  type,
  commonFunctions,
  action,
  data,
}) {
  if (type !== "message" || !commonFunctions) {
    return;
  }

  const { isGroup, prefix, remoteJid, fullMessage } = commonFunctions;

  // Apenas DMs — nunca em grupos
  if (isGroup) {
    return;
  }

  // Ignorar mensagens enviadas pelo próprio bot
  if (webMessage?.key?.fromMe) {
    return;
  }

  // Ignorar placeholder usado quando a mensagem não tem texto
  if (fullMessage === "#auto-command") {
    return;
  }

  // Ignorar quando o usuário estiver usando um comando com prefixo
  const chatPrefix = getPrefix(remoteJid);
  if (prefix === chatPrefix) {
    return;
  }

  await deepseekFallback({ commonFunctions });
}
