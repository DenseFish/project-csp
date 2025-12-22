import "./globals.css";
import Navbar from "./components/Navbar";
import { MyListProvider } from "@/app/context/MyListContext";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <MyListProvider>
          <Navbar />
          {children}
        </MyListProvider>
      </body>
    </html>
  );
}
