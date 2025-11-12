import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { lazy, Suspense } from "react";

// Import only critical components that are needed immediately
import AppLayout from "./ui/AppLayout";
import Error from "./ui/Error";
import Home from "./ui/Home";
import PageNotfound from "./ui/PageNotfound";
import ProtectedRoute from "./ui/ProtectedRoute";

// Lazy load all other components
const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Signup"));
const CreateNotePage = lazy(() => import("./pages/CreateNotePage"));
const LANPage = lazy(() => import("./pages/LANPage"));
const DashboardPage = lazy(() => import("./pages/DashboardPage"));
const AllNotes = lazy(() => import("./pages/AllNotes"));
const NotePage = lazy(() => import("./pages/NotePage"));
const SettingPage = lazy(() => import("./pages/SettingPage"));
const NoteEditPage = lazy(() => import("./pages/NoteEditPage"));

// Import actions directly (they're not components)
import { action as onLogin } from "./pages/Login";
import { action as onsignup } from "./pages/Signup";
import { action as settingAction } from "./pages/SettingPage";
import { createNoteAction } from "./features/notes/actions/action";
import Loader from "./ui/Loader";

const router = createBrowserRouter([
  {
    element: <AppLayout />,
    errorElement: <Error />,
    children: [
      {
        path: "/",
        element: (
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        ),
      },
      {
        path: "/login",
        element: (
          <Suspense fallback={<Loader />}>
            <Login />
          </Suspense>
        ),
        action: onLogin,
      },
      {
        path: "/signup",
        element: (
          <Suspense fallback={<Loader />}>
            <Signup />
          </Suspense>
        ),
        action: onsignup,
      },
      {
        path: "/notes/:type/new",
        element: (
          <ProtectedRoute>
            <Suspense fallback={<Loader />}>
              <CreateNotePage />
            </Suspense>
          </ProtectedRoute>
        ),
        action: createNoteAction,
      },
      {
        path: "/dashboard",
        element: (
          <ProtectedRoute>
            <Suspense fallback={<Loader />}>
              <DashboardPage />
            </Suspense>
          </ProtectedRoute>
        ),
      },
      {
        path: "/notes",
        element: (
          <ProtectedRoute>
            <Suspense fallback={<Loader />}>
              <AllNotes />
            </Suspense>
          </ProtectedRoute>
        ),
      },
      {
        path: "/notes/:type/:id",
        element: (
          <ProtectedRoute>
            <Suspense fallback={<Loader />}>
              <NotePage />
            </Suspense>
          </ProtectedRoute>
        ),
      },
      {
        path: "/notes/:type/:id/edit",
        element: (
          <ProtectedRoute>
            <Suspense fallback={<Loader />}>
              <NoteEditPage />
            </Suspense>
          </ProtectedRoute>
        ),
        // action: onEdit,
      },
      {
        path: "/lan",
        element: (
          <Suspense fallback={<Loader />}>
            <LANPage />
          </Suspense>
        ),
        // action: LANaction,
      },
      {
        path: "/settings",
        element: (
          <ProtectedRoute>
            <Suspense fallback={<Loader />}>
              <SettingPage />
            </Suspense>
          </ProtectedRoute>
        ),
        action: settingAction,
      },
      {
        path: "*",
        element: <PageNotfound />,
      },
    ],
  },
]);
function App() {
  return (
    <Suspense fallback={<Loader />}>
      <RouterProvider router={router} />
    </Suspense>
  );
}

export default App;
