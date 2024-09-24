import React, { Suspense } from 'react'
import Loading from "../loading";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Suspense fallback={<Loading />}>
      {children}
    </Suspense>
  );
}