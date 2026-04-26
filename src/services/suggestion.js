import { InvalidParameterError } from "../errors/index.js";
import { addSuggestion } from "../utils/database.js";

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
