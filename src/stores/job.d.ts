import { Job } from '@/models/Job.ts';
import FeedbackHandler from '@/utils/FeedbackHandler';
import { defineStore } from 'pinia';
import ImportExport from '@/models/ImportExport';

export interface JobState {
  jobs: Job[];
  job: Job;
  importExport: ImportExport;
  fb: FeedbackHandler;
}

export const useJobStore = defineStore('job', {
  state: (): JobState => ({
    jobs: [],
    job: new Job(),
    importExport: new ImportExport(),
    fb: new FeedbackHandler()
  }),
  actions: {
    resetJob(): void,
    async fetchJobs() {},
    async fetchJobById(jobId: number | string): Promise<Job | any> {},
    async createJob(newJob: Job): Promise<Job | any> {},
    async updateJob(updatedJob: Job): Promise<Job | any> {},
    async deleteJob(jobId: number | string): Promise<void> {},
    async importJobs(newImport: FormData): Promise<any> {}
  }
}); 