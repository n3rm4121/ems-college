'use client'
import ShowEvents from '@/components/showEvents';
import React from 'react';
import Calendar from './(dashboard)/components/dashboard';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';



function Home() {
  const { data: session } = useSession();
  if (!session) {
    redirect('/auth/signin')
  }
  return (
    // <ShowEvents />
    <Calendar />
  );
}

export default Home;