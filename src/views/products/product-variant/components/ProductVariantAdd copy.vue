<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useVariantStore } from '@/stores/variant';

// Imports for Variant start here 
import { nextTick, ref, computed } from 'vue';
import Product, { ProductOption, ProductOptionGroup, ProductVariant } from '@/models/Product.ts';
import { useProductStore } from '@/stores/product';
import { useProductOptionGroupStore } from '@/stores/productOptionGroup';

import { useToast } from 'primevue/usetoast';
import VariantForm from '@/views/products/components/variant-option/VariantForm.vue';
import OptionGroupForm from '@/views/products/components/variant-option/OptionGroupForm.vue';
import OptionGroupList from '@/views/products/components/variant-option/OptionGroupList.vue';
// Imports for Variant end here 

const emit = defineEmits(['update:variant', 'saved', 'editTabUnmunted', 'editTabMounted', 'update:product']);
const router = useRouter();
const route = useRoute();
const productOptionGroupStore = useProductOptionGroupStore();
// const { variant, products } = storeToRefs(variantStore);

const toast = useToast();
const productStore = useProductStore();
const { fb, productOptionGroups, productVariants } = storeToRefs(productStore);
const productId = ref<number | null>(null);

const productVariantsArray = computed(() => {
  const pv = productVariants.value;
  if (Array.isArray(pv)) return pv;
  if (pv) return [pv];
  return [];
});

const productSuggestions = ref<any[]>([]);
const showOptionGroupCard = ref(false);
const showVariantCard = ref(false);
const variantObjects = ref<ProductVariant[]>([]);
const optionGroupsHeadingRef = ref<HTMLElement | null>(null);
const productVariantSuggestions = ref<any[]>([]);
const optionGroup = ref<ProductOptionGroup>(new ProductOptionGroup({}));
const optionGroupSuggestions = ref<ProductOptionGroup[]>([]);
const optionSuggestions = ref<any[]>([]);
let selectedVariant = ref<ProductVariant | null>(null);

const variant = ref<ProductVariant | null>(null);
selectedVariant.value = variant.value;
// selectedVariant.value.selected = true;

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

const handleSaveOptionGroup = async (group: ProductOptionGroup) => {
  //   const updatedGroup = await productStore.updateProductOptionGroup(group);
  //   let index = selectedVariant.value?.productOptionGroups?.findIndex((g: ProductOptionGroup) => g.product_option_group_id === group.product_option_group_id);
  //   if (index !== -1 && index !== undefined) {
  //     if(selectedVariant.value) {
  //       selectedVariant.value.productOptionGroups[index] = new ProductOptionGroup(updatedGroup);
  //     }
  //   }
}

const searchVariants = async (event: any) => {
  if (variant.value?.product_id !== null && variant.value?.product_id !== undefined) {
    console.log("variant.value.product_id", variant.value.product_id);
    productVariantSuggestions.value = await productStore.listProductVariants(event, variant.value.product_id);
  } else {
    productVariantSuggestions.value = [];
  }
}

const searchOptionGroups = async (event: any) => {
  if (selectedVariant.value?.product_variant_id) {
    const data = await productStore.listProductOptionGroups(event, selectedVariant.value?.product_variant_id);
    optionGroupSuggestions.value = data;
  } else {
    optionGroupSuggestions.value = [];
  }
}

const searchOptions = async (data: { event: any, optionGroupId: number }) => {
  const { event, optionGroupId } = data;
  if (optionGroupId !== undefined && optionGroupId !== null) {
    optionSuggestions.value = await productStore.listProductOptions(event, optionGroupId);
  } else {
    optionSuggestions.value = [];
  }
}

const handleSaveVariant = async (data: any) => {
  try {
    let response: any = null;
    response = await productStore.createProductVariant(data);
    console.log("response", response);
    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Variant created successfully',
      life: 3000
    });
    router.push('/ecommerce/products-variants/edit/' + (response.product_variant_id as string));
  } catch (error) {
    console.error('Error saving variant:', error);
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'An error occurred while saving the variant.',
      life: 5000
    });
  }
}

const handleAddVariant = async (data: any) => {
  selectedVariant.value = new ProductVariant(data);
  variantObjects.value.forEach((variant: ProductVariant) => {
    variant.selected = false;
  });
  selectedVariant.value.selected = true;
  selectedVariant.value.product_id = productId.value as number;
}

const handleAddOptionGroup = async (data: any) => {
  const group = new ProductOptionGroup(data.value);
  // Check if a variant with the same option group name already exists for this variant
  const existingGroup = selectedVariant.value?.productOptionGroups.find(
    (g: ProductOptionGroup) => g.option_group_name.trim().toLowerCase() === group.option_group_name.trim().toLowerCase()
  );
  if (existingGroup) {
    toast.add({
      severity: 'warn',
      summary: 'Duplicate Option Group',
      detail: `An option group named "${group.option_group_name}" already exists for this variant.`,
      life: 4000
    });
    return;
  }
  if (data.index !== undefined && data.index !== null && data.index > -1) {
    if (selectedVariant.value) {
      selectedVariant.value.productOptionGroups[data.index] = group;
    }
  } else {
    group.active = true;
    selectedVariant.value?.productOptionGroups.push(group);
    showOptionGroupCard.value = false;
    // Smooth scroll to the newly added/activated option group
    await nextTick();
    if (optionGroupsHeadingRef.value) {
      // Scroll the main heading into view first
      optionGroupsHeadingRef.value.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    // Then, try scrolling to the active group panel if it exists
    // Look for active group DOM node by index (last in array is the new one)
    const idx = selectedVariant.value?.productOptionGroups.length
      ? selectedVariant.value.productOptionGroups.length - 1
      : null;
    if (idx !== null) {
      // Try finding the accordion panel for the group - Panel index == idx by v-for
      // class name from OptionGroupList.vue: ".product-option-panel"
      // Add a small delay to let any transition finish
      setTimeout(() => {
        const panels = document.querySelectorAll('.product-option-panel');
        if (panels && panels[idx]) {
          (panels[idx] as HTMLElement).scrollIntoView({ behavior: 'smooth', block: 'center' });
          // Optionally, focus header for accessibility
          const header = panels[idx].querySelector('.product-option-header');
          if (header) (header as HTMLElement).focus?.({ preventScroll: true });
        }
      }, 350); // matches opening transition duration
    }
  }
}

const handleAddOption = async (data: any) => {
  const option = new ProductOption(data);
  const groupIndex = selectedVariant.value?.productOptionGroups.findIndex(g => g.product_option_group_id === option.product_option_group_id);
  if (groupIndex !== undefined && groupIndex !== null && groupIndex > -1) {
    const existingOption = selectedVariant.value?.productOptionGroups[groupIndex].productOptions.find(
      (g: any) => g.option_name.trim().toLowerCase() === option.option_name.trim().toLowerCase()
    );
    if (existingOption) {
      toast.add({
        severity: 'warn',
        summary: 'Duplicate Option',
        detail: `An option named "${option.option_name}" already exists for this group.`,
        life: 4000
      });
      return;
    }
  }

  if (data.index !== undefined && data.index !== null && data.index > -1) {
    if (groupIndex !== undefined && selectedVariant?.value?.productOptionGroups?.[groupIndex]?.productOptions?.[data.index]) {
      selectedVariant.value.productOptionGroups[groupIndex].productOptions[data.index] = option;
    }
  } else {
    if (groupIndex !== undefined && selectedVariant?.value?.productOptionGroups?.[groupIndex]?.productOptions) {
      option.active = true;
      selectedVariant.value.productOptionGroups[groupIndex].productOptions.push(option);
    }
    // Smooth scroll to the newly added/activated option
    await nextTick();
    setTimeout(() => {
      const panels = document.querySelectorAll('.product-option-panel');
      if (panels && panels.length > 0) {
        (panels[panels.length - 1] as HTMLElement).scrollIntoView({ behavior: 'smooth', block: 'center' });
        // Optionally, focus header for accessibility
        const header = panels[panels.length - 1].querySelector('.product-option-header');
        if (header) (header as HTMLElement).focus?.({ preventScroll: true });
      }
    }, 350); // matches opening transition duration
  }
}

const handleDeleteOption = async (data: any) => {
  const option = new ProductOption(data);
  const groupIndex = selectedVariant.value?.productOptionGroups.findIndex(g => g.product_option_group_id === option.product_option_group_id);
  if (groupIndex !== undefined && groupIndex !== null && groupIndex > -1) {
    if (selectedVariant.value) {
      selectedVariant.value.productOptionGroups[groupIndex].productOptions =
        selectedVariant.value.productOptionGroups[groupIndex].productOptions.filter((o: ProductOption) => o.product_option_id !== option.product_option_id);
    }
  }
}

const handleDeleteOptionGroup = async (data: any) => {
  const group = new ProductOptionGroup(data);
  if (!group.product_option_group_id) return;

  try {
    // Delete from global option group store (API + local store)
    await productOptionGroupStore.deleteProductOptionGroup(group.product_option_group_id);

    // Remove association from the selected variant in-memory
    if (selectedVariant.value) {
      selectedVariant.value.productOptionGroups =
        selectedVariant.value.productOptionGroups.filter(g => g.product_option_group_id !== group.product_option_group_id);
    }

    toast.add({
      severity: 'success',
      summary: 'Deleted',
      detail: `Option group "${group.option_group_name}" removed.`,
      life: 3000
    });
  } catch (err) {
    console.error('Error deleting option group:', err);
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Could not delete option group. See console for details.',
      life: 5000
    });
  }
}

const searchProducts = async (event: any) => {
  const query = event.query?.toLowerCase();
  // console.log("query", query);
  if (query?.length > 0) {
    productStore.searchProducts(query).then(results => {
      // console.log("results", results);
      productSuggestions.value = results;
    });
  } else {
    productSuggestions.value = [];
  }
}

function addProduct(event: { value: any }) {
  if (selectedVariant.value) {
    productId.value = event.value.product_id;
    selectedVariant.value.product_id = event.value.product_id;
    selectedVariant.value.product_code = event.value.product_code;
  }
}

const handleSaveNewOptionGroup = async (group: ProductOptionGroup) => {
  // alert('handleSaveNewOptionGroup');
  if (selectedVariant.value) {
    selectedVariant.value.productOptionGroups.push(group);
  }
  console.log("selectedVariant", selectedVariant.value);
}

onUnmounted(() => {
  emit('editTabUnmunted');
});

onMounted(async () => {
  emit('editTabMounted');
  variant.value = new ProductVariant(await productStore.getVariantById(route.params.id as string));
  selectedVariant.value = variant.value;
});
</script>

<template>
  <!-- error messages -->
  <div class="flex flex-col gap-2">
    <Message v-if="fb.errors?.['product.variant.create']" severity="error" size="small">
      <div class="flex flex-col gap-2 w-full pb-3">
        <span v-for="error in fb.errors?.['product.variant.create']" :key="error"
          class="bg-red-50 border-l-4 border-red-500 text-red-700 p-3 rounded-md shadow-sm">
          {{ error }}
        </span>
      </div>
    </Message>
  </div>
  <div class="flex flex-col md:flex-row gap-2">
    <div class="loading-overlay border-2" v-if="fb.loading['product.show']">
      <div class="flex justify-center items-center h-full spinner">
        <i class="pi pi-spin pi-spinner" style="font-size: 2rem;"></i>
        <p class="mt-2">Loading product productOptions data. Please wait.</p>
      </div>
    </div>
    <!-- Left Column -->
    <div
      class="w-full sm:w-full md:w-full lg:w-full xl:w-1/2 bg-white rounded-xl shadow lg:p-6 flex flex-col gap-6 border border-gray-200"
      v-if="!fb.loading['product.show']">
      <VariantForm v-show="true" :productVariants="productVariantsArray" :showFields="true"
        :productSuggestions="productSuggestions" @searchProducts="searchProducts($event)"
        @add:product="addProduct($event)" :productVariantSuggestions="productVariantSuggestions"
        :variant="selectedVariant ?? new ProductVariant({})" @searchVariant=searchVariants
        @add:variant="handleAddVariant" @submit="(data) => handleSaveVariant(data)" />
    </div>

    <!-- Right column -->
    <div ref="optionGroupsHeadingRef"
      class="w-full sm:w-full md:w-full lg:w-full xl:w-1/2 bg-white rounded-xl shadow lg:p-6 border border-gray-200 flex flex-col gap-6">

      <div class="border-2 p-3">
        <div class="flex items-center justify-between w-full">
          <h3 class="font-medium text-lg focus:outline-none" tabindex="-1">
            Options
          </h3>
          <Button :icon="showOptionGroupCard ? 'pi pi-minus' : 'pi pi-plus'" label="Add Group" severity="secondary"
            rounded @click="toggleOptionGroup" />
        </div>
      </div>

      <OptionGroupForm v-show="showOptionGroupCard" :optionGroupData="productOptionGroups" :optionGroup="optionGroup"
        :showFields="true" @save:newOptionGroup="handleSaveNewOptionGroup($event)"
        :optionGroupSuggestions="optionGroupSuggestions" :optionSuggestions="optionSuggestions" :showOptionList="true"
        @searchOptionGroups="searchOptionGroups($event)" @add:optionGroup="handleAddOptionGroup"
        @searchOptions="searchOptions($event)" @add:option="handleAddOption" @delete:option="handleDeleteOption" />
      <!-- <OptionGroupList :selectedVariant="selectedVariant" /> -->
      <OptionGroupList :variant="selectedVariant ?? new ProductVariant({})"
        :optionGroupSuggestions="optionGroupSuggestions" :optionSuggestions="optionSuggestions"
        @add:optionGroup="handleAddOptionGroup" @save="handleSaveOptionGroup($event)"
        @searchOptionGroups="searchOptionGroups($event)" @searchOptions="searchOptions($event)"
        @add:option="handleAddOption" @delete:option="handleDeleteOption"
        @delete:optionGroup="handleDeleteOptionGroup" />

    </div>
  </div>
</template>