import React, { useState } from "react";
import { Form, redirect } from "react-router-dom";
import LinkButton from "../ui/LinkButton";
import Divider from "../ui/Divider";
import GoogleIcon from "../../assets/icons/GoogleIcon.jsx";
import PasswordStrengthMeter from "../ui/PasswordStrengthMeter.jsx";
import LANCardUi from "../features/LAN/LANCardUi.jsx";
import logo from "../../assets/logo.png";
import store from "../store.js";
import { signupThunk } from "../features/auth/authThunks.js";
function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [disable, setDisable] = useState(true);
  return (
    <div className="min-h-dvh grid grid-cols-12 items-center justify-center bg-emerald-50 px-4 py-4">
      <div className=" min-h-dvh col-span-12 sm:col-span-6 px-4 py-6">
        <div className=" uppercase tracking-wide  ">
          <h1 className="font-bold text-2xl">Get Started</h1>
          <h5 className="text-stone-500 mt-4">Create a new account</h5>
        </div>
        <LinkButton css="w-full mt-8 py-4 flex items-center justify-center gap-5 rounded-md bg-emerald-500 ">
          {" "}
          <GoogleIcon />
          Continue with google
        </LinkButton>
        <Divider />
        <Form method="post" className="mt-6 font-semibold">
          <div
            className="mb-5 flex gap-2 flex-col   
        sm:flex-row sm:items-center"
          >
            <label className="sm:basis-40 uppercase tracking-wide">Name</label>
            <input
              className="w-full rounded-full border border-stone-200
              px-4 py-2 text-sm transition-all duration-300 
              placeholder:text-stone-400 focus:outline-none focus:ring
              focus:ring-emerald-400 md:px-6 md:py-3 sm:ml-6"
              type="text"
              name="name"
              autoFocus="true"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div
            className="mb-5 flex gap-2 flex-col   
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
          <div
            className="mb-5 flex gap-2 flex-col   
        sm:flex-row sm:items-center"
          >
            <label className="sm:basis-40 uppercase tracking-wide">
              confirm password
            </label>
            <input
              className="w-full rounded-full border border-stone-200
              px-4 py-2 text-sm transition-all duration-300 
              placeholder:text-stone-400 focus:outline-none focus:ring
              focus:ring-emerald-400 md:px-6 md:py-3 sm:ml-6 "
              type="password"
              name="passwordConfirm"
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
              required
            />
          </div>
          <PasswordStrengthMeter
            password={password}
            passwordConfirm={passwordConfirm}
            setDisable={setDisable}
          />
          <div>
            <LinkButton css="w-full mt-4" disable={disable}>
              SIGNUP
            </LinkButton>
          </div>
        </Form>
        <div>
          <p className="mb-2 mt-4 text-center">
            Have an account?{" "}
            <LinkButton type="link" to="/login">
              Sign In Now
            </LinkButton>
          </p>
        </div>
      </div>
      <div className="hidden bg-emerald-200 min-h-dvh col-span-6 sm:block">
        <div className="flex items-center justify-center">
          <img
            src={logo}
            alt="vibe-notes"
            className="mix-blend-darken w-80 mt-6"
          />
        </div>
        <div className="px-30 pt-16">
          <LANCardUi />
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
    name: formData.get("name"),
    password: formData.get("password"),
    passwordConfirm: formData.get("passwordConfirm"),
  };
  const data = Object.fromEntries(formData);
  console.log(data);
  try {
    const result = await store.dispatch(signupThunk(credentials)).unwrap();
    console.log(result);
    return redirect("/dashboard");
  } catch (error) {
    return { error: error || "Signup Failed" };
  }
}

export default Signup;
