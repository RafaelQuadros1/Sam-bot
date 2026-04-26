import { delay } from "baileys";
import { PREFIX } from "../../config.js";
import { listSuggestions } from "../../services/suggestion.js";
import { readMore } from "../../utils/index.js";

export default {
  name: "listar-sugestoes",
  description: "Lista todas as sugestões enviadas",
  commands: ["listar-sugestoes", "list-suggestions", "sugestoes"],
  usage: `${PREFIX}listar-sugestoes`,
  /**
   * @param {CommandHandleProps} props
   */
  handle: async ({ sendSuccessReply, sendWaitReact }) => {
    await sendWaitReact();
    await delay(1000);

    const suggestions = listSuggestions();

    if (suggestions.length === 0) {
      await sendSuccessReply("Não há sugestões cadastradas no momento.");
      return;
    }

    let message = `*💡 Lista de Sugestões*\n\n${readMore()}`;

    suggestions.forEach((suggestion, index) => {
      const id = index + 1;
      const date = new Date(suggestion.createdAt).toLocaleString("pt-BR");
      message += `*${id}.* ${suggestion.text}\n`;
      message += `   👤 ${suggestion.userLid}\n`;
      message += `   📅 ${date}\n\n`;
    });

    message += `_Total: ${suggestions.length} sugestão(ões) cadastrada(s)_`;

    await sendSuccessReply(message);
  },
};
