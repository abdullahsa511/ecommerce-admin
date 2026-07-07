import Component from '@/models/Component';
import { FileToUpload } from '@/models/File';
import { FeedbackHandler } from '@/utils/FeedbackHandler';
import { Ref } from 'vue';
import { defineStore } from 'pinia';

export interface MediaState {
  files: FileToUpload[];
  breadcrumbs: any[];
  currentFolder: any;
  folders: any[];
  subFolders: any[];
  folderFiles: FileToUpload[];
  metrics: any;
  fb: FeedbackHandler;

  // wayPoints: WayPoint[];
  // wayPoint: WayPoint;
}

export const useMediaStore = defineStore('media', {
  state: (): MediaState => ({
    files: [],
    breadcrumbs: [],
    currentFolder: any,
    folders: [],
    subFolders: [],
    folderFiles: [],
    metrics: {},
    fb: new FeedbackHandler(),

    // wayPoints = [],
    // wayPoint = new WayPoint(),
  }),
  actions: {
    async fetchFiles() {},
    async fetchFolders() {},
    async fetchSubFolders(folderId: number | string, folderName: string | null) {},
    async fetchMetrics() {},
    async fetchFileById(fileId: number | string) {},
    async createFile(newFile: FileToUpload) {},
    async updateFile(fileId: number | string, updatedFile: FileToUpload) {},
    async deleteFile(fileId: number | string, breadcrumb: any | null) {},
    async deleteFiles(path: string, files: any) {},
    async deleteFolder(folderId: number | string) {},
    async uploadFiles(files: FileToUpload[], siteId: any, property: string, options?: any = {}) {},
    async uploadFile(files: FileToUpload[], property: string) {},
    async addFolder(folder: any) {},
    async uploadFilesToFolder(files: FileToUpload[], folderId: number | string, breadcrumb: any | null) {},
    async getMediaById(id:any){},
    async deleteImageByFilePath(filepath: string, property: string) : Object
  }
}); 