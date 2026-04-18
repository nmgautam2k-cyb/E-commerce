export const getUser = () => {
  if (typeof window === "undefined") return null;

  try {
    return JSON.parse(localStorage.getItem("user") || "null");
  } catch (error) {
    console.error("Invalid user data");
    return null;
  }
};

export const isLoggedIn = () => {
  return !!getUser();
};

export const isAdmin = () => {
  const user = getUser();
  return user?.role === "admin";
};

export const isCustomer = () => {
  const user = getUser();
  return user?.role === "customer";
};

export const logout = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("user");
    window.location.href = "/login";
  }
};

/* OPTIONAL HELPERS (GOOD FOR FUTURE) */

export const requireAdmin = (router: any) => {
  const user = getUser();

  if (!user || user.role !== "admin") {
    router.push("/login?redirect=/admin");
  }
};

export const requireAuth = (router: any) => {
  const user = getUser();

  if (!user) {
    router.push("/login");
  }
};