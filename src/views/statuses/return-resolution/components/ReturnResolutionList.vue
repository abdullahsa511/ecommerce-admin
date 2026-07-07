<script setup>
import { ref, onMounted, computed } from 'vue';
import { useReturnResolutionStore } from '@/stores/returnResolution';
import { storeToRefs } from 'pinia';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import MultiSelect from 'primevue/multiselect';
import { useRouter } from 'vue-router';

const router = useRouter();

const returnResolutionStore = useReturnResolutionStore();
const { returnResolutions, fb } = storeToRefs(returnResolutionStore);

const filters = ref({
  global: { value: null, matchMode: 'contains' },
  name: { value: null, matchMode: 'contains' }
});

const returnResolutionNames = computed(() => {
  return returnResolutions.value.map(resolution => resolution.name);
});

onMounted(() => {
  returnResolutionStore.fetchReturnResolutions();
});

const clearFilter = () => {
  filters.value = {
    global: { value: null, matchMode: 'contains' },
    name: { value: null, matchMode: 'contains' }
  };
};

const editReturnResolution = (returnResolution) => {
  router.push(`/configuration/settings/return-resolutions/edit/${returnResolution.return_resolution_id}`);
};

const deleteReturnResolution = (returnResolution) => {
  returnResolutionStore.deleteReturnResolution(returnResolution.return_resolution_id);
};

const addReturnResolution = () => {
  router.push('/configuration/settings/add-return-resolutions');
};
</script>

<template>
  <div class="return-resolution-list">
      <DataTable
        v-model:filters="filters"
        :value="returnResolutions"
        paginator
        :rows="10"
        dataKey="return_resolution_id"
        filterDisplay="menu"
        :loading="fb.loading['returnResolution.list']"
        :globalFilterFields="['name']"
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
            </div>
            <InputText v-model="filters['global'].value" placeholder="Keyword Search" />
          </div>
        </template>
        <template #empty> No return resolutions found. </template>
        <template #loading> Loading return resolutions data. Please wait. </template>

        
        <Column header="Name" filterField="name" :showFilterMatchModes="false" :filterMenuStyle="{ width: '14rem' }" style="min-width: 36rem">
          <template #body="{ data }">
            <a 
              @click="editReturnResolution(data)" 
              class="text-blue-600 hover:text-blue-800 cursor-pointer hover:underline"
            >
              {{ data.name }}
            </a>
          </template>
          <template #filter="{ filterModel }">
            <MultiSelect v-model="filterModel.value" :options="returnResolutionNames" placeholder="Any">
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
                icon="pi pi-pencil" 
                :icon="fb.loading['returnResolution.edit.' + data.return_resolution_id] ? 'pi pi-spinner pi-spin' : 'pi pi-pencil'"
                :loading="fb.loading['returnResolution.edit.' + data.return_resolution_id]"
                :disabled="fb.loading['returnResolution.edit.' + data.return_resolution_id]"
                rounded 
                outlined 
                severity="success" 
                class="mr-2"
                @click="editReturnResolution(data)"
              />
              <Button 
                icon="pi pi-trash" 
                :icon="fb.loading['returnResolution.delete.' + data.return_resolution_id] ? 'pi pi-spinner pi-spin' : 'pi pi-trash'"
                :loading="fb.loading['returnResolution.delete.' + data.return_resolution_id]"
                :disabled="fb.loading['returnResolution.delete.' + data.return_resolution_id]"
                rounded 
                outlined 
                severity="danger"
                @click="deleteReturnResolution(data)"
              />
            </div>
          </template>
        </Column>
      </DataTable>
  </div>
</template> 