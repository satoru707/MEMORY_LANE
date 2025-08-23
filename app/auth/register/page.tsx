"use client";
import AuthForm from "../auth_page";

const SignupPage = () => (
  <AuthForm type="signup" onSubmit={(data) => console.log("Signup:", data)} />
);

export default SignupPage;
