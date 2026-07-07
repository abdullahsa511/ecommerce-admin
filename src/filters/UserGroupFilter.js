import UserGroup from '../models/UserGroup.ts';

export class UserGroupFilter {
    constructor() {
        this.name = null;
    }

    matches(userGroup) {
        if (!userGroup) return false;

        if (this.name && !userGroup.userGroupContent?.name.toLowerCase().includes(this.name.toLowerCase())) {
            return false;
        }

        return true;
    }
} 