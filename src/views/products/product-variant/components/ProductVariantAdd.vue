<script setup lang="ts">
import { nextTick, ref, onMounted, onUnmounted } from 'vue';
import { ProductOption, ProductOptionGroup, ProductVariant } from '@/models/Product.ts';
import { useProductStore } from '@/stores/product';
import { storeToRefs } from 'pinia';
import { useToast } from 'primevue/usetoast';
import VariantForm from '@/views/products/components/variant-option/VariantForm.vue';
// import Variant from '@/views/products/components/variant-option/Variant.vue';
import OptionGroupForm from '@/views/products/components/variant-option/OptionGroupForm.vue';
import OptionGroupList from '@/views/products/components/variant-option/OptionGroupList.vue';
import { useRouter } from 'vue-router';
import { useVariantStore } from '@/stores/variant';
const variantStore = useVariantStore();
const emit = defineEmits(['update:product', 'editTabUnmunted', 'editTabMounted', 'saved']);

const toast = useToast();
const productStore = useProductStore();
const { fb, product, productVariants, productOptionGroups } = storeToRefs(productStore);
const router = useRouter();
const productSuggestions = ref<any[]>([]);
const showOptionGroupCard = ref(false);
const showVariantCard = ref(false);
const optionGroupsHeadingRef = ref<HTMLElement | null>(null);
const productVariantSuggestions = ref<any[]>([]);
const optionGroup = ref<ProductOptionGroup>(new ProductOptionGroup({ product_id: product.value.product_id as number }));
const optionGroupSuggestions = ref<ProductOptionGroup[]>([]);
const optionSuggestions = ref<any[]>([]);
const typeSuggestions = ref<any[]>([]);
let selectedVariant = ref<ProductVariant>(new ProductVariant({}));
const productId = ref<number | null>(null);

selectedVariant.value = new ProductVariant({});


function toggleVariantForm($event: any) {
  showVariantCard.value = !showVariantCard.value;
  productVariants.value.forEach((variant: ProductVariant) => {
    variant.selected = false;
  });
  selectedVariant.value = new ProductVariant({});

}

function toggleVariant(item: any) {
  item.selected = true;
  selectedVariant.value = item;
  const index = productVariants.value.findIndex((variant: ProductVariant) => variant.product_variant_id === item.product_variant_id);
  productVariants.value[index].selected = true;
  scrollToOptionGroupsHeading();
}

const smoothScrollTo = async (panelClass: string, headerClass: string) => {
  await nextTick();
  setTimeout(() => {
    const panels = document.querySelectorAll(`.${panelClass}`);
    if (panels && panels.length > 0) {
      (panels[panels.length - 1] as HTMLElement).scrollIntoView({ behavior: 'smooth', block: 'center' });
      // Optionally, focus header for accessibility
      const header = panels[panels.length - 1].querySelector(`.${headerClass}`);
      if (header) (header as HTMLElement).focus?.({ preventScroll: true });
    }
  }, 350);
}

const handleDeleteVariant = async (data: any) => {
  const variant = new ProductVariant(data);
  productStore.deleteProductVariant(variant.product_variant_id);
  // selectedVariant.value = productVariants.value[0];
  optionGroup.value = new ProductOptionGroup({ product_id: product.value.product_id as number });
}

function toggleOptionGroup() {
  showOptionGroupCard.value = !showOptionGroupCard.value;
  selectedVariant.value?.productOptionGroups.forEach((g: ProductOptionGroup) => {
    g.active = false;
  });
  optionGroup.value = new ProductOptionGroup({ product_id: product.value.product_id as number });
  optionGroup.value.active = true;
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

const searchVariants = async (event: any) => {
  if (product.value.product_id !== null && product.value.product_id !== undefined) {
    productVariantSuggestions.value = await productStore.listProductVariants(event, product.value.product_id);
  } else {
    productVariantSuggestions.value = [];
  }
}

const searchOptionGroups = async (event: any, variant: ProductVariant) => {
  if (variant.product_variant_id) {
    const data = await productStore.listProductOptionGroups(event, variant.product_variant_id);
    optionGroupSuggestions.value = data;
  } else {
    optionGroupSuggestions.value = [];
  }
}

const searchOptions = async (data: { event: any, productId: number }) => {
  const { event, productId } = data;
  if (productId !== undefined && productId !== null) {
    optionSuggestions.value = await productStore.listProductOptions(event, productId);
  } else {
    optionSuggestions.value = [];
  }
}
const searchTypes = async (query: string) => {
  typeSuggestions.value = await productStore.listTypes(query);
}

const handleInsertVariant = async (variant: ProductVariant) => {
  console.log('handleInsertVariant', variant);
}

const handleSaveVariant = async (data: any) => {
  const checkExistingVariant = productVariants.value.find(variant => variant.variant_name === data.variant_name);
  if (checkExistingVariant) {
    toast.add({
      severity: 'warn',
      summary: 'Duplicate Variant',
      detail: `A variant with the same name "${data.variant_name}" already exists.`,
      life: 3000
    });
    return;
  }

  try {
    let response: any = null;
    data.product_id = productId.value as number;
    console.log('data', data);
    response = await productStore.createProductVariant(data);
    if (response) {
      router.push('/ecommerce/products-variants/edit/' + (response[0]?.product_variant_id as string));
      toast.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Variant created successfully',
        life: 3000
      });
    } else {
      // show error toast
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: 'An error occurred while saving the variant.',
        life: 5000
      });
    }
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

const handleUpdateVariant = async (data: any) => {
  try {
    await productStore.updateProductVariant(data);
    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Variant updated successfully',
      life: 3000
    });
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
  console.log('handleAddVariant form', data);
  selectedVariant.value = new ProductVariant(data);
  productVariants.value.forEach((variant: ProductVariant) => {
    variant.selected = false;
  });
  selectedVariant.value.selected = true;
  selectedVariant.value.isNew = true;
  selectedVariant.value.product_id = productId.value as number;
}

const handleAddOptionGroup = async (data: any) => {
  optionGroup.value = new ProductOptionGroup(data.value);
  // Check if a variant with the same option group name already exists for this variant
  const existingGroup = selectedVariant.value?.productOptionGroups.find(
    (g: ProductOptionGroup) => g.option_group_name.trim().toLowerCase() === optionGroup.value.option_group_name.trim().toLowerCase()
  );

  if (existingGroup) {
    fb.value.showToast({ warning: `An option group named "${optionGroup.value.option_group_name}" already exists for this variant.` }, toast);
  }
  selectedVariant.value?.productOptionGroups.forEach((g: ProductOptionGroup) => {
    g.active = false;
  });
  if (!data.index) {
    optionGroup.value.isNew = true;
    optionGroup.value.product_option_group_id = "_new_" + (selectedVariant.value?.productOptionGroups.length);
  }
  optionGroup.value.active = true;
  selectedVariant.value?.productOptionGroups.push(optionGroup.value);
  console.log('handleAddOptionGroup', selectedVariant.value?.productOptionGroups);

  //Smooth scroll to the newly added/activated option group
  const idx = selectedVariant.value?.productOptionGroups.length
    ? selectedVariant.value?.productOptionGroups.length - 1
    : null;
  if (idx !== null) {
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
  showOptionGroupCard.value = false;

}

const handleInsertOptionGroup = async (group: ProductOptionGroup) => {
  console.log('handleInsertOptionGroup', group);
  selectedVariant.value.productOptionGroups.push(group);
  selectedVariant.value.product_id = product.value.product_id as number;
  //Call backend variant update api
  await productStore.createProductVariant(selectedVariant.value);
  optionGroup.value = new ProductOptionGroup({});
  selectedVariant.value = productVariants.value.find(variant => variant.variant_name === group.variant_name);
  showOptionGroupCard.value = false;
  showVariantCard.value = false;
}

const handleUpdateOptionGroup = async (group: ProductOptionGroup) => {
  console.log('handleUpdateOptionGroup', group);
  const groupIndex = selectedVariant.value?.productOptionGroups.findIndex(g => g.product_option_group_id === group.product_option_group_id);
  if (groupIndex !== undefined && groupIndex !== null && groupIndex > -1) {
    if (selectedVariant.value) {
      selectedVariant.value.productOptionGroups[groupIndex] = group;
    }
  }

  //Call backend variant update api
  // await productStore.updateProductVariant(selectedVariant.value);
  optionGroup.value = new ProductOptionGroup({});

  //Smooth scroll to the newly added/activated option group
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

const handleDeleteOptionGroup = async (data: any, variant: ProductVariant) => {
  const group = new ProductOptionGroup(data);
  if (!group.product_option_group_id) return;

  try {
    if (variant) {
      variant.productOptionGroups =
        variant.productOptionGroups.filter((o: ProductOptionGroup) => o.product_option_group_id !== group.product_option_group_id);
      variant.productOptionGroups.forEach((o: ProductOptionGroup) => {
        o.active = false;
      });
    }
    // Delete from global option group store (API + local store)
    await productStore.deleteProductOptionGroup(group.product_option_group_id);

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

const handleAddOption = async (data: any) => {
  //Index property and groupIndex property
  const option = new ProductOption(data);
  const existingOption = selectedVariant.value?.productOptionGroups[data.groupIndex]?.productOptions?.find(
    (g: any) => g.option_name.trim().toLowerCase() === option.option_name.trim().toLowerCase()
  );
  if (existingOption) {
    toast.add({
      severity: 'warn',
      summary: 'Duplicate Option',
      detail: `An option named "${option.option_name}" already exists for this group.`,
      life: 4000
    });
  }
}

const handleInsertOption = async (data: any) => {
  const option = new ProductOption(data);

  // CHECK DUPLICATES
  const optionName = option.option_name.trim().toLowerCase();
  const groupId = option.product_option_group_id;
  const isNewGroup = optionGroup.value.isNew && groupId === optionGroup.value.product_option_group_id;
  let duplicate = false;

  if (isNewGroup) {
    // Check duplicate inside the new temporary group
    duplicate = optionGroup.value.productOptions.some(
      (g: ProductOption) => g.option_name.trim().toLowerCase() === optionName
    );
  } else {
    // Check duplicate inside existing variant’s groups
    const groupIndex = selectedVariant.value?.productOptionGroups.findIndex(
      g => g.product_option_group_id === groupId
    );

    if (groupIndex !== -1) {
      duplicate = selectedVariant.value.productOptionGroups[groupIndex].productOptions.some(
        (g: ProductOption) => g.option_name.trim().toLowerCase() === optionName
      );
    }
  }

  if (duplicate) {
    toast.add({
      severity: 'error',
      summary: 'Duplicate Option',
      detail: `Option added failed. An option named "${option.option_name}" already exists in this group.`,
      life: 10000
    });
    return false;
  }
  // END CHECK DUPLICATES

  if ((option.product_option_group_id === optionGroup.value.product_option_group_id) && optionGroup.value.isNew) {
    console.log('handleInsertOption if', option);
    optionGroup.value.productOptions.forEach((o: ProductOption) => {
      if (o.product_option_id === option.product_option_id) {
        o.active = false;
      }
    });
    // option.active = true;
    optionGroup.value.productOptions.push(option);
  } else {
    console.log('handleInsertOption else', option);
    const groupIndex = selectedVariant.value?.productOptionGroups.findIndex(g => g.product_option_group_id === option.product_option_group_id);

    if (groupIndex !== undefined && selectedVariant?.value?.productOptionGroups?.[groupIndex]?.productOptions) {
      // option.active = true;
      selectedVariant.value.productOptionGroups[groupIndex].productOptions.push(option);
    }
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

const handleUpdateOption = async (data: any) => {
  const option = new ProductOption(data);
  const groupIndex = selectedVariant.value?.productOptionGroups.findIndex(g => g.product_option_group_id === option.product_option_group_id);

  if (data.index !== undefined && data.index !== null && data.index > -1) {
    if (groupIndex !== undefined && selectedVariant?.value?.productOptionGroups?.[groupIndex]?.productOptions?.[data.index]) {
      selectedVariant.value.productOptionGroups[groupIndex].productOptions[data.index] = option;
    }
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

const handleDeleteOption = async (data: any, variant: ProductVariant) => {
  const option = new ProductOption(data);
  const groupIndex = variant.productOptionGroups.findIndex(g => g.product_option_group_id === option.product_option_group_id);
  if (groupIndex !== undefined && groupIndex !== null && groupIndex > -1) {
    if (variant) {
      variant.productOptionGroups[groupIndex].productOptions =
        variant.productOptionGroups[groupIndex].productOptions.filter((o: ProductOption) => o.product_option_id !== option.product_option_id);

      try {
        await productStore.deleteProductOption(data.product_option_id);
        fb.value.showToast({ success: 'Product option deleted successfully.' }, toast);
      } catch (error) {
        fb.value.showToast({ error: 'Failed to delete product option.' }, toast);
      }
    }
  }
}

const onSelectType = (event: any) => {
  const option = new ProductOption(event.option);
  const type = event.type;
  const index = event.index;
  option.type = type.type;
  option.type_id = type.type_id;
  const groupIndex = selectedVariant.value?.productOptionGroups.findIndex(g => g.product_option_group_id === option.product_option_group_id);
  if (groupIndex !== undefined && groupIndex !== null && groupIndex > -1) {
    if (selectedVariant.value && index) {
      selectedVariant.value.productOptionGroups[groupIndex].productOptions[index] = option;
    }
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
    productId.value = event.value.product_id as number;
    selectedVariant.value.product_id = event.value.product_id;
    // selectedVariant.value.product_code = event.value.product_code as string;
  }
  console.log('product Id.value', productId.value);
}

const scrollToOptionGroupsHeading = async () => {
  await nextTick();
  if (optionGroupsHeadingRef.value) {
    optionGroupsHeadingRef.value.scrollIntoView({ behavior: 'smooth', block: 'start' });
    optionGroupsHeadingRef.value.focus({ preventScroll: true });
  }
};

function resetAddPageState() {
  variantStore.resetVariants();
  productVariants.value = [];
  productOptionGroups.value = [];
  selectedVariant.value = new ProductVariant({});
  productId.value = null;
  showOptionGroupCard.value = false;
  showVariantCard.value = false;
  optionGroup.value = new ProductOptionGroup({
    product_id: (product.value?.product_id as number) ?? 0,
  });
}

onUnmounted(() => {
  emit('editTabUnmunted');
});

onMounted(() => {
  resetAddPageState();
  emit('editTabMounted');
});

/** Header Save in ProductVariant.vue delegates here */
async function submitFromParent() {
  await handleSaveVariant(selectedVariant.value);
}

defineExpose({ submitFromParent });

</script>
<template>
  <Message v-if="fb.errors?.['product.variant.update.' + selectedVariant?.product_variant_id]?.global_message
    || fb.errors?.['product.variant.create']?.global_message"
    class="br_content border-l-4 mb-5 w-full rounded-md shadow-sm">
    <span
      v-for="error in fb.errors?.['product.variant.update.' + selectedVariant?.product_variant_id]?.global_message || fb.errors?.['product.variant.create']?.global_message"
      :key="error" class="flex flex-col">
      {{ error }}
    </span>
  </Message>
  <!-- end global error messages -->
  <div class="flex flex-col md:flex-row gap-2">
    <div class="loading-overlay border-2" v-if="fb.loading['product.variants-options']">
      <div class="flex justify-center items-center h-full spinner">
        <i class="pi pi-spin pi-spinner" style="font-size: 2rem;"></i>
        <p class="mt-2">Loading product productOptions data. Please wait.</p>
      </div>
    </div>
    <!-- Left Column -->
    <div
      class="w-full sm:w-full md:w-full lg:w-full xl:w-1/2 bg-white rounded-xl shadow lg:p-6 flex flex-col gap-6 border border-gray-200"
      v-if="!fb.loading['product.show']">
      <div class="border-2 p-3">
        <div class="flex items-center justify-between w-full">
          <h3 class="font-medium text-lg">Variants</h3>
          <Button label="Add" :icon="showVariantCard ? 'pi pi-minus' : 'pi pi-plus'" severity="secondary" rounded
            @click="toggleVariantForm" />
        </div>
      </div>

      <VariantForm 
      v-show="true" 
      :fb="fb" 
      :showVariantFields="true" 
      :productSuggestions="productSuggestions"
      :productVariants="productVariants"
      :productVariantSuggestions="productVariantSuggestions" 
      :variant="selectedVariant" 
      :buttonLabel="'Save Variant'"
      @searchProducts="searchProducts($event)" 
      @add:product="addProduct($event)" 
      @searchVariant="searchVariants" 
      @add:variant="handleAddVariant" 
      @insert:variant="handleInsertVariant"
      @submit="(data) => handleSaveVariant(data)" 
      />

    </div>

    <!-- Right column -->
    <div ref="optionGroupsHeadingRef"
      class="w-full sm:w-full md:w-full lg:w-full xl:w-1/2 bg-white rounded-xl shadow lg:p-6 border border-gray-200 flex flex-col gap-6">
      <div class="border-2 p-3">
        <div class="flex items-center justify-between w-full">
          <h3 class="font-medium text-lg focus:outline-none" tabindex="-1">
            Variant: {{ selectedVariant?.variant_name }}
          </h3>
        </div>
      </div>
      <div class="border-2 p-3">
        <div class="flex items-center justify-between w-full">
          <h3 class="font-medium text-lg focus:outline-none" tabindex="-1">
            Options
          </h3>
          <Button :icon="showOptionGroupCard ? 'pi pi-minus' : 'pi pi-plus'" label="Add Group" severity="secondary"
            rounded @click="toggleOptionGroup" />
        </div>
      </div>

      <OptionGroupForm 
      v-show="showOptionGroupCard" 
      :optionGroupData="productOptionGroups" 
      :optionGroup="optionGroup"
      :optionGroupSuggestions="optionGroupSuggestions" 
      :optionSuggestions="optionSuggestions"
      :typeSuggestions="typeSuggestions" 
      :showOptionList="true" 
      :fb="fb" 
      :buttonLabel="'Save Option Group'"
      @searchOptionGroups="searchOptionGroups($event, selectedVariant)"
      @insert:optionGroup="handleInsertOptionGroup($event)"
      @add:optionGroup="handleAddOptionGroup($event)" 
      @update:optionGroup="handleUpdateOptionGroup" 
      @searchOptions="searchOptions($event)"
      @add:option="handleAddOption" 
      @insert:option="handleInsertOption" 
      @update:option="handleUpdateOption"
      @delete:option="handleDeleteOption($event, selectedVariant)" 
      @searchTypes="searchTypes($event)"
      @add:type="onSelectType($event)" 
      />

      <OptionGroupList 
      :variant="selectedVariant" 
      :fb="fb" 
      :buttonLabel="'Update Option Group'"
      :optionSuggestions="optionSuggestions"
      :typeSuggestions="typeSuggestions" 
      :optionGroupSuggestions="optionGroupSuggestions" 
      @add:optionGroup="handleAddOptionGroup"
      @insert:optionGroup="handleInsertOptionGroup($event)" 
      @update:optionGroup="handleUpdateOptionGroup"
      @update:variant="handleUpdateVariant" 
      @delete:optionGroup="handleDeleteOptionGroup($event, selectedVariant)"
      @searchOptionGroups="searchOptionGroups($event, selectedVariant)" 
      @searchOptions="searchOptions($event)"
      @add:option="handleAddOption" 
      @insert:option="handleInsertOption" 
      @update:option="handleUpdateOption"
      @delete:option="handleDeleteOption($event, selectedVariant)" 
      @searchTypes="searchTypes($event)"
      @add:type="onSelectType($event)" 
      />

    </div>
  </div>
</template>


<style>
.br_content {
  /* border: 1px solid #8b6161 !important; */
  padding: 2px !important;
  background-color: #f1d3d3 !important;
  color: #ff0000 !important;
  margin-bottom: 1rem !important;
}

/* Slide Down Animation */
.slide-down-enter-from {
  max-height: 0;
  opacity: 0;
}

.slide-down-enter-to {
  max-height: 1000px;
  opacity: 1;
}

.slide-down-leave-from {
  max-height: 1000px;
  opacity: 1;
}

.slide-down-leave-to {
  max-height: 0;
  opacity: 0;
}

.p-accordioncontent-content {
  padding: 1rem !important;
  border: none !important;
}

.p-accordioncontent-content>.optionGroup-form {
  border: none !important;
}
</style>