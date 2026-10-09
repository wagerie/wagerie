"use client";

import { useCallback, useEffect, useState } from "react";

export type DeliveryStatus = "pending" | "shipped" | "received";

const STORAGE_KEY = "wagerie-delivery-statuses";
const CHANGE_EVENT = "wagerie-delivery-status-change";

function readStatuses(): Record<string, DeliveryStatus> {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
}

export function useDeliveryStatus() {
  const [statuses, setStatuses] = useState<Record<string, DeliveryStatus>>({});

  useEffect(() => {
    const syncStatuses = () => setStatuses(readStatuses());
    syncStatuses();
    window.addEventListener("storage", syncStatuses);
    window.addEventListener(CHANGE_EVENT, syncStatuses);
    return () => {
      window.removeEventListener("storage", syncStatuses);
      window.removeEventListener(CHANGE_EVENT, syncStatuses);
    };
  }, []);

  const getStatus = useCallback(
    (productId: string): DeliveryStatus => statuses[productId] || "pending",
    [statuses],
  );

  const updateStatus = useCallback(
    (productId: string, status: DeliveryStatus) => {
      const nextStatuses = { ...readStatuses(), [productId]: status };
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextStatuses));
      setStatuses(nextStatuses);
      window.dispatchEvent(new Event(CHANGE_EVENT));
    },
    [],
  );

  return { getStatus, updateStatus };
}