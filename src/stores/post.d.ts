import { Post } from '@/models/Post.ts';
import { PostStatus } from '@/models/Post.ts';
import FeedbackHandler from '@/utils/FeedbackHandler';
import { defineStore } from 'pinia';

export interface PostState {
  posts: Post[];
  post: Post;
  fb: FeedbackHandler;
  postStatuses: PostStatus[];
}

export const usePostStore = defineStore('post', {
  state: (): PostState => ({
    posts: [],
    post: new Post(),
    fb: new FeedbackHandler(),
    postStatuses: []
  }),
  actions: {
    resetPostType() {},
    async fetchPosts() {},
    async fetchPostById(postId: number | string): Promise<Post | any> {},
    async createPost(newPost: Post): Promise<Post | any> {},
    async updatePost(updatedPost: Post) {},
    async deletePost(postId: number | string) {},
    async deletePostImageByProperty(postId: number | string, property: string) {},
    async getPostStatuses(): Promise<PostStatus[]> {},
    async uploadFiles(files: FileToUpload[], property: string, postId: number | string): Promise<PostImage[]> {},
    async deletePostImage(imageId: number | string) {},
    async createPostImport(newImport: FormData): Promise<any> {},
    async createPageImport(newImport: FormData): Promise<any> {},
    async createPostImageImport(newImport: FormData): Promise<any> {},

    async updatePostWayPoints(postId: number | string, wayPoints: any) : Object {},
    async getWayPointSuggestions(query: string): Promise<any[]> {},
    async removePostWayPoint(postId: number | string, pointId: number | string) : Object {},
    async reorderPostImages(reordered: any, postId: number | string) : Object {},

    async deleteGalleryImage(files: Post[], property: string): Promise<any> {},
  }
}); 