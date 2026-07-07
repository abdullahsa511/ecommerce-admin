import Component from '@/models/Component';
import { FileToUpload } from '@/models/File';
import { FeedbackHandler } from '@/utils/FeedbackHandler';
import { Ref } from 'vue';
import { defineStore } from 'pinia';

export interface ComponentState {
  components: Component[];
  componentData: Component;
  componentItems: ComponentItem[];
  fb: FeedbackHandler;
}

export const useComponentStore = defineStore('component', {
  state: (): ComponentState => ({
    componentData: new Component(),
    componentItems: [],
    components: [],
    fb: new FeedbackHandler()
  }),
  actions: {
    resetComponent() {},
    async fetchComponents() {},
    async fetchComponentById(componentId: number | string) {},
    async createComponent(newComponent: Component) {},
    async updateComponent(componentId: number | string, updatedComponent: Component) {},
    async deleteComponent(componentId: number | string) {},
    async uploadComponentImages(files: FileToUpload[], property: string, componentId: number | string) {},
    async uploadComponentImage(files: FileToUpload[], property: string, componentId: number | string) {},
    async uploadComponentMobileBanner(files: FileToUpload[], property: string, componentId: number | string) {},
    async deleteImageByFilePath(filepath: any, property: string, componentId: number | string) : Object {},

    async updateComponentWayPoints(componentId: number | string, wayPoints: any) : Object {},
    async getWayPointSuggestions(query: string): Promise<any[]> {}
  }
}); 