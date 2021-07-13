import firebase from "firebase"
import { useEffect, useReducer, useState } from "react"
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth"
import Button from "components/Button"

export default function Login() {
  const [signinState, dispatch] = useReducer(signinReducer, defaultSigninState)

  useEffect(() => {
    let unregisterFirestoreObserver
    const unregisterAuthObserver = firebase.auth().onAuthStateChanged(async (user) => {
      if (user) {
        user.getIdToken().then(function (token) {
          const tokenPayload = extractTokenPayload(token)
          const hasHasuraClaim = Boolean(tokenPayload["https://hasura.io/jwt/claims"])
          if (hasHasuraClaim) {
            console.log("Has Hasura claim")
            console.log("Hasura claim", tokenPayload["https://hasura.io/jwt/claims"])
          } else {
            if (unregisterFirestoreObserver) {
              return
            }
            const db = firebase.firestore()
            unregisterFirestoreObserver = db.doc(`metadata/${user.uid}`).onSnapshot((doc) => {
              if (doc.data()) {
                user.getIdToken(true).then((token) => {
                  console.log("Hasura claim", extractTokenPayload(token)["https://hasura.io/jwt/claims"])
                })
              }
            })
          }
        })
      }
      dispatch(Boolean(user))
    })

    return () => {
      unregisterAuthObserver()
      if (unregisterFirestoreObserver) {
        unregisterFirestoreObserver()
      }
    }
  })

  if (signinState == "unknown") {
    return null
  }

  if (signinState == "signedIn") {
    return (
      <div className="h-screen grid place-items-center">
        <div>
          <h1>Welcome usage report!!!</h1>
          <Button
            onClick={() => {
              firebase.auth().signOut()
            }}
          >
            Sign out
          </Button>
        </div>
      </div>
    )
  }

  if (signinState == "signedOut") {
    return (
      <div className="h-screen grid place-items-center">
        <div className="text-center text-xl">
          <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()}></StyledFirebaseAuth>
        </div>
      </div>
    )
  }
}

const uiConfig = {
  signInFlow: "popup",
  signInOptions: [firebase.auth.GoogleAuthProvider.PROVIDER_ID],
  callbacks: {
    signInSuccessWithAuthResult: () => false,
  },
}

/**
 * @typedef {'unknown'|'signedIn'|'signedOut'} SigninState
 */

/**
 *
 * @param {SigninState} _
 * @param {boolean} isLoggedIn
 * @returns {SigninState}
 */
function signinReducer(_, isLoggedIn) {
  if (isLoggedIn) {
    return "signedIn"
  } else {
    return "signedOut"
  }
}

const defaultSigninState = "unknown"

/**
 * @param {string} jwt
 */
function extractTokenPayload(jwt) {
  return JSON.parse(atob(jwt.split(".")[1]))
}
