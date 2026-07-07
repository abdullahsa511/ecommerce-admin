<script setup lang="ts">
import { PropType } from 'vue'
// @ts-ignore - Vue component import
import UploadFileFeature from '@/components/upload/UploadFileFeature.vue'
import { debounce } from 'lodash'
import { ProductVariant, IProductVariant } from '@/models/Product.ts'
import FeedbackHandler from '@/utils/FeedbackHandler'

const emit = defineEmits([
  'submit', 
  'update:productVariant', 
  'searchVariant', 
  'searchItems', 
  'add:variant', 
  'searchProducts', 
  'add:product', 
  'add:item', 
  'inputVariant', 
  'upload:image', 
  'remove:image']);

const props = defineProps({
  productVariants: {
    type: Array as PropType<any[]>,
    required: true
  },
  variant: {
    type: Object as PropType<IProductVariant>,
    required: true,
    default: () => new ProductVariant()
  },
  productVariantSuggestions: {
    type: Array as PropType<any[]>,
    required: false,
    default: () => []
  },
  productSuggestions: {
    type: Array as PropType<any[]>,
    required: false,
    default: () => []
  },
  showVariantFields: {
    type: Boolean,
    required: false,
    default: false
  },
  showItemFields: {
    type: Boolean,
    required: false,
    default: false
  },
  itemSuggestions: {
    type: Array as PropType<any[]>,
    required: false,
    default: () => []
  },
  fb: {
    type: FeedbackHandler,
    required: false,
    default: () => new FeedbackHandler()
  },
  buttonLabel: {
    type: String,
    required: false,
    default: 'Save Variant'
  }
})


// Methods
const handleSave = (): void => {
  emit('submit', props.variant)
}

const handleUpload = (event: any): void => {
  emit('upload:image', {files: event.files, productVariantId: props.variant.product_variant_id})
}

const handleRemoveUploadedFile = (file: any): void => {
  emit('remove:image', file)
}

function addProductVariant(event: { value: any }) {
  emit('add:variant', event.value);
  // Check for duplicate after variant is selected
  setTimeout(() => {
    checkDuplicateVariantName();
  }, 100);
}

const searchProducts = (event: any) => {
  emit('searchProducts', event)
}
const onProductInput = debounce(searchProducts, 300)

function addProduct(event: { value: any }) {
  emit('add:product', event)
}

function addItem(event: { value: any }) {
  emit('add:item', event)
}

const searchProductVariants = (event: any) => {
  emit('searchVariant', event.query)
}
const onProductVariantInput = debounce(searchProductVariants, 300)

const searchItems = (event: any) => {
  emit('searchItems', event)
}
const onItemInput = debounce(searchItems, 300)

const checkDuplicateVariantName = () => {
  if (!props.variant.variant_name) {
    props.variant.hasDuplicateVariantName = false;
    props.variant.duplicateWarningMessage = '';
    return;
  }

  const duplicateVariant = props.productVariants.find(
    (variant: ProductVariant) => 
      variant.variant_name?.trim().toLowerCase() === props.variant.variant_name?.trim().toLowerCase()
  );
  
  if (duplicateVariant) {
    props.variant.hasDuplicateVariantName = true;
    props.variant.duplicateWarningMessage = `A variant with the name "${props.variant.variant_name}" already exists. Please change the variant name.`;
  } else {
    props.variant.hasDuplicateVariantName = false;
    props.variant.duplicateWarningMessage = '';
  }
}

const handleInputVariant = (event: any) => {
  emit('inputVariant', event);
  // Check for duplicate after a short delay to allow the v-model to update
  setTimeout(() => {
    checkDuplicateVariantName();
  }, 100);
}

</script>


<template>
  <transition enter-active-class="transition-all duration-500 ease-in-out"
    leave-active-class="transition-all duration-300 ease-in-out" enter-from-class="opacity-0 -translate-y-8"
    enter-to-class="opacity-100 translate-y-0" leave-from-class="opacity-100 translate-y-0"
    leave-to-class="opacity-0 -translate-y-8">
    <div class="variant-form border border-gray-300 rounded-lg p-4 bg-gray-50">

      <div class="flex flex-col mb-2 gap-2">
        <Message v-if="fb.errors?.['product.variant.update.' + props.variant.product_variant_id]?.variant_name || fb.errors?.['product.variant.create']?.variant_name"
          closable class="border-l-4 border-red-500">
          <span v-for="error in fb.errors?.['product.variant.update.' + props.variant.product_variant_id]?.variant_name || fb.errors?.['product.variant.create']?.variant_name" :key="error" class="flex flex-col">
                {{ error }}
              </span>
        </Message>
      </div>

      <div class="flex flex-col 2xl:flex-row xl:gap-4 gap-4">
        <!-- Left Column: Form Inputs -->
        <div class="w-full 2xl:w-2/3 flex flex-col gap-4">
          <!-- Variant (AutoComplete) -->
          <div class="flex flex-col gap-2" v-if="showVariantFields">
            <label class="text-base font-medium">Product</label>
            <AutoComplete ref="productAutocomplete" :suggestions="productSuggestions" @complete="onProductInput"
              @item-select="addProduct" optionLabel="product_code" placeholder="Type for autocomplete"
              class="w-full related-products-autocomplete"
              inputClass="w-full !rounded-md !border !border-gray-200 !shadow-none !focus:ring-0" />
          </div>
          <div class="flex flex-col gap-2" v-if="showItemFields">
            <label class="text-base font-medium">Item</label>
            <AutoComplete ref="itemAutocomplete" :suggestions="itemSuggestions" @complete="onItemInput"
              @item-select="addItem" optionLabel="item_code" placeholder="Type for autocomplete"
              class="w-full related-products-autocomplete"
              inputClass="w-full !rounded-md !border !border-gray-200 !shadow-none !focus:ring-0" />
          </div>
          <div class="flex flex-col gap-2">
            <label class="text-base font-medium">Variant</label>
            <AutoComplete ref="productVariantAutocomplete" 
              :inputClass="{ 
                'p-warning': props.variant.hasDuplicateVariantName,
                'w-full !rounded-md !border !border-gray-200 !shadow-none !focus:ring-0': true
              }"
              :class="{ 
                  'p-invalid': props.variant.hasDuplicateVariantName 
                || fb.errors?.['product.variant.update.' + props.variant.product_variant_id]?.variant_name 
                || fb.errors?.['product.variant.create']?.variant_name 
                || props.variant.hasDuplicateVariantName
              }"
              placeholder="Type for autocomplete" class="w-full related-products-autocomplete"
              optionLabel="variant_name"
              v-model="props.variant.variant_name"
              :suggestions="productVariantSuggestions"
              @complete="onProductVariantInput" 
              @item-select="addProductVariant" 
              @input="handleInputVariant"
            />
            <Message 
            v-if="props.variant.hasDuplicateVariantName && props.variant.duplicateWarningMessage" 
            severity="warn" size="small" variant="title">
              <span class="flex flex-col">
                {{ props.variant.duplicateWarningMessage }}
              </span>  
            </Message>
            <Message 
            v-if="fb.errors?.['product.variant.update.' + props.variant.product_variant_id]?.variant_name 
            || fb.errors?.['product.variant.create']?.variant_name" severity="error" size="small" variant="title">
              <span v-for="error in fb.errors?.['product.variant.update.' + props.variant.product_variant_id]?.variant_name || fb.errors?.['product.variant.create']?.variant_name" :key="error" class="flex flex-col">
                {{ error }}
              </span>  
            </Message>
          </div>
          <!-- Variant Details -->
          <div class="flex flex-col gap-2">
            <label class="text-base font-medium">Variant Details</label>
            <Textarea v-model="props.variant.variant_description" placeholder="Enter variant details" rows="4"
              class="w-full text-base border border-gray-300 rounded-md p-2" />
          </div>
        </div>

        <!-- Right Column: Photo Upload (Above XL) -->
        <div
          class="w-full 2xl:w-1/3 2xl:pt-0 pt-4 flex items-center justify-center border border-gray-300 rounded-lg bg-white">
          <div class="w-full p-4">
            <UploadFileFeature 
            v-model:uploadedFilesData="props.variant.image" 
            :fb="fb"
            :property="'image'" 
            :customStyle="{ maxHeight: '200px' }" 
            @upload="handleUpload" 
            @removeUploadedFile="handleRemoveUploadedFile"
            />
          </div>
        </div>
      </div>

      <!-- Save Button -->
      <div class="mt-4">
        <Button :label="props.buttonLabel + ' (' + props.variant.product_variant_id + ')'"
        class="px-6 py-2 bg-gray-200 border border-gray-300 rounded-md text-black hover:bg-gray-300" 
        @click="handleSave"
        :icon="fb.loading['product.variant.create'] || fb.loading['product.variant.update.' + props.variant.product_variant_id] ? 'pi pi-spinner pi-spin' : 'pi pi-save'"
        :loading="fb.loading['product.variant.create'] || fb.loading['product.variant.update.' + props.variant.product_variant_id]"
        :disabled="(props.variant as any)?.hasDuplicateVariantName || fb.loading['product.variant.create'] || fb.loading['product.variant.update.' + props.variant.product_variant_id]"
          />
      </div>
    </div>
  </transition>
</template>

<style scoped setup>

  .p-message-info{
    background: rgb(246 215 215) !important;
    color:rgb(185 28 28 / var(--tw-text-opacity, 1));
  }
  :deep(.p-inputtext.p-invalid) {
    border-color: var(--p-inputtext-invalid-border-color)!important;
  }
  :deep(.p-inputtext.p-warning) {
    border-color: var(--p-yellow-600)!important;
  }
</style>
