import { ReactNode } from "react";

export type UserProps = {
  photoURL: string;
  uid: string;
  displayName: string;
};

export type AuthContextProps = {
  user: UserProps | undefined;
  SignInWithGoogle: () => Promise<void>;
};

export type AuthContextProviderProps = {
  children: ReactNode;
}