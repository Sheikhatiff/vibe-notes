import React from "react";
import Header from "./Header";
import { Outlet, useNavigation } from "react-router-dom";
import Loader from "./Loader";

function AppLayout() {
  const navigation = useNavigation();
  const isLoading = navigation.state === "loading";
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
