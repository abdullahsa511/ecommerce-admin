<script setup lang="ts">
import { defineProps, ref, nextTick, onUpdated } from 'vue';
import Product from '@/models/Product.ts';
import ProductSidebar from './ProductSidebar.vue';
import { debounce } from 'lodash';

import { productVariantColumns, productVariants } from '../data/ProductData';
import { useProductStore } from '@/stores/product';
import { storeToRefs } from 'pinia';
import { on } from 'events';


const emit = defineEmits(['update:product', 'saved']);

const productStore = useProductStore();
const { fb } = storeToRefs(productStore);

const editingRows = ref([]);
const showVariantAutocomplete = ref(false);
// const variantSuggestions = ref<IProductVariant[]>([]);

type VariantItem = { product_id: number, variant: string };

const variantSuggestions = ref<VariantItem[]>([]);

const props = defineProps({
  product: {
    type: Product,
    required: true,
    default: () => new Product({})
  }
});

function initiateVariantAutocomplete() {
  showVariantAutocomplete.value = true;
  nextTick(() => {
    const input = document.querySelector('.variant-autocomplete > .p-autocomplete-input');
    if (input instanceof HTMLElement) {
      input.focus();
    }
  });
}

const searchVariants = (e: any) => {
  const query = e.data?.toLowerCase();
  if (query?.length > 0) {
    productStore.searchProductVariants(query).then(results => {
      console.log("results", results);
      variantSuggestions.value = results;
    });
  } else {
    variantSuggestions.value = [];
  }
}

const onVariantInput = debounce(searchVariants, 300);

function addVariant(event: { value: VariantItem }) {
  if (!props.product.variantProducts.some(p => p.product_id === event.value.product_id)) {
    props.product.variantProducts.push(event.value);
  }
  // Reset the autocomplete
  showVariantAutocomplete.value = false;
  nextTick(() => {
    showVariantAutocomplete.value = true;
    nextTick(() => {
      const input = document.querySelector('.variant-autocomplete > .p-autocomplete-input');
      if (input instanceof HTMLElement) {
        input.focus();
      }
    });
  });
}

onUpdated(() => {
 console.log("Variant Products:", props.product.variantProducts);
});

function removeVariant(idx: number) {
  props.product.variantProducts.splice(idx, 1);
}

const updateVariant = (e: any) => {
  console.log(e);
}
</script>

<template>
    <div class="flex flex-col md:flex-row gap-2">
      <div class="loading-overlay" v-if="fb.loading['product.show']">
        <div class="flex justify-center items-center h-full spinner">
        <i class="pi pi-spin pi-spinner" style="font-size: 2rem;"></i>
        <p class="mt-2">Loading product variants data. Please wait.</p>
      </div>
    </div>
      <!-- Left Column -->
      <div class="md:w-2/3 w-full bg-white rounded-xl shadow p-6 flex flex-col gap-6 border border-gray-200" v-if="!fb.loading['product.show']">
        <!-- Add Variant Button and Autocomplete -->
        <div>
          <div class="flex items-center justify-between w-full">
            <h3 class="font-medium text-lg">Product Variants</h3>
            <Button label="Add" icon="pi pi-plus" class="p-button-text" @click="initiateVariantAutocomplete" />
          </div>
          <AutoComplete
              ref="variantAutocomplete"
              :suggestions="variantSuggestions"
              @input="onVariantInput"
              @item-select="addVariant"
              optionLabel="name"
              placeholder="Type for autocomplete"
              class="w-full variant-autocomplete pb-2"
              inputClass="w-full !rounded-md !border !border-gray-200 !shadow-none !focus:ring-0"
              v-if="showVariantAutocomplete"
          />
        </div>

        <DataTable
          :value="product.variantProducts"
          paginator
          showGridlines
          :rows="10"
          dataKey="product_id"
          :loading="fb.loading['product.variants']"
          v-model:editingRows="editingRows"
          editMode="row"
          @row-edit-save="updateVariant"
        >
          <Column
            v-for="col of productVariantColumns"
            :key="col.field"
            :field="col.field"
            :header="col.header"
          >
            <template #body="slotProps">
              <div v-if="col.type === 'text'">
                {{ slotProps.data[col.field] }}
              </div>
              <div v-else>
                {{ slotProps.data[col.field] }}
              </div>
            </template>
            <template #editor="slotProps">
              <input
                v-if="col.type === 'text'"
                v-model="slotProps.data[col.field]"
                type="text"
                class="w-full"
              />
              <input
                v-else-if="col.type === 'color'"
                v-model="slotProps.data[col.field]"
                type="color"
                class="w-full"
              />
              <input
                v-else-if="col.type === 'checkbox'"
                v-model="slotProps.data[col.field]"
                type="checkbox"
                class="w-full"
              />
              <input
                v-else-if="col.type === 'number'"
                v-model="slotProps.data[col.field]"
                type="number"
                class="w-full"
              />
              <input
                v-else-if="col.type === 'date'"
                v-model="slotProps.data[col.field]"
                type="date"
                class="w-full"
              />
              <input v-else v-model="slotProps.data[col.field]" type="text" class="w-full" />
            </template>
          </Column>
          <Column
            header="Actions"
            :rowEditor="true"
            style="width: 10%; min-width: 8rem"
            bodyStyle="text-align:center"
          ></Column>
        </DataTable>
      </div>
      <!-- Right Column -->
      <ProductSidebar :product="product" />
    </div>
</template>

<style scoped>
:deep(.p-autocomplete-input) {
  width: 100% !important;
  border-radius: 0 !important;
  border: none !important;
  border-bottom: 1px solid #e5e7eb !important;
  box-shadow: none !important;
}
</style>