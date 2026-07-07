<script setup lang="ts">
import { computed, onMounted, PropType, ref, watch } from 'vue';
import { ProductOption, ProductOptionGroup } from '@/models/Product.ts';
import Button from 'primevue/button';
import OptionForm from '@/views/products/components/variant-option/OptionForm.vue';


const emit = defineEmits(['searchOptions', 
'add:option', 
'delete:option', 
'insert:option',
'update:option', 
'updateExpandedRowOption:update',
'add:type',
'searchTypes',
'inputOption',
'upload:optionImage',
'remove:optionImage'
])

const props = defineProps({
    showHiddenButton: {
        type: Boolean,
        default: true
    },
    optionGroup: {
        type: ProductOptionGroup,
        required: true,
        default: () => new ProductOptionGroup()
    },
    optionSuggestions: {
        type: Array as PropType<any[]>,
        required: false,
        default: () => []
    },
    typeSuggestions: {
        type: Array as PropType<any[]>,
        required: false,
        default: () => []
    },
})

const selectedOption = ref<ProductOption>(new ProductOption({product_option_group_id: props.optionGroup.product_option_group_id as number}));
const showAddOptionCard = ref(false);
const expandedRows = ref<Record<number, boolean>>({});

//Local variables
const optionList = computed(() => {
    return props.optionGroup.productOptions;
});


const editOption = (option: ProductOption, index: number) => {
    let status = !option.active;
    props.optionGroup.productOptions.forEach(o => o.active = false);
    option.active = status;
    props.optionGroup.productOptions[index] = option;
    // selectedOption.value = option;
};

const handleSave = (data: any, index: number) => {
    expandedRows.value[index] = false;
};

const deleteOption = async (data: any) => {
   emit('delete:option', data)
};

const renderIcon = (icon: string, _action: string, _id: number) => {
    return icon;
};

const toggleAddOption = () => {
    showAddOptionCard.value = !showAddOptionCard.value;
    if(!props.optionGroup.product_option_group_id){
        props.optionGroup.product_option_group_id = "_new_100";
        props.optionGroup.isNew = true;
    }
    props.optionGroup.productOptions.forEach(o => o.active = false);
}

const searchOptions = (event: any) => {
    emit('searchOptions', event)
}
const searchTypes = (event: any) => {
    emit('searchTypes', event)
}
const handleAddOption = (event: any, index: number) => {
    selectedOption.value = new ProductOption(event);
    console.log('handleAddOption', selectedOption.value);
    emit('add:option', {...event, index});
}
const handleInsertOption = (event: any) => {
    if(!event?.product_option_group_id){
        event.product_option_group_id = "_new_100";
    }
    emit('insert:option', event)
    showAddOptionCard.value = false;
}
const handleAddType = (event: any, option: ProductOption) => {
    emit('add:type', event)
    if(option){
        selectedOption.value = option;
        selectedOption.value.type = event.type.type;
        selectedOption.value.type_id = event.type.type_id;
    }
}
const handleUpdateOption = (event: any) => {
    emit('update:option', event)
}
const inputOption = (data: any) => {
    emit('inputOption', data)
}
const handleUploadOptionImage = (event: any) => {
    emit('upload:optionImage', event)
}
const handleRemoveOptionImage = (event: any) => {
    emit('remove:optionImage', event)
}

onMounted(() => {
})

</script>

<template>
    <div class="option-add-form mt-5">
        
        <Button 
            label="Add Option"
            :icon="showAddOptionCard ? 'pi pi-minus' : 'pi pi-plus'" 
            severity="secondary"
            rounded 
            @click="toggleAddOption"
        />
    </div>
    <!-- add option form -->
    <transition
        enter-active-class="transition-all duration-500 ease-in-out"
        leave-active-class="transition-all duration-300 ease-in-out"
        enter-from-class="opacity-0 -translate-y-8"
        enter-to-class="opacity-100 translate-y-0"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 -translate-y-8">
        <div v-show="showAddOptionCard" class="border mt-3" >
            <div class="form-container">
                <OptionForm 
                    :formType="'add'"
                    :optionSuggestions="optionSuggestions"
                    :typeSuggestions="typeSuggestions"
                    :optionGroup="optionGroup"
                    :option="selectedOption"
                    @add:option="handleAddOption($event, -1)"
                    @searchOptions="searchOptions($event)"
                    @searchTypes="searchTypes($event)"
                    @add:type="handleAddType($event, selectedOption)"
                    @insert:option="handleInsertOption"
                    @inputOption="inputOption($event)"
                />
            </div>
        </div>
    </transition>

    <div class="option-index">

        <!-- <div class="flex flex-col mt-2">
          <Message  closable class="border-l-4 border-red-500">
            Lorem ipsum dolor sit amet.
          </Message>
        </div> -->

        <div class="grid-table">
            <!-- Header Row - Shown on desktop, hidden from iPad Pro and up (cards shown instead) -->
            <div class="grid-table-header ipadpro:hidden">
                <div class="grid-cell header-cell">Name</div>
                <div class="grid-cell header-cell">Type</div>
                <div class="grid-cell header-cell">Price</div>
                <div class="grid-cell header-cell">Sort Order</div>
                <div class="grid-cell header-cell">Actions</div>
            </div>

            <!-- Data Rows -->
            <template v-if="optionList && optionList.length > 0">
                <div 
                    v-for="(option, index) in optionList" 
                    :key="index"
                    class="grid-table-row"
                >
                    <!-- Card View - Shown from iPad Pro and up -->
                    <div class="mobile-card hidden ipadpro:block">
                        <div class="card-header">
                            <div class="card-title">{{ option.option_name }}</div>
                            <div class="card-type">{{ option.type }}</div>
                        </div>
                        <div class="card-body">
                            <div class="card-field">
                                <span class="field-label">Price:</span>
                                <span class="field-value">${{ option.price }}</span>
                            </div>
                            <div class="card-field">
                                <span class="field-label">Sort Order:</span>
                                <span class="field-value">{{ option.sort_order }}</span>
                            </div>
                        </div>
                        <div class="card-actions">
                            <Button 
                                :icon="renderIcon('pi pi-pencil', 'edit', index)"
                                rounded outlined
                                severity="success" 
                                @click="editOption(option, index)"
                            />
                            <Button 
                                :icon="renderIcon('pi pi-trash', 'delete', index)"
                                rounded outlined
                                severity="danger"
                                @click="deleteOption(option)"
                            />
                        </div>
                    </div>

                    <!-- Desktop Grid View - Shown on desktop, hidden from iPad Pro and up (cards shown instead) -->
                    <div class="grid-table-row-desktop grid ipadpro:hidden">
                        
                        <div class="grid-cell">
                            <div class="cell-content">
                                <img 
                                    v-if="option.imagePreview" 
                                    :src="option.imagePreview" 
                                    :alt="option.option_name"
                                    class="option-image"
                                />
                                <span class="option-name">{{ option.option_name }}</span>
                            </div>
                        </div>
                        <div class="grid-cell">
                            <span class="type-badge" :class="option?.type?.toLowerCase()">
                                {{ option.type }}
                            </span>
                        </div>
                        <div class="grid-cell">
                            <span class="price-value">${{ option.price }}</span>
                        </div>
                        <div class="grid-cell">
                            <span>{{ option.sort_order }}</span>
                        </div>
                        <div class="grid-cell">
                            <div class="flex gap-2">
                                <Button 
                                    :icon="renderIcon('pi pi-pencil', 'edit', index)"
                                    rounded outlined
                                    severity="success" 
                                    @click="editOption(option, index)"
                                />
                                <Button 
                                    :icon="renderIcon('pi pi-trash', 'delete', index)"
                                    rounded outlined
                                    severity="danger"
                                    @click="deleteOption(option)"
                                />
                            </div>
                        </div>
                    </div>

                    <!-- Expanded Form Row -->
                    <transition
                        enter-active-class="transition-all duration-500 ease-in-out"
                        leave-active-class="transition-all duration-300 ease-in-out"
                        enter-from-class="opacity-0 -translate-y-8"
                        enter-to-class="opacity-100 translate-y-0"
                        leave-from-class="opacity-100 translate-y-0"
                        leave-to-class="opacity-0 -translate-y-8">
                        <div 
                            v-show="option.active" 
                            class="expanded-form-row"
                        >
                            <div class="form-container">
                                <OptionForm 
                                    :showHiddenButton="showHiddenButton"
                                    :formType="'edit'"
                                    :option="option"
                                    :optionGroup="optionGroup"
                                    :optionSuggestions="optionSuggestions"
                                    :typeSuggestions="typeSuggestions"
                                    @searchOptions="searchOptions($event)"
                                    @add:option="handleAddOption($event, index)"
                                    @insert:option="handleInsertOption"
                                    @update:option="handleUpdateOption"
                                    @add:type="handleAddType($event, option)"
                                    @searchTypes="searchTypes($event)"
                                    @save="(data: any) => handleSave(data, index)"
                                    @inputOption="inputOption($event)"
                                    @upload:optionImage="handleUploadOptionImage($event)"
                                    @remove:optionImage="handleRemoveOptionImage($event)"
                                />
                            </div>
                        </div>
                    </transition>
                </div>
            </template>

            <!-- Empty State -->
            <div v-else class="empty-state">
                <p>No options found.</p>
            </div>
        </div>
    </div>
</template>

<style scoped>
.p-datatable-popover-filter {
    margin: 0px !important;
}

/* Grid Table Styles */
.grid-table {
    border: 1px solid #e5e7eb;
    overflow: hidden;
    margin-top: 15px;
    width: 100%;
}

/* Header Row */
.grid-table-header {
    display: grid;
    grid-template-columns: minmax(0, 2fr) minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1.5fr);
    background-color: #f9fafb;
}

/* Hide header at iPad Pro breakpoint (1024px) and above when cards are shown */
@media (max-width: 1024px) {
    .option-index .grid-table .grid-table-header {
        display: none !important;
        visibility: hidden !important;
        height: 0 !important;
        overflow: hidden !important;
    }
}

.header-cell {
    padding: 0.75rem 1rem;
    font-weight: 600;
    color: #374151;
    text-transform: uppercase;
    font-size: 0.75rem;
    letter-spacing: 0.05em;
    min-width: 0;
    overflow: hidden;
}

/* Desktop Grid Row */
.grid-table-row-desktop {
    display: grid;
    grid-template-columns: minmax(0, 2fr) minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1.5fr);
}

.grid-cell {
    padding: 0.75rem 1rem;
    border-right: 1px solid #e5e7eb;
    border-bottom: 1px solid #e5e7eb;
    display: flex;
    align-items: center;
    min-height: 3.5rem;
    box-sizing: border-box;
    min-width: 0;
    overflow: hidden;
}

.grid-cell:last-child {
    border-right: none;
}
/* 
.grid-table-row:last-child .grid-cell {
    border-bottom: none;
} */

.cell-content {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    min-width: 0;
    width: 100%;
}

.option-image {
    width: 2.5rem;
    height: 2.5rem;
    object-fit: cover;
    border: 1px solid #e5e7eb;
}

.option-name {
    font-weight: 500;
    color: #111827;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    min-width: 0;
}

.type-badge {
    display: inline-block;
    padding: 0.25rem 0.75rem;
    font-size: 0.875rem;
    font-weight: 500;
}

.type-badge.texture {
    background-color: #dbeafe;
    color: #1e40af;
}

.type-badge.colour {
    background-color: #fce7f3;
    color: #9f1239;
}

.price-value {
    font-weight: 600;
    color: #059669;
}

/* Mobile Card View */
.mobile-card {
    background-color: white;
    border: 1px solid #e5e7eb;
    padding: 1rem;
    margin-bottom: 0.75rem;
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
    display: none;
}


.card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.75rem;
    padding-bottom: 0.75rem;
    border-bottom: 1px solid #e5e7eb;
}

.card-title {
    font-weight: 600;
    font-size: 1rem;
    color: #111827;
}

.card-type {
    padding: 0.25rem 0.75rem;
    font-size: 0.875rem;
    font-weight: 500;
    background-color: #f3f4f6;
    color: #374151;
}

.card-body {
    margin-bottom: 0.75rem;
}

.card-field {
    display: flex;
    justify-content: space-between;
    padding: 0.5rem 0;
    border-bottom: 1px solid #f3f4f6;
}

.card-field:last-child {
    border-bottom: none;
}

.field-label {
    font-weight: 500;
    color: #6b7280;
    font-size: 0.875rem;
}

.field-value {
    font-weight: 600;
    color: #111827;
}

.card-actions {
    display: flex;
    gap: 0.5rem;
    justify-content: flex-end;
    padding-top: 0.75rem;
    border-top: 1px solid #f3f4f6;
}

/* Empty State */
.empty-state {
    padding: 3rem 1rem;
    text-align: center;
    color: #6b7280;
}

/* Expanded Form Row */
.expanded-form-row {
    width: 100%;
    border-bottom: 1px solid #e5e7eb;
    background-color: #f9fafb;
}

.form-container {
    /* padding: 1.5rem; */
    width: 100%;
}

/* Responsive adjustments */
@media (max-width: 1024px) {
    .grid-table {
        border: none;
    }
    
    .expanded-form-row {
        margin-top: 0.75rem;
        border-top: none;
    }
    .mobile-card {
        display: block;
    }
    .grid-table-row-desktop {
        display: none;
    }
}

.p-message-info{
    background: rgb(246 215 215) !important;
    color:rgb(185 28 28 / var(--tw-text-opacity, 1));
  }

</style>
