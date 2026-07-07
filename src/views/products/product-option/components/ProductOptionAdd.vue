<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useProductOptionStore } from '@/stores/productOption';
import OptionForm from '../../components/variant-option/OptionForm.vue';
import { useProductStore } from '@/stores/product';



const emit = defineEmits(['update:productOption', 'saved', 'editTabUnmunted', 'editTabMounted']);

const productVariantSuggestions = ref<any[]>([]);
const productSuggestions = ref<any[]>([]);
  const optionGroupSuggestions = ref<any[]>([]);


const route = useRoute();
const productStore = useProductStore();
const ProductOptionStore = useProductOptionStore();
const { productOption, fb } = storeToRefs(ProductOptionStore);


const optionSuggestions = ref<any[]>([]);

const handleSave = async (data: any) => {
    console.log(data);
}

const handleAddOption = async (data: any) => {
   console.log(data);
}



const searchProducts = async (event: any) => {
  const query = event.query?.toLowerCase();
  if (query?.length > 0) {
    productStore.searchProducts(query).then(results => {
      productSuggestions.value = results;
    });
  } else {
    productSuggestions.value = [];
  }
}
function addProduct(event: { value: any }) {
  productOption.value.product_id = event.value.product_id as number;
  // console.log("addProduct", productOptionGroup.value);
}

const searchVariants = async (event: any) => {
  if(productOption.value.product_id !== null && productOption.value.product_id !== undefined) {
    console.log("productOption.value.product_id", productOption.value.product_id);
    productVariantSuggestions.value = await productStore.listProductVariants(event, productOption.value.product_id);
  } else {
    productVariantSuggestions.value = [];
  }
}

const handleAddVariant = async (data: any) => {
  productOption.value.product_variant_id = data.product_variant_id as number;
}

const searchOptionGroups = async (event: any) => {
  const data = await productStore.listProductOptionGroups(event, productOption.value?.product_id);
  // Correction: Define optionGroupSuggestions before using it
 
  optionGroupSuggestions.value = data;
}

const handleAddOptionGroup = async (data: any) => {
  // productOptionGroup.value = new ProductOptionGroup(data.value);
}





onMounted(async () => {
  emit('editTabMounted');
  if (route.params.id) {
    await ProductOptionStore.getProductOptionById(route.params.id as string);
  }
});

onUnmounted(() => {
  emit('editTabUnmunted');
});

</script>

<template>
  <div class="flex flex-col gap-6">
    <!-- Global Unique Key Error -->
    <Message v-if="fb.errors?.['productOption.update.' + productOption.product_option_id]?.global_message" severity="error" size="small">
      <div class="flex flex-col gap-2 w-full pb-3">
        <span v-for="error in fb.errors?.['productOption.update.' + productOption.product_option_id]?.global_message" :key="error"
          class="bg-red-50 border-l-4 border-red-500 text-red-700 p-3 rounded-md shadow-sm">
          {{ error }}
        </span>
      </div>
    </Message>

    <div class="flex flex-col md:flex-row gap-6">
      <!-- Left column: Option Form -->
      <div class="sm:w-full ">
        <h3 class="text-lg font-medium border-b border-gray-200 pb-2">Edit Option</h3>

        <OptionForm
            :showHiddenButton="false"
            :showFields="true"
            :option="productOption"
            :optionSuggestions="optionSuggestions"
            @add:option="handleAddOption($event)"
            @save="handleSave"

            :productSuggestions="productSuggestions"
            :productVariantSuggestions="productVariantSuggestions"
            @add:product="addProduct"
            @searchProducts="searchProducts"
            @searchVariant="searchVariants"
            @add:variant="handleAddVariant"
            @searchOptionGroups="searchOptionGroups($event)" 
            @add:optionGroup="handleAddOptionGroup"
        />
  
      </div>
    </div>


    <div class="loading-overlay" v-if="fb.loading['productOption.show.' + route.params.id]">
      <div class="flex justify-center items-center h-full spinner">
        <i class="pi pi-spin pi-spinner" style="font-size: 2rem;"></i>
        <p class="mt-2">Loading product option...</p>
      </div>
    </div>

  </div>
</template>
