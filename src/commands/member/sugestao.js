import { PREFIX } from "../../config.js";
import { InvalidParameterError } from "../../errors/index.js";
import { addSuggestion } from "../../utils/database.js";

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

    const minLength = 10;
    const maxLength = 500;

    if (fullArgs.length < minLength) {
      throw new InvalidParameterError(
        `A sugestão deve ter no mínimo ${minLength} caracteres.`
      );
    }

    if (fullArgs.length > maxLength) {
      throw new InvalidParameterError(
        `A sugestão deve ter no máximo ${maxLength} caracteres.`
      );
    }

    addSuggestion(userLid, fullArgs);

    await sendReact("💡");
    await sendSuccessReply(
      `✅ Sugestão recebida com sucesso!\n\n💡 *Sua sugestão:*\n${fullArgs}\n\nObrigado pelo feedback! 🙏`
    );
  },
};
