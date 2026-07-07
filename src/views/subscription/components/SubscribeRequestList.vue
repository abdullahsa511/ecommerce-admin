<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import { useToast } from 'primevue/usetoast';
import { useSubscriptionStore } from '@/stores/subscription';
import SubscriptionFilter from '@/filters/SubscriptionFilter';

import {
  exportTableData,
  type ExportColumn
} from '@/utils/exportUtils'; 


const subscriptionStore = useSubscriptionStore();
const { subscribeRequests, fb } = storeToRefs(subscriptionStore);
const filters = ref({...new SubscriptionFilter()});
const toast = useToast();

const deleteSubscription = async (data: any) => {
  try {
    await subscriptionStore.deleteSubscribeRequest(data.subscription_id);
    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Subscribe request deleted successfully',
      life: 3000
    });
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to delete subscribe request.',
      life: 3000
    });
  }
};

const clearFilter = () => {
  filters.value = {...new SubscriptionFilter()};
};

const formatDate = (data: any) => {
  const date = new Date(data);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

const renderIcon = (icon: string, action: string, id: number) => {
  return fb.value.loading[`subscription.${action}.${id}`] ? 'pi pi-spinner pi-spin' : icon;
};

const exportMenuItems = [
  { label: 'Export as CSV', icon: 'pi pi-file', command: () => exportData('csv') },
  { label: 'Export as Excel (.xlsx)', icon: 'pi pi-file-excel', command: () => exportData('xlsx') },
  { label: 'Export as PDF', icon: 'pi pi-file-pdf', command: () => exportData('pdf') }
];

const subscribeRequestColumns: ExportColumn<any>[] = [
  { accessor: (row) => row.email || '', header: 'Email', width: 130 },
  { accessor: (row) => formatDate(row.created_at || ''), header: 'Date Added', width: 80 },
];

function exportData(format: 'csv' | 'xlsx' | 'pdf') {
  const dataToExport = subscribeRequests.value || [];

  if (!dataToExport.length) {
    toast.add({
      severity: 'warn',
      summary: 'Export Failed',
      detail: 'There are no subscribe Request data available to export.',
      life: 4000
    });
    return;
  }

  const today = new Date().toISOString().slice(0, 10);

  try {
    exportTableData(format, {
      columns: subscribeRequestColumns,
      data: dataToExport,
      fileName: `Subscriptions_report_${today}`,
      title: 'Subscriptions Report',
    //   subtitle: `Generated ${today}`,
      paperSize: 'A3',
      orientation: 'portrait'
    });

    if (format === 'pdf') {
      toast.add({ severity: 'success', summary: 'Print dialog opened', detail: 'Choose "Save as PDF" in the print dialog to download.', life: 4000 });
    } else {
      toast.add({ severity: 'success', summary: 'Success', detail: `${format.toUpperCase()} file downloaded successfully.`, life: 3000 });
    }
  } catch (error) {
    console.error(`${format.toUpperCase()} Export Error:`, error);
    toast.add({ severity: 'error', summary: 'Error', detail: `Failed to export ${format.toUpperCase()} file.`, life: 4000 });
  }
}

onMounted(() => {
  subscriptionStore.getSubscribeRequests();
});
</script>

<template>
  <div class="subscribe-request-index">
    <DataTable
      v-model:filters="filters"
      :value="subscribeRequests"
      paginator
      :rows="10"
      dataKey="subscription_id"
      filterDisplay="menu"
      :globalFilterFields="['subscription_id', 'email', 'action']"
      selectionMode="multiple"
      class="th-table"
    >
        <template #header>
            <div class="flex justify-between items-center">
                <div class="flex gap-2">
                    <Button
                        type="button"
                        icon="pi pi-filter-slash"
                        label="Clear"
                        outlined
                        @click="clearFilter()"
                    />
                    <SplitButton 
                        label="Export" 
                        icon="pi pi-download" 
                        :model="exportMenuItems" 
                        severity="secondary" 
                        size="small"
                        class="mr-2"
                        @click="exportData('csv')" 
                    />
                </div>
                <InputText v-model="filters['global'].value" placeholder="Keyword Search" />
            </div>
        </template>

     
      <template #empty> No subscribe requests to display! </template>
      <template #loading>
        <div class="flex items-center justify-center gap-2 py-8">
          <i class="pi pi-spinner pi-spin" style="font-size: 2rem"></i>
        </div>
      </template>

      <Column field="subscription_id" header="Subscription ID" style="min-width: 10rem" sortable>
        <template #body="{ data }">
            #{{ data.subscription_id }}
        </template>
      </Column>

      <Column field="email" header="Email" style="min-width: 12rem" sortable>
        <template #body="{ data }">
          {{ data.email }}
        </template>
      </Column>

      <Column field="created_at" header="Date Added" style="min-width: 12rem">
        <template #body="{ data }">
          {{ formatDate(data.created_at) }}
        </template>
      </Column>

      <Column header="Actions" :exportable="false" style="min-width: 8rem">
        <template #body="{ data }">
          <div class="flex gap-2">
            <Button
              rounded
              outlined
              severity="danger"
              :icon="renderIcon('pi pi-trash', 'delete', data.subscription_id)"
              @click="deleteSubscription(data)"
            />
          </div>
        </template>
      </Column>
    </DataTable>
  </div>
</template>