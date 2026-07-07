<script setup>
import { ref, onMounted, computed } from 'vue';
import { useTaxTypeStore } from '../stores/taxType';
import { storeToRefs } from 'pinia';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import MultiSelect from 'primevue/multiselect';
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';

const toast = useToast();
const router = useRouter();

const taxTypeStore = useTaxTypeStore();
const { taxTypes, fb } = storeToRefs(taxTypeStore);
const selectedTaxTypes = ref([]);

const filters = ref({
  global: { value: null, matchMode: 'contains' },
  name: { value: null, matchMode: 'contains' }
});

const isLoading = computed(() => {
  return fb.value.loading?.taxType === true;
});

const taxTypeNames = computed(() => {
  return taxTypes.value.map(type => type.name);
});

onMounted(() => {
  taxTypeStore.fetchTaxTypes();
});

const clearFilter = () => {
  filters.value = {
    global: { value: null, matchMode: 'contains' },
    name: { value: null, matchMode: 'contains' }
  };
};

const onRowSelect = (event) => {
  console.log('Row selected:', event.data);
};

const onRowUnselect = (event) => {
  console.log('Row unselected:', event.data);
};

const deleteSelectedTaxTypes = () => {
  if (selectedTaxTypes.value && selectedTaxTypes.value.length > 0) {
    // Implement delete functionality for selected items
    console.log('Delete selected tax types:', selectedTaxTypes.value);
  }
};

const editTaxType = (taxType) => {
  router.push(`/configuration/settings/edit-tax-types/${taxType.tax_type_id}`);
};

const deleteTaxType = async (taxType) => {
  try {
    await taxTypeStore.deleteTaxType(taxType.tax_type_id);
    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Tax type deleted successfully',
      life: 3000
        });
        taxTypeStore.fetchTaxTypes();
    } catch (error) {
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to delete tax type',
            life: 3000
        });
    }
};

const addTaxType = () => {
  router.push('/configuration/settings/add-tax-types');
};
</script>

<template>
  <div>
    <div class="flex justify-end gap-2 mb-6">
            <Button
                icon="pi pi-plus"
                label="Add Tax Type"
                @click="addTaxType"
                class="p-button-md"
            />
        </div>
    <DataTable
      v-model:filters="filters"
      v-model:selection="selectedTaxTypes"
      :value="taxTypes"
      paginator
      :rows="10"
      dataKey="tax_type_id"
      filterDisplay="menu"
      :loading="isLoading"
      :globalFilterFields="['name']"
      selectionMode="multiple"
      @rowSelect="onRowSelect"
      @rowUnselect="onRowUnselect"
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
            <Button
              v-if="selectedTaxTypes && selectedTaxTypes.length > 0"
              type="button"
              icon="pi pi-trash"
              label="Delete Selected"
              severity="danger"
              @click="deleteSelectedTaxTypes"
            />
          </div>
          <InputText v-model="filters['global'].value" placeholder="Keyword Search" />
        </div>
      </template>
      <template #empty> No tax types found. </template>
      <template #loading> Loading tax types data. Please wait. </template>

      <Column selectionMode="multiple" headerStyle="width: 3rem" />
      
      <Column header="Name" filterField="name" :showFilterMatchModes="false" :filterMenuStyle="{ width: '14rem' }" style="min-width: 36rem">
        <template #body="{ data }">
          <a 
            @click="editTaxType(data)" 
            class="text-blue-600 hover:text-blue-800 cursor-pointer hover:underline"
          >
            {{ data.name }}
          </a>
        </template>
        <template #filter="{ filterModel }">
          <MultiSelect v-model="filterModel.value" :options="taxTypeNames" placeholder="Any">
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
              rounded 
              outlined 
              severity="success" 
              class="mr-2"
              @click="editTaxType(data)"
            />
            <Button 
              icon="pi pi-trash" 
              rounded 
              outlined 
              severity="danger"
              @click="deleteTaxType(data)"
            />
          </div>
        </template>
      </Column>
    </DataTable>
  </div>
</template>