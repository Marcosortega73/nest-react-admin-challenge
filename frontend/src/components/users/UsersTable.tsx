import EmptyState from '@features/courses/components/EmptyState';
import User from '@models/user/User';
import { ConfirmationModal } from '@shared/components/modals';
import { useToast } from '@shared/hooks';
import { useState } from 'react';
import { Edit, Trash2, Users } from 'react-feather';
import { useMutation, useQueryClient } from 'react-query';

import userService from '../../services/UserService';
import { IconButtonComponent } from '../../shared/components/buttons';
import Table from '../shared/Table';
import TableItem from '../shared/TableItem';
import { ModalsEditNewActionsUser } from './ModalsEditNewActionsUser';

interface UsersTableProps {
  data: User[];
  isLoading: boolean;
}

export default function UsersTable({ data, isLoading }: UsersTableProps) {
  const queryClient = useQueryClient();
  const [modalShow, setModalShow] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<User>();
  const { showSuccess, showError } = useToast();

  const [deleteConfirmation, setDeleteConfirmation] = useState<{ isOpen: boolean; title: string; message: string }>({
    isOpen: false,
    title: '',
    message: '',
  });

  const handleCancelDelete = () => {
    setDeleteConfirmation({ isOpen: false, title: '', message: '' });
  };

  const handleConfirmDelete = () => {
    deleteUserMutation.mutate(selectedUser?.id);
    setDeleteConfirmation({ isOpen: false, title: '', message: '' });
  };

  const deleteUserMutation = useMutation((id: string) => userService.delete(id), {
    onSuccess: () => {
      queryClient.invalidateQueries(['users']);
      showSuccess(
        'User Deleted',
        `The user ${selectedUser?.firstName} ${selectedUser?.lastName} has been deleted successfully.`,
      );
      setSelectedUser(null);
    },
    onError: error => {
      console.error('Error deleting user:', error);
      showError('Delete Failed', 'There was an error deleting the user. Please try again.');
    },
  });

  const handleDelete = async (user: User) => {
    setSelectedUser(user);
    setDeleteConfirmation({
      isOpen: true,
      title: 'Delete User',
      message: 'Are you sure you want to delete this user?',
    });
  };

  return (
    <>
      <div className="table-container">
        <Table columns={['Name', 'Username', 'Status', 'Role', 'Created']}>
          {isLoading
            ? null
            : data.map((user: User) => (
                <tr key={user.id}>
                  <TableItem>{`${user.firstName} ${user.lastName}`}</TableItem>
                  <TableItem>{user.username}</TableItem>
                  <TableItem>
                    {user.isActive ? (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Active
                      </span>
                    ) : (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                        Inactive
                      </span>
                    )}
                  </TableItem>
                  <TableItem>{user.role}</TableItem>
                  <TableItem className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <IconButtonComponent
                        icon={<Edit size={16} />}
                        variant="secondary"
                        className="hover:bg-gray-200 text-primary "
                        size="sm"
                        shape="rounded"
                        tooltip="Edit user"
                        onClick={() => {
                          setSelectedUser(user);
                          setModalShow(true);
                        }}
                      />
                      <IconButtonComponent
                        icon={<Trash2 size={16} />}
                        variant="minimal"
                        size="sm"
                        shape="rounded"
                        tooltip="Delete user"
                        onClick={() => {
                          handleDelete(user);
                        }}
                      />
                    </div>
                  </TableItem>
                </tr>
              ))}
        </Table>

        {!isLoading && data.length < 1 ? (
          <div className="text-center my-5 text-primary">
            <EmptyState
              icon={<Users size={32} />}
              title="No users found"
              description="There are no users in the system."
            />
          </div>
        ) : null}
      </div>

      <ConfirmationModal
        isOpen={deleteConfirmation.isOpen}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title={deleteConfirmation.title}
        message={deleteConfirmation.message}
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        isLoading={deleteUserMutation.isLoading}
      />

      <ModalsEditNewActionsUser modalShow={modalShow} setModalShow={setModalShow} selectedUser={selectedUser} />
    </>
  );
}
