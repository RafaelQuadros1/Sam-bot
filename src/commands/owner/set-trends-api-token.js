import { PREFIX } from "../../config.js";
import { InvalidParameterError } from "../../errors/index.js";
import { setTrendsMcpApiToken } from "../../utils/database.js";

export default {
  name: "set-trends-api-token",
  description: "Define o token da Trends MCP API para o comando twt",
  commands: [
    "set-trends-api-token",
    "altera-trends-api-token",
    "alterar-trends-api-token",
    "muda-trends-api-token",
    "mudar-trends-api-token",
    "trends-api-token",
  ],
  usage: `${PREFIX}set-trends-api-token seu_token_aqui`,
  /**
   * @param {CommandHandleProps} props
   */
  handle: async ({ args, sendSuccessReply }) => {
    if (!args.length) {
      throw new InvalidParameterError(
        "Você deve fornecer um token!\n\nObtenha sua chave gratuita em: https://trendsmcp.ai"
      );
    }

    const newToken = args[0];

    setTrendsMcpApiToken(newToken);

    await sendSuccessReply(
      `Token da Trends MCP API definido com sucesso!\n\nO comando *twt* agora usará a Trends MCP API como fonte primária de trending topics.`
    );
  },
};
