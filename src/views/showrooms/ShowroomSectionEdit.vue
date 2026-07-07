<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRouter } from 'vue-router';
import { useShowroomStore } from '@/stores/showroom';
import { storeToRefs } from 'pinia';
import { useToast } from 'primevue/usetoast';
import { FileModel } from "@/models/Media";

const router = useRouter();
const showroomStore = useShowroomStore();
const { fb, section } = storeToRefs(showroomStore);
const toast = useToast();

const props = defineProps({
    showroomSlug: {
        type: String,
        required: true
    },
    id: {
        type: String,
        required: true
    }
});

const items = ref([
    { route: `/showroom/${props.showroomSlug}/section/${props.id}/general`, label: 'General', icon: 'pi pi-home' },
    { route: `/showroom/${props.showroomSlug}/section/${props.id}/products`, label: 'Products', icon: 'pi pi-link' },
    { route: `/showroom/${props.showroomSlug}/section/${props.id}/images`, label: 'Images', icon: 'pi pi-link' }
]);

const currentRoute = computed(() => router.currentRoute.value.path);
const isSaving = ref(false);



onMounted(async () => {
    try {
        await showroomStore.getSectionDetails(props.showroomSlug,props.id);
    } catch (error) {
        console.error('Error in onMounted:', error);
    }
})


const addImages = (files: any) => {
    if (!section.value) return;
    section.value.images = section.value.images.map((file: any) => {
        const f = files.find((img: any) => img.file?.name === file.name);
        return f ? new FileModel(f) : file;
    });
}

// Save button handler
const onClickUpdate = async () => {

    // If no child data yet, create a default object with showroom_slug
    try {
        isSaving.value = true;
        await showroomStore.updateSection(section.value);
        router.push(`/showrooms/edit/${section.value.showroom_id}/sections`);
        // Update local section store
        if(fb.value.success?.['showroom.update']){
            toast.add({ severity: 'success', summary: 'Success', detail: 'Section updated!' });
        } else if(fb.value.errors?.['showroom.update']){
            toast.add({ severity: 'error', summary: 'Error', detail: fb.value.errors?.['showroom.update'] });
        }
    } catch (error) {
        console.error('Failed to update section:', error);
        toast.add({ severity: 'error', summary: 'Error', detail: 'Update failed!' });
    } finally {
        isSaving.value = false;
    }
};


</script>

<template>
<div class="card relative">
    <Button 
        :icon="fb.loading['showroom.add'] ? 'pi pi-spin pi-spinner' : 'pi pi-save'" 
        label="Update"
        severity="danger" 
        :loading="fb.loading['showroom.add']" 
        :disabled="fb.loading['showroom.add']"
        class="p-button-md"
        @click="onClickUpdate" 
    />
    
    
    <Tabs :value="currentRoute" scrollable>
        <TabList>
            <template v-for="tab in items" :key="tab.label">
                <router-link v-if="tab.route" v-slot="{ href, navigate }" :to="tab.route" custom>
                    <Tab :active="currentRoute === tab.route" :value="tab.route" @click="navigate">
                        <a v-ripple :href="href" class="flex items-center gap-2 text-inherit">
                            <i :class="tab.icon" />
                            <span>{{ tab.label }}</span>
                        </a>
                    </Tab>
                </router-link>
            </template>
        </TabList>
        <div class="py-6">
            <!-- Listen to child emit -->
            <router-view 
                :id="props.id" 
                v-model:section="section"
                @add:images="addImages" 
            />
        </div>
    </Tabs>
</div>
</template>
<style scoped>
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
