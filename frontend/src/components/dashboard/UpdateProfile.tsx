import { useState } from 'react';
import { Loader } from 'react-feather';
import { useForm } from 'react-hook-form';

import useAuth from '../../hooks/useAuth';
import UpdateUserRequest from '../../models/user/UpdateUserRequest';
import userService from '../../services/UserService';

export default function UpdateProfile() {
  const { authenticatedUser, setAuthenticatedUser } = useAuth();
  const [error, setError] = useState<string>();

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
    setValue,
  } = useForm<UpdateUserRequest>();

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
      <div className="card shadow">
        <div className="flex justify-center items-center p-8">
          <Loader className="animate-spin" size={32} />
        </div>
      </div>
    );
  }

  return (
    <div className="card shadow">
      <form
        className="flex mt-3 flex-col gap-3 justify-center md:w-1/2 lg:w-1/3 mx-auto items-center"
        onSubmit={handleSubmit(handleUpdateUser)}
      >
        <h1 className="font-semibold text-4xl mb-10">{`Welcome ${authenticatedUser.firstName}`}</h1>
        <hr />
        <div className="flex gap-3 w-full">
          <div className="w-1/2">
            <label className="font-semibold">First Name</label>
            <input
              type="text"
              className="input w-full mt-1"
              defaultValue={authenticatedUser.firstName}
              disabled={isSubmitting}
              placeholder="First Name"
              {...register('firstName')}
            />
          </div>
          <div className="w-1/2">
            <label className="font-semibold">Last Name</label>
            <input
              type="text"
              className="input w-full mt-1"
              defaultValue={authenticatedUser.lastName}
              disabled={isSubmitting}
              placeholder="Last Name"
              {...register('lastName')}
            />
          </div>
        </div>
        <div className="w-full">
          <label className="font-semibold">Username</label>
          <input
            type="text"
            className="input w-full mt-1"
            defaultValue={authenticatedUser.username}
            disabled={isSubmitting}
            placeholder="Username"
            {...register('username')}
          />
        </div>
        <div className="w-full">
          <label className="font-semibold">Password</label>
          <input
            type="password"
            className="input w-full mt-1"
            placeholder="Password (min 6 characters)"
            disabled={isSubmitting}
            {...register('password')}
          />
        </div>
        <button className="btn w-full" disabled={isSubmitting}>
          {isSubmitting ? <Loader className="animate-spin mx-auto" /> : 'Update'}
        </button>
        {error ? <div className="text-red-500 p-3 font-semibold border rounded-md bg-red-50">{error}</div> : null}
      </form>
    </div>
  );
}
