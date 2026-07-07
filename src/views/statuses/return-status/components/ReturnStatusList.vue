<script setup>
import { ref, onMounted, computed } from 'vue';
import { useReturnStatusStore } from '@/stores/returnStatus';
import { storeToRefs } from 'pinia';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import MultiSelect from 'primevue/multiselect';
import { useRouter } from 'vue-router';

const router = useRouter();

const returnStatusStore = useReturnStatusStore();
const { returnStatuses, fb } = storeToRefs(returnStatusStore);

const filters = ref({
  global: { value: null, matchMode: 'contains' },
  name: { value: null, matchMode: 'contains' }
});

const returnStatusNames = computed(() => {
  return returnStatuses.value.map(status => status.name);
});

onMounted(() => {
  returnStatusStore.fetchReturnStatuses();
});

const clearFilter = () => {
  filters.value = {
    global: { value: null, matchMode: 'contains' },
    name: { value: null, matchMode: 'contains' }
  };
};

const editReturnStatus = (returnStatus) => {
  router.push(`/configuration/settings/return-statuses/edit/${returnStatus.return_status_id}`);
};

const deleteReturnStatus = async (returnStatus) => {
  try {
    await returnStatusStore.deleteReturnStatus(returnStatus.return_status_id);
    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: fb.value.messages['returnStatus.delete'] || 'Return status deleted successfully.',
      life: 3000
    });
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: fb.value.errors['returnStatus.delete'] || 'Failed to delete return status.',
      life: 3000
    });
  }
};

const addReturnStatus = () => {
  router.push('/configuration/settings/add-return-statuses');
};
</script>

<template>
  <div>
      <DataTable v-model:filters="filters" :value="returnStatuses" paginator
        :rows="10" dataKey="return_status_id" filterDisplay="menu" :loading="fb.loading['returnStatus.list']"
        :globalFilterFields="['name']"
        class="th-table">
        <template #header>
          <div class="flex justify-between items-center">
            <div class="flex gap-2">
              <Button type="button" icon="pi pi-filter-slash" label="Clear" outlined @click="clearFilter()" />
            </div>
            <InputText v-model="filters['global'].value" placeholder="Keyword Search" />
          </div>
        </template>
        <template #empty> No return statuses found. </template>
        <template #loading> Loading return statuses data. Please wait. </template>


        <Column header="Name" filterField="name" :showFilterMatchModes="false" :filterMenuStyle="{ width: '14rem' }"
          style="min-width: 36rem">
          <template #body="{ data }">
            <a @click="editReturnStatus(data)" class="text-blue-600 hover:text-blue-800 cursor-pointer hover:underline">
              {{ data.name }}
            </a>
          </template>
          <template #filter="{ filterModel }">
            <MultiSelect v-model="filterModel.value" :options="returnStatusNames" placeholder="Any">
              <template #option="slotProps">
                <div class="flex items-center gap-2">
                  <span>{{ slotProps.option }}</span>
                </div>
              </template>
            </MultiSelect>
          </template>
        </Column>

        <Column header="Actions" :exportable="false" style="min-width: 8rem">
          <template #body="{ data }">
            <div class="flex gap-2">
              <Button 
              :icon="fb.loading['returnStatus.edit.' + data.return_status_id] ? 'pi pi-spinner pi-spin' : 'pi pi-pencil'"
              :disabled="fb.loading['returnStatus.edit.' + data.return_status_id]"
              rounded outlined severity="success" 
              class="mr-2"
                @click="editReturnStatus(data)" />
              <Button 
              :icon="fb.loading['returnStatus.delete.' + data.return_status_id] ? 'pi pi-spinner pi-spin' : 'pi pi-trash'"
              :disabled="fb.loading['returnStatus.delete.' + data.return_status_id]"
               rounded outlined severity="danger" @click="deleteReturnStatus(data)" />
            </div>
          </template>
        </Column>
      </DataTable>
  </div>
</template>


<style scoped>
</style>