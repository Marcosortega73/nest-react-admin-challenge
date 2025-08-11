import { ModalsEditNewActionsUser } from '@components/users/ModalsEditNewActionsUser';
import { ToastContainer } from '@shared/components/toast';
import { useToast } from '@shared/hooks';
import { useState } from 'react';
import { Plus } from 'react-feather';
import { useQuery } from 'react-query';

import Layout from '../components/layout';
import UsersTable from '../components/users/UsersTable';
import useAuth from '../hooks/useAuth';
import userService from '../services/UserService';
import { ButtonComponent } from '../shared/components/buttons';

export default function Users() {
  const { authenticatedUser } = useAuth();

  const { toasts, removeToast } = useToast();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [role, setRole] = useState('');

  const [modalShow, setModalShow] = useState<boolean>(false);

  const { data, isLoading } = useQuery(['users', firstName, lastName, username, role], async () => {
    return (
      await userService.findAll({
        firstName: firstName || undefined,
        lastName: lastName || undefined,
        username: username || undefined,
        role: role || undefined,
      })
    ).filter(user => user.id !== authenticatedUser.id);
  });

  return (
    <Layout>
      <h1 className="font-semibold text-3xl mb-5">Manage Users</h1>
      <hr />
      <div className="flex justify-end my-5">
        <ButtonComponent
          variant="primary"
          onClick={() => setModalShow(true)}
          className="flex items-center gap-2"
          title="Add User"
          icon={<Plus size={16} />}
          positionIcon="left"
        />
      </div>

      <div className="bg-gray-50 rounded-lg border border-gray-200 p-4 mb-6">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Filter Users</h3>
        <div className="flex flex-wrap gap-3">
          <div className="flex-1 min-w-[160px]">
            <input
              type="text"
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="First name"
              value={firstName}
              onChange={e => setFirstName(e.target.value)}
            />
          </div>
          <div className="flex-1 min-w-[160px]">
            <input
              type="text"
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Last name"
              value={lastName}
              onChange={e => setLastName(e.target.value)}
            />
          </div>
          <div className="flex-1 min-w-[160px]">
            <input
              type="text"
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Username"
              value={username}
              onChange={e => setUsername(e.target.value)}
            />
          </div>
          <div className="flex-1 min-w-[120px]">
            <select
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={role}
              onChange={e => setRole(e.target.value)}
            >
              <option value="">All Roles</option>
              <option value="user">User</option>
              <option value="editor">Editor</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        </div>
      </div>

      <UsersTable data={data} isLoading={isLoading} />

      <ModalsEditNewActionsUser modalShow={modalShow} setModalShow={setModalShow} />
      <ToastContainer toasts={toasts} onRemoveToast={removeToast} />
    </Layout>
  );
}
