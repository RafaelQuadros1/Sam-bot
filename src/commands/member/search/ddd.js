import axios from "axios";
import { PREFIX } from "../../../config.js";
import { InvalidParameterError } from "../../../errors/index.js";
import { errorLog } from "../../../utils/logger.js";

export default {
  name: "ddd",
  description: "Consulta informações de DDD",
  commands: ["ddd"],
  usage: `${PREFIX}ddd 11`,
  /**
   * @param {CommandHandleProps} props
   */
  handle: async ({ args, sendWarningReply, sendSuccessReply }) => {
    const ddd = args[0]?.replace(/\D/g, "");

    if (!ddd || ![2, 3].includes(ddd.length)) {
      throw new InvalidParameterError(
        "Você precisa enviar um DDD válido com 2 ou 3 dígitos!"
      );
    }

    try {
      const response = await axios.get(`https://brasilapi.com.br/api/ddd/v1/${ddd}`);
      const data = response.data;

      if (!data || !data.state) {
        await sendWarningReply("DDD não encontrado!");
        return;
      }

      await sendSuccessReply(`*Informações do DDD*

*DDD*: ${data.ddd}
*Estado*: ${data.state}
*Região*: ${data.region}`);
    } catch (error) {
      errorLog(JSON.stringify(error, null, 2));
      await sendWarningReply("Erro ao consultar DDD. Tente novamente!");
    }
  },
};
