const functions = require("firebase-functions")

const admin = require("firebase-admin")
admin.initializeApp()

const db = admin.firestore();

// On sign up.
exports.processSignUp = functions.auth.user().onCreate(async (user) => {
  // Check if user meets role criteria.
  console.log('user email', user.email)
  if (user.email && user.email.endsWith("@simplesat.io") && user.emailVerified) {
    const customClaims = {
      "https://hasura.io/jwt/claims": {
        "x-hasura-allowed-roles": ["user"],
        "x-hasura-default-role": "user",
        "x-hasura-user-id": user.uid
      },
    }

    try {
      // Set custom user claims on this newly created user.
      await admin.auth().setCustomUserClaims(user.uid, customClaims)

      // Update firestore database to notify client to force refresh.
      const metadataRef = db.doc(`metadata/${user.uid}`)

      // Set the refresh time to the current UTC timestamp.
      // This will be captured on the client to force a token refresh.
      await  metadataRef.set({refreshTime: new Date().getTime()});
    } catch (error) {
      console.log(error)
    }
  }
})
