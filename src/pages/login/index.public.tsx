import useSession, { AuthContext } from "@/contexts/AuthContext"
import { Container, FormLabel, Input, Button, Text, Heading } from "@chakra-ui/react"
import { FormEvent, useContext, useState } from "react"

type Props = {}

interface IEventTarget extends EventTarget {
  name: {
    value: string,
  },
  password: {
    value: string,
  },
}

function Login({}: Props) {

  const [globalError, setGlobalError] = useState<string | undefined>(undefined)
  const [isSending, setIsSending] = useState(false)

  const { signIn } = useSession()

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault()
    setIsSending(true)

    const eventTarget = e.target as IEventTarget
    const name = eventTarget.name.value
    const password = eventTarget.password.value
    
    const { message, status_code } = await signIn({name, password})

    if (status_code >= 400 && status_code < 500) {
      setGlobalError(message)
      setIsSending(false)
      return
    }
    
    setIsSending(false)
    return
  }
  
  return (
    <Container mt="10vh">
      <Heading mb={8} fontWeight="500">Fazer login</Heading>
      <form onSubmit={handleRegister}>
        <FormLabel w="100%">
          Nome de usuario:
          <Input 
            type="username" 
            name="name"
            onChange={() => setGlobalError(undefined)}
          />
        </FormLabel>
        <FormLabel w="100%">
          Senha:
          <Input 
            type="password" 
            name="password"
            onChange={() => setGlobalError(undefined)}
          />
        </FormLabel>

        {globalError && 
          <Text fontWeight="600" color="red.400">
            {globalError }
          </Text>
        }

        <Button 
          mt={4} 
          w="100%" 
          type="submit" 
          bg="#be2ed6"
          isDisabled={isSending}
          isLoading={isSending}
        >
          Cadastrar
        </Button>
      </form>
    </Container>
  )
}

export default Login