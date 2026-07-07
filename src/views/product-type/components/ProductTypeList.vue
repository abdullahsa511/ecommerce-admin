<script setup>
import { ref, onMounted, computed } from 'vue';
import { useProductTypeStore } from '@/stores/productType';
import InputText from 'primevue/inputtext';
import { useSiteStore } from '@/stores/site';
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import { storeToRefs } from 'pinia';
import ProductTypeFilter from '@/filters/ProductTypeFilter';


const toast = useToast();
const router = useRouter();
const productTypeStore = useProductTypeStore();
const siteStore = useSiteStore();
const { productTypes, fb } = storeToRefs(productTypeStore);


const filters = ref({...new ProductTypeFilter()});
const selectedProductTypes = ref([]);
const productTypeNames = computed(() => productTypeStore.productTypeNames);
const productTypeTypes = computed(() => Object.keys(productTypeStore.productTypesByType));


const fetchData = async () => {
  await Promise.all([
    productTypeStore.fetchProductTypes(),
    siteStore.fetchSites()
  ]);
};

const editProductType = (data) => {
  router.push(`/configuration/settings/product-types/edit/${data.product_type_id}`);
};

const deleteProductType = async (data) => {
  try {
      await productTypeStore.deleteProductType(data.product_type_id);
      toast.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Product type deleted successfully',
          life: 3000
      });
      await productTypeStore.fetchProductTypes();
  } catch (error) {
      toast.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to delete product type',
          life: 3000
      });
  }
};

const deleteSelectedProductTypes = async () => {
  if (selectedProductTypes.value.length > 0) {
    for (const productType of selectedProductTypes.value) {
      await productTypeStore.deleteProductType(productType.product_type_id);
    }
    selectedProductTypes.value = [];
  }
};

onMounted(() => {
  fetchData();
});

const initFilters = () => {
  filters.value = {...new ProductTypeFilter()};
};

const clearFilter = () => {
  initFilters();
};

const getSiteName = (siteId) => {
  const site = siteStore.sites.find(s => s.site_id === siteId);
  return site ? site.name : 'Unknown Site';
};

const addProductType = () => {
  router.push('/configuration/settings/add-product-type');
};
const onRowSelect = (event) => {
  console.log(event);
};

const onRowUnselect = (event) => {
  console.log(event);
};  
</script> 
<template>
  <div>
    <DataTable
      v-model:filters="filters"
      v-model:selection="selectedProductTypes"
      :value="productTypes"
      paginator
      :rows="10"
      dataKey="product_type_id"
      filterDisplay="menu"
      :loading="fb.loading['productType.list']"
      :globalFilterFields="['name', 'type', 'source']"
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
              v-if="selectedProductTypes.length > 0"
              type="button"
              icon="pi pi-trash"
              label="Delete Selected"
              severity="danger"
              @click="deleteSelectedProductTypes"
            />
          </div>
          <InputText v-model="filters['global'].value" placeholder="Keyword Search" />
        </div>
      </template>
      <template #empty> No product types found. </template>
      <template #loading> Loading product types data. Please wait. </template>

      <Column selectionMode="multiple" headerStyle="width: 3rem" />
      
      <Column field="name" header="Name" sortable filterField="name" :showFilterMatchModes="false" :filterMenuStyle="{ width: '14rem' }" style="min-width: 14rem">
        <template #body="{ data }">
          <a 
            @click="editProductType(data)" 
            class="text-blue-600 hover:text-blue-800 cursor-pointer hover:underline"
          >
            {{ data.name }}
          </a>
        </template>
        <template #filter="{ filterModel }">
          <InputText v-model="filterModel.value" type="text" class="p-column-filter"
            placeholder="Search by name" />
        </template>
       
      </Column>

      <Column field="type" header="Type" style="min-width: 12rem">
        <template #body="{ data }">
          {{ data.type }}
        </template>
        <template #filter="{ filterModel }">
          <InputText v-model="filterModel.value" type="text" class="p-column-filter"
            placeholder="Search by type" />
        </template>
        
      </Column>
      
      <Column field="source" header="Source" style="min-width: 36rem">
        <template #body="{ data }">
          <span class="px-3 py-1 text-sm font-medium rounded-full bg-gray-200 text-black-800" style="display: inline-block;">
            {{ data.source }}
          </span>
        </template>
        
      </Column>
      
      <Column field="site_id" header="Site Name By Id" style="min-width: 12rem">
        <template #body="{ data }">
          <span class="px-3 py-1 text-sm font-medium rounded-lg bg-green-700 text-white" style="display: inline-block;">
            {{ getSiteName(data.site_id) }}
          </span>
        </template>
        
      </Column>
      
      <Column header="Actions" :exportable="false" style="min-width: 8rem">
        <template #body="{ data }">
          <div class="flex gap-2">
            <Button 
              icon="pi pi-pencil" 
              :loading="fb.loading['productType.edit.' + data.product_type_id]"
              :icon="fb.loading['productType.edit.' + data.product_type_id] ? 'pi pi-spinner pi-spin' : 'pi pi-pencil'"
              :disabled="fb.loading['productType.edit.' + data.product_type_id]"
              rounded 
              outlined 
              severity="success" 
              class="mr-2"
              @click="editProductType(data)"
            />
            <Button 
              icon="pi pi-trash" 
              :loading="fb.loading['productType.delete.' + data.product_type_id]"
              :icon="fb.loading['productType.delete.' + data.product_type_id] ? 'pi pi-spinner pi-spin' : 'pi pi-trash'"
              :disabled="fb.loading['productType.delete.' + data.product_type_id]"
              rounded 
              outlined 
              severity="danger"
              @click="deleteProductType(data)"
            />
          </div>
        </template>
      </Column>
    </DataTable>
  </div>
</template>
