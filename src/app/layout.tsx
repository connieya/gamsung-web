import type { Metadata } from "next";
import "@/app/globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "Gamsung | 무신사 스타일 이커머스",
  description: "무신사 스타일 이커머스 웹",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="font-sans antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
