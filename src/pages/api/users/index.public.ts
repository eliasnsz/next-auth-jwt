import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import connectToDatabase from "@/services/database";
import { IUser } from "@/types";
import { authValidate } from "@/services/registerValidation";
import { encrypt } from "@/services/encrypter";

const handler: NextApiHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  const db = await connectToDatabase()
  const allUsers = await db.collection<IUser>("users").find({}).toArray()

  if (req.method === "GET") {
    return res.status(200).json(allUsers)
  }

  if (req.method === "POST") {
    const { name, email, password } = req.body as IUser
    const { message, status_code } = await authValidate({ name, email, password }, "register")

    if (status_code === 201) {
      const encryptedPassword = await encrypt(password) 
      
      await db.collection("users").insertOne({ 
        name: name.toLowerCase(), 
        email: email.toLowerCase(), 
        password: encryptedPassword
      })
      return res.status(status_code).json({ message, status_code })
    } 
    return res.status(status_code).json({ message, status_code })
  }

  return res.status(200).end("")
} 

export default handler