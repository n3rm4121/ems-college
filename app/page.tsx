import { auth } from '@/auth';
import ShowEvents from '@/components/showEvents';
import React from 'react';

async function Home() {
  const session = await auth();
  console.log(session?.user);
  return (
    <ShowEvents />
  );
}

export default Home;