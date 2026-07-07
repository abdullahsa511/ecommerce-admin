<script setup lang="ts">
import { PropType, ref, reactive, watch } from 'vue'
// @ts-ignore - Vue component import
import UploadFileFeature from '@/components/upload/UploadFileFeature.vue'
import { useMediaStore } from '@/stores/media'
import { storeToRefs } from 'pinia'
import { ProductOption } from '@/models/Product.ts'
import { debounce } from 'lodash'

const emit = defineEmits([
  'insert:option', 
  'update:option', 
  'add:option', 
  'searchOptions', 
  'searchProducts',
  'add:product',
  'searchVariant',
  'add:variant',
  'add:optionGroup',
  'searchOptionGroups',
  'searchTypes',
  'add:type',
  'inputOption',
  'upload:optionImage',
  'remove:optionImage'
])

const props = defineProps({
  showHiddenButton: {
    type: Boolean,
    default: true
  },
  formType: {
    type: String,
  },
  option: {
    type: ProductOption,
    required: false,
    default: () => new ProductOption({})
  },
  optionSuggestions: {
    type: Array as PropType<any[]>,
    required: false,
    default: () => []
  },
  optionGroup: {
    type: Object as PropType<any>,
    required: false,
    default: () => ({})
  },
  showFields: {
    type: Boolean,
    default: false
  },
  productSuggestions: {
    type: Array as PropType<any[]>,
    required: false,
    default: () => []
  },
  productVariantSuggestions: {
    type: Array as PropType<any[]>,
    required: false,
    default: () => []
  }, 
  optionGroupSuggestions: {
    type: Array as PropType<any[]>,
    required: false,
    default: () => []
  },
  typeSuggestions: {
    type: Array as PropType<any[]>,
    required: false,
    default: () => []
  },
})

// Media store
const mediaStore = useMediaStore()
const { fb: mediaFb } = storeToRefs(mediaStore)

// Form state
const isLoading = ref(false)
const isVisible = ref(true)  // for smooth close animation
const error = reactive({ optionName: '' })

// Option search
const searchOptions = (event: any) => {
  emit('searchOptions', event.query)
}
const searchTypes = (event: any) => {
  emit('searchTypes', event)
}
const onOptionInput = debounce(searchOptions, 300)
const onTypeInput = debounce(searchTypes, 300)

const addOption = (_event: { value: any }) => {
  if(!props.option.product_option_id) {
    _event.value.product_option_id = 0;
    _event.value.product_option_group_id = props.optionGroup.product_option_group_id;
  }
  emit('add:option', _event.value)
}
function addType(event: { value: any }) {
  emit('add:type', {type: event.value, option: props.option})
}

// Form reset
const resetForm = () => {
  props.option.option_name = ''
  props.option.option_description = ''
  props.option.image = []
  error.optionName = ''
}
defineExpose({ resetForm })

// Save handler
const handleSave = () => {
  if(props.option.product_option_id) {
    emit('update:option', props.option)
  }else{
    emit('insert:option', props.option)
  }
}

// Upload handlers
const handleUpload = (event: any) => {
  emit('upload:optionImage', {files: event.files, productOptionId: props.option.product_option_id as number})
 }
const handleRemoveUploadedFile = (file: any) => {
  // props.option.image = props.option.image.filter(f => f !== file)
  emit('remove:optionImage', {file: file, productOptionId: props.option.product_option_id as number})
}


const searchProducts = (event: any) => {
  emit('searchProducts', event)
}
const onProductInput = debounce(searchProducts, 300)

function addProduct(event: { value: any }) {
  emit('add:product', event)
}

const searchProductVariants = (event: any) => {
  emit('searchVariant', event.query)
}
const onProductVariantInput = debounce(searchProductVariants, 300)

function addProductVariant(event: { value: any }) {
  emit('add:variant', event.value)
}


function addOptionGroup(event: { value: any }) {
  emit('add:optionGroup', event)
}

const searchOptionGroups = (event: any) => {
  emit('searchOptionGroups', event.query)
}
const onOptionGroupInput = debounce(searchOptionGroups, 300)

const inputOption = (data: any) => {
  emit('inputOption', data)
}

// watch(props.option, (newVal) => {
//   console.log('props.option', newVal.product_option_id);
// }, { deep: true })
  
</script>

<template>
  <transition name="fade-slide">
    <div v-if="isVisible" class="option-form p-4 bg-gray-50">

      <!-- <div class="flex flex-col mb-2 gap-2">
        <Message  closable class="border-l-4 border-red-500">
          Lorem ipsum dolor sit amet.
        </Message>
      </div> -->


      <div class="flex flex-col 2xl:flex-row xl:gap-4 gap-4">
        <!-- Left Column -->
        <div class="w-full 2xl:w-1/2 flex flex-col gap-4">

          <div v-if="showFields">
            <div class="flex flex-col gap-2" >
              <label class="text-base font-medium">Product</label>
              <AutoComplete 
                :suggestions="productSuggestions" 
                @complete="onProductInput"
                @item-select="addProduct" 
                ref="productAutocomplete" 
                optionLabel="product_code" 
                placeholder="Type for autocomplete"
                class="w-full related-products-autocomplete"
                inputClass="w-full !rounded-md !border !border-gray-200 !shadow-none !focus:ring-0" />
            </div>

            <div class="flex flex-col gap-2">
              <label class="text-base font-medium">Variant</label>
              <AutoComplete 
                :suggestions="productVariantSuggestions"
                @complete="onProductVariantInput" 
                @item-select="addProductVariant" 
                ref="productVariantAutocomplete" 
                optionLabel="variant_name"
                placeholder="Type for autocomplete" 
                class="w-full related-products-autocomplete"
                inputClass="w-full !rounded-md !border !border-gray-200 !shadow-none !focus:ring-0" />
            </div>

            <div class="flex flex-col gap-2">
              <label class="text-base font-medium">Option Group</label>
              <AutoComplete 
                ref="optionGroupAutocomplete" 
                :suggestions="optionGroupSuggestions"
                optionLabel="option_group_name"
                placeholder="Type for autocomplete" 
                class="w-full related-products-autocomplete"
                inputClass="w-full !rounded-md !border !border-gray-200 !shadow-none !focus:ring-0" 
                @complete="onOptionGroupInput" 
                @item-select="addOptionGroup" 
                />
            </div>

          </div>


          <!-- Option AutoComplete -->
          <div class="flex flex-col gap-2">
            <label class="text-base font-medium">Option</label>
            <AutoComplete 
              v-model="props.option.option_name"
              ref="optionAutocomplete" 
              optionLabel="option_name"
              placeholder="Type for autocomplete" 
              class="w-full related-products-autocomplete"
              inputClass="w-full !rounded-md !border !border-gray-200 !shadow-none !focus:ring-0" 
              :suggestions="optionSuggestions"
              @complete="onOptionInput" 
              @item-select="addOption" 
              @input="inputOption"/>
              <p v-if="error.optionName" class="text-red-500 text-sm">{{ error.optionName }}</p>
          </div>

          <!-- Type AutoComplete -->
          <div class="flex flex-col gap-2">
            <label class="text-base font-medium">Type of Option</label>
            <AutoComplete 
              v-model="props.option.type"
              ref="typeOfOptionAutocomplete" 
              optionLabel="type"
              placeholder="Type for autocomplete" 
              class="w-full related-products-autocomplete"
              inputClass="w-full !rounded-md !border !border-gray-200 !shadow-none !focus:ring-0" 
              :suggestions="typeSuggestions"
              @complete="onTypeInput" 
              @item-select="addType" />
          </div>

          <!-- Option Details -->
          <div class="flex flex-col gap-2">
            <label class="text-base font-medium">Option Details</label>
            <Textarea
              v-model="props.option.option_description"
              placeholder="Enter option details"
              rows="4"
              class="w-full text-base border border-gray-300 rounded-md p-2"
            />
          </div>
          <div class="flex flex-col gap-2">
            <label class="text-base font-medium">Option Price</label>
            <InputNumber
              v-model="props.option.price"
              placeholder="Enter option price"
              class="w-full text-base border "
              :min="0"
              :minFractionDigits="2" :maxFractionDigits="3"
            />
          </div>
          <div class="flex flex-col gap-2">
            <label class="text-base font-medium">Option Sort Order</label>
            <InputNumber
              v-model="props.option.sort_order"
              placeholder="Enter option sort order"
              class="w-full text-base border"
            />
          </div>

          <label class="col-span-12 md:col-span-3 xl:col-span-2 flex items-center text-lg"> 
            <nobr>Hex Color : <span :style="{ color: props.option.hex_color }">{{ props.option.hex_color }}</span></nobr>
          </label>
          <div class="col-span-12 md:col-span-9 xl:col-span-10 py-2">
              <InputText v-model="props.option.hex_color" type ="color" class="w-full text-lg border border-gray-200 rounded-md p-2" placeholder="Enter hex color" />
          </div>
        </div>

        <!-- Right Column: Photo Upload -->
        <div class="w-full 2xl:w-1/2 2xl:pt-0 pt-4 flex items-center justify-center border border-gray-300 rounded-lg bg-white">
          <div class="w-full p-4">
            <UploadFileFeature
              v-model:uploadedFilesData="props.option.image"
              :fb="mediaFb"
              :property="'option_photo'"
              @upload="handleUpload"
              @removeUploadedFile="handleRemoveUploadedFile"
              :customStyle="{ maxHeight: '200px' }"
            />
          </div>
        </div>
      </div>

      <!-- Save Button -->
      <div class="mt-4">
        <Button
          v-if="showHiddenButton"
          :label="formType === 'add' ? 'Add Option' : 'Update Option'"
          :loading="isLoading"
          @click="handleSave"
          class="px-6 py-2 bg-gray-200 border border-gray-300 rounded-md text-black hover:bg-gray-300"
        />
      </div>
    </div>
  </transition>
</template>

<style scoped>
/* Smooth fade + slide transition */
.fade-slide-enter-active, .fade-slide-leave-active {
  transition: all 0.3s ease;
}
.fade-slide-enter-from, .fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.p-message-info{
    background: rgb(246 215 215) !important;
    color:rgb(185 28 28 / var(--tw-text-opacity, 1));
  }
</style>
