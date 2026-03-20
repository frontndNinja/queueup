
import { Metadata } from 'next';
import LoginForm from '../../UI/form-elements/login-form';

export const metadata: Metadata = {
    title: "Login",
};

export default function LoginPage() {
    return (
        <div>
            <p>this is a login page</p>
            <div className="w-[500px]">
                <LoginForm />
            </div>
        </div>
    );
}