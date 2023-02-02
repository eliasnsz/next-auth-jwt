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
  email: {
    value: string,
  }
}

function Cadastro({}: Props) {

  const [globalError, setGlobalError] = useState<string | undefined>(undefined)
  const [isSending, setIsSending] = useState(false)

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault()
    setIsSending(true)

    const eventTarget = e.target as IEventTarget
    const name = eventTarget.name.value
    const email = eventTarget.email.value
    const password = eventTarget.password.value

    try {
      const response = await api.post("/users", { name, email, password})
      await Router.push("/login")
      setIsSending(false)

    } catch (error: any) {
      const { message, status_code } = error.response.data
      setGlobalError(message)
      setIsSending(false)
    }
    
  }
  
  return (
    <Container mt="10vh">
      <Heading mb={8} fontWeight="500">Cadastro</Heading>
      <form onSubmit={handleRegister}>
        <FormLabel w="100%">
          Nome de usuario:
          <Input 
            type="username" 
            mt={2}
            name="name"
            onChange={() => setGlobalError(undefined)}
          />
        </FormLabel>
        <FormLabel w="100%">
          Email:
          <Input 
            type="email" 
            mt={2}
            name="email"
            onChange={() => setGlobalError(undefined)}
          />
        </FormLabel>
        <FormLabel w="100%">
          Senha:
          <Input 
            type="password" 
            mt={2}
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
          _hover={{
            bg: "#7600bc"
          }}
          isDisabled={isSending}
          isLoading={isSending}
        >
          Cadastrar
        </Button>
      </form>
    </Container>
  )
}

export default Cadastro