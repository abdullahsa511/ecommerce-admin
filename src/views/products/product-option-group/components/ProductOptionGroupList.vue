<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import { useToast } from 'primevue/usetoast';
import { useProductOptionGroupStore } from '@/stores/productOptionGroup';
import ProductOptionGroupFilter from '@/filters/ProductOptionGroupFilter';

const router = useRouter();
const productOptionGroupStore = useProductOptionGroupStore();
const { productOptionGroups, fb } = storeToRefs(productOptionGroupStore);
const filters = ref({...new ProductOptionGroupFilter()});
const toast = useToast();

const getOptionGroups = async () => {
  try {
    await productOptionGroupStore.getProductOptionGroups();
  } catch (error) {
    console.error('Error fetching option groups:', error);
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to fetch option groups.',
      life: 3000,
    });
  }
};

const editOptionGroup = (data: any) => {
  router.push(`/ecommerce/products-option-groups/edit/${data.product_option_group_id }`);
};

const deleteOptionGroup = async (data: any) => {
  try {
    await productOptionGroupStore.deleteProductOptionGroup(data.product_option_group_id );
    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Option group deleted successfully.',
      life: 3000,
    });
    await getOptionGroups();
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to delete option group.',
      life: 3000,
    });
  }
};

const clearFilter = () => {
  filters.value = {...new ProductOptionGroupFilter()};
};

onMounted(() => {
  getOptionGroups();
});
</script>

<template>
  <div class="">
    <DataTable
      v-model:filters="filters"
      :value="productOptionGroups"
      paginator
      :rows="50"
      :loading="fb.loading['productOptionGroup.get']"
      dataKey="option_group_id"
      filterDisplay="menu"
      :globalFilterFields="['option_group_name','variant_name']"
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
            <InputText v-model="filters['global'].value" placeholder="Option group search" />
          </div>
        </div>
      </template>
      <template #empty> No options found. </template>
      <template #loading> Loading options data. Please wait... </template>
      <Column field="option_group_name" header="Product Option Group Name" style="min-width: 12rem" sortable/>
      <Column field="variant_name" header="Product Variant Name" style="min-width: 12rem" sortable/>
      <Column field="sort_order" header="Sort" style="min-width: 6rem" sortable/>
      <Column field="active_status" header="Status" style="min-width: 12rem" sortable>
        <template #body="{ data }">
          {{ data.active_status ? 'Active' : 'Inactive' }}
        </template>
      </Column>
      <Column header="Actions" :exportable="false" style="min-width: 8rem">
        <template #body="{ data }">
          <div class="flex gap-2">
            <Button
            :icon="fb.loading['productOptionGroup.update.' + data.product_option_group_id] ? 'pi pi-spinner pi-spin' : 'pi pi-pencil'"
            rounded
              outlined
              severity="success"
              @click="editOptionGroup(data)"
            />
            <Button
            :icon="fb.loading['productOptionGroup.delete.' + data.product_option_group_id] ? 'pi pi-spinner pi-spin' : 'pi pi-trash'"
            rounded
              outlined
              severity="danger"
              @click="deleteOptionGroup(data)"
            />
          </div>
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<style scoped>
.p-datatable .p-datatable-thead > tr > th {
  background-color: var(--surface-100);
}
.p-datatable .p-datatable-tbody > tr > td {
  padding: 1rem;
}
</style>
