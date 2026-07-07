<script setup lang="ts">
import {onMounted } from 'vue';
import type { PropType } from 'vue';
import type FeedbackHandler from '@/utils/FeedbackHandler';
import type { DynamicModel } from '@/models/Input';
import moment from 'moment';
import RichTextEditor from '@/components/form/RichTextEditor.vue';


// PrimeVue Components

interface InputType {
    type: string;
    type_id?: string;
}


const emit = defineEmits(['upload', 'removeUploaded', 'update:modelValue', 'change']);

const props = defineProps({
    types: {
        type: Array as PropType<InputType[]>,
        required: true
    },
    model: {
        type: Object as PropType<DynamicModel>,
        required: true
    },
    disabled: {
        type: Boolean,
        default: true
    },
    hideDropdown: {
        type: Boolean,
        default: false
    },
    uploadedFilesData: {
        type: Array as PropType<any[]>,
        default: () => []
    },
    fb: {
        type: Object as PropType<typeof FeedbackHandler>,
        required: true
    },
    mediaFb: {
        type: Object as PropType<typeof FeedbackHandler>,
        required: false
    }
});


const handleUpload = (e: any) => {
    emit('upload', e);
}

const handleRemoveUploaded = (e: any) => {
    emit('removeUploaded', e);
}

const search = (event: any, type: string) => {
    // Handle autocomplete search
    // console.log('Searching:', event.query, 'for type:', type);
};
const handleChange = (event: any, model: any, type: string) => {
    if(type === 'date') {
        console.log('Date: ', model.value);
        model.value = moment(model.value).format('ddd DD/MM/YY');
    }
    emit('change', event, model);
}
const handleTypeChange = (event: any) => {
   if(event.value.type === 'FileUpload') {
        props.model.value = [];
   }
   if(event.value.type === 'Editor') {
        props.model.editorConfig = props.model.editorConfig || {
            toolbar: true,
            resize: true
        };
   }
   if(event.value.type === 'InputMask') {
        props.model.mask = props.model.mask || '99-999-999';
   }
   if(event.value.type === 'Knob') {
        props.model.value = props.model.value || 0;
        props.model.min = props.model.min || 0;
        props.model.max = props.model.max || 100;
        props.model.step = props.model.step || 1;
   }
}
onMounted(() => {
    console.log(props.model);
});


</script>

<template>
    <div class="flex flex-col">
        <div v-if="!hideDropdown">
            <label class="block font-semibold text-gray-700 mb-1">Option Type *</label>
            <Select
                v-model="model.type.type"
                class="w-full p-1"
                placeholder="Option Type"
                optionLabel="type"
                :filter="true"
                :options="types"
                @change="handleTypeChange"
                :disabled="disabled"
                required
            />
        </div>
        <div :class="{'mt-5': !hideDropdown}">
            <!-- Here we will Dynamically add Input for setting input options such as based on the type of the input
                min
                max
                step
                options
                suggestions
                mask
                keyfilter
                cascadeOptions
                treeOptions
                editorConfig
                length
              -->
            <!-- Numeric Configuration (min, max, step) -->
            <div v-if="['InputNumber', 'Knob', 'Slider'].includes(model.type?.type?.type)" class="flex flex-col " :class="{'gap-4': !hideDropdown}">
                <div class="flex col gap-4">
                    <div class="flex-1">
                        <label class="block font-semibold text-gray-700 mb-1">Minimum Value</label>
                        <InputNumber v-model="model.min" placeholder="Min value" class="w-full" />
                    </div>
                    <div class="flex-1">
                        <label class="block font-semibold text-gray-700 mb-1">Maximum Value</label>
                        <InputNumber v-model="model.max" placeholder="Max value" class="w-full" />
                    </div>
                    <div class="flex-1">
                        <label class="block font-semibold text-gray-700 mb-1">Step</label>
                        <InputNumber v-model="model.step" placeholder="Step value" class="w-full" />
                    </div>
                </div>
            </div>

            <!-- Options Configuration -->
            <div v-if="['Select', 'MultiSelect', 'RadioButton', 'SelectButton', 'Listbox'].includes(model.type?.type?.type)" class="flex flex-col " :class="{'gap-4': !hideDropdown}">
                <label class="block font-semibold text-gray-700 mb-1" v-if="!hideDropdown">Options</label>
                <div v-for="(option, index) in (model.options || [])" :key="index" class="flex gap-2 items-center">
                    <InputText v-model="option.label" placeholder="Label" class="flex-1" />
                    <InputText v-model="option.value" placeholder="Value" class="flex-1" />
                    <Button icon="pi pi-trash" severity="danger" @click="model.options?.splice(index, 1)" />
                </div>
                <Button label="Add Option" icon="pi pi-plus" @click="model.options = [...(model.options || []), { label: '', value: '' }]" />
            </div>

            <!-- Suggestions Configuration -->
            <div v-if="['AutoComplete'].includes(model.type?.type?.type)" class="flex flex-col " :class="{'gap-4': !hideDropdown}">
                <label class="block font-semibold text-gray-700 mb-1" v-if="!hideDropdown">Suggestions</label>
                <div v-for="(suggestion, index) in (model.suggestions || [])" :key="index" class="flex gap-2 items-center">
                    <InputText v-model="(model.suggestions || [])[index]" placeholder="Suggestion" class="flex-1" />
                    <Button icon="pi pi-trash" severity="danger" @click="model.suggestions?.splice(index, 1)" />
                </div>
                <Button variant="link" label="Add Suggestion" icon="pi pi-plus" @click="model.suggestions = [...(model.suggestions || []), '']" />
            </div>

            <!-- Mask Configuration -->
            <div v-if="['InputMask'].includes(model.type?.type?.type)" class="flex flex-col " :class="{'gap-4': !hideDropdown}">
                <label class="block font-semibold text-gray-700 mb-1" v-if="!hideDropdown">Mask Pattern</label>
                <InputText v-model="model.mask" placeholder="e.g. 99-999-999" class="w-full" />
                <small class="text-gray-500">Use 9 for numbers, a for letters, * for alphanumeric</small>
            </div>

            <!-- KeyFilter Configuration -->
            <div v-if="['KeyFilter'].includes(model.type?.type?.type)" class="flex flex-col " :class="{'gap-4': !hideDropdown}">
                <label class="block font-semibold text-gray-700 mb-1" v-if="!hideDropdown">Key Filter</label>
                <Select v-model="model.keyfilter" :options="[
                    { label: 'Numbers', value: 'num' },
                    { label: 'Integer', value: 'int' },
                    { label: 'Alphabetic', value: 'alpha' },
                    { label: 'Alphanumeric', value: 'alphanum' }
                ]" placeholder="Select filter type" class="w-full" />
            </div>

            <!-- Cascade Options Configuration -->
            <div v-if="['CascadeSelect'].includes(model.type?.type?.type)" class="flex flex-col " :class="{'gap-4': !hideDropdown}">
                <label class="block font-semibold text-gray-700 mb-1" v-if="!hideDropdown">Cascade Options</label>
                <div v-for="(option, index) in (model.cascadeOptions || [])" :key="index" class="flex gap-2 items-center">
                    <InputText v-model="option.label" placeholder="Label" class="flex-1" />
                    <InputText v-model="option.value" placeholder="Value" class="flex-1" />
                    <Button icon="pi pi-trash" severity="danger" @click="model.cascadeOptions?.splice(index, 1)" />
                </div>
                <Button label="Add Cascade Option" icon="pi pi-plus" @click="model.cascadeOptions = [...(model.cascadeOptions || []), { label: '', value: '', items: [] }]" />
            </div>

            <!-- Tree Options Configuration -->
            <div v-if="['TreeSelect'].includes(model.type?.type?.type)" class="flex flex-col " :class="{'gap-4': !hideDropdown}">
                <label class="block font-semibold text-gray-700 mb-1" v-if="!hideDropdown">Tree Options</label>
                <div v-for="(option, index) in (model.treeOptions || [])" :key="index" class="flex gap-2 items-center">
                    <InputText v-model="option.label" placeholder="Label" class="flex-1" />
                    <InputText v-model="option.value" placeholder="Value" class="flex-1" />
                    <Button icon="pi pi-trash" severity="danger" @click="model.treeOptions?.splice(index, 1)" />
                </div>
                <Button label="Add Tree Option" icon="pi pi-plus" @click="model.treeOptions = [...(model.treeOptions || []), { label: '', value: '', children: [] }]" />
            </div>

            <!-- Editor Configuration -->
            <!-- <div v-if="['Editor'].includes(model.type?.type?.type)" class="flex flex-col " :class="{'gap-4': !hideDropdown}">
                <Editor v-model="model.value" />
            </div> -->

            <!-- Length Configuration -->
            <div v-if="['InputOtp'].includes(model.type?.type?.type)" class="flex flex-col " :class="{'gap-4': !hideDropdown}">
                <label class="block font-semibold text-gray-700 mb-1" v-if="!hideDropdown">OTP Length</label>
                <InputNumber v-model="model.length" placeholder="Length" :min="1" :max="12" class="w-full" />
            </div>
        </div>
        <!-- AutoComplete -->
        <div v-if="model.type?.type?.type === 'AutoComplete'" class="flex flex-col" :class="{'gap-2': !hideDropdown}">
            <label class="block font-semibold text-gray-700 mb-1" v-if="!hideDropdown">{{ model.name + (model.required ? " *" : "") }}</label>
            <AutoComplete
                v-model="model.value"
                :suggestions="model.suggestions"
                :placeholder="model.placeholder || 'Type to search'"
                :required="model.required"
                :class="{ 'w-full': true }"
                @complete="search($event, 'auto')"
                :pt="{
                    pcInputText: {
                        root: { class: 'w-full', style: { 'padding': '10px' } }
                    }
                }"
            />
        </div>

        <!-- CascadeSelect -->
        <div v-else-if="model.type?.type?.type === 'CascadeSelect'" class="flex flex-col" :class="{'gap-2': !hideDropdown}">
            <label class="block font-semibold text-gray-700 mb-1" v-if="!hideDropdown">{{ model.name + (model.required ? " *" : "") }}</label>
            <CascadeSelect
                v-model="model.value"
                :options="model.cascadeOptions"
                :placeholder="model.placeholder || 'Select'"
                :required="model.required"
            />
        </div>

        <!-- Checkbox -->
        <div v-else-if="model.type?.type?.type === 'Checkbox'" class="flex items-center" :class="{'gap-2': !hideDropdown}">
            <Checkbox
                v-model="model.value"
                :binary="true"
                :required="model.required"
            />
            <label class="block font-semibold text-gray-700 mb-1" v-if="!hideDropdown">{{ model.name + (model.required ? " *" : "") }}</label>
        </div>

        <!-- Editor -->
        <div v-else-if="model.type?.type?.type === 'Editor'" class="flex flex-col" :class="{'gap-2': !hideDropdown}">
            <label class="block font-semibold text-gray-700 mb-1" v-if="!hideDropdown">{{ model.name + (model.required ? " *" : "") }}</label>
            <!-- <Editor
                v-model="model.value"
                :required="model.required"
                :modules="{ toolbar: false }"
                :pt="{ toolbar: { class: 'hidden' } }"
            /> -->
            <RichTextEditor v-model="model.value" 
            :pt="{ toolbar: { class: 'hidden' } }"
            :modules="{ toolbar: false }"
            :required="model.required"/>
        </div>

        <!-- InputMask -->
        <div v-else-if="model.type?.type?.type === 'InputMask'" class="flex flex-col" :class="{'gap-2': !hideDropdown}">
            <label class="block font-semibold text-gray-700 mb-1" v-if="!hideDropdown">{{ model.name + (model.required ? " *" : "") }}</label>
            <InputMask
                v-model="model.value"
                :mask="model.mask || '99-999-999'"
                :placeholder="model.placeholder || ''"
                :required="model.required"
            />
        </div>

        <!-- InputOtp -->
        <div v-else-if="model.type?.type?.type === 'InputOtp'" class="flex flex-col" :class="{'gap-2': !hideDropdown}">
            <label class="block font-semibold text-gray-700 mb-1" v-if="!hideDropdown">{{ model.name + (model.required ? " *" : "") }}</label>
            <InputOtp
                v-model="model.value"
                :length="model.length || 4"
                :required="model.required"
            />
        </div>

        <!-- KeyFilter -->
        <div v-else-if="model.type?.type?.type === 'KeyFilter'" class="flex flex-col" :class="{'gap-2': !hideDropdown}">
            <label class="block font-semibold text-gray-700 mb-1" v-if="!hideDropdown">{{ model.name + (model.required ? " *" : "") }}</label>
            <InputText
                v-model="model.value"
                :keyfilter="model.keyfilter"
                :placeholder="model.placeholder || ''"
                :required="model.required"
            />
        </div>

        <!-- Knob -->
        <div v-else-if="model.type?.type?.type === 'Knob'" class="flex flex-col items-center" :class="{'gap-2': !hideDropdown}">
            <label class="block font-semibold text-gray-700 mb-1" v-if="!hideDropdown">{{ model.name + (model.required ? " *" : "") }}</label>
            <Knob
                v-model="model.value"
                :min="model.min || 0"
                :max="model.max || 100"
                :step="model.step || 1"
                :required="model.required"
            />
        </div>

        <!-- Listbox -->
        <div v-else-if="model.type?.type?.type === 'Listbox'" class="flex flex-col" :class="{'gap-2': !hideDropdown}">
            <label class="block font-semibold text-gray-700 mb-1" v-if="!hideDropdown">{{ model.name + (model.required ? " *" : "") }}</label>
            <Listbox
                v-model="model.value"
                :options="model.options"
                :filter="true"
                :required="model.required"
            />
        </div>

        <!-- Password -->
        <div v-else-if="model.type?.type?.type === 'Password'" class="flex flex-col" :class="{'gap-2': !hideDropdown}">
            <label class="block font-semibold text-gray-700 mb-1" v-if="!hideDropdown">{{ model.name + (model.required ? " *" : "") }}</label>
            <Password
                v-model="model.value"
                :feedback="false"
                :toggleMask="true"
                :required="model.required"
            />
        </div>

        <!-- RadioButton -->
        <div v-else-if="model.type?.type?.type === 'RadioButton'" class="flex flex-col" :class="{'gap-2': !hideDropdown}">
            <label class="block font-semibold text-gray-700 mb-1" v-if="!hideDropdown">{{ model.name + (model.required ? " *" : "") }}</label>
            <div class="flex gap-4">
                <div v-for="option in model.options" :key="option.value" class="flex items-center gap-2">
                    <RadioButton
                        v-model="model.value"
                        :value="option.value"
                        :required="model.required"
                    />
                    <label>{{ option.label }}</label>
                </div>
            </div>
        </div>

        <!-- Rating -->
        <div v-else-if="model.type?.type?.type === 'Rating'" class="flex flex-col" :class="{'gap-2': !hideDropdown}">
            <label class="block font-semibold text-gray-700 mb-1" v-if="!hideDropdown">{{ model.name + (model.required ? " *" : "") }}</label>
            <Rating
                v-model="model.value"
                :cancel="false"
                :required="model.required"
            />
        </div>

        <!-- SelectButton -->
        <div v-else-if="model.type?.type?.type === 'SelectButton'" class="flex flex-col" :class="{'gap-2': !hideDropdown}">
            <label class="block font-semibold text-gray-700 mb-1" v-if="!hideDropdown">{{ model.name + (model.required ? " *" : "") }}</label>
            <SelectButton
                v-model="model.value"
                :options="model.options"
                optionLabel="label"
                optionValue="value"
                :required="model.required"
            />
        </div>

        <!-- Slider -->
        <div v-else-if="model.type?.type?.type === 'Slider'" class="flex flex-col" :class="{'gap-2': !hideDropdown}">
            <label class="block font-semibold text-gray-700 mb-1" v-if="!hideDropdown">{{ model.name + (model.required ? " *" : "") }}</label>
            <Slider
                v-model="model.value"
                :min="model.min || 0"
                :max="model.max || 100"
                :step="model.step || 1"
                :required="model.required"
            />
            <span class="text-sm text-gray-500">Value: {{ model.value }}</span>
        </div>

        <!-- ToggleButton -->
        <div v-else-if="model.type?.type?.type === 'ToggleButton'" class="flex items-center" :class="{'gap-2': !hideDropdown}">
            <ToggleButton
                v-model="model.value"
                :onLabel="'Yes'"
                :offLabel="'No'"
                :required="model.required"
            />
            <label class="block font-semibold text-gray-700 mb-1" v-if="!hideDropdown">{{ model.name + (model.required ? " *" : "") }}</label>
        </div>

        <!-- TreeSelect -->
        <div v-else-if="model.type?.type?.type === 'TreeSelect'" class="flex flex-col" :class="{'gap-2': !hideDropdown}">
            <label class="block font-semibold text-gray-700 mb-1" v-if="!hideDropdown">{{ model.name + (model.required ? " *" : "") }}</label>
            <TreeSelect
                v-model="model.value"
                :options="model.treeOptions"
                :placeholder="model.placeholder || 'Select Item'"
                :required="model.required"
            />
        </div>

        <!-- InputSwitch (ToggleSwitch) -->
        <div v-else-if="['InputSwitch', 'ToggleSwitch'].includes(model.type?.type?.type)" class="flex items-center" :class="{'gap-2': !hideDropdown}">
            <ToggleSwitch
                v-model="model.value"
                :required="model.required"
            />
            <label class="block font-semibold text-gray-700 mb-1" v-if="!hideDropdown">{{ model.name + (model.required ? " *" : "") }}</label>
        </div>

        <!-- Keep existing components -->
        <!-- File Upload Option -->
        <div v-else-if="model.type?.type?.type === 'FileUpload'" class="flex flex-col" :class="{'gap-4': !hideDropdown}">
            <label class="block font-semibold text-gray-700 mb-1" v-if="!hideDropdown">{{ model.name + (model.required ? " *" : "") }}</label>
            <UploadFileFeature 
                :uploadedFilesData="uploadedFilesData"
                :fb="mediaFb"
                :property="model.name"
                @upload="handleUpload"
                @removeUploadedFile="handleRemoveUploaded"
                :required="model.required"
            />
        </div>

        <!-- Color Picker Option -->
        <div v-else-if="model.type?.type?.type === 'ColorPicker'" class="flex items-center" :class="{'gap-4': !hideDropdown}">
            <label class="block font-semibold text-gray-700 mb-1" v-if="!hideDropdown">{{ model.name + (model.required ? " *" : "") }}</label>
            <ColorPicker 
                v-model="model.value" 
                :pt="{
                    preview: {
                        style: 'width: 50px; height: 2rem;'
                    }
                }"
                :required="model.required"
            />
            <span class="ml-2">{{ model.value }}</span>
            <span class="ml-2 text-sm text-gray-500">HEX Code</span>
        </div>

        <!-- Text Input Option -->
        <div v-else-if="model.type?.type?.type === 'InputText'" class="flex flex-col" :class="{'gap-2': !hideDropdown}">
            <label class="block font-semibold text-gray-700 mb-1" v-if="!hideDropdown">{{ model.name + (model.required ? " *" : "") }}</label>
            <InputText 
                v-model="model.value"
                :placeholder="model.placeholder || ''"
                :required="model.required"
            />
        </div>

        <!-- Textarea Option -->
        <div v-else-if="['Textarea', 'JSON'].includes(model.type?.type?.type)" class="flex flex-col" :class="{'gap-2': !hideDropdown}">
            <label class="block font-semibold text-gray-700 mb-1" v-if="!hideDropdown">{{ model.name + (model.required ? " *" : "") }}</label>
            <Textarea 
                v-model="model.value"
                :placeholder="model.placeholder || ''"
                :required="model.required"
                :autoResize="true"
                rows="5"
            />
        </div>

        <!-- Number Input Option -->
        <div v-else-if="model.type?.type?.type === 'InputNumber'" class="flex flex-col" :class="{'gap-2': !hideDropdown}">
            <label class="block font-semibold text-gray-700 mb-1" v-if="!hideDropdown">{{ model.name + (model.required ? " *" : "") }}</label>
            <InputNumber 
                v-model="model.value"
                :placeholder="model.placeholder || ''"
                :required="model.required"
                :min="model.min"
                :max="model.max"
                :step="model.step || 1"
            />
        </div>

        <!-- Switch Option -->
        <div v-else-if="model.type?.type?.type === 'Switch'" class="flex items-center" :class="{'gap-4': !hideDropdown}">
            <InputSwitch 
                v-model="model.value"
                :required="model.required"
            />
            <label class="block font-semibold text-gray-700 mb-1" v-if="!hideDropdown">{{ model.name + (model.required ? " *" : "") }}</label>
        </div>

        <!-- Select Option -->
        <div v-else-if="model.type?.type?.type === 'Select'" class="flex flex-col" :class="{'gap-2': !hideDropdown}">
            <label class="block font-semibold text-gray-700 mb-1" v-if="!hideDropdown">{{ model.name + (model.required ? " *" : "") }}</label>
            <Select
                v-model="model.value"
                :options="model.options"
                :placeholder="model.placeholder || 'Select an option'"
                :required="model.required"
                :filter="true"
            />
        </div>

        <!-- MultiSelect Option -->
        <div v-else-if="model.type?.type?.type === 'MultiSelect'" class="flex flex-col" :class="{'gap-2': !hideDropdown}">
            <label class="block font-semibold text-gray-700 mb-1" v-if="!hideDropdown">{{ model.name + (model.required ? " *" : "") }}</label>
            <MultiSelect
                v-model="model.value"
                :options="model.options"
                :placeholder="model.placeholder || 'Select options'"
                optionLabel="label"
                :required="model.required"
                :filter="true"
            />
        </div>

        <!-- Date Picker Option --> 
        <div v-else-if="model.type?.type?.type === 'DatePicker'" class="flex flex-col" :class="{'gap-2': !hideDropdown}">
            <label class="block font-semibold text-gray-700 mb-1" v-if="!hideDropdown">{{ model.name + (model.required ? " *" : "") }}</label>
            <Calendar
                v-model="model.value"
                :dateFormat="'D dd/mm/yy'"
                :placeholder="model.placeholder || 'Select date'"
                :required="model.required"
                :showIcon="true"
                @dateSelect="handleChange($event, model, 'date')"
            />
        </div>
    </div>
</template>

<style scoped>

</style>