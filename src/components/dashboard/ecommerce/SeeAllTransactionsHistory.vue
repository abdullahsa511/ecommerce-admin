<script setup>
import { ref } from 'vue';

const selectedTransactions = ref(null);

const props = defineProps({
    fb: {
        type: Object,
        required: false
    },
    transactions: {
        type: Array,
        required: true
    },
    title: {
        type: String,
        required: true
    }
});

const emit = defineEmits(['show-transaction-details']);

const showTransactionDetails = (transaction) => {
    console.log(transaction);
    emit('show-transaction-details', transaction);
};

// const transactions = ref([
//     {
//         id: '1',
//         name: {
//             value: 'Jerome Bell',
//             bgColor: 'lime',
//             capName: 'JB'
//         },
//         date: 'May 5th, 2024',
//         amount: '+£12.875,98',
//         account: '**** **** 8288'
//     },
//     {
//         id: '2',
//         name: {
//             value: 'Annette Black',
//             bgColor: 'indigo',
//             capName: 'AB'
//         },
//         date: 'Mar 17th, 2024',
//         amount: '+€7.245,44',
//         account: '**** **** 9284'
//     },
//     {
//         id: '3',
//         name: {
//             value: 'Onyama Limba',
//             bgColor: 'rose',
//             capName: 'OL'
//         },
//         date: 'May 24th, 2024',
//         amount: '-₺76.276,90',
//         account: '**** **** 2534'
//     },
//     {
//         id: '4',
//         name: {
//             value: 'Courtney Henry',
//             bgColor: 'violet',
//             capName: 'CH'
//         },
//         date: 'Jun 28th, 2024',
//         amount: '-£2.875,98',
//         account: '**** **** 8288'
//     },
//     {
//         id: '5',
//         name: {
//             value: 'Dianne Russell',
//             bgColor: 'cyan',
//             capName: 'DR'
//         },
//         date: 'Jul 21th, 2024',
//         amount: '+$12.423,04',
//         account: '**** **** 8234'
//     },
//     {
//         id: '6',
//         name: {
//             value: 'Amy Elsner',
//             bgColor: 'yellow',
//             capName: 'AE'
//         },
//         date: 'Jul 21th, 2024',
//         amount: '+€17.876,24',
//         account: '**** **** 9284'
//     },
//     {
//         id: '7',
//         name: {
//             value: 'Arlene McCoy',
//             bgColor: 'blue',
//             capName: 'AM'
//         },
//         date: 'Jun 28th, 2024',
//         amount: '-$12.423,04',
//         account: '**** **** 8234'
//     },
//     {
//         id: '8',
//         name: {
//             value: 'Amy Elsner',
//             bgColor: 'yellow',
//             capName: 'AE'
//         },
//         date: 'Jul 21th, 2024',
//         amount: '+€17.876,24',
//         account: '**** **** 9284'
//     },
//     {
//         id: '9',
//         name: {
//             value: 'Arlene McCoy',
//             bgColor: 'blue',
//             capName: 'AM'
//         },
//         date: 'Jun 28th, 2024',
//         amount: '-$12.423,04',
//         account: '**** **** 8234'
//     }
// ]);
</script>

<template>
    <div class="card xl:w-auto w-full xl:flex-1 !mb-0 flex-1 !px-7 !pb-7 !pt-6 flex flex-col justify-between overflow-hidden">
        <div class="w-full overflow-auto flex-1 mt-5">
            <DataTable
                :rows="100"
                paginator
                paginatorTemplate="PrevPageLink PageLinks NextPageLink  CurrentPageReport RowsPerPageDropdown"
                currentPageReportTemplate="Showing page {currentPage} of {totalPages} pages"
                pt:pcpaginator:root="!bg-transparent"
                :loading="fb.loading['dashboard.' + title.toLowerCase().replace(' ', '-') + '-widget-see-all']"
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
                }"
                :dt="{
                    header: {
                        background: 'transparent'
                    },
                    headerCell: {
                        background: 'transparent'
                    },
                    row: {
                        background: 'transparent'
                    }
                }"
                v-model:selection="selectedTransactions"
                :value="transactions"
                dataKey="id"
                tableStyle="min-width: 40rem"
            >
                <Column selectionMode="multiple" headerStyle="width: 3rem" />
                <Column field="name" header="Name" sortable>
                    <template #body="{ data }">
                        <div class="flex items-center">
                            <Avatar
                                :label="data.name.capName"
                                class="mr-2 !w-8 !h-8 !text-xs font-medium"
                                size="small"
                                :style="{ backgroundColor: 'var(--p-' + data.name.bgColor + '-100)', color: 'var(--p-' + data.name.bgColor + '-950)' }"
                                shape="circle"
                            />
                            <div class="label-xsmall text-surface-950 dark:text-surface-0">{{ data.name.value }}</div>
                        </div>
                    </template>
                </Column>
                <Column field="date" header="Date" sortable>
                    <template #body="{ data }">
                        <div class="body-xsmall text-left">
                            {{ data.date }}
                        </div>
                    </template>
                </Column>
                <Column field="amount" header="Amount" sortable>
                    <template #body="{ data }">
                        <div class="body-xsmall text-left" :style="{ color: data.amount.startsWith('+') ? 'var(--p-green-500)' : 'var(--p-red-500)' }">
                            {{ data.amount }}
                        </div>
                    </template>
                </Column>
                <Column field="account" header="Account" sortable>
                    <template #body="{ data }">
                        <div class="body-xsmall text-left">
                            {{ data.account }}
                        </div>
                    </template>
                </Column>
                <!-- status column -->
                <Column field="status" header="Status" sortable>
                    <template #body="{ data }">
                        <Tag :severity="data.status === 'pending' ? 'warn' : 'success'" 
                        :value="data.status"
                        pt:label:class="!font-normal !text-sm !capitalize" 
                        class="!px-2 !py-1 !rounded-lg !label-xsmall" />
                    </template>
                </Column>
                <Column>
                    <template #body="{ data }">
                        <div class="flex items-end justify-end">
                            <button class="text-right text-surface-700 dark:text-surface-300" @click="showTransactionDetails(data)">
                                <i class="pi pi-ellipsis-h" />
                            </button>
                        </div>
                    </template>
                </Column>
            </DataTable>
        </div>
    </div>
</template>
