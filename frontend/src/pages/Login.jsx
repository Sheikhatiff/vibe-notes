import React, { useState } from "react";
import { Form, redirect } from "react-router-dom";
import LinkButton from "../ui/LinkButton";
import Divider from "../ui/Divider";
import GoogleIcon from "../../assets/icons/GoogleIcon.jsx";
import LANCardUi from "../features/LAN/LANCardUi.jsx";
import logo from "../../assets/logo.png";
import store from "../store.js";
import { loginThunk } from "../features/auth/authThunks.js";
import { showError, showSuccess } from "../utils/toast";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  return (
    <div className="min-h-dvh grid grid-cols-12 items-center justify-center bg-emerald-50 px-4 py-4">
      <div className="hidden bg-emerald-200 min-h-dvh col-span-6  sm:block">
        <div className="flex items-center justify-center">
          <img
            src={logo}
            alt="vibe-notes"
            className="mix-blend-darken w-80 mt-6"
          />
        </div>
        <div className="px-30 pt-12">
          <LANCardUi />
        </div>
      </div>
      <div className=" min-h-dvh col-span-12 sm:col-span-6 px-6 py-8">
        <div className=" uppercase tracking-wide  ">
          <h1 className="font-bold text-2xl">Welcome Back</h1>
          <h5 className="text-stone-500 mt-4">Sign in to your account</h5>
        </div>
        <LinkButton
          type="button"
          css="w-full mt-12 py-4 flex items-center justify-center gap-5 rounded-md bg-emerald-500 "
        >
          {" "}
          <GoogleIcon />
          Continue with google
        </LinkButton>
        <Divider />
        <Form method="post" className="mt-6 font-semibold">
          <div
            className="mb-5 mt-8 flex gap-2 flex-col   
        sm:flex-row sm:items-center"
          >
            <label className="sm:basis-40 uppercase tracking-wide">Email</label>
            <input
              className="w-full rounded-full border border-stone-200
              px-4 py-2 text-sm transition-all duration-300 
              placeholder:text-stone-400 focus:outline-none focus:ring
              focus:ring-emerald-400 md:px-6 md:py-3 sm:ml-6"
              type="email"
              name="email"
              autoFocus="true"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div
            className="mb-5 flex gap-2 flex-col   
        sm:flex-row sm:items-center"
          >
            <label className="sm:basis-40 uppercase tracking-wide">
              password
            </label>
            <input
              className="w-full rounded-full border border-stone-200
              px-4 py-2 text-sm transition-all duration-300 
              placeholder:text-stone-400 focus:outline-none focus:ring
              focus:ring-emerald-400 md:px-6 md:py-3 sm:ml-6"
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div>
            <LinkButton css="w-full mt-4">Login</LinkButton>
          </div>
        </Form>
        <div>
          <p className="mb-2 mt-4 text-center">
            Don't have an account?{" "}
            <LinkButton type="link" to="/signup">
              Sign Up Now
            </LinkButton>
          </p>
        </div>
      </div>
    </div>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export async function action({ request }) {
  const formData = await request.formData();
  const credentials = {
    email: formData.get("email"),
    password: formData.get("password"),
  };

  try {
    await store.dispatch(loginThunk(credentials)).unwrap();
    showSuccess("Logged in Successfully!");

    return redirect("/dashboard");
  } catch (error) {
    showError(error || "Log In Failed !");
    return null;
  }
}

export default Login;
