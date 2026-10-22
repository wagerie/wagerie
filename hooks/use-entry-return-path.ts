"use client";

import { useEffect, useState } from "react";
import { safeAccountReturnPath } from "@/lib/account-state";

export function useEntryReturnPath() {
  const [path, setPath] = useState<string | null>(null);
  useEffect(() => {
    setPath(
      safeAccountReturnPath(
        new URLSearchParams(window.location.search).get("next"),
      ),
    );
  }, []);
  return path;
}
