<script setup lang="ts">
import { resolveMediaImage, hasMediaImage } from '@/utils/mediaUrl';
import { ref, onMounted, computed, nextTick } from 'vue';
import {  
    ComponentItemField, 
    ComponentModelFieldItemRow, 
    ItemForm, 
    ItemModelForm, 
    ItemRelatedModel,
    ComponentItem
} from '@/models/Component.ts';
import { useToast } from 'primevue/usetoast';
// @ts-ignore
import { useModelStore } from '@/stores/model';

import { ModelOption } from '@/models/Model';

import { useListStore } from '@/stores/list';
import { useComponentStore } from '@/stores/component';
import { storeToRefs } from 'pinia';
import { DynamicModelObject } from '@/models/Input';
import { useComponentItemStore } from '@/stores/componentItem';
import { FileModel } from '@/models/Media';



// Props definition
const props = defineProps({
    id: {
        type: String
    }
});

const emit = defineEmits(['update:component']);

//Stores and System Variables
const toast = useToast();
const modelStore = useModelStore();
const componentStore = useComponentStore();
const { componentItems } = storeToRefs(componentStore);
const componentItemStore = useComponentItemStore();


const listStore = useListStore();
const { types } = storeToRefs(listStore);

//Data definitions
const loading = ref<boolean>(false);
const modelOptions = ref<ModelOption[]>([]);
const selectedModel = ref<ModelOption | null>(null);
const relatedModelsList = ref<ModelOption[]>([]);
const showDummyTable = ref<boolean>(false);
const itemForm = ref(new ItemForm({
    component_id: Number(props.id)
}));
const modelForm = ref(new ItemModelForm());
const modelJoins = ref([]);
const selectedFields = ref<string[]>([]);
const fieldOptions = ref<string[]>([]);
const fields = ref<ComponentItemField[]>([]);
const editingRows = ref<ComponentItemField[]>([]);
const filesData = ref<any[]>([]);
filesData.value = [];
const showAddItemForm = ref(false);
const showAddModelForm = ref(false);

//Computed
const showAddItemButton = computed(() => {
    return (componentItems.value.length === 0 
    || componentItems.value.some((item: ComponentItem) => item.model === '' || item.model === null || item.model === undefined)) 
    && !componentItemStore.fb.loading['componentItem'];
});
const showAddModelButton = computed(() => {
    return (componentItems.value.length === 0 
    || componentItems.value.some((item: ComponentItem) => item.model !== '' && item.model !== null && item.model !== undefined)) 
    && !componentItemStore.fb.loading['componentItem'];
});




// PrimeVue `InputText` v-model is typed as `Nullable<string>`, so we adapt the numeric
// `modelForm.item_count` to a string wrapper and convert back on input.
const itemCountInput = computed<string | null>({
    get: () => (modelForm.value.item_count ?? 0).toString(),
    set: (val: string | null) => {
        const n = val === '' || val === null ? 0 : Number(val);
        modelForm.value.item_count = Number.isFinite(n) ? n : 0;
    }
});

// Lifecycle Hooks
onMounted(async () => {

    console.log("ComponentItems:", componentItems.value);
    
    listStore.fetchTypes();
    loading.value = true;
    try {
        const models = await modelStore.fetchModels();
        modelOptions.value = models;
        
    } catch (error) {
        console.error('Error fetching models:', error);
    } finally {
        loading.value = false;
    }
});

// Methods

const updateComponent = (prop: string, value: any) => {
    emit('update:component', prop, value);
}

const handleModelChange = async (newModelName: string | null) => {
    const modelIndex = modelOptions.value.findIndex((model: ModelOption) => model.type === newModelName);
    const newModel = modelOptions.value[modelIndex];
    selectedModel.value = newModel || null;
    updateComponent('model', newModel ? newModel.type : null);
    
    // Clear selected fields when model changes
    selectedFields.value = [];
    showDummyTable.value = false;
    
    // If a model is selected, fetch its fields immediately
    if (newModel && newModel.type && !newModel.fields) {
        try {
            const tableColumns = await modelStore.fetchModelFields(newModel.type);
            fieldOptions.value = tableColumns.columns;
            modelOptions.value[modelIndex].fields = tableColumns.columns;
            selectedModel.value.fields = tableColumns.columns;

            // Now fetch the related models for the selected model
            try {
                const relatedModels = await modelStore.fetchRelatedModels(newModel.type);
                
                // Handle the case where relatedModels might be a single object or an array
                if (Array.isArray(relatedModels)) {
                    relatedModelsList.value = relatedModels;
                } else {
                    relatedModelsList.value = [];
                }
                if(modelForm.value.related_models?.length > 0 && selectedModel.value){
                    for(let join of modelForm.value.related_models){
                        if(!join.fieldsExist){
                            const joinFields = await modelStore.fetchModelFields(join.name);
                            join.fieldsExist = true;
                            join.joinFields = joinFields.columns;
                            fieldOptions.value = [...fieldOptions.value, ...joinFields.columns];
                        }
                    }
                }
            } catch (error) {
                console.error('Error fetching related models:', error);
                relatedModelsList.value = [];
                // Don't show error toast for related models as it's not critical
            }

        } catch (error) {
            console.error('Error fetching model fields:', error);
            toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to fetch model fields', life: 3000 });
        }
    }
};

// Watch for modelJoins changes to handle related model selection
const handleModelJoinsChange = async (event: { value: ItemRelatedModel[] }) => {
    
    // Find the item from event.value that does not exist in modelForm.value.relatedModel
    const joins = event.value.filter((item: ItemRelatedModel) => item.joinType && item.joinType !== '');

    
    if (selectedModel.value && joins) {
        try {
            let allFields: any[] = selectedModel.value.fields;
            for(let join of joins){
                const checkFieldExist = modelForm.value.related_models.find((item: ItemRelatedModel) => item.name === join.name && item.fieldsExist);
                if(checkFieldExist){
                    allFields = [...allFields, ...checkFieldExist.joinFields];
                    continue;
                }
                try {
                    const joinFields = await modelStore.fetchModelFields(join.name);
                    join.fieldsExist = true;
                    join.joinFields = joinFields.columns;
                    allFields = [...allFields, ...joinFields.columns];
                } catch (error) {
                    console.error(`Error fetching fields for join model ${join.name}:`, error);
                    // Continue with other models even if one fails
                }
            }   
            modelForm.value.related_models = joins;
            // Update fieldOptions with only join fields
            fieldOptions.value = allFields;
            
            // Trigger field selection change to update fieldsRows - Done
            if (modelForm.value.fields && modelForm.value.fields.length > 0) {
                handleFieldSelectionChange({ value: modelForm.value.fields });
            }
            
        } catch (error) {
            console.error('Error updating fields with join data:', error);
        }
    } 
};

const removeJoinModel = (index: number) => {
    modelForm.value.related_models.splice(index, 1);
}

const handleFieldSelectionChange = (event: any) => {
    // Convert selected field names to fieldsRows format
    modelForm.value.fieldsRows = fieldOptions.value
        .filter((field: any) => event.value.includes(field))
        .map((field: any) => {
            return {
                name: field,
                source: field.split('.')[0] || 'main'
            };
        });
    
    // Also update the fields array for consistency - Done
    modelForm.value.fields = event.value || [];
}

const addItem = () => {
    // Ensure component_id is set when adding a new item
    itemForm.value.component_id = Number(props.id);
    
    if(showAddModelForm.value){
        showAddModelForm.value = false;
        setTimeout(() => {
            showAddItemForm.value = true;
        }, 500);
    }
    else{
        showAddItemForm.value = true;
    }
}

const addModelItem = () => {
    if(showAddItemForm.value){
        showAddItemForm.value = false;
        setTimeout(() => {
            showAddModelForm.value = true;
        }, 500);
    }
    else{
        showAddModelForm.value = true;
    }
}

const saveItem = async () => {
    // Create a complete item object that includes both form data and fields
    const completeItem = {
        ...itemForm.value,
        type: 'item'
    };
    
    try {
        // Check if we're editing an existing item or creating a new one
        if (itemForm.value.component_item_id) {
            // Update existing item
            await componentItemStore.updateComponentItem(itemForm.value.component_item_id, completeItem);
        } else {
            // Create new item
            const newItem = await componentItemStore.addComponentItem(completeItem);
            
            // Add to component items list with the response data
            componentItems.value.push({
                ...completeItem,
                id: newItem.id || newItem.component_item_id
            });
        }
        
        // Hide the form after successful save
        showAddItemForm.value = false;
        
        // Reset form
        itemForm.value = new ItemForm({
            component_id: Number(props.id),
            component_item_id: null
        });
        fields.value = [];
        
        toast.add({ severity: 'success', summary: 'Success', detail: 'Item saved successfully', life: 3000 });
        
    } catch (error) {
        console.error('Error saving item:', error);
        toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to save item', life: 3000 });
    }
}

const cancelForm = () => {
    showAddItemForm.value = false;
    // Reset form data
    itemForm.value = new ItemForm({
        component_id: Number(props.id),
        component_item_id: null
    });
    fields.value = [];
}

const saveModelItem = async () => {
    modelForm.value.component_id = Number(props.id);
    
    // Ensure related_models is properly set - Done
    if (!modelForm.value.related_models) {
        modelForm.value.related_models = [];
    }
    
    try {
        // Check if we're editing an existing item or creating a new one - Done
        if (modelForm.value.component_item_id) {
            // Update existing item
            // await componentItemStore.updateComponentItem(modelForm.value.component_item_id, modelForm.value);
            const updatedItem = await componentItemStore.updateComponentItem(modelForm.value.component_item_id, modelForm.value);
            
            // Update the corresponding item in the componentItems array
            const itemIndex = componentItems.value.findIndex(item => item.component_item_id === modelForm.value.component_item_id);
            if (itemIndex !== -1) {
                // componentItems.value[itemIndex] = {
                //     ...componentItems.value[itemIndex],
                //     ...modelForm.value
                // };
                componentItems.value[itemIndex] = updatedItem;
            }
        } else {
            // Create new item
            // await componentItemStore.addComponentItem(modelForm.value);
            const newItem = await componentItemStore.addComponentItem(modelForm.value);
            
            // Add to component items list with the response data
            componentItems.value.push({
                ...modelForm.value,
                id: newItem.id || newItem.component_item_id
            });
        }
        
        // Hide the form after successful save
        showAddModelForm.value = false;
        
        // Reset form
        modelForm.value = new ItemModelForm();
        modelJoins.value = [];
        
        toast.add({ severity: 'success', summary: 'Success', detail: 'Model item saved successfully', life: 3000 });
        
    } catch (error) {
        console.error('Error saving model item:', error);
        toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to save model item', life: 3000 });
    }
}

const cancelModelForm = () => {
    showAddModelForm.value = false;
    // Reset form data
    modelForm.value = new ItemModelForm();
    modelJoins.value = [];
}

const removeModelField = (data: ComponentModelFieldItemRow, index: number) => {
    
    // Also remove from modelForm fields array
    modelForm.value.fields.splice(index, 1);
    modelForm.value.fieldsRows.splice(index, 1);
}

const handleJoinTypeChange = async (index: number, data: any) => {    
    // Trigger the watch function to recalculate all field options
    // This will handle both adding and removing join fields based on all selected join types
    const currentModelJoins = [...modelJoins.value];
    modelJoins.value = [];
    // Force reactivity by reassigning the array
    setTimeout(() => {
        modelJoins.value = currentModelJoins;
    }, 0);
}
const editSavedItem = (item: any) => {
    console.log("Editing Item: ", item);
    
    if (!!item.model) {
        // Convert fields array to fieldsRows format
        const fieldsRows = Array.isArray(item.fields) ? item.fields.map((field: string) => {
            // Extract field name and source from field string (e.g., "product.product_id" -> name: "product_id", source: "product")
            const parts = field.split('.');
            return {
                name: parts.length > 1 ? parts[1] : field,
                source: parts.length > 1 ? parts[0] : 'main'
            };
        }) : [];

        // Prefill Add Model Item form
        modelForm.value = new ItemModelForm({
            component_id: Number(props.id),
            component_item_id: item.component_item_id,
            property_name: item.property_name || item.name,
            title: item.title,
            subtitle: item.subtitle || '',
            description: item.description || '',
            model: item.model,
            is_recent: item.is_recent || item.isRecent || false,
            is_featured: item.is_featured || item.isFeatured || false,
            item_count: item.item_count || 0,
            fields: item.fields || [],
            fieldsRows: fieldsRows,
            related_models: item?.related_models?.map((item: any) => ({
                model_id: item.model_id,
                name: item.name,
                type: item.type,
                joinType: item.joinType,
                class: item.class,
                source: item.source,
                model: item.model
            })) || []
        });
        console.log("Model Form:", modelForm.value);
        
        // Set the model selection to trigger field loading - Done
        selectedModel.value = modelOptions.value.find((model: ModelOption) => model.table_name === item.model) || null;
        
        // Trigger model change to load fields if model is found - Done
        if (selectedModel.value) {
            handleModelChange(item.model);
        }
        
        // Show Add Model Item form
        showAddItemForm.value = false;
        showAddModelForm.value = true;
    }
    else if (item.type === 'item') {
        // Prefill Add Item form
        itemForm.value = new ItemForm({
            component_id: Number(props.id),
            component_item_id: item.component_item_id || item.id, // Added extra
            property_name: item.property_name,
            title: item.title,
            subtitle: item.subtitle || '',
            description: item.description || '',
            link_text: item.link_text || '',
            image: item.image || null,
            fields: item.fields || []
        });
        
        
        // Show Add Item form
        showAddModelForm.value = false;
        showAddItemForm.value = true;
    } 
}

/**
 * Convert stored rich-text HTML into plain text for compact UI (chips, labels, etc.).
 * Handles null/undefined, arrays, and basic entity/whitespace normalization.
 */
const htmlToPlainText = (input: unknown): string => {
    if (input === null || input === undefined) return '';

    // Some values can be arrays (e.g., file uploads), normalize to something readable first.
    if (Array.isArray(input)) {
        const joined = input
            .map((v: any) => {
                if (v === null || v === undefined) return '';
                if (typeof v === 'string') return v;
                if (typeof v === 'number' || typeof v === 'boolean') return String(v);
                if (typeof v === 'object') return v.name ?? v.file_name ?? v.filename ?? '';
                return String(v);
            })
            .filter(Boolean)
            .join(', ');
        return htmlToPlainText(joined);
    }

    const raw = typeof input === 'string' ? input : String(input);
    const trimmed = raw.trim();
    if (!trimmed) return '';

    // Prefer DOMParser when available (browser). This strips tags and decodes entities.
    if (typeof DOMParser !== 'undefined') {
        const doc = new DOMParser().parseFromString(`<div>${trimmed}</div>`, 'text/html');
        const text = doc?.body?.textContent ?? '';
        return text.replace(/\s+/g, ' ').trim();
    }

    // Fallback (non-browser): best-effort remove tags.
    return trimmed
        .replace(/<[^>]*>/g, ' ')
        .replace(/&nbsp;/g, ' ')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/\s+/g, ' ')
        .trim();
};

const handleUpload = async (event: any, field: any, index: number) => {
    try {
        const response: any = await componentStore.uploadComponentImage(event.files, field.name, Number(props.id));
        field.imagesData = response.files;
        field.value = [new FileModel(response.files[0])];
        // itemForm.value.fields[index].imagesData = response.files;
        // console.log("Item Form:", itemForm.value);
    } catch (error) {
        console.error('Error uploading image:', error);
    }
}

const handleRemoveUploaded = async (event: any, field: any, index: number) => {
    try {
    await componentStore.deleteImageByFilePath(field.value[0].image, field.name, Number(props.id));
    let index = field.imagesData.findIndex((img: any) => img.name === field.value[0].name);
    if(index !== -1) {
      field.imagesData.splice(index, 1);
      field.value = [];
    }
    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Image removed successfully',
      life: 3000
    });
  } catch (error) {
    console.error('Error deleting image:', error);
    toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete image. Please try again.', life: 3000 });
  }
    
}



// DataTable row editing functions
const onRowEditInit = (event: any) => {
    console.log(event);
}

const onRowEditSave = async (event: any) => {
    // Update the local field data
    itemForm.value.fields[event.index] = event.newData;
    
    // If we have a component_item_id, immediately update the backend
    if (itemForm.value.component_item_id) {
        try {
            const completeItem = {
                ...itemForm.value,
                type: 'item'
            };
            
            await componentItemStore.updateComponentItem(itemForm.value.component_item_id, completeItem);
            
            // Update the corresponding item in the componentItems array
            const itemIndex = componentItems.value.findIndex(item => item.id === itemForm.value.component_item_id);
            if (itemIndex !== -1) {
                componentItems.value[itemIndex] = {
                    ...componentItems.value[itemIndex],
                    fields: itemForm.value.fields
                };
            }
            
            toast.add({ severity: 'success', summary: 'Success', detail: 'Field updated successfully', life: 3000 });
        } catch (error) {
            console.error('Error updating field:', error);
            toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to update field', life: 3000 });
        }
    }
}

const onRowEditCancel = (event: any) => {
    // If it's a new row that was cancelled, remove it
    if (event.data.isNew) {
        const index = itemForm.value.fields.findIndex(field => field === event.data);
        if (index > -1) {
            itemForm.value.fields.splice(index, 1);
        }
    }
}

const editRow = (data: ComponentItemField) => {
   
}

const deleteRow = (index: number) => {
    itemForm.value.fields.splice(index, 1);
}

const addNewField = () => {
    const dynamicModel = new DynamicModelObject();
    const newField = { 
        name: '', 
        type:  {type: dynamicModel},         
        value: '',
        imagesData: [],
        value_editor: '',
        options: [],
        isNew: true // Add a flag to identify new rows
    };
    itemForm.value.fields.push(newField);
    
    // Use nextTick to ensure the DOM is updated before setting editing state
    nextTick(() => {
        const newIndex = itemForm.value.fields.length - 1;
        const newRow = itemForm.value.fields[newIndex];
        // Clear any existing editing rows first
        editingRows.value = [];
        // Then set the new row as editing
        nextTick(() => {
            editingRows.value = [newRow];
        });
    });
}

const onFieldChange = (event: any, data: any, index: number, prop: 'value' | 'type' | 'name') => {
    itemForm.value.fields[index][prop] = data[prop];
}







// For Model Items
//Get top models dropdown from backend including the join models - done

//On select top model change join models list - done

// On select join model pull fields from backend and merge into main model fields - Start from here - I don't get it properly! - done
// Do not use watch. In the JoinModels list Create Select(change) event and pull fields from backend and merge into main model fields - done

// For Non Model Items
// Fix Fields(datatable) input fields - Use DynamicInput - Done

// Add Input Type Image Dropdown and Set Value to Image Uploader - Done

// Bind them to the Component Items Model - Done

// Save all the data to the backend (Component Items Model) - Done

// Show the component items in the component items list for specific component - Done

// User can be able to add/delete/edit the component items

// Interface for field items - Done

// Create and import all Interface in Component.ts file - Done

// This savedItems variable will be decleared in the store file and import here using storeToRefs - Done

// When creating new Component - Use savedItems to store the component items temporarily before saving to the backend - Done

// When editing a Component - savedItems will have the data fetched from the backend and 
                            // add new item will send save request to the backend.
                            //After successful save, update the savedItems with the new item.

const onEditingRowsChange = (event: any) => {
    console.log(event);
}

const deleteSavedItem = async (item: any, index: number) => {
    console.log(item, index);
    try {
        // If the item has an ID, delete it from the backend
        if (item.component_item_id) {
            await componentItemStore.deleteComponentItem(item.component_item_id);
        }
        
        // Remove from the local array
        componentItems.value.splice(index, 1);
        
        toast.add({ severity: 'success', summary: 'Success', detail: 'Item deleted successfully', life: 3000 });
    } catch (error) {
        console.error('Error deleting item:', error);
        toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete item', life: 3000 });
    }
}
</script>

<template>
    <div class="flex flex-col gap-6">
        <Toast />

        <!-- Step One Click Add Item or Add Model Item -->
        <div class="flex flex-wrap gap-2">
            <Button v-if="showAddItemButton" label="Add Item" severity="contrast" @click="addItem" />
            <Button v-if="showAddModelButton" label="Add Model Item" severity="contrast" outlined @click="addModelItem" />
        </div>

        <!-- Step Two - A form will be shown to add the item.-->

        <!-- Add Item Form -->
        <Transition name="fade">
            <div v-show="showAddItemForm" class="card flex flex-col md:flex-row gap-6 relative">
                <!-- Form Fields - Left Side -->
                <div class="flex flex-col gap-4 md:w-1/3">
                    <div class="font-semibold text-xl">Add Item Form</div>
                    
                    <div class="flex flex-col gap-2">
                        <label for="itemName">Name</label>
                        <InputText id="itemName" v-model="itemForm.property_name" type="text" />
                    </div>
                    
                    <div class="flex flex-col gap-2">
                        <label for="itemTitle">Title</label>
                        <InputText id="itemTitle" v-model="itemForm.title" type="text" />
                    </div>
                    
                    <div class="flex flex-col gap-2">
                        <label for="itemSubtitle">Subtitle</label>
                        <InputText id="itemSubtitle" v-model="itemForm.subtitle" type="text" />
                    </div>
                    
                    <div class="flex flex-col gap-2">
                        <label for="itemDescription">Description</label>
                        <Textarea id="itemDescription" v-model="itemForm.description" rows="4" />
                    </div>
                    
                    <div class="flex flex-col gap-2">
                        <label for="itemLinkText">Link Text</label>
                        <InputText id="itemLinkText" v-model="itemForm.link_text" type="text" />
                    </div>
                    
                    <div class="flex flex-col gap-2">
                        <label for="itemImage">Image</label>
                        
                    </div>
                    
                    <div class="flex gap-2">
                        <Button label="Save Item" @click="saveItem" />
                        <Button label="Cancel" severity="secondary" outlined @click="cancelForm" />
                    </div>
                </div>
                
                <!-- Fields DataTable - Right Side -->
                <div class="flex flex-col gap-4 md:w-2/3">
                    <div class="font-semibold text-xl">Fields (Datatable)</div>
                    
                    <DataTable
                        :value="itemForm.fields" 
                        class="p-datatable-sm" 
                        dataKey="name"
                        v-model:editingRows="editingRows"
                        editMode="row" 
                        @row-edit-init="onRowEditInit"
                        @row-edit-save="onRowEditSave" 
                        @row-edit-cancel="onRowEditCancel"
                        @update:editingRows="onEditingRowsChange"
                        :pt="{
                            table: { class: 'edit-mode-table' },
                            tbody: { class: 'edit-mode-tbody' },
                            tr: { class: 'edit-mode-tr' },
                            td: { class: 'edit-mode-td' }
                        }"
                    >
                        <Column field="name" header="Name" style="width: 25%">
                            <template #body="{ data }">
                                {{ data.name }}
                            </template>
                            <template #editor="{ data, field }">
                                <InputText v-model="data.name" class="w-full" />
                            </template>
                        </Column>
                        <Column  header="Input Type" style="width: 30%">
                            <template #body="{ data }">
                                {{ data.type?.type?.type }}
                            </template>
                            <template #editor="{ data, field }">
                                <Select filter v-model="data.type.type.type" :options="types" option-label="type" option-value="type" placeholder="Select Type" class="w-full" />
                            </template>
                        </Column>
                        <Column field="value" header="Value" style="width: 30%">
                            <template #body="{ data }">
                                <span v-if="data.type.type.type === 'FileUpload'">
                                    <img :src="resolveMediaImage(data.value)" alt="Image" class="w-10 h-10" />
                                </span>
                                <span v-else>{{ htmlToPlainText(data.value) }}</span>
                            </template>
                            <template #editor="{ data, index }">
                                <DynamicInput
                                    :types="types"
                                    :model="data"
                                    :fb="listStore.fb"
                                    :mediaFb="componentStore.fb"
                                    :uploadedFilesData="data.imagesData"
                                    :disabled="false"
                                    :hideDropdown="true"
                                    @change="onFieldChange($event, data, index, 'value')"
                                    @upload="handleUpload($event, data, index)"
                                    @removeUploaded="handleRemoveUploaded($event, data, index)"
                                />
                            </template>
                        </Column>
                        <Column header="Actions" style="width: 5%">
                            <template #body="{ data, index }">
                                <div class="flex gap-1">
                                    <Button icon="pi pi-trash" severity="danger" size="small" @click="deleteRow(index)" />
                                </div>
                            </template>
                        </Column>
                        <Column :rowEditor="true" style="width: 10%" bodyStyle="text-align:center"></Column>
                    </DataTable>
                    <a href="#" class="text-blue-600 hover:text-blue-800 underline cursor-pointer" @click.prevent="addNewField">
                        <i class="pi pi-plus mr-1"></i>Add Field
                    </a>
                </div>
                <div v-if="componentItemStore.fb.loading['componentItem']" class="overlay" 
                    style="
                        position: absolute;
                        z-index: 999999;
                        width: 100%;
                        height: 100%;
                        background: rgba(0, 0, 0, .3);
                        left: 0;
                        top: 0;
                    "
                >
                    <div class="flex justify-center items-center h-full">
                        <div class="flex flex-col gap-2">
                            ... Loading
                        </div>
                    </div>
                </div>
            </div>
        </Transition>
        
        <!-- Add Model Form -->
        <Transition name="fade">
            <div v-show="showAddModelForm" class="card flex flex-col md:flex-row gap-6 relative">
                <!-- Form Fields - Left Side -->
                <div class="flex flex-col gap-4 md:w-1/3">
                    <div class="font-semibold text-xl">Add Model Item Form</div>
                    
                    <div class="flex flex-col gap-2">
                        <label for="modelName">Name</label>
                        <InputText id="modelName" v-model="modelForm.property_name" type="text" />
                    </div>
                    
                    <div class="flex flex-col gap-2">
                        <label for="modelTitle">Title</label>
                        <InputText id="modelTitle" v-model="modelForm.title" type="text" />
                    </div>
                    
                    <div class="flex flex-col gap-2">
                        <label for="modelSubtitle">Subtitle</label>
                        <InputText id="modelSubtitle" v-model="modelForm.subtitle" type="text" />
                    </div>
                    
                    <div class="flex flex-col gap-2">
                        <label for="modelDescription">Description</label>
                        <Textarea id="modelDescription" v-model="modelForm.description" rows="4" />
                    </div>
                    
                    <div class="flex flex-col gap-2">
                        <label for="modelCount">Count</label>
                        <!-- <InputText id="modelCount" v-model="modelForm.item_count" type="number" /> -->
                        <InputText id="modelCount" v-model="itemCountInput" type="number" />
                    </div>
                    
                    <div class="flex flex-col gap-2">
                        <div class="flex items-center gap-2">
                            <Checkbox id="isRecent" v-model="modelForm.is_recent" :binary="true" />
                            <label for="isRecent">Is Recent</label>
                        </div>
                    </div>
                    
                    <div class="flex flex-col gap-2">
                        <div class="flex items-center gap-2">
                            <Checkbox id="isFeatured" v-model="modelForm.is_featured" :binary="true" />
                            <label for="isFeatured">Is Featured</label>
                        </div>
                    </div>
                    
                    <div class="flex gap-2">
                        <Button :label="modelForm.component_item_id ? 'Update Model Item' : 'Save Model Item'" @click="saveModelItem" />
                        <Button label="Cancel" severity="secondary" outlined @click="cancelModelForm" />
                    </div>
                </div>
                
                <!-- Join and Fields - Right Side -->
                <div class="flex flex-col gap-4 md:w-2/3">
                    <!-- Model Selection and Join DataTable -->
                    <div class="flex flex-col gap-4">
                        <!-- Model Selection -->
                        <div class="flex flex-col gap-2">
                            <label class="font-semibold text-lg" for="modelSelect">Select Model</label>
                            <Select 
                                id="modelSelect" 
                                v-model="modelForm.model" 
                                :options="modelOptions"
                                optionLabel="name"
                                optionValue="table_name"
                                placeholder="Select Model" 
                                class="w-full" 
                                @change="handleModelChange($event.value)"
                                :loading="loading"
                            />
                        </div>
                        <div class="flex flex-col gap-2">
                            <label class="font-semibold text-lg">Available Models to Join</label>
                            <div class="card flex gap-4">
                                <!-- Left Side Listbox Area -->
                                <div class="w-1/6">
                                    <!--Create Select(change) event and pull fields from backend and merge into main model fields-->
                                    <Listbox 
                                        v-model="modelForm.related_models" 
                                        :options="relatedModelsList || []" 
                                        @change="handleModelJoinsChange"
                                        optionLabel="name"
                                        multiple
                                        class="w-full"
                                        listStyle="min-height: 250px; max-height: 250px; padding: 0.5rem;"
                                        placeholder="Select related models"
                                    />
                                    
                                </div>
                                <!-- Right Side Datatable -->
                                <div class="w-5/6">
                                    <DataTable :value="modelForm.related_models" class="p-datatable-sm">
                                        <Column field="name" header="Model">
                                            <template #body="{ data }">
                                                {{ data.name || data.type || data }}
                                            </template>
                                        </Column>
                                        <Column field="joinType" header="Join Type">
                                            <template #body="{ data, index }">
                                                <Select 
                                                    v-model="data.joinType" 
                                                    :options="['INNER', 'LEFT', 'RIGHT']" 
                                                    placeholder="Select Type" 
                                                    class="w-full"
                                                    @change="handleJoinTypeChange(index, data)"
                                                />
                                            </template>
                                        </Column>
                                        <Column header="Actions">
                                            <template #body="{ index }">
                                                <Button icon="pi pi-trash" severity="danger" size="small" @click="removeJoinModel(index)" />
                                            </template>
                                        </Column>
                                    </DataTable>
                                </div>
                            </div>
                        </div>
                        
                    </div>
                    
                    <!-- Fields DataTable -->
                    <div>
                        <label class="font-semibold text-lg">Fields to Add</label>
                        <div class="card flex flex-col gap-4">
                            <div class="flex gap-2">
                                <MultiSelect 
                                    v-model="modelForm.fields" 
                                    filter
                                    :options="fieldOptions" 
                                    @change="handleFieldSelectionChange"
                                    placeholder="Select fields to add" 
                                    class="w-full"
                                />
                            </div>
                            <div v-if="fieldOptions?.length > 0" class="text-sm text-gray-600">
                                Available fields: {{ fieldOptions?.length }} total
                                <span v-if="fieldOptions?.some((f: any) => f.source === 'main')" class="ml-2">
                                    ({{ fieldOptions?.filter((f: any) => f.source === 'main').length }} main model)
                                </span>
                                <span v-if="fieldOptions?.some((f: any) => f.source !== 'main')" class="ml-2">
                                    ({{ fieldOptions?.filter((f: any) => f.source !== 'main').length }} join fields)
                                </span>
                            </div>
                            <DataTable :value="modelForm.fieldsRows" class="p-datatable-sm">
                                <Column field="name" header="Field Name" />
                                <Column field="source" header="Source" />
                                <Column header="Actions">
                                    <template #body="{ data, index }">
                                        <Button icon="pi pi-trash" severity="danger" size="small" @click="removeModelField(data, index)" />
                                    </template>
                                </Column>
                            </DataTable>
                            
                        </div>
                    </div>
                    
                </div>
                <div v-if="componentItemStore.fb.loading['componentItem']" class="overlay" 
                    style="
                        position: absolute;
                        z-index: 999999;
                        width: 100%;
                        height: 100%;
                        background: rgba(0, 0, 0, .3);
                        left: 0;
                        top: 0;
                    "
                >
                    <div class="flex justify-center items-center h-full">
                        <div class="flex flex-col gap-2">
                            ... Loading
                        </div>
                    </div>
                </div>
            </div>
        </Transition>

        <!-- Once a item is added Other Item adding option will be dissapear -->

        <!-- For Adding Static Item-->

        <!-- Step Three - Use Datatable to to modify item fields -->

        
        <!-- For Adding Model Item -->
        <!-- On Saving the item, the item will be saved in the database and the item will be shown in the datatable -->

        <!-- Saved Items DataTable -->
        <div class="card flex flex-col gap-4">
            <div class="font-semibold text-xl">Saved Items</div>
            <DataTable :value="componentItems" class="p-datatable-sm">
                <Column field="property_name" header="Name" />
                <Column field="title" header="Title" />
                <Column field="is_recent" header="Is Recent">
                    <template #body="{ data }">
                        <i v-if="data.is_recent" class="pi pi-check text-green-600"></i>
                        <i v-else class="pi pi-times text-red-600"></i>
                    </template>
                </Column>
                <Column field="is_featured" header="Is Featured">
                    <template #body="{ data }">
                        <i v-if="data.is_featured" class="pi pi-check text-green-600"></i>
                        <i v-else class="pi pi-times text-red-600"></i>
                    </template>
                </Column>
                <Column field="fields" header="Fields">
                    <template #body="{ data }">
                        <div class="flex flex-wrap gap-1">
                            <Chip v-if="!!data.model"
                                v-for="[index, field] in data.fields.entries()" 
                                :key="index"
                                :label="htmlToPlainText(field)"
                                :class="data.type === 'item' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'"
                                size="small"
                            />
                            <Chip v-else
                                v-for="field in data.fields" 
                                :key="field.name"
                                :label="data.type === 'item' ? `${field.name}: ${htmlToPlainText(field.value)}` : `${field.name} (${field.type})`"
                                :class="data.type === 'item' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'"
                                size="small"
                            />
                        </div>
                    </template>
                </Column>
                <Column header="Actions">
                    <template #body="{ data, index }">
                        <div class="flex gap-1">
                            <Button icon="pi pi-pencil" severity="secondary" size="small" @click="editSavedItem(data)" />
                            <Button icon="pi pi-trash" severity="danger" size="small" @click="deleteSavedItem(data, index)" />
                        </div>
                    </template>
                </Column>
            </DataTable>
        </div>
        
    </div>
</template>


<style scoped>
/* Remove padding and margin from editing cells */
.edit-mode-table .p-editable-row td {
    padding: 0 !important;
    margin: 0 !important;
}

.edit-mode-table .p-editable-row td .p-inputtext,
.edit-mode-table .p-editable-row td .p-dropdown {
    border: none !important;
    padding: 0.25rem !important;
    margin: 0 !important;
    width: 100% !important;
    box-shadow: none !important;
    min-width: 100% !important;
    max-width: 100% !important;
}

.edit-mode-table .p-editable-row td .p-dropdown {
    width: 100% !important;
    min-width: 100% !important;
    max-width: 100% !important;
}

.edit-mode-table .p-editable-row td .p-dropdown .p-dropdown-label {
    padding: 0.25rem !important;
    width: 100% !important;
}

.edit-mode-table .p-editable-row td .p-dropdown .p-dropdown-trigger {
    padding: 0.25rem !important;
}

/* Ensure input containers are full width */
.edit-mode-table .p-editable-row td > div {
    width: 100% !important;
    min-width: 100% !important;
    max-width: 100% !important;
}

/* Fade animation for form */
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

/* Listbox styling to look like classic multiselect */
.p-listbox {
    border: 1px solid #f9f9f9 !important;
    border-radius: 0 !important;
    background-color: #f6f6f6 !important;
}

.p-listbox .p-listbox-list {
    padding: 0.25rem !important;
}

.p-listbox .p-listbox-item {
    padding: 0.5rem 0.75rem !important;
    margin-bottom: 0.125rem !important;
    border-radius: 0.25rem !important;
    cursor: pointer !important;
    border: 1px solid transparent !important;
    transition: all 0.15s ease-in-out !important;
    font-size: 0.875rem !important;
    line-height: 1.25rem !important;
}

.p-listbox .p-listbox-item:hover {
    background-color: #f8fafc !important;
    border-color: #e2e8f0 !important;
}

.p-listbox .p-listbox-item.p-highlight {
    background-color: #3b82f6 !important;
    color: white !important;
    border-color: #3b82f6 !important;
    box-shadow: 0 1px 3px 0 rgba(59, 130, 246, 0.3) !important;
}

.p-listbox .p-listbox-item.p-highlight:hover {
    background-color: #2563eb !important;
    border-color: #2563eb !important;
}
</style>