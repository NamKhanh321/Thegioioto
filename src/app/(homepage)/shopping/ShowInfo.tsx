"use client"

import { useAuth } from "@/app/contexts/AuthContext";

export default function ShoWInfo() {
    const { user } = useAuth();

  if (!user) {
    return <div>Bạn cần đăng nhập để xem trang này.</div>;
  }
    return (<>
      <h1>Chào mừng, {user.username}!</h1>
      {user && <pre>{JSON.stringify(user, null, 2)}</pre>}
      </>);
}