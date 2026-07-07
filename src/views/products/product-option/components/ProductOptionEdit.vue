<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useProductOptionStore } from '@/stores/productOption';
import { useProductStore } from '@/stores/product';
import { ProductOption } from '@/models/Product.ts';
import OptionForm from '../../components/variant-option/OptionForm.vue';

const emit = defineEmits(['update:productOption', 'saved', 'editTabUnmunted', 'editTabMounted']);



const route = useRoute();
const productStore = useProductStore();
const ProductOptionStore = useProductOptionStore();
const { productOption, fb } = storeToRefs(ProductOptionStore);


//Product Option code start here 

const selectedOption = ref<ProductOption>(new ProductOption({}));

const optionSuggestions = ref<any[]>([]);

const searchOptions = async (data: {event: any, optionGroupId: number}) => {
  const { event, optionGroupId } = data;
  if (optionGroupId !== undefined && optionGroupId !== null) {
    optionSuggestions.value = await productStore.listProductOptions(event, optionGroupId);
  }else{
    optionSuggestions.value = [];
  }
}

const handleSave = async (data: any) => {
    console.log(data);
}


const handleAddOption = async (data: any) => {
   console.log(data);
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
            :option="productOption"
            :optionSuggestions="optionSuggestions"
            @searchOptions="searchOptions($event)"
            @add:option="handleAddOption($event)"
            @save="handleSave"
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
