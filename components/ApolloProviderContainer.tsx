import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  HttpLink,
  NormalizedCacheObject,
} from '@apollo/client'
import { useEffect, useState } from 'react'

export default function ApolloProviderContainer({ children }) {
  const [apolloClient, setApolloClient] = useState<ApolloClient<NormalizedCacheObject>|null>(null)

  useEffect(() => {
    const authToken = localStorage.getItem('authToken')
    setApolloClient(createApolloClient(authToken))
  }, [])

  if (apolloClient === null) {
    return <>loading...</>
  }

  return <ApolloProvider client={apolloClient}>{children}</ApolloProvider>
}

const createApolloClient = (authToken) => {
  if (authToken) {
    return new ApolloClient({
      link: new HttpLink({
        uri: 'https://ss-hamburger-hack.hasura.app/v1/graphql',
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }),
      cache: new InMemoryCache(),
    })
  } else {
    return new ApolloClient({
      link: new HttpLink({
        uri: 'https://ss-hamburger-hack.hasura.app/v1/graphql',
      }),
      cache: new InMemoryCache(),
    })
  }
}
