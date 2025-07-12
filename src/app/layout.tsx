import "../styles/globals.css";

export const metadata = {
  title: "DM Closer – Omen Studios",
  description: "Close more deals in your DMs — instantly.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
