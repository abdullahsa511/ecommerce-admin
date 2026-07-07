<script setup>
import { ref, onMounted, computed } from 'vue';
import { useCommentStore } from '../stores/comment';
import { storeToRefs } from 'pinia';
import { useToast } from 'primevue/usetoast';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import SplitButton from 'primevue/splitbutton';
import router from '../router';
import { formatFrontendDate } from '@/utils/DateUtil';

const commentStore = useCommentStore();
const comments = computed(() => commentStore.comments);
const { fb, selectedStatus } = storeToRefs(commentStore);
const selectedComments = ref([]);

const toast = useToast();

const statusOptions = ['Pending', 'Approved', 'Spam', 'Trash', 'All'];
const addComment = () => {
    router.push('/posts/add-comment');
}

// Compute filtered comments based on selected status
const filteredComments = computed(() => {
    if (!selectedStatus.value || selectedStatus.value === 'All') {
        return comments.value;
    }
    return comments.value.filter(comment => {
        switch (selectedStatus.value) {
            case 'Approved':
                return comment.status === 1;
            case 'Pending':
                return comment.status === 0;
            case 'Spam':
                return comment.status === 2;
            case 'Trash':
                return comment.status === 3;
            default:
                return true;
        }
    });
});

const getStatusSeverity = (status) => {
    const numStatus = Number(status);
    switch (numStatus) {
        case 1:
            return 'success';
        case 0:
            return 'warning';
        case 2:
            return 'danger';
        case 3:
            return 'info';
        default:
            return 'warning';
    }
};

const getStatusText = (status) => {
    const numStatus = Number(status);
    switch (numStatus) {
        case 1:
            return 'Approved';
        case 0:
            return 'Pending';
        case 2:
            return 'Spam';
        case 3:
            return 'Trash';
        default:
            return 'Unknown';
    }
};

const updateCommentStatus = async (comment, newStatus) => {
    try {
        await commentStore.updateComment(comment.comment_id, { ...comment, status: newStatus });
        toast.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Comment status updated successfully',
            life: 3000
        });
        commentStore.fetchComments();
    } catch (error) {
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to update comment status',
            life: 3000
        });
    }
};

const getActionItems = (data) => {
    return [
        {
            label: 'Approve',
            icon: 'pi pi-check',
            command: () => updateCommentStatus(data, 1)
        },
        {
            label: 'Mark as Spam',
            icon: 'pi pi-ban',
            command: () => updateCommentStatus(data, 2)
        },
        {
            label: 'Trash',
            icon: 'pi pi-trash',
            command: () => updateCommentStatus(data, 3)
        },
        {
            separator: true
        },
        {
            label: 'Delete',
            icon: 'pi pi-times',
            class: 'p-error',
            command: () => deleteComment(data.comment_id)
        }
    ];
};

const handleEditClick = (data) => {
    router.push(`/posts/edit-comments/${data.comment_id}`);
};

onMounted(() => {
    commentStore.fetchComments();
});

const filters = ref({
    global: { value: null, matchMode: 'contains' },
    name: { value: null, matchMode: 'contains' },
    author: { value: null, matchMode: 'contains' }
});

const clearFilter = () => {
    filters.value = {
        global: { value: null, matchMode: 'contains' },
        name: { value: null, matchMode: 'contains' },
        author: { value: null, matchMode: 'contains' }
    };
};

const deleteComment = async (commentId) => {
    try {
        await commentStore.deleteComment(commentId);
        toast.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Comment deleted successfully',
            life: 3000
        });
        commentStore.fetchComments();
    } catch (error) {
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to delete comment',
            life: 3000
        });
    }
};

const deleteSelectedComments = async () => {
    try {
        for (const comment of selectedComments.value) {
            await commentStore.deleteComment(comment.comment_id);
        }
        toast.add({
            severity: 'success',
            summary: 'Success',
            detail: `${selectedComments.value.length} comments deleted successfully`,
            life: 3000
        });
        selectedComments.value = [];
        commentStore.fetchComments();
    } catch (error) {
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to delete selected comments',
            life: 3000
        });
    }
};


const onStatusChange = (status) => {
    commentStore.setStatus(status);
};


</script>

<template>
    <div class="comment-index">
        <div class="flex justify-between items-center mb-4">
            <!-- Filter Container -->
            <div class="filter-container">
                <div class="status-menu flex gap-4">
                    <a 
                        v-for="status in statusOptions" 
                        :key="status"
                        href="#"
                        @click.prevent="onStatusChange(status)"
                        :class="[
                            'status-link px-4 py-2 -mb-px text-lg hover:text-blue-600',
                            selectedStatus === status 
                                ? 'border-b-2 border-blue-500 text-blue-600 font-semibold' 
                                : 'text-gray-500'
                        ]"
                    >
                        {{ status }}
                        <span v-if="status !== 'All'" class="ml-2 text-sm text-gray-400">
                            ({{ 
                                comments.filter(comment => {
                                    switch(status) {
                                        case 'Approved': return comment.status === 1;
                                        case 'Pending': return comment.status === 0;
                                        case 'Spam': return comment.status === 2;
                                        case 'Trash': return comment.status === 3;
                                        default: return false;
                                    }
                                }).length 
                            }})
                        </span>
                    </a>
                </div>
            </div>
            <div class="mb-4 flex justify-end">
            <Button 
                icon="pi pi-plus" 
                label="Add Comment" 
                severity="primary" 
                @click="addComment"
            />
        </div>
        </div>

        <!-- Error Alert -->
        <div v-if="fb.errors.comment" class="alert alert-danger" role="alert">
            {{ fb.errors.comment }}
        </div>

        <!-- Loading Spinner -->
        <div v-if="fb.loading.comment" class="text-center">
            <div class="spinner-border" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
        </div>

        <!-- Data Table -->
        <DataTable
            v-model:filters="filters"
            v-model:selection="selectedComments"
            :value="filteredComments"
            paginator
            :rows="10"
            dataKey="comment_id"
            filterDisplay="menu"
            :loading="fb.loading.comment"
            :globalFilterFields="['name', 'author']"
            class="p-datatable-lg"
        >
            <template #header>
                <div class="flex justify-between items-center">
                    <div class="flex gap-2">
                        <Button
                            type="button"
                            icon="pi pi-filter-slash"
                            label="Clear"
                            outlined
                            @click="clearFilter()"
                        />
                        <Button
                            v-if="selectedComments && selectedComments.length > 0"
                            type="button"
                            icon="pi pi-trash"
                            label="Delete Selected"
                            severity="danger"
                            @click="deleteSelectedComments"
                        />
                    </div>
                    <span class="p-input-icon-left">
                        <i class="pi pi-search" />
                        <InputText v-model="filters['global'].value" placeholder="Keyword Search" />
                    </span>
                </div>
            </template>

            <!-- Selection Column -->
            <Column selectionMode="multiple" headerStyle="width: 3rem" />

            <!-- Name Column -->
            <Column field="name" header="Name" :sortable="true" style="min-width: 400px">
                <template #body="{ data }">
                    <div class="flex flex-col">
                        <span>{{ data.content }}</span>
                    </div>
                </template>
                <!-- <template #filter="{ filterModel }">
                    <InputText
                        v-model="filterModel.value"
                        type="text"
                        class="p-column-filter"
                        placeholder="Search by name"
                    />
                </template> -->
            </Column>

            <!-- Author Column -->
            <Column field="author" header="Author" :sortable="true" style="min-width: 150px">
                <template #body="{ data }">
                    <div class="flex flex-col">
                        <span>{{ data.author }}</span>
                    </div>
                </template>
                <template #filter="{ filterModel }">
                    <InputText
                        v-model="filterModel.value"
                        type="text"
                        class="p-column-filter"
                        placeholder="Search by author"
                    />
                </template>
            </Column>

            <!-- Comments Count Column -->
            <Column field="comment_count" header="Comments" :sortable="true" style="width: 100px">
                <template #body="{ data }">
                    <span class="comments-count">{{ data.comment_count || '0' }}</span>
                </template>
            </Column>


            <!-- Status Column -->
            <Column field="status" header="Status" :sortable="true" style="width: 150px">
                <template #body="{ data }">
                    <Tag :value="getStatusText(data.status)" :severity="getStatusSeverity(data.status)" />
                </template>
            </Column>

            <Column field="date" header="Date" :sortable="true" style="width: 150px">
                <template #body="{ data }">
                    <span>{{ formatFrontendDate(data.date) }}</span>
                </template>
            </Column>

            <!-- Actions Column -->
            <Column header="Actions" :exportable="false" style="width: 100px">
                <template #body="{ data }">
                    <div class="flex gap-2">
                        <SplitButton
                            label="Edit" 
                            icon="pi pi-pencil"
                            :model="getActionItems(data)"
                            severity="secondary"
                            text
                            class="p-button-sm"
                            @click="handleEditClick(data)"
                        />
                    </div>
                </template>
            </Column>

        </DataTable>
    </div>
</template>

<style scoped>
:deep(.p-datatable .p-datatable-tbody > tr > td) {
    padding: 2rem 1rem;
    font-size: 1.2rem;
}

:deep(.p-datatable .p-datatable-thead > tr > th) {
    padding: 1rem;
}

:deep(.p-splitbutton) {
    .p-button {
        padding: 0.5rem 0.8rem;
        font-size: 1rem;
        background-color: #fcfcfc;
        border: 1px solid #e0dbdb;
        color: #666;
        &:hover {
            background-color: #F3F3F3;
            border-color: #e0dbdb;
            color: #666;
        }
    }
}

:deep(.p-datatable) {
    .p-datatable-header {
        background-color: transparent;
        border: none;
        padding: 0 0 1rem 0;
    }
}

</style> 