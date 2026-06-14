import { Metadata } from 'next';
import LoginForm from '../../UI/form-elements/login-form';

export const metadata: Metadata = {
    title: "Login",
};

const authErrors: Record<string, string> = {
    google: "Google sign-in failed. Check that NEXTAUTH_URL matches your dev port and the Google OAuth redirect URI is configured.",
    OAuthSignin: "Could not start sign-in. Check your auth environment variables.",
    OAuthCallback: "Sign-in callback failed.",
    Configuration: "Auth is misconfigured on the server.",
};

export default async function LoginPage({
    searchParams,
}: {
    searchParams: Promise<{ error?: string; callbackUrl?: string; }>;
}) {
    const { error } = await searchParams;
    const errorMessage = error ? authErrors[error] ?? "Sign-in failed. Please try again." : null;

    return (
        <div>
            <p>this is a login page</p>
            {errorMessage && (
                <p className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
                    {errorMessage}
                </p>
            )}
            <div className="w-[500px]">
                <LoginForm />
            </div>
        </div>
    );
}
