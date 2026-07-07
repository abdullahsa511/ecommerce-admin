<script setup lang="ts">
import Product, { ProductOption, ProductOptionGroup, ProductVariant } from '@/models/Product.ts';
import { ref, onMounted } from 'vue'


//System variables such as props, useStore or stateToRef etc
const props = defineProps({
     selectedOptions: {
          type: String,
          default: null,
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
const emit = defineEmits({})

//Define local variables here
const x = ref()

const y = () => { }

//Define local methods here
const localMethod = () => { }

const selectedOptionsItems = (e: any, option: any) => {
     // emit('selectOption', option.option_name);
};


//Lifecycle hook started from here
onMounted(() => { })
</script>

<template>
     <div class="option-group-tiles">
          <div class="flex flex-wrap gap-4 pb-8">
               <!-- Option Item -->
               <div class="option-content w-1/6 sm:w-1/4 md:w-1/5 lg:w-1/6 flex flex-col items-center text-center cursor-pointer select-none"
                    v-for="option in optionGroup.productOptions" :key="option.product_option_id"
                    @click="selectedOptionsItems($event, option)">
                    <img src="https://dummyimage.com/40x40/444/fff&text=F" :alt="option.option_name"
                         :class="['w-full p-1 rounded', (option.option_name === selectedOptions) ||
                              (!selectedOptions && optionGroup.productOptions[0]?.option_name === option.option_name) ? 'border-2 border-gray-500' : 'border border-gray-300']" />
                    <div class="font-semibold text-sm mt-1">{{ option.option_name }}</div>

                    <Badge class="mt-1" :severity="(option.option_name === selectedOptions) ||
                              (!selectedOptions && optionGroup.productOptions[0]?.option_name === option.option_name) ? 'contrast' : 'secondary'">
                         {{ option.selected ? 'Selected' : option.price ? `$${option.price}` : '' }}
                    </Badge>
               </div>
          </div>

     </div>
</template>