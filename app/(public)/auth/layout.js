import "../../globals.css";
import routes from "@/config/routes";

export const metadata = {
  title: routes.auth.title,
  description: routes.auth.description,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
