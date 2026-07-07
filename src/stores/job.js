import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import FeedbackHandler from '../utils/FeedbackHandler';
import JobService from '../service/JobService';
import { Job } from '../models/Job';
import ImportExport from '../models/ImportExport';

export const useJobStore = defineStore('job', () => {
    /**
     * @type {import('vue').Ref<Job[]>}
     */
    const jobs = ref([]);
    const job = ref(new Job());
    /**
    * @type {import('vue').Ref<FeedbackHandler>}
    */
    const importExport = ref(new ImportExport());
    const fb = ref(new FeedbackHandler());
    const model = 'job';

    const resetJob = () => {
        job.value = new Job();
    };

    const fetchJobs = async () => {
        fb.value.clearError(model);
        fb.value.removeSuccess(model);
        fb.value.startLoading(model);
        try {
            const response = await JobService.getJobs();
            jobs.value = response.map(job => new Job(job));
            fb.value.showSuccess(model);
        } catch (err) {
            fb.value.setError(err, model);
        } finally {
            fb.value.finishLoading(model);
        }
    };

    const fetchJobById = async (jobId) => {
        fb.value.clearError(model + '.edit.' + jobId);
        fb.value.removeSuccess(model + '.edit.' + jobId);
        fb.value.startLoading(model + '.edit.' + jobId);
        try {
            const job = await JobService.getJobById(jobId);
            fb.value.showSuccess(model + '.edit.' + jobId);
            return new Job(job);
        } catch (err) {
            fb.value.setError(err, model + '.edit.' + jobId);
        } finally {
            fb.value.finishLoading(model + '.edit.' + jobId);
        }
    };

    const createJob = async (newJob) => {
        fb.value.clearError(model + '.create');
        fb.value.removeSuccess(model + '.create');
        fb.value.startLoading(model + '.create');
        try {
            const createdJob = await JobService.createJob(newJob);
            const jobObj = new Job(createdJob);
            job.value = jobObj;
            fb.value.showSuccess(model + '.create');
            return createdJob;
        } catch (err) {
            let error = err.response?.data?.errors;
            if (!error) error = err;
            fb.value.setError(error, model + '.create');
        } finally {
            fb.value.finishLoading(model + '.create');
        }
    };

    const updateJob = async (updatedJob) => {
        fb.value.clearError(model + '.update.' + updatedJob.job_id);
        fb.value.removeSuccess(model + '.update.' + updatedJob.job_id);
        fb.value.startLoading(model + '.update.' + updatedJob.job_id);
        try {
            const response = await JobService.updateJob(updatedJob);
            const jobObj = new Job(response);
            job.value = jobObj;
            fb.value.showSuccess(model + '.update.' + updatedJob.job_id);
            return response;
        } catch (err) {
            let error = err.response?.data?.errors;
            if (!error) error = err;
            fb.value.setError(error, model + '.update.' + updatedJob.job_id);
        } finally {
            fb.value.finishLoading(model + '.update.' + updatedJob.job_id);
        }
    };

    const deleteJob = async (jobId) => {
        fb.value.clearError(model + '.delete.' + jobId);
        fb.value.removeSuccess(model + '.delete.' + jobId);
        fb.value.startLoading(model + '.delete.' + jobId);
        try {
            await JobService.deleteJob(jobId);
            jobs.value = jobs.value.filter(l => l.job_id !== jobId);
            fb.value.showSuccess(model + '.delete.' + jobId);
        } catch (err) {
            fb.value.setError(err, model);
        } finally {
            fb.value.finishLoading(model + '.delete.' + jobId);
        }
    };

    const importJobs = async (newImport) => {
        fb.value.clearError(model + '.import');
        fb.value.removeSuccess(model + '.import');
        fb.value.startLoading(model + '.import');
        try {
            if (!newImport) {
                throw new Error('No file data provided');
            }
            const response = await JobService.importJobs(newImport);
            // importExport.value = new DocumentImportResponse(response);
            fb.value.showSuccess(model + '.import');
            // return importExport.value;
            return response;
        } catch (err) {
            console.error('Import error:', err);
            fb.value.setError(err, model + '.import');
            throw err;
        } finally {
            fb.value.finishLoading(model + '.import');
        }
    };

    return {
        jobs,
        job,
        importExport,
        fb,
        model,
        fetchJobs,
        fetchJobById,
        createJob,
        updateJob,
        deleteJob,
        importJobs,
        resetJob,
    };
}); 