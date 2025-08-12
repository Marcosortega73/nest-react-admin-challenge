import LoginBackground from '@assets/images/brand/heptagon-patron-bg.webp';
/* import LogoBlack from '@assets/images/brand/urbano-logo-black.webp';
 */
import LogoBlack from '@assets/images/brand/urbano-logo.png';
import { ButtonComponent } from '@shared/components/buttons';
import { ImputTextField } from '@shared/components/imputs';
import { useState } from 'react';
import { Loader } from 'react-feather';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import useAuth from '../hooks/useAuth';
import LoginRequest from '../models/auth/LoginRequest';
import authService from '../services/AuthService';

export default function Login() {
  const { setAuthenticatedUser } = useAuth();
  const navigate = useNavigate();

  const [error, setError] = useState<string>();

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<LoginRequest>();

  const onSubmit = async (loginRequest: LoginRequest) => {
    try {
      const data = await authService.login(loginRequest);
      setAuthenticatedUser(data.user);
      navigate('/');
    } catch (error) {
      setError(error.response.data.message);
    }
  };

  return (
    <div
      className="min-h-screen  flex items-center justify-center p-4 bg-cover  bg-repeat bg-[#606163]"
      style={{ backgroundImage: `url(${LoginBackground})` }}
    >
      <div className="relative z-10 w-full max-w-md bg-[#ffffff] rounded-3xl">
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8">
          <div className="text-center mb-8">
            <div className="mb-5 flex items-center justify-center w-full">
              <img src={LogoBlack} alt="Logo" className="w-full max-w-48" />
            </div>

            <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-2">
              Welcome Back
            </h2>
            <p className="text-gray-600 text-sm">Sign in to your account to continue</p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-4">
              <div className="relative">
                <ImputTextField
                  label="Username"
                  type="text"
                  placeholder="Username"
                  required
                  name="username"
                  disabled={isSubmitting}
                  register={register}
                />
              </div>

              <div className="relative">
                <ImputTextField
                  label="Password"
                  type="password"
                  placeholder="Password"
                  required
                  name="password"
                  disabled={isSubmitting}
                  register={register}
                  className="text-gray-900"
                />
              </div>
            </div>

            <ButtonComponent
              type="submit"
              disabled={isSubmitting}
              title={isSubmitting ? 'Signing in...' : 'Sign In'}
              variant="primary"
              size="lg"
              icon={isSubmitting ? <Loader className="animate-spin mr-2" size={18} /> : undefined}
              positionIcon="left"
              className="w-full flex items-center justify-center"
            />

            {error && (
              <div className="bg-red-50/80 backdrop-blur-sm border border-red-200/50 text-red-700 px-4 py-3 rounded-xl text-sm">
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {error}
                </div>
              </div>
            )}
          </form>

          <div className="mt-8 text-center">
            <p className="text-xs text-gray-500">Secure login powered by UrbanoChallenge</p>
          </div>
        </div>
      </div>
    </div>
  );
}
