<script setup lang="ts">
import Field from '@/models/Field';
import { computed, watch } from 'vue'
import Dialog from 'primevue/dialog';
import InputText from 'primevue/inputtext';
import InputNumber from 'primevue/inputnumber';
import Textarea from 'primevue/textarea';
import InputSwitch from 'primevue/inputswitch';
import Button from 'primevue/button';

const props = defineProps({
  fields: {
    type: Array as () => Field[],
    default: () => []
  },
  item: {
    type: Object,
    default: () => ({})
  },
  visible: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:visible', 'save'])

const dialogVisible = computed({
  get: () => props.visible,
  set: (value) => emit('update:visible', value)
})

// Process fields to ensure they are Field instances
const processedFields = computed(() => {
  return props.fields.map(field => {
    // If it's already a Field instance, return it
    if (field instanceof Field) {
      return field;
    }
    // Otherwise, create a new Field instance
    return new Field(field);
  });
});

// Watch for changes to fields to ensure item has all required properties
// This also handles renaming fields
watch(() => processedFields.value, (newFields, oldFields) => {
  if (newFields && props.item) {
    // Make sure all current field names are in the item
    newFields.forEach(field => {
      if (!(field.name in props.item)) {
        // Use field.defaultValue if available, otherwise empty string
        props.item[field.name] = field.defaultValue !== undefined ? field.defaultValue : '';
      }
    });
    
    // Handle field renaming - find old fields that have been removed or renamed
    if (oldFields?.length) {
      const oldFieldNames = oldFields.map(f => f.name);
      const newFieldNames = newFields.map(f => f.name);
      
      oldFieldNames.forEach(oldName => {
        // If old field name no longer exists in new fields
        if (!newFieldNames.includes(oldName) && oldName in props.item) {
          // Try to find a matching field with same ID but different name
          const oldField = oldFields.find(f => f.name === oldName);
          if (oldField?.id) {
            const newField = newFields.find(f => f.id === oldField.id && f.name !== oldName);
            if (newField) {
              // Copy data to the new field name
              props.item[newField.name] = props.item[oldName];
              // Remove old field
              delete props.item[oldName];
            }
          }
        }
      });
    }
  }
}, { deep: true, immediate: true });

// Helper to get a field label from name (especially for nested fields)
const getFieldLabel = (fieldName: string): string => {
  if (fieldName.includes('.')) {
    const [object, property] = fieldName.split('.');
    return `${object} → ${property}`;
  }
  return fieldName;
}

// Save the edited item
const saveItem = () => {
  emit('save', props.item);
  dialogVisible.value = false;
}
</script>

<template>
  <Dialog v-model:visible="dialogVisible" 
  maximizable modal header="Add Item" 
  :style="{ width: '50rem' }" :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
  :pt="{
    header: { class: 'p-[30px] pb-0' }
  }">
    <div class="flex flex-col gap-4 p-[30px]">
      <template v-for="field in processedFields" :key="field.id || field.name">
        <div v-if="field.type === 'text'" class="flex flex-col gap-2">
            <label :for="field.name">{{ getFieldLabel(field.name) }}</label>
            <InputText :id="field.name" v-model="item[field.name]" class="w-full" />
            <small v-if="field.required" class="text-red-500">This field is required</small>
        </div>
        <div v-else-if="field.type === 'number'" class="flex flex-col gap-2">
            <label :for="field.name">{{ getFieldLabel(field.name) }}</label>
            <InputNumber :id="field.name" v-model="item[field.name]" class="w-full" />
            <small v-if="field.required" class="text-red-500">This field is required</small>
        </div>
        <div v-else-if="field.type === 'textarea'" class="flex flex-col gap-2">
            <label :for="field.name">{{ getFieldLabel(field.name) }}</label>
            <Textarea :id="field.name" v-model="item[field.name]" class="w-full" rows="5" />
            <small v-if="field.required" class="text-red-500">This field is required</small>
        </div>
        <div v-else-if="field.type === 'boolean'" class="flex flex-col gap-2">
            <div class="flex items-center gap-2">
              <InputSwitch :id="field.name" v-model="item[field.name]" />
              <label :for="field.name">{{ getFieldLabel(field.name) }}</label>
            </div>
            <small v-if="field.required" class="text-red-500">This field is required</small>
        </div>
        <div v-else class="flex flex-col gap-2">
            <label :for="field.name">{{ getFieldLabel(field.name) }}</label>
            <InputText :id="field.name" v-model="item[field.name]" class="w-full" />
            <small v-if="field.required" class="text-red-500">This field is required</small>
        </div>
      </template>
    </div>
    <template #footer>
      <div class="flex justify-end gap-2 px-[30px] pb-[30px]">
        <Button label="Cancel" @click="dialogVisible = false" class="p-button-text" />
        <Button label="Save" @click="saveItem" class="p-button-primary" />
      </div>
    </template>
  </Dialog>
</template>