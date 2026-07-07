<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import { useToast } from 'primevue/usetoast';
import { useContactRequestStore } from '@/stores/contactRequest';
import { formatDate } from '@/utils/date';

const router = useRouter();
const contactRequestStore = useContactRequestStore();
const { contactRequests, fb } = storeToRefs(contactRequestStore);
const filters = ref({ global: { value: null, matchMode: 'contains' }, form_type: { value: null, matchMode: 'contains' } });
const isLoading = computed(() => fb?.value?.loading === true);
const toast = useToast();



const editContactRequest = (data: any) => {
  router.push(`/meeting-requests/edit/${data.visit_showroom_id}`);
};

const deleteContactRequest = async (data: any) => {
  try {
    await contactRequestStore.deleteContactRequest(data.visit_showroom_id);
    toast.add({ severity: 'success', summary: 'Success', detail: 'Contact request deleted successfully', life: 3000 });
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete contact request.', life: 3000 });
  }
};

const clearFilter = () => {
  filters.value = { global: { value: null, matchMode: 'contains' }, form_type: { value: null, matchMode: 'contains' } };
};

const renderIcon = (icon: string, action: string, id: number) => {
  return fb.value.loading[`contactRequest.${action}.${id}`] ? 'pi pi-spinner pi-spin' : icon;
}

const formatDateTime = (dateString: string) => {
  if (!dateString) return '';

  const date = new Date(`1970-01-01T${dateString}`);
  return date.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
};

onMounted(() => {
  contactRequestStore.fetchContactRequests();
});
</script>

<template>
  <DataTable
    v-model:filters="filters"
    :value="contactRequests"
    paginator
    :rows="10"
    dataKey="visit_showroom_id"
    filterDisplay="menu"
    :loading="isLoading"
    :globalFilterFields="['showroom_contact_id', 'pinboard_id', 'showroom_id', 'tour_type', 'date', 'meeting_time', 'time_zone']"
    class="th-table"
  >
    <template #header>
      <div class="flex justify-between items-center">
        <div class="flex gap-2">
          <Button type="button" icon="pi pi-filter-slash" label="Clear" outlined @click="clearFilter()" />
        </div>
        <InputText v-model="filters['global'].value" placeholder="Keyword Search" />
      </div>
    </template>
    <template #empty> No contact requests found. </template>
    <template #loading> Loading contact requests data. Please wait. </template>
    <!-- <Column field="visit_showroom_id" header="ID" style="min-width: 6rem" sortable/> -->
    <Column selectionMode="multiple" headerStyle="width: 3rem" />
    
    <!-- <Column field="customer_email" header="Customer Email" style="min-width: 12rem" filterField="customer_email" sortable>
      <template #body="{ data }">
        <a @click="editContactRequest(data)" class="text-blue-600 hover:text-blue-800 cursor-pointer hover:underline">
          {{ data.customer_email }}
        </a>
      </template>
    </Column> -->

    <!-- <Column field="showroom_contact_name" header="Contact Name" style="min-width: 12rem" filterField="showroom_contact_name" sortable>
      <template #body="{ data }">
        {{ data.showroom_contact_name }}
      </template>
    </Column> -->
    <Column field="customer_email" header="Customer" style="min-width: 12rem" filterField="customer_email" sortable>
      <template #body="{ data }">
        <a @click="editContactRequest(data)" class="text-blue-600 hover:text-blue-800 cursor-pointer hover:underline">
          {{ data.customer_email }}
        </a>
      </template>
    </Column>
    <Column field="showroom_title" header="Showroom" style="min-width: 12rem" filterField="showroom_title" sortable>
      <template #body="{ data }">
        {{ data.showroom_title ? data.showroom_title : 'Online' }}
      </template>
    </Column>
    <Column field="tour_type" header="Tour Type" style="min-width: 12rem" filterField="tour_type" sortable>
      <template #body="{ data }">
      <!-- physicalTour convert to Physical Tour -->
       {{ data.tour_type === 'physicalTour' ? 'Physical Tour' : data.tour_type === 'virtualTour' ? 'Virtual Tour' : data.tour_type }}
      </template>
    </Column>
    <Column field="source" header="Source" style="min-width: 12rem" filterField="source" sortable>
      <template #body="{ data }">
      <!-- physicalTour convert to Physical Tour -->
       {{ data.enquiry_type }}
      </template>
    </Column>
    <Column field="date" header="Date" style="min-width: 12rem" filterField="date" sortable>
      <template #body="{ data }">
        {{formatDate(data.date) }}
      </template>
    </Column>
    <Column field="meeting_time" header="Meeting Time" style="min-width: 12rem" filterField="meeting_time" sortable>
      <template #body="{ data }">
        {{formatDateTime(data.meeting_time) }}
      </template>
    </Column>
    <Column field="note" header="Note" style="min-width: 12rem" filterField="note" sortable>
      <template #body="{ data }">
        {{ data.note }}
      </template>
    </Column>
    <Column header="Actions" :exportable="false" style="min-width: 8rem">
      <template #body="{ data }">
        <div class="flex gap-2">
          <!-- <Button :icon="renderIcon('pi pi-pencil', 'edit', data.visit_showroom_id)" rounded outlined severity="success" @click="editContactRequest(data)" />
          <Button :icon="renderIcon('pi pi-trash', 'delete', data.visit_showroom_id)" rounded outlined severity="danger" @click="deleteContactRequest(data)" /> -->

          <Button 
              :icon="fb.loading['contactRequest.update.'+data.visit_showroom_id] ? 'pi pi-spinner pi-spin' : 'pi pi-pencil'"
              :loading="fb.loading['contactRequest.update.'+data.visit_showroom_id]"
              rounded outlined 
              severity="success" 
              class="mr-2"
              @click="editContactRequest(data)" 
          />
          <Button 
              :icon="fb.loading['contactRequest.delete.'+data.visit_showroom_id] ? 'pi pi-spinner pi-spin' : 'pi pi-trash'"
              :loading="fb.loading['contactRequest.delete.'+data.visit_showroom_id]"
              rounded outlined 
              severity="danger" 
              @click="deleteContactRequest(data)" 
          />
        </div>
      </template>
    </Column>
  </DataTable>
</template>

<style scoped>
.contact-request-index {
  padding: 2rem;
}
</style>

