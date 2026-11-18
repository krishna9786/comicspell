import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import WriteForUsClient from '@/components/WriteForUsClient';

export default async function WriteForUsPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect('/sign-in');
  }

  return <WriteForUsClient />;
}