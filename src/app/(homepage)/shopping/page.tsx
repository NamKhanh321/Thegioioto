"use client"
import { useAuth } from "@/app/contexts/AuthContext";
import { useEffect } from "react";

export default function ShoppingPage() {
  const {fetchUser} = useAuth();
  useEffect(() => {
    fetchUser();
  }, [fetchUser]);
  return (
    <div className="text-center text-5xl">
        <h1 className="text-amber-600">Trang mua hàng</h1>
      </div>
  );
}
