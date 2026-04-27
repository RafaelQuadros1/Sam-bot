import axios from "axios";
import { PREFIX } from "../../../config.js";
import { InvalidParameterError } from "../../../errors/index.js";
import { errorLog } from "../../../utils/logger.js";

export default {
  name: "bancos",
  description: "Consulta informações de bancos brasileiros",
  commands: ["bancos"],
  usage: `${PREFIX}bancos <codigo>`,
  /**
   * @param {CommandHandleProps} props
   */
  handle: async ({ args, sendWarningReply, sendSuccessReply }) => {
    const codigo = args[0]?.replace(/\D/g, "");

    if (!codigo) {
      throw new InvalidParameterError(
        "Você precisa enviar o código do banco! Exemplo: 001 (Banco do Brasil)",
      );
    }

    try {
      const response = await axios.get(
        `https://brasilapi.com.br/api/banks/v1/${codigo}`,
      );
      const banco = response.data;

      await sendSuccessReply(`*Informações do Banco*

*Código*: ${banco.code}
*Nome*: ${banco.name}
*Nome Completo*: ${banco.fullName}
*ISPB*: ${banco.ispb}`);
    } catch (error) {
      errorLog(JSON.stringify(error, null, 2));

      if (error.response?.status === 404) {
        await sendWarningReply("Código bancário não encontrado!");
        return;
      }

      await sendWarningReply("Erro ao consultar banco. Tente novamente!");
    }
  },
};
