import { RouterProvider, createBrowserRouter } from "react-router-dom";
import AppLayout from "./ui/AppLayout";
import Error from "./ui/Error";
import Home from "./ui/Home";
import Login, { action as onLogin } from "./pages/Login";
import Signup, { action as onsignup } from "./pages/Signup";
import PageNotfound from "./ui/PageNotfound";
import CreateNotePage from "./pages/CreateNotePage";
import LANPage from "./pages/LANPage";
import DashboardPage from "./pages/DashboardPage";
import AllNotes from "./pages/AllNotes";
import NotePage from "./pages/NotePage";
import ProtectedRoute from "./ui/ProtectedRoute";
import SettingPage, { action as settingAction } from "./pages/SettingPage";
import NoteEditPage from "./pages/NoteEditPage";
import { createNoteAction } from "./features/notes/actions/action";

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
        element: <Login />,
        action: onLogin,
      },
      {
        path: "/signup",
        element: <Signup />,
        action: onsignup,
      },
      {
        path: "/notes/:type/new",
        element: (
          <ProtectedRoute>
            <CreateNotePage />
          </ProtectedRoute>
        ),
        action: createNoteAction,
      },
      {
        path: "/dashboard",
        element: (
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/notes",
        element: (
          <ProtectedRoute>
            <AllNotes />
          </ProtectedRoute>
        ),
      },
      {
        path: "/notes/:type/:id",
        element: (
          <ProtectedRoute>
            <NotePage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/notes/:type/:id/edit",
        element: (
          <ProtectedRoute>
            <NoteEditPage />
          </ProtectedRoute>
        ),
        // action: onEdit,
      },
      {
        path: "/lan",
        element: <LANPage />,
        // action: LANaction,
      },
      {
        path: "/settings",
        element: (
          <ProtectedRoute>
            <SettingPage />
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
  return <RouterProvider router={router} />;
}

export default App;
