import { SessionData } from "@auth0/nextjs-auth0/types";
import Link from "next/link";
import { Logo } from "./Logo";
import Profile from "./profile";

export function Header({
  session, 
}: { session: SessionData | null; }) {
  return (
    <div className="container is-max-widescreen is-flex is-justify-content-space-between">
      <h1 className="title is-4 m-0 is-flex">
        <Link href="/" className="is-align-self-center">
          <Logo />
        </Link>
      </h1>
      <Profile session={session} />
    </div>
  );
}
