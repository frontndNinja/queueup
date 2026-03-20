import { Metadata } from 'next';
import SignOutButton from "@/app/UI/form-elements/signout-button";
import Button from '@/app/UI/base/button';

export const metadata: Metadata = {
  title: "QueueUp",
};
export default function Home() {

  return (

    <div className="min-h-screen min-w-screen">
      <nav className="flex items-center justify-center gap-4 p-4">
        <SignOutButton />
        <Button text="Login" goTo={'/api/auth/signin'} />
      </nav>
      <main className="bg-gray-50 w-full h-full flex items-center justify-center gap-4">
        <p>test</p>
      </main>
    </div>
  );

}
