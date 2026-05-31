import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import "./globals.css";
import Providers from "@/components/layout/Providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata = {
  title: "Shop With Endurance Shine",
  description: "A premium female clothing and accessories marketplace",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
  suppressHydrationWarning
  className={`
    ${geistSans.variable}
    ${geistMono.variable}
    ${playfairDisplay.variable}
    antialiased
  `}
>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}