"use client";

import { useDesktopMediaQuery } from "@/lib/mediaQuery";
import { SessionData } from "@auth0/nextjs-auth0/types";
import Link from "next/link";

export default function Profile({
  session, 
}: {
  session: SessionData | null
}) {
  const isDesktop = useDesktopMediaQuery();
  
  if (!session) {
    return (
      <span className="is-flex is-flex-direction-column is-justify-content-center">
        <a href="/auth/login">Login</a>
      </span>
    );
  }

  return (
    <div className={isDesktop ? "is-flex is-flex-direction-row" : "is-flex is-flex-direction-column has-text-right"}>
      <Link
        className={`${
          isDesktop && "mr-6"
        } is-flex is-flex-direction-column is-justify-content-center`}
        href="/rezept/neu"
      >
        Neues Rezept
      </Link>
      <div className="is-flex">
        <span className="is-flex is-flex-direction-column is-justify-content-center mr-1">
          {session.user.name}
        </span>
        <span
          className={`${
            isDesktop && "mr-6"
          } is-flex is-flex-direction-column is-justify-content-center is-white-space-no-wrap`}
        >
          <span>
            (<a href="/auth/logout">Logout</a>)
          </span>
        </span>
      </div>
    </div>
  );
}
