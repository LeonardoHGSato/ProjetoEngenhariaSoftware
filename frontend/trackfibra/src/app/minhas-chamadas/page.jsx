"use client";

import PrivateRoute from "@/components/PrivateRoute";

export default function MinhasChamadasPage() {
  return (
    <PrivateRoute>
      <main />
    </PrivateRoute>
  );
}
