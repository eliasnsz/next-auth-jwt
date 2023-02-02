import bcrypt from "bcrypt"

export async function encrypt(password: string) {
  const salt = await bcrypt.genSalt(10)
  const encryptedPassword = await bcrypt.hash(password, salt)
  
  return encryptedPassword
}