import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Button from '../../components/UI/Button';
import toast from 'react-hot-toast';
import axios from 'axios';

const VerifyEmail = () => {
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email;

  const handleVerify = async () => {
    setIsLoading(true);
    try {
      await axios.post('/api/auth/verify-email', { email, code });
      toast.success('Email verified successfully!');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Verification failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-lg space-y-4">
        <h2 className="text-2xl font-bold text-center">Verify Your Email</h2>
        <p className="text-center text-gray-600">Enter the 6-digit code sent to <b>{email}</b></p>
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          maxLength={6}
          className="w-full p-2 border rounded text-center text-xl tracking-widest"
          placeholder="123456"
        />
        <Button onClick={handleVerify} loading={isLoading} className="w-full">Verify Email</Button>
      </div>
    </div>
  );
};

export default VerifyEmail;
