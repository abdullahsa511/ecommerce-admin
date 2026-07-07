<script setup>
import { formatCurrency } from '@/utils/currency';
import { formatDate } from '@/utils/date';
import { ref } from 'vue';

const selectedTransactions = ref(null);

const props = defineProps({
    fb: {
        type: Object,
        required: false
    },
    revenuePinboardDetails: {
        type: Array,
        required: true
    },
    cardType: {
        type: String,
        required: true
    }
});

const emit = defineEmits(['show-transaction-details']);

const showTransactionDetails = (transaction) => {
    console.log(transaction);
    emit('show-transaction-details', transaction);
};

const randomColor = (customer_name) => {
    const colors = ['#007bff', '#28a745', '#dc3545', '#ffc107', '#6f42c1', '#e83e8c', '#fd7e14', '#6c757d', '#343a40', '#1a1a1a', '#ffffff', '#4a4a4a', '#999999', '#666666', '#333333', '#000000', '#b3b3b3', '#d9d9d9', '#f2f2f2'];
    // Safely handle missing or non-string names
    const name = typeof customer_name === 'string' ? customer_name : String(customer_name || '');
    if (name.length === 0) {
        return '#6c757d'; // default neutral color
    }
    const index = Math.abs(name.length) % colors.length;
    return colors[index];
};
</script>

<template>
    <div
        class="card xl:w-auto w-full xl:flex-1 !mb-0 flex-1 !px-7 !pb-7 !pt-6 flex flex-col justify-between overflow-hidden">
        <div class="w-full overflow-auto flex-1 mt-5">
            <DataTable :rows="100" paginator 
                paginatorTemplate="PrevPageLink PageLinks NextPageLink  CurrentPageReport RowsPerPageDropdown"
                currentPageReportTemplate="Showing page {currentPage} of {totalPages} pages"
                pt:pcpaginator:root="!bg-transparent"
                :loading="fb && fb.loading ? fb.loading['dashboard.revenue-pinboard-details' + cardType] : false" 
                :pt="{
                    root: {
                        class: 'h-full flex flex-col justify-between'
                    },
                    thead: {
                        class: '!label-small'
                    },
                    tableContainer: {
                        class: '!flex-1'
                    }
                }" :dt="{
                    header: {
                        background: 'transparent'
                    },
                    headerCell: {
                        background: 'transparent'
                    },
                    row: {
                        background: 'transparent'
                    }
                }" v-model:selection="selectedTransactions" :value="revenuePinboardDetails" dataKey="id"
                tableStyle="min-width: 40rem">
                <!-- <Column selectionMode="multiple" headerStyle="width: 3rem" /> -->
                <Column header="Avatar" style="width: 35px">
                    <template #body="{ data }">
                        <div class="flex items-center">
                            <template v-if="data.avatar">
                                <img class="w-13 h-13 rounded-lg object-cover border border-surface-200 dark:border-surface-800"
                                    :src="data.avatar" alt="Customer Photo" style="width: 35px; height: 35px;" />
                            </template>
                            <template v-else>
                                <div class="w-13 h-13 rounded-lg flex items-center justify-center text-white text-xl font-semibold border border-surface-200 dark:border-surface-800"
                                    :style="{
                                        width: '35px',
                                        height: '35px',
                                        backgroundColor: randomColor(data.customer_name)
                                    }">
                                    {{ (data.customer_name && data.customer_name[0] ? data.customer_name[0] :
                                        '?').toUpperCase() }}
                                </div>
                            </template>
                        </div>
                    </template>
                </Column>
                <Column field="customer_name" header="Customer Name" sortable>
                    <template #body="{ data }">
                        <div class="flex items-center">
                            {{ data.customer_name }}
                        </div>
                    </template>
                </Column>
                <Column v-if="props.cardType !== 'Pinboard'" field="reference_number" header="Reference Number" sortable>
                    <template #body="{ data }">
                        <div class="flex items-center">
                            {{ data.reference }}
                        </div>
                    </template>
                </Column>
                <Column  v-if="props.cardType !== 'Pinboard'" field="description" header="Description" sortable>
                    <template #body="{ data }">
                        <div class="flex items-center">
                            {{ data.description }}
                        </div>
                    </template>
                </Column>
                <Column field="total" header="Amount" sortable>
                    <template #body="{ data }">
                        <div class="body-xsmall text-left">
                            {{ formatCurrency(data.total) }}
                        </div>
                    </template>
                </Column>
                <!-- <Column field="customer_name" header="Customer Name" sortable>
                        <template #body="{ data }">
                            <div class="flex items-center">
                                <Avatar
                                    :label="data.customer_name"
                                    class="mr-2 !w-8 !h-8 !text-xs font-medium"
                                    size="small"
                                    :style="{ backgroundColor: 'var(--p-' + data.customer_name + '-100)', color: 'var(--p-' + data.customer_name + '-950)' }"
                                    shape="circle"
                                />
                                <div class="label-xsmall text-surface-950 dark:text-surface-0">{{ data.customer_name }}</div>
                            </div>
                        </template>
                    </Column> -->
                <Column field="created_at" header="Created" sortable>
                    <template #body="{ data }">
                        <div class="body-xsmall text-left">
                            {{ formatDate(data.created_at) }}
                        </div>
                    </template>
                </Column>
                <Column v-if="props.cardType !== 'Pinboard'" field="updated_at" header="Updated" sortable>
                    <template #body="{ data }">
                        <div class="body-xsmall text-left">
                            {{ formatDate(data.updated_at) }}
                        </div>
                    </template>
                </Column>

                <Column  field="status" header="Status" sortable>
                    <template #body="{ data }">
                        <div class="body-xsmall text-left">
                            <Tag
                                :severity="{
                                    'pending': 'warn',
                                    'processing': 'info',
                                    'processed': 'info',
                                    'complete': 'success',
                                    'canceled': 'danger',
                                    'archived': 'secondary',
                                    'requires_action': 'help'
                                }[data.status] || 'secondary'"
                            :value="data.status"
                            pt:label:class="!font-normal !text-sm !capitalize" 
                            class="!px-2 !py-1 !rounded-lg !label-xsmall" />
                        </div>
                    </template>
                </Column>


                



                <Column>
                    <template #body="{ data }">
                        <div class="flex items-end justify-end">
                            <button class="text-right text-surface-700 dark:text-surface-300"
                                @click="showTransactionDetails(data)">
                                <i class="pi pi-ellipsis-h" />
                            </button>
                        </div>
                    </template>
                </Column>
            </DataTable>
        </div>
    </div>
</template>