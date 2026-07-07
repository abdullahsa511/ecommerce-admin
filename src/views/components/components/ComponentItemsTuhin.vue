<script setup>
import { ref, watch, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import Component from '@/models/Component';
import ComponentItem from '@/models/ComponentItem';
import Field from '@/models/Field';
import InputText from 'primevue/inputtext';
import Select from 'primevue/select';
import InputSwitch from 'primevue/inputswitch';
import MultiSelect from 'primevue/multiselect';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import Textarea from 'primevue/textarea';
import Toast from 'primevue/toast';
import { useToast } from 'primevue/usetoast';

import ComponentItemAddModal from '@/views/components/components/ComponentItemAddModal.vue';
import Model from '@/models/Model';
import { useModelStore } from '@/stores/model';
import { useComponentItemStore } from '@/stores/componentItem';
import ComponentItemService from '@/service/ComponentItemService';

const props = defineProps({
    component: { type: Component, required: true },
    id: { type: String } // This will receive the id parameter from the route
});

const route = useRoute();
const emit = defineEmits(['update:component']);
const toast = useToast();

const updateComponent = (prop, value) => {
    emit('update:component', prop, value);
}

// Model store
const modelStore = useModelStore();
const componentItemStore = useComponentItemStore();
const modelOptions = ref([]);
const loading = ref(false);
const selectedModel = ref(null);
const saveLoading = ref(false);
const savedItems = ref(null); // Add this to store the saved items response

// Fields and items
const fieldOptions = ref([]);
const selectedFields = ref([]);
const items = ref([]);
const itemCount = ref(0);
const addItemModalVisible = ref(false);
const showDummyTable = ref(false);

// --- Custom Item State (Case 2) ---
const customItems = ref([]); // Array of custom items
const customFields = ref([
    new Field({ id: 1, name: 'name', type: 'text', defaultValue: '', required: false, shofiul:'Testing' }),
    new Field({ id: 2, name: 'title', type: 'text', defaultValue: '', required: false }),
    new Field({ id: 3, name: 'description', type: 'textarea', defaultValue: '', required: false }),
    new Field({ id: 4, name: 'linkText', type: 'text', defaultValue: '', required: false }),
    new Field({ id: 5, name: 'image', type: 'text', defaultValue: '', required: false })
]);
const customFieldTypes = [
    { label: 'Text', value: 'text' },
    { label: 'Number', value: 'number' },
    { label: 'Textarea', value: 'textarea' },
    { label: 'Email', value: 'email' },
    { label: 'Nested Object', value: 'object' }
];
const selectedCustomFieldIndex = ref(0);
const customItemForm = ref({});

// Dummy data for the table
const dummyTableData = ref([{ id: 1 }]); // Just one row of dummy data

// Add this line near the top of your script section where other refs are defined
const tempComponentId = ref('');

// Add this to keep track of expanded field details
const expandedFields = ref([]);

// Toggle field expansion
const toggleFieldExpansion = (fieldId) => {
    const index = expandedFields.value.indexOf(fieldId);
    if (index > -1) {
        expandedFields.value.splice(index, 1);
    } else {
        expandedFields.value.push(fieldId);
    }
};

// Fetch models from API on component mount
onMounted(async () => {
    loading.value = true;
    try {
        const models = await modelStore.fetchModels();
        modelOptions.value = models;
        
        // Check if we have a component ID from the route
        if (route.params.id && !props.component.component_id) {
            console.log(`Found component ID in route: ${route.params.id}`);
            tempComponentId.value = route.params.id;
            
            // You could load component data here if needed
            // const componentData = await componentStore.getComponent(route.params.id);
            // updateComponent('component_id', route.params.id);
        }
        
        // Set the selected model if component already has a model
        if (props.component.model) {
            selectedModel.value = modelOptions.value.find(m => m.type === props.component.model);
        }
    } catch (error) {
        console.error('Error fetching models:', error);
    } finally {
        loading.value = false;
    }
});

const addCustomItem = () => {
    // Add a new custom item with all fields
    const newItem = {};
    customFields.value.forEach(f => {
        newItem[f.name] = f.defaultValue || '';
    });
    const newComponentItem = new ComponentItem(newItem);
    customItems.value.push(newComponentItem);
    
    // Open modal with the new item for editing
    selectedCustomItemIndex.value = customItems.value.length - 1;
    addItemModalVisible.value = true;
};

// Add a reference to track the selected custom item for editing
const selectedCustomItemIndex = ref(0);

// Handler for when an item is saved from the modal
const handleItemSaved = (savedItem) => {
    console.log('Item saved from modal:', savedItem);
    // Update the item in the customItems array
    if (selectedCustomItemIndex.value >= 0 && selectedCustomItemIndex.value < customItems.value.length) {
        customItems.value[selectedCustomItemIndex.value] = savedItem;
    }
    // Close the modal
    addItemModalVisible.value = false;
};

// Function to edit an existing custom item
const editCustomItem = (index) => {
    selectedCustomItemIndex.value = index;
    addItemModalVisible.value = true;
};

const addCustomField = () => {
    const newId = customFields.value.length + 1;
    customFields.value.push({
        id: newId,
        name: `field${newId}`,
        type: 'text',
        defaultValue: '',
        required: false
    });
    selectedCustomFieldIndex.value = customFields.value.length - 1;
};

const removeCustomField = (idx) => {
    if (customFields.value.length <= 1) return;
    customFields.value.splice(idx, 1);
    if (selectedCustomFieldIndex.value >= customFields.value.length) {
        selectedCustomFieldIndex.value = customFields.value.length - 1;
    }
};

const selectCustomField = (idx) => {
    selectedCustomFieldIndex.value = idx;
};

const updateCustomField = (key, value) => {
    customFields.value[selectedCustomFieldIndex.value][key] = value;
};

// Handle model selection change
const handleModelChange = (newModel) => {
    selectedModel.value = newModel;
    updateComponent('model', newModel ? newModel.type : null);
    
    // Clear selected fields when model changes
    selectedFields.value = [];
    showDummyTable.value = false;
};

// Watch for model changes to update fields
watch(() => props.component.model, async (newModel) => {
    if (!newModel) {
        fieldOptions.value = [];
        items.value = [];
        itemCount.value = 0;
        showDummyTable.value = false;
        return;
    }

    loading.value = true;
    try {
        // Find the model object based on the type value
        const modelObj = modelOptions.value.find(m => m.type === newModel);
        
        if (modelObj) {
            // Fetch fields for this model
            const fields = await modelStore.fetchModelFields(modelObj.type);
            fieldOptions.value = fields.map(field => ({
                label: field.alias || field.name,
                value: field
            }));
            
            // Reset items and count when model changes
            items.value = [];
            itemCount.value = 0;
            showDummyTable.value = false;
        }
    } catch (error) {
        console.error('Error fetching model fields:', error);
    } finally {
        loading.value = false;
    }
});

const addItem = async () => {
    if (!props.component.model) {
        addCustomItem();
        return;
    }
    
    if (selectedFields.value.length === 0) {
        toast.add({ severity: 'warn', summary: 'Warning', detail: 'Please select fields first', life: 3000 });
        return;
    }
    
    // Instead of fetching from API, just show the dummy table with column headers
    showDummyTable.value = true;
    itemCount.value = 1; // Just showing one dummy row
};

// Function to ensure savedItems is correctly updated
const refreshDataTable = () => {
    // Force reactivity update by cloning the object
    if (savedItems.value) {
        const temp = JSON.parse(JSON.stringify(savedItems.value));
        savedItems.value = null;
        setTimeout(() => {
            savedItems.value = temp;
        }, 100);
    }
};

// Modify this function to update visibility after saving
const saveComponentItems = async () => {
    saveLoading.value = true;
    
    try {
        // Get component ID from route params or props or component object
        const componentId = route.params.id || props.id || props.component.component_id;
        
        if (!componentId) {
            throw new Error('Component ID is required. Please save the component first.');
        }

        // CASE 1: With model selected
        if (props.component.model && selectedFields.value.length > 0) {
            // Find the selected model for the class name
            const modelObj = modelOptions.value.find(m => m.type === props.component.model);
            if (!modelObj) {
                throw new Error('Selected model not found');
            }

            // Create the data structure for the API
            const componentItemData = {
                items: [
                    {
                        property_name: props.component.property_name || 'items',
                        component_id: componentId, // Use the extracted ID
                        model: modelObj.class,
                        item_count: itemCount.value,
                        is_recent: props.component.is_recent ? 1 : 0,
                        is_featured: props.component.is_featured ? 1 : 0,
                        fields: selectedFields.value.map(f => f.value.name)
                    }
                ]
            };

            console.log('Saving component items with model:', componentItemData);
            const result = await ComponentItemService.addComponentItems(componentItemData);
            console.log('Received API response:', result);
            
            // Store the result for display - ensure we handle the format properly
            savedItems.value = result;
            console.log('Stored savedItems:', savedItems.value);
            
            // Keep the dummy table visible - removed code that hides it
            // showDummyTable.value = false;
            
            toast.add({ severity: 'success', summary: 'Success', detail: 'Component items saved successfully', life: 3000 });
            
            return result;
        } 
        // CASE 2: No model selected (custom items)
        else if (customItems.value.length > 0) {
            // Format custom items into the required structure
            const formattedItems = customItems.value.map(item => {
                // Process the item to handle nested properties
                const processedFields = {};
                
                // Go through each item property
                for (const [key, value] of Object.entries(item)) {
                    if (key.includes('.')) {
                        // This is a nested field like "imageCircle.img"
                        const [parent, child] = key.split('.');
                        // Create parent object if it doesn't exist
                        if (!processedFields[parent]) {
                            processedFields[parent] = {};
                        }
                        // Set the child property
                        processedFields[parent][child] = value;
                    } else {
                        // Regular field
                        processedFields[key] = value;
                    }
                }
                
                return {
                    property_name: props.component.property_name || 'items',
                    component_id: componentId,
                    is_recent: props.component.is_recent ? 1 : 0,
                    is_featured: props.component.is_featured ? 1 : 0,
                    item_count: customItems.value.length,
                    fields: processedFields
                };
            });

            // Create the data structure for the API
            const componentItemData = {
                items: formattedItems
            };

            console.log('Saving custom component items:', componentItemData);
            const result = await ComponentItemService.addComponentItems(componentItemData);
            console.log('Received API response:', result);
            
            // Store the result for display
            savedItems.value = result;
            
            // Keep custom items in the array (don't clear them)
            // customItems.value = [];
            
            toast.add({ severity: 'success', summary: 'Success', detail: 'Custom items saved successfully', life: 3000 });
            
            return result;
        } else {
            toast.add({ 
                severity: 'error', 
                summary: 'Error', 
                detail: 'Please add at least one item or select a model and fields', 
                life: 3000 
            });
        }
    } catch (error) {
        console.error('Error saving component items:', error);
        toast.add({ severity: 'error', summary: 'Error', detail: `Failed to save component items: ${error.message}`, life: 3000 });
    } finally {
        saveLoading.value = false;
    }
};

// Function to check if the fields match the pattern from the screenshot
const isFieldsArray = (fields) => {
    if (!fields || !Array.isArray(fields)) return false;
    
    // Check if it's an array of strings like in the screenshot
    return fields.every(field => typeof field === 'string');
};

const editItem = (item) => {
    console.log('Edit item:', item);
    // Implement edit functionality here
};

// Add function to clear saved items display
const clearSavedItems = () => {
    savedItems.value = null;
};
</script>
<template>
    <div class="flex flex-col gap-6">
        <Toast />
        
        <!-- Warning when no component ID -->
        <div v-if="!component.component_id && !route.params.id" class="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
            <div class="flex">
                <div class="flex-shrink-0">
                    <i class="pi pi-exclamation-triangle text-yellow-400" style="font-size: 1.5rem;"></i>
                </div>
                <div class="ml-3">
                    <p class="text-sm text-yellow-700">
                        <strong>No component ID available.</strong> Please save the component in the "Component Overview" tab first.
                    </p>
                </div>
            </div>
        </div>

        <!-- Property Name - Always show -->
        <div class="grid grid-cols-12">
            <label class="flex items-center col-span-12 mb-2 md:col-span-4 lg:col-span-3 md:mb-0 text-lg">Property Name</label>
            <div class="col-span-12 md:col-span-8 lg:col-span-9">
                <InputText 
                    :value="component.property_name" 
                    @input="updateComponent('property_name', $event.target.value)" 
                    class="w-full text-lg" 
                />
            </div>
        </div>

        <!-- Model Dropdown - Always show -->
        <div class="grid grid-cols-12">
            <label class="flex items-center col-span-12 mb-2 md:col-span-4 lg:col-span-3 md:mb-0 text-lg">Model</label>
            <div class="col-span-12 md:col-span-8 lg:col-span-9">
                <Select 
                    v-model="selectedModel"
                    :options="modelOptions" 
                    optionLabel="name" 
                    placeholder="Select a Model" 
                    class="w-full text-lg" 
                    @change="handleModelChange($event.value)"
                    :loading="loading"
                />
            </div>
        </div>

        <!-- Is Recent Switch - Always show -->
        <div class="grid grid-cols-12">
            <label class="flex items-center col-span-12 mb-2 md:col-span-4 lg:col-span-3 md:mb-0 text-lg">Is Recent</label>
            <div class="col-span-12 md:col-span-8 lg:col-span-9">
                <InputSwitch 
                    :modelValue="component.is_recent" 
                    @update:modelValue="updateComponent('is_recent', $event)" 
                />
            </div>
        </div>

        <!-- Is Featured Switch - Always show -->
        <div class="grid grid-cols-12">
            <label class="flex items-center col-span-12 mb-2 md:col-span-4 lg:col-span-3 md:mb-0 text-lg">Is Featured</label>
            <div class="col-span-12 md:col-span-8 lg:col-span-9">
                <InputSwitch 
                    :modelValue="component.is_featured" 
                    @update:modelValue="updateComponent('is_featured', $event)" 
                />
            </div>
        </div>
        <div class="border-b border-gray-200"></div>

        <!-- CASE 1: Model Selected - Always show -->
        <template v-if="component.model">
            <!-- Fields Multiselect -->
            <div class="grid grid-cols-12">
                <label class="flex items-center col-span-12 mb-2 md:col-span-4 lg:col-span-3 md:mb-0 text-lg">Fields</label>
                <div class="col-span-12 md:col-span-8 lg:col-span-9">
                    <MultiSelect 
                        v-model="selectedFields" 
                        :options="fieldOptions" 
                        optionLabel="label" 
                        placeholder="Select Fields" 
                        class="w-full text-lg" 
                    />
                </div>
            </div>

            <!-- Add Item Button -->
            <div class="grid grid-cols-12">
                <div class="col-span-12 md:col-span-8 lg:col-span-9 md:col-start-5">
                    <div class="flex gap-2">
                        <Button 
                            icon="pi pi-plus" 
                            label="Add Item" 
                            @click="addItem" 
                            :loading="loading"
                            :disabled="selectedFields.length === 0"
                            class="p-button-primary"
                        />
                        <Button 
                            icon="pi pi-save" 
                            label="Save Component Items" 
                            @click="saveComponentItems" 
                            :loading="saveLoading"
                            :disabled="!showDummyTable"
                            class="p-button-success"
                        />
                    </div>
                </div>
            </div>

            <!-- Item Count -->
            <div v-if="itemCount > 0" class="grid grid-cols-12">
                <div class="col-span-12 md:col-span-8 lg:col-span-9 md:col-start-5">
                    <p class="text-lg">Total Items: {{ itemCount }}</p>
                </div>
            </div>

            <!-- Static Dummy DataTable showing selected column names -->
            <div v-if="showDummyTable" class="grid grid-cols-12 mt-4">
                <div class="col-span-12">
                    <DataTable :value="dummyTableData" class="p-datatable-sm">
                        <Column 
                            v-for="field in selectedFields" 
                            :key="field.value.id || field.value.name"
                            :field="field.value.name"
                            :header="field.value.alias || field.value.name"
                        >
                            <template #body>
                                <div class="text-gray-400 italic">Data will be fetched when saved</div>
                            </template>
                        </Column>
                    </DataTable>
                </div>
            </div>
        </template>

        <!-- CASE 2: No Model Selected - Always show -->
        <template v-if="!component.model">
            <div class="grid grid-cols-12 gap-4">
                <!-- Left: Field List -->
                <div class="col-span-12 md:col-span-4 lg:col-span-3">
                    <Button
                        class="w-full mb-2 p-button-secondary bg-gray-200 text-gray-800 hover:bg-gray-300"
                        icon="pi pi-plus"
                        label="Add option"
                        @click="addCustomField"
                    />
                    <div v-for="(field, idx) in customFields" :key="field.id" class="flex items-center mb-2">
                        <Button
                            :class="[
                                'w-full',
                                idx === selectedCustomFieldIndex
                                    ? 'bg-blue-500 text-white font-semibold'
                                    : (['name', 'title', 'description', 'linkText', 'image'].includes(field.name)
                                        ? 'bg-gray-50 hover:bg-gray-100'
                                        : 'bg-gray-100 hover:bg-gray-200')
                            ]"
                            :style="idx === selectedCustomFieldIndex
                                ? 'color: #fff;'
                                : (['name', 'title', 'description', 'linkText', 'image'].includes(field.name)
                                    ? 'color: #1f2937; background-color: #f9fafb !important;'
                                    : 'color: #1f2937;')"
                            @click="selectCustomField(idx)"
                        >
                            {{ field.name }}
                        </Button>
                        <Button icon="pi pi-times" class="ml-2 p-button-danger" @click="removeCustomField(idx)" v-if="customFields.length > 1" />
                    </div>
                </div>
                <!-- Right: Field Editor -->
                <div class="col-span-12 md:col-span-8 lg:col-span-9">
                    <div v-if="customFields[selectedCustomFieldIndex]">
                        <div class="mb-3">
                            <label class="block mb-1">Option</label>
                            <InputText v-model="customFields[selectedCustomFieldIndex].name" class="w-full" />
                        </div>
                        <div class="mb-3">
                            <label class="block mb-1">Type</label>
                            <Select v-model="customFields[selectedCustomFieldIndex].type" :options="customFieldTypes" optionLabel="label" optionValue="value" class="w-full" />
                        </div>
                        <div class="mb-3">
                            <label class="block mb-1">Default value</label>
                            <InputText v-if="customFields[selectedCustomFieldIndex].type !== 'textarea'" v-model="customFields[selectedCustomFieldIndex].defaultValue" class="w-full" />
                            <Textarea v-else v-model="customFields[selectedCustomFieldIndex].defaultValue" class="w-full" />
                        </div>
                        <div class="mb-3 flex items-center">
                            <label class="mr-2">Required</label>
                            <InputSwitch v-model="customFields[selectedCustomFieldIndex].required" />
                        </div>
                    </div>
                </div>
            </div>
            <!-- Add Item Button -->
            <div class="grid grid-cols-12 mt-4">
                <div class="col-span-12 md:col-span-8 lg:col-span-9 md:col-start-5">
                    <div class="flex gap-2">
                        <Button icon="pi pi-plus" label="Add Item" @click="addItem" class="p-button-primary" />
                        <Button 
                            v-if="customItems.length > 0"
                            icon="pi pi-save" 
                            label="Save Items" 
                            @click="saveComponentItems" 
                            :loading="saveLoading"
                            class="p-button-success"
                        />
                    </div>
                </div>
            </div>
            <!-- Custom Items DataTable -->
            <div v-if="customItems.length > 0" class="grid grid-cols-12 mt-4">
                <div class="col-span-12">
                    <DataTable :value="customItems" class="p-datatable-sm">
                        <Column v-for="field in customFields" :key="field.id" :field="field.name" :header="field.name">
                            <template #body="slotProps">
                                <div class="flex items-center gap-2">
                                    <span>{{ slotProps.data[field.name] }}</span>
                                </div>
                            </template>
                        </Column>
                        <Column header="Actions">
                            <template #body="slotProps">
                                <Button 
                                    icon="pi pi-pencil" 
                                    class="p-button-text p-button-rounded p-button-sm"
                                    @click="editCustomItem(customItems.indexOf(slotProps.data))"
                                />
                            </template>
                        </Column>
                    </DataTable>
                </div>
            </div>
        </template>

        <!-- Display saved items result when available -->
        <div v-if="savedItems" class="bg-green-50 p-4 mb-4 rounded-md border-l-4 border-green-500">
            <div class="flex justify-between items-center mb-3">
                <h3 class="text-lg font-semibold text-green-800">Component Items Saved Successfully</h3>
                <Button icon="pi pi-times" class="p-button-rounded p-button-text p-button-sm" @click="clearSavedItems" />
            </div>
            
            <!-- DataTable View -->
            <div class="mt-4 border-t border-green-200 pt-4">
                <h4 class="font-semibold mb-2">DataTable View</h4>
                <Button label="Refresh DataTable" class="mt-2 p-button-sm" @click="refreshDataTable" />
                <DataTable :value="savedItems.items" class="p-datatable-sm" v-if="savedItems.items && savedItems.items.length > 0">
                    <Column field="component_item_id" header="Item ID"></Column>
                    <Column field="component_id" header="Component ID"></Column>
                    <Column field="property_name" header="Property Name"></Column>
                    <Column field="model" header="Model"></Column>
                    <Column header="Is Recent">
                        <template #body="slotProps">
                            <i class="pi" :class="slotProps.data.is_recent === 1 ? 'pi-check-circle text-green-500' : 'pi-times-circle text-red-500'"></i>
                            {{ slotProps.data.is_recent === 1 ? 'Yes' : 'No' }}
                        </template>
                    </Column>
                    <Column header="Is Featured">
                        <template #body="slotProps">
                            <i class="pi" :class="slotProps.data.is_featured === 1 ? 'pi-check-circle text-green-500' : 'pi-times-circle text-red-500'"></i>
                            {{ slotProps.data.is_featured === 1 ? 'Yes' : 'No' }}
                        </template>
                    </Column>
                    <Column header="Item Count">
                        <template #body="slotProps">
                            {{ slotProps.data.item_count || 0 }}
                        </template>
                    </Column>
                    <Column header="Fields">
                        <template #body="slotProps">
                            <div v-if="Array.isArray(slotProps.data.fields)" class="flex flex-wrap gap-1">
                                <span v-for="(field, index) in slotProps.data.fields" :key="index" 
                                    class="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                                    {{ field }}
                                </span>
                            </div>
                            <div v-else>
                                <span class="text-gray-500 italic">{{ typeof slotProps.data.fields }}</span>
                            </div>
                        </template>
                    </Column>
                </DataTable>
            </div>
            
            <!-- Show raw JSON for debugging -->
            <!-- <div class="mt-3">
                <details open>
                    <summary class="cursor-pointer text-blue-600 hover:text-blue-800">View Raw Response</summary>
                    <pre class="mt-2 p-3 bg-gray-50 text-xs overflow-auto max-h-80 rounded">{{ JSON.stringify(savedItems, null, 2) }}</pre>
                </details>
            </div> -->
        </div>

        <!-- Display loading overlay -->
        <div v-if="saveLoading" class="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div class="bg-white p-6 rounded-lg shadow-lg text-center">
                <i class="pi pi-spin pi-spinner text-5xl text-blue-500 mb-3"></i>
                <p class="text-xl">Saving component items...</p>
            </div>
        </div>

        <ComponentItemAddModal 
            :fields="customFields" 
            :item="customItems[selectedCustomItemIndex]" 
            v-model:visible="addItemModalVisible" 
            @save="handleItemSaved" 
        />
    </div>
</template>