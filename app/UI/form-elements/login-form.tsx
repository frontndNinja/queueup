export default function LoginForm() {
    return (
        <form>
            <label htmlFor="login-email" className="block text-sm font-medium text-gray-700">Email</label>
            <input type="email" id="login-email" className="mt-1 block w-full rounded-md border-gray-200 border shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 mb-2" />
            <label htmlFor="login-password" className="block text-sm font-medium text-gray-700">Password</label>
            <input type="password" id="login-password" className="mt-1 block w-full rounded-md border-gray-200 border shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 mb-2" />
            <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Login</button>
        </form>
    );
}