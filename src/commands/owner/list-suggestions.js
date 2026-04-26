import { PREFIX } from "../../config.js";
import { listSuggestionsService } from "../../services/suggestion.js";

export default {
  name: "list-suggestions",
  description: "Lista todas as sugestões recebidas",
  commands: ["list-suggestions", "listar-sugestoes", "sugestoes"],
  usage: `${PREFIX}list-suggestions`,
  /**
   * @param {CommandHandleProps} props
   */
  handle: async ({ sendReply, sendReact }) => {
    const suggestions = listSuggestionsService();
    const total = suggestions.length;

    if (total === 0) {
      await sendReact("📋");
      await sendReply("📋 Nenhuma sugestão recebida ainda.");
      return;
    }

    const formatted = suggestions
      .map((s, i) => {
        const date = new Date(s.createdAt).toLocaleString("pt-BR", {
          timeZone: "America/Sao_Paulo",
        });

        return `${i + 1}️⃣ *@${s.userLid.replace(/@.+/, "")}*\n📝 ${s.text}\n📅 ${date}`;
      })
      .join("\n\n");

    await sendReact("📋");
    await sendReply(
      `📋 *Sugestões Recebidas (Total: ${total})*\n\n${formatted}`
    );
  },
};
