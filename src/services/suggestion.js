import { InvalidParameterError, WarningError } from "../errors/index.js";
import {
  addSuggestion,
  deleteSuggestion as dbDeleteSuggestion,
  listSuggestions as dbListSuggestions,
} from "../utils/database.js";

const MIN_LENGTH = 10;
const MAX_LENGTH = 500;

export function submitSuggestion(userLid, text) {
  if (text.length < MIN_LENGTH) {
    throw new InvalidParameterError(
      `A sugestão deve ter no mínimo ${MIN_LENGTH} caracteres.`
    );
  }

  if (text.length > MAX_LENGTH) {
    throw new InvalidParameterError(
      `A sugestão deve ter no máximo ${MAX_LENGTH} caracteres.`
    );
  }

  addSuggestion(userLid, text);
}

export function listSuggestions() {
  return dbListSuggestions();
}

export function deleteSuggestion(id) {
  if (isNaN(id) || id <= 0) {
    throw new InvalidParameterError(
      "O ID da sugestão deve ser um número válido maior que 0."
    );
  }

  const success = dbDeleteSuggestion(id);

  if (!success) {
    throw new WarningError(
      `Não foi encontrada uma sugestão com o ID ${id}. Ela pode não existir ou já ter sido removida!`
    );
  }
}
