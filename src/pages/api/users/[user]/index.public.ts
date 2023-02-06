import jwt from "jsonwebtoken"
import connectToDatabase from "@/services/database";
import { IUser } from "@/types";
import bcrypt from "bcrypt"
import { NextApiRequest, NextApiResponse } from "next";
import { parseCookies } from "nookies"
import { ObjectId } from "mongodb";

interface SignInData {
  name: string,
  password: string
}

const jwtSecret = process.env.JWT_SECRET as string

const handler = async (req: NextApiRequest, res: NextApiResponse) => {

  if (req.method === "GET") {

    const db = await connectToDatabase()
    const { user } = req.query
    
    const { "session-token": token } = parseCookies(res)
    
    if (token) {
      const userId = jwt.decode(token) as string
      const userFinded = await db.collection<IUser>("users").findOne({ _id: new ObjectId(userId)}, {projection: { password: 0 }  })
    
      if (user === userFinded?.name || user == userFinded?._id) {
        return res.status(200).json(userFinded)
      }
      
      return res.status(200).json([])
    }

    return res.status(200).json([])
  } 

  if (req.method === "POST") {
    const { name, password }: SignInData = req.body

    const db = await connectToDatabase()
    const userFinded = await db.collection<IUser>("users").findOne({ name: name })

    if (!userFinded) {
      return res.status(404).json({
        message: "Usuário inexistente",
        status_code: 404
      })
    }

    const encryptedPassword = userFinded.password
    const isMatch = await bcrypt.compare(password, encryptedPassword)

    if (!isMatch) {
      return res.status(401).json({
        message: "Senha incorreta",
        status_code: 401
      })
    }

    const token = jwt.sign(userFinded._id.toString() , jwtSecret, { algorithm: "HS256" })

    return res.status(200).json({ token, user: userFinded})
  }

  return res.status(200).end()
}

export default handler  