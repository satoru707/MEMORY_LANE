"use client";
import AuthPage from "../page";

const SignupPage = () => (
  <AuthPage type="signup" onSubmit={(data) => console.log("Signup:", data)} />
);

export default SignupPage;
