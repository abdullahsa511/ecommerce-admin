<script setup>
import { ref } from 'vue';

// const props = defineProps({
//     fb: {
//         type: Object,
//         required: false
//     },
//     recentOrdersWidget: {
//         type: Array,
//         required: true
//     }
// });
</script>

<template>
    <div class="card">
        <div class="card-header">
            <h1 class="text-xl font-bold">Customer Details</h1>
        </div>
        <div class="card-body">
            <div
                class="grid grid-cols-12 gap-6 rounded-xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-900 p-6">
                <!-- Left Column -->
                <div class="col-span-12 md:col-span-6">
                    <ul class="space-y-4">
                        <li>
                            <p class="text-xs text-surface-500 uppercase tracking-wide">
                                Customer Name
                            </p>
                            <p class="text-base font-medium text-surface-900 dark:text-surface-0">
                                Adadf
                            </p>
                        </li>

                        <li>
                            <p class="text-xs text-surface-500 uppercase tracking-wide">
                                Reference
                            </p>
                            <p class="text-base font-medium text-surface-900 dark:text-surface-0">
                                REF-1234567890
                            </p>
                        </li>

                        <li>
                            <p class="text-xs text-surface-500 uppercase tracking-wide">
                                Status
                            </p>
                            <span class="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400">
                                <span class="h-2 w-2 rounded-full bg-green-500"></span>
                                Pending
                            </span>
                        </li>
                    </ul>
                </div>

                <!-- Right Column -->
                <div class="col-span-12 md:col-span-6">
                    <ul class="space-y-4">
                        <li>
                            <p class="text-xs text-surface-500 uppercase tracking-wide">
                                Amount
                            </p>
                            <p class="text-lg font-semibold text-surface-900 dark:text-surface-0">
                                ৳12,450.00
                            </p>
                        </li>

                        <li>
                            <p class="text-xs text-surface-500 uppercase tracking-wide">
                                Date
                            </p>
                            <p class="text-base font-medium text-surface-900 dark:text-surface-0">
                                Jan 01, 2025
                            </p>
                        </li>
                    </ul>
                </div>
            </div>

        </div>
    </div>

    <div class="card">
        <div class="card-header">
            <h1 class="text-xl font-bold">Transaction Details</h1>
        </div>
        <div class="card-body">
            <DataTable>
                <Column field="order_reference" header="Order Reference">REF-1234567890</Column>
                <Column field="order_description" header="Order Description">Order Description</Column>
                <Column field="date" header="Date">2025-01-01</Column>
                <Column field="amount" header="Amount">12,450.00</Column>
            </DataTable>
        </div>
    </div>
</template>