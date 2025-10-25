import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function useAuth(redirectTo = "/users/login") {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setIsAuthenticated(false);
      if (redirectTo) router.push(redirectTo);

      // fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/verify-token`, {
      //   headers: { Authorization: `Bearer ${token}` },
      // }).then(res => {
      //   if (!res.ok) router.push(redirectTo);
      // }).finally(() => setLoading(false));

    } else {
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, [router, redirectTo]);

  return { loading, isAuthenticated };
}
