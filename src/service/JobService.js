import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL + '/jobs';

class JobService {
    // Get all jobs
    static getJobs() {
        return new Promise((resolve, reject) => {
            axios.get(`${API_URL}`)
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    console.error('Error fetching jobs:', error);
                    reject(error);
                });
        });
    }

    // Get a single job by ID
    static getJobById(jobId) {
        return new Promise((resolve, reject) => {
            axios.get(`${API_URL}/${jobId}`)
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    console.error('Error fetching job:', error);
                    reject(error);
                });
        });
    }

    // 
    static createJob(newJob) {
        return new Promise((resolve, reject) => {
            axios.post(`${API_URL}`, newJob, {
                headers: { 'Content-Type': 'application/json' }
            })
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    console.error('Error creating job:', error);
                    reject(error);
                });
        });
    }

    static updateJob(updatedJob) {
        return new Promise((resolve, reject) => {
            axios.put(`${API_URL}/${updatedJob.job_id}`, updatedJob, {
                headers: { 'Content-Type': 'application/json' }
            })
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    return reject(error);
                });
        });
    }

    static deleteJob(jobId) {
        return new Promise((resolve, reject) => {
            axios.delete(`${API_URL}/delete/${jobId}`)
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    return reject(error);
                });
        });
    }

    static async importJobs(fromData) {
        try {
            const response = await axios.post(`${API_URL}/import-jobs`, fromData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            return response.data;
        } catch (error) {
            console.error('Error importing jobs:', error);
            throw error;
        }
    }
}

export default JobService; 