import React from "react";
import { Link } from "react-router-dom";
import { NotebookPen, ArrowRight } from "lucide-react";
import FeatureCard from "./FeatureCard";
import Footer from "./Footer";
import LANCardUi from "../features/LAN/LANCardUi";

function Home() {
  return (
    <main className="flex flex-col">
      {/* Hero Section */}
      <section className="flex flex-col md:flex-row items-center justify-between max-w-6xl mx-auto px-6 py-20 gap-10">
        {/* Left Content */}
        <div className="md:w-1/2 text-center md:text-left space-y-6">
          <div className="flex justify-center md:justify-start items-center gap-2">
            {/* <NotebookPen className="text-emerald-600" size={34} /> */}
            <h1 className="text-5xl md:text-6xl md:ml-4 font-extrabold text-gray-900">
              Welcome to <span className="text-emerald-600">Vibe Notes</span>
            </h1>
          </div>

          <p className="text-gray-600 text-lg leading-relaxed max-w-md md:ml-4 mx-auto md:mx-0">
            Capture your thoughts, organize your notes, and stay productive —
            all in one elegant, distraction-free workspace.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center md:ml-4 md:justify-between">
            <Link
              to="/dashboard"
              className="bg-emerald-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2"
            >
              Get Started <ArrowRight size={18} />
            </Link>
          </div>
        </div>

        {/* Right Side Illustration */}
        <div className="md:w-1/2 md:pt-8 md:pl-4 flex justify-center">
          <LANCardUi />
        </div>
      </section>

      {/* Features Section */}
      <section className=" py-16">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-10">
            Why Choose <span className="text-emerald-600">Vibe Notes?</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <FeatureCard
              title={"📒 Easy Note Management"}
              description={
                "Create, edit, pin, and organize your notes effortlessly in one clean workspace."
              }
            />

            {/* Feature 2 */}
            <FeatureCard
              title={"☁️ Cloud Sync"}
              description={
                "Access your notes securely from any device. Your data stays safe and synced."
              }
            />

            {/* Feature 3 */}
            <FeatureCard
              title={"🌙 Dark Mode"}
              description={
                "Write comfortably day or night with seamless dark and light themes."
              }
            />
          </div>
        </div>
      </section>
      <section className="text-center py-16 bg-linear-to-r from-emerald-600 to-emerald-700 text-white">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Ready to start your journey?
        </h2>
        <p className="text-emerald-100 mb-8">
          Join thousands of users who organize smarter with Vibe Notes.
        </p>
        <Link
          to="/signup"
          className="bg-white text-emerald-700 px-8 py-3 rounded-full font-semibold hover:bg-emerald-100 transition-colors"
        >
          Create an Account
        </Link>
      </section>
      <Footer />
    </main>
  );
}

export default Home;
