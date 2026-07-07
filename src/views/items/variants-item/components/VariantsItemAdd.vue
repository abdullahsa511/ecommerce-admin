<script setup lang="ts">
import { nextTick, ref, onMounted, computed, onUnmounted } from 'vue';
import { ProductOption, ProductOptionGroup } from '@/models/Product.ts';
import { storeToRefs } from 'pinia';
import { useToast } from 'primevue/usetoast';
import VariantForm from '@/views/products/components/variant-option/VariantForm.vue';
import Variant from '@/views/products/components/variant-option/Variant.vue';
import OptionGroupForm from '@/views/products/components/variant-option/OptionGroupForm.vue';
import OptionGroupList from '@/views/products/components/variant-option/OptionGroupList.vue';
import { useRoute } from 'vue-router';
const emit = defineEmits(['update:product', 'saved', 'update:images', 'add:images', 'editTabUnmunted', 'editTabMounted', 'update:variant']);
import { ItemOption, ItemOptionGroup, VariantItem } from '@/models/Item.ts';
import { useVariantsItemStore } from '@/stores/variantsItem';
import { useItemStore } from '@/stores/item';
import { useRouter } from 'vue-router';
const props = defineProps({

});
const itemStore = useItemStore();
const variantsItemStore = useVariantsItemStore();
const router = useRouter();
const toast = useToast();
const { fb, item } = storeToRefs(itemStore);
const { variantItem, itemVariant } = storeToRefs(variantsItemStore);

const showOptionGroupCard = ref(false);
const showVariantCard = ref(false);
const optionGroupsHeadingRef = ref<HTMLElement | null>(null);
const productVariantSuggestions = ref<any[]>([]);
const productSuggestions = ref<any[]>([]);
const itemSuggestions = ref<any[]>([]);
const optionGroup = ref<ItemOptionGroup>(new ItemOptionGroup({ product_id: item.value.product_id ?? 0 }));
const optionGroupSuggestions = ref<ItemOptionGroup[]>([]);
const optionSuggestions = ref<any[]>([]);
const typeSuggestions = ref<any[]>([]);
// Provide a ProductVariant-shaped wrapper for shared components that expect `productOptionGroups`
const variantForList = computed(() => {
  if (!itemVariant.value) return new VariantItem({});
  return {
    ...itemVariant.value,
    productOptionGroups: itemVariant.value.itemOptionGroups ?? []
  } as any;
});
// let newVariant = ref<ProductVariant | null>(null);
// route params id
const route = useRoute();
const productId = ref<number | null>(null);
const itemId = ref<number | null>(null);

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

function toggleVariantForm() {
  showVariantCard.value = !showVariantCard.value;
  itemVariant.value.selected = false;
}

function toggleVariant() {
  itemVariant.value.selected = !itemVariant.value.selected;
  scrollToOptionGroupsHeading();
}

function toggleOptionGroup() {
  showOptionGroupCard.value = !showOptionGroupCard.value;
  itemVariant.value?.itemOptionGroups.forEach((g: ItemOptionGroup) => {
    g.active = false;
  });
  optionGroup.value = new ItemOptionGroup({ product_id: item.value.product_id ?? 0 });
  optionGroup.value.active = true;
}

const searchVariants = async (event: any) => {
  console.log('searchVariants new', event);
  if (productId.value !== null && productId.value !== undefined) {
    productVariantSuggestions.value = await itemStore.listItemVariants(event, productId.value);
  } else {
    productVariantSuggestions.value = [];
  }
}

// const handleDeleteVariant = async (data: any) => {
//   fb.value.showToast({ warning: 'Variant deletion is not allowed.' }, toast);
//   return false;
// }

const searchOptionGroups = async (event: any, variant: VariantItem) => {
  if (variant.product_id) {
    const data = await variantsItemStore.listItemOptionGroups(event, variant.product_id);
    optionGroupSuggestions.value = data;
  } else {
    optionGroupSuggestions.value = [];
  }
}

const searchOptions = async (data: { event: any, productId: number }) => {
  const { event, productId } = data;
  if (productId !== undefined && productId !== null) {
    optionSuggestions.value = await variantsItemStore.listProductOptions(event, productId);
  } else {
    optionSuggestions.value = [];
  }
}
const searchTypes = async (query: string) => {
  typeSuggestions.value = await variantsItemStore.listTypes(query);
}

const handleInsertVariant = async (variant: VariantItem) => {
  console.log('handleInsertVariant', variant);
}

const handleSaveVariant = async (data: any) => {
  try {
    data.product_id = productId.value as number;
    data.item_id = itemId.value as number;
    let response: any = null;
    console.log('create item variant data', data);
    response = await variantsItemStore.createItemVariant(data);
    if (response) {
      showVariantCard.value = false;
      fb.value.showToast({ success: 'Variant created successfully' }, toast);
      router.push('/ecommerce/products/variants-item/edit/' + (response?.variant_item_id as string));
    } else {
      fb.value.showToast({ error: 'An error occurred while saving the variant.' }, toast);
    }
  } catch (error) {
    fb.value.showToast({ error: fb.value.getError('item.variant.create') }, toast);
  }
}

const handleUpdateVariant = async (data: any) => {
  try {
    // console.log('handleUpdateVariant data', data);
    data.variant_item_id = route.params.id as string;
    data.product_id = productId.value as number;
    data.item_id = itemId.value as number;
    await variantsItemStore.updateItemVariant(data);
    fb.value.showToast({ success: 'Variant updated successfully' }, toast);
  } catch (error) {
    fb.value.showToast({ error: fb.value.getError('item.variant.update' + data.product_variant_id) }, toast);
  }
}

const handleAddVariant = async (data: any) => {
  itemVariant.value = new VariantItem(data);
  itemVariant.value.selected = true;
  itemVariant.value.isNew = true;
}

const handleAddOptionGroup = async (data: any) => {
  optionGroup.value = new ItemOptionGroup(data.value);
  optionGroup.value.itemOptions = optionGroup.value.itemOptions.length > 0 ? [optionGroup.value.itemOptions[0]] : [];
  // Check if a variant with the same option group name already exists for this variant
  const existingGroup = itemVariant.value?.itemOptionGroups.find(
    (g: ProductOptionGroup) => g.option_group_name.trim().toLowerCase() === optionGroup.value.option_group_name.trim().toLowerCase()
  );

  if (existingGroup) {
    fb.value.showToast({ warning: `An option group named "${optionGroup.value.option_group_name}" already exists for this variant.` }, toast);
    // return false;
  }
  itemVariant.value?.itemOptionGroups.forEach((g: ItemOptionGroup) => {
    g.active = false;
  });
  if (!data.index) {
    optionGroup.value.isNew = true;
    optionGroup.value.product_option_group_id = "_new_" + (itemVariant.value?.itemOptionGroups.length);
    optionGroup.value.item_option_group_id = data.value.product_option_group_id;
  }
  optionGroup.value.active = true;
  itemVariant.value?.itemOptionGroups.push(optionGroup.value);

  //Smooth scroll to the newly added/activated option group
  const idx = itemVariant.value?.itemOptionGroups.length
    ? itemVariant.value?.itemOptionGroups.length - 1
    : null;
  if (idx !== null) {
    smoothScrollTo('product-option-panel', 'product-option-header');
  }
  showOptionGroupCard.value = false;

}

const inputVariant = async (data: any) => {
  itemVariant.value = new VariantItem(data.value);
  itemVariant.value.selected = true;
  itemVariant.value.isNew = true;
  itemVariant.value.product_variant_id = 0;
}

const inputOptionGroup = async (data: any) => {
  optionGroup.value = new ItemOptionGroup(data.value);
  optionGroup.value.isNew = true;
  optionGroup.value.product_option_group_id = 0
  optionGroup.value.item_option_group_id = 0;
  optionGroup.value.active = true;
}
const inputOption = async (data: any) => {
  const option = new ItemOption(data.value);
  option.item_option_id = 0;
  option.product_option_id = 0;
  option.product_option_group_id = data.value.product_option_group_id;
  option.active = true;
}

const handleInsertOptionGroup = async (group: ItemOptionGroup) => {
  itemVariant.value.itemOptionGroups.push(group);
  itemVariant.value.product_id = productId as any;
  await variantsItemStore.createItemVariant(itemVariant.value);
  optionGroup.value = new ItemOptionGroup({});
  showOptionGroupCard.value = false;
  showVariantCard.value = false;
}

const handleUpdateOptionGroup = async (group: ProductOptionGroup) => {
  console.log('handleUpdateOptionGroup', group);
  const groupIndex = itemVariant.value?.itemOptionGroups.findIndex((g: ItemOptionGroup) => g.product_option_group_id === group.product_option_group_id);
  if (groupIndex !== undefined && groupIndex !== null && groupIndex > -1) {
    if (itemVariant.value) {
      itemVariant.value.itemOptionGroups[groupIndex] = group as any;
    }
  }

  //Call backend variant update api
  // await itemStore.updateItemVariant(selectedVariant.value);
  optionGroup.value = new ItemOptionGroup({});

  //Smooth scroll to the newly added/activated option group
  const idx = itemVariant.value?.itemOptionGroups.length
    ? itemVariant.value.itemOptionGroups.length - 1
    : null;
  if (idx !== null) {
    smoothScrollTo('product-option-panel', 'product-option-header');
  }
}

const handleDeleteOptionGroup = async (data: any, variant: VariantItem) => {
  const group = new ItemOptionGroup(data);
  if (!group.product_option_group_id) return;

  try {
    if (variant) {
      variant.itemOptionGroups =
        variant.itemOptionGroups.filter((o: ItemOptionGroup) => o.product_option_group_id !== group.product_option_group_id);
      variant.itemOptionGroups.forEach((o: ItemOptionGroup) => {
        o.active = false;
      });
    }
    // Delete from global option group store (API + local store)
    await variantsItemStore.deleteItemOptionGroup(group);

    // Remove association from the selected variant in-memory
    if (itemVariant.value) {
      itemVariant.value.itemOptionGroups =
        itemVariant.value.itemOptionGroups.filter((g: ItemOptionGroup) => g.product_option_group_id !== group.product_option_group_id);
    }
    fb.value.showToast({ success: 'Option group deleted successfully' }, toast);
  } catch (err) {
    fb.value.showToast({ error: fb.value.getError('item.option-group.delete.' + group.product_option_group_id) }, toast);
  }
}

const handleAddOption = async (data: any) => {
  //Index property and groupIndex property
  const option = new ItemOption(data);
  const existingOption = itemVariant.value?.itemOptionGroups[data.groupIndex]?.itemOptions?.find(
    (g: any) => g.option_name.trim().toLowerCase() === option.option_name.trim().toLowerCase()
  );
  if (existingOption) {
    fb.value.showToast({ warning: `An option named "${option.option_name}" already exists for this group.` }, toast);
  }
}

const handleInsertOption = async (data: any) => {
  const option = new ItemOption(data);
  const groupIndex = itemVariant.value?.itemOptionGroups.findIndex((g: ItemOptionGroup) => g.product_option_group_id === option.product_option_group_id);
  const optionLength = itemVariant.value?.itemOptionGroups[groupIndex]?.itemOptions?.length;
  if (optionLength >= 1) {
    fb.value.showToast({ error: 'You can only add one option to a group. You have already added one option to this group.' }, toast);
    return false;
  }

  if ((option.product_option_group_id === optionGroup.value.product_option_group_id) && optionGroup.value.isNew) {
    optionGroup.value.itemOptions.forEach((o: ItemOption) => {
      if (o.product_option_id === option.product_option_id) {
        o.active = false;
      }
    });
    // option.active = true;
    optionGroup.value.itemOptions.push(option);
  } else {
    console.log('handleInsertOption else', option);


    if (groupIndex !== undefined && itemVariant.value?.itemOptionGroups?.[groupIndex]?.itemOptions) {
      // option.active = true;
      itemVariant.value.itemOptionGroups[groupIndex].itemOptions.push(option);
    }
  }

  // Smooth scroll to the newly added/activated option
  smoothScrollTo('product-option-panel', 'product-option-header');
}

const handleUpdateOption = async (data: any) => {
  const option = new ItemOption(data);
  const groupIndex = itemVariant.value?.itemOptionGroups.findIndex((g: ItemOptionGroup) => g.product_option_group_id === option.product_option_group_id);

  if (data.index !== undefined && data.index !== null && data.index > -1) {
    if (groupIndex !== undefined && itemVariant.value?.itemOptionGroups?.[groupIndex]?.itemOptions?.[data.index]) {
      itemVariant.value.itemOptionGroups[groupIndex].itemOptions[data.index] = option;
    }
  }
  // Smooth scroll to the newly added/activated option
  smoothScrollTo('product-option-panel', 'product-option-header');
}

const handleDeleteOption = async (data: any, variant: VariantItem) => {
  console.log('handleDeleteOption', data);
  const option = new ItemOption(data);
  const groupIndex = variant.itemOptionGroups.findIndex((g: ItemOptionGroup) => g.product_option_group_id === option.product_option_group_id);
  if (groupIndex !== undefined && groupIndex !== null && groupIndex > -1) {
    if (variant) {
      variant.itemOptionGroups[groupIndex].itemOptions =
        variant.itemOptionGroups[groupIndex].itemOptions.filter((o: ItemOption) => o.product_option_id !== option.product_option_id);

      try {
        await variantsItemStore.deleteItemOption(data.item_option_id, groupIndex);
        fb.value.showToast({ success: 'Product option deleted successfully.' }, toast);
      } catch (error) {
        fb.value.showToast({ error: fb.value.getError('item.option.delete.' + data.item_option_id) }, toast);
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
  const groupIndex = itemVariant.value?.itemOptionGroups.findIndex((g: ItemOptionGroup) => g.product_option_group_id === option.product_option_group_id);
  if (groupIndex !== undefined && groupIndex !== null && groupIndex > -1) {
    if (itemVariant.value && index) {
      // item variant uses `itemOptionGroups` / `itemOptions`
      itemVariant.value.itemOptionGroups[groupIndex].itemOptions[index] = option as any;
    }
  }
}

const searchProducts = async (event: any) => {
  const query = event.query?.toLowerCase();
  // console.log("query", query);
  if (query?.length > 0) {
    variantsItemStore.searchProducts(query).then(results => {
      // console.log("results", results);
      productSuggestions.value = results;
    });
  } else {
    productSuggestions.value = [];
  }
  console.log('productSuggestions', productSuggestions.value);
}

function addProduct(event: { value: any }) {
  if (itemVariant.value) {
    productId.value = event.value.product_id as number;
    itemVariant.value.product_id = event.value.product_id;
    // selectedVariant.value.product_code = event.value.product_code as string;
  }
  console.log('product Id.value', productId.value);
}

const searchItems = async (event: any) => {
  const query = event.query?.toLowerCase();
  // console.log("query", query);
  if (query?.length > 0) {
    variantsItemStore.listItems(query, productId.value as number).then(results => {
      // console.log("results", results);
      itemSuggestions.value = results;
    });
  } else {
    itemSuggestions.value = [];
  }
  console.log('itemSuggestions', itemSuggestions.value);
}

const handleAddItem = async (event: any) => {
  // alert('handleAddItem');
  if (itemVariant.value) {
    itemId.value = event.value.item_id as number;
    itemVariant.value.item_id = event.value.item_id;
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
  emit('editTabMounted');
  itemVariant.value = new VariantItem({});
  // await variantsItemStore.fetchVariantsItemById(route.params.id as string);
  // productId.value = itemVariant.value.product_id;
  // itemId.value = itemVariant.value.item_id;
  // console.log('itemVariant on mounted', itemVariant.value);
  // item.value = await itemStore.fetchItemById(route.params.id as string);
  // await itemStore.getItemVariantByItemId(variantItem.value.item_id);
  // console.log('itemVariant', itemVariant.value);
});

onUnmounted(() => {
  emit('editTabUnmunted');
});
</script>
<template>
  <div v-bind="$attrs">
    <Message v-if="fb.errors?.['item.variant.update.' + itemVariant.value?.product_variant_id]?.global_message
      || fb.errors?.['item.variant.create']?.global_message"
      class="br_content border-l-4 mb-5 w-full rounded-md shadow-sm">
      <span
        v-for="error in fb.errors?.['item.variant.update.' + itemVariant.value?.product_variant_id]?.global_message || fb.errors?.['item.variant.create']?.global_message"
        :key="error" class="flex flex-col">
        {{ error }}
      </span>
    </Message>
    <!-- end global error messages -->
    <div class="flex flex-col md:flex-row gap-2">
      <div class="loading-overlay border-2" v-if="fb.loading['item.variant-options']">
        <div class="flex justify-center items-center h-full spinner">
          <i class="pi pi-spin pi-spinner" style="font-size: 2rem;"></i>
          <p class="mt-2">Loading item item options data. Please wait.</p>
        </div>
      </div>
      <!-- Left Column -->
      <div
        class="w-full sm:w-full md:w-full lg:w-full xl:w-1/2 bg-white rounded-xl shadow lg:p-6 flex flex-col gap-6 border border-gray-200"
        v-if="!fb.loading['product.show']">
        <div class="border-2 p-3">
          <div class="flex items-center justify-between w-full">
            <h3 class="font-medium text-lg">Item Variants</h3>
            <Button v-if="!itemVariant.product_variant_id" label="Add"
              :icon="showVariantCard ? 'pi pi-minus' : 'pi pi-plus'" severity="secondary" rounded
              @click="toggleVariantForm" />
          </div>
        </div>

        <VariantForm v-if="!itemVariant.value?.product_variant_id" :fb="fb" v-show="showVariantCard"
          :productVariants="[itemVariant.value]" :productVariantSuggestions="productVariantSuggestions"
          :variant="itemVariant" :buttonLabel="'Save Variant'" @searchVariant="searchVariants"
          @searchItems="searchItems" :showVariantFields="true" @add:variant="handleAddVariant"
          :productSuggestions="productSuggestions"
          :itemSuggestions="itemSuggestions"
           @searchProducts="searchProducts($event)"
          @add:product="addProduct($event)"
          @add:item="handleAddItem"
          :showItemFields="true" @insert:variant="handleInsertVariant" @submit="handleSaveVariant"
          @inputVariant="inputVariant" />

        <!-- <Variant :key="itemVariant.product_variant_id" :variant="itemVariant"
          :productVariantSuggestions="productVariantSuggestions" @add:variant="handleAddVariant"
          :showForm="!!itemVariant.selected" :fb="fb" :buttonLabel="'Update Variant'"
          @update:variant="handleUpdateVariant" @delete:variant="handleDeleteVariant" @edit:variant="toggleVariant()"
          @searchVariant="searchVariants" /> -->
      </div>

      <!-- Right column -->
      <div ref="optionGroupsHeadingRef"
        class="w-full sm:w-full md:w-full lg:w-full xl:w-1/2 bg-white rounded-xl shadow lg:p-6 border border-gray-200 flex flex-col gap-6">

        <div class="border-2 p-3">
          <div class="flex items-center justify-between w-full">
            <h3 class="font-medium text-lg focus:outline-none" tabindex="-1">
              Variant: {{ itemVariant?.variant_name }}
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

        <OptionGroupForm v-show="showOptionGroupCard" :optionGroupData="itemVariant?.itemOptionGroups"
          :optionGroup="optionGroup" :optionGroupSuggestions="optionGroupSuggestions"
          :optionSuggestions="optionSuggestions" :typeSuggestions="typeSuggestions" :showOptionList="true" :fb="fb"
          :buttonLabel="'Save Option Group'" @searchOptionGroups="searchOptionGroups($event, itemVariant)"
          @add:optionGroup="handleAddOptionGroup($event)" @insert:optionGroup="handleInsertOptionGroup($event)"
          @update:optionGroup="handleUpdateOptionGroup" @searchOptions="searchOptions($event)"
          @add:option="handleAddOption" @insert:option="handleInsertOption" @update:option="handleUpdateOption"
          @delete:option="handleDeleteOption($event, itemVariant)" @searchTypes="searchTypes($event)"
          @add:type="onSelectType($event)" @inputOptionGroup="inputOptionGroup" @inputOption="inputOption" />

        <OptionGroupList :variant="variantForList" :fb="fb" :buttonLabel="'Update Option Group'"
          :optionGroupSuggestions="optionGroupSuggestions" :optionSuggestions="optionSuggestions"
          :typeSuggestions="typeSuggestions" @add:optionGroup="handleAddOptionGroup"
          @insert:optionGroup="handleInsertOptionGroup($event)" @update:optionGroup="handleUpdateOptionGroup"
          @update:variant="handleUpdateVariant" @delete:optionGroup="handleDeleteOptionGroup($event, itemVariant)"
          @searchOptionGroups="searchOptionGroups($event, itemVariant)" @searchOptions="searchOptions($event)"
          @add:option="handleAddOption" @insert:option="handleInsertOption" @update:option="handleUpdateOption"
          @delete:option="handleDeleteOption($event, itemVariant)" @searchTypes="searchTypes($event)"
          @add:type="onSelectType($event)" />

      </div>
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