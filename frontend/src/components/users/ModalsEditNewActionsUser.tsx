import Modal from '@components/shared/Modal';
import CreateUserRequest from '@models/user/CreateUserRequest';
import UpdateUserRequest from '@models/user/UpdateUserRequest';
import User from '@models/user/User';
import { ButtonComponent } from '@shared/components/buttons';
import { ImputCheckbox, ImputTextField } from '@shared/components/imputs';
import { SelectField } from '@shared/components/selects';
import { useToast } from '@shared/hooks';
import { useEffect, useState } from 'react';
import { Loader, X } from 'react-feather';
import { useForm } from 'react-hook-form';
import { useQueryClient } from 'react-query';

import userService from '../../services/UserService';

interface ModalsEditNewActionsUserProps {
  modalShow: boolean;
  setModalShow: (show: boolean) => void;
  selectedUser?: User;
}

const ROLES_OPTIONS = [
  { value: 'user', label: 'User' },
  { value: 'editor', label: 'Editor' },
  { value: 'admin', label: 'Admin' },
];

export function ModalsEditNewActionsUser({ modalShow, setModalShow, selectedUser }: ModalsEditNewActionsUserProps) {
  const queryClient = useQueryClient();
  const [error, setError] = useState<string>();
  const { showSuccess, showError } = useToast();

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
    reset,
    setValue,
    formState: { errors },
  } = useForm<UpdateUserRequest>();

  const handleClose = () => {
    setModalShow(false);
    setError(undefined);
    reset();
  };

  const handleUpdate = async (updateUserRequest: UpdateUserRequest) => {
    try {
      await userService.update(selectedUser?.id, updateUserRequest);

      queryClient.invalidateQueries(['users']);

      setModalShow(false);
      reset();
      showSuccess('User updated successfully');
      setError(undefined);
    } catch (error) {
      setError(error.response.data.message);
      showError('Error updating user', error.response.data.message);
    }
  };

  const saveUser = async (createUserRequest: CreateUserRequest) => {
    try {
      await userService.save(createUserRequest);
      queryClient.invalidateQueries(['users']);
      setModalShow(false);
      setError(undefined);
      showSuccess('User created successfully');
      reset();
    } catch (error) {
      setError(error.response.data.message);
      showError('Error creating user', error.response.data.message);
    }
  };

  useEffect(() => {
    if (selectedUser) {
      setValue('firstName', selectedUser?.firstName);
      setValue('lastName', selectedUser?.lastName);
      setValue('username', selectedUser?.username);
      setValue('role', selectedUser?.role);
      setValue('isActive', selectedUser?.isActive);
    }
  }, [selectedUser]);

  return (
    <>
      <Modal show={modalShow}>
        <div className="bg-gray-50 p-6 rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-lg font-semibold text-gray-900">{selectedUser ? 'Update User' : 'Create User'}</h1>
            <button
              className="p-1 hover:bg-gray-200 rounded-full transition-colors focus:outline-none"
              onClick={handleClose}
            >
              <X size={20} className="text-gray-500" />
            </button>
          </div>

          <form className="space-y-4 mt-5" onSubmit={handleSubmit(selectedUser ? handleUpdate : saveUser)}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
              <div>
                <ImputTextField name="firstName" register={register} errors={errors} label="First Name" required />
              </div>
              <div>
                <ImputTextField name="lastName" register={register} errors={errors} label="Last Name" required />
              </div>
              <div>
                <ImputTextField name="username" register={register} errors={errors} label="Username" required />
              </div>

              <div>
                <ImputTextField
                  name="password"
                  register={register}
                  errors={errors}
                  label={selectedUser ? 'New Password' : 'Password'}
                  required={selectedUser ? false : true}
                  type="password"
                />
              </div>
              <div>
                <SelectField
                  name="role"
                  register={register}
                  errors={errors}
                  label="Role"
                  required
                  options={ROLES_OPTIONS}
                />
              </div>

              <div className="flex items-center ">
                <ImputCheckbox
                  label="Active User"
                  name="isActive"
                  register={register}
                  errors={errors}
                  description="Check to make the user active"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <ButtonComponent variant="secondary" title="Cancel" onClick={handleClose} disabled={isSubmitting} />
              <ButtonComponent
                variant="primary"
                title={selectedUser ? (isSubmitting ? 'Updating...' : 'Update') : isSubmitting ? 'Saving...' : 'Create'}
                icon={isSubmitting ? <Loader className="animate-spin" size={16} /> : undefined}
                positionIcon="left"
                disabled={isSubmitting}
                type="submit"
              />
            </div>

            {error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}
          </form>
        </div>
      </Modal>
    </>
  );
}
