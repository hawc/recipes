import { Header } from "@/components/Header";
import { auth0 } from "@/lib/auth0";
import "@/styles/globals.scss";
import type {
  Metadata, Viewport,
} from "next";
import { PropsWithChildren } from "react";

export const metadata: Metadata = {
  title: "Das Kochbuch",
  robots: "noindex, nofollow",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default async function Layout({
  children,
}: PropsWithChildren) {
  const session = await auth0.getSession();

  return (
    <html lang="en">
      <body>
        <div>
          <header className="section header py-5 has-text-white has-background-black">
            <Header session={session} />
          </header>
          <hr className="my-0" />
          {children}
        </div>
      </body>
    </html>
  );
}
