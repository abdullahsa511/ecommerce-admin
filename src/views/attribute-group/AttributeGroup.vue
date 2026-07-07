<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router';
// Remove curly braces for default import
import { storeToRefs } from 'pinia';
import Button from 'primevue/button';
import { useToast } from 'primevue/usetoast';
import { useAttributeGroupStore } from '@/stores/attributeGroup';

//System variables such as props, useStore or stateToRef etc
const props = defineProps({ id: { type: String, required: false, default: null } })
const router = useRouter();
const attributeGroupStore = useAttributeGroupStore();
const { attributeGroup, fb } = storeToRefs(attributeGroupStore);
const toast = useToast();

//Declear emits
const emit = defineEmits({})

//Define local variables here
const items = ref([
    { route: `/configuration/settings/attribute-groups/list`, label: 'Attribute Groups', icon: 'pi pi-home' },
    { route: `/configuration/settings/attribute-groups/add`, label: 'Add', icon: 'pi pi-link' },
    { route: `/configuration/settings/attribute-groups/import`, label: 'Import', icon: 'pi pi-link' },
]);
const currentRoute = computed(() => {
    return router.currentRoute.value.path;
});

// Show Save button only on add or edit routes. Change label when editing.
const showSaveButton = computed(() => {
    const path = currentRoute.value || '';
    return path.includes('/add') || path.includes('/edit');
});
// Change Save button label based on route
const saveLabel = computed(() => {
    return currentRoute.value && currentRoute.value.includes('/edit') ? 'Save and Update' : 'Save';
})

// Fetch attribute if route is edit
const handleSave = async () => {
    try {
        let response: any;
        if (attributeGroup.value.attribute_group_id) {
            // Update existing attribute
            response = await attributeGroupStore.updateAttributeGroup(attributeGroup.value);
        } else {
            // Create new attribute
            response = await attributeGroupStore.createAttributeGroup(attributeGroup.value);
        }

        if (response?.attribute_group_id) {
            router.push('/configuration/settings/attribute-groups/edit/' + response.attribute_group_id);
            toast.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Attribute saved successfully',
                life: 3000
            });

            // Reset the form a new attribute
        } else {
            toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to save attribute: ' + (response?.message || ''), life: 5000 });
        }
    } catch (error) {
        console.error('Error saving attribute:', error);
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'An error occurred while saving the attribute.',
            life: 5000
        });
    }
};

const refreshTabs = () => {
    if (props.id) {
        const existRoute = items.value.find(item => item.route === `/configuration/settings/attribute-groups/edit/${props.id}`);
        if (!existRoute) {
            items.value.push({ route: `/configuration/settings/attribute-groups/edit/${props.id}`, label: 'Edit', icon: 'pi pi-list' });
        }
    } else {
        items.value = items.value.filter(item => !item.route.includes('/edit'));
    }
    attributeGroupStore.resetAttributeGroup();
}
refreshTabs();

//Lifecycle hook started from here
onMounted(() => {
    refreshTabs();
})
</script>

<template>
    <div class="attriutes card relative">
        <div class="sticky top-0 z-50 bg-white p-2">
            <Button 
            v-if="showSaveButton" 
            :label="fb.loading['attributeGroup.create'] ? 'Saving...' : (fb.loading['attributeGroup.update.'+attributeGroup.attribute_group_id] ? 'Updating...' : saveLabel)"
            :icon="(fb.loading['attributeGroup.create'] || fb.loading['attributeGroup.update.'+attributeGroup.attribute_group_id]) ? 'pi pi-spinner pi-spin' : 'pi pi-save'" 
            class="p-button-md"
            @click="handleSave" 
            :disabled="fb.loading['attributeGroup.update.'+attributeGroup.attribute_group_id] || fb.loading['attributeGroup.create']"/>
        </div>
        <Tabs :value="currentRoute" scrollable>
            <TabList>
                <template v-for="tab in items" :key="tab.label">
                    <router-link v-if="tab.route" v-slot="{ href, navigate }" :to="tab.route" custom>
                        <Tab :active="currentRoute === tab.route" :key="tab.label" :value="tab.route" @click="navigate">
                            <a v-ripple :href="href" @click="navigate" class="flex items-center gap-2 text-inherit">
                                <i :class="tab.icon" />
                                <span>{{ tab.label }}</span>
                            </a>
                        </Tab>
                    </router-link>
                </template>
            </TabList>
            <div class="py-6">
                <router-view @editTabUnmunted="refreshTabs" @saved="handleSave" @editTabMounted="refreshTabs" />
            </div>
        </Tabs>
    </div>
</template>

<style scoped></style>