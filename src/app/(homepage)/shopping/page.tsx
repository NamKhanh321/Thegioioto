"use client"
import { useAuth } from "@/app/contexts/AuthContext";

export default function ShoppingPage() {
  const { user } = useAuth();

  if (!user) {
    return <div>Bạn cần đăng nhập để xem trang này.</div>;
  }

  return (
    <div>
      <h1>Chào mừng, {user.username}!</h1>
      {/* Display user data */}
      {user && <pre>{JSON.stringify(user, null, 2)}</pre>}
    </div>
  );
}
