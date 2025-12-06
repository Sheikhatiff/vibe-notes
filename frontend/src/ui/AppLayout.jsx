import React from "react";
import Header from "./Header";
import { Outlet, useNavigation } from "react-router-dom";
import { useSelector } from "react-redux";
import Loader from "./Loader";

function AppLayout() {
  const navigation = useNavigation();
  const authLoading = useSelector((state) => state.auth.loading);
  const isLoading = navigation.state === "loading" || authLoading;
  return (
    <div className="grid">
      <Header />
      <div className="bg-emerald-50 overflow-y-scroll">
        <main className="min-h-dvh">
          {isLoading && <Loader />}
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AppLayout;
