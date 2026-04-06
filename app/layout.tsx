import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SAME-SAME | The Red Carpet Version",
  description: "משחק לזיהוי מפורסמים בפנטומימה. בואו לזהות את המפורסם!",
  manifest: "/manifest.json",
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    title: "SAME-SAME - The Red Carpet Version",
    description: "משחק לזיהוי מפורסמים בפנטומימה. בואו לזהות את המפורסם!",
    url: 'https://game-charades.one.vercel.app/',
    siteName: 'SAME-SAME - The Red Carpet Version',
    images: [
      {
        url: '/icon.jpg',
        width: 1024,
        height: 1024,
        alt: 'SAME-SAME Logo',
      },
    ],
    locale: 'he_IL',
    type: 'website',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "SAME-SAME",
  },
  icons: {
    apple: "/icon.jpg",
    shortcut: "/icon.jpg",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#05081c",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="he" dir="rtl">
      <body
        style={{
          margin: 0,
          padding: 0,
          backgroundColor: "#05081c",
          overscrollBehavior: "none",
          WebkitTapHighlightColor: "transparent",
          minHeight: "100vh",
          overflow: "hidden", 
        }}
      >
        {children}
      </body>
    </html>
  );
}