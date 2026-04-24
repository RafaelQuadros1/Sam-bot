/**
 * @author RafaelQuadros1
 */
import axios from "axios";
import { PREFIX } from "../../config.js";
import { InvalidParameterError, WarningError } from "../../errors/index.js";
import { getTrendsMcpApiToken } from "../../utils/database.js";
import { errorLog } from "../../utils/logger.js";

const TRENDSTOOLS_BASE_URL = "https://trendstools.net/json/twitter";
const TRENDS_MCP_API_URL = "https://api.trendsmcp.ai/mcp";

const COUNTRY_MAP = {
  brasil: "brazil",
  brazil: "brazil",
  br: "brazil",
  mundial: "worldwide",
  mundo: "worldwide",
  worldwide: "worldwide",
  global: "worldwide",
  argentina: "argentina",
  ar: "argentina",
  mexico: "mexico",
  méxico: "mexico",
  mx: "mexico",
  eua: "united-states",
  usa: "united-states",
  "estados-unidos": "united-states",
  "estados unidos": "united-states",
  us: "united-states",
  portugal: "portugal",
  pt: "portugal",
  espanha: "spain",
  spain: "spain",
  es: "spain",
  colombia: "colombia",
  co: "colombia",
  chile: "chile",
  cl: "chile",
  peru: "peru",
  pe: "peru",
  venezuela: "venezuela",
  ve: "venezuela",
  canada: "canada",
  ca: "canada",
  reino_unido: "united-kingdom",
  "reino unido": "united-kingdom",
  "united-kingdom": "united-kingdom",
  uk: "united-kingdom",
  franca: "france",
  frança: "france",
  france: "france",
  fr: "france",
  alemanha: "germany",
  germany: "germany",
  de: "germany",
  italia: "italy",
  itália: "italy",
  italy: "italy",
  it: "italy",
  japao: "japan",
  japão: "japan",
  japan: "japan",
  jp: "japan",
  coreia: "korea",
  korea: "korea",
  kr: "korea",
  india: "india",
  índia: "india",
  in: "india",
  australia: "australia",
  au: "australia",
};

// Mapeamento de código de país interno para ISO 2 (para a Trends MCP API)
const COUNTRY_TO_ISO2 = {
  brazil: "BR",
  argentina: "AR",
  mexico: "MX",
  "united-states": "US",
  portugal: "PT",
  spain: "ES",
  colombia: "CO",
  chile: "CL",
  peru: "PE",
  venezuela: "VE",
  canada: "CA",
  "united-kingdom": "GB",
  france: "FR",
  germany: "DE",
  italy: "IT",
  japan: "JP",
  korea: "KR",
  india: "IN",
  australia: "AU",
};

function normalizeCountry(input) {
  const lower = input
    .toLowerCase()
    .trim()
    .replace(/\s+/g, " ")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
  return COUNTRY_MAP[lower] || null;
}

function toTitleCase(str) {
  return str
    .split(/[-\s]+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function formatNumber(num) {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M";
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + "K";
  }
  return num.toString();
}

function buildTrendLines(trendsList) {
  return trendsList
    .slice(0, 10)
    .map((item, index) => {
      const name = item.name || item.trend || item.keyword || item.title || null;

      if (!name || typeof name !== "string") {
        return null;
      }

      const volume =
        item.tweet_volume ||
        item.tweetVolume ||
        item.mentions ||
        item.volume ||
        null;

      const volumeText = volume
        ? ` - ${formatNumber(Number(volume))} menções`
        : "";

      const tag = name.startsWith("#") ? name : `#${name}`;
      const emoji = String.fromCodePoint(0x31 + index) + "\ufe0f\u20e3";

      return `${emoji} ${tag}${volumeText}`;
    })
    .filter(Boolean)
    .join("\n");
}

async function fetchFromTrendsMcp(countryCode) {
  const token = getTrendsMcpApiToken();

  if (!token) {
    return null;
  }

  const args = {
    source: "twitter",
    limit: 20,
  };

  const iso2 = COUNTRY_TO_ISO2[countryCode];
  if (iso2) {
    args.country = iso2;
  }

  const { data } = await axios.post(
    TRENDS_MCP_API_URL,
    {
      jsonrpc: "2.0",
      id: Date.now().toString(),
      method: "tools/call",
      params: {
        name: "get_top_trends",
        arguments: args,
      },
    },
    {
      timeout: 15000,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    }
  );

  // Extrair conteúdo da resposta MCP
  const content = data?.result?.content;
  if (!content || !Array.isArray(content) || content.length === 0) {
    return null;
  }

  // O conteúdo pode ser JSON ou texto
  const textContent = content[0]?.text;
  if (!textContent) {
    return null;
  }

  // Tentar parsear como JSON estruturado
  try {
    const parsed = JSON.parse(textContent);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    if (parsed?.trends && Array.isArray(parsed.trends)) {
      return parsed.trends;
    }
    if (parsed?.data && Array.isArray(parsed.data)) {
      return parsed.data;
    }
  } catch {
    // Resposta não é JSON — processar como texto linha a linha
  }

  // Processar como texto com uma tendência por linha
  const lines = textContent
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  if (lines.length === 0) {
    return null;
  }

  return lines.map((line) => {
    // Remover numeração como "1. ", "1) ", "#1 " etc.
    const clean = line.replace(/^[#]?[\d]+[.\)\s]\s*/, "").trim();
    return { name: clean };
  });
}

async function fetchFromTrendsTools(countryCode) {
  const apiUrl = `${TRENDSTOOLS_BASE_URL}/${countryCode}`;

  const { data } = await axios.get(apiUrl, {
    timeout: 15000,
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    },
  });

  if (!data || (Array.isArray(data) && data.length === 0)) {
    return null;
  }

  return Array.isArray(data) ? data : [data];
}

export default {
  name: "twt",
  description: "Busca os trending topics (assuntos do momento) no X.com",
  commands: ["twt", "trending", "trends", "trendingtwitter"],
  usage: `${PREFIX}twt <país> (ex: ${PREFIX}twt brasil ou ${PREFIX}twt worldwide)`,
  /**
   * @param {CommandHandleProps} props
   */
  handle: async ({
    args,
    sendReply,
    sendWaitReact,
    sendSuccessReact,
    sendErrorReply,
  }) => {
    const countryInput = args[0] ? args[0].trim() : "worldwide";
    const countryCode = normalizeCountry(countryInput);

    if (!countryCode) {
      throw new InvalidParameterError(
        `País *"${countryInput}"* não encontrado!\n\nExemplos válidos: brasil, worldwide, argentina, mexico, eua, portugal, espanha, chile, colombia, peru`
      );
    }

    await sendWaitReact();

    try {
      let trendsList = null;

      // Tentar Trends MCP API como fonte primária
      try {
        trendsList = await fetchFromTrendsMcp(countryCode);
      } catch (mcpError) {
        errorLog(
          `Trends MCP API falhou para ${countryCode}: ${mcpError.message}`
        );
      }

      // Fallback para trendstools.net
      if (!trendsList || trendsList.length === 0) {
        try {
          trendsList = await fetchFromTrendsTools(countryCode);
        } catch (trendsToolsError) {
          errorLog(
            `trendstools.net falhou para ${countryCode}: ${trendsToolsError.message}`
          );
        }
      }

      if (!trendsList || trendsList.length === 0) {
        throw new WarningError(
          "Não foi possível obter os trending topics no momento. Tente novamente mais tarde."
        );
      }

      const lines = buildTrendLines(trendsList);

      if (!lines) {
        throw new WarningError(
          "Não foi possível processar os trending topics."
        );
      }

      const countryLabel = toTitleCase(countryCode);

      await sendSuccessReact();

      await sendReply(`🔥 *Assuntos do Momento — ${countryLabel}*\n\n${lines}`);
    } catch (error) {
      if (
        error instanceof WarningError ||
        error instanceof InvalidParameterError
      ) {
        throw error;
      }

      errorLog(`Erro no comando /twt: ${error.message}`);

      await sendErrorReply(
        "Erro ao buscar trending topics. Tente novamente mais tarde."
      );
    }
  },
};

