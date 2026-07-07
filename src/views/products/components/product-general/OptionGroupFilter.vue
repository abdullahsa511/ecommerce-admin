<script setup lang="ts">
import Product, { ProductOption, ProductOptionGroup, ProductVariant } from '@/models/Product.ts';
import { ref, onMounted, type PropType } from 'vue'
import type { MenuItem } from 'primevue/menuitem';

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
          type: Array as PropType<MenuItem[]>,
          default: () => [],
     },
     fimilys: {
          type: Array as PropType<MenuItem[]>,
          default: () => [],
     }
})


//Declear emits
const emit = defineEmits(['selectOption'])

//Define local variables here
const x = ref()
const showHideValue = ref(true);
const y = () => { }

//Define local methods here
const localMethod = () => { }

const showHideFilter = () => {
     showHideValue.value = !showHideValue.value
}

const selectedOptionsItems = (e: any, option: any) => {
     emit('selectOption', option.option_name);
};

const save = () => {
     // console.log('save');
}

//Lifecycle hook started from here
onMounted(() => { })
</script>

<template>
     <div class="option-group-filter">
          <div class="filter-option">
               <div class="filter-header flex justify-between" :class="!showHideValue ? 'border-b' : ''">
                    <span class="hideShowBtn" @click="showHideFilter">
                         <i class="pi pi-sliders-h pr-3"></i>
                         {{ showHideValue ? 'Show' : 'Hide' }} Filter
                    </span>
                    <button class="cleanBtn" severity="secondary">Clean Filter</button>
               </div>
               <div v-if="showHideValue" class="filter-process flex gap-5">
                    <SplitButton label="Tags(0)" :model="tags" @click="save" rounded severity="secondary"></SplitButton>
                    <SplitButton label="Fimily(0)" :model="fimilys" @click="save" rounded severity="secondary">
                    </SplitButton>
               </div>
          </div>

          <div class="flex flex-wrap gap-4 pb-8">
               <div class="fabric-content w-1/6 sm:w-1/4 md:w-1/5 lg:w-1/6 flex flex-col items-center text-center cursor-pointer select-none"
                    v-for="option in optionGroup.productOptions" :key="option.product_option_id"
                    @click="selectedOptionsItems($event, option)">
                    <img src="https://dummyimage.com/40x40/444/fff&text=F" :alt="option.option_name" :class="[
                         'w-full p-1 rounded',
                         (option.option_name === selectedOptions) ||
                              (!selectedOptions && optionGroup.productOptions[0]?.option_name === option.option_name)
                              ? 'border-2 border-gray-500'
                              : 'border border-gray-300'
                    ]" />
                    <div class="font-semibold text-sm mt-1">{{ option.option_name }}</div>

                    <Badge class="mt-1" :severity="(option.option_name === selectedOptions) ||
                              (!selectedOptions && optionGroup.productOptions[0]?.option_name === option.option_name) ? 'contrast' : 'secondary'">
                         {{ (option.option_name === selectedOptions) ||
                              (!selectedOptions && optionGroup.productOptions[0]?.option_name === option.option_name) ? 'Selected' : option.price ? `$${option.price}` : ''
                         }}
                    </Badge>
               </div>
          </div>
     </div>
</template>

<style scoped>
.filter-option {
     padding-bottom: 1.5rem;
}

.filter-header {
     align-items: center;
     border-top: 2px solid #ebebeb;
     display: flex;
     justify-content: space-between;
     padding: 25px 0px;
     width: 100%;
}

.hideShowBtn {
     align-items: center;
     cursor: pointer;
     display: flex;
     width: auto;
}

.cleanBtn {
     align-items: center;
     color: #666;
     cursor: pointer;
     display: flex;
     padding-right: 20px;
}

.filter-process {
     border-top: 1px solid #ddd;
     border-bottom: 1px solid #ddd;
     display: flex;
     padding: 15px 0;
}
</style>