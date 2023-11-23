import { ValidationError } from "yup";

interface Erros {
  [key: string]: string;
}

const validateUnform = (err: ValidationError): Erros => {
  const validacaoDeErros: Erros = {};

  err.inner.forEach((error) => {
    if (error.path) {
      validacaoDeErros[error.path] = error.message;
    }
  });

  return validacaoDeErros;
};

export default validateUnform;
