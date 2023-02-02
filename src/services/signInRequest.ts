import { IUser } from "@/types"
import connectToDatabase from "./database"
import bcrypt from "bcrypt"

interface SignInData {
  name: string,
  password: string
}

export const signInRequest = async ({name, password}: SignInData) => {

  const db = await connectToDatabase()

  const userFinded = await db.collection<IUser>("users").findOne({ name: name })

  if (!userFinded) {
    return {
      message: "Usuário inexistente",
      status_code: 404
    }
  }
  
  const encryptedPassword = userFinded.password
  const isMatch = bcrypt.compare(password, encryptedPassword)

  if (!isMatch) {
    return {
      message: "Senha incorreta",
      status_code: 401
    }
  }
  
  return {
    user: userFinded,
    token
  } 
}