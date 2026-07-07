<script setup>
import { ref, computed } from 'vue';
import ContextMenu from 'primevue/contextmenu';
import Dialog from 'primevue/dialog';
import { useToast } from 'primevue/usetoast';
import FeedbackHandler from '@/utils/FeedbackHandler';
import { mediaUrl } from '@/utils/mediaUrl';

const toast = useToast();

const emit = defineEmits([
    'onRowEditSave',
    'removeFileCallback',
    'removeUploadedFileCallback',
    'showImageModal',
    'reorderFiles',
    'delete-files',
]);

const props = defineProps({
    fb: { type: FeedbackHandler },
    files: { type: Array, required: true },
    columns: { type: Array, required: true },
    messages: { type: Array, required: true, default: () => [] },
    permissions: {
        type: Object,
        default: () => ({
            delete: true,
            copyLink: true,
            show: true,
            size:true
        })
    }
});

const cm = ref();
const menuModel = ref([]);
/** Row edit UI moved to dialog — row editor column removed (see commented template). */
const selectedRows = ref([]);
const selectedContextRow = ref(null);

const editDialogVisible = ref(false);
const editDraft = ref({});
const editContextRow = ref(null);
const editIndex = ref(-1);

const filesData = computed(() => props.files || []);

const onRemove = (file, index) => {
    emit('removeFileCallback', { file, index });
};

const onRemoveUploadedFile = (file, index) => {
    emit('removeUploadedFileCallback', file, index);
};

const onRowEditSave = (event) => {
    emit('onRowEditSave', event);
};

const formatSize = (bytes) => {
    const k = 1024;
    const dm = 3;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    if (bytes === 0) {
        return `0 ${sizes[0]}`;
    }

    const i = Math.floor(Math.log(bytes) / Math.log(k));
    const formattedSize = parseFloat((bytes / Math.pow(k, i)).toFixed(dm));

    return `${formattedSize} ${sizes[i]}`;
};

function isImagePreview(row) {
    const t = row.type || row.file?.type || '';
    return t.startsWith('image/') && !!(row.objectURL || row.image);
}

function getCacheSafeUrl(row) {
    let url = row?.objectURL || row?.image || '';
    if (!url || typeof url !== 'string') return '';
    if (url.startsWith('blob:') || url.startsWith('data:')) return url;

    url = mediaUrl(url);

    const version =
        row?.previewVersion ??
        row?.updated_at ??
        row?.updatedAt ??
        row?.lastModified ??
        row?.file?.lastModified;

    if (!version) return url;

    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}v=${encodeURIComponent(String(version))}`;
}

async function copyFileLink(row) {

 const url = mediaUrl(row?.file?.url || row?.objectURL || row?.image || '');
    // const url = getCacheSafeUrl(row);
    if (!url) {
        toast.add({
            severity: 'warn',
            summary: 'No link',
            detail: 'This file does not have a shareable URL yet.',
            life: 3000,
        });
        return;
    }

    try {
        await navigator.clipboard.writeText(url);
        toast.add({
            severity: 'info',
            summary: 'Link copied',
            detail: 'File link copied to clipboard.',
            life: 3000,
        });
    } catch (error) {
        console.error('Failed to copy file link:', error);
        toast.add({
            severity: 'error',
            summary: 'Copy failed',
            detail: 'Could not copy the link to clipboard.',
            life: 3000,
        });
    }
}

function fileKind(row) {
    const mime = row.type || row.file?.type || '';
    const name = row.name || '';
    if (mime.startsWith('image/')) {
        const sub = mime.split('/')[1]?.toUpperCase() || 'Image';
        return `${sub} image`;
    }
    if (mime === 'application/pdf') return 'PDF document';
    if (mime.includes('csv')) return 'CSV document';
    if (mime.includes('json')) return 'JSON document';
    if (/\.ics$/i.test(name) || mime.includes('calendar')) return 'Calendar';
    const ext = (name.split('.').pop() || '').toUpperCase();
    if (ext) return `${ext}`;
    return mime || 'File';
}

function formatDateAdded(row) {

    if(row?.created_at?.split(' ')[0]){
        const date = row?.created_at?.split(' ')[0];
        if (!date) return '—';
        const [year, month, day] = date.split('-');
        return `${day}-${month}-${year}`;
    }else{
        const raw = row.file?.lastModified ?? row.lastModified ?? row.dateAdded;
        if (raw == null || raw === '') return '—';
        const d = new Date(Number(raw));
        const now = new Date();
        const sameDay =
            d.getFullYear() === now.getFullYear() &&
            d.getMonth() === now.getMonth() &&
            d.getDate() === now.getDate();
        if (sameDay) {
            const time = new Intl.DateTimeFormat(undefined, {
                hour: 'numeric',
                minute: '2-digit',
            }).format(d);
            return `Today at ${time}`;
        }
        return new Intl.DateTimeFormat(undefined, {
            dateStyle: 'medium',
            timeStyle: 'short',
        }).format(d);
    }

    
    // end 

    // old code comment 08-06-2026
    
}

function getRowKey(row) {
    if (row == null) return '';
    const id = row.id;
    if (id != null && id !== '') return String(id);
    if (row.media_id != null && row.media_id !== '') return `media:${row.media_id}`;
    const name = row.name ?? row.file?.name ?? '';
    const pv = row.previewVersion ?? '';
    const lm = row.file?.lastModified ?? row.lastModified ?? '';
    return `row:${name}:${pv}:${lm}`;
}

function isRowInSelection(row) {
    const key = getRowKey(row);
    return (selectedRows.value || []).some((r) => getRowKey(r) === key);
}

/**
 * File-manager style: select row(s) first; right-click keeps selection if the row
 * is already selected, otherwise selects only that row (Finder-like).
 */
function onRowContextMenu(event) {
    const row = event.data;
    if (!isRowInSelection(row)) {
        selectedRows.value = [row];
    }
    menuModel.value = buildContextMenuItems(row, event.index);
    cm.value?.show(event.originalEvent);
}

// function openEditDialog(row, index) {
//     editContextRow.value = row;
//     editIndex.value = index;
//     const d = {};
//     for (const col of props.columns) {
//         d[col.field] = row[col.field] ?? '';
//     }
//     editDraft.value = d;
//     editDialogVisible.value = true;
// }

function confirmEdit() {
    const row = editContextRow.value;
    if (!row) return;
    const index = editIndex.value;
    const newData = { ...row };
    for (const col of props.columns) {
        newData[col.field] = editDraft.value[col.field] ?? '';
    }
    Object.assign(row, newData);
    onRowEditSave({
        originalEvent: new Event('save'),
        data: row,
        newData,
        field: undefined,
        index,
    });
    editDialogVisible.value = false;
    editContextRow.value = null;
}

function cancelEdit() {
    editDialogVisible.value = false;
    editContextRow.value = null;
}

/** Delete all currently selected rows (indices sorted descending so splices stay valid). */
function deleteSelectedRows(contextRow) {
    const rows = [...selectedRows.value];
    console.log('deleteSelectedRows', rows);
    emit('delete-files', rows);
}

function buildContextMenuItems_old(row, index) {
    const selected = selectedRows.value?.length ? [...selectedRows.value] : [];
    const uniqueByName = [];
    const seen = new Set();
    for (const item of selected) {
        const key = item?.name;
        if (!key || seen.has(key)) continue;
        seen.add(key);
        uniqueByName.push(item);
    }
    const selectedForPreview = uniqueByName.length > 0 ? uniqueByName : [row];

    return [
        // {
        //     label: 'Edit',
        //     icon: 'pi pi-fw pi-pencil',
        //     command: () => openEditDialog(row, index),
        // },
        {
            label: 'Delete',
            icon: 'pi pi-fw pi-trash',
            command: () => deleteSelectedRows(row),
        },
        {
            label: 'Copy Link',
            icon: 'pi pi-fw pi-link',
            command: () => copyFileLink(row),
        },
        {
            label: 'Show',
            icon: 'pi pi-fw pi-eye',
            command: () => emit('showImageModal', { file: row, files: selectedForPreview, index }),
        },
    ];
}

function buildContextMenuItems(row, index) {
    const selected = selectedRows.value?.length ? [...selectedRows.value] : [];
    const uniqueByName = [];
    const seen = new Set();

    for (const item of selected) {
        const key = item?.name;
        if (!key || seen.has(key)) continue;
        seen.add(key);
        uniqueByName.push(item);
    }

    const selectedForPreview = uniqueByName.length > 0 ? uniqueByName : [row];

    const items = [];

    // if (props.permissions.edit) {
    //     items.push({
    //         label: 'Edit',
    //         icon: 'pi pi-fw pi-pencil',
    //         command: () => openEditDialog(row, index),
    //     });
    // }

    if (props.permissions.delete) {
        items.push({
            label: 'Delete',
            icon: 'pi pi-fw pi-trash',
            command: () => deleteSelectedRows(row),
        });
    }

    if (props.permissions.copyLink) {
        items.push({
            label: 'Copy Link',
            icon: 'pi pi-fw pi-link',
            command: () => copyFileLink(row),
        });
    }

    if (props.permissions.show) {
        items.push({
            label: 'Show',
            icon: 'pi pi-fw pi-eye',
            command: () =>
                emit('showImageModal', {
                    file: row,
                    files: selectedForPreview,
                    index
                }),
        });
    }

    return items;
}

function onContextMenuHide() {
    selectedContextRow.value = null;
}

/** Extra row class so selection is obvious even when theme CSS differs. */
function rowClass(data) {
    const sel = selectedRows.value;
    if (!sel?.length) return '';
    const key = getRowKey(data);
    return sel.some((r) => getRowKey(r) === key) ? 'fm-row-selected' : '';
}

function onColReorder(event) {
    console.log('onColReorder', event);
}

function armRowDrag(event) {
    const row = event?.target?.closest?.('tr[data-pc-section="bodyrow"]');
    const cell = event?.target?.closest?.('td[data-pc-section="bodycell"]');
    if (!row || !cell) return;
    if (cell.classList.contains('fm-row-reorder-cell')) row.draggable = true;
}

function onRowReorder(event) {
    let reorderedRows = Array.isArray(event?.value) ? event.value : null;
    console.log('onRowReorder data table', reorderedRows);
    if (!reorderedRows) {
        const source = [...filesData.value];
        const from = Number(event?.dragIndex);
        const to = Number(event?.dropIndex);
        if (
            Number.isInteger(from) &&
            Number.isInteger(to) &&
            from >= 0 &&
            to >= 0 &&
            from < source.length &&
            to < source.length
        ) {
            const [moved] = source.splice(from, 1);
            source.splice(to, 0, moved);
            reorderedRows = source;
        } else {
            reorderedRows = source;
        }
    }
    emit('reorderFiles', reorderedRows);
}
</script>

<template>
    <div class="w-full upload-file-manager-wrap">
        <ContextMenu ref="cm" :model="menuModel" @hide="onContextMenuHide" />

        <Dialog
            v-model:visible="editDialogVisible"
            modal
            header="Edit"
            class="w-full max-w-md"
            :style="{ width: 'min(28rem, 100vw)' }"
            :dismissableMask="true"
            @hide="cancelEdit"
        >
            <div v-if="columns.length" class="flex flex-col gap-4">
                <div v-for="col of columns" :key="col.field" class="flex flex-col gap-1">
                    <label class="text-sm text-surface-600 dark:text-surface-400" :for="`edit-${col.field}`">{{
                        col.header
                    }}</label>
                    <InputText :id="`edit-${col.field}`" v-model="editDraft[col.field]" class="w-full" />
                </div>
            </div>
            <p v-else class="text-sm text-surface-500">No editable fields.</p>
            <template #footer>
                <Button label="Cancel" severity="secondary" text @click="cancelEdit" />
                <Button label="Save" icon="pi pi-check" @click="confirmEdit" />
            </template>
        </Dialog>
        <!-- Row: plain click = single row only; Ctrl/Cmd+click = add/remove (file-manager style). Checkboxes still multi-select without modifier. -->
        <DataTable
            :value="filesData"
            :dataKey="getRowKey"
            :rowClass="rowClass"
            :metaKeySelection="true"
            selectionMode="multiple"
            class="upload-file-manager-datatable"
            tableClass="upload-file-manager-table"
            tableStyle="min-width: 48rem"
            size="small"
            stripedRows
            showGridline
            contextMenu
            v-model:selection="selectedRows"
            v-model:contextMenuSelection="selectedContextRow"
            @row-contextmenu="onRowContextMenu"
            :reorderableColumns="true"
            @columnReorder="onColReorder"
            @rowReorder="onRowReorder"
            @mousedown="armRowDrag"
            >
            <Column selectionMode="multiple" headerStyle="width: 3rem" :reorderableColumn="false" />
            <Column rowReorder headerStyle="width: 3rem" bodyClass="fm-row-reorder-cell" :reorderableColumn="false" />
            <Column field="name" header="Name" :style="{ minWidth: '220px' }" sortable>
                <template #body="slotProps">
                    <!-- pointer-events-none: lets row <tr> receive click so PrimeVue toggles multi-select (img is treated as "clickable"). -->
                    <div class="flex items-center gap-2 min-w-0 pointer-events-none">
                        <div
                            class="fm-thumb shrink-0 overflow-hidden rounded border border-surface-200 dark:border-surface-600 bg-surface-100 dark:bg-surface-800"
                            style="width: 28px; height: 28px"
                        >
                            <img
                                v-if="isImagePreview(slotProps.data)"
                                role="presentation"
                                :alt="slotProps.data.name"
                                :src="getCacheSafeUrl(slotProps.data)"
                                class="h-full w-full object-cover"
                            />
                            <div v-else class="flex h-full w-full items-center justify-center">
                                <i class="pi pi-file text-surface-400 text-lg" aria-hidden="true" />
                            </div>
                        </div>
                        <div class="flex min-w-0 flex-1 flex-col gap-0.5">
                            <span class="truncate text-sm font-medium text-surface-900 dark:text-surface-0">{{
                                slotProps.data.name
                            }}</span>
                            <ProgressBar
                                v-if="
                                    props.fb.loading['component.images.upload'] &&
                                    slotProps.data.status?.name === 'Pending'
                                "
                                mode="indeterminate"
                                class="h-1 w-full max-w-[120px]"
                            />
                        </div>
                    </div>
                </template>
            </Column>

            <Column v-if="props.permissions.size" field="size" header="Size" headerStyle="text-right" style="width: 7rem" sortable>
                <template #body="slotProps">
                    <div
                        class="text-right text-sm tabular-nums text-surface-700 dark:text-surface-200 pointer-events-none"
                    >
                        {{ formatSize(slotProps.data.size) }}
                    </div>
                </template>
            </Column>

            <Column header="Kind" style="width: 10rem" sortable>
                <template #body="slotProps">
                    <span class="text-sm text-surface-700 dark:text-surface-200 pointer-events-none">{{
                        fileKind(slotProps.data)
                    }}</span>
                </template>
            </Column>

            <Column header="Date Added" style="width: 11rem" sortable>
                <template #body="slotProps">
                    <span class="text-sm text-surface-600 dark:text-surface-300 pointer-events-none">{{
                        formatDateAdded(slotProps.data)
                    }}</span>
                </template>
            </Column>

            <!-- <Column
                v-for="col of columns"
                :key="col.field"
                :field="col.field"
                :header="col.header"
                style="min-width: 8rem"
            >
                <template #body="slotProps">
                    <span class="text-sm text-surface-700 dark:text-surface-200 pointer-events-none">{{
                        slotProps.data[col.field]
                    }}</span>
                </template>
            </Column> -->
            <template v-if="messages?.length > 0" #footer>
                <Message
                    v-for="message of messages"
                    :key="message"
                    :class="{ 'mb-8': !files.length }"
                    severity="error"
                >
                    {{ message }}
                </Message>
            </template>
        </DataTable>
    </div>
</template>

<style scoped>
/* Selected row: PrimeVue `data-p-selected`, `rowClass` fallback, optional `p-highlight`. */
.upload-file-manager-wrap
    :deep(
        .upload-file-manager-datatable
            tr:is([data-p-selected='true'], .fm-row-selected, .p-datatable-selectable-row.p-highlight)
    ) {
    background: #0a84ff !important;
    color: #fff !important;
}
.upload-file-manager-wrap
    :deep(
        .upload-file-manager-datatable
            tr:is([data-p-selected='true'], .fm-row-selected, .p-datatable-selectable-row.p-highlight)
            [class*='text-surface']
    ) {
    color: #fff !important;
}
.upload-file-manager-wrap
    :deep(
        .upload-file-manager-datatable
            tr:is([data-p-selected='true'], .fm-row-selected, .p-datatable-selectable-row.p-highlight)
            .fm-thumb
    ) {
    border-color: rgba(255, 255, 255, 0.35) !important;
}

.upload-file-manager-wrap :deep(.upload-file-manager-datatable .fm-row-reorder-cell) {
    cursor: default;
}

.upload-file-manager-wrap
    :deep(.upload-file-manager-datatable .fm-row-reorder-cell .p-datatable-reorderable-row-handle) {
    cursor: grab;
    pointer-events: auto;
    touch-action: none;
}
</style>
