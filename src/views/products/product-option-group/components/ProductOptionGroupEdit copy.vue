<script setup lang="ts">
import { onMounted, watch, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';
import InputText from 'primevue/inputtext';
import { storeToRefs } from 'pinia';
import { useProductOptionGroupStore } from '@/stores/productOptionGroup';

const emit = defineEmits([
  'update:productOptionGroup',
  'saved',
  'editTabUnmunted',
  'editTabMounted'
]);

const route = useRoute();
const productOptionGroupStore = useProductOptionGroupStore();
const { productOptionGroup, products, productVariants, fb } = storeToRefs(productOptionGroupStore);

// 🔹 When component mounts
onMounted(async () => {
  emit('editTabMounted');

  // Load data for edit
  if (route.params.id) {
    await productOptionGroupStore.getProductOptionGroupById(route.params.id as string);
  }
});


onUnmounted(() => {
  emit('editTabUnmunted');
});




</script>

<template>
  <div class="flex flex-col gap-6">
    <div class="flex flex-col md:flex-row gap-6">
      <!-- Left column: Option Form -->
      <div class="sm:w-full  md:w-full lg:w-3/5 space-y-4">
        <h3 class="text-lg font-medium border-b border-gray-200 pb-2">Edit Product Option Group</h3>

        <div class="grid grid-cols-12 gap-x-6 gap-y-4">
          <!-- product  -->
          <label for="name" class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0 text-lg"
            >Product</label
          >
          <div class="col-span-12 md:col-span-10">
            <Select
              v-model="productOptionGroup.product_id"
              :options="products"
              optionLabel="label"
              optionValue="value"
              class="w-full text-lg border border-gray-200 rounded-md p-2"
              placeholder="Select Product"
              filter
              :class="{
                'p-invalid':
                  fb.errors?.[
                    'productOptionGroup.update.' + productOptionGroup.product_option_group_id
                  ]?.product_id
              }"
            />
            <Message
              v-if="
                fb.errors?.[
                  'productOptionGroup.update.' + productOptionGroup.product_option_group_id
                ]?.product_id
              "
              severity="error"
              size="small"
              productOptionGroup="title"
            >
              <span
                v-for="error in fb.errors?.[
                  'productOptionGroup.update.' + productOptionGroup.product_option_group_id
                ]?.product_id"
                :key="error"
                class="flex flex-col"
              >
                {{ error }}
              </span>
            </Message>
          </div>

          <!-- product variant  -->
          <label for="name" class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0 text-lg"
            >Product Variants</label
          >
          <div class="col-span-12 md:col-span-10">
            <Select
              v-model="productOptionGroup.product_variant_id"
              :options="productVariants"
              optionLabel="label"
              optionValue="value"
              class="w-full text-lg border border-gray-200 rounded-md p-2"
              placeholder="Select Product"
              filter
              :class="{
                'p-invalid':
                  fb.errors?.[
                    'productOptionGroup.update.' + productOptionGroup.product_option_group_id
                  ]?.product_variant_id
              }"
            />
            <Message
              v-if="
                fb.errors?.[
                  'productOptionGroup.update.' + productOptionGroup.product_option_group_id
                ]?.product_variant_id
              "
              severity="error"
              size="small"
              productOptionGroup="title"
            >
              <span
                v-for="error in fb.errors?.[
                  'productOptionGroup.update.' + productOptionGroup.product_option_group_id
                ]?.product_variant_id"
                :key="error"
                class="flex flex-col"
              >
                {{ error }}
              </span>
            </Message>
          </div>

          <!-- name  -->
          <label class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0 text-lg">
            Name
          </label>
          <div class="col-span-12 md:col-span-10">
            <InputText
              v-model="productOptionGroup.option_group_name"
              :class="{
                'p-invalid':
                  fb.errors?.[
                    'productOptionGroup.update.' + productOptionGroup.product_option_group_id
                  ]?.option_group_name,
                'w-full': true,
                'text-lg': true,
                border: true,
                'border-gray-200': true,
                'rounded-md': true,
                'p-2': true
              }"
              placeholder="Enter option group name"
            />
            <Message
              v-if="
                fb.errors?.[
                  'productOptionGroup.update.' + productOptionGroup.product_option_group_id
                ]?.option_group_name
              "
              severity="error"
              size="small"
              productOptionGroup="title"
            >
              <span
                v-for="error in fb.errors?.[
                  'productOptionGroup.update.' + productOptionGroup.product_option_group_id
                ]?.option_group_name"
                :key="error"
                class="flex flex-col"
              >
                {{ error }}
              </span>
            </Message>
          </div>

          <!-- Sort Order -->
          <label class="col-span-12 md:col-span-2 flex items-center text-lg"> Sort Order </label>
          <div class="col-span-12 md:col-span-10">
            <InputText
              v-model="productOptionGroup.sort_order"
              class="w-full text-lg border border-gray-200 rounded-md p-2"
              placeholder="Enter sort order"
              :class="{
                'p-invalid':
                  fb.errors?.[
                    'productOptionGroup.update.' + productOptionGroup.product_option_group_id
                  ]?.sort_order
              }"
            />
            <Message
              v-if="
                fb.errors?.[
                  'productOptionGroup.update.' + productOptionGroup.product_option_group_id
                ]?.sort_order
              "
              severity="error"
              size="small"
              productOptionGroup="title"
            >
              <span
                v-for="error in fb.errors?.[
                  'productOptionGroup.update.' + productOptionGroup.product_option_group_id
                ]?.sort_order"
                :key="error"
                class="flex flex-col"
              >
                {{ error }}
              </span>
            </Message>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
