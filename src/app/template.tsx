import Header from '@/components/Header';

import { AuthProvider } from "./contexts/AuthContext";
import {Suspense} from 'react';

export default function RootTemplate({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
          <Suspense fallback={<div>Đang tải nội dung...</div>}>
            <AuthProvider>
              <Header />
              {children}
            </AuthProvider>
          </Suspense>
  );
}
