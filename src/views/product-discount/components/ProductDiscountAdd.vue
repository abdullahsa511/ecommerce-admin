<script setup lang="ts">
import { defineEmits, onMounted, onUnmounted, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useProductDiscountStore } from '@/stores/productDiscount';

const productDiscountStore = useProductDiscountStore();
const { productDiscount, fb, products, userGroups } = storeToRefs(productDiscountStore);

const emit = defineEmits(['update:productDiscount', 'saved', 'editTabUnmunted', 'editTabMounted']);
const selectedGroup = ref<number | null>(null);

onMounted(async () => {
    emit('editTabMounted');
    productDiscountStore.resetProductDiscount(); //reset form for add.
});

onUnmounted(() => {
    emit('editTabUnmunted');
});
</script>

<template>
    <div class="flex flex-col gap-6">
        <div class="flex flex-col md:flex-row gap-6">
            <div class="sm:w-full md:w-3/5 space-y-4">
                <h3 class="text-lg font-medium border-b border-gray-200 pb-2">Add Product Discount</h3>
                <div class="grid grid-cols-12 gap-2">
                    <label for="name"
                        class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0 text-lg">Product</label>
                    <div class="col-span-12 md:col-span-10">
                        <Select v-model="productDiscount.product_id" :options="products" optionLabel="label" optionValue="value"
                        class="w-full text-lg border border-gray-200 rounded-md p-2" placeholder="Select Product" filter 
                        :class="{'p-invalid': fb.errors?.['productDiscount.create']?.product_id}" />
                            <Message v-if="fb.errors?.['productDiscount.create']?.product_id" severity="error" size="small" variant="title">
                                <span v-for="error in fb.errors?.['productDiscount.create']?.product_id" :key="error" class="flex flex-col">
                                    {{ error }}
                                </span>
                            </Message>
                    </div>
                </div>
                <div class="grid grid-cols-12 gap-2">
                    <label for="name"
                        class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0 text-lg">User Group</label>
                    <div class="col-span-12 md:col-span-10">
                        <Select v-model="productDiscount.user_group_id" :options="userGroups" optionLabel="label" optionValue="value"
                        class="w-full text-lg border border-gray-200 rounded-md p-2" placeholder="Select User Group" filter 
                        :class="{'p-invalid': fb.errors?.['productDiscount.create']?.user_group_id}" />
                            <Message v-if="fb.errors?.['productDiscount.create']?.user_group_id" severity="error" size="small" variant="title">
                                <span v-for="error in fb.errors?.['productDiscount.create']?.user_group_id" :key="error" class="flex flex-col">
                                    {{ error }}
                                </span>
                            </Message>
                    </div>
                </div>

                <div class="grid grid-cols-12 gap-2">
                    <label for="price"
                        class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0 text-lg">Price</label>
                    <div class="col-span-12 md:col-span-10">
                        <InputText class="text-lg w-full" id="price" type="text" v-model="productDiscount.price"
                            placeholder="Price" 
                            :class="{'p-invalid': fb.errors?.['productDiscount.create']?.price}" />
                            <Message v-if="fb.errors?.['productDiscount.create']?.price" severity="error" size="small" variant="title">
                                <span v-for="error in fb.errors?.['productDiscount.create']?.price" :key="error" class="flex flex-col">
                                    {{ error }}
                                </span>
                            </Message>
                    </div>
                </div>
                <div class="grid grid-cols-12 gap-2">
                    <label for="quantity"
                        class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0 text-lg">Quantity</label>
                    <div class="col-span-12 md:col-span-10">
                        <InputText class="text-lg w-full" 
                        id="quantity" 
                        type="text" 
                        v-model="productDiscount.quantity"
                        maxlength="2"
                        pattern="[0-9]{1,2}"
                        placeholder="Quantity" 
                        :class="{'p-invalid': fb.errors?.['productDiscount.create']?.quantity}" />
                            <Message v-if="fb.errors?.['productDiscount.create']?.quantity" severity="error" size="small" variant="title">
                                <span v-for="error in fb.errors?.['productDiscount.create']?.quantity" :key="error" class="flex flex-col">
                                    {{ error }}
                                </span>
                            </Message>
                    </div>
                </div>
                <div class="grid grid-cols-12 gap-2">
                    <label for="priority"
                        class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0 text-lg">Priority</label>
                    <div class="col-span-12 md:col-span-10">
                        <InputText 
                            class="text-lg w-full" 
                            maxlength="2"
                            id="priority" 
                            type="text" 
                            v-model="productDiscount.priority"
                            placeholder="Priority" 
                            :class="{'p-invalid': fb.errors?.['productDiscount.create']?.priority}"
                            pattern="[0-9]{1,2}"
                            />
                            <Message v-if="fb.errors?.['productDiscount.create']?.priority" severity="error" size="small" variant="title">
                                <span v-for="error in fb.errors?.['productDiscount.create']?.priority" :key="error" class="flex flex-col">
                                    {{ error }}
                                </span>
                            </Message>
                    </div>
                </div>

                <div class="grid grid-cols-12 gap-2">
                    <label for="from_date"
                        class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0 text-lg">From Date</label>
                        <div class="col-span-12 md:col-span-10">
                      <DatePicker v-model="productDiscount.from_date" class="w-full text-lg"
                       dateFormat="yy-mm-dd"
                       placeholder="yyyy-mm-dd"
                       :class="{'p-invalid': fb.errors?.['productDiscount.create']?.from_date}" />
                      <Message v-if="fb.errors?.['productDiscount.create']?.from_date" severity="error" size="small" variant="title">
                        <span v-for="error in fb.errors?.['productDiscount.create']?.from_date" :key="error" class="flex flex-col">
                            {{ error }}
                        </span>
                      </Message>
                    </div>
                </div>

                <div class="grid grid-cols-12 gap-2">
                    <label for="to_date"
                        class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0 text-lg">End Date</label>
                        <div class="col-span-12 md:col-span-10">
                      <DatePicker v-model="productDiscount.to_date" class="w-full text-lg"
                       dateFormat="yy-mm-dd"
                       placeholder="yyyy-mm-dd"
                       :class="{'p-invalid': fb.errors?.['productDiscount.create']?.to_date}" />
                      <Message v-if="fb.errors?.['productDiscount.create']?.to_date" severity="error" size="small" variant="title">
                        <span v-for="error in fb.errors?.['productDiscount.create']?.to_date" :key="error" class="flex flex-col">
                            {{ error }}
                        </span>
                      </Message>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped></style>
