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
        "Você precisa enviar um CNPJ válido com 14 dígitos!",
      );
    }

    try {
      const response = await axios.get(
        `https://brasilapi.com.br/api/cnpj/v1/${cnpj}`,
      );

      const data = response.data;

      const endereco = `${data.logradouro}, ${data.numero}${data.complemento ? ` - ${data.complemento}` : ""} - ${data.bairro}, ${data.municipio} - ${data.uf} ${data.cep}`;

      await sendSuccessReply(`*Resultado da Consulta CNPJ*

*Razão Social*: ${data.razao_social}
*Nome Fantasia*: ${data.nome_fantasia || "Não informado"}
*CNPJ*: ${data.cnpj}
*Situação*: ${data.descricao_situacao_cadastral}
*Natureza Jurídica*: ${data.natureza_juridica}
*Porte*: ${data.porte}
*Data de Início*: ${data.data_inicio_atividade}

*📍 Endereço*
${endereco}

*☎️ Contato*
${data.ddd_telefone_1 ? `Telefone: ${data.ddd_telefone_1}` : "Telefone: Não informado"}
Email: ${data.email || "Não informado"}

*🏢 Atividade Principal*
${data.cnae_fiscal_descricao}`);
    } catch (error) {
      errorLog(JSON.stringify(error, null, 2));

      if (error.response?.status === 400) {
        await sendWarningReply("CNPJ inválido! Verifique o formato.");
        return;
      }

      if (error.response?.status === 404) {
        await sendWarningReply("CNPJ não encontrado!");
        return;
      }

      await sendWarningReply("Erro ao consultar CNPJ. Tente novamente!");
    }
  },
};
