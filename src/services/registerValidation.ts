import { IUser } from "@/types"
import connectToDatabase from "./database"

interface IData {
  name: string,
  email: string,
  password: string,
}

type IAction = "register" | "login"

export interface IValidator {
  message: string,
  status_code: number
}

export const authValidate = async ({name, email, password}: IData, action: IAction) => {

  const db = await connectToDatabase()
  const allUsers = await db.collection<IUser>("users").find({}).toArray()

  if (action === "register") {

    const existentUsernames = allUsers.map(user => user.name.toLowerCase())
    const existentEmail = allUsers.map(user => user.email.toLowerCase())
    
    if (!name.length) {
      return {
        message: "O campo 'nome de usuário' é obrigatório",
        status_code: 400
      }
    }
    if (!email.length) {
      return {
        message: "O campo 'email' é obrigatório",
        status_code: 400
      }
    }
    if (!password.length) {
      return {
        message: "O campo 'senha' é obrigatório",
        status_code: 400
      }
    }
    if (name.length < 4) {
      return {
        message: "O nome de usuário deve conter no mínimo 4 caracteres",
        status_code: 400
      }
    }
    if (password.length < 8) {
      return {
        message: "A senha deve conter no mínimo 8 caracteres",
        status_code: 400
      }
    }
    if(!isAlphaNumeric(name)) {
      return {
        message: "O nome de usuário deve conter somente caracteres alfanuméricos",
        status_code: 400
      }
    }
    if (existentUsernames.includes(name.toLowerCase())) {
      return {
        message: "O nome de usuário fornecido já existe",
        status_code: 400
      }
    }
    if (existentEmail.includes(email.toLowerCase())) {
      return {
        message: "O email fornecido já existe",
        status_code: 400
      }
    }
  }

  return {
    message: "Conta criada com sucesso!",
    status_code: 201
  }
}

function isAlphaNumeric(str: string) {
  var code, i, len;

  for (i = 0, len = str.length; i < len; i++) {
    code = str.charCodeAt(i);
    if (!(code > 47 && code < 58) && // números (0-9)
        !(code > 64 && code < 91) && // letras maiúsculas (A-Z)
        !(code > 96 && code < 123)) { // letras minúsculas (a-z)
      return false;
    }
  }
  return true;
};