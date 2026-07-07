<script setup>
import { ref, onMounted, onUnmounted, watch, computed } from 'vue';
import { useJobStore } from '@/stores/job';
import { storeToRefs } from 'pinia';
import { useRoute } from 'vue-router';

const jobStore = useJobStore();
const { fb, jobs } = storeToRefs(jobStore);
const route = useRoute();
const jobId = computed(() => route.params.job_id);
const emit = defineEmits(['editTabUnmunted', 'editTabMounted']);

// Current job data (will be set when fetched)
const currentJob = ref(null);
const loading = ref(false);

// Job items data (will be populated from orders and quotes)
const jobItems = ref([]);

const filters = ref({
  global: { value: null, matchMode: 'contains' },
  stream: { value: null, matchMode: 'equals' },
  description: { value: null, matchMode: 'contains' },
  type: { value: null, matchMode: 'equals' },
  ref: { value: null, matchMode: 'equals' },
  date: { value: null, matchMode: 'equals' },
  status: { value: null, matchMode: 'equals' },
  value: { value: null, matchMode: 'equals' },
});

const selectedJobItems = ref([]);

const filterToggles = [
  'LEAD',
  'QUOTE',
  'ORDER',
  'PURCHASE ORDER',
  'DIRECT PURCHASE ORDER',
  'TRANSFER',
];

const clearFilter = () => {
  filters.value.global.value = null;
};

// Parse and combine orders and quotes into job items
const processJobItems = (jobData) => {
  const items = [];
  let streamCounter = 1;

  // Process orders
  if (jobData.orders && Array.isArray(jobData.orders)) {
    jobData.orders.forEach((order, index) => {
      const item = {
        stream: streamCounter++,
        description: order.order_description || `Order #${order.order_id}`,
        type: 'Order',
        ref: order.reference_number || `ORD-${order.order_id}`,
        date: order.created_at ? new Date(order.created_at).toLocaleDateString('en-GB', {
          weekday: 'short',
          day: '2-digit',
          month: '2-digit',
          year: '2-digit'
        }) : 'N/A',
        status: 'Active',
        value: order.total ? `$${order.total.toLocaleString()}` : '$0.00',
        originalData: order
      };
      items.push(item);
    });
  }

  // Process quotes
  if (jobData.quotes && Array.isArray(jobData.quotes)) {
    jobData.quotes.forEach((quote, index) => {
      const item = {
        stream: streamCounter++,
        description: quote.quote_description || `Quote #${quote.quote_id}`,
        type: 'Quote',
        ref: quote.reference_number || `QT-${quote.quote_id}`,
        date: quote.created_at ? new Date(quote.created_at).toLocaleDateString('en-GB', {
          weekday: 'short',
          day: '2-digit',
          month: '2-digit',
          year: '2-digit'
        }) : 'N/A',
        status: 'Active',
        value: quote.total ? `$${quote.total.toLocaleString()}` : '$0.00',
        originalData: quote
      };
      items.push(item);
    });
  }

  console.log('Final job items array:', items);
  return items;
};

// Fetch job by ID
const fetchJob = async (jobId) => {
  loading.value = true;
  try {
    const job = await jobStore.fetchJobById(jobId);
    
    if (job) {
      currentJob.value = job;
      // Process orders and quotes into job items
      const processedItems = processJobItems(job);
      jobItems.value = processedItems;
    } else {
      console.error('No job data returned from API');
    }
  } catch (error) {
    console.error('Error fetching job:', error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchJob(jobId.value);
});

onUnmounted(() => {
  emit('editTabUnmunted');
});
</script>

<template>
  <div class="flex flex-col md:flex-row gap-6 p-6">
    <!-- Left: Job Details Card -->
    <div class="w-full md:w-1/3 bg-white rounded-lg shadow p-6">
      <h2 class="text-xl font-semibold mb-4">Job Details</h2>
      <div v-if="loading" class="flex items-center justify-center py-8">
        <i class="pi pi-spinner pi-spin text-2xl text-gray-400"></i>
        <span class="ml-2 text-gray-600">Loading job details...</span>
      </div>
      <div v-else-if="currentJob" class="grid grid-cols-12 gap-x-6 gap-y-4">
        <label class="col-span-12 md:col-span-4 flex items-center text-lg">Reference</label>
        <div class="col-span-12 md:col-span-8 py-2">
          <InputText disabled v-model="currentJob.reference" class="w-full text-base border border-gray-200 rounded-md p-2" readonly />
        </div>
        <label class="col-span-12 md:col-span-4 flex items-center text-lg">Company</label>
        <div class="col-span-12 md:col-span-8 py-2">
          <InputText disabled v-model="currentJob.company" class="w-full text-base border border-gray-200 rounded-md p-2" readonly />
        </div>
        <label class="col-span-12 md:col-span-4 flex items-center text-lg">Job Title</label>
        <div class="col-span-12 md:col-span-8 py-2">
          <InputText disabled v-model="currentJob.job_title" class="w-full text-base border border-gray-200 rounded-md p-2" readonly />
        </div>
        <label class="col-span-12 md:col-span-4 flex items-center text-lg">Account Manager</label>
        <div class="col-span-12 md:col-span-8 py-2">
          <InputText disabled v-model="currentJob.account_manager_name" class="w-full text-base border border-gray-200 rounded-md p-2" readonly />
        </div>
        <label class="col-span-12 md:col-span-4 flex items-center text-lg">Status</label>
        <div class="col-span-12 md:col-span-8 py-2">
          <InputText disabled v-model="currentJob.status" class="w-full text-base border border-gray-200 rounded-md p-2" readonly />
        </div>
        <label class="col-span-12 md:col-span-4 flex items-center text-lg">Value</label>
        <div class="col-span-12 md:col-span-8 py-2">
          <InputText disabled :value="currentJob.value ? `$${parseFloat(currentJob.value).toLocaleString()}` : ''" class="w-full text-base border border-gray-200 rounded-md p-2" readonly />
        </div>
        <label class="col-span-12 md:col-span-4 flex items-center text-lg">Created At</label>
        <div class="col-span-12 md:col-span-8 py-2">
          <InputText disabled :value="currentJob.created_at ? new Date(currentJob.created_at).toLocaleDateString() : ''" class="w-full text-base border border-gray-200 rounded-md p-2" readonly />
        </div>
      </div>
      <div v-else class="text-center py-8 text-gray-500">
        No job data available
      </div>
    </div>

    <!-- Right: Job Items DataTable -->
    <div class="w-full md:w-2/3 bg-white rounded-lg shadow p-6">
      <DataTable
        v-model:filters="filters"
        v-model:selection="selectedJobItems"
        :value="jobItems"
        paginator
        :rows="10"
        dataKey="ref"
        filterDisplay="menu"
        :globalFilterFields="['stream', 'description', 'type', 'ref', 'date', 'status', 'value']"
        selectionMode="multiple"
        class="th-table"
      >
        <template #header>
          <div class="flex items-center justify-between w-full">
            <span class="font-semibold text-base ml-1">All Job Items</span>
            <div class="flex items-center gap-2 flex-1 ml-6">
              <div class="flex flex-wrap gap-2 sm:gap-1">
                <template v-for="toggle in filterToggles" :key="toggle">
                  <span
                    class="flex items-center px-2.5 py-0.5 bg-gray-100 rounded text-xs font-medium text-gray-600 mb-1 mr-1 sm:mb-0"
                    style="min-width: 0"
                  >
                    <i class="pi pi-check mr-1 text-xs" /> {{ toggle }}
                  </span>
                </template>
              </div>
            </div>
            <div class="flex items-center gap-2 ml-2">
              <button class="w-7 h-7 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition"><i class="pi pi-refresh text-gray-500 text-base" /></button>
              <button class="w-7 h-7 flex items-center justify-center rounded-full bg-black text-white hover:bg-gray-800 transition"><i class="pi pi-plus text-base" /></button>
            </div>
          </div>
        </template>
        <template #empty> 
          <div class="text-center py-8">
            <p class="text-gray-500">No job items found</p>
            <p class="text-sm text-gray-400 mt-2">Debug: jobItems length = {{ jobItems.length }}</p>
          </div>
        </template>
        <template #loading> Loading job items data. Please wait. </template>

        <Column selectionMode="multiple" headerStyle="width: 3rem" />
        <Column field="stream" header="Stream" style="min-width: 6rem" />
        <Column field="description" header="Description" style="min-width: 12rem" />
        <Column field="type" header="Type" style="min-width: 8rem" />
        <Column field="ref" header="Ref" style="min-width: 10rem" />
        <Column field="date" header="Date" style="min-width: 10rem" />
        <Column field="status" header="Status" style="min-width: 10rem" />
        <Column field="value" header="Value ($)" style="min-width: 10rem" />
      </DataTable>
    </div>
  </div>
</template>

<style scoped>
.th-table .p-datatable-thead > tr > th {
  background-color: var(--surface-100);
}
.th-table .p-datatable-tbody > tr > td {
  padding: 1rem;
}
</style>
