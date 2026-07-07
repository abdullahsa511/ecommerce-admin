<script setup lang="ts">

import { ref, onMounted, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import { useToast } from 'primevue/usetoast';
import { useModelStore } from '@/stores/designResourceModel';
import DocumentFilter from '@/filters/DesignResourceFilter';
import { resolveMediaImage } from '@/utils/mediaUrl';

const router = useRouter();
const modelStore = useModelStore();
const { models, fb } = storeToRefs(modelStore);
let filters = ref({...new DocumentFilter()});
const toast = useToast();

const editDocument = (data: any) => {
  router.push(`/design-resource-models/edit/${data.design_resource_id}`);
};

const deleteDocument = async (data: any) => {
  try {
    await modelStore.deleteModel(data.design_resource_id);
    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Model deleted successfully',
      life: 3000
    });
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to delete model.',
      life: 3000
    });
  }
};


const clearFilter = () => {
  filters.value = {...new DocumentFilter()};
};
const renderIcon = (icon: string, action: string, id: number) => {
  return fb.value.loading[`model.${action}.${id}`] ? 'pi pi-spinner pi-spin' : icon;
};

onMounted(() => {
  modelStore.fetchModels();
});
</script>

<template>
  <div class="document-index">
    <DataTable
      :value="models"
      paginator
      :rows="100"
      dataKey="design_resource_id"
      filterDisplay="menu"
      :loading="fb.loading['model.list']"
      :globalFilterFields="['title']"
      class="th-table"
      v-model:filters="filters"
    >
      <template #header>
        <div class="flex justify-between">
          <Button type="button" icon="pi pi-filter-slash" label="Clear" outlined @click="clearFilter()" />
            <IconField iconPosition="left">
                <InputIcon>
                    <i class="pi pi-search" />
                </InputIcon>
                <InputText v-model="filters['global'].value" placeholder="Keyword Search" />
            </IconField>
        </div>
      </template>
      <template #empty> No document to display! </template>
      <template #loading> Loading document data. Please wait. </template>
      <Column selectionMode="multiple" headerStyle="width: 3rem" />

      <Column field="image" header="Image" style="min-width: 120px; width: 120px;">
        <template #body="{ data }">
          <img :src="data.image" :alt="data.image_alt" style="width: 50px; height: 50px; object-fit: cover;"
            class="shadow-2 border-round" />
        </template>
      </Column>

      <Column field="title" header="Title" style="min-width: 350px; width: 350px;">
        <template #body="{ data }">
          <a @click="editDocument(data)" class="text-blue-600 hover:text-blue-800 cursor-pointer hover:underline">
            {{ data.title }}
          </a>
        </template>
        <template #filter="{ filterModel, filterCallback }">
            <InputText v-model="filterModel.value" type="text" @input="filterCallback()" class="p-column-filter" placeholder="Search by name" />
        </template>
      </Column>

      <Column header="Files" style="min-width: 12rem">
        <template #body="{ data }">
          <div class="flex gap-5">
            <div v-for="document in data.design_resource_documents" :key="document.design_resource_document_id">
              <a :href="document.url" target="_blank">
                <img :src="resolveMediaImage(document.objectURL)" :alt="document.name" style="width: 30px; height: auto; object-fit: cover;"
                  class="shadow-2 border-round" />
              </a>
            </div>
          </div>
        </template>
      </Column>

      <Column field="sort_order" header="Sort Order" style="min-width: 8rem" sortable>
        <template #body="{ data }">
          {{ data.sort_order }}
        </template>
      </Column>

      <Column header="Actions" :exportable="false" style="min-width: 8rem">
        <template #body="{ data }">
          <div class="flex gap-2">
            <Button
              :icon="renderIcon('pi pi-pencil', 'edit', data.design_resource_id)"
              rounded
              outlined
              severity="success"
              class="mr-2"
              @click="editDocument(data)"
            />
            <Button
              :icon="renderIcon('pi pi-trash', 'delete', data.design_resource_id)"
              rounded
              outlined
              severity="danger"
              @click="deleteDocument(data)"
            />
          </div>
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<style scoped>
.discount-document-index {
  padding: 2rem;
}

.p-datatable .p-datatable-tbody > tr > td {
  padding: 1rem;
}
</style>
