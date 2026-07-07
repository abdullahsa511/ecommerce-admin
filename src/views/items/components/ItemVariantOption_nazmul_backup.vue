<script setup lang="ts">
import { nextTick, ref, onMounted } from 'vue';
import { ProductOption, ProductOptionGroup, ProductVariant } from '@/models/Product.ts';
import { useProductStore } from '@/stores/product';
import { storeToRefs } from 'pinia';
import { useToast } from 'primevue/usetoast';
import VariantForm from '@/views/products/components/variant-option/VariantForm.vue';
import Variant from '@/views/products/components/variant-option/Variant.vue';
import OptionGroupForm from '@/views/products/components/variant-option/OptionGroupForm.vue';
import OptionGroupList from '@/views/products/components/variant-option/OptionGroupList.vue';
import { useRoute } from 'vue-router';

import Item from '@/models/Item.ts';
import { useItemStore } from '@/stores/item';


const emit = defineEmits(['update:item', 'saved', 'update:images', 'add:images']);



const toast = useToast();
const itemStore = useItemStore();
const productStore = useProductStore();

const { fb, item, variantItems, itemOptions } = storeToRefs(itemStore);
const { productVariants, productOptionGroups } = storeToRefs(productStore);

const props = defineProps({

  item: {
    type: Item,
    required: true,
    default: () => new Item({})
  }
});

const showOptionGroupCard = ref(false);
const showVariantCard = ref(false);
const optionGroupsHeadingRef = ref<HTMLElement | null>(null);
const productVariantSuggestions = ref<any[]>([]);
const optionGroup = ref<ProductOptionGroup>(new ProductOptionGroup({ product_id: item.value.product_id as number }));
const optionGroupSuggestions = ref<ProductOptionGroup[]>([]);
const optionSuggestions = ref<any[]>([]);
const typeSuggestions = ref<any[]>([]);
let selectedVariant = ref<ProductVariant>(new ProductVariant({}));
// let newVariant = ref<ProductVariant | null>(null);
// route params id
const route = useRoute();

// const productId = route.params.id;
// const productId = item.value.product_id;

selectedVariant.value = productVariants.value[0];


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
  optionGroup.value = new ProductOptionGroup({ product_id: item.value.product_id });
}

function toggleOptionGroup() {
  showOptionGroupCard.value = !showOptionGroupCard.value;
  selectedVariant.value?.productOptionGroups.forEach((g: ProductOptionGroup) => {
    g.active = false;
  });
  optionGroup.value = new ProductOptionGroup({ product_id: item.value.product_id });
  optionGroup.value.active = true;
}


const uploadMainImage = async (event: any, property: ProductVariant) => {
  // // alert('uploadMainImage');
  // try {
  //     // const response: any = await mediaStore.uploadFiles(event.files, property);
  //     let productId = props.item.product_id ? props.item.product_id : 0; // 0 is for new products
  //     const response: any = await productStore.uploadProductImages(event.files, property, productId);
  //     props.item[property] = response.files;
  // } catch (error) {
  //     console.error('Error uploading site logo:', error);
  // }
}

const deleteMainImage = async (file: any, property: ProductVariant) => {
  // try {
  //     await mediaStore.deleteImageByFilePath(file.objectURL, property);
  //     props.item[property] = [];
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
  if (item.value.product_id !== null && item.value.product_id !== undefined) {
    productVariantSuggestions.value = await productStore.listProductVariants(event, item.value.product_id);
  } else {
    productVariantSuggestions.value = [];
  }
}

const searchOptionGroups = async (event: any, variant: ProductVariant) => {
  if (variant.product_variant_id) {
    const data = await productStore.listProductOptionGroups(event, variant.product_id);
    optionGroupSuggestions.value = data;
  } else {
    optionGroupSuggestions.value = [];
  }
}

const searchOptions = async (data: { event: any, productId: number }) => {
  const { event, productId } = data;
  if (productId !== undefined && productId !== null) {
    optionSuggestions.value = await productStore.listItemOptions(event, productId);
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
  // if (checkExistingVariant) {
  //   toast.add({
  //     severity: 'warn',
  //     summary: 'Duplicate Variant',
  //     detail: `A variant with the same name "${data.variant_name}" already exists.`,
  //     life: 3000
  //   });
  //   return;
  // }
  try {
    data.product_id = item.value.product_id as number;
    data.item_id = route.params.id;
    let response: any = null;
    // response = await productStore.createProductVariant(data);
    response = await itemStore.createItemVariant(data);
    if (response) {
      selectedVariant.value = productVariants.value[0];
      productVariants.value = response;
      showVariantCard.value = false;
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
  selectedVariant.value = new ProductVariant(data);
  productVariants.value.forEach((variant: ProductVariant) => {
    variant.selected = false;
  });
  selectedVariant.value.selected = true;
  // selectedVariant.value.product_id = productId as any;
    selectedVariant.value.product_variant_id = data.product_variant_id;
    console.log('data.product_variant_id', data.product_variant_id);
    console.log('selectedVariant.value', selectedVariant.value);
  selectedVariant.value.isNew = true;
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
      const panels = document.querySelectorAll('.item-option-panel');
      if (panels && panels[idx]) {
        (panels[idx] as HTMLElement).scrollIntoView({ behavior: 'smooth', block: 'center' });
        // Optionally, focus header for accessibility
        const header = panels[idx].querySelector('.item-option-header');
        if (header) (header as HTMLElement).focus?.({ preventScroll: true });
      }
    }, 350); // matches opening transition duration
  }
  showOptionGroupCard.value = false;

}

const handleInsertOptionGroup = async (group: ProductOptionGroup) => {
  console.log('handleInsertOptionGroup  qqqqqqqqqq', group);
  selectedVariant.value.productOptionGroups.push(group);
  selectedVariant.value.product_id = item.value.product_id;
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
    // class name from OptionGroupList.vue: ".item-option-panel"
    // Add a small delay to let any transition finish
    setTimeout(() => {
      const panels = document.querySelectorAll('.item-option-panel');
      if (panels && panels[idx]) {
        (panels[idx] as HTMLElement).scrollIntoView({ behavior: 'smooth', block: 'center' });
        // Optionally, focus header for accessibility
        const header = panels[idx].querySelector('.item-option-header');
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
    const panels = document.querySelectorAll('.item-option-panel');
    if (panels && panels.length > 0) {
      (panels[panels.length - 1] as HTMLElement).scrollIntoView({ behavior: 'smooth', block: 'center' });
      // Optionally, focus header for accessibility
      const header = panels[panels.length - 1].querySelector('.item-option-header');
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
    const panels = document.querySelectorAll('.item-option-panel');
    if (panels && panels.length > 0) {
      (panels[panels.length - 1] as HTMLElement).scrollIntoView({ behavior: 'smooth', block: 'center' });
      // Optionally, focus header for accessibility
      const header = panels[panels.length - 1].querySelector('.item-option-header');
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
        fb.showToast({ success: 'Product option deleted successfully.' });
      } catch (error) {
        fb.showToast({ error: 'Failed to delete item option.' });
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

const scrollToOptionGroupsHeading = async () => {
  await nextTick();
  if (optionGroupsHeadingRef.value) {
    optionGroupsHeadingRef.value.scrollIntoView({ behavior: 'smooth', block: 'start' });
    optionGroupsHeadingRef.value.focus({ preventScroll: true });
  }
};

onMounted(async () => {
    item.value = await itemStore.fetchItemById(route.params.id as string);

  // item.value = await itemStore.fetchItemById(props.item.item_id);
  // setTimeout(async () => {
  //   if (item.value.product.productVariants.length > 0) {
  //     // update store 
  //     productVariants.value = item.value.product.productVariants;
  //     selectedVariant.value = item.value.product.productVariants[0];
  //     if (selectedVariant.value) {
  //         selectedVariant.value.selected = true;
  //       }
  //     productVariants.value[0].selected = true;
  //   } else {
      // await productStore.getVariantsOptionsByProductId(item.value.product_id as number);
      // if (productVariants.value.length > 0) {
      //   selectedVariant.value = productVariants.value[0];
      //   if (selectedVariant.value) {
      //     selectedVariant.value.selected = true;
      //   }
      //   productVariants.value[0].selected = true;
      // }


      await itemStore.getVariantItemsByItemId(item.value.item_id as number);
      if (productVariants.value.length > 0) {
        selectedVariant.value = productVariants.value[0];
        if (selectedVariant.value) {
          selectedVariant.value.selected = true;
        }
        productVariants.value[0].selected = true;
      }

console.log('variantItems new', variantItems.value);


  //   }
  // }, 200);
});


</script>
<template>
  <Message v-if="fb.errors?.['item.variant.update.' + selectedVariant?.product_variant_id]?.global_message
    || fb.errors?.['item.variant.create']?.global_message"
    class="br_content border-l-4 mb-5 w-full rounded-md shadow-sm">
    <span
      v-for="error in fb.errors?.['item.variant.update.' + selectedVariant?.product_variant_id]?.global_message || fb.errors?.['item.variant.create']?.global_message"
      :key="error" class="flex flex-col">
      {{ error }}
    </span>
  </Message>
  <!-- end global error messages -->
  <div class="flex flex-col md:flex-row gap-2">
    <div class="loading-overlay border-2" v-if="fb.loading['item.variants-options']">
      <div class="flex justify-center items-center h-full spinner">
        <i class="pi pi-spin pi-spinner" style="font-size: 2rem;"></i>
        <p class="mt-2">Loading item productOptions data. Please wait.</p>
      </div>
    </div>
    <!-- Left Column -->
    <div
      class="w-full sm:w-full md:w-full lg:w-full xl:w-1/2 bg-white rounded-xl shadow lg:p-6 flex flex-col gap-6 border border-gray-200"
      v-if="!fb.loading['item.show']">
      <div class="border-2 p-3">
        <div class="flex items-center justify-between w-full">
          <h3 class="font-medium text-lg">Variants</h3>
          <Button label="Add" :icon="showVariantCard ? 'pi pi-minus' : 'pi pi-plus'" severity="secondary" rounded
            @click="toggleVariantForm" />
        </div>
      </div>

      <VariantForm 
        v-show="showVariantCard" 
        :fb="fb" 
        :productVariants="productVariants"
        :productVariantSuggestions="productVariantSuggestions" 
        :variant="selectedVariant" 
        :buttonLabel="'Save Variant'"
        @searchVariant="searchVariants" 
        @add:variant="handleAddVariant" 
        @insert:variant="handleInsertVariant"
        @submit="(data) => handleSaveVariant(data)" 
      />

      <Variant 
        v-for="(item, i) in variantItems" 
        :key="item.product_variant_id" 
        :index="i + 1" 
        :variant="item"
        :fb="fb" 
        :buttonLabel="'Update Variant'" 
        @update:variant="handleUpdateVariant"
        @delete:variant="handleDeleteVariant" 
        @edit:variant="toggleVariant(item)"
        @click:variant="toggleVariant(item)" />

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

      <OptionGroupForm v-show="showOptionGroupCard" :optionGroupData="productOptionGroups" :optionGroup="optionGroup"
        :optionGroupSuggestions="optionGroupSuggestions" :optionSuggestions="optionSuggestions"
        :typeSuggestions="typeSuggestions" :showOptionList="true" :fb="fb" :buttonLabel="'Save Option Group'"
        @searchOptionGroups="searchOptionGroups($event, selectedVariant)"
        @add:optionGroup="handleAddOptionGroup($event)" @insert:optionGroup="handleInsertOptionGroup($event)"
        @update:optionGroup="handleUpdateOptionGroup" @searchOptions="searchOptions($event)"
        @add:option="handleAddOption" @insert:option="handleInsertOption" @update:option="handleUpdateOption"
        @delete:option="handleDeleteOption($event, selectedVariant)" @searchTypes="searchTypes($event)"
        @add:type="onSelectType($event)" />

      <OptionGroupList :variant="selectedVariant" :fb="fb" :buttonLabel="'Update Option Group'"
        :optionGroupSuggestions="optionGroupSuggestions" :optionSuggestions="optionSuggestions"
        :typeSuggestions="typeSuggestions" @add:optionGroup="handleAddOptionGroup"
        @insert:optionGroup="handleInsertOptionGroup($event)" @update:optionGroup="handleUpdateOptionGroup"
        @update:variant="handleUpdateVariant" @delete:optionGroup="handleDeleteOptionGroup($event, selectedVariant)"
        @searchOptionGroups="searchOptionGroups($event, selectedVariant)" @searchOptions="searchOptions($event)"
        @add:option="handleAddOption" @insert:option="handleInsertOption" @update:option="handleUpdateOption"
        @delete:option="handleDeleteOption($event, selectedVariant)" @searchTypes="searchTypes($event)"
        @add:type="onSelectType($event)" />

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