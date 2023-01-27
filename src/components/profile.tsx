import { useUser } from '@auth0/nextjs-auth0/client';
import Link from 'next/link';
import { useDesktopMediaQuery } from '@/lib/mediaQuery';

export default function Profile() {
  const isDesktop = useDesktopMediaQuery();
  const { user, error, isLoading } = useUser();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>;

  return (
    (user && (
      <>
        <Link
          className={
            isDesktop
              ? `mr-6 is-flex is-flex-direction-column is-justify-content-center`
              : `is-flex is-flex-direction-column is-justify-content-center`
          }
          href="/rezept/neu"
        >
          Neues Rezept
        </Link>
        <div className="is-flex">
          <span className="is-flex is-flex-direction-column is-justify-content-center mr-1">
            {user.name}
          </span>
          <span
            className={
              isDesktop
                ? `mr-6 is-flex is-flex-direction-column is-justify-content-center is-white-space-no-wrap`
                : `is-flex is-flex-direction-column is-justify-content-center is-white-space-no-wrap`
            }
          >
            <span>
              (<Link href="/api/auth/logout">Logout</Link>)
            </span>
          </span>
        </div>
      </>
    )) || (
      <span className="is-flex is-flex-direction-column is-justify-content-center">
        <Link href="/api/auth/login">Login</Link>
      </span>
    )
  );
}
