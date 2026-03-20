
import { Metadata } from 'next';
import SignUpForm from '../../UI/form-elements/signup-form';

export const metadata: Metadata = {
    title: "Signup",
};

export default function SignUpPage() {
    return (
        <div>
            <p>this is a Signup page</p>
            <div className="w-[500px]">
                <SignUpForm />
            </div>
        </div>
    );
}