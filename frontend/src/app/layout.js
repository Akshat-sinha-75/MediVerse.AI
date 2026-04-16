import "./globals.css";
import { ThemeProvider } from "@/lib/ThemeProvider";

export const metadata = {
  title: "MediVerse.AI — All Healthcare Intelligence. One Unified AI Platform.",
  description:
    "MediVerse.AI is an AI-powered healthcare platform providing 24/7 intelligent health support, medical record management, medication tracking, and personalized AI chatbot assistance.",
  keywords: "healthcare, AI, medical records, medications, chatbot, health assistant",
  openGraph: {
    title: "MediVerse.AI",
    description: "All healthcare intelligence. One unified AI platform.",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="dark" data-scroll-behavior="smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
