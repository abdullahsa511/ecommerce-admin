import { User } from '@/models/User';
import ImportExport from '../models/ImportExport';
import { FeedbackHandler } from './FeedbackHandler';

export interface UserStore {
  users: User[];
  newUser: User;
  importExport: ImportExport;
  fb: FeedbackHandler;
  model: string;
}
export const useUserStore = defineStore('user', {
  state: (): UserStore => ({
    users: [],
    newUser: new User(),
    importExport: new ImportExport(),
    fb: new FeedbackHandler(),
    model: 'user',
  }),
  actions: {
    resetNewUser(): void {},
    async fetchUsers(): Promise<User[]> {},
    async fetchUserById(userId: number): Promise<User> {},
    async createUser(user: User): Promise<User> {},
    async updateUser(userId: number, user: User): Promise<User> {},
    async deleteUser(userId: number): Promise<void> {},
    async usersImport(newImport: FormData): Promise<ImportExport> {},
    async uploadUserImages(files: File[], property: string, userId: number): Promise<File[]> {},
    async deleteUserImages(file: File, userId: number): Promise<void> {},
  }
});