import { PREFIX } from "../../config.js";
import { InvalidParameterError } from "../../errors/index.js";
import { getMessageStats, resetMessageStats } from "../../utils/database.js";
import { isGroup, onlyNumbers } from "../../utils/index.js";

export default {
  name: "top-mensagens",
  description: "Mostra o ranking de quem mandou mais mensagens no grupo",
  commands: ["top-mensagens", "top-msg", "ranking-msg", "top"],
  usage: `${PREFIX}top-mensagens [limite] ou ${PREFIX}top-mensagens reset`,
  /**
   * @param {CommandHandleProps} props
   */
  handle: async ({
    args,
    remoteJid,
    sendReply,
    sendSuccessReact,
    isAdmin,
    isBotOwner,
    socket,
  }) => {
    if (!isGroup(remoteJid)) {
      throw new InvalidParameterError(
        "❌ Este comando só pode ser usado em grupo!",
      );
    }

    await sendSuccessReact();

    // Verificar se é para resetar estatísticas
    if (args[0]?.toLowerCase() === "reset") {
      if (!isAdmin && !isBotOwner) {
        throw new InvalidParameterError(
          "❌ Apenas admins podem resetar as estatísticas!",
        );
      }

      resetMessageStats(remoteJid);
      return await sendReply(
        "✅ Estatísticas de mensagens resetadas com sucesso!",
      );
    }

    const limite = validarLimite(args[0]);
    const stats = getMessageStats(remoteJid);

    if (Object.keys(stats).length === 0) {
      return await sendReply(
        "📊 Nenhuma estatística de mensagens encontrada. Comece a mandar mensagens!",
      );
    }

    // Obter ranking ordenado
    const ranked = Object.entries(stats)
      .sort((a, b) => b[1] - a[1])
      .slice(0, limite);

    // Construir mensagem
    const mensagem = construirMensagemRanking(ranked);
    const mentions = ranked.map((entry) => entry[0]);

    await socket.sendMessage(remoteJid, {
      text: mensagem,
      mentions: mentions,
    });
  },
};

/**
 * Valida e retorna o limite de resultados
 * @param {string} argumento - Argumento do usuário
 * @returns {number} Limite validado entre 1 e 100
 */
function validarLimite(argumento) {
  const limite = argumento ? parseInt(onlyNumbers(argumento)) : 10;

  if (isNaN(limite) || limite < 1 || limite > 100) {
    throw new InvalidParameterError(
      "❌ Limite inválido! Use um número entre 1 e 100.",
    );
  }

  return limite;
}

/**
 * Obtém o emoji de posição no ranking
 * @param {number} posicao - Posição no ranking (1-indexed)
 * @returns {string} Emoji correspondente
 */
function obterEmojiPosicao(posicao) {
  const emojiMap = {
    1: "🥇",
    2: "🥈",
    3: "🥉",
  };

  return emojiMap[posicao] || `#${posicao}`;
}

/**
 * Extrai o LID do membro
 * @param {string} memberId - ID do membro
 * @returns {string} LID do membro
 */
function extrairLid(memberId) {
  return memberId;
}

/**
 * Constrói a mensagem formatada do ranking
 * @param {Array} ranked - Array com [memberId, count] ordenado
 * @returns {string} Mensagem formatada
 */
function construirMensagemRanking(ranked) {
  let mensagem = "📊 *TOP MENSAGENS DO GRUPO* 📊\n\n";

  ranked.forEach((entry, index) => {
    const [memberId, count] = entry;
    const posicao = index + 1;
    const emoji = obterEmojiPosicao(posicao);
    const lid = extrairLid(memberId);

    mensagem += `${emoji} @${lid.replace(/@.*/, "")} - ${count} mensagens\n`;
  });

  return mensagem;
}
