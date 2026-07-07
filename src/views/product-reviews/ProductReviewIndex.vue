<script setup>
import { ref, onMounted, computed } from 'vue';
import { useProductReviewStore } from '../../stores/productReview';
import { storeToRefs } from 'pinia';
import { useToast } from 'primevue/usetoast';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import SplitButton from 'primevue/splitbutton';
import Tag from 'primevue/tag';
import Dialog from 'primevue/dialog';
import router from '../../router';
import { formatFrontendDate } from '@/utils/DateUtil';

const productReviewStore = useProductReviewStore();
const productReviews = computed(() => productReviewStore.productReviews);
const { fb, selectedStatus } = storeToRefs(productReviewStore);
const selectedProductReviews = ref([]);

const toast = useToast();

// Modal state
const showModal = ref(false);
const selectedProductReview = ref(null);

const statusOptions = ['Pending', 'Approved', 'Spam', 'Trash', 'All'];


// Compute filtered product questions based on selected status
const filteredProductReviews = computed(() => {
    if (!selectedStatus.value || selectedStatus.value === 'All') {
        return productReviews.value;
    }
    return productReviews.value.filter(productReview => {
        switch (selectedStatus.value) {
            case 'Approved':
                return productReview.status === 1;
            case 'Pending':
                return productReview.status === 0;
            case 'Spam':
                return productReview.status === 2;
            case 'Trash':
                return productReview.status === 3;
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

const updateProductReviewStatus = async (productReview, newStatus) => {
    try {
        await productReviewStore.updateProductReview(productReview.product_review_id, { ...productReview, status: newStatus });
        toast.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Product review status updated successfully',
            life: 3000
        });
        productReviewStore.fetchProductReviews();
    } catch (error) {
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to update product review status',
            life: 3000
        });
    }
};

const getActionItems = (data) => {
    return [
        {
            label: 'Approve',
            icon: 'pi pi-check',
            command: () => updateProductReviewStatus(data, 1)
        },
        {
            label: 'Mark as Spam',
            icon: 'pi pi-ban',
            command: () => updateProductReviewStatus(data, 2)
        },
        {
            label: 'Trash',
            icon: 'pi pi-trash',
            command: () => updateProductReviewStatus(data, 3)
        },
        {
            separator: true
        },
        {
            label: 'Delete',
            icon: 'pi pi-times',
            class: 'p-error',
            command: () => deleteProductReview(data.product_review_id)
        }
    ];
};

const handleViewClick = (data) => {
    selectedProductReview.value = data;
    showModal.value = true;
};

const closeModal = () => {
    showModal.value = false;
    selectedProductReview.value = null;
};

onMounted(() => {
    productReviewStore.fetchProductReviews();
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

const deleteProductReview = async (productReviewId) => {
    try {
        await productReviewStore.deleteProductReview(productReviewId);
        toast.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Product review deleted successfully',
            life: 3000
        });
        productReviewStore.fetchProductReviews();
    } catch (error) {
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to delete product review',
            life: 3000
        });
    }
};

const deleteSelectedProductReviews = async () => {
    try {
        for (const productReview of selectedProductReviews.value) {
            await productReviewStore.deleteProductReview(productReview.product_review_id);
        }
        toast.add({
            severity: 'success',
            summary: 'Success',
            detail: `${selectedProductReviews.value.length} product reviews deleted successfully`,
            life: 3000
        });
        selectedProductReviews.value = [];
        productReviewStore.fetchProductReviews();
    } catch (error) {
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to delete selected product reviews',
            life: 3000
        });
    }
};

const onStatusChange = (status) => {
    productReviewStore.setStatus(status);
};

</script>

<template>
    
    <div class="product-review-index">
        <!-- Filter Container and Add Button in same line -->
        <div class="flex justify-between items-center">
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
                                productReviews.filter(productReview => {
                                    switch(status) {
                                        case 'Approved': return productReview.status === 1;
                                        case 'Pending': return productReview.status === 0;
                                        case 'Spam': return productReview.status === 2;
                                        case 'Trash': return productReview.status === 3;
                                        default: return false;
                                    }
                                }).length 
                            }})
                        </span>
                    </a>
                </div>
            </div>
        </div>

        <!-- Error Alert -->
        <div v-if="fb.errors.productReview" class="alert alert-danger" role="alert">
            {{ fb.errors.productReview }}
        </div>

        <!-- Loading Spinner -->
        <div v-if="fb.loading.productReview" class="text-center">
            <div class="spinner-border" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
        </div>

        <!-- Data Table -->
        <DataTable
            v-model:filters="filters"
            v-model:selection="selectedProductReviews"
            :value="filteredProductReviews"
            paginator
            :rows="10"
            dataKey="product_review_id"
            filterDisplay="menu"
            :loading="fb.loading.productReview"
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
                            v-if="selectedProductReviews && selectedProductReviews.length > 0"
                            type="button"
                            icon="pi pi-trash"
                            label="Delete Selected"
                            severity="danger"
                            @click="deleteSelectedProductReviews"
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

            <!-- Review Column -->
            <Column field="name" header="Name" :sortable="true" style="min-width: 350px">
                <template #body="{ data }">
                    <div class="flex flex-col">
                        <span>{{ data.content }}</span>
                    </div>
                </template>
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

            <!-- Product Column -->
            <Column field="review_count" header="Total Reviews" :sortable="true" style="width: 150px">
                <template #body="{ data }">
                    <span class="review-id">{{ data.review_count || '0' }}</span>
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
                    <span>{{ formatFrontendDate(data.created_at) }}</span>
                </template>
            </Column>

            <!-- Actions Column -->
            <Column header="Actions" :exportable="false" style="width: 100px">
                <template #body="{ data }">
                    <div class="flex gap-2">
                        <SplitButton
                            label="View" 
                            icon="pi pi-eye"
                            :model="getActionItems(data)"
                            severity="secondary"
                            text
                            class="p-button-sm"
                            @click="handleViewClick(data)"
                        />
                    </div>
                </template>
            </Column>

        </DataTable>

        <!-- Product Question Details Modal -->
        <Dialog 
            v-model:visible="showModal" 
            modal 
            header="Product Review Details" 
            :style="{ width: '70rem' }" 
            :breakpoints="{ '1199px': '85vw', '575px': '95vw' }"
            @hide="closeModal"
        >
            <div v-if="selectedProductReview" class="product-review-details">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <!-- Basic Information -->
                    <div class="space-y-6">
                        
                        <div class="detail-item">
                            <label class="detail-label">Author:</label>
                            <span class="detail-value">{{ selectedProductReview.author || 'N/A' }}</span>
                        </div>
                        
                        <div class="detail-item">
                            <label class="detail-label">Product ID:</label>
                            <span class="detail-value">{{ selectedProductReview.product_id || 'N/A' }}</span>
                        </div>
                        
                        <div class="detail-item">
                            <label class="detail-label">User ID:</label>
                            <span class="detail-value">{{ selectedProductReview.user_id }}</span>
                        </div>
                        
                        <div class="detail-item">
                            <label class="detail-label">Review Count:</label>
                            <span class="detail-value">{{ selectedProductReview.review_count || '0' }}</span>
                        </div>
                    </div>
                    
                    <!-- Status and Dates -->
                    <div class="space-y-6">
                        <div class="detail-item">
                            <label class="detail-label">Status:</label>
                            <Tag 
                                :value="getStatusText(selectedProductReview.status)" 
                                :severity="getStatusSeverity(selectedProductReview.status)" 
                            />
                        </div>
                        
                        <div class="detail-item">
                            <label class="detail-label">Created At:</label>
                            <span class="detail-value">{{ formatFrontendDate(selectedProductReview.created_at) }}</span>
                        </div>
                        
                        <div class="detail-item">
                            <label class="detail-label">Updated At:</label>
                            <span class="detail-value">{{ formatFrontendDate(selectedProductReview.updated_at) }}</span>
                        </div>
                        
                        <div class="detail-item">
                            <label class="detail-label">Parent ID:</label>
                            <span class="detail-value">{{ selectedProductReview.parent_id || 'N/A' }}</span>
                        </div>
                    </div>
                </div>
                
                <!-- Content Section -->
                <div class="mt-8">
                    <label class="detail-label block mb-3">Review Content:</label>
                    <div class="content-box">
                        {{ selectedProductReview.content || 'No content available' }}
                    </div>
                </div>
            </div>
            
            <template #footer>
                <div class="flex justify-end gap-3">
                    <Button 
                        label="Close" 
                        icon="pi pi-times" 
                        @click="closeModal" 
                        class="p-button-text"
                        size="large"
                    />
                </div>
            </template>
        </Dialog>
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

/* Modal Styles */
.product-review-details {
    padding: 1.5rem 0;
}

.detail-item {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 0.75rem 0;
    border-bottom: 1px solid #f3f4f6;
}

.detail-label {
    font-weight: 600;
    color: #374151;
    min-width: 140px;
    font-size: 1rem;
}

.detail-value {
    color: #1f2937;
    font-size: 1rem;
}

.content-box {
    background-color: #f9fafb;
    border: 1px solid #e5e7eb;
    border-radius: 0.5rem;
    padding: 1.5rem;
    min-height: 150px;
    font-size: 1rem;
    line-height: 1.6;
    color: #374151;
    white-space: pre-wrap;
    word-wrap: break-word;
}

:deep(.p-dialog) {
    .p-dialog-header {
        background-color: #f8fafc;
        border-bottom: 1px solid #e2e8f0;
        padding: 1.5rem 2rem;
    }
    
    .p-dialog-content {
        padding: 2rem;
    }
    
    .p-dialog-footer {
        background-color: #f8fafc;
        border-top: 1px solid #e2e8f0;
        padding: 1.5rem 2rem;
    }
    
    .p-dialog-title {
        font-size: 1.5rem;
        font-weight: 600;
    }
}
</style> 