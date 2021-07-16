import { useRouter } from 'next/router'
import { useContext, useEffect, useState } from 'react'
import firebase from 'firebase'
import React from 'react'

export { useAuthentication }

type AuthenticationState = {
  user: any
  token: string | null
}

export default function WithAuthentication({ children }) {
  const router = useRouter()
  const [authenticationState, setAuthenticationState] = useState<AuthenticationState>({
    user: undefined,
    token: null,
  })

  useEffect(() => {
    let unregisterFirestoreObserver
    const unregisterAuthObserver = firebase.auth().onAuthStateChanged(async (user) => {
      if (user) {
        user.getIdToken(true).then(function (token) {
          console.log('token', token)
          const tokenPayload = extractTokenPayload(token)
          const hasHasuraClaim = Boolean(tokenPayload['https://hasura.io/jwt/claims'])
          if (hasHasuraClaim) {
            setAuthenticationState({
              user,
              token,
            })
          } else {
            if (unregisterFirestoreObserver) {
              return
            }
            const db = firebase.firestore()
            unregisterFirestoreObserver = db.doc(`metadata/${user.uid}`).onSnapshot((doc) => {
              if (doc.data()) {
                user.getIdToken(true).then((token) => {
                  setAuthenticationState({
                    user,
                    token,
                  })
                })
              }
            })
          }
        })
      } else {
        setAuthenticationState({
          user: null,
          token: null,
        })
      }
    })

    return () => {
      unregisterAuthObserver()
      if (unregisterFirestoreObserver) {
        unregisterFirestoreObserver()
      }
    }
  }, [])

  useEffect(() => {
    const isUserSignedOut = authenticationState.user === null
    if (isUserSignedOut) {
      router.push('/login')
    }
  }, [authenticationState.user, router])

  return (
    <authenticationContext.Provider value={authenticationState}>
      {children}
    </authenticationContext.Provider>
  )
}

const authenticationContext = React.createContext<AuthenticationState>({
  user: null,
  token: null,
})

/**
 * @param {string} jwt
 */
function extractTokenPayload(jwt) {
  return JSON.parse(atob(jwt.split('.')[1]))
}

function useAuthentication() {
  return useContext(authenticationContext)
}
