<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useProductAttributeStore } from '@/stores/productAttribute';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import { useToast } from 'primevue/usetoast';
import AttributeFilter from '@/filters/AttributeFilter';

const router = useRouter();
const attributeStore = useProductAttributeStore();
const { attributes, fb } = storeToRefs(attributeStore);
const filters = ref({...new AttributeFilter()});
const isLoading = computed(() => fb?.value?.loading === true);
const toast = useToast();



const editAttribute = (data: any) => {
  router.push(`/configuration/settings/attributes/edit/${data.attribute_id}`);
};

const deleteAttribute = async (data: any) => {
  try {
    await attributeStore.deleteAttribute(data.attribute_id);
    toast.add({ severity: 'success', summary: 'Success', detail: 'Product deleted successfully', life: 3000 });
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete product.', life: 3000 });
  }
};

const clearFilter = () => {
  filters.value = {...new AttributeFilter()};
};

const renderIcon = (icon: string, action: string, id: number) => {
  return fb.value.loading[`attribute.${action}.${id}`] ? 'pi pi-spinner pi-spin' : icon;
}

onMounted(() => {
  attributeStore.fetchAttributes();
});
</script>

<template>
  <DataTable
    v-model:filters="filters"
    :value="attributes"
    paginator
    :rows="10"
    dataKey="attribute_id"
    filterDisplay="menu"
    :loading="isLoading"
    :globalFilterFields="['content.name']"
    class="th-table"
  >
    <template #header>
      <div class="flex justify-between items-center">
        <div class="flex gap-2">
          <Button type="button" icon="pi pi-filter-slash" label="Clear" outlined @click="clearFilter()" />
        </div>
        <InputText v-model="filters['global'].value" placeholder="Keyword Search" />
      </div>
    </template>
    <template #empty> No attributes found. </template>
    <template #loading> Loading attributes data. Please wait. </template>
    <Column field="attribute_id" header="ID" style="min-width: 6rem" sortable/>
    <Column field="name" header="Name" style="min-width: 12rem" filterField="name">
      <template #body="{ data }">
        <a @click="editAttribute(data)" class="text-blue-600 hover:text-blue-800 cursor-pointer hover:underline">
          {{ data.content.name }}
        </a>
      </template>
      <template #filter="{ filterModel }">
        <InputText v-model="filterModel.value" placeholder="Search by name" />
      </template>
    </Column>
     <Column field="attribute_group_name" header="Group" style="min-width: 12rem" filterField="attribute_group_name">
      <template #body="{ data }">
        {{ data.group_content.name }}
      </template>
    </Column>
    <Column header="Actions" :exportable="false" style="min-width: 8rem">
      <template #body="{ data }">
        <div class="flex gap-2">
          <Button :icon="renderIcon('pi pi-pencil', 'edit', data.attribute_id)" rounded outlined severity="success" @click="editAttribute(data)" />
          <Button :icon="renderIcon('pi pi-trash', 'delete', data.attribute_id)" rounded outlined severity="danger" @click="deleteAttribute(data)" />
        </div>
      </template>
    </Column>
  </DataTable>
</template>

<style scoped>
.product-attribute-index {
  padding: 2rem;
}
.p-datatable .p-datatable-thead>tr>th {
  background-color: var(--surface-100);
}
.p-datatable .p-datatable-tbody>tr>td {
  padding: 1rem;
}
</style>
