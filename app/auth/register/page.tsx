"use client";
import AuthForm from "../page";

const SignupPage = () => (
  <AuthForm type="signup" onSubmit={(data) => console.log("Signup:", data)} />
);

export default SignupPage;
