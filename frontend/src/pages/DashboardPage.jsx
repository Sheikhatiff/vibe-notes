import React from "react";
import { LogOut, Settings } from "lucide-react";
import LinkButton from "../ui/LinkButton";
import FeatureCard from "../ui/FeatureCard";
import { Link, redirect, useNavigate } from "react-router-dom";
import { formatDate } from "../utils/formatDate";
import { useAuth } from "../hooks/useAuth";
import store from "../store";
import { logoutThunk } from "../features/auth/authThunks";
import { showError, showSuccess } from "../utils/toast";

// eslint-disable-next-line react-refresh/only-export-components
export const BACKEND_URL =
  import.meta.env.MODE === "production" ? "" : "http://localhost:3000";

function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  function hnadleSetting() {
    navigate("/settings");
  }

  return (
    <div className="min-h-dvh grid grid-cols-12 p-4">
      <div className="hidden bg-emerald-200 border border-transparent text-stone-800 rounded-2xl md:col-span-3 col-span-4 sm:block">
        <div className=" m-4 p-4 items-center ">
          <div className="flex items-center mt-8 justify-center">
            {console.log(import.meta.env.MODE, BACKEND_URL, "\n", user.photo)}
            <img
              src={`${BACKEND_URL}/userImg/${user.photo}`}
              alt="User Profile"
              className="rounded-full h-35"
            />
          </div>
          <h2 className="flex items-center mt-5  justify-center uppercase text-xl md:text-2xl font-bold">
            {user.name}
          </h2>
          <p className="p-2 mt-2 font-medium">{user.email}</p>
          <p className="px-2 font-medium">
            Last Login: <small>{formatDate(user?.lastLogin[0])}</small>
          </p>
          <div className="mt-40 ">
            <LinkButton
              onClick={hnadleSetting}
              css="flex gap-2 font-medium w-full items-center justify-center"
            >
              Setting <Settings />
            </LinkButton>
          </div>
          <div className="mt-5 ">
            <LinkButton
              css="flex w-full font-medium gap-2 items-center justify-center"
              onClick={hnadleLogout}
            >
              Logout <LogOut />
            </LinkButton>
          </div>
        </div>
      </div>
      <div className=" col-span-12 sm:col-span-8 md:col-span-9 m-2 px-2 sm:m-4 sm:p-4">
        <h1 className="text-4xl italic font-bold mt-4">
          Welcome Back{" "}
          <span className="sm:hidden text-emerald-600">{user.name}</span> to
          Vibe Notes !
        </h1>
        <hr className="text-emerald-200 m-5 mx-10" />
        <div className="grid grid-cols-1 gap-8">
          <Link to={"/notes/quick/new"}>
            <FeatureCard
              title={"Create Notes"}
              description={
                "Write your way — make a quick note for instant thoughts, let AI craft smart notes from your prompts, or attach memories to places with geo notes."
              }
            />
          </Link>
          <Link to={"/notes"}>
            <FeatureCard
              title={"Get All Notes"}
              description={
                "View and manage all your notes effortlessly — explore quick thoughts, AI-written ideas, and location-based memories in one organized space."
              }
            />
          </Link>
          {/* <div onClick={() => alert("A nice feature will update soon !")}>
            <FeatureCard title={"Upcoming Feature"} description={"..."} />
          </div> */}
          <Link to={"/lan"}>
            <FeatureCard
              title={"LAN"}
              description={
                "On the same WiFi? Share note & files effortlessly between all your devices..."
              }
            />
          </Link>
        </div>
      </div>
    </div>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export async function hnadleLogout() {
  try {
    await store.dispatch(logoutThunk()).unwrap();
    showSuccess("You’ve been logged out!");
    return redirect("/");
  } catch (error) {
    showError(error || "Logout failed");
    return { error: error || "Login Failed" };
  }
}

export default DashboardPage;
