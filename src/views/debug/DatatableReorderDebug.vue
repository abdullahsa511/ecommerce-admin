<script setup>
import { ref } from 'vue';
import { useToast } from 'primevue/usetoast';

const toast = useToast();

const columns = ref([
    { field: 'code', header: 'Code' },
    { field: 'name', header: 'Name' },
    { field: 'category', header: 'Category' },
    { field: 'quantity', header: 'Quantity' },
]);

const products = ref([
    { id: 1, code: 'P-100', name: 'Alpha', category: 'Office', quantity: 10 },
    { id: 2, code: 'P-101', name: 'Beta', category: 'Outdoor', quantity: 6 },
    { id: 3, code: 'P-102', name: 'Gamma', category: 'Lighting', quantity: 18 },
    { id: 4, code: 'P-103', name: 'Delta', category: 'Furniture', quantity: 3 },
    { id: 5, code: 'P-104', name: 'Epsilon', category: 'Textile', quantity: 12 },
]);

const onColReorder = () => {
    toast.add({ severity: 'success', summary: 'Column Reordered', life: 2000 });
};

const onRowReorder = (event) => {
    products.value = event.value;
    toast.add({ severity: 'success', summary: 'Rows Reordered', life: 2000 });
    console.log('onRowReorder', event);
};

const onDragStart = (event) => {
    const handle = event?.target?.closest?.('.p-datatable-reorderable-row-handle');
    if (!handle) return;
    console.log('row drag start detected');
};

const onMouseDownDebug = (event) => {
    const target = event?.target;
    const row = target?.closest?.('tr[data-pc-section="bodyrow"]');
    const cell = target?.closest?.('td[data-pc-section="bodycell"]');

    if (!row || !cell) return;

    const isFirstCell = cell === row.children?.[0];
    if (!isFirstCell) return;

    // Force draggable on first-cell mousedown to bypass fragile handle hit-testing.
    row.draggable = true;

    console.log('row mousedown debug', {
        targetTag: target?.tagName,
        targetSection: target?.getAttribute?.('data-pc-section'),
        parentSection: target?.parentElement?.getAttribute?.('data-pc-section'),
        rowDraggable: row.draggable,
    });
};
</script>

<template>
    <div class="p-4">
        <h2 class="mb-3 text-lg font-semibold">PrimeVue DataTable Reorder Debug</h2>
        <p class="mb-4 text-sm text-surface-600">
            Drag rows by the left handle. Check browser console for <code>row drag start detected</code> and
            <code>onRowReorder</code>.
        </p>

        <DataTable
            :value="products"
            dataKey="id"
            :reorderableColumns="true"
            @columnReorder="onColReorder"
            @rowReorder="onRowReorder"
            @dragstart.capture="onDragStart"
            @mousedown="onMouseDownDebug"
            tableStyle="min-width: 50rem"
        >
            <Column rowReorder headerStyle="width: 3rem" :reorderableColumn="false" />
            <Column v-for="col of columns" :key="col.field" :field="col.field" :header="col.header" />
        </DataTable>

        <Toast />
    </div>
</template>

<style scoped>
/* PrimeVue enables row dragging only when mousedown starts on the reorder handle.
   Expand the handle to fill the whole cell so dragging does not feel random. */
:deep(.p-datatable-tbody > tr > td:first-child) {
    padding: 0 !important;
}

:deep(.p-datatable-reorderable-row-handle) {
    width: 100%;
    height: 2.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: grab;
}
</style>
