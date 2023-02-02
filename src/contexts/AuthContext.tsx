import { signInRequest } from "@/services/signInRequest"
import { createContext, FC, useState } from "react"

interface SignInData {
  name: string,
  password: string
}

export const AuthContext = createContext({})

export const AuthProvider: FC = ({ children }: any) => {
  const [user, setUser] = useState({})  

  const isAuthenticated = false

  async function signIn({name, password}: SignInData) {
    const { token, user } = await signInRequest({name, password})
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, signIn }}>
      {children}
    </AuthContext.Provider>
  )
}