import firebase from 'firebase'
import { useEffect, useReducer } from 'react'
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth'
import { useRouter } from 'next/router'

import { useAuthentication } from 'libs/authentication'

export default function Login() {
  const router = useRouter()
  const [signinState, dispatch] = useReducer(signinReducer, defaultSigninState)
  const { user } = useAuthentication()

  useEffect(() => {
    dispatch(user)
    if (signinState === 'signedIn') {
      router.push('/')
    }
  }, [router, signinState, user])

  if (signinState === 'unknown' || signinState === 'signedIn') {
    return null
  }

  if (signinState === 'signedOut') {
    return (
      <div className="h-screen grid place-items-center">
        <div className="text-center text-xl">
          <StyledFirebaseAuth
            uiConfig={uiConfig}
            firebaseAuth={firebase.auth()}
          ></StyledFirebaseAuth>
        </div>
      </div>
    )
  }
}

Login.getLayout = (page) => page

const uiConfig = {
  signInFlow: 'popup',
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
