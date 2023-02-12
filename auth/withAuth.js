import React, { useEffect } from 'react';
import router from 'next/router';

import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';

// initFirebase();
const auth = firebase.auth();

const withAuth = Component => props => {
    useEffect(() => {
        auth.onAuthStateChanged(authUser => {
            if (!authUser) {
                router.push('/signin');
            }
        });
    }, []);

    return (
      <div>
          <Component {...props} />
      </div>
    )
};

export default withAuth;
