<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import { useToast } from 'primevue/usetoast';
import { useManufacturerStore } from '@/stores/manufacturer';
import Avatar from 'primevue/avatar';
import ManufacturerFilter from '@/filters/ManufacturerFilter';
import { resolveMediaImage, hasMediaImage } from '@/utils/mediaUrl';


const router = useRouter();
const manufacturerStore = useManufacturerStore();
const { manufacturers, fb } = storeToRefs(manufacturerStore);
const filters = ref({...new ManufacturerFilter()});
const toast = useToast();

const editManufacturer = (data: any) => {
    router.push(`/ecommerce/products-manufacturers/edit/${data.manufacturer_id}`);
};

const deleteManufacturer = async (data: any) => {
    try {
        await manufacturerStore.deleteManufacturer(data.manufacturer_id);
        toast.add({ severity: 'success', summary: 'Success', detail: 'Manufacturer deleted successfully', life: 3000 });
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete manufacturer.', life: 3000 });
    }
};

const clearFilter = () => {
    filters.value = {...new ManufacturerFilter()};
};

const getManufacturerImageLink = (data: any): string => resolveMediaImage(data.image);

const hasManufacturerImage = (data: any): boolean => hasMediaImage(data.image);


onMounted(() => {
    manufacturerStore.fetchManufacturers();
    console.log('manufacturers', manufacturers.value);
    
});
</script>

<template>
    <div class="manufacturer-index">
        <DataTable v-model:filters="filters" :value="manufacturers" paginator :rows="10" dataKey="manufacturer_id"
            filterDisplay="menu" :loading="fb.loading['manufacturer.list']"
            :globalFilterFields="['manufacturer_code', 'name']" selectionMode="multiple" class="th-table">
            <template #header>
                <div class="flex justify-between items-center">
                    <div class="flex gap-2">
                        <Button type="button" icon="pi pi-filter-slash" label="Clear" outlined @click="clearFilter()" />
                    </div>
                    <InputText v-model="filters['global'].value as string" placeholder="Keyword Search" />
                </div>
            </template>
            <template #empty> No Manufacturers to display! </template>
            <template #loading> Loading manufacturer data. Please wait. </template>

            <Column selectionMode="multiple" headerStyle="width: 3rem" />

            <Column field="image" header="Thumbnail" style="min-width: 8rem">
                <template #body="{ data }">
                    <a @click="editManufacturer(data)" class="cursor-pointer">
                        <div v-if="hasManufacturerImage(data)">
                            <img :src="getManufacturerImageLink(data)" :alt="data.name" class="w-16 h-16 object-cover border-2 border-gray-200 hover:border-blue-500 transition-colors" />
                        </div>
                        <div v-else>
                            <Avatar 
                                :image="getManufacturerImageLink(data)" 
                                :label="!data.image ? data.name?.charAt(0) : null"
                                shape="square" 
                                size="large" 
                            />
                        </div>
                       
                    </a>
                </template>
            </Column>

            <Column field="manufacturer_code" header="Manufacturer Code" style="min-width: 10rem" filter>
                <template #body="{ data }">
                    <a @click="editManufacturer(data)"
                        class="text-blue-600 hover:text-blue-800 cursor-pointer hover:underline">
                        {{ data.manufacturer_code }}
                    </a>
                </template>
                <template #filter="{ filterModel }">
                    <InputText v-model="filterModel.value" type="text" class="p-column-filter"
                        placeholder="Search by manufacturer code" />
                </template>
            </Column>

            <Column field="name" header="Name" style="min-width: 32rem" filter>
                <template #body="{ data }">
                    <a @click="editManufacturer(data)"
                        class="text-blue-600 hover:text-blue-800 cursor-pointer hover:underline">
                        {{ data.name }}
                    </a>
                </template>
                <template #filter="{ filterModel, filterCallback }">
                    <InputText v-model="filterModel.value" type="text" @input="filterCallback()" class="p-column-filter"
                        placeholder="Search by name" />
                </template>
            </Column>

            <Column header="Actions" :exportable="false" style="min-width: 8rem">
                <template #body="{ data }">
                    <div class="flex gap-2">
                        <Button 
                            :icon="fb.loading['manufacturer.update.'+data.manufacturer_id] ? 'pi pi-spinner pi-spin' : 'pi pi-pencil'"
                            :loading="fb.loading['manufacturer.update.'+data.manufacturer_id]"
                            rounded outlined 
                            severity="success" 
                            class="mr-2"
                            @click="editManufacturer(data)" 
                        />
                        <Button 
                            :icon="fb.loading['manufacturer.delete.'+data.manufacturer_id] ? 'pi pi-spinner pi-spin' : 'pi pi-trash'"
                            :loading="fb.loading['manufacturer.delete.'+data.manufacturer_id]"
                            rounded outlined 
                            severity="danger" 
                            @click="deleteManufacturer(data)"     
                        />
                    </div>
                </template>
            </Column>
        </DataTable>
    </div>
</template>


<style scoped>
</style>
