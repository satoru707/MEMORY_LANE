"use client";
import AuthForm from "../auth_page";

const ForgetPage = () => (
  <AuthForm
    type="passwordless"
    onSubmit={(data) => console.log("Signup:", data)}
  />
);

export default ForgetPage;
