// uncomment the following line to use why-did-you-render
// import 'wdyr'
import '../styles/globals.css'
import '../styles/tailwind.css'
import '../setup/initialize-firebase'
import '@fortawesome/fontawesome-svg-core/styles.css'

import ApolloProviderContainer from 'components/ApolloProviderContainer'
import WithAuthentication from '../libs/authentication'
import Layout from 'components/Layout'
import React from 'react'

export default function MyApp({ Component, pageProps }) {
  const getLayout = Component.getLayout || defaultGetLayout

  return getLayout(
    <WithAuthentication>
      <ApolloProviderContainer>
        <Component {...pageProps} />
      </ApolloProviderContainer>
    </WithAuthentication>
  )
}

function defaultGetLayout(page) {
  return <Layout>{page}</Layout>
}
