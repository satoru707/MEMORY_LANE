"use client";
import AuthForm from "../page";

const ForgetPage = () => (
  <AuthForm
    type="passwordless"
    onSubmit={(data) => console.log("Signup:", data)}
  />
);

export default ForgetPage;
