import { ButtonComponent } from '@shared/components/buttons';
import { useState } from 'react';
import { Loader, Save, User } from 'react-feather';
import { useForm } from 'react-hook-form';

import useAuth from '../../hooks/useAuth';
import UpdateUserRequest from '../../models/user/UpdateUserRequest';
import userService from '../../services/UserService';
import { ImputTextField } from '../../shared/components/imputs';

export default function UpdateProfile() {
  const { authenticatedUser, setAuthenticatedUser } = useAuth();
  const [error, setError] = useState<string>();

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
    setValue,
    clearErrors,
  } = useForm<UpdateUserRequest>({
    defaultValues: {
      firstName: authenticatedUser?.firstName || '',
      lastName: authenticatedUser?.lastName || '',
      username: authenticatedUser?.username || '',
    },
  });

  const handleUpdateUser = async (updateUserRequest: UpdateUserRequest) => {
    try {
      if (updateUserRequest.username === authenticatedUser.username) {
        delete updateUserRequest.username;
      }

      await userService.update(authenticatedUser.id, updateUserRequest);

      setAuthenticatedUser({
        ...authenticatedUser,
        firstName: updateUserRequest.firstName || authenticatedUser.firstName,
        lastName: updateUserRequest.lastName || authenticatedUser.lastName,
        username: updateUserRequest.username || authenticatedUser.username,
      });

      setError(undefined);
      setValue('password', '');
    } catch (error) {
      const errorMessage = error?.response?.data?.message || 'Error al actualizar el perfil';
      setError(errorMessage);
    }
  };

  if (!authenticatedUser) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader className="animate-spin text-blue-600" size={32} />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Welcome Header */}
      <div className="flex items-center space-x-4 mb-5">
        <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary rounded-full flex items-center justify-center">
          <User className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-gray-900">Welcome back, {authenticatedUser.firstName}!</h3>
          <p className="text-gray-600">Update your profile information below</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(handleUpdateUser)} className="space-y-5">
        {/* Name Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ImputTextField
            label="First Name"
            name="firstName"
            register={register}
            errors={errors}
            clearErrors={clearErrors}
            placeholder="Enter your first name"
            rules={{ required: 'First name is required' }}
          />
          <ImputTextField
            label="Last Name"
            name="lastName"
            register={register}
            errors={errors}
            clearErrors={clearErrors}
            placeholder="Enter your last name"
            rules={{ required: 'Last name is required' }}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Username Field */}
          <ImputTextField
            label="Username"
            name="username"
            register={register}
            errors={errors}
            clearErrors={clearErrors}
            placeholder="Enter your username"
            rules={{ required: 'Username is required' }}
          />

          {/* Password Field */}
          <ImputTextField
            label="Password"
            name="password"
            type="password"
            register={register}
            errors={errors}
            clearErrors={clearErrors}
            placeholder="Enter new password (min 6 characters)"
            rules={{
              minLength: {
                value: 6,
                message: 'Password must be at least 6 characters',
              },
            }}
          />
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <p className="text-red-700 font-medium">{error}</p>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <div className="flex justify-end pt-2">
          <ButtonComponent
            type="submit"
            variant="primary"
            size="md"
            disabled={isSubmitting}
            icon={isSubmitting ? <Loader className="animate-spin w-4 h-4" /> : <Save className="w-4 h-4" />}
            title={isSubmitting ? 'Updating...' : 'Update Profile'}
          />
        </div>
      </form>
    </div>
  );
}
