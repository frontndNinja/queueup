export default function SignUpForm() {
    return (
        <form>
            <label htmlFor="signup-email" className="block text-sm font-medium text-gray-700">Email</label>
            <input type="email" id="signup-email" className="mt-1 block w-full rounded-md border-gray-200 border shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 mb-2" />
            <label htmlFor="signup-password" className="block text-sm font-medium text-gray-700">Password</label>
            <input type="password" id="signup-password" className="mt-1 block w-full rounded-md border-gray-200 border shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 mb-2" />
            <label htmlFor="signup-repeat-password" className="block text-sm font-medium text-gray-700">Repeat Password</label>
            <input type="password" id="signup-repeat-password" className="mt-1 block w-full rounded-md border-gray-200 border shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 mb-2" />
            <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">signup</button>
        </form>
    );
}