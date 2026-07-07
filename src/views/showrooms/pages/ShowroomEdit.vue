<script setup lang="ts">
import { ref, computed, onMounted, defineProps, defineEmits, onUnmounted } from "vue";
import { useRoute, useRouter } from 'vue-router';
import { Showroom } from '@/models/Showroom';
import { useShowroomStore } from '@/stores/showroom';
import { storeToRefs } from 'pinia';
import { useToast } from 'primevue/usetoast';
import { FileModel } from "@/models/Media";

const emit = defineEmits(['update:attribute', 'saved', 'editTabUnmunted', 'editTabMounted']);
const router = useRouter();
const showroomStore = useShowroomStore();
const { fb, showroom } = storeToRefs(showroomStore);
const toast = useToast();
const route =  useRoute();

const props = defineProps({
    id: {
        type: String,
        required: true
    }
});
const items = ref([
    { route: `/showrooms/edit/${props.id}/general`, label: 'General', icon: 'pi pi-home', props: { id: props.id } },
    { route: `/showrooms/edit/${props.id}/sections`, label: 'Sections', icon: 'pi pi-link', props: { id: props.id } }
]);

const currentRoute = computed(() => {
    return router.currentRoute.value.path;
});

onMounted(async () => {
    emit('editTabMounted');
    try {
        await showroomStore.getShowroomById(props.id);
    } catch (error) {
        console.error('Error in onMounted:', error);
    }
})

onUnmounted(() => {
    emit('editTabUnmunted');
})

const onShowroomSaved = async () => {
    try {
        if (showroom.value) {
            await showroomStore.updateShowroom(showroom.value);
            toast.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Showroom updated successfully',
                life: 3000
            });
        }
    } catch (error: any) {
        // validation errors
        let errorMsg = 'Failed to save showroom';
        if (error.response?.data) {
            const data = error.response.data;
            if (data.errors) {
                // If multiple field errors
                errorMsg = Object.values(data.errors).flat().join(', ');
            } else if (data.message) {
                errorMsg = data.message;
            }
        } else if (error.message) {
            errorMsg = error.message;
        }

        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: errorMsg || 'Validation error! Failed to updated showroom',
            life: 5000
        });
    }
};

const onShowroomUpdated = (data: Showroom) => {
    // Instead of reassigning the entire showroom, update its properties
    if (showroom.value && data) {
        Object.assign(showroom.value, data);
    }
}

const addImages = (files: any) => {
    showroom.value.images = showroom.value.images.map((file: any) => {
        let f = files.find((img: any) => img.file?.name === file.name);
        if (f) return new FileModel(f);
        return file;
    });
}

</script>
<template>
    <div class=" relative">
        <div class="card-header">
            <h1>{{ showroom.title }}</h1>
        </div>
        <Button :icon="fb.loading['showroom.update'] ? 'pi pi-spin pi-spinner' : 'pi pi-save'"
            :label="currentRoute.includes('/showrooms/') && currentRoute.includes('/general') ? 'Update' : 'Save'"
            severity="primary" :loading="fb.loading['showroom.update']" :disabled="fb.loading['showroom.update']"
            @click="onShowroomSaved" class="p-button-md" />
        <Tabs :value="currentRoute" scrollable>
            <TabList>
                <template v-for="tab in items" :key="tab.label" :id="props.id">
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
                <router-view :id="props.id" @update:showroom="onShowroomUpdated" @add:images="addImages" />
            </div>
        </Tabs>
    </div>
</template>

<style scoped>
.card-header {
    font-size: 18px;
    font-weight: 500;
    padding-bottom: 20px;
}

.p-button-md {
    position: absolute;
    top: 20px;
    right: 20px;
    z-index: 1000;
}

.p-button-md-bottom {
    position: absolute;
    bottom: 20px;
    right: 20px;
    z-index: 1000;
}
</style>
