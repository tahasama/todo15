import React from "react";
import { CredsSignIn } from "../componentns/CredsSignIn";
import GithubSignIn from "../componentns/GithubsignIn";
import { SignOut } from "../componentns/SignoutButton";
import { CredsSignUp } from "../componentns/CredsSignUp";

const Login = () => {
  return (
    <div>
      <GithubSignIn />
      <CredsSignIn />
      <CredsSignUp />
    </div>
  );
};

export default Login;
