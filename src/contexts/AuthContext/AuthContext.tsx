import { createContext, useEffect, useState } from "react";
import { AuthContextProps, AuthContextProviderProps, UserProps } from "../../types/AuthContext";
import { auth, firebase } from "../../services/firebase";

export const AuthContext = createContext({} as AuthContextProps);

export function AuthContextProvider(props: AuthContextProviderProps) {
  const [user, setUser] = useState<UserProps>();

  async function SignInWithGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider();

    const result = await auth.signInWithPopup(provider);

    if (result.user) {
      const { displayName, photoURL, uid } = result.user;

      if (!displayName || !photoURL) {
        throw new Error("Faltam informações na sua conta do google!");
      }

      setUser({
        uid,
        displayName,
        photoURL,
      });
    }
  }

  useEffect(() => {
    const unSubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        const { displayName, photoURL, uid } = user;

        if (!displayName || !photoURL) {
          throw new Error("Faltam informações na sua conta do google!");
        }

        setUser({
          uid,
          displayName,
          photoURL,
        });
      }
    });

    return () => {
      unSubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, SignInWithGoogle }}
    >
      {props.children}
    </AuthContext.Provider>
  );
}
