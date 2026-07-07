<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useServiceRequestStore } from '@/stores/serviceRequest';
import { storeToRefs } from 'pinia';
import Button from 'primevue/button';
import { useToast } from 'primevue/usetoast';

const props = defineProps({ id: { type: String, required: false, default: null } });
const router = useRouter();
const serviceRequestStore = useServiceRequestStore();
const { serviceRequest, fb } = storeToRefs(serviceRequestStore);
const toast = useToast();

const items = ref([{ route: '/service-requests/list', label: 'Service Requests', icon: 'pi pi-home' }]);

const currentRoute = computed(() => router.currentRoute.value.path);
const showSaveButton = computed(() => currentRoute.value.includes('/edit'));
const saveLabel = computed(() => 'Save and Update');

const resolveId = () => serviceRequest.value.service_request_id || serviceRequest.value.id;

const handleSave = async () => {
    try {
        const response = await serviceRequestStore.updateServiceRequest(serviceRequest.value);
        const savedId = response?.service_request_id || response?.id;
        if (savedId) {
            router.push('/service-requests/list');
            toast.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Service request saved successfully',
                life: 3000
            });
        }
    } catch (error) {
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'An error occurred while saving the service request.',
            life: 5000
        });
    }
};

const refreshTabs = () => {
    if (props.id) {
        const editRoute = `/service-requests/edit/${props.id}`;
        const existRoute = items.value.find((item) => item.route === editRoute);
        if (!existRoute) {
            items.value.push({ route: editRoute, label: 'Edit', icon: 'pi pi-list' });
        }
    } else {
        items.value = items.value.filter((item) => !item.route.includes('/edit'));
    }
    serviceRequestStore.resetServiceRequest();
};

const renderIcon = (icon: string) => {
    const id = resolveId();
    return fb.value.loading[`serviceRequest.update.${id}`] ? 'pi pi-spinner pi-spin' : icon;
};

onMounted(() => {
    refreshTabs();
});
</script>

<template>
    <div class="service-requests card relative">
        <Button
            v-if="showSaveButton"
            :label="saveLabel"
            :icon="renderIcon('pi pi-save')"
            class="p-button-md"
            @click="handleSave"
            :disabled="fb.loading['serviceRequest.update.' + (serviceRequest.service_request_id || serviceRequest.id)]"
        />
        <Tabs :value="currentRoute" scrollable>
            <TabList>
                <template v-for="tab in items" :key="tab.label">
                    <router-link v-if="tab.route" v-slot="{ href, navigate }" :to="tab.route" custom>
                        <Tab :active="currentRoute === tab.route" :value="tab.route" @click="navigate">
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
