import '../styles/globals.css'
import '../styles/tailwind.css'
import '../setup/initialize-firebase'

import ApolloProviderContainer from 'components/ApolloProviderContainer'
import Layout from 'components/Layout'

export default function MyApp({ Component, pageProps }) {
  const getLayout = Component.getLayout || defaultGetLayout
  
  return getLayout(
    <ApolloProviderContainer>
      <Component {...pageProps} />
    </ApolloProviderContainer>
  )
}

function defaultGetLayout(page) {
  return <Layout>{page}</Layout>
}
