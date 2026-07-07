<script setup>
import { ref, onMounted, computed } from 'vue';
import { useWeightTypeStore } from '../stores/weightType';
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

const weightTypeStore = useWeightTypeStore();
const { weightTypes, fb } = storeToRefs(weightTypeStore);
const selectedWeightTypes = ref([]);

const filters = ref({
  global: { value: null, matchMode: 'contains' },
  name: { value: null, matchMode: 'contains' },
  unit: { value: null, matchMode: 'contains' },
  value: { value: null, matchMode: 'contains' }
});

const isLoading = computed(() => {
  return fb.value.loading?.weightType === true;
});

const weightTypeNames = computed(() => {
  return weightTypes.value.map(type => type.weight_type_content_data?.name).filter(Boolean);
});

const weightTypeUnits = computed(() => {
  return [...new Set(weightTypes.value.map(type => type.weight_type_content_data?.unit).filter(Boolean))];
});

onMounted( async () => {
  await Promise.all([
    weightTypeStore.fetchWeightTypes(),
    console.log(weightTypes.value)
  ]);
});

const clearFilter = () => {
  filters.value = {
    global: { value: null, matchMode: 'contains' },
    name: { value: null, matchMode: 'contains' },
    unit: { value: null, matchMode: 'contains' },
    value: { value: null, matchMode: 'contains' }
  };
};

const onRowSelect = (event) => {
  console.log('Row selected:', event.data);
};

const onRowUnselect = (event) => {
  console.log('Row unselected:', event.data);
};

const deleteSelectedWeightTypes = () => {
  if (selectedWeightTypes.value && selectedWeightTypes.value.length > 0) {
    console.log('Delete selected weight types:', selectedWeightTypes.value);
  }
};

const editWeightType = (weightType) => {
  router.push(`/configuration/settings/edit-weight-types/${weightType.weight_type_id}`);
};

const deleteWeightType = async (data) => {
  await weightTypeStore.deleteWeightType(data.weight_type_id);
};

const addWeightType = () => {
  router.push('/configuration/settings/add-weight-types');
};
</script>

<template>
  <div>
    <div class="flex justify-end gap-2 mb-6">
      <Button
        icon="pi pi-plus"
        label="Add Weight Type"
        severity="primary"
        @click="addWeightType"
        class="p-button-md"
      />
    </div>
    <DataTable
      v-model:filters="filters"
      v-model:selection="selectedWeightTypes"
      :value="weightTypes"
      paginator
      :rows="10"
      dataKey="weight_type_id"
      filterDisplay="menu"
      :loading="isLoading"
      :globalFilterFields="['name', 'unit', 'value']"
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
              v-if="selectedWeightTypes && selectedWeightTypes.length > 0"
              type="button"
              icon="pi pi-trash"
              label="Delete Selected"
              severity="danger"
              @click="deleteSelectedWeightTypes"
            />
          </div>
          <InputText v-model="filters['global'].value" placeholder="Keyword Search" />
        </div>
      </template>
      <template #empty> No weight types found. </template>
      <template #loading> Loading weight types data. Please wait. </template>

      <Column selectionMode="multiple" headerStyle="width: 3rem" />
      
      <Column header="Name" filterField="name" :showFilterMatchModes="false" :filterMenuStyle="{ width: '14rem' }" style="min-width: 20rem">
        <template #body="{ data }">
          <a 
            @click="editWeightType(data)" 
            class="text-blue-600 hover:text-blue-800 cursor-pointer hover:underline"
          >
            {{ data.weight_type_content_data?.name }}
          </a>
        </template>
        <template #filter="{ filterModel }">
          <MultiSelect v-model="filterModel.value" :options="weightTypeNames" placeholder="Any">
            <template #option="slotProps">
              <div class="flex items-center gap-2">
                <span>{{ slotProps.option }}</span>
              </div>
            </template>
          </MultiSelect>
        </template>
      </Column>

      <Column header="Unit" filterField="unit" :showFilterMatchModes="false" :filterMenuStyle="{ width: '14rem' }" style="min-width: 12rem">
        <template #body="{ data }">
          {{ data.weight_type_content_data?.unit }}
        </template>
        <template #filter="{ filterModel }">
          <MultiSelect v-model="filterModel.value" :options="weightTypeUnits" placeholder="Any">
            <template #option="slotProps">
              <div class="flex items-center gap-2">
                <span>{{ slotProps.option }}</span>
              </div>
            </template>
          </MultiSelect>
        </template>
      </Column>

      <Column header="Value" filterField="value" :showFilterMatchModes="false" :filterMenuStyle="{ width: '14rem' }" style="min-width: 12rem">
        <template #body="{ data }">
          {{ data.value }}
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
              @click="editWeightType(data)"
            />
            <Button 
              icon="pi pi-trash" 
              rounded 
              outlined 
              severity="danger"
              @click="deleteWeightType(data)"
            />
          </div>
        </template>
      </Column>
    </DataTable>
  </div>
</template> 