import { atom } from "jotai";
import { loggedinUserAtom } from "./user.atom";


export type SignUpInfoT = "STEPONE" | "STEPTWO" | "STEPTHREE" | "STEPFOUR";

export const signupInfoStep = atom<SignUpInfoT>("STEPONE");

export const signupFormData = atom({
  stepOne: {
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    confirmPassword: "",
  },
  stepTwo: {
    role: "",
  },
  stepThree: {
    examOrSchool: "",
  },
  stepFour: {
    guardianOrAdminEmail: "",
  },
});

export const verifyEmailAtom = atom(
  null,
  (get, set) => {
    const current = get(loggedinUserAtom);

    if (!current?.user) return;

    set(loggedinUserAtom, {
      ...current,
      user: {
        ...current.user,
        is_email_verified: true,
      },
    });
  }
);