import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Портфолио",
  description: "A website that presents students' achievements and portfolios",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <html lang="en" data-theme='light'>
        <head>
          <link rel="shortcut icon" href="/favicon.ico" />
          <title>Портфолио</title>
        </head>
        <body className={inter.className + 'p-5'}>
          {children}
        </body>
      </html>
  );
}
