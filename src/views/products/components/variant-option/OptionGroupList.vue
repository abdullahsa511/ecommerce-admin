<script setup lang="ts">
import { ref, computed, watch, PropType } from 'vue'
import OptionGroupForm from '@/views/products/components/variant-option/OptionGroupForm.vue'
import { IProductVariant, ProductOption, ProductOptionGroup, ProductVariant } from '@/models/Product.ts'
import FeedbackHandler from '@/utils/FeedbackHandler';

//Declear emits
const emit = defineEmits([
    'save', 
    'insert:optionGroup', 
    'update:optionGroup', 
    'searchOptionGroups', 
    'searchOptions', 
    'add:optionGroup',
    'add:option',
    'insert:option',
    'update:option',
    'delete:option',
    'delete:optionGroup',
    'searchTypes',
    'add:type',
    'update:variant',
    'inputOption',
    'upload:optionImage',
    'remove:optionImage'
]) 

//System variables such as props, useStore or stateToRef etc
const props = defineProps({ 
    showOptionList: {
        type: Boolean,
        default: true
    },
    variant: {
        type: Object as PropType<IProductVariant>,
        required: true,
        default: () => new ProductVariant()
    },
    optionGroupSuggestions: {
        type: Array as PropType<ProductOptionGroup[]>,
        required: false,
        default: () => []
    },
    optionSuggestions: {
        type: Array as PropType<any[]>,
        required: false,
        default: () => []
    },
    showOptionGroupForm: {
        type: Boolean,
        required: false,
        default: true
    },
    typeSuggestions: {
        type: Array as PropType<any[]>,
        required: false,
        default: () => []
    },
    fb: {
        type: Object as PropType<FeedbackHandler>,
        required: false,
        default: () => new FeedbackHandler()
    },
    buttonLabel: {
        type: String,
        required: false,
        default: 'Update Option Group'
    }
 })

const expandedRows = ref<Record<number, boolean>>({});


//Define local methods here

const optionGroupUniqueErrorId = (group: ProductOptionGroup) => {
    return props.variant.product_id + '-' + props.variant.product_variant_id + '-' + group.option_group_name + '_group_error'
}

const toggleOptionGroup = (index: number) => {
    if(props.variant.productOptionGroups[index]){
        props.variant.productOptionGroups[index].active = !props.variant.productOptionGroups[index].active;
    }
};

const handleTabOpen = (event: any) => {
    const index = typeof event.index === 'string' ? parseInt(event.index) : event.index;
    toggleOptionGroup(index);
};

const handleTabClose = (event: any) => {
    const index = typeof event.index === 'string' ? parseInt(event.index) : event.index;
    expandedRows.value[index] = false;
    toggleOptionGroup(index);
};

// Computed value for Accordion's active tab
const activeTab = computed(() => {
    const openIndex = props.variant.productOptionGroups?.findIndex(group => group.active === true);
    return openIndex !== undefined ? openIndex.toString() : null;
});

const getDefaultOption = (group: ProductOptionGroup) => {
    const defaultOption = group.productOptions.find(option => option.is_default === true);
    return defaultOption ?? group.productOptions[0] ?? new ProductOption({});
}

const searchOptionGroups = (event: any) => {
    emit('searchOptionGroups', event)
}
const handleInsertOptionGroup = (group: ProductOptionGroup) => {
    emit('insert:optionGroup', group);
}
const handleUpdateOptionGroup = (group: ProductOptionGroup) => {
    emit('update:variant', props.variant);
}
const handleAddOptionGroup = (data: any, index: number) => {
    data.index = index;
    emit('add:optionGroup', data);
}
const searchOptions = (event: any) => {
    emit('searchOptions',event)
}
const handleAddOption = (event: any, groupIndex: number) => {
    const optionGroup = props.variant.productOptionGroups[groupIndex];
    event.option_gropu_name = optionGroup.option_group_name;
    emit('add:option', {...event, groupIndex})
}
const handleInsertOption = (event: any) => {
    emit('insert:option', event)
}
const handleUpdateOption = (event: any) => {
    emit('update:option', event)
}
const handleDeleteOption = (event: any) => {
    emit('delete:option', event)
}
const handleDeleteOptionGroup = (event: any) => {
    emit('delete:optionGroup', event)
}
const searchTypes = (event: any) => {
    emit('searchTypes', event)
}
const addType = (event: any) => {
    emit('add:type', event)
}
const inputOption = (event: any) => {
    emit('inputOption', event)
}
const handleUploadOptionImage = (event: any) => {
    emit('upload:optionImage', event)
}
const handleRemoveOptionImage = (event: any) => {
    emit('remove:optionImage', event)
}
</script>

<template>
    <div class=" w-full bg-white shadow flex flex-col gap-4">
        <div class="flex flex-col mb-2 gap-2">
            <!-- <Message           
            closable class="border-l-4 border-red-500">
            Lorem ipsum dolor sit amet.
            </Message> -->
        </div>
        <Accordion 
            :value="activeTab"
            @tab-open="handleTabOpen"
            @tab-close="handleTabClose"
        >
        <template #collapseicon>
            <span style="display: none;"></span>
        </template>
        <template #expandicon>
            <span style="display: none;"></span>
        </template>
            <AccordionPanel 
                v-for="(group, index) in props.variant.productOptionGroups" 
                :key="index"
                :value="index.toString()"
                class="product-option-panel border" 
                :class="{ 'error-border': fb.errors?.[optionGroupUniqueErrorId(group)] }"
                >
                <AccordionHeader
                    class="product-option-header flex justify-between items-center text-lg font-bold border position-relative"
                    
                >
                    <span class="flex items-center" :class="{ 'error-text': fb.errors?.[optionGroupUniqueErrorId(group)] }">
                        <span class="pr-2">{{ index + 1 }}</span>
                        <span>{{ group.option_group_name }}</span>
                    </span>
                    <div class="flex gap-2 items-center">
                        <span class="heading-heilight text-sm font-semibold text-gray-700">
                            {{ getDefaultOption(group).option_name }}
                        </span>
                        <div class="flex gap-2">
                            <Button
                                v-if="showOptionGroupForm"
                            :icon="'pi pi-pencil'" 
                            severity="success" rounded outlined/>
                            <Button 
                                :icon="'pi pi-trash'"
                                :loading="fb.loading['product.option-group.delete.'+group.product_option_group_id]"
                                rounded outlined
                                severity="danger"
                                @click="handleDeleteOptionGroup(group)"
                                />
                        </div> 
                    </div>
                </AccordionHeader>
                <AccordionContent>
                    <OptionGroupForm 
                        :showHiddenButton="false"
                        :showOptionList="showOptionList"
                        :fb="fb"
                        :buttonLabel="buttonLabel"
                        :optionGroup="group"
                        :optionGroupSuggestions="optionGroupSuggestions"
                        :optionSuggestions="optionSuggestions"
                        :typeSuggestions="typeSuggestions"
                        @add:optionGroup="handleAddOptionGroup($event, index)"
                        @insert:optionGroup="handleInsertOptionGroup($event)" 
                        @update:optionGroup="handleUpdateOptionGroup($event)" 
                        @searchOptionGroups="searchOptionGroups($event)"
                        @searchOptions="searchOptions($event)"
                        @add:option="handleAddOption($event, index)"
                        @insert:option="handleInsertOption($event)"
                        @update:option="handleUpdateOption($event)"
                        @delete:option="handleDeleteOption($event)"
                        @searchTypes="searchTypes($event)"
                        @add:type="addType($event)"
                        @inputOption="inputOption($event)"
                        @upload:optionImage="handleUploadOptionImage($event)"
                        @remove:optionImage="handleRemoveOptionImage($event)"
                    />
                </AccordionContent>
            </AccordionPanel>
        </Accordion>
    </div>
</template>
<style scoped>
.p-message-info{
    background: rgb(197, 33, 33) !important;
    color:rgb(185 28 28 / var(--tw-text-opacity, 1));
  }
  .error-border{
    border: 1px solid red;
    border-radius: 5px;
    padding: 10px;
  }
  .error-text{
    color: red;
    font-weight: bold;
  }
</style>