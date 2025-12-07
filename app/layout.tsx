import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

// Unbounded - Using variable font for better performance
const unbounded = localFont({
  src: "./fonts/Unbounded-VariableFont_wght.ttf",
  variable: "--font-unbounded",
  weight: "100 900", // Variable font supports all weights
  fallback: ["system-ui", "sans-serif"],
});

// Satoshi - Using available OTF files
const satoshi = localFont({
  src: [
    {
      path: "./fonts/Satoshi-Light.otf",
      weight: "300",
      style: "normal",
    },
    {
      path: "./fonts/Satoshi-Regular.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/Satoshi-Medium.otf",
      weight: "500",
      style: "normal",
    },
    {
      path: "./fonts/Satoshi-Bold.otf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-satoshi",
  fallback: ["system-ui", "sans-serif"],
});

const baseUrl = "https://signatureglobalmedia.com";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: "Signature Global Media — AI Video Cloning & Production",
  description: "Create professional AI video clones in just 30 minutes. No camera, no editing, no tech skills required.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${unbounded.variable} ${satoshi.variable} antialiased`}
        style={{ fontFamily: "var(--font-satoshi)" }}
      >
        {children}
      </body>
    </html>
  );
}
