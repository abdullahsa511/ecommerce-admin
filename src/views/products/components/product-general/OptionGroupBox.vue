<script setup lang="ts">
import Product, { ProductOption, ProductOptionGroup, ProductVariant } from '@/models/Product.ts';
import { ref, onMounted } from 'vue'

//System variables such as props, useStore or stateToRef etc
const props = defineProps({
     selectedOptions: {
          type: String,
          default: null,
     },
     showHideValue: {
          type: Boolean,
          default: false,
     },
     showHideFilter: {
          type: Boolean,
          default: false,
     },
     optionGroup: {
          type: ProductOptionGroup,
          default: () => new ProductOptionGroup()
     },
     tags: {
          type: Array,
          default: () => []
     },
     fimilys: {
          type: Array,
          default: () => []
     }
})

//Declear emits
const emit = defineEmits(['selectOption'])

//Define local variables here
const x = ref()

const y = () => { }

//Define local methods here
const localMethod = () => { }

const selectedOptionsItems = (e: any, option: any) => {
     emit('selectOption', option.option_name);
};

//Lifecycle hook started from here
onMounted(() => { })
</script>

<template>
     <div class="option-group-box grid grid-cols-3 gap-4 w-full">
          <div class="flex flex-col items-start relative pb-5" v-for="option in optionGroup.productOptions">
               <a :class="['p-3', 'border', 'border-gray-300', 'text-sm', 'hover:border-gray-500', 'cursor-pointer', 'rounded-none', 'w-full', 'block', 'text-center', 'mb-[10px]',
                        (option.option_name === selectedOptions) ||
                        (!selectedOptions && optionGroup.productOptions[0]?.option_name === option.option_name) ? 'bg-gray-800 text-white border-gray-800 font-semibold' : 'bg-white text-gray-800']"
                    @click="selectedOptionsItems($event, option)">{{ option.option_name }}
               </a>
               <Badge
                    :class="    (option.option_name === selectedOptions) ||
                              (!selectedOptions && optionGroup.productOptions[0]?.option_name === option.option_name) ? 'absolute bottom-0 left-1 px-2 py-0.5 text-xs bg-gray-800 text-white uppercase font-bold' : 'text-xs text-gray-500 mt-1 ml-1'"
                    :severity="    (option.option_name === selectedOptions) ||
                              (!selectedOptions && optionGroup.productOptions[0]?.option_name === option.option_name) ? 'contrast' : 'secondary'">
                    {{     (option.option_name === selectedOptions) ||
                              (!selectedOptions && optionGroup.productOptions[0]?.option_name === option.option_name) ?
                         'Selected' : option.price ? `$${option.price}` : '' }}
               </Badge>
          </div>
          
          
     </div>
</template>