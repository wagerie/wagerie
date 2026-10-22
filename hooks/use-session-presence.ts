"use client";

import { useSyncExternalStore } from "react";
import { getCookie } from "@/hooks/use-cookies";

function subscribe(callback: () => void) {
  window.addEventListener("wagerie-session-change", callback);
  window.addEventListener("focus", callback);
  return () => {
    window.removeEventListener("wagerie-session-change", callback);
    window.removeEventListener("focus", callback);
  };
}

// Navigation hint only; authorization is always the API's responsibility.
export function useSessionPresence() {
  return useSyncExternalStore(
    subscribe,
    () => Boolean(getCookie("wagerie_token")),
    () => false,
  );
}
