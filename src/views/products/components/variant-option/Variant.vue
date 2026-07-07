<script setup lang="ts">
import {PropType, ref } from 'vue'
import Image from 'primevue/image'
import { ProductVariant } from '@/models/Product.ts'
import VariantForm from '@/views/products/components/variant-option/VariantForm.vue'
import FeedbackHandler from '@/utils/FeedbackHandler';

// Define emits
const emit = defineEmits<{
  update: [data: any]
  'update:variant': [data: any]
  'edit:variant': [data: ProductVariant]
  'click:variant': [data: ProductVariant],
  click: [event: MouseEvent],
  'delete:variant': [data: ProductVariant]
  'inputVariant': [data: any]
  'searchVariant': [event: any]
  'add:variant': [event: any]
  'upload:image': [event: any]
}>()
// Define props
const props = defineProps({
  variant: {
    type: ProductVariant,
    required: true,
    default: () => new ProductVariant()
  },
  productVariantSuggestions: {
    type: Array as PropType<any[]>,
    required: false,
    default: () => []
  },
  showForm: {
    type: Boolean,
    required: false,
    default: false
  },
  fb: {
    type: FeedbackHandler,
    required: false,
    default: () => new FeedbackHandler()
  },
  buttonLabel: {
    type: String,
    required: false,
    default: 'Update Variant'
  },
})


// Get image URL from variant data
const hideForm = ref(true);

const handleClick = (event: MouseEvent): void => {
  emit('click:variant', props.variant)
}

const handleUpdate = (data: any) => {
  emit('update:variant', data);
}

const handleUploadImage = (event: any) => {
  emit('upload:image', event)
}
const toggleFormVisibility = (event: MouseEvent) => {
  hideForm.value = !hideForm.value;
  emit('edit:variant', props.variant)
}

const deleteVariant = (event: MouseEvent) => {
  emit('delete:variant', props.variant)
}

const handleInputVariant = (event: any) => {
  emit('inputVariant', event)
}

const searchVariant = (event: any) => {
  emit('searchVariant', event)
}

const handleAddVariant = (event: any) => {
  emit('add:variant', event)
}
</script>

<template>
  <div class="variant-row transition-all duration-300 ease-in-out hover:bg-gray-100"
  :class="{ 'variant-row-active': props.variant.selected }">
    <div class="flex flex-col xl:flex-row gap-4">
      <!-- Left Column: Image Display -->
      <div class="w-full xl:w-1/4 flex items-center justify-center border border-gray-300  bg-white min-h-[120px]">
        <div class="w-full p-4 flex items-center justify-center cursor-pointer"
        @click="handleClick">
          <div v-if="props.variant.imagePreview" class="w-full cursor-pointer" @click.stop>
            <Image
              :src="props.variant.imagePreview"
              :preview="true"
              :alt="'Variant Image'"
              class="w-full h-auto"
              imageClass="w-full h-auto object-contain cursor-pointer"
            />
          </div>
          <div v-else class="w-full h-full flex items-center justify-center text-gray-400">
            <div class="text-center">
              <i class="pi pi-image text-4xl mb-2"></i>
              <p class="text-sm">No Image</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Column: Form Inputs -->
      <div class="w-full xl:w-3/4 flex flex-col gap-4 border border-gray-300  bg-white p-4 cursor-pointer"  @click="handleClick">
        <div class="flex justify-between items-center">
          <h4 class="text-lg font-semibold">{{ props.variant.variant_name }}</h4>
          <div class="flex gap-2">   
            <Button
                :icon="(!hideForm || props.showForm) && props.variant.selected ? 'pi pi-eye-slash': 'pi pi-pencil'" 
                severity="success" rounded outlined
                @click="toggleFormVisibility"/>
            <Button 
                  :icon="'pi pi-trash'"
                  :loading="fb.loading['product.variant.delete.' + props.variant.product_variant_id]"
                  rounded outlined
                  severity="danger"
                  @click="deleteVariant"
              />
                
          </div>
        </div>
        <p class="text-base">
            <span class="font-semibold">Details: </span>
            <span> 
              {{ props.variant.variant_description }}
            </span>
        </p>
      </div>
    </div>
    <!-- Expanded Form Row -->
    <transition
        enter-active-class="transition-all duration-500 ease-in-out"
        leave-active-class="transition-all duration-300 ease-in-out"
        enter-from-class="opacity-0 -translate-y-8"
        enter-to-class="opacity-100 translate-y-0"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 -translate-y-8">
        <div 
            v-show="props.variant.selected && (!hideForm || props.showForm)" 
            class="expanded-form-row"
        >
            <div class="form-container pt-2">
                <VariantForm
                    :buttonLabel="props.buttonLabel"
                    :variant="props.variant"
                    :fb="props.fb"
                    :productVariantSuggestions="props.productVariantSuggestions"
                    :productVariants="props.variant.productOptionGroups"
                    @submit="(data) => handleUpdate(data)"
                    @inputVariant="handleInputVariant"
                    @searchVariant="searchVariant"
                    @add:variant="handleAddVariant"
                    @upload:image="handleUploadImage"
                />
            </div>
        </div>
    </transition>
  </div>
</template>

<style scoped>
.variant-row {
  min-height: 120px;
  transition: background-color 0.3s ease-in-out, transform 0.2s ease-in-out;
}

.variant-row:hover {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}
.variant-row-active {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  background-color: rgb(243 244 246 / 1);
}
</style>
