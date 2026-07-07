<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import { useToast } from 'primevue/usetoast';
import { useVendorStore } from '@/stores/vendor';
import Avatar from 'primevue/avatar';
import VendorFilter from "@/filters/VendorFilter.js";
import { resolveMediaImage, hasMediaImage } from '@/utils/mediaUrl';

const router = useRouter();
const vendorStore = useVendorStore();
const { vendors, fb } = storeToRefs(vendorStore);
const filters = ref({...new VendorFilter()});
const toast = useToast();

const editVendor = (data: any) => {
    router.push(`/ecommerce/products-vendors/edit/${data.vendor_id}`);
};

const deleteVendor = async (data: any) => {
    try {
        await vendorStore.deleteVendor(data.vendor_id);
        toast.add({ severity: 'success', summary: 'Success', detail: 'Vendor deleted successfully', life: 3000 });
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete vendor.', life: 3000 });
    }
};

const clearFilter = () => {
    filters.value = {...new VendorFilter()};
};

const getVendorImageLink = (data: any): string => resolveMediaImage(data.image);

const hasVendorImage = (data: any): boolean => hasMediaImage(data.image);


onMounted(() => {
    vendorStore.fetchVendors();
});
</script>

<template>
    <div class="vendor-index">
        <DataTable v-model:filters="filters" :value="vendors" paginator :rows="10" dataKey="vendor_id"
            filterDisplay="menu" :loading="fb.loading['vendor.list']"
            :globalFilterFields="['vendor_code', 'name']" selectionMode="multiple" class="th-table">
            <template #header>
                <div class="flex justify-between items-center">
                    <div class="flex gap-2">
                        <Button type="button" icon="pi pi-filter-slash" label="Clear" outlined @click="clearFilter()" />
                    </div>
                    <InputText v-model="filters['global'].value as string" placeholder="Keyword Search" />
                </div>
            </template>
            <template #empty> No Vendors to display! </template>
            <template #loading> Loading vendor data. Please wait. </template>

            <Column selectionMode="multiple" headerStyle="width: 3rem" />

            <Column field="image" header="Thumbnail" style="min-width: 8rem">
                <template #body="{ data }">
                    <a @click="editVendor(data)" class="cursor-pointer">
                        <div v-if="hasVendorImage(data)">
                            <img :src="getVendorImageLink(data)" :alt="data.name" class="w-16 h-16 object-cover border-2 border-gray-200 hover:border-blue-500 transition-colors" />
                        </div>
                        <div v-else>
                            <Avatar 
                                :image="getVendorImageLink(data)" 
                                :label="!data.image ? data.name?.charAt(0) : null"
                                shape="square" 
                                size="large" 
                            />
                        </div>
                       
                    </a>
                </template>
            </Column>

            <Column field="vendor_code" header="Vendor Code" style="min-width: 10rem" filter>
                <template #body="{ data }">
                    <a @click="editVendor(data)"
                        class="text-blue-600 hover:text-blue-800 cursor-pointer hover:underline">
                        {{ data.vendor_code }}
                    </a>
                </template>
                <template #filter="{ filterModel }">
                    <InputText v-model="filterModel.value" type="text" class="p-column-filter"
                        placeholder="Search by vendor code" />
                </template>
            </Column>

            <Column field="name" header="Name" style="min-width: 32rem" filter>
                <template #body="{ data }">
                    <a @click="editVendor(data)"
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
                            :icon="fb.loading['vendor.update.'+data.vendor_id] ? 'pi pi-spinner pi-spin' : 'pi pi-pencil'"
                            :loading="fb.loading['vendor.update.'+data.vendor_id]"
                            rounded outlined 
                            severity="success" 
                            class="mr-2"
                            @click="editVendor(data)" 
                        />
                        <Button 
                            :icon="fb.loading['vendor.delete.'+data.vendor_id] ? 'pi pi-spinner pi-spin' : 'pi pi-trash'"
                            :loading="fb.loading['vendor.delete.'+data.vendor_id]"
                            rounded outlined 
                            severity="danger" 
                            @click="deleteVendor(data)" 
                        />
                    </div>
                </template>
            </Column>
        </DataTable>
    </div>
</template>


<style scoped>
</style>
