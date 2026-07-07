<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useProductFinishStore } from '@/stores/productFinish';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import ProductFinishFilter from '@/filters/ProductFinishFilter';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Avatar from 'primevue/avatar';
import ProductFinish from '@/models/ProductFinish';

const router = useRouter();
const productFinishStore = useProductFinishStore();

const filters = ref(new ProductFinishFilter());

const selectedFinishes = ref<ProductFinish[]>([]);
const finishNames = computed(() => productFinishStore.productFinishes.map((finish: ProductFinish) => finish.name));

const { productFinishes, fb } = storeToRefs(productFinishStore);
 
const serverUrl = import.meta.env.VITE_API_BASE_URL; 
const finishesWithFullThumbnail = computed(() =>
  productFinishes.value.map((finish: ProductFinish) => ({
    ...finish,
    thumbnail: finish.thumbnail && !finish.thumbnail.startsWith('http')
      ? serverUrl + finish.thumbnail
      : finish.thumbnail
  }))
);

const isLoading = computed(() => {
    return fb?.value?.loading === true;
});

const fetchProductFinishes = async () => {
    await productFinishStore.fetchProductFinishes();
};

const addFinish = () => {
    router.push('/ecommerce/products/add-finish');
};

const editFinish = (data: ProductFinish) => {
    console.log("Edit Finish: ", data);
    router.push(`/ecommerce/products/edit-finish/${data.finish_id}`);
};

const deleteFinish = async (data: ProductFinish) => {
    await productFinishStore.deleteProductFinish(data.finish_id!);
};

const deleteSelectedFinishes = async () => {
    if (selectedFinishes.value.length > 0) {
        for (const finish of selectedFinishes.value) {
            await productFinishStore.deleteProductFinish(finish.finish_id!);
        }
        selectedFinishes.value = [];
    }
};

onMounted(() => {
    fetchProductFinishes();
});

const clearFilter = () => {
    initFilters()
}

const initFilters = () => {
    filters.value = new ProductFinishFilter();
}
</script>

<template>
    <div class="product-finish-index">
        <div class="mb-4 flex justify-end">
            <Button 
                icon="pi pi-plus" 
                label="Add Finish" 
                severity="primary" 
                @click="addFinish"
            />
        </div>

        <DataTable
            v-model:filters="filters"
            v-model:selection="selectedFinishes"
            :value="finishesWithFullThumbnail"
            paginator
            :rows="10"
            dataKey="finish_id"
            filterDisplay="menu"
            :loading="isLoading"
            :globalFilterFields="['name', 'slug', 'description']"
            selectionMode="multiple"
            class="th-table"
        >
            <template #header>
                <div class="flex justify-between items-center">
                    <div class="flex gap-2">
                        <Button
                            type="button"
                            icon="pi pi-filter-slash"
                            label="Clear"
                            outlined
                            @click="clearFilter()"
                        />
                        <Button
                            v-if="selectedFinishes.length > 0"
                            type="button"
                            icon="pi pi-trash"
                            label="Delete Selected"
                            severity="danger"
                            @click="deleteSelectedFinishes"
                        />
                    </div>
                    <InputText v-model="filters['global'].value" placeholder="Keyword Search" />
                </div>
            </template>
            <template #empty> No product finishes found. </template>
            <template #loading> Loading product finishes data. Please wait. </template>

            <Column selectionMode="multiple" headerStyle="width: 3rem" />

            <Column header="Thumbnail" style="width: 100px">
                <template #body="{ data }">
                    <Avatar 
                        :image="data.thumbnail" 
                        :label="!data.thumbnail ? data.name?.charAt(0) : null"
                        shape="circle" 
                        size="large" 
                    />
                </template>
            </Column>
            
            <Column header="Name" filterField="name" :showFilterMatchModes="false" :filterMenuStyle="{ width: '14rem' }" style="min-width: 12rem">
                <template #body="{ data }">
                    <a 
                        @click="editFinish(data)" 
                        class="text-blue-600 hover:text-blue-800 cursor-pointer hover:underline"
                    >
                        {{ data.name }}
                    </a>
                </template>
            </Column>

            <Column field="slug" header="Slug" style="min-width: 12rem">
                <template #body="{ data }">
                    {{ data.slug }}
                </template>
            </Column>

            <Column field="description" header="Description" style="min-width: 22rem">
                <template #body="{ data }">
                    {{ data.description }}
                </template>
            </Column>

            <Column field="date_added" header="Date Added" style="min-width: 12rem">
                <template #body="{ data }">
                    {{ new Date(data.date_added).toLocaleDateString() }}
                </template>
            </Column>
            
            <Column header="Actions" :exportable="false" style="min-width: 8rem">
                <template #body="{ data }">
                    <div class="flex gap-2">
                        <Button 
                            icon="pi pi-pencil" 
                            rounded 
                            outlined 
                            severity="success" 
                            class="mr-2 p-button-secondary"
                            @click="editFinish(data)"
                        />
                        <Button 
                            icon="pi pi-trash" 
                            rounded 
                            outlined 
                            severity="danger"
                            class="p-button-danger"
                            @click="deleteFinish(data)"
                        />
                    </div>
                </template>
            </Column>
        </DataTable>
    </div>
</template>

<style scoped>
.product-finish-index {
    padding: 2rem;
}

.p-datatable .p-datatable-thead > tr > th {
    background-color: var(--surface-100);
}

.p-datatable .p-datatable-tbody > tr > td {
    padding: 1rem;
}
</style>
