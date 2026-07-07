<script setup>
import { ref, onMounted } from 'vue';
import { useProductStore } from '../stores/product';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import Card from 'primevue/card';
import ProductFilter from '@/filters/ProductFilter';
import InputText from 'primevue/inputtext';
import InputNumber from 'primevue/inputnumber';
import Button from 'primevue/button';
import { resolveMediaImage, hasMediaImage } from '@/utils/mediaUrl';
import Avatar from 'primevue/avatar';

const router = useRouter();
const productStore = useProductStore();
const { fb, products } = storeToRefs(productStore);

// const filters = ref({
//     global: { value: null, matchMode: 'contains' },
//     name: { value: null, matchMode: 'contains' },
//     price: { value: null, matchMode: 'equals' },
//     stock: { value: null, matchMode: 'equals' }
// });
const filters = ref({ ...new ProductFilter() });
const selectedProducts = ref([]);

const fetchData = async () => {
    await productStore.fetchProducts();
};

const addProduct = () => {
    router.push('/products/new');
};

const editProduct = (data) => {
    router.push(`/ecommerce/products/${data.product_id}`);
};

const deleteProduct = async (data) => {
    await productStore.deleteProduct(data.product_id);
};

const deleteSelectedProducts = async () => {
    if (selectedProducts.value.length > 0) {
        for (const product of selectedProducts.value) {
            await productStore.deleteProduct(product.product_id);
        }
        selectedProducts.value = [];
    }
};
const getProductImageLink = (data) => resolveMediaImage(data.image);
onMounted(() => {
    fetchData();
});

const clearFilter = () => {
    // Reset local filters; product store does not expose a clearFilter method
    filters.value = { ...new ProductFilter() };
    selectedProducts.value = [];
};

const renderIcon = (icon, action, id) => {
    return fb.value.loading[`product.${action}.${id}`] ? 'pi pi-spinner pi-spin' : icon;
};

const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(price);
};
</script>

<template>
    <div class="product-index">
        <DataTable v-model:filters="filters" v-model:selection="selectedProducts" :value="products" paginator :rows="10"
            dataKey="product_id" filterDisplay="menu" :loading="fb.loading.product"
            :globalFilterFields="['product_code', 'price', 'description', 'stock_quantity']" selectionMode="multiple"
            class="th-table mb-4">
            <template #header>
                <div class="flex justify-between items-center">
                    <div class="flex gap-2">
                        <Button type="button" icon="pi pi-filter-slash" label="Clear" outlined @click="clearFilter()" />
                        <Button v-if="selectedProducts.length > 0" type="button" icon="pi pi-trash"
                            label="Delete Selected" severity="danger" @click="deleteSelectedProducts" />
                    </div>
                    <InputText v-model="filters['global'].value" placeholder="Keyword Search" />
                </div>
            </template>
            <template #empty> No products to display! </template>
            <template #loading> Loading products data. Please wait. </template>

            <Column selectionMode="multiple" headerStyle="width: 3rem" />

            <Column field="thumbnail" header="Thumbnail" style="min-width: 8rem">
                <template #body="{ data }">
                    <a @click="editProduct(data)" class="cursor-pointer">
                        <img :src="getProductImageLink(data)" :alt="data.name"
                            class="w-16 h-16 object-cover border-2 border-gray-200 hover:border-blue-500 transition-colors" />
                    </a>
                </template>
            </Column>

            <Column field="product_code" header="Product" style="min-width: 12rem">
                <template #body="{ data }">
                    <a @click="editProduct(data)"
                        class="text-blue-600 hover:text-blue-800 cursor-pointer hover:underline">
                        {{ data.product_code }}
                    </a>
                </template>
                <template #filter="{ filterModel }">
                    <InputText v-model="filterModel.value" placeholder="Search by product code" />
                </template>
            </Column>
            <!-- <Column field="product_code" header="Description" style="min-width: 12rem">
                <template #body="{ data }">
                    {{ data.product_code }}
                </template>
                <template #filter="{ filterModel }">
                    <InputText v-model="filterModel.value" placeholder="Search by product_code" />
                </template>
            </Column> -->
            <Column field="description" header="Description" style="min-width: 12rem">
                <template #body="{ data }">
                    {{ data.description }}
                </template>
                <template #filter="{ filterModel }">
                    <InputText v-model="filterModel.value" placeholder="Search by description" />
                </template>
            </Column>

            <Column field="price" header="Price" style="min-width: 10rem">
                <template #body="{ data }">
                    {{ formatPrice(data.price) }}
                </template>
                <template #filter="{ filterModel }">
                    <!-- Use InputNumber so the filter value is numeric and matches FilterMatchMode.EQUALS -->
                    <InputNumber v-model="filterModel.value" mode="decimal" useGrouping="false"
                        placeholder="Filter by price" />
                </template>
            </Column>

            <Column field="stock_quantity" header="Stock" style="min-width: 8rem">
                <template #body="{ data }">
                    <span :class="[
                        'px-3 py-1 text-sm font-medium rounded-lg',
                        data.stock_quantity > 50 ? 'bg-emerald-500 text-gray-900' :
                            data.stock_quantity > 20 ? 'bg-sky-200 text-gray-900' :
                                data.stock_quantity > 0 ? 'bg-amber-400 text-gray-900' :
                                    'bg-red-400 text-gray-900'
                    ]" style="display: inline-block;">
                        {{ data.stock_quantity }}
                    </span>
                </template>
                <template #filter="{ filterModel }">
                    <InputNumber v-model="filterModel.value" mode="decimal" useGrouping="false"
                        placeholder="Filter by stock" />
                </template>
            </Column>
            <Column field="sort_order" header="Sort Order" style="min-width: 8rem">
                <template #body="{ data }">
                        {{ data.sort_order }}
                </template>
            </Column>
            <Column header="Actions" :exportable="false" style="min-width: 8rem">
                <template #body="{ data }">
                    <div class="flex gap-2">
                        <Button 
                        :icon="renderIcon('pi pi-pencil', 'edit', data.product_id)" 
                        rounded outlined
                        severity="success" class="mr-2" @click="editProduct(data)" />
                        <Button 
                        :icon="renderIcon('pi pi-trash', 'delete', data.product_id)"
                        rounded outlined
                        severity="danger" @click="deleteProduct(data)" />
                    </div>
                </template>
            </Column>
        </DataTable>
    </div>
</template>

<style scoped>
.product-index {
    padding: 2rem;
}

.product-area {
    padding: 2rem;
    min-height: 200px;
    background-color: #f8f9fa;
}

.p-datatable .p-datatable-tbody>tr>td {
    padding: 1.5rem 1rem;
}

.p-button {
    border: none;
}

.p-card {
    background-color: #f8f9fa;
    border: none;
    box-shadow: none;
}

:deep(.p-datatable-tbody > tr) {
    height: 100px;
}
</style>