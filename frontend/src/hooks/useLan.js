import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getLanDataThunk } from "../features/LAN/lanThunks";

export const useLan = () => {
  const dispatch = useDispatch();
  const { files, text, updatedAt, loading, error } = useSelector(
    (state) => state.lan
  );

  useEffect(() => {
    dispatch(getLanDataThunk());
  }, [dispatch]);

  return {
    files,
    text,
    updatedAt,
    loading,
    error,
  };
};
