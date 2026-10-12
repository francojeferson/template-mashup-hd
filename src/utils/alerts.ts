import { FormHandles } from "@unform/core";
import get from "lodash/get";
import { RefObject } from "react";

import { ToastOptions, toast } from "react-toastify";
import * as Yup from "yup";
import { ErrorCatch } from "../@types/ErrorCatch";
import validateUnform from "./validate-unform";

// `ReactText` saiu dos tipos do React 19; era o alias de `string | number`,
// que e o que o toast devolve como id.
type ReactText = string | number;

const exibirToastSuccess = (mensagem: string): ReactText =>
  toast.success(mensagem);

const exibirToastWarn = (mensagem: string, config?: ToastOptions): ReactText =>
  toast.warn(mensagem, config);

const exibirErrorCatch = (
  e: unknown,
  formRef?: RefObject<FormHandles>,
): void => {
  if (formRef && e instanceof Yup.ValidationError) {
    const erros = validateUnform(e);
    formRef.current?.setErrors(erros);
    return;
  }

  const err = e as ErrorCatch;
  const message = "Algo deu errado, tente novamente mais tarde";

  if (err?.response && err.response.data.validation) {
    toast.error(get(err, "response.data.validation.body.message", message));

    return;
  }

  if (err.message) {
    toast.error(get(err, "message", message));

    return;
  }

  toast.error(get(err, "response.data.message", message));
};

export default {
  exibirToastSuccess,
  exibirToastWarn,
  exibirErrorCatch,
};
