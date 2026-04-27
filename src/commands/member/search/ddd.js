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

    if (!ddd || ddd.length !== 2) {
      throw new InvalidParameterError(
        "Você precisa enviar um DDD válido com 2 dígitos! Exemplo: 11",
      );
    }

    try {
      const response = await axios.get(
        `https://brasilapi.com.br/api/ddd/v1/${ddd}`,
      );
      const data = response.data;

      const citiesList =
        data.cities.slice(0, 10).join(", ") +
        (data.cities.length > 10
          ? ` e mais ${data.cities.length - 10}...`
          : "");

      await sendSuccessReply(`*Informações do DDD*

*DDD*: ${data.state}${data.state !== ddd ? " " + ddd : ""}
*Estado*: ${data.state}
*Cidades*: ${citiesList}`);
    } catch (error) {
      errorLog(JSON.stringify(error, null, 2));

      if (error.response?.status === 400) {
        await sendWarningReply("DDD inválido! Use apenas 2 dígitos.");
        return;
      }

      if (error.response?.status === 404) {
        await sendWarningReply("DDD não encontrado!");
        return;
      }

      if (error.response?.status === 500) {
        await sendWarningReply("Serviço de DDD indisponível. Tente novamente!");
        return;
      }

      await sendWarningReply("Erro ao consultar DDD. Tente novamente!");
    }
  },
};
