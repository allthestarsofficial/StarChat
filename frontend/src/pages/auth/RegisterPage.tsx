import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useRegister } from '@/hooks/useAuth';
import { useAuthStore } from '@/stores/auth.store';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';

const registerSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters').max(32),
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  displayName: z.string().optional(),
});

type RegisterFormData = z.infer<typeof registerSchema>;

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  const register = useRegister();

  const {
    register: formRegister,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      const response = await register.mutateAsync(data);
      setAuth(response.data.data);
      toast.success('Account created successfully!');
      navigate('/');
    } catch (error: any) {
      toast.error(error.response?.data?.error?.message || 'Registration failed');
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Join StarChat</h1>
        <p className="text-slate-400 mt-2">Create your account</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Username</label>
          <input
            type="text"
            {...formRegister('username')}
            className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:border-orange-500 outline-none transition"
            placeholder="username"
          />
          {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Email</label>
          <input
            type="email"
            {...formRegister('email')}
            className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:border-orange-500 outline-none transition"
            placeholder="you@example.com"
          />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Password</label>
          <input
            type="password"
            {...formRegister('password')}
            className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:border-orange-500 outline-none transition"
            placeholder="••••••••"
          />
          {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Display Name (Optional)</label>
          <input
            type="text"
            {...formRegister('displayName')}
            className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:border-orange-500 outline-none transition"
            placeholder="Your display name"
          />
        </div>

        <button
          type="submit"
          disabled={register.isPending}
          className="w-full py-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg font-semibold hover:opacity-90 transition disabled:opacity-50"
        >
          {register.isPending ? 'Creating account...' : 'Create Account'}
        </button>
      </form>

      <p className="text-center text-slate-400">
        Already have an account?{' '}
        <button
          onClick={() => navigate('/login')}
          className="text-orange-500 hover:underline"
        >
          Sign in
        </button>
      </p>
    </div>
  );
};

export default RegisterPage;
