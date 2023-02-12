import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';

import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';

const firebaseAuthConfig = ({ signInSuccessUrl }) => ({
    signInFlow: 'popup',
    signInOptions: [
        {
            provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
            requireDisplayName: false
        },
        firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    ],
    signInSuccessUrl,
    credentialHelper: 'none',
    // callbacks: {
    //     signInSuccessWithAuthResult: async ({ user }, redirectUrl) => {
    //         const userData = await mapUserData(user);
    //         setUserCookie(userData);
    //     }
    // }
});

const FirebaseAuth = () => {
    const signInSuccessUrl = "/"
    return (
      <div style={{ height: "100vh" }}>
          <StyledFirebaseAuth
            uiConfig={firebaseAuthConfig({ signInSuccessUrl })}
            firebaseAuth={firebase.auth()}
            signInSuccessUrl={signInSuccessUrl}
          />
      </div>
    );
};

export default FirebaseAuth;
