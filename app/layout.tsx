import type { Metadata } from "next";
import "./globals.css";
import Cursor from "../components/Cursor";
import { fatFont } from './fonts'

export const metadata: Metadata = {
  title: 'Sree Rajalakshmi Enterprises',
  icons: {
    icon: '/tea-icon.svg',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${fatFont.className} antialiased`}>
        {children}
        <Cursor />
      </body>
    </html>
  );
}
