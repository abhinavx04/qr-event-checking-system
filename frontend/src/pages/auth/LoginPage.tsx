import { Link } from 'react-router-dom';

const LoginPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
        <div className="text-center">
          <Link to="/register" className="text-blue-500">
            Go to Register
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;