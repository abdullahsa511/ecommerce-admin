
import FeedbackHandler from '@/utils/FeedbackHandler';
import PostTypeFilter from '@/filters/PostTypeFilter';
import { defineStore } from 'pinia';
import PostTypeImportResponse from '@/models/PostTypeImport';
import PostType from '@/models/PostType';

export interface PostTypeState {
  postTypes: PostType[];
  postType: PostType;
  filter: PostTypeFilter;
  fb: FeedbackHandler;
  model: string;
  importExport: PostTypeImportResponse;
}

export const usePostTypeStore = defineStore('postType', {
  state: (): PostTypeState => ({
    postTypes: [],
    postType: new PostType(),
    filter: new PostTypeFilter(),
    fb: new FeedbackHandler(),
    model: 'postType',
    importExport: new PostTypeImportResponse(),
  }),
  actions: {
    resetPostType() {},
    async fetchPostTypes() {},
    async fetchPostTypeById(postTypeId: number | string): Promise<PostType | any> {},
    async createPostType(newPostType: Partial<PostType>): Promise<PostType | any> {},
    async updatePostType(postTypeId: number | string, updatedPostType: Partial<PostType>): Promise<PostType | any> {},
    async deletePostType(postTypeId: number | string) {},
    async postTypeImport(newImport: FormData): Promise<any> {},
    async uploadPostTypeImages(files: File[], property: string, postTypeId: number | string): Promise<any> {},
    async deletePostTypeImages(file: File, postTypeId: number | string): Promise<any> {},
  }
});
