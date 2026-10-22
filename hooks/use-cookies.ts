import Cookies from "universal-cookie";

const cookies = new Cookies(null, { path: "/" });

const setCookie = (key: string, value: string) => {
  cookies.set(key, value, {
    sameSite: "lax",
    secure:
      typeof window !== "undefined" && window.location.protocol === "https:",
  });
  if (typeof window !== "undefined" && key === "wagerie_token")
    window.dispatchEvent(new Event("wagerie-session-change"));
};

const getCookie = (key: string) => {
  return cookies.get(key);
};

const removeCookie = (key: string) => {
  cookies.remove(key);
  if (typeof window !== "undefined" && key === "wagerie_token")
    window.dispatchEvent(new Event("wagerie-session-change"));
};

export { setCookie, getCookie, removeCookie };
