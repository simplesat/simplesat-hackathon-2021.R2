import { ApolloClient, ApolloProvider, InMemoryCache, HttpLink } from '@apollo/client'
import { useEffect, useState } from 'react'

export default function ApolloProviderContainer({ children }) {
  const [apolloClient, setApolloClient] = useState(null)

  useEffect(() => {
    const authToken = localStorage.getItem('authToken')
    if (authToken) {
      setApolloClient(createApolloClient(authToken))
    }
  }, [])

  if (apolloClient === null) {
    return 'loading...'
  }

  return <ApolloProvider client={apolloClient}>{children}</ApolloProvider>
}

const createApolloClient = (authToken) => {
  return new ApolloClient({
    link: new HttpLink({
      uri: 'https://ss-hamburger-hack.hasura.app/v1/graphql',
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    }),
    cache: new InMemoryCache(),
  })
}
