import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE } from "../config";

// Loads the logged-in account from GET /api/me.
//   redirectTo - where to send visitors who are not logged in (omit to just stay on the page)
//   userType   - "employee" | "company": anyone else is treated as not allowed
// Returns { me, setMe, loading }.
const useMe = ({ redirectTo, userType } = {}) => {
  const navigate = useNavigate();
  const [me, setMe] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    axios
      .get(`${API_BASE}/api/me`, { withCredentials: true })
      .then((res) => {
        if (cancelled) return;
        if (userType && res.data.userType !== userType) {
          if (redirectTo) navigate(redirectTo, { replace: true });
          return;
        }
        setMe(res.data);
      })
      .catch(() => {
        if (!cancelled && redirectTo) navigate(redirectTo, { replace: true });
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [navigate, redirectTo, userType]);

  return { me, setMe, loading };
};

export default useMe;
