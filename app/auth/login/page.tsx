"use client";
import AuthPage from "../page";

const LoginPage = () => (
  <AuthPage type="login" onSubmit={(data) => console.log("Login:", data)} />
);

export default LoginPage;
// export const SignupPage = () => (
//   <AuthPage type="signup" onSubmit={(data) => console.log("Signup:", data)} />
// );
// export const PasswordlessPage = () => (
//   <AuthPage
//     type="passwordless"
//     onSubmit={(data) => console.log("Passwordless:", data)}
//   />
// );
