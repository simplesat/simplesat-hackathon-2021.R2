import SendEmailContainer from 'components/SendEmailContainer'
import Head from 'next/head'

export default function SendEmail() {
  return (
    <>
      <Head>
        <title>Send email</title>
        <meta property="og:title" content="Send email" key="title" />
      </Head>
      <h1>Send email</h1>
      <SendEmailContainer />
    </>
  )
}
