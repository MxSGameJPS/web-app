import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { Roboto, Montserrat } from "next/font/google";

const roboto = Roboto({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-roboto",
});

const montserrat = Montserrat({
  weight: ["400", "600", "800"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-montserrat",
});

export const metadata = {
  title: "Dashboard de Gestão - Curitiba Esterilização",
  description: "Sistema de gestão de carteira",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={`${roboto.variable} ${montserrat.variable}`}>
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
