import AttributeGroup from '@/models/AttributeGroup';
import AttributeGroupImportResponse from '@/models/AttributeGroupImport';
import FeedbackHandler from '@/utils/FeedbackHandler';
import { defineStore } from 'pinia';

export interface AttributeGroupState {
  attributeGroups: AttributeGroup[]; // list of attribute groups
  attributeGroup: AttributeGroup; // single attribute group
  fb: FeedbackHandler;
  model: string;
  importExport: AttributeGroupImportResponse;
}

export const useAttributeGroupStore = defineStore('attributeGroup', {
  state: (): AttributeGroupState => ({
    attributeGroups: [], // list of attribute groups
    attributeGroup: new AttributeGroup(), // single attribute group
    importExport: new AttributeGroupImportResponse(),
    fb: new FeedbackHandler(),
    model: 'attributeGroup'
  }),
  actions: {
    resetAttributeGroup() {},
    async fetchAttributeGroups() {},
    async createAttributeGroup(newAttributeGroup: AttributeGroup): Promise<AttributeGroup | any> { },
    async updateAttributeGroup(updatedAttributeGroup: AttributeGroup) { },
    async getAttributeGroupById(id: number | string) { },
    async deleteAttributeGroup(id: number | string) { },
    async attributeGroupsImport(newImport: FormData): Promise<any> {}
  }
}); 