<script setup lang="ts">
import { ref, defineEmits, onMounted, onUnmounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useJobStore } from '@/stores/job';
import { useRoute } from 'vue-router';

const jobStore = useJobStore();
const { job, fb } = storeToRefs(jobStore);
const route = useRoute();
const emit = defineEmits(['update:job', 'saved', 'editTabUnmunted', 'editTabMounted']);

const statusValues = ref([
    { name: 'Active', code: 'active' },
    { name: 'Inactive', code: 'inactive' }
]);
const typeValues = ref([
    { name: 'Permanent', code: 'permanent' },
    { name: 'Temporary', code: 'temporary' },
    { name: 'Contract', code: 'contract' },
    { name: 'Internship', code: 'internship' },
    { name: 'Freelance', code: 'freelance' },
    { name: 'Part-time', code: 'part-time' },
    { name: 'Full-time', code: 'full-time' },
    { name: 'Remote', code: 'remote' },
    { name: 'On-site', code: 'on-site' },
    { name: 'Hybrid', code: 'hybrid' },
    { name: 'Apprentice', code: 'apprentice' },
    { name: 'Volunteer', code: 'volunteer' },
    { name: 'Other', code: 'other' },
]);
const companyValues = ref([
    { name: 'SA Technology', code: 'SA Technology' },
    { name: 'SA Solutions', code: 'SA Solutions' },
    { name: 'SA Consulting', code: 'SA Consulting' },
    { name: 'SA IT', code: 'SA IT' },
    { name: 'SA Technology', code: 'SA Technology' },
    { name: 'SA Solutions', code: 'SA Solutions' },
    { name: 'SA Consulting', code: 'SA Consulting' },
    { name: 'SA IT', code: 'SA IT' },
    { name: 'Kros Systems', code: 'Kros Systems' },
    { name: 'Kros Solutions', code: 'Kros Solutions' },
    { name: 'Kros Consulting', code: 'Kros Consulting' },
    { name: 'Kros IT', code: 'Kros IT' },
    { name: 'Kros Technology', code: 'Kros Technology' },
    { name: 'Kros Software', code: 'Kros Software' },
    { name: 'Kros Services', code: 'Kros Services' },
    { name: 'Kros Solutions', code: 'Kros Solutions' },
    { name: 'Kros Consulting', code: 'Kros Consulting' },
    { name: 'Kros IT', code: 'Kros IT' },
    { name: 'Kros Technology', code: 'Kros Technology' },
]);

const selectedStatus = ref(statusValues.value[0]);
// const selectedType = ref(typeValues.value[0]);
// const selectedCompany = ref(companyValues.value[0]);

onMounted(async () => {
    job.value = await jobStore.fetchJobById(route.params.id as string);
    emit('editTabMounted');
});

onUnmounted(() => {
    emit('editTabUnmunted');
});
</script>

<template>
    <div class="flex flex-col gap-6">
        <div class="flex flex-col md:flex-row gap-6">
            <!-- Left column: Post Tag Form -->
            <div class="sm:w-full md:w-3/5 space-y-4">
                <h3 class="text-lg font-medium border-b border-gray-200 pb-2">Edit Job</h3>
                <div class="grid grid-cols-12 gap-x-6 gap-y-4">
                    <!-- job title -->
                    <label class="col-span-12 md:col-span-3 xl:col-span-2 flex items-center text-lg">Job Title</label>
                    <div class="col-span-12 md:col-span-9 xl:col-span-10 py-2">
                        <InputText v-model="job.job_title"
                            class="w-full text-lg border border-gray-200 rounded-md p-2" placeholder="Enter job title"
                            :class="{ 'p-invalid': fb.errors?.['job.update.'+job.job_id]?.job_title }" />
                        <Message v-if="fb.errors?.['job.update.'+job.job_id]?.job_title" severity="error" size="small"
                            variant="title">
                            <span v-for="error in fb.errors?.['job.update.'+job.job_id]?.job_title" :key="error"
                                class="flex flex-col">
                                {{ error }}
                            </span>
                        </Message>
                    </div>

                    <!-- reference -->
                    <label class="col-span-12 md:col-span-3 xl:col-span-2 flex items-center text-lg">Reference</label>
                    <div class="col-span-12 md:col-span-9 xl:col-span-10 py-2">
                        <InputText v-model="job.reference"
                            class="w-full text-lg border border-gray-200 rounded-md p-2" placeholder="Enter reference"
                            :class="{ 'p-invalid': fb.errors?.['job.update.'+job.job_id]?.reference }" />
                        <Message v-if="fb.errors?.['job.update.'+job.job_id]?.reference" severity="error" size="small"
                            variant="title">
                            <span v-for="error in fb.errors?.['job.update.'+job.job_id]?.reference" :key="error"
                                class="flex flex-col">
                                {{ error }}
                            </span>
                        </Message>
                    </div>

                    <!-- company -->
                    <label class="col-span-12 md:col-span-3 xl:col-span-2 flex items-center text-lg">Company</label>
                    <div class="col-span-12 md:col-span-9 xl:col-span-10 py-2">
                        <Select v-model="job.company" :options="companyValues" optionLabel="name" optionValue="code"
                            class="w-full text-lg border border-gray-200 rounded-md p-2" placeholder="Select company"
                            :class="{ 'p-invalid': fb.errors?.['job.update.'+job.job_id]?.company }" />
                        <Message v-if="fb.errors?.['job.update.'+job.job_id]?.company" severity="error" size="small"
                            variant="title">
                            <span v-for="error in fb.errors?.['job.update.'+job.job_id]?.company" :key="error"
                                class="flex flex-col">
                                {{ error }}
                            </span>
                        </Message>
                    </div>
                    <!-- type -->
                    <label class="col-span-12 md:col-span-3 xl:col-span-2 flex items-center text-lg">Type</label>
                    <div class="col-span-12 md:col-span-9 xl:col-span-10 py-2">
                        <Select v-model="job.type" :options="typeValues" optionLabel="name" optionValue="code"
                            class="w-full text-lg border border-gray-200 rounded-md p-2" placeholder="Select type"
                              :class="{ 'p-invalid': fb.errors?.['job.update.'+job.job_id]?.type }" />
                        <Message v-if="fb.errors?.['job.update.'+job.job_id]?.type" severity="error" size="small"
                            variant="title">
                            <span v-for="error in fb.errors?.['job.update.'+job.job_id]?.type" :key="error"
                                class="flex flex-col">
                                {{ error }}
                            </span>
                        </Message>
                    </div>
                </div>
            </div>
            <!-- right column -->
            <div class="sm:w-full md:w-3/5 space-y-4">
                <h3 class="text-lg font-medium border-b border-gray-200 pb-2">Other Details</h3>
                <div class="grid grid-cols-12 gap-x-6 gap-y-4">

                    <!-- account manager -->
                    <label class="col-span-12 md:col-span-3 xl:col-span-2 flex items-center text-lg">Account
                        Manager</label>
                    <div class="col-span-12 md:col-span-9 xl:col-span-10 py-2">
                        <InputText 
                            v-model="job.account_manager_name"
                            class="w-full text-lg border border-gray-200 rounded-md p-2"
                            placeholder="Enter account manager"/>
                    </div>
                    <!-- value -->
                    <label class="col-span-12 md:col-span-3 xl:col-span-2 flex items-center text-lg">Value</label>
                    <div class="col-span-12 md:col-span-9 xl:col-span-10 py-2">
                        <InputText v-model="job.value" class="w-full text-lg border border-gray-200 rounded-md p-2"
                            placeholder="Enter value" />
                    </div>

                    <!-- status -->
                    <label class="col-span-12 md:col-span-3 xl:col-span-2 flex items-center text-lg">Status</label>
                    <div class="col-span-12 md:col-span-9 xl:col-span-10 py-2">
                        <Select v-model="selectedStatus" :options="statusValues" optionLabel="name" optionValue="code"
                            class="w-full text-lg border border-gray-200 rounded-md p-2" placeholder="Select status" />
                    </div>
                    <!-- description -->
                    <label class="col-span-12 md:col-span-3 xl:col-span-2 flex items-center text-lg">Description</label>
                    <div class="col-span-12 md:col-span-9 xl:col-span-10 py-2">
                        <Textarea v-model="job.description"
                            class="w-full text-lg border border-gray-200 rounded-md p-2" placeholder="Enter description"
                            />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped></style>
