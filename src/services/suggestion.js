/**
 * Serviço de sugestões.
 * Encapsula toda a lógica de negócio relacionada a sugestões.
 *
 * @author Dev Gui
 */
import { InvalidParameterError, WarningError } from "../errors/index.js";
import { PREFIX } from "../config.js";
import {
  addSuggestion,
  listSuggestions,
  removeSuggestionById,
} from "../utils/database.js";

const MIN_LENGTH = 10;
const MAX_LENGTH = 500;

export function addSuggestionService(userLid, text) {
  if (!text || !text.trim()) {
    throw new InvalidParameterError("Por favor, informe sua sugestão!");
  }

  const trimmed = text.trim();

  if (trimmed.length < MIN_LENGTH) {
    throw new InvalidParameterError(
      `A sugestão deve ter no mínimo ${MIN_LENGTH} caracteres.`
    );
  }

  if (trimmed.length > MAX_LENGTH) {
    throw new InvalidParameterError(
      `A sugestão deve ter no máximo ${MAX_LENGTH} caracteres.`
    );
  }

  addSuggestion(userLid, trimmed);
}

export function listSuggestionsService() {
  return listSuggestions();
}

export function getSuggestionById(index) {
  const suggestions = listSuggestions();
  const item = suggestions[index];

  if (!item) {
    return null;
  }

  return item;
}

export function removeSuggestionByIdService(index) {
  const suggestions = listSuggestions();

  if (index < 0 || index >= suggestions.length) {
    throw new WarningError(
      `Sugestão #${index + 1} não encontrada. Use ${PREFIX}list-suggestions para ver as sugestões disponíveis.`
    );
  }

  removeSuggestionById(index);
}

export function getSuggestionCount() {
  return listSuggestions().length;
}
