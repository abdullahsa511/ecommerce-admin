import { Page } from '@/models/Page.ts';
import { PageStatus } from '@/models/Page.ts';
import FeedbackHandler from '@/utils/FeedbackHandler';
import { defineStore } from 'pinia';

export interface PageState {
  pages: Page[];
  fb: FeedbackHandler;
  pageStatuses: PageStatus[];
}

export const usePageStore = defineStore('page', {
  state: (): PageState => ({
    pages: [],
    fb: new FeedbackHandler(),
    pageStatuses: []
  }),
  actions: {
    async fetchPages() {},
    async fetchPageById(pageId: number | string): Promise<Page | any> {},
    async createPage(newPage: Page): Promise<Page | any> {},
    async updatePage(updatedPage: Page) {},
    async deletePage(pageId: number | string) {},
    async getPageStatuses(): Promise<PageStatus[]> {},
    async uploadFiles(files: FileToUpload[], property: string, pageId: number | string) {},
    async deleteImageByFilePath(filepath: string, property: string, projectId:number) : Object
  }
}); 