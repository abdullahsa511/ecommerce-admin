import { Role } from '@/models/Role';
import FeedbackHandler from '@/utils/FeedbackHandler';

export interface RoleStore {
  roles: Role[];
  newRole: Role;
  fb: FeedbackHandler;
  resetNewRole: () => void;
  createRole: (role: Role) => Promise<void>;
  updateRole: (roleId: number, role: Role) => Promise<void>;
  deleteRole: (roleId: number) => Promise<void>;
  fetchRoles: () => Promise<void>;
  fetchRoleById: (roleId: number) => Promise<Role>;
  model: string;
}
export const useRoleStore = defineStore('role', {
  state: (): RoleState => ({
    roles: [],
    newRole: new Role(),
    fb: new FeedbackHandler(),
    model: 'role',
  }),
  actions: {
    async fetchRoles(): Promise<Role[]> {},
    async fetchRoleById(roleId: number): Promise<Role> {},
    async createRole(role: Role): Promise<Role> {},
    async updateRole(roleId: number, role: Role): Promise<Role> {},
    async deleteRole(roleId: number): Promise<void> {},
  }
});

  // createRole: (role: Role) => Promise<void>;
  // updateRole: (roleId: number, role: Role) => Promise<void>;
  // deleteRole: (roleId: number) => Promise<void>;
  // fetchRoles: () => Promise<void>;
  // fetchRoleById: (roleId: number) => Promise<Role>;

