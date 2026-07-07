<script setup lang="ts">
// @ts-ignore - Vue component import
import UploadFileFeature from '@/components/upload/UploadFileFeature.vue'
import { useMediaStore } from '@/stores/media'
import { storeToRefs } from 'pinia'
import OptionList from '@/views/products/components/variant-option/OptionList.vue'
import { ProductOptionGroup } from '@/models/Product.ts'
import { computed, onMounted, watch } from 'vue'
import type { PropType } from 'vue'
import { debounce } from 'lodash'
import FeedbackHandler from '@/utils/FeedbackHandler';


const emit = defineEmits([
  'save', 
  'insert:optionGroup', 
  'update:optionGroup', 
  'searchOptionGroups', 
  'add:optionGroup',
  'remove:optionGroup',
  'searchOptions', 
  'add:option',
  'delete:option',
  'insert:option',
  'update:option',
  'searchProducts',
  'add:product',
  'searchVariant',
  'add:variant',
  'searchTypes',
  'add:type',
  'optionGroupInput',
  'inputOption',
  'upload:optionImage',
  'remove:optionImage'
])
const props = defineProps({
  showHiddenButton: {
    type: Boolean,
    default: true
  },
  optionGroup: {
    type: ProductOptionGroup,
    required: false,
    default: () => new ProductOptionGroup({})
  },
  optionGroupData: {
    type: Array as PropType<ProductOptionGroup[]>,
    required: false,
    default: () => []
  },
  optionGroupSuggestions: {
    type: Array as PropType<any[]>,
    required: false,
    default: () => []
  },
  optionSuggestions: {
    type: Array as PropType<any[]>,
    required: false,
    default: () => []
  },
  typeSuggestions: {
    type: Array as PropType<any[]>,
    required: false,
    default: () => []
  },
  showOptionList: {
    type: Boolean,
    required: false,
    default: true
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
  buttonLabel: {
    type: String,
    required: false,
    default: 'Save Option Group'
  },
  fb: {
    type: Object as PropType<FeedbackHandler>,
    required: false,
    default: () => new FeedbackHandler()
  }
})


interface UploadEvent {
  files: File[]
  [key: string]: any
}

// System variables
const mediaStore = useMediaStore()
const { fb: mediaFb } = storeToRefs(mediaStore)

// Local Variables 
const optionGroupUniqueErrorId = computed(() => {
  return props.optionGroup.product_id + '-' + props.optionGroup.product_variant_id + '-' + props.optionGroup.option_group_name+ '_group_error'
})


// Methods
const handleSave = (): void => {
  if(props.optionGroup.isNew) {
    emit('insert:optionGroup', props.optionGroup)
  }else{
    emit('update:optionGroup', props.optionGroup)
  }
}

const handleUpload = (event: UploadEvent): void => {
  // Handle file upload
}

const handleRemoveUploadedFile = (file: any): void => {
  props.optionGroup.optionGroupImage = props.optionGroup.optionGroupImage.filter(f => f !== file)
}

function addOptionGroup(event: { value: any }) {
  emit('add:optionGroup', event)
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

const searchOptionGroups = (event: any) => {
  emit('searchOptionGroups', event.query)
}
const onOptionGroupInput = debounce(searchOptionGroups, 300)


const searchOptions = (event: any) => {
  emit('searchOptions', {event, productId: props.optionGroup.product_id})
}
const handleAddOption = (event: any) => {
  event.option_gropu_name = props.optionGroup.option_group_name;
  emit('add:option', event)
}
const searchTypes = (event: any) => {
  emit('searchTypes', event.query)
}
const addType = (event:any) => {
  emit('add:type', event)
}

const handleDeleteOption = (event: any) => {  
  emit('delete:option', event)
}
const handleInsertOption = (event: any) => {
  if(!props.optionGroup.product_option_group_id){
    props.optionGroup.product_option_group_id = "_new_100";
    props.optionGroup.isNew = true;
  }
  emit('insert:option', event)
}
const handleUpdateOption = (event: any) => {
  emit('update:option', event)
}
const handleOptionGroupInput = (event: any) => {
  emit('optionGroupInput', event)
}
const inputOption = (data: any) => {
  emit('inputOption', data)
}
const handleUploadOptionImage = (event: any) => {
  emit('upload:optionImage', event)
}
const handleRemoveOptionImage = (event: any) => {
  emit('remove:optionImage', event)
}

onMounted(() => {
})

</script>

<template>
<transition
    enter-active-class="transition-all duration-500 ease-in-out"
    leave-active-class="transition-all duration-300 ease-in-out"
    enter-from-class="opacity-0 -translate-y-8"
    enter-to-class="opacity-100 translate-y-0"
    leave-from-class="opacity-100 translate-y-0"
    leave-to-class="opacity-0 -translate-y-8">
  <div class="optionGroup-form border border-gray-300 rounded-lg p-4 bg-gray-50">

     <div class="flex flex-col mb-2 gap-2">
        <Message  closable class="border-l-4 border-red-500"
        v-if="fb.errors?.[optionGroupUniqueErrorId] 
        || fb.errors?.[optionGroupUniqueErrorId]?.global_message">
          <span
            v-for="error in fb.errors?.[optionGroupUniqueErrorId]"
            :key="error" class="flex flex-col">
            {{ error }}
          </span>
        </Message>
      </div>
      <!-- <span>{{ optionGroup.product_id }}</span>
      <br>
      <span>{{ optionGroup.product_variant_id }}</span>
      <br>
      <span>{{ optionGroup.option_group_name }}</span> -->

    <div class="flex flex-col 2xl:flex-row xl:gap-4 gap-4">
      <!-- Left Column: Form Inputs -->
      <div class="w-full 2xl:w-3/5 flex flex-col gap-4">

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
        </div>

        <!-- OptionGroup (AutoComplete) -->
        <div class="flex flex-col gap-2">
          <label class="text-base font-medium">Option Group</label>
          <!-- <InputText placeholder="Auto complete" autocomplete="off" class="w-full text-base border border-gray-300 rounded-md p-2"/> -->
          <AutoComplete 
            v-model="optionGroup.option_group_name"
            ref="optionGroupAutocomplete" 
            :suggestions="optionGroupSuggestions"
            optionLabel="option_group_name"
            placeholder="Type for autocomplete" 
            class="w-full related-products-autocomplete"
            inputClass="w-full !rounded-md !border !border-gray-200 !shadow-none !focus:ring-0" 
            @complete="onOptionGroupInput" 
            @item-select="addOptionGroup" 
            @input="handleOptionGroupInput"
            />
        </div>

        <!-- OptionGroup Name -->
        <!-- <div class="flex flex-col gap-2">
          <label class="text-base font-medium">Option Group Name</label>
          <InputText
            v-model="optionGroup.option_group_name"
            placeholder="Enter optionGroup name"
            class="w-full text-base border border-gray-300 rounded-md p-2"
          />
        </div> -->

        <!-- OptionGroup Details -->
        <div class="flex flex-col gap-2">
          <label class="text-base font-medium">Option Group Description</label>
          <Textarea
            v-model="optionGroup.option_group_description"
            placeholder="Enter option group description"
            rows="4"
            class="w-full text-base border border-gray-300 rounded-md p-2"
          />
        </div>
      </div>

      <!-- Right Column: Photo Upload (Above XL) -->
      <div class="w-full 2xl:w-2/5 2xl:pt-0 pt-4 flex items-center justify-center border border-gray-300 rounded-lg bg-white">
        <div class="w-full p-4">
          <UploadFileFeature
            v-model:uploadedFilesData="optionGroup.optionGroupImage"
            :fb="mediaFb"
            :property="'optionGroupImage'"
            @upload="handleUpload"
            @removeUploadedFile="handleRemoveUploadedFile"
            :customStyle="{ maxHeight: '200px' }"
          />
        </div>
      </div>
    </div>

    <OptionList 
      v-if="showOptionList"
      :showHiddenButton="false"
      :optionGroup="optionGroup" 
      :optionSuggestions="optionSuggestions"
      :typeSuggestions="typeSuggestions"
      @searchOptions="searchOptions($event)"
      @add:option="handleAddOption"
      @insert:option="handleInsertOption"
      @update:option="handleUpdateOption"
      @delete:option="handleDeleteOption"
      @searchTypes="searchTypes($event)"
      @add:type="addType"
      @inputOption="inputOption($event)"
      @upload:optionImage="handleUploadOptionImage($event)"
      @remove:optionImage="handleRemoveOptionImage($event)"
    />

    <!-- Save Button -->
    <div class="mt-4">
      <Button
        :label="buttonLabel"
        @click="handleSave"
        class="px-6 py-2 bg-gray-200 border border-gray-300 rounded-md text-black hover:bg-gray-300"
        :icon="fb.loading['product.variant.update.' + optionGroup.product_variant_id] ? 'pi pi-spinner pi-spin' : 'pi pi-save'"
        :loading="fb.loading['product.variant.update.' + optionGroup.product_variant_id]"
        :disabled="fb.loading['product.variant.update.' + optionGroup.product_variant_id]"
      />
    </div>
  </div>
</transition>
</template>

<style scoped>
.p-message-info{
    background: rgb(246 215 215) !important;
    color:rgb(185 28 28 / var(--tw-text-opacity, 1));
  }
</style>
