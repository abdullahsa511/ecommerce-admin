<script setup>
import { ref, onMounted, computed } from 'vue';
import { useLengthTypeStore } from '../stores/lengthType';
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

const lengthTypeStore = useLengthTypeStore();
const { lengthTypes, fb } = storeToRefs(lengthTypeStore);
const selectedLengthTypes = ref([]);

const filters = ref({
  global: { value: null, matchMode: 'contains' },
  name: { value: null, matchMode: 'contains' },
  unit: { value: null, matchMode: 'contains' },
  value: { value: null, matchMode: 'contains' }
});

const isLoading = computed(() => {
  return fb.value.loading?.lengthType === true;
});

const lengthTypeNames = computed(() => {
  return lengthTypes.value.map(type => type.length_type_content_data?.name).filter(Boolean);
});

const lengthTypeUnits = computed(() => {
  return [...new Set(lengthTypes.value.map(type => type.length_type_content_data?.unit).filter(Boolean))];
});

onMounted( async () => {
  await Promise.all([
    lengthTypeStore.fetchLengthTypes(),
    console.log(lengthTypes.value)
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

const deleteSelectedLengthTypes = () => {
  if (selectedLengthTypes.value && selectedLengthTypes.value.length > 0) {
    console.log('Delete selected length types:', selectedLengthTypes.value);
  }
};

const editLengthType = (lengthType) => {
  router.push(`/configuration/settings/edit-length-types/${lengthType.length_type_id}`);
};

const deleteLengthType = async (data) => {
  await lengthTypeStore.deleteLengthType(data.length_type_id);
};

const addLengthType = () => {
  router.push('/configuration/settings/add-length-types');
};
</script>

<template>
  <div>
    <div class="flex justify-end gap-2 mb-6">
      <Button
        icon="pi pi-plus"
        label="Add Length Type"
        severity="primary"
        @click="addLengthType"
        class="p-button-md"
      />
    </div>
    <DataTable
      v-model:filters="filters"
      v-model:selection="selectedLengthTypes"
      :value="lengthTypes"
      paginator
      :rows="10"
      dataKey="length_type_id"
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
              v-if="selectedLengthTypes && selectedLengthTypes.length > 0"
              type="button"
              icon="pi pi-trash"
              label="Delete Selected"
              severity="danger"
              @click="deleteSelectedLengthTypes"
            />
          </div>
          <InputText v-model="filters['global'].value" placeholder="Keyword Search" />
        </div>
      </template>
      <template #empty> No length types found. </template>
      <template #loading> Loading length types data. Please wait. </template>

      <Column selectionMode="multiple" headerStyle="width: 3rem" />
      
      <Column header="Name" filterField="name" :showFilterMatchModes="false" :filterMenuStyle="{ width: '14rem' }" style="min-width: 20rem">
        <template #body="{ data }">
          <a 
            @click="editLengthType(data)" 
            class="text-blue-600 hover:text-blue-800 cursor-pointer hover:underline"
          >
            {{ data.length_type_content_data?.name }}
          </a>
        </template>
        <template #filter="{ filterModel }">
          <MultiSelect v-model="filterModel.value" :options="lengthTypeNames" placeholder="Any">
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
          {{ data.length_type_content_data?.unit }}
        </template>
        <template #filter="{ filterModel }">
          <MultiSelect v-model="filterModel.value" :options="lengthTypeUnits" placeholder="Any">
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
              @click="editLengthType(data)"
            />
            <Button 
              icon="pi pi-trash" 
              rounded 
              outlined 
              severity="danger"
              @click="deleteLengthType(data)"
            />
          </div>
        </template>
      </Column>
    </DataTable>
  </div>
</template> 