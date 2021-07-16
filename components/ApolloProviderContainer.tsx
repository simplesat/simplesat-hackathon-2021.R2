import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  HttpLink,
  NormalizedCacheObject,
} from '@apollo/client'
import { withRouter } from 'next/router'
import { useEffect, useState } from 'react'

import { useAuthentication } from 'libs/authentication'

export default withRouter(ApolloProviderContainer)
function ApolloProviderContainer({ children, router }) {
  const [apolloClient, setApolloClient] = useState<ApolloClient<NormalizedCacheObject> | null>(null)
  const { token } = useAuthentication()

  useEffect(() => {
    if (router.pathname.startsWith('/rating')) {
      setApolloClient(createApolloClient(null))
    } else {
      setApolloClient(createApolloClient(token))
    }
  }, [router.pathname, token])

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
