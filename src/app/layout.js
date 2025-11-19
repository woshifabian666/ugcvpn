import { ClerkProvider } from "@clerk/nextjs";

export const metadata = {
  title: "VPN App",
  description: "Login to manage your VPN keys",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>{children}</body>
      </html>
    </ClerkProvider>
  );
}
