<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import { useToast } from 'primevue/usetoast';
import { useShowroomContactStore } from '@/stores/showroomContact';
import Avatar from 'primevue/avatar';
import ManufacturerFilter from '@/filters/ManufacturerFilter';
import { resolveMediaImage, hasMediaImage } from '@/utils/mediaUrl';


const router = useRouter();
const showroomContactStore = useShowroomContactStore();
const { showroomContacts, fb } = storeToRefs(showroomContactStore);
const filters = ref({...new ManufacturerFilter()});
const toast = useToast();

const editShowroomContact = (data: any) => {
    router.push(`/showroom-contact/edit/${data.showroom_contact_id}`);
};

const deleteShowroomContact = async (data: any) => {
    try {
        await showroomContactStore.deleteShowroomContact(data.showroom_contact_id);
        toast.add({ severity: 'success', summary: 'Success', detail: 'Showroom Contact deleted successfully', life: 3000 });
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete showroom contact.', life: 3000 });
    }
};

const clearFilter = () => {
    filters.value = {...new ManufacturerFilter()};
};

const getShowroomContactImageLink = (data: any): string => resolveMediaImage(data.image);

const hasShowroomContactImage = (data: any): boolean => hasMediaImage(data.image);


onMounted(() => {
    showroomContactStore.fetchShowroomContacts();
    console.log('showroomContacts', showroomContacts.value);
    
});
</script>

<template>
    <div class="showroom-contact-index">
        <DataTable v-model:filters="filters" :value="showroomContacts" paginator :rows="10" dataKey="showroom_contact_id"
            filterDisplay="menu" :loading="fb.loading['showroomContact.list']"
            :globalFilterFields="['showroom_id', 'showroom_title', 'name']" selectionMode="multiple" class="th-table">
            <template #header>
                <div class="flex justify-between items-center">
                    <div class="flex gap-2">
                        <Button type="button" icon="pi pi-filter-slash" label="Clear" outlined @click="clearFilter()" />
                    </div>
                    <InputText v-model="filters['global'].value as string" placeholder="Keyword Search" />
                </div>
            </template>
            <template #empty> No Showroom Contacts to display! </template>
            <template #loading> Loading showroom contact data. Please wait. </template>

            <Column selectionMode="multiple" headerStyle="width: 3rem" />

            <Column field="image" header="Thumbnail" style="min-width: 8rem">
                <template #body="{ data }">
                    <a @click="editShowroomContact(data)" class="cursor-pointer">
                        <div v-if="hasShowroomContactImage(data)">
                            <img :src="getShowroomContactImageLink(data)" :alt="data.name" class="w-16 h-16 object-cover border-2 border-gray-200 hover:border-blue-500 transition-colors" />
                        </div>
                        <div v-else>
                            <Avatar 
                                :image="getShowroomContactImageLink(data)" 
                                :label="!data.image ? data.name?.charAt(0) : null"
                                shape="square" 
                                size="large" 
                            />
                        </div>
                       
                    </a>
                </template>
            </Column>

            <Column field="name" header="Name" style="min-width: 20rem" filter>
                <template #body="{ data }">
                    <a @click="editShowroomContact(data)"
                        class="text-blue-600 hover:text-blue-800 cursor-pointer hover:underline">
                        {{ data.name }}
                    </a>
                </template>
                <template #filter="{ filterModel, filterCallback }">
                    <InputText v-model="filterModel.value" type="text" @input="filterCallback()" class="p-column-filter"
                        placeholder="Search by name" />
                </template>
            </Column>

            <Column field="email" header="Email" style="min-width: 10rem" filter>
                <template #body="{ data }">
                        {{ data.email }}
                </template>
                <template #filter="{ filterModel }">
                    <InputText v-model="filterModel.value" type="text" class="p-column-filter"
                        placeholder="Search by email" />
                </template>
            </Column>

            <Column field="phone" header="Phone" style="min-width: 10rem" filter>
                <template #body="{ data }">
                        {{ data.phone }}
                </template>
                <template #filter="{ filterModel }">
                    <InputText v-model="filterModel.value" type="text" class="p-column-filter"
                        placeholder="Search by phone" />
                </template>
            </Column>
            <Column field="showroom_title" header="Showroom Title" style="min-width: 10rem" filter>
                <template #body="{ data }">
                    {{ data.showroom_title }}
                </template>
                <template #filter="{ filterModel }">
                    <InputText v-model="filterModel.value" type="text" class="p-column-filter"
                        placeholder="Search by showroom title" />
                </template>
            </Column>
            <Column field="status" header="Status" style="min-width: 10rem">
                <template #body="{ data }">
                    {{ data.status === 1 ? 'Active' : 'Inactive' }}
                </template>
            </Column>
            <Column field="sort_order" header="Sort Order" style="min-width: 10rem">
                <template #body="{ data }">
                    {{ data.sort_order }}
                </template>
            </Column>
            <Column header="Actions" :exportable="false" style="min-width: 8rem">
                <template #body="{ data }">
                    <div class="flex gap-2">
                        <Button 
                            :icon="fb.loading['showroomContact.update.'+data.showroom_contact_id] ? 'pi pi-spinner pi-spin' : 'pi pi-pencil'"
                            :loading="fb.loading['showroomContact.update.'+data.showroom_contact_id]"
                            rounded outlined 
                            severity="success" 
                            class="mr-2"
                            @click="editShowroomContact(data)" 
                        />
                        <Button 
                            :icon="fb.loading['showroomContact.delete.'+data.showroom_contact_id] ? 'pi pi-spinner pi-spin' : 'pi pi-trash'"
                            :loading="fb.loading['showroomContact.delete.'+data.showroom_contact_id]"
                            rounded outlined 
                            severity="danger" 
                            @click="deleteShowroomContact(data)"     
                        />
                    </div>
                </template>
            </Column>
        </DataTable>
    </div>
</template>


<style scoped>
</style>
