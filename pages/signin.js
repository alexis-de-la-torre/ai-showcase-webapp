import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';

import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';

import styled from "styled-components"
import {Alert, Space, Typography} from "antd"

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

const StyledDiv = styled("div")`
  display: flex;
  align-items: center;
  justify-content: center;
  
  height: 100vh;
  
  margin-left: 22px;
  margin-right: 22px;
`

const FirebaseAuth = () => {
    const signInSuccessUrl = "/"
    return (
      <StyledDiv>
          <Space direction="vertical">
              <Alert
                message={"Get a higher generation limit by Signing In"}
                type="info"
                // closable
              />
              <StyledFirebaseAuth
                uiConfig={firebaseAuthConfig({ signInSuccessUrl })}
                firebaseAuth={firebase.auth()}
                signInSuccessUrl={signInSuccessUrl}
              />
          </Space>
      </StyledDiv>
    );
};

export default FirebaseAuth;
