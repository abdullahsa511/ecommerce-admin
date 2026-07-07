<script setup lang="ts">
import { ref, watch } from 'vue';
import ProductSidebar from './ProductSidebar.vue';
import { useProductStore } from '@/stores/product';
import { storeToRefs } from 'pinia';
import { useToast } from 'primevue/usetoast';
import Product, { ProductPromotion } from '@/models/Product.ts';


const emit = defineEmits(['update:product', 'saved']);

const toast = useToast();
const productStore = useProductStore();
const { fb } = storeToRefs(productStore);


const props = defineProps({
  product: {
    type: Product,
    required: true,
    default: () => new Product({})
  }
});
console.log(props.product);

const editingRows = ref([]);
const newPromotion = ref(new ProductPromotion({}));

interface PromotionRow {
  user_group: string;
  priority: string;
  price: string;
  from_date: string;
  to_date: string;
}

const userGroupOptions = ['Default', 'Wholesale', 'VIP'];


// Add initial promotion if array is empty
if (props.product.promotions.length === 0) {
  const initialPromotion = new ProductPromotion({
    user_group_name: 'Default',
    priority: 1,
    price: 20.0000,
    from_date: '2023-10-20',
    to_date: '2023-10-20'
  });
  (props.product.promotions as ProductPromotion[]).push(initialPromotion);
}

const addPromotion = () => {
  const newPromotion = new ProductPromotion({});
  (props.product.promotions as ProductPromotion[]).push(newPromotion);
}

const removePromotion = (idx: number) => {
  props.product.promotions.splice(idx, 1);
}

// const addPromotion = () => {
//   console.log(newPromotion.value);
//   newPromotion.value.index = props.product.promotions.length;
//   if(newPromotion.value.product_promotion_id === 'update') {
//     newPromotion.value.product_promotion_id = 0;
//   }
//   props.product.promotions.push(newPromotion.value);
//   newPromotion.value = new ProductPromotion({});
// }

watch(props.product, (newVal) => {
  console.log(newVal);
});

</script>
<template>
  <div class="flex flex-col gap-8">
    <div class="loading-overlay" v-if="fb.loading['product.show']">
      <div class="flex justify-center items-center h-full spinner">
        <i class="pi pi-spin pi-spinner" style="font-size: 2rem;"></i>
        <p class="mt-2">Loading product promotion data. Please wait.</p>
      </div>
    </div>
    <div class="flex gap-6" v-if="!fb.loading['product.show']">
        <!-- Left column -->
        <div class="w-3/4 space-y-6">
            <div class="w-full overflow-x-auto">
                <h2 class="text-2xl font-bold mb-4">Promotion</h2>
                <table class="w-full border border-gray-200">
                    <thead>
                    <tr>
                        <th class="text-left font-bold py-2 px-3 border-b border-gray-200">User Group</th>
                        <th class="text-right font-bold py-2 px-3 border-b border-gray-200 pr-6">Price</th>
                        <th class="text-left font-bold py-2 px-3 border-b border-gray-200">From date</th>
                        <th class="text-left font-bold py-2 px-3 border-b border-gray-200">To Date</th>
                        <th class="w-16 border-b border-gray-200 text-center">
                        <button @click="addPromotion" class="bg-blue-600 hover:bg-blue-700 text-white rounded p-2" title="Add Promotion">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                            </svg>
                        </button>
                        </th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="(promo, idx) in product.promotions" :key="idx" class="border-b border-gray-200">
                        <td class="py-2 px-3" style="width: 200px;">
                          <select v-model="promo.user_group_name" class="w-full text-lg border border-gray-200 rounded-md p-2 bg-white">
                              <option v-for="option in userGroupOptions" :key="option" :value="option">{{ option }}</option>
                          </select>
                        </td>
                        <td class="py-2 px-3 text-right">
                          <InputNumber
                            v-model="promo.price"
                            :inputStyle="{textAlign: 'right', padding:'.5rem' }"
                            class="w-full text-lg text-right"
                            placeholder="Price"
                            showButtons buttonLayout="horizontal" 
                            :step="25" 
                            mode="currency"
                            currency="AUD"
                          >
                          <template #incrementicon>
                              <span class="pi pi-plus" />
                          </template>
                          <template #decrementicon>
                              <span class="pi pi-minus" />
                          </template>
                        </InputNumber>
                        </td>
                        <td class="py-2 px-3">
                          <input v-model="promo.from_date" type="date" class="w-full text-lg border border-gray-200 rounded-md p-2" />
                        </td>
                        <td class="py-2 px-3">
                          <input v-model="promo.to_date" type="date" class="w-full text-lg border border-gray-200 rounded-md p-2"  />
                        </td>
                        <td class="py-2 px-3 text-center" style="width: 60px;">
                          <button @click="removePromotion(idx)" class="bg-red-500 hover:bg-red-600 text-white rounded p-2" title="Remove">
                              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                              </svg>
                          </button>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div> 
        <!-- Right column -->
        <ProductSidebar :product="product" />
    </div> 
  </div>
</template>