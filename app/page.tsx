'use client';

import { useSession, signIn, signOut } from 'next-auth/react';

export default function Home() {
  const { data: session, status } = useSession();

  console.log('Session Status:', status);
  console.log('Session Data:', session);

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (session) {
    return (
      <div>
        <p>Signed in as {session.user?.email}</p>
        <p>Role: {session.user?.role}</p>
        <button onClick={() => signOut()}>Sign out</button>
      </div>
    );
  }

  return (
    <div>
      <p>Not signed in</p>
      <button onClick={() => signIn('azure-ad')}>Sign in</button>
    </div>
  );
}


