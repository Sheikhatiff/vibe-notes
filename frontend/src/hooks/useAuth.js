import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { checkAuthThunk } from "../features/auth/authThunks";

export const useAuth = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated, loading, authChecked } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (!authChecked) {
      dispatch(checkAuthThunk());
    }
  }, [dispatch, authChecked]);

  return {
    user,
    isAuthenticated,
    loading,
    authChecked,
  };
};
