import { PREFIX } from "../../config.js";
import { InvalidParameterError } from "../../errors/index.js";
import { submitSuggestion } from "../../services/suggestion.js";

export default {
  name: "sugestao",
  description: "Envie uma sugestão para os desenvolvedores do bot",
  commands: ["sugestao", "sugestão", "suggest"],
  usage: `${PREFIX}sugestao <sua sugestão>`,
  /**
   * @param {CommandHandleProps} props
   */
  handle: async ({ fullArgs, sendSuccessReply, sendReact, userLid }) => {
    if (!fullArgs) {
      throw new InvalidParameterError(
        `Por favor, informe sua sugestão!\n\n📝 *Exemplo:* ${PREFIX}sugestao adicionar comando de clima`
      );
    }

    submitSuggestion(userLid, fullArgs);

    await sendReact("💡");
    await sendSuccessReply(
      `✅ Sugestão recebida com sucesso!\n\n💡 *Sua sugestão:*\n${fullArgs}\n\nObrigado pelo feedback! 🙏`
    );
  },
};
