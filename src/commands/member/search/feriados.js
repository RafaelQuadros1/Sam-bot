import axios from "axios";
import { PREFIX } from "../../../config.js";
import { InvalidParameterError } from "../../../errors/index.js";
import { errorLog } from "../../../utils/logger.js";

export default {
  name: "feriados",
  description: "Lista feriados do Brasil",
  commands: ["feriados"],
  usage: `${PREFIX}feriados [ano]`,
  /**
   * @param {CommandHandleProps} props
   */
  handle: async ({ args, sendWarningReply, sendSuccessReply }) => {
    let year = new Date().getFullYear().toString();

    if (args[0]) {
      year = args[0];
      if (!/^\d{4}$/.test(year)) {
        throw new InvalidParameterError(
          "Ano inválido! Use o formato YYYY (ex: 2024)"
        );
      }
    }

    try {
      const response = await axios.get(
        `https://brasilapi.com.br/api/feriados/v1/${year}`
      );
      const feriados = response.data;

      if (!feriados || feriados.length === 0) {
        await sendWarningReply(`Nenhum feriado encontrado para ${year}!`);
        return;
      }

      let message = `*Feriados de ${year}*\n\n`;
      feriados.forEach((feriado) => {
        message += `📅 *${feriado.date}* - ${feriado.name}\n`;
      });

      await sendSuccessReply(message);
    } catch (error) {
      errorLog(JSON.stringify(error, null, 2));
      await sendWarningReply("Erro ao consultar feriados. Tente novamente!");
    }
  },
};
