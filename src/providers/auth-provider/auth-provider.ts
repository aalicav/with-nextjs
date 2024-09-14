"use client";

import type { AuthBindings } from "@refinedev/core";
import Cookies from "js-cookie";

export const authProvider: AuthBindings = {
  login: async ({ email, password }) => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const { user, token } = await response.json();
        Cookies.set("auth", JSON.stringify({ user, token }), {
          expires: 2/24, // 2 hours
          path: "/",
        });
        return {
          success: true,
          redirectTo: "/",
        };
      }

      return {
        success: false,
        error: {
          name: "LoginError",
          message: "Invalid email or password",
        },
      };
    } catch (error) {
      return {
        success: false,
        error: {
          name: "LoginError",
          message: "An error occurred during login",
        },
      };
    }
  },
  register: async (params) => {
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
      });

      if (response.ok) {
        return {
          success: true,
          redirectTo: "/login",
        };
      }

      return {
        success: false,
        error: {
          message: "Register failed",
          name: "Invalid email or password",
        },
      };
    } catch (error) {
      return {
        success: false,
        error: {
          message: "An error occurred during registration",
          name: "RegisterError",
        },
      };
    }
  },
  forgotPassword: async (params) => {
    // Suppose we actually send a request to the back end here.
    const user = false;
    if (user) {
      //we can send email with reset password link here
      return {
        success: true,
      };
    }
    return {
      success: false,
      error: {
        message: "Forgot password failed",
        name: "Invalid email",
      },
    };
  },
  updatePassword: async (params) => {
    // Suppose we actually send a request to the back end here.
    const isPasswordInvalid = params.password === "123456" || !params.password;

    if (isPasswordInvalid) {
      return {
        success: false,
        error: {
          message: "Update password failed",
          name: "Invalid password",
        },
      };
    }

    return {
      success: true,
    };
  },
  logout: async () => {
    Cookies.remove("auth", { path: "/" });
    return {
      success: true,
      redirectTo: "/login",
    };
  },
  check: async () => {
    const auth = Cookies.get("auth");
    if (auth) {
      const { token } = JSON.parse(auth);
      // Aqui você pode adicionar uma verificação adicional do token, se necessário
      return {
        authenticated: true,
      };
    }

    return {
      authenticated: false,
      logout: true,
      redirectTo: "/login",
    };
  },
  getPermissions: async () => {
    const auth = Cookies.get("auth");
    if (auth) {
      const { user } = JSON.parse(auth);
      return user.roles;
    }
    return null;
  },
  getIdentity: async () => {
    const auth = Cookies.get("auth");
    if (auth) {
      const { user } = JSON.parse(auth);
      return user;
    }
    return null;
  },
  onError: async (error) => {
    if (error.response?.status === 401) {
      return {
        logout: true,
      };
    }

    return { error };
  },
};
