<script setup lang="ts">

import { ref, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import { useToast } from 'primevue/usetoast';
import { useDocumentStore } from '@/stores/designResourceDocument';
import DocumentFilter from '@/filters/DesignResourceFilter';
import { mediaUrl } from '@/utils/mediaUrl';

const router = useRouter();
const documentStore = useDocumentStore();
const { documents, fb } = storeToRefs(documentStore);
const filters = ref({...new DocumentFilter()});
const toast = useToast();

const editDocument = (data: any) => {
  router.push(`/design-resource-documents/edit/${data.design_resource_id}`);
};

const deleteDocument = async (data: any) => {
  try {
    await documentStore.deleteDocument(data.design_resource_id);
    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Documente deleted successfully',
      life: 3000
    });
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to delete document.',
      life: 3000
    });
  }
};

const pdfLink = (data: any) => {
  const url = data.design_resource_documents.find((doc: any) => doc.type === 'pdf')?.objectURL;
  return url ? mediaUrl(url) : '';
};

const clearFilter = () => {
  filters.value = {...new DocumentFilter()};
};

const renderIcon = (icon: string, action: string, id: number) => {
  return fb.value.loading[`document.${action}.${id}`] ? 'pi pi-spinner pi-spin' : icon;
};

// watch(documents.value, () => {});
onMounted(() => {
  documentStore.fetchDocuments();
  console.log('documents', documents.value);
  setTimeout(() => {
    // console.log('documents', documents.value);
  }, 2000);
});
</script>

<template>
  <div class="document-index">
    <DataTable
      v-model:filters="filters"
      :value="documents"
      paginator
      :rows="100"
      dataKey="design_resource_id"
      filterDisplay="menu"
      :loading="fb.loading['document.list']"
      :globalFilterFields="['title', 'grade', 'image', 'image_alt', 'link_text', 'action']"
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
          <InputText v-model="filters['global'].value" placeholder="Keyword Search" />
        </div>
      </template>
      <template #empty> No document to display! </template>
      <template #loading> Loading document data. Please wait. </template>
      <Column selectionMode="multiple" headerStyle="width: 3rem" />

      <Column field="image" header="Image" style="min-width: 12rem">
        <template #body="{ data }">
          <img :src="data.image" :alt="data.image_alt" style="width: 50px; height: 50px; object-fit: cover;"
            class="shadow-2 border-round" />
        </template>
      </Column>

      <Column field="title" header="Title" style="min-width: 10rem">
        <template #body="{ data }">
          <a @click="editDocument(data)" class="text-blue-600 hover:text-blue-800 cursor-pointer hover:underline">
            {{ data.title }}
          </a>
        </template>
        <template #filter="{ filterModel, filterCallback }">
            <InputText v-model="filterModel.value" type="text" @input="filterCallback()" class="p-column-filter" placeholder="Search by name" />
        </template>
      </Column>
      <Column field="link_text" header="Link Text" style="min-width: 12rem;">
        <template #body="{ data }">
          <a v-if="pdfLink(data)" :href="pdfLink(data)" target="_blank" class="text-blue-600 hover:text-blue-800 cursor-pointer hover:underline">
            <i class="pi pi-file-pdf" style="font-size: 2rem;" v-tooltip.top="'View User Guide'"></i>
          </a>
          <span v-else>
            <i class="pi pi-file-excel" style="font-size: 2rem;" v-tooltip.top="'No User Guide Available'"></i>
          </span>
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
/* .discount-document-index {
  padding: 2rem;
}

.p-datatable .p-datatable-tbody > tr > td {
  padding: 1rem;
} */
</style>
