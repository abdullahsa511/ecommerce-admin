<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import { useToast } from 'primevue/usetoast';
import { useQuoteStore } from '@/stores/quote';
import QuoteFilter from '@/filters/QuoteFilter';

const router = useRouter();
const quoteStore = useQuoteStore();
const { quotes, fb } = storeToRefs(quoteStore);
const filters = ref({...new QuoteFilter()});
const toast = useToast();

const editQuote = (data: any) => {
    router.push(`/ecommerce/sales/quotes/edit/${data.quote_id}`);
};

const viewQuote = (data: any) => {
    router.push(`/ecommerce/sales/quotes/item/${data.quote_id}`);
};

const deleteQuote = async (data: any) => {
    try {
        await quoteStore.deleteQuote(data.quote_id);
        toast.add({ severity: 'success', summary: 'Success', detail: 'Quote deleted successfully', life: 3000 });
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete quote.', life: 3000 });
    }
};

const clearFilter = () => {
    filters.value = {...new QuoteFilter()};
};
const renderIcon = (icon: string, action: string, id: number) => {
    const loadingKey = `quote.${action}.${id}`;
    return fb.value.loading[loadingKey] ? 'pi pi-spinner pi-spin' : icon;
};



watch(quotes.value, () => {

});

onMounted(() => {
    console.log('quote list page', quotes);
    
    quoteStore.fetchQuotes();
});
</script>

<template>
    <div class="quote-index">
        <DataTable v-model:filters="filters" :value="quotes" paginator :rows="100" dataKey="quote_id"
            filterDisplay="menu" :loading="fb.loading['quote.list']"
            :globalFilterFields="['name', 'customer', 'location']" selectionMode="multiple" class="th-table">
            <template #header>
                <div class="flex justify-between items-center">
                    <div class="flex gap-2">
                        <Button type="button" icon="pi pi-filter-slash" label="Clear" outlined @click="clearFilter()" />
                    </div>
                    <InputText v-model="filters['global'].value" placeholder="Keyword Search" />
                </div>
            </template>
            <template #empty> No Quotes to display! </template>
            <template #loading>
            <div class="flex items-center justify-center gap-2 py-8">
                <i class="pi pi-spinner pi-spin" style="font-size: 2rem;"></i>
            </div>
            </template>
            <Column selectionMode="multiple" headerStyle="width: 3rem" />


            <Column field="quoteDetails.referenceNumber" header="Reference Number" style="min-width: 8rem">
                <template #body="{ data }">
                    <a 
                        @click="editQuote(data)" 
                        class="cursor-pointer"
                    >
                        {{ data.quoteDetails.referenceNumber }}
                    </a>
                </template>
            </Column>

            <Column field="name" header="Quote Name" style="min-width: 12rem" sortable>
                <template #body="{ data }">
                    <a 
                        @click="editQuote(data)" 
                        class="text-blue-600 hover:text-blue-800 cursor-pointer hover:underline"
                    >
                        {{ data.quoteDetails.jobTitle }}
                    </a>
                </template>
                <template #filter="{ filterModel }">
                    <InputText v-model="filterModel.value" placeholder="Search by name" />
                </template>
            </Column>

            <Column field="customerName" header="Customer" style="min-width: 10rem">
                <template #body="{ data }">
                    {{ data.quoteDetails.customerName }}
                </template>
            </Column>

            <Column field="location" header="Location" style="min-width: 8rem">
                <template #body="{ data }">
                    <span v-if="data.quoteDetails.location">
                        {{ data.quoteDetails.location }}
                    </span>
                    <span v-else>
                        N/A
                    </span>
                </template>
            </Column>
            
            <Column header="Actions" :exportable="false" style="min-width: 8rem">
                <template #body="{ data }">
                    <div class="flex gap-2">
                        <Button 
                            :icon="renderIcon('pi pi-eye', 'view', data.quote_id)" 
                            rounded 
                            outlined 
                            severity="info" 
                            class="mr-2"
                            @click="viewQuote(data)"
                        />
                        <Button 
                            :icon="renderIcon('pi pi-pencil', 'edit', data.quote_id)" 
                            rounded 
                            outlined 
                            severity="success" 
                            class="mr-2"
                            @click="editQuote(data)"
                        />
                        <Button 
                            :icon="renderIcon('pi pi-trash', 'delete', data.quote_id)"
                            rounded 
                            outlined 
                            severity="danger"
                            @click="deleteQuote(data)"
                        />
                    </div>
                </template>
            </Column>
        </DataTable>
    </div>
</template>


<style scoped>

</style>
