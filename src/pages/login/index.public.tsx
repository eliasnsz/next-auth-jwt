import { api } from "@/services/api"
import { Container, FormLabel, Input, Button, Text, Heading } from "@chakra-ui/react"
import Router from "next/router"
import { FormEvent, useState } from "react"

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

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault()
    setIsSending(true)

    const eventTarget = e.target as IEventTarget
    const name = eventTarget.name.value
    const password = eventTarget.password.value
    
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