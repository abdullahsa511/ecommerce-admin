<script setup lang="ts">
import { resolveMediaImage, hasMediaImage } from '@/utils/mediaUrl';
import { ref, onMounted, nextTick, watch} from 'vue';
import { useShowroomStore } from '@/stores/showroom';
import ShowRoomFilter from '@/filters/ShowRoomFilter.js';
import InputText from 'primevue/inputtext';
import { useToast } from 'primevue/usetoast';
import { storeToRefs } from 'pinia';

import { SectionProduct, ShowroomSection } from '@/models/Showroom';
import { debounce } from 'lodash';
import { useProductStore } from '@/stores/product';
import { IProduct } from '@/models/Product.ts';

const toast = useToast();
const productStore = useProductStore();
const showroomStore = useShowroomStore();
const { fb, sectionProducts, section } = storeToRefs(showroomStore);
const filters = ref({...new ShowRoomFilter()});

type ProductItem = { product_id: number|string, name: string };
const relatedProductSuggestions = ref<ProductItem[]>([]);
const showProductAutocomplete = ref(false);


const searchRelatedProducts = (e: any) => {
  const query = e.data?.toLowerCase();
  if (query?.length > 0) {
    productStore.searchProducts(query).then(results => {
      relatedProductSuggestions.value = results;
    });
  } else {
    relatedProductSuggestions.value = [];
  }
}


const addRelatedProduct = (event: { value: IProduct }) => {
  // Reset the autocomplete
  showProductAutocomplete.value = false;

  nextTick(() => {
    showProductAutocomplete.value = true;
    // console.log(event.value);

    // Call the store action and catch errors here
        showroomStore.addSectionProducts({ // data obj
          section_id: section.value.project_sections_id,
          product_id: event.value.product_id
        }).then(() => {
          // then 
            console.log(sectionProducts.value);
        }).catch((error: any) => {
          // catch
        console.log('Error adding product:', error);

        // Extract API validation errors if available
        let errorMsg = 'Duplicate products';
        if (error.response?.data) {
        const data = error.response.data;
        if (data.errors) {
          errorMsg = Object.values(data.errors).flat().join(', ');
        } else if (data.message) {
          errorMsg = data.message;
        }
        } else if (error.message) {
          errorMsg = error.message;
        }

        toast.add({
          severity: 'error',
          summary: 'Error',
          detail: errorMsg,
          life: 5000
        });
    });
  });
};

const initiateProductAutocomplete = () => {
  showProductAutocomplete.value = true;
  nextTick(() => {
    const input = document.querySelector('.related-products-autocomplete > .p-autocomplete-input');
    if (input instanceof HTMLElement) {
      input.focus();
    }
  });
}

const clearFilter = () => {
  filters.value = {...new ShowRoomFilter()};
};

const renderIcon = (icon: string, action: string, id: number) => {
    const loadingKey = `showroom.${action}.${id}`;
    return fb.value.loading[loadingKey] ? 'pi pi-spinner pi-spin' : icon;
};

const onRelatedProductsInput = debounce(searchRelatedProducts, 300);
onMounted(() => {
  if(sectionProducts.value.length === 0){
  fb.value.startLoading('showroom');
    setTimeout(() => {
      fb.value.finishLoading('showroom');
      if(sectionProducts.value.length === 0 && section.value.project_sections_id){
        showroomStore.getSectionProducts(section.value.project_sections_id);
      }
    }, 1000);
  }
});

watch(section, (newValue) => {
  if(newValue.project_sections_id){
    showroomStore.getSectionProducts(newValue.project_sections_id);
  }
});


// Delete action
const deleteSectionProduct = async (data: SectionProduct) => {
  console.log('dele data', data);
  try {
    await showroomStore.deleteSectionProduct(data.section_id, data.project_section_products_id as number);
    toast.add({ severity: 'success', summary: 'Success', detail: 'Product deleted successfully', life: 3000 });
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete product.', life: 3000 });
  }
};
</script>

<template>
  <div>
    <div class="flex flex-col">
      <div class="flex items-center justify-between w-full">
        <h3 class="font-medium text-lg">Related Products</h3>
        <Button label="Add" icon="pi pi-plus" class="p-button-text" @click="initiateProductAutocomplete" />
      </div>
      <AutoComplete
          ref="productAutocomplete"
          :suggestions="relatedProductSuggestions"
          @input="onRelatedProductsInput"
          @item-select="addRelatedProduct"
          optionLabel="name"
          placeholder="Type for autocomplete"
          class="w-full related-products-autocomplete pb-2"
          inputClass="w-full !rounded-md !border !border-gray-200 !shadow-none !focus:ring-0"
          v-if="showProductAutocomplete"
      />
    </div>

    <DataTable v-model:filters="filters" 
      :value="sectionProducts"
      paginator 
      showGridlines 
      :rows="10"
      dataKey="project_section_products_id" 
      filterDisplay="menu" 
      :loading="fb.loading.showroom"
      :globalFilterFields="['description', 'price']">
      
      <template #header>
        <div class="flex justify-between items-center">
          <Button type="button" icon="pi pi-filter-slash" label="Clear" outlined @click="clearFilter()" />
          <div class="flex items-center gap-2">
            <i class="pi pi-search" />
            <InputText v-model="filters['global'].value" placeholder="Keyword Search" />
          </div>
        </div>
      </template>

      <template #empty> No products found. </template>
      <!-- <template #loading> Loading products. Please wait. </template> -->
      <template #loading>
          <div class="flex items-center justify-center gap-2 py-8">
              <i class="pi pi-spinner pi-spin" style="font-size: 2rem;"></i>
          </div>
      </template>

      <Column field="image" header="Image" style="min-width: 14rem">
        <template #body="{ data }">
          <img :src="resolveMediaImage(data.image)" :alt="data.name" style="width: 50px; height: 50px; object-fit: cover;" class="shadow-2 border-round" />
        </template>
      </Column>
      <Column field="name" header="Name" style="min-width: 14rem"/>
      <Column field="description" header="Description" style="min-width: 14rem"/>
      <Column field="price" header="Price" style="min-width: 10rem"/>
      <Column field="created_at" header="Created At" style="min-width: 12rem"/>
      <Column field="status" header="Status" style="min-width: 8rem" />
      <Column header="Actions" style="min-width: 8rem">
        <template #body="{ data }">
          <div class="flex gap-2">
            <!-- <Button icon="pi pi-pencil" rounded outlined severity="success" @click="editSectionProduct(data)" /> -->
            <Button :icon="renderIcon('pi pi-trash', 'delete', data.section_id)" rounded outlined severity="danger" @click="deleteSectionProduct(data)" />
          </div>
        </template>
      </Column>

    </DataTable>
  </div>
</template>
