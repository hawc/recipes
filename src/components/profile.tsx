import React from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';
import Link from 'next/link';

export default function Profile() {
  const { user, error, isLoading } = useUser();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>;

  return (
    (user && (
      <div>
        <div>{user.name}</div>
        <Link href="/api/auth/logout">Logout</Link>
      </div>
    )) || (
      <div>
        <Link href="/api/auth/login">Login</Link>
      </div>
    )
  );
}
