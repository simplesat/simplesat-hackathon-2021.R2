import '../styles/globals.css'
import '../styles/tailwind.css'
import firebase from 'firebase'
import ApolloProviderContainer from 'components/ApolloProviderContainer'

const firebaseConfig = {
  apiKey: 'AIzaSyAfDEFfVhfTl7RDAIQk7nUQH6Gy2nNysl4',
  authDomain: 'simplesat-hackathon-2021-r2.firebaseapp.com',
  projectId: 'simplesat-hackathon-2021-r2',
  storageBucket: 'simplesat-hackathon-2021-r2.appspot.com',
  messagingSenderId: '9642564451',
  appId: '1:9642564451:web:7c3f455b77c6e5b0db1156',
}

if (firebase.apps.length === 0) {
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig)
}

function MyApp({ Component, pageProps }) {
  return (
    <ApolloProviderContainer>
      <Component {...pageProps} />
    </ApolloProviderContainer>
  )
}

export default MyApp
