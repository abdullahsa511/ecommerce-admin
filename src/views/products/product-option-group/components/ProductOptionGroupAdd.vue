<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useProductOptionGroupStore } from '@/stores/productOptionGroup';
import { ProductOptionGroup, ProductVariant, ProductOption } from '@/models/Product.ts';
import { useProductStore } from '@/stores/product';

import OptionGroupForm from '@/views/products/components/variant-option/OptionGroupForm.vue';
import { useToast } from 'primevue';


const emit = defineEmits(['update:variant', 'saved', 'editTabUnmunted', 'editTabMounted', 'update:product']);

const route = useRoute();
const toast = useToast();



const productOptionGroupStore = useProductOptionGroupStore();
const { productOptionGroup } = storeToRefs(productOptionGroupStore);

const productStore = useProductStore();
const { fb, productOptionGroups } = storeToRefs(productStore);

const showOptionGroupCard = ref(false);
const optionGroupsHeadingRef = ref<HTMLElement | null>(null);
const optionGroupSuggestions = ref<ProductOptionGroup[]>([]);
const optionSuggestions = ref<any[]>([]);
const productVariantSuggestions = ref<any[]>([]);
const productSuggestions = ref<any[]>([]);



function toggleOptionGroup() {
  showOptionGroupCard.value = !showOptionGroupCard.value;
}

const uploadMainImage = async (event: any, property: ProductVariant) => {
  // // alert('uploadMainImage');
  // try {
  //     // const response: any = await mediaStore.uploadFiles(event.files, property);
  //     let productId = props.product.product_id ? props.product.product_id : 0; // 0 is for new products
  //     const response: any = await productStore.uploadProductImages(event.files, property, productId);
  //     props.product[property] = response.files;
  // } catch (error) {
  //     console.error('Error uploading site logo:', error);
  // }
}

const deleteMainImage = async (file: any, property: ProductVariant) => {
  // try {
  //     await mediaStore.deleteImageByFilePath(file.objectURL, property);
  //     props.product[property] = [];
  //     toast.add({
  //         severity: 'success',
  //         summary: 'Success',
  //         detail: 'Image deleted successfully',
  //         life: 3000
  //     });
  // } catch (error) {
  //     console.error('Error deleting site logo:', error);
  // }
}

const searchOptionGroups = async (event: any) => {
  const data = await productStore.listProductOptionGroups(event, productOptionGroup.value?.product_option_group_id);
  optionGroupSuggestions.value = data;
}

const searchOptions = async (data: { event: any, optionGroupId: number }) => {
  const { event, optionGroupId } = data;
  if (optionGroupId !== undefined && optionGroupId !== null) {
    optionSuggestions.value = await productStore.listProductOptions(event, optionGroupId);
  } else {
    optionSuggestions.value = [];
  }
}

const handleAddOptionGroup = async (data: any) => {
  productOptionGroup.value = new ProductOptionGroup(data.value);
}


const handleAddOption = async (data: any) => {
  console.log('handleAddOption add form', data);

}

const handleDeleteOption = async (data: any) => {
  if (
    productOptionGroup.value &&
    Array.isArray(productOptionGroup.value.productOptions)
  ) {
    const filtered = productOptionGroup.value.productOptions.filter(
      (o: ProductOption) => o.product_option_id !== data.product_option_id
    );
    productOptionGroup.value.productOptions = filtered.map(opt => new ProductOption(opt));
  }

}

const handleNewOptionSave = async (data: any) => {
  productOptionGroup.value.productOptions.push(new ProductOption(data));
}

const updateExpandedRowOption = async (data: any) => {
  productOptionGroup.value.productOptions.push(new ProductOption(data));

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
  productOptionGroup.value.product_id = event.value.product_id as number;
  console.log("addProduct", productOptionGroup.value);
}

const searchVariants = async (event: any) => {
  if(productOptionGroup.value.product_id !== null && productOptionGroup.value.product_id !== undefined) {
    console.log("productOptionGroup.value.product_id", productOptionGroup.value.product_id);
    productVariantSuggestions.value = await productStore.listProductVariants(event, productOptionGroup.value.product_id);
  } else {
    productVariantSuggestions.value = [];
  }
}

const handleAddVariant = async (data: any) => {
  console.log("handleAddVariant id ", data.product_variant_id);
  productOptionGroup.value.product_variant_id = data.product_variant_id as number;
}



onMounted(async () => {
  emit('editTabMounted');
  productOptionGroupStore.resetProductOptionGroup();
});

onUnmounted(() => {
  emit('editTabUnmunted');
});


</script>

<template>
  <div class="flex flex-col md:flex-row gap-2">
    <div class="loading-overlay border-2" v-if="fb.loading['product.show']">
      <div class="flex justify-center items-center h-full spinner">
        <i class="pi pi-spin pi-spinner" style="font-size: 2rem;"></i>
        <p class="mt-2">Loading product productOptions data. Please wait.</p>
      </div>
    </div>
    <!-- Right column -->
    <div ref="optionGroupsHeadingRef" class="w-full sm:w-full md:w-full lg:w-full bg-white rounded-xl shadow lg:p-6 border border-gray-200 flex flex-col gap-6">
      <div class="border-2 p-3">
        <div class="flex items-center justify-between w-full">
          <h3 class="font-medium text-lg focus:outline-none" tabindex="-1"> Add Product Option Group</h3>
          <!-- <Button :icon="showOptionGroupCard ? 'pi pi-minus' : 'pi pi-plus'" label="Add Group" severity="secondary"
            rounded @click="toggleOptionGroup" /> -->
        </div>
      </div>

      <OptionGroupForm 
        v-show="true" 
        :showHiddenButton="false"
        :showFields="true"
        :optionGroupData="productOptionGroups" 
        :optionGroup="productOptionGroup"
        :optionGroupSuggestions="optionGroupSuggestions" 
        :optionSuggestions="optionSuggestions"
        :productSuggestions="productSuggestions"
        :productVariantSuggestions="productVariantSuggestions"
        @add:product="addProduct"
        @searchProducts="searchProducts"
        @searchVariant="searchVariants"
        @add:variant="handleAddVariant"
        @searchOptionGroups="searchOptionGroups($event)" 
        @add:optionGroup="handleAddOptionGroup"
        @searchOptions="searchOptions($event)" 
        @add:option="handleAddOption" 
        @delete:option="handleDeleteOption" 
        @newOption:save="handleNewOptionSave"
        @updateExpandedRowOption:update="updateExpandedRowOption"
      />
    </div>
  </div>
</template>
