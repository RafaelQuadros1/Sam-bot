import axios from "axios";
import { PREFIX } from "../../../config.js";
import { InvalidParameterError } from "../../../errors/index.js";
import { errorLog } from "../../../utils/logger.js";

export default {
  name: "cnpj",
  description: "Consulta dados de CNPJ",
  commands: ["cnpj"],
  usage: `${PREFIX}cnpj 34028316000152`,
  /**
   * @param {CommandHandleProps} props
   */
  handle: async ({ args, sendWarningReply, sendSuccessReply }) => {
    const cnpj = args.join("").replace(/\D/g, "");

    if (!cnpj || cnpj.length !== 14) {
      throw new InvalidParameterError(
        "Você precisa enviar um CNPJ válido com 14 dígitos!"
      );
    }

    try {
      const response = await axios.get(
        `https://api.cnpja.com/office/${cnpj}`
      );

      const data = response.data.data;

      if (!data) {
        await sendWarningReply("CNPJ não encontrado!");
        return;
      }

      await sendSuccessReply(`*Resultado da Consulta CNPJ*

*Razão Social*: ${data.name}
*CNPJ*: ${data.document}
*Situação*: ${data.status}
*Data de Abertura*: ${data.founded_at}
*Município*: ${data.city}
*Estado*: ${data.state}
*Ramo*: ${data.company_type}`);
    } catch (error) {
      errorLog(JSON.stringify(error, null, 2));
      await sendWarningReply("Erro ao consultar CNPJ. Tente novamente!");
    }
  },
};
