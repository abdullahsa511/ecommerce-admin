<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import { useToast } from 'primevue/usetoast';
import { useAttributeGroupStore } from '@/stores/attributeGroup';
import AttributeGroupFilter from '@/filters/AttributeGroupFilter';

const router = useRouter();
const attributeGroupStore = useAttributeGroupStore();
const { attributeGroups, fb } = storeToRefs(attributeGroupStore);
const filters = ref({...new AttributeGroupFilter()});
const toast = useToast();

const editAttribute = (data: any) => {
  router.push(`/configuration/settings/attribute-groups/edit/${data.attribute_group_id}`);
};

const deleteAttribute = async (data: any) => {
  try {
    await attributeGroupStore.deleteAttributeGroup(data.attribute_group_id);
    toast.add({ severity: 'success', summary: 'Success', detail: 'Product deleted successfully', life: 3000 });
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete product.', life: 3000 });
  }
};

const clearFilter = () => {
  filters.value = {...new AttributeGroupFilter()};
};

const renderIcon = (icon: string, action: string, id: number) => {
  return fb.value.loading[`attributeGroup.${action}.${id}`] ? 'pi pi-spinner pi-spin' : icon;
};





watch(attributeGroups.value, (newVal) => {
  console.log('Attribute Groups updated:', newVal);
}
);

onMounted(() => {
  attributeGroupStore.fetchAttributeGroups();
});
</script>

<template>
  <DataTable
    v-model:filters="filters"
    :value="attributeGroups"
    paginator
    :rows="200"
    dataKey="attribute_id"
    filterDisplay="menu"
    :loading="fb.loading['attributeGroup.list']"
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

    <template #loading>
      <div class="flex items-center justify-center gap-2 py-8">
        <i class="pi pi-spinner pi-spin" style="font-size: 2rem;"></i>
      </div>
    </template>
   
    <Column selectionMode="multiple" headerStyle="width: 3rem" />

    <Column field="content.name" header="Name" style="min-width: 12rem" filterField="name" sortable>
      <template #body="{ data }">
        <a @click="editAttribute(data)" class="text-blue-600 hover:text-blue-800 cursor-pointer hover:underline">
          {{ data?.content?.name }}
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
          <Button :icon="renderIcon('pi pi-pencil', 'edit', data.attribute_group_id)" 
          rounded 
          outlined 
          severity="success" 
          @click="editAttribute(data)" />
          <Button 
            :icon="renderIcon('pi pi-trash', 'delete', data.attribute_group_id)" 
            rounded 
            outlined 
            severity="danger" 
            @click="deleteAttribute(data)" 
          />
        </div>
      </template>
    </Column>
  </DataTable>
</template>

<style scoped>
/* .product-attribute-index {
  padding: 2rem;
}
.p-datatable .p-datatable-thead>tr>th {
  background-color: var(--surface-100);
}
.p-datatable .p-datatable-tbody>tr>td {
  padding: 1rem;
} */
</style>
