"use client";

import PrivateRoute from "@/components/PrivateRoute";

export default function ChamadasPage() {
  return (
    <PrivateRoute>
      <main />
    </PrivateRoute>
  );
}
