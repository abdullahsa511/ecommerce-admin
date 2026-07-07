import Component from '@/models/Component';
import { FileToUpload } from '@/models/File';
import { FeedbackHandler } from '@/utils/FeedbackHandler';
import { Ref } from 'vue';
import { defineStore } from 'pinia';
import { Customer } from '@/models/Customer';
import { ProjectStatus } from '@/models/Project';

export interface ProjectState {
  files: FileToUpload[];
  projects: Project[];
  project: Project;
  fb: FeedbackHandler;
  categories: any[];
  productLists: any[];
  projectStatuses: ProjectStatus[];
}

export const useProjectStore = defineStore('project', {
  state: (): ProjectState => ({
    files: [],
    projects: [],
    project: new Project(),
    fb: new FeedbackHandler(),
    categories: [],
    productLists: [],
    projectStatuses: []
  }),
  actions: {
    resetProjectForm() {},
    async fetchProjects() {},
    async fetchProjectById(projectId: number | string): Promise<Project | any> {},
    async createProject(newProject: Project): Promise<Project | any> {},
    async updateProject(updatedProject: Project) {},
    async deleteProject(projectId: number | string) {},
    async deleteProjectImage(imageId: number | string) {},
    async getCategories() {},
    async searchProjects(query: string): Promise<Project[]> {},
    async searchCustomers(query: string): Promise<Customer[]> {},
    async getProjectOptionList(): Promise<ProjectOption[]> {},
    async getProjectStatuses(): Promise<ProjectStatus[]> {},
    async uploadFiles(files: FileToUpload[], property: string, projectId: number | string) {},
    async deleteImageByFilePath(filepath: string, property: string, projectId:number) : Object {},

    async updateProjectWayPoints(projectId: number | string, wayPoints: any) : Object {},
    async getWayPointSuggestions(query: string): Promise<any[]> {},
    async removeProjectWayPoint(projectId: number | string, pointId: number | string) : Object {},
    async reorderProjectImages(reordered: any, projectId: number | string) : Object {},
    async deleteMultipleImagesById(files: FileToUpload[], property: string) {},
  }
}); 