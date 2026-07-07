<script setup>
import { ref, onMounted } from 'vue';
import { useJobStore } from '@/stores/job';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';

const jobStore = useJobStore();
const { jobs, fb } = storeToRefs(jobStore);
const router = useRouter();

const filters = ref({
  global: { value: null, matchMode: 'contains' },
  type: { value: null, matchMode: 'equals' },
  created_at: { value: null, matchMode: 'equals' },
  reference: { value: null, matchMode: 'equals' },
  job_title: { value: null, matchMode: 'contains' },
  description: { value: null, matchMode: 'contains' },
  account_manager_name: { value: null, matchMode: 'contains' },
});

const selectedJobs = ref([]);

const clearFilter = () => {
  filters.value.global.value = null;
};

const editJob = (job) => {
  router.push(`/jobs/edit/${job.job_id}`);
}

const deleteJob = async (job) => {
  try {
    await jobStore.deleteJob(job.job_id);
    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Job deleted successfully',
      life: 3000
    });
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to delete job',
      life: 3000
    });
  }
}

onMounted(() => {
  jobStore.fetchJobs();
});

function goToJobDetails(job) {
  if (job && job.job_id) {
    router.push({ path: `/jobs/details/${job.job_id}` });
  }
}
</script>

<template>
  <DataTable v-model:filters="filters" v-model:selection="selectedJobs" :value="jobs" paginator :rows="50"
    dataKey="job_id" filterDisplay="menu"
    :globalFilterFields="['type', 'created_at', 'reference', 'job_title', 'description', 'account_manager_name']"
    selectionMode="single" class="th-table">
    <template #header>
      <div class="flex justify-between items-center">
        <div class="flex gap-2">
          <Button type="button" icon="pi pi-filter-slash" label="Clear" outlined @click="clearFilter()" />
          <Button v-if="selectedJobs.length > 0" type="button" icon="pi pi-trash" label="Delete Selected"
            severity="danger" @click="() => { }" />
        </div>
        <InputText v-model="filters['global'].value" placeholder="Keyword Search" />
      </div>
    </template>
    <template #empty> No jobs found. </template>
    <template #loading> Loading jobs data. Please wait. </template>
    <Column field="type" header="Type" style="min-width: 10rem" sortable>
      <template #body="{ data }">
        <span class="cursor-pointer text-primary hover:underline flex items-center" @click.stop="goToJobDetails(data)">
          <i class="pi pi-folder mr-2 text-gray-400" /> {{ data.type || 'Job' }}
        </span>
      </template>
    </Column>
    <Column field="reference" header="Ref" style="min-width: 8rem" sortable />
    <Column field="job_title" header="Job Title" style="min-width: 16rem" sortable />
    <Column field="description" header="Description" style="min-width: 12rem" sortable />
    <Column field="account_manager_name" header="Acc Manager" style="min-width: 12rem" sortable />
    <Column field="created_at" header="Created" style="min-width: 10rem">
      <template #body="{ data }">
        {{ data.created_at ? new Date(data.created_at).toLocaleDateString('en-GB', {
          weekday: 'short', day:
            '2-digit', month: '2-digit', year: '2-digit'
        }) : '' }}
      </template>
    </Column>
    <Column field="actions" header="Actions" style="min-width: 12rem">
      <template #body="{ data }">
        <div class="flex gap-2">
          <Button :icon="fb.loading['job.edit.' + data.job_id] ? 'pi pi-spinner pi-spin' : 'pi pi-pencil'" rounded
            outlined severity="success" @click="editJob(data)" />
          <Button :icon="fb.loading['job.delete.' + data.job_id] ? 'pi pi-spinner pi-spin' : 'pi pi-trash'" rounded
            outlined severity="danger" @click="deleteJob(data)" />
        </div>
      </template>
    </Column>
  </DataTable>
</template>

<style scoped></style>
