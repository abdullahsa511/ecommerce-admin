<script setup>
import { ref, onMounted, computed } from 'vue';
import { useReturnReasonStore } from '@/stores/returnReason';
import { storeToRefs } from 'pinia';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import MultiSelect from 'primevue/multiselect';
import { useRouter } from 'vue-router';

const router = useRouter();

const returnReasonStore = useReturnReasonStore();
const { returnReasons, fb } = storeToRefs(returnReasonStore);

const filters = ref({
  global: { value: null, matchMode: 'contains' },
  name: { value: null, matchMode: 'contains' }
});

const returnReasonNames = computed(() => {
  return returnReasons.value.map(reason => reason.name);
});

onMounted(() => {
  returnReasonStore.fetchReturnReasons();
});

const clearFilter = () => {
  filters.value = {
    global: { value: null, matchMode: 'contains' },
    name: { value: null, matchMode: 'contains' }
  };
};

const editReturnReason = (returnReason) => {
  router.push(`/configuration/settings/return-reasons/edit/${returnReason.return_reason_id}`);
};

const deleteReturnReason = (returnReason) => {
  returnReasonStore.deleteReturnReason(returnReason.return_reason_id);
};

</script>

<template>
  <div class="container mx-auto">
    <div>
      <DataTable
        v-model:filters="filters"
        :value="returnReasons"
        paginator
        :rows="10"
        dataKey="return_reason_id"
        filterDisplay="menu"
        :loading="fb.loading['returnReason.list']"
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
        <template #empty> No return reasons found. </template>
        <template #loading> Loading return reasons data. Please wait. </template>

        
        <Column header="Name" filterField="name" :showFilterMatchModes="false" :filterMenuStyle="{ width: '14rem' }" style="min-width: 36rem">
          <template #body="{ data }">
            <a 
              @click="editReturnReason(data)" 
              class="text-blue-600 hover:text-blue-800 cursor-pointer hover:underline"
            >
              {{ data.name }}
            </a>
          </template>
          <template #filter="{ filterModel }">
            <MultiSelect v-model="filterModel.value" :options="returnReasonNames" placeholder="Any">
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
                :icon="fb.loading['returnReason.edit.'+data.return_reason_id] ? 'pi pi-spinner pi-spin' : 'pi pi-pencil'"
                :loading="fb.loading['returnReason.edit.'+data.return_reason_id]"
                :disabled="fb.loading['returnReason.edit.'+data.return_reason_id]"
                rounded 
                outlined 
                severity="success" 
                class="mr-2"
                @click="editReturnReason(data)"
              />
              <Button 
                icon="pi pi-trash" 
                :icon="fb.loading['returnReason.delete.'+data.return_reason_id] ? 'pi pi-spinner pi-spin' : 'pi pi-trash'"
                :loading="fb.loading['returnReason.delete.'+data.return_reason_id]"
                :disabled="fb.loading['returnReason.delete.'+data.return_reason_id]"
                rounded 
                outlined 
                severity="danger"
                @click="deleteReturnReason(data)"
              />
            </div>
          </template>
        </Column>
      </DataTable>
    </div>
  </div>
</template> 