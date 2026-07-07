<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import { useToast } from 'primevue/usetoast';
import { useTypeStore } from '@/stores/type';
import TypeFilter from '@/filters/TypeFilter';

const router = useRouter();
const typeStore = useTypeStore();
const { types, fb } = storeToRefs(typeStore);
const filters = ref({...new TypeFilter()});
const isLoading = computed(() => fb?.value?.loading === true);
const toast = useToast();


const editOption = (data: any) => {
  router.push(`/configuration/settings/types/edit/${data.type_id}`);
};

const deleteType = async (data: any) => {
  try {
    await typeStore.deleteType(data.type_id);
    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Option deleted successfully.',
      life: 3000,
    });
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to delete option.',
      life: 3000,
    });
  }
};

const clearFilter = () => {
  filters.value = {...new TypeFilter()};
};

onMounted(() => {
  typeStore.getTypes();
});
</script>

<template>
  <div class="option-index">
    <DataTable
      v-model:filters="filters"
      :value="types"
      paginator
      :rows="100"
      dataKey="type_id"
      filterDisplay="menu"
      :loading="isLoading"
      :globalFilterFields="['type']"
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
          </div>
          <div class="flex gap-2 items-center">
            <InputText v-model="filters['global'].value" placeholder="Keyword Search" />
          </div>
        </div>
      </template>
      <template #empty> No types found. </template>
      <template #loading> Loading types data. Please wait... </template>
      <Column
        field="type"
        header="Type Name"
        style="min-width: 12rem"
        filterField="type"
        sortable
      >
        <template #body="{ data }">
          <a
            @click="editOption(data)"
            class="text-blue-600 hover:text-blue-800 cursor-pointer hover:underline"
          >
            {{ data.type }}
          </a>
        </template>
        <template #filter="{ filterModel }">
          <InputText v-model="filterModel.value" placeholder="Search by name" />
        </template>
      </Column>
      <Column field="sort_order" header="Sort Order" style="min-width: 6rem" sortable/>
      <Column header="Actions" :exportable="false" style="min-width: 8rem">
        <template #body="{ data }">
          <div class="flex gap-2">
            <Button
              :icon="fb.loading['type.edit.' + data.type_id] ? 'pi pi-spinner pi-spin' : 'pi pi-pencil'"
              :disabled="fb.loading['type.edit.' + data.type_id]"
              rounded
              outlined
              severity="success"
              @click="editOption(data)"
            />
            <Button
            :icon="fb.loading['type.delete.' + data.type_id] ? 'pi pi-spinner pi-spin' : 'pi pi-trash'"
            :disabled="fb.loading['type.delete.' + data.type_id]"
              rounded
              outlined
              severity="danger"
              @click="deleteType(data)"
            />
          </div>
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<style scoped>
/* .option-index {
  padding: 2rem;
} */
.p-datatable .p-datatable-thead > tr > th {
  background-color: var(--surface-100);
}
.p-datatable .p-datatable-tbody > tr > td {
  padding: 1rem;
}
</style>
