import inputmask from "inputmask";
import { Mask } from "../@types/Mask";
import getInputById from "./get-input-by-id";

const maskCpf = () => inputmask({ mask: ["999.999.999-99"] });
const maskCnpj = () => inputmask({ mask: ["99.999.999/9999-99"] });
const maskCep = () => inputmask({ mask: ["99.999-999"] });
const maskDate = () => inputmask({ mask: ["99/99/9999"] });
const maskPhone = () =>
  inputmask({ mask: ["(99) 9999-9999", "(99) 99999-9999"] });
const maskCard = () => inputmask({ mask: ["9999 9999 9999 9999"] });

const setMask = (id: string, mask?: Mask) => {
  switch (mask) {
    case "cpf":
      maskCpf().mask(getInputById(id));
      break;

    case "cnpj":
      maskCnpj().mask(getInputById(id));
      break;

    case "cep":
      maskCep().mask(getInputById(id));
      break;

    case "date":
      maskDate().mask(getInputById(id));
      break;

    case "phone":
      maskPhone().mask(getInputById(id));
      break;

    case "card":
      maskCard().mask(getInputById(id));
      break;

    default:
      break;
  }
};

export default setMask;
