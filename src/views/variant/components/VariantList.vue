<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import { useToast } from 'primevue/usetoast';
import { useVariantStore } from '@/stores/variant';

const router = useRouter();
const variantStore = useVariantStore();
const { variants, fb } = storeToRefs(variantStore);
const filters = ref({
  global: { value: null, matchMode: 'contains' },
  'content.name': { value: null, matchMode: 'contains' },
});
const toast = useToast();

const getVariants = async () => {
  try {
    await variantStore.getVariants();
  } catch (error) {
    console.error('Error fetching variants:', error);
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to fetch variants.',
      life: 3000,
    });
  }
};

const editVariant = (data: any) => {
  router.push(`/configuration/settings/variants/edit/${data.variant_id}`);
};

const deleteVariant = async (data: any) => {
  try {
    await variantStore.deleteVariant(data.variant_id);
    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Variant deleted successfully.',
      life: 3000,
    });
    await getVariants();
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to delete variant.',
      life: 3000,
    });
  }
};

const clearFilter = () => {
  filters.value = {
    global: { value: null, matchMode: 'contains' },
    'content.name': { value: null, matchMode: 'contains' },
  };
};

onMounted(() => {
  getVariants();
});
</script>

<template>
  <div class="">
    <DataTable
      v-model:filters="filters"
      :value="variants"
      paginator
      :rows="100"
      :loading="fb.loading['variant.get']"
      dataKey="variant_id"
      filterDisplay="menu"
      :globalFilterFields="['content.name']"
      selectionMode="multiple"
      class="th-table table-border"
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
      <template #empty> No options found. </template>
      <template #loading> Loading options data. Please wait... </template>
      <Column
        field="content.name"
        header="Name"
        style="min-width: 12rem"
        filterField="content.name"
        sortable
      >
        <template #body="{ data }">
          <a
            @click="editVariant(data)"
            class="text-blue-600 hover:text-blue-800 cursor-pointer hover:underline"
          >
            {{ data.content?.name }}
          </a>
        </template>
        <template #filter="{ filterModel }">
          <InputText v-model="filterModel.value" placeholder="Search by name" />
        </template>
      </Column>
      <Column header="Language Name" style="min-width: 12rem" sortable>
        <template #body="{ data }">
          {{ data.content?.language_name ?? data.content?.language_name + ' ( ' + data.content?.language_code + ' )' }}
        </template>
      </Column>
      <Column field="sort_order" header="Sort" style="min-width: 6rem" sortable/>
      <Column header="Actions" :exportable="false" style="min-width: 8rem">
        <template #body="{ data }">
          <div class="flex gap-2">
            <Button
              icon="pi pi-pencil"
              rounded
              outlined
              severity="success"
              @click="editVariant(data)"
            />
            <Button
              icon="pi pi-trash"
              rounded
              outlined
              severity="danger"
              @click="deleteVariant(data)"
            />
          </div>
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<style scoped>
.option-index {
  padding: 2rem;
}
.p-datatable .p-datatable-thead > tr > th {
  background-color: var(--surface-100);
}
.p-datatable .p-datatable-tbody > tr > td {
  padding: 1rem;
}
</style>
