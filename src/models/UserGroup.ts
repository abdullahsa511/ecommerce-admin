/**
 * @fileoverview UserGroup model class for managing user group configurations
 */

export interface IUserGroupContent {
  name: string;
  content: string;
  language_id: number;
  user_group_id: number;
}

export class UserGroupContent implements IUserGroupContent {
  name: string;
  content: string;
  language_id: number;
  user_group_id: number;

  constructor(data: Partial<IUserGroupContent> = {}) {
    this.name = data.name ?? '';
    this.content = data.content ?? '';
    this.language_id = data.language_id ?? 1;
    this.user_group_id = data.user_group_id ?? 0;
  }
}

export interface IUserGroup {
  user_group_id: number | null;
  status: number;
  sort_order: number;
  userGroupContent: UserGroupContent;
}

export default class UserGroup implements IUserGroup {
  user_group_id: number | null;
  status: number;
  sort_order: number;
  userGroupContent: UserGroupContent;

  constructor(data: Partial<IUserGroup> = {}) {
    this.user_group_id = data.user_group_id ?? null;
    this.status = data.status ?? 1;
    this.sort_order = data.sort_order ?? 1;
    this.userGroupContent = new UserGroupContent(data.userGroupContent);
  }

  static fromJSON(data: Partial<IUserGroup>): UserGroup {
    return new UserGroup(data);
  }

  toJSON(): IUserGroup {
    return {
      user_group_id: this.user_group_id,
      status: this.status,
      sort_order: this.sort_order,
      userGroupContent: this.userGroupContent
    };
  }
} 