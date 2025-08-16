"use client";
import AuthPage from "../page";

const ForgetPage = () => (
  <AuthPage
    type="passwordless"
    onSubmit={(data) => console.log("Signup:", data)}
  />
);

export default ForgetPage;
