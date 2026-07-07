<script setup lang="ts">
import { resolveMediaImage } from '@/utils/mediaUrl';
import { ref, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import { useToast } from 'primevue/usetoast';
import { useVariantStore } from '@/stores/variant';
import ProductVariantFilter from '@/filters/ProductVariantFilter';

const router = useRouter();
const variantStore = useVariantStore();
const { variants, fb } = storeToRefs(variantStore);
const filters = ref({ ...new ProductVariantFilter() });
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
  router.push(`/ecommerce/products-variants/edit/${data.product_variant_id}`);
};

const deleteVariant = async (data: any) => {
  try {
    await variantStore.deleteVariant(data.product_variant_id);
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
  filters.value = { ...new ProductVariantFilter() };
};

onMounted(() => {
  getVariants();
});
</script>

<template>
  <div class="">
    <DataTable v-model:filters="filters" :value="variants" paginator :rows="100" :loading="fb.loading['variant.get']"
      dataKey="product_variant_id" filterDisplay="menu" :globalFilterFields="['variant_name', 'product_code']"
      selectionMode="multiple" class="th-table table-border">
      <template #header>
        <div class="flex justify-between items-center">
          <div class="flex gap-2">
            <Button type="button" icon="pi pi-filter-slash" label="Clear" outlined @click="clearFilter()" />
          </div>
          <div class="flex gap-2 items-center">
            <InputText v-model="filters['global'].value" placeholder="Keyword Search" />
          </div>
        </div>
      </template>
      <template #empty> No variants found. </template>
      <template #loading> Loading variants data. Please wait... </template>
      <Column field="product_variant_id" header="ID" style="min-width: 6rem" sortable />
      <!-- image column -->
      <Column field="image" header="Image" style="min-width: 6rem">
        <template #body="{ data }">
          <img :src="resolveMediaImage(data.image)" alt="Variant Image" style="width: 50px; height: 50px; object-fit: cover;" class="shadow-2 border-round" />
        </template>
      </Column>

      <Column field="variant_name" header="Variant Name" style="min-width: 12rem" sortable>
        <template #body="{ data }">
          {{ data.variant_name }}
        </template>
      </Column>

      <Column field="product_code" header="Product Code" style="min-width: 20rem" sortable filter>
        <template #body="{ data }">
          {{ data.product_code }}
        </template>

        <!-- <template #filter="{ filterModel, filterCallback }">
          <InputText v-model="filterModel.value" type="text" @input="filterCallback()" class="p-column-filter"
            placeholder="Search by product code" />
        </template> -->
      </Column>

      <Column field="sort_order" header="Sort" style="min-width: 6rem" sortable />

      <Column field="active_status" header="Status" style="min-width: 12rem" sortable>
        <template #body="{ data }">
          {{ data.active_status ? 'Active' : 'Inactive' }}
        </template>
      </Column>

      <Column header="Actions" :exportable="false" style="min-width: 8rem">
        <template #body="{ data }">
          <div class="flex gap-2">
            <Button
              :icon="fb.loading['variant.update.' + data.product_variant_id] ? 'pi pi-spinner pi-spin' : 'pi pi-pencil'"
              rounded outlined severity="success" @click="editVariant(data)" />
            <Button
              :icon="fb.loading['variant.delete.' + data.product_variant_id] ? 'pi pi-spinner pi-spin' : 'pi pi-trash'"
              rounded outlined severity="danger" @click="deleteVariant(data)" />
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

.p-datatable .p-datatable-thead>tr>th {
  background-color: var(--surface-100);
}

.p-datatable .p-datatable-tbody>tr>td {
  padding: 1rem;
}
</style>
