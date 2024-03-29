import { useState } from "react";
import { setCookie, getCookies } from "cookies-next";

export default function useLogin() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function login(email: string, password: string) {
    setLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.status < 200 || response.status >= 500) {
        setLoading(false);
        return false;
      }
      const responseData = await response.json();

      if (responseData.error !== undefined) {
        setLoading(false);
        if (typeof responseData.error === "string") setError(responseData.error);
        return false;
      }

      if (responseData.password !== undefined) {
        setCookie("email", responseData.email, { sameSite: true });
        setCookie("token", responseData.password, { sameSite: true });
        setLoading(false);
        return true;
      }

      return false;
    } catch (e) {
      setError("No connection");
      setLoading(false);
      return false;
    }
  }

  return {
    loading,
    error,
    login,
  };
}