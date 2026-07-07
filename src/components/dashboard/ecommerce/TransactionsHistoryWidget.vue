<script setup>
import { ref } from 'vue';
import { formatCurrency } from '@/utils/currency';
import { formatDate } from '@/utils/date';

const selectedTransactions = ref(null);

const emit = defineEmits(['show-transactions', 'show-transaction-details', 'edit-transaction']);
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
    },
    type: {
        type: String,
        required: true
    }
});

const menu = ref();
const items = ref([
    {
        items: [
            {
                label: 'Edit',
                icon: 'pi pi-pencil'
            },
            {
                label: 'Accept',
                icon: 'pi pi-check'
            },
        ]
    }
]);

const toggle = (event) => {
    menu.value.toggle(event);
};


const showTransactions = () => {
    emit('show-transactions', { title: props.title, transactions: props.transactions });
};

const editTransaction = (editData) => {
    emit('edit-transaction', { title: props.title, id: editData.id });
};

// const showTransactionDetails = (data) => {
//     emit('show-transaction-details', {title: props.title, data: data, type: props.type});
// };




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
    <div class="card xl:w-auto w-full xl:flex-1 !mb-0 flex-1 !px-7 !pb-7 !pt-6 border rounded-3xl border-surface flex flex-col justify-between overflow-hidden">
        <div class="flex items-center gap-2">
            <div class="flex-1 flex flex-col gap-1">
                <span class="label-medium"> {{ title }} Transactions History</span>
                <span class="body-xsmall text-left">{{ title === 'Recent Quotes' ? 'Track recent quotes from this area.' : 'Track recent orders from this area.' }}</span>
            </div>
            <Button label="See All" 
            severity="secondary" 
            outlined 
            iconPos="right"
            class="!text-surface-950 dark:!text-surface-0 !px-3 !py-1 !rounded-lg"
            :icon="fb.loading['dashboard.' + title.toLowerCase().replace(' ', '-') + '-widget-see-all'] ? 'pi pi-spinner pi-spin' : 'pi pi-chevron-right'"
            :pt="{
                    icon: {
                        class: '!text-xs'
                    }
                }"
            @click="showTransactions"/>
        </div>
        <div class="w-full overflow-auto flex-1 mt-5">
            <DataTable
                :rows="7"
                paginator
                paginatorTemplate="PrevPageLink PageLinks NextPageLink  CurrentPageReport RowsPerPageDropdown"
                currentPageReportTemplate="Showing page {currentPage} of {totalPages} pages"
                pt:pcpaginator:root="!bg-transparent"
                :loading="fb.loading['dashboard.' + title.toLowerCase().replace(' ', '-') + '-widget']"
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
                <!-- <Column selectionMode="multiple" headerStyle="width: 3rem" /> -->
                <!-- <Column field="name" header="Name">
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
                </Column> -->
                
                <!-- <Column field="reference" header="Reference">
                    <template #body="{ data }">
                        <div class="body-xsmall text-left">
                            {{ data.reference ?? '' }}
                        </div>
                    </template>
                </Column> -->

                <Column field="name" header="Name">
                    <template #body="{ data }">
                        <div class="flex items-center">
                            <Avatar
                                :label="data.name.capName"
                                class="mr-2 !w-8 !h-8 !text-xs font-medium"
                                size="small"
                                :style="{ backgroundColor: 'var(--p-' + data.name.bgColor + '-100)', color: 'var(--p-' + data.name.bgColor + '-950)' }"
                                shape="circle"
                            />
                            <div>
                                <div class="label-xsmall text-left text-surface-950 dark:text-surface-0">{{ (!data.name || !data.name.value) ? "N/A" : data.name.value }}</div>
                                <div class="label-xsmall text-left">{{ data.reference }}</div>
                            </div>
                        </div>
                        
                    </template>
                </Column>

                <Column field="description" header="Description">
                    <template #body="{ data }">
                        <div class="body-xsmall text-left">
                            {{ data.description ?? '' }}
                        </div>
                    </template>
                </Column>
                <Column field="amount" header="Amount">
                    <template #body="{ data }">
                        <div class="body-xsmall text-left" :style="{ color: data.amount.startsWith('+') ? 'var(--p-green-500)' : 'var(--p-red-500)' }">
                            {{ formatCurrency(data.amount) }}
                        </div>
                    </template>
                </Column>
                <!-- status column -->
                <Column field="status" header="Status">
                    <template #body="{ data }">
                      <Tag :severity="data.status === 'Pending' ? 'warn' : 'success'" 
                        :value="data.status"
                        pt:label:class="!font-normal !text-sm !capitalize" 
                        class="!px-2 !py-1 !rounded-lg !label-xsmall" />
                    </template>
                </Column>
                <!-- date column -->
                <Column field="date" header="Created">
                    <template #body="{ data }">
                        <div class="body-xsmall text-left">
                            {{ formatDate(data.date) }}
                        </div>
                    </template>
                </Column>
                <!-- updated at column -->
                <Column field="updated_at" header="Updated">
                    <template #body="{ data }">
                        <div class="body-xsmall text-left">
                            {{ formatDate(data.updated_at) }}
                        </div>
                    </template>
                </Column>
                <Column>
                    <template #body="{ data }">
                        <div class="flex items-end justify-end">
                            <!-- <button
                                @click="showTransactionDetails({title: props.title, data: data})"
                                class="text-right text-surface-700 dark:text-surface-300">
                                <i :class="fb.loading['dashboard.order-transaction-details.' + data.id] ? 'pi pi-spinner pi-spin' : 'pi pi-ellipsis-h'"/>
                            </button> -->

                            <Button type="button" icon="pi pi-ellipsis-v" @click="toggle" aria-haspopup="true" aria-controls="overlay_menu" size="small" 
                            severity="secondary" outlined />
                            <Menu ref="menu" id="overlay_menu" :model="items" :popup="true" @click="editTransaction(data)" />
                        </div>
                    </template>
                </Column>
            </DataTable>
        </div>
    </div>
</template>
