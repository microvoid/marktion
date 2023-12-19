import { luciaAuth } from '@/libs';
import { redirect } from 'next/navigation';

const Page = async () => {
  const session = await luciaAuth.getSession();

  if (session) redirect('/');

  return (
    <>
      <h1>Sign in</h1>
      <a href="/login/github">Sign in with GitHub</a>
    </>
  );
};

export default Page;
