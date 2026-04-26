import { PREFIX } from "../../config.js";
import { InvalidParameterError } from "../../errors/index.js";
import { removeSuggestionByIdService } from "../../services/suggestion.js";

export default {
  name: "close-suggestion",
  description: "Remove/fecha uma sugestão pelo índice",
  commands: ["close-suggestion", "fechar-sugestao", "remover-sugestao"],
  usage: `${PREFIX}close-suggestion <número>`,
  /**
   * @param {CommandHandleProps} props
   */
  handle: async ({ args, sendSuccessReply, sendReact }) => {
    if (!args.length || !args[0]) {
      throw new InvalidParameterError(
        `Informe o número da sugestão!\n\n📝 *Exemplo:* ${PREFIX}close-suggestion 1`
      );
    }

    const number = parseInt(args[0], 10);

    if (isNaN(number) || number < 1) {
      throw new InvalidParameterError(
        "O número da sugestão deve ser um inteiro positivo."
      );
    }

    removeSuggestionByIdService(number - 1);

    await sendReact("✅");
    await sendSuccessReply(`✅ Sugestão #${number} removida com sucesso!`);
  },
};
