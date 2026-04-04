import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  // הכותרת שתופיע בלשונית הדפדפן
  title: "מילה נרדפת | SAME-SAME",
  description: "משחק אוצר מילים משפחתי ומאתגר. בואו למצוא את המילה הנרדפת!",
  manifest: "/manifest.json",
  formatDetection: {
    telephone: false,
  },
  // הגדרות קריטיות עבור תצוגה מקדימה בוואטסאפ (OpenGraph)
  openGraph: {
    title: "מילה נרדפת - SAME-SAME", // התיקון כאן: הוספתי את המילה "מילה"
    description: "אותה משמעות, מילה אחרת. מוכנים לאתגר המילים הגדול?",
    url: 'https://same-same.vercel.app/',
    siteName: 'SAME-SAME',
    images: [
      {
        url: '/logo.webp', 
        width: 800,
        height: 600,
        alt: 'SAME-SAME Logo',
      },
    ],
    locale: 'he_IL',
    type: 'website',
  },
  // הגדרות להתקנה כאפליקציה (PWA) באייפון
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "SAME-SAME",
  },
  icons: {
    apple: "/icon-192x192.png",
    shortcut: "/icon-192x192.png",
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