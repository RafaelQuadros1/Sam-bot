import { PREFIX } from "../../config.js";
import { InvalidParameterError } from "../../errors/index.js";
import { deleteSuggestion } from "../../services/suggestion.js";

export default {
  name: "deletar-sugestao",
  description: "Deleta uma sugestão específica pelo ID",
  commands: ["deletar-sugestao", "delete-suggestion", "remover-sugestao"],
  usage: `${PREFIX}deletar-sugestao <id>`,
  /**
   * @param {CommandHandleProps} props
   */
  handle: async ({ args, prefix, sendSuccessReply, sendReact }) => {
    if (args.length !== 1) {
      throw new InvalidParameterError(`Você deve informar o ID da sugestão a ser removida:

${prefix}deletar-sugestao 1

Use ${prefix}listar-sugestoes para ver todos os IDs`);
    }

    const id = parseInt(args[0]);

    deleteSuggestion(id);

    await sendReact("🗑️");
    await sendSuccessReply(
      `✅ Sugestão com ID *${id}* removida com sucesso!`
    );
  },
};
