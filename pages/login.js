import firebase from "firebase"
import { useEffect, useReducer, useState } from "react"
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth"
import Button from "components/Button"

export default function Login() {
  const [signinState, dispatch] = useReducer(signinReducer, defaultSigninState)

  useEffect(() => {
    const unregisterAuthObserver = firebase.auth().onAuthStateChanged((user) => {
      dispatch(Boolean(user))
    })

    return () => unregisterAuthObserver()
  })

  if (signinState == "unknown") {
    return null
  }

  if (signinState == 'signedIn') {
    return (
      <div className="h-screen grid place-items-center">
        <div>
          <h1>Welcome usage report!!!</h1>
          <Button onClick={() => {firebase.auth().signOut()}}>Sign out</Button>
        </div>
      </div>
    )
  }

  if(signinState == 'signedOut') {
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
    return 'signedIn'
  } else {
    return 'signedOut'
  }
}

const defaultSigninState = 'unknown'