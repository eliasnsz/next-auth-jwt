import { createContext, useContext, useEffect, useState } from "react"
import { setCookie, parseCookies } from "nookies"
import { WithId } from "mongodb"
import { IUser } from "@/types"
import jwt from "jsonwebtoken"
import { api } from "@/services/api"
import Router from "next/router"

interface SignInData {
  name: string,
  password: string
}

interface ContextType {
  isAuthenticated: boolean,
  user: IUser | undefined,
  signIn: (data: SignInData) => Promise<Response>
}

interface signInReturn {
  token?: string,
  user?: IUser,
  message: string,
  status_code: number
}

interface Response {
  message: string,
  status_code: number
}

export const AuthContext = createContext({} as ContextType)

export const AuthProvider = ({ children }: any) => {
  
  const [user, setUser] = useState<IUser | undefined>(undefined)  
  const isAuthenticated = !!user
  
  useEffect(() => {
    const revalidateUser = async () => {
      const { 'session-token': token } = parseCookies()

      if(token) {
        const decodedToken = jwt.decode(token)
        const response = await api.get(`/users/${decodedToken}`)
        const session = response.data 
        setUser(session)
      }
    }
    revalidateUser()
  }, [])

  async function signIn({name, password}: SignInData) {
    
    try {
      const response = await api.post<signInReturn>(`/users/${name}`, { name, password })
      const { token, user, message, status_code } = response.data
      
      setCookie(undefined, "session-token", token as string, {
        maxAge: 60 * 60 * 24 // 24 hours
      })

      setUser(user)
      
      Router.push("/")
      return { message, status_code}

    } catch (err: any) {
      const { message, status_code } = err.response.data

      return { message, status_code}
    }
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, signIn }}>
      {children}
    </AuthContext.Provider>
  )
}

const useSession = () => {
  const context = useContext(AuthContext)
  return context
}

export default useSession