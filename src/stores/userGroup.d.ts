import UserGroup from '@/models/UserGroup';
import FeedbackHandler from '@/utils/FeedbackHandler';
import ImportExport from '@/models/ImportExport';
import { defineStore } from 'pinia';

export interface UserGroupState {
  userGroups: UserGroup[];
  userGroup: UserGroup;
  fb: FeedbackHandler;
  model: string;
  importExport: ImportExport;
  filter: any;
}

export const useUserGroupStore = defineStore('userGroup', {
  state: (): UserGroupState => ({
    userGroups: [],
    userGroup: new UserGroup(),
    importExport: new ImportExport(),
    fb: new FeedbackHandler(),
    model: 'userGroup',
    filter: null,
  }),
  actions: {
    async fetchUserGroups() {},
    async fetchUserGroupById(userGroupId: number): Promise<UserGroup | any> { },
    async createUserGroup(newUserGroup: UserGroup): Promise<UserGroup | any> { },
    async updateUserGroup(userGroupId: number, updatedUserGroup: UserGroup) { },
    async deleteUserGroup(userGroupId: number) { },
    async userGroupsImport(newImport: FormData): Promise<any> {},
    resetUserGroup() {}
  }
});