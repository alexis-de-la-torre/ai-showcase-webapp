import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';

import {
  removeUserCookie,
  setUserCookie,
  getUserFromCookie
} from './userCookie';

export const mapUserData = async user => {
  const { uid, email } = user;
  const token = await user.getIdToken(true);

  const currentUser = firebase.auth().currentUser

  return {
    id: uid,
    email,
    token,
    currentUser
  };
};


const useUser = () => {
  const [user, setUser] = useState();
  const router = useRouter();

  const logout = async (goToIndex = true) => {
    return firebase
      .auth()
      .signOut()
      .then(() => {
        if (goToIndex) router.push('/');
      })
      .catch(e => {
        console.error(e);
      });
  };

  useEffect(() => {
    const cancelAuthListener = firebase
      .auth()
      .onIdTokenChanged(async userToken => {
        if (userToken) {
          const userData = await mapUserData(userToken);
          setUserCookie(userData);
          setUser(userData);
        } else {
          removeUserCookie();
          setUser();
        }
      });

    const userFromCookie = getUserFromCookie();
    if (!userFromCookie) {
      return;
    }
    setUser(userFromCookie);
    return () => cancelAuthListener;
  }, []);

  return { user, logout };
};

export { useUser };
