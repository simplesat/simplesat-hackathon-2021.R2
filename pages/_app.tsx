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
  const withAuthentication = Component.withAuthentication || defaultWithAuthentication
  const enhance = compose(getLayout, withAuthentication)

  return enhance(
    <ApolloProviderContainer>
      <Component {...pageProps} />
    </ApolloProviderContainer>
  )
}

function defaultGetLayout(page) {
  return <Layout>{page}</Layout>
}

function defaultWithAuthentication(page) {
  return <WithAuthentication>{page}</WithAuthentication>
}

function compose(...functions: ((value: any) => any)[]) {
  return (value) =>
    functions.reduceRight((previousFunctionOutput, currentFunction) => {
      return currentFunction(previousFunctionOutput)
    }, value)
}
