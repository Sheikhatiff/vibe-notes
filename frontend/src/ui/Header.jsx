import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ArrowLeft, LogOut, Menu, UserLock, X } from "lucide-react";
import LinkButton from "./LinkButton";
import Logo from "../../assets/logo3.png";
import { useSelector } from "react-redux";
import { formatDate } from "../utils/formatDate";
import { hnadleLogout } from "../pages/DashboardPage";

function Header() {
  const user = useSelector((st) => st.auth.user);
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const path = location.pathname || "/";

  function toggleMenu() {
    setIsOpen((prev) => !prev);
  }

  const isAuthPage = path === "/login" || path === "/signup";
  const isHomePage = path === "/";
  const isDashboard = path.startsWith("/dashboard");

  return (
    <>
      <header className="bg-emerald-900 p-4 flex justify-between rounded-b-xl items-center shadow-md sticky top-0 z-50">
        <Link
          to="/"
          className="font-extrabold uppercase text-2xl tracking-widest text-stone-100 hover:text-stone-300"
        >
          {/* Vibe Notes */}
          <img src={Logo} className="h-13 sm:h-15 m-0 p-0" alt="Vibe Notes" />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-6 font-medium text-stone-100">
          {isHomePage && (
            <>
              <LinkButton to="/login">Login</LinkButton>
              <LinkButton to="/signup">Sign Up</LinkButton>
            </>
          )}
          {isDashboard && (
            <>
              <button
                className="hover:text-stone-300 mr-4"
                onClick={hnadleLogout}
              >
                <LogOut size={30} width={40} />
              </button>
            </>
          )}
          {!isDashboard && !isHomePage && (
            <LinkButton to={-1} type="link">
              <ArrowLeft size={30} width={40} className="inline mb-1 mr-1" />
            </LinkButton>
          )}
        </nav>

        {/* Mobile Menu Button */}
        {!isAuthPage && (
          <button
            onClick={toggleMenu}
            className="md:hidden focus:outline-none"
            aria-label="Toggle Menu"
          >
            {isOpen ? (
              <X color="white" size={26} />
            ) : (
              <Menu color="white" size={26} />
            )}
          </button>
        )}
      </header>

      {/* Mobile Side Menu */}
      {!isAuthPage && (
        <div
          className={`fixed top-0 right-0 h-full w-64 bg-emerald-800 shadow-lg transform transition-transform duration-300 ease-in-out z-40 ${
            isOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex justify-between items-center p-4 border-b border-stone-300">
            <h2 className="text-xl font-semibold text-stone-100">Menu</h2>
            <button onClick={toggleMenu} aria-label="Close Menu">
              <X size={22} />
            </button>
          </div>

          <nav className="flex flex-col p-4 space-y-4 text-lg font-medium divide-y divide-emerald-300 text-stone-100">
            {isHomePage ? (
              <>
                <Link
                  to="/login"
                  className="hover:text-stone-300 transition-colors duration-150"
                  onClick={toggleMenu}
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="hover:text-stone-300 transition-colors duration-150"
                  onClick={toggleMenu}
                >
                  Sign Up
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/settings"
                  className="hover:text-stone-300 transition-colors duration-150"
                  onClick={toggleMenu}
                >
                  <div>
                    <div className="flex items-start justify-center my-2">
                      <img
                        src={`http://localhost:3000/userImg/${user?.photo}`}
                        alt="User Profile"
                        className="rounded-full h-35"
                      />
                    </div>
                    <h2 className="flex items-center justify-center uppercase font-bold text-2xl mt-4">
                      {user?.name}
                    </h2>
                    <p className="flex items-start justify-center text-sm italic">
                      {user?.email}
                    </p>
                    <p className="flex items-start justify-center text-stone-400 mb-2 text-xs italic">
                      Last Login: {formatDate(user?.lastLogin[0])}
                    </p>
                  </div>
                </Link>
                {isDashboard ? (
                  <Link
                    className="hover:text-stone-300 transition-colors duration-150"
                    onClick={() => {
                      hnadleLogout();
                      toggleMenu();
                    }}
                  >
                    <div className="flex items-start justify-center">
                      <LogOut size={30} className="inline mb-1 mr-1" />
                    </div>
                  </Link>
                ) : (
                  <Link
                    onClick={toggleMenu}
                    to="/dashboard"
                    className="hover:text-stone-300 transition-colors duration-150"
                  >
                    <div className="flex items-start justify-center text-sm">
                      <ArrowLeft className="inline mb-1 mr-1" /> Go to Dashboard
                    </div>
                  </Link>
                )}
              </>
            )}
          </nav>
        </div>
      )}

      {/* Overlay */}
      {isOpen && !isAuthPage && !isDashboard && (
        <div
          className="fixed inset-0 bg-stone-400/90 z-30"
          onClick={toggleMenu}
          aria-label="Close Menu"
        ></div>
      )}
    </>
  );
}

export default Header;

// import { useState } from "react";
// import { Link, useLocation } from "react-router-dom";
// import { Menu, X } from "lucide-react";
// import LinkButton from "./LinkButton";

// function Header() {
//   const [isOpen, setIsOpen] = useState(false);
//   const location = useLocation();
//   const path = location.pathname || "/";

//   function toggleMenu() {
//     setIsOpen(!isOpen);
//   }

//   return (
//     <>
//       <header className="bg-emerald-900 p-4 flex justify-between rounded-b-xl items-center shadow-md sticky top-0 z-50">
//         <Link
//           to="/"
//           className="font-extrabold uppercase text-2xl tracking-widest text-stone-100 hover:text-stone-300"
//         >
//           Vibe Notes
//         </Link>

//         <nav
//           className={`${
//             path !== "/signup" && path !== "/login" && "hidden"
//           } md:flex space-x-6 font-medium text-stone-100`}
//         >
//           {path === "/signup" || path === "/login" ? (
//             <LinkButton to="/" type="link">
//               Back
//             </LinkButton>
//           ) : (
//             <>
//               <LinkButton to="/login">Login</LinkButton>
//               <LinkButton to="/signup">Sign Up</LinkButton>
//             </>
//           )}
//         </nav>

//         {path !== "/signup" && path !== "/login" && (
//           <button
//             onClick={toggleMenu}
//             className="md:hidden focus:outline-none"
//             aria-label="Toggle Menu"
//           >
//             {isOpen ? (
//               <X color="white" size={26} />
//             ) : (
//               <Menu color="white" size={26} />
//             )}
//           </button>
//         )}
//       </header>

//       {path !== "/signup" && path !== "/login" && (
//         <div
//           className={`fixed top-0 right-0 h-full w-64 bg-emerald-800  shadow-lg transform transition-transform duration-300 ease-in-out z-40 ${
//             isOpen ? "translate-x-0" : "translate-x-full"
//           }`}
//         >
//           <div className="flex justify-between items-center p-4 border-b border-stone-300">
//             <h2 className="text-xl font-semibold text-stone-100">Menu</h2>
//             <button onClick={toggleMenu} aria-label="Close Menu">
//               <X size={22} />
//             </button>
//           </div>

//           <nav className="flex flex-col p-4 space-y-4 text-lg font-medium divide-y divide-emerald-300 text-stone-100">
//             <Link
//               to="/"
//               className="hover:text-stone-300 transition-colors duration-150"
//               onClick={toggleMenu}
//               aria-label="Close Menu"
//             >
//               Home
//             </Link>
//             <Link
//               to="/login"
//               className="hover:text-stone-300 transition-colors duration-150"
//               onClick={toggleMenu}
//               aria-label="Close Menu"
//             >
//               Login
//             </Link>
//             <Link
//               to="/signup"
//               className="hover:text-stone-300 transition-colors duration-150"
//               onClick={toggleMenu}
//               aria-label="Close Menu"
//             >
//               Sign Up
//             </Link>
//           </nav>
//         </div>
//       )}

//       {isOpen && (
//         <div
//           className="fixed inset-0 bg-stone-400/90 z-30"
//           onClick={toggleMenu}
//           aria-label="Close Menu"
//         ></div>
//       )}
//     </>
//   );
// }

// export default Header;
