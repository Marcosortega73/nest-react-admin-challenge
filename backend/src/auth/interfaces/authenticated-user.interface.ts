import { Role } from '../../enums/role.enum';

export interface AuthenticatedUser {
  userId: string;
  username: string;
  firstName: string;
  lastName: string;
  role: Role;
  isActive: boolean;
}
