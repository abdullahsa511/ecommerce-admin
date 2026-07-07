import PostTag from '@/models/PostTag';
import FeedbackHandler from '@/utils/FeedbackHandler';
import PostTagFilter from '@/filters/PostTagFilter';
import { defineStore } from 'pinia';
import { FileToUpload } from '@/models/File';
import PostTagImportResponse from '@/models/PostTagImport';

export interface PostTagState {
  postTags: PostTag[];
  postTag: PostTag;
  filter: PostTagFilter;
  fb: FeedbackHandler;
  model: string;
  importExport: PostTagImportResponse;
}

export const usePostTagStore = defineStore('postTag', {
  state: (): PostTagState => ({
    postTags: [],
    postTag: new PostTag(),
    filter: new PostTagFilter(),
    fb: new FeedbackHandler(),
    model: 'postTag'
  }),
  actions: {
    resetPostTag() {},
    async fetchPostTags() {},
    async fetchPostTagById(postTagId: number | string): Promise<PostTag | any> {},
    async createPostTag(newPostTag: Partial<PostTag>): Promise<PostTag | any> {},
    async updatePostTag(posttagId: number | string, updatedTag: Partial<PostTag>): Promise<PostTag | any> {},
    async getPostTagById(posttagId: number | string) {},
    async deletePostTag(posttagId: number | string) {},
    async uploadFiles(files: FileToUpload[], property: string, postTagId: number | string): Promise<any> {},
    async deletePostTagImageByProperty(posttagId: number | string, property: string) {},
    async deleteImageByFilePath(filepath: string, property: string, postTagId: number | string): Promise<any> {},
    async postTagsImport(newImport: FormData): Promise<any> {}
  }
});
