<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRouter } from 'vue-router';
import { usePinboardStore } from '@/stores/pinboard';
import { usePinboardItemStore } from '@/stores/pinboardItem.js';
import { storeToRefs } from 'pinia';
import { useToast } from 'primevue/usetoast';

const router = useRouter();
const pinboardStore = usePinboardStore();
const pinboardItemStore = usePinboardItemStore();
const { fb, pinboard } = storeToRefs(pinboardStore);
const toast = useToast();

const props = defineProps({
    id: {
        type: String,
        required: true
    }
});
const items = ref([
    { route: `/pinboards/${props.id}/overview`, label: 'Overview', icon: 'pi pi-home' },
    { route: `/pinboards/${props.id}/items`, label: 'Items', icon: 'pi pi-link' }
]);

const currentRoute = computed(() => {
    return router.currentRoute.value.path;
});

const LEAD_ALLOWED_STATUSES = ['Draft', 'In Discussion', 'Project Submitted'];

const pinboardStatusName = computed(() =>
    pinboard.value?.pinboard_status?.name ||
    pinboard.value?.pinboardDetails?.pinboard_status_name ||
    'Draft'
);

const canCreateLead = computed(() =>
    LEAD_ALLOWED_STATUSES.includes(pinboardStatusName.value)
);

const isSaving = ref(false);
const removedItems = ref<any[]>([]);
const savedJobTitle = ref('');

const onJobTitleBlur = async () => {
    const jobTitle = pinboard.value?.pinboardDetails?.jobTitle ?? '';
    if (!pinboard.value?.pinboard_id || jobTitle === savedJobTitle.value) return;

    const result = await pinboardStore.updatePinboard({
        pinboard_id: pinboard.value.pinboard_id,
        pinboardDetails: { jobTitle },
        pinboard_name: jobTitle
    });

    if (result) {
        savedJobTitle.value = jobTitle;
    } else {
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to update job title',
            life: 3000,
        });
    }
};

const onPinboardItemSaved = async () => {
    try {
        console.log('PinboardEdit save - pinboard.value:', pinboard.value);
        console.log('PinboardEdit save - items.length:', pinboard.value?.items?.length);
        console.log('PinboardEdit save - pinboardItems.length:', pinboard.value?.pinboardItems?.length);
        
        if (pinboard.value?.pinboard_id) {
            if(pinboard.value.items.length > 0) {
                // Separate new items (without coupon_product_id) from existing items
                const newItems = pinboard.value.items.filter(item => !item.pinboard_item_id);
                const existingItems = pinboard.value.items.filter(item => item.pinboard_item_id);
                
                // Create new coupon products if any
                if (newItems.length > 0) {
                    await pinboardItemStore.createPinboardItem(newItems);
                }
                
                // Update existing coupon products if any
                for (const item of existingItems) {
                    await pinboardItemStore.updatePinboardItem(item);
                }
                
                // Delete removed items if any
                for (const item of removedItems.value) {
                    if (item.pinboard_item_id) {
                        await pinboardItemStore.deletePinboardItem(item.pinboard_item_id);
                    }
                }
                
                toast.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Pinboard Item(s) saved successfully',
                    life: 3000
                });
            }
            else {
                // Delete all existing items if no items remain
                if (removedItems.value.length > 0) {
                    await pinboardItemStore.deletePinboardItemsByPinboardId(pinboard.value.pinboard_id);
                }
                
                await pinboardStore.updatePinboard(pinboard.value);
                toast.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Pinboard updated successfully',
                    life: 3000
                });
            }
        }
    } catch (error: any) {
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: error.message || 'Failed to save Pinboard',
            life: 3000
        });
    } finally {
        isSaving.value = false;
        removedItems.value = []; // Clear removed items after saving
    }
}

const onCreateLead = async () => {
    if (!canCreateLead.value) return;

    const response = await pinboardStore.createLead(pinboard?.value?.pinboard_id);
    console.log('Send Lead Request ERP:', response);

    if (response) {
        toast.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Lead created successfully',
            life: 3000
        });
    }
}

onMounted(async () => {
    await pinboardStore.fetchPinboardById(props.id);
    savedJobTitle.value = pinboard.value?.pinboardDetails?.jobTitle ?? '';
})

</script>
<template>
    <div class="card relative">
        <div class="pinboard-edit-actions">
            <div class="flex  items-center gap-2">
                <label class="block text-gray-700 text-lg">Job Title</label>
                <input
                    class="border border-gray-200 rounded-md p-2"
                    type="text"
                    v-model="pinboard.pinboardDetails.jobTitle"
                    :disabled="fb.loading['pinboard.update'] || fb.loading['pinboard.show'] || fb.loading['pinboard.create.lead'] || !canCreateLead"
                    @blur="onJobTitleBlur"
                />
            </div>
            <Button
                :icon="fb.loading['pinboard.create.lead'] ? 'pi pi-spin pi-spinner' : 'pi pi-user-plus'"
                label="Create Lead"
                severity="success"
                :disabled="fb.loading['pinboard.create.lead'] || !canCreateLead || fb.loading['pinboard.update'] || fb.loading['pinboard.show']"
                @click="onCreateLead"
            />
            <Button
                :icon="fb.loading['product.update'] ? 'pi pi-spin pi-spinner' : 'pi pi-save'"
                label="Save"
                severity="primary"
                :loading="fb.loading['product.update']"
                :disabled="fb.loading['product.update']"
                @click="onPinboardItemSaved"
            />
           
        </div>
        <Tabs :value="currentRoute" scrollable>
            <TabList >
                <template v-for="tab in items" :key="tab.label">
                    <router-link v-if="tab.route" v-slot="{ href, navigate }" :to="tab.route" custom>
                        <Tab :active="currentRoute === tab.route" :key="tab.label" :value="tab.route" @click="navigate">
                            <a v-ripple :href="href" class="flex items-center gap-2 text-inherit">
                                <i :class="tab.icon" />
                                <span>{{ tab.label }}</span>
                            </a>
                        </Tab>
                    </router-link>
                </template>
            </TabList>
            <div class="py-6">
                <router-view :pinboard="pinboard"  v-model.pinboard="pinboard"  @saved="onPinboardItemSaved"/>
            </div>
        </Tabs>
    </div>
</template>

<style scoped>
.pinboard-edit-actions {
    top: 20px;
    right: 20px;
    z-index: 1000;
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    justify-content: flex-end;
    align-items: center;
}
.pinboard-edit-actions input {
    width: 300px;
}
@media (max-width: 768px) {
    .pinboard-edit-actions {
        flex-direction: column;
        align-items: flex-start;
    }

}
.p-button-md-bottom {
    position: absolute;
    bottom: 20px;
    right: 20px;
    z-index: 1000;
}
</style> 