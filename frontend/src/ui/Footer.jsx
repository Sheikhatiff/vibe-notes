import React from "react";
import { Link } from "react-router-dom";
import { Github, Linkedin, Mail } from "lucide-react";

function Footer() {
  return (
    <footer className="bg-emerald-900 text-white py-8 mt-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Section */}
        <div className="flex flex-col md:flex-row justify-between items-center sm:items-start gap-6 border-b border-emerald-400 pb-6">
          {/* Brand */}
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Vibe Notes</h2>
            <p className="text-emerald-100 text-sm mt-1">
              Organize your thoughts. Anytime, anywhere.
            </p>
          </div>

          {/* Social Icons */}
          <div className="pt-5 flex gap-4">
            <a
              href="https://github.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-emerald-200 transition-transform transform hover:scale-110"
            >
              <Github size={20} />
            </a>
            <a
              href="https://linkedin.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-emerald-200 transition-transform transform hover:scale-110"
            >
              <Linkedin size={20} />
            </a>
            <a
              href="mailto:example@email.com"
              className="hover:text-emerald-200 transition-transform transform hover:scale-110"
            >
              <Mail size={20} />
            </a>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="text-center text-sm text-emerald-100 mt-6">
          <p>
            © {new Date().getFullYear()}{" "}
            <span className="font-semibold">NoteBook</span>. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
