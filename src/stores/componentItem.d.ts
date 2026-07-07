import { ItemForm, ItemModelForm } from '@/models/Component';
import FeedbackHandler from '@/utils/FeedbackHandler';
import { defineStore } from 'pinia';

export interface ComponentItemState {
  componentData: Component;
  components: Component[];
  componentItems: ComponentItem[];
  fb: FeedbackHandler;
  model: string;
}

export const useComponentItemStore = defineStore('componentItem', {
  state: (): ComponentItemState => ({
    componentData: new Component(),
    components: [],
    componentItems: [],
    fb: new FeedbackHandler(),
    model: 'componentItem'
  }),
  actions: {
    async fetchComponentItems(componentId: number | string): Promise<ComponentItem[]> {},
    async addComponentItem(componentItem: ItemModelForm | ItemForm): Promise<any> {},
    async updateComponentItem(itemId: number | string, updatedItem: ItemModelForm | ItemForm): Promise<any> {},
    async deleteComponentItem(itemId: number | string): Promise<void> {}
  }
}); 