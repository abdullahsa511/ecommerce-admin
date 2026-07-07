<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import InputText from 'primevue/inputtext';
import { storeToRefs } from 'pinia';
import { usePostTagStore } from '@/stores/postTag';
import { useMediaStore } from '@/stores/media';
import { SidebarMedia } from '@/models/Product';
import { useToast } from 'primevue';

// Props passed from parent


const emit = defineEmits(['update:postTag', 'saved', 'editTabUnmunted', 'editTabMounted']);

// Local refs
// const selectedGroup = ref<number | null>(null);
const toast = useToast();
const route = useRoute();
const mediaStore = useMediaStore();
const mediaFb = mediaStore.fb;
const postTagStore = usePostTagStore();

const { postTag, fb } = storeToRefs(postTagStore);


const imageMediaExpanded = ref(true);
const toggleImageMedia = () => {
    imageMediaExpanded.value = !imageMediaExpanded.value;
};

const uploadSidebarMediaImage = async (event: any, property: SidebarMedia) => {
    
    try {
        const response: any = await postTagStore.uploadFiles(event.files, property, postTag.value.post_tag_id ?? '');
        console.log(response);
    } catch (error) {
        console.error('Error uploading site logo:', error);
    }
}

const deleteSidebarMediaImage = async (file: any, property: SidebarMedia) => {
//   try {
//     await postTagStore.deletePostTagImageByProperty(postTag.value.post_tag_id, property);
//     // post.value.image = new FileModel({});
//     postTag.value[property] = [];
//     toast.add({
//         severity: 'success',
//         summary: 'Success',
//         detail: 'Image deleted successfully',
//         life: 3000
//     });
//   } catch (error) {
//     console.error('Error deleting site logo:', error);
//   }
};

const onFieldChange = () => {
    postTag.value.slug = postTag?.value?.name?.toLowerCase().replace(/ /g, '-');
  emit('update:postTag', postTag.value);
};


const statusOptions = [
    { label: 'Enabled', code: 1 },
    { label: 'Disabled', code: 0 },
];



onMounted(async () => {
    // console.log('sssssssssssss',postTagStore);
    
    emit('editTabMounted');
    if (route.params.id) {
        await postTagStore.getPostTagById(route.params.id as string);
    }
    // if (postTagGroup.value.postTag_group_id) {
    //   selectedGroup.value = postTagGroup.value.postTag_group_id;
    // }

});



onUnmounted(() => {
    emit('editTabUnmunted');
});
</script>

<template>
    <div class="flex flex-col gap-6 card mt-6">
        <div class="flex gap-6">
            <!-- Left column: PostTag Form -->
            <div class="w-3/5 space-y-4">
                <h3 class="text-lg font-medium border-b border-gray-200 pb-2">Edit PostTag</h3>

                <div class="grid grid-cols-12 gap-x-6 gap-y-4">
                    <!-- Post Tag Name -->
                    <label class="col-span-12 md:col-span-2 flex items-center text-lg">
                        Name
                    </label>
                    <div class="col-span-12 md:col-span-10 py-2">
                        <InputText v-model="postTag.name" class="w-full text-lg border border-gray-200 rounded-md p-2"
                            placeholder="Enter tag name" @input="onFieldChange" />
                    </div>
                    <!-- Slug -->
                    <label class="col-span-12 md:col-span-2 flex items-center text-lg">Slug</label>
                    <div class="col-span-12 md:col-span-10 py-2">
                        <InputText v-model="postTag.slug" class="w-full text-lg border border-gray-200 rounded-md p-2"
                            placeholder="Enter slug" />
                    </div>
                    <!-- description  -->
                    <label class="col-span-12 md:col-span-2 flex items-center text-lg">Description</label>
                    <div class="col-span-12 md:col-span-10 py-2">
                        <Textarea v-model="postTag.description"
                            class="w-full text-lg border border-gray-200 rounded-md p-2"
                            placeholder="Enter description" />
                    </div>


                    <label for="status" class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0">Status</label>
                    <div class="col-span-12 md:col-span-10">
                        <Dropdown v-model="postTag.status" :options="statusOptions" optionLabel="label"
                            optionValue="code" placeholder="Select Status" class="w-full text-lg" />
                    </div>

                </div>
            </div>

            <!-- Right column: Preview Sidebar -->
            <div class="w-2/5" v-if="postTag.post_tag_id">
                <div class="border border-gray-200 rounded-md p-4">
                    <h4 class="text-lg font-medium mb-2">Post Tags Preview</h4>
                    <p><strong>Name:</strong> {{ postTag.name }}</p>
                    <p><strong>Slug:</strong> {{ postTag.slug }}</p>
                </div>
                <div v-if="fb.errors['postTag.update']" class="mt-4">
                    <h3 class="text-lg font-medium border-b border-gray-200 pb-2">
                        Errors
                    </h3>
                    <div v-html="fb.renderErrors('postTag.update')"></div>
                </div>


                 <!-- image Media Section -->
                <div class="bg-white rounded-lg shadow-sm">
                    <button 
                        @click="toggleImageMedia"
                        class="w-full px-6 py-4 text-left text-lg flex justify-between items-center text-primary"
                    >
                        Image
                        <i :class="['pi', imageMediaExpanded ? 'pi-chevron-up' : 'pi-chevron-down']"></i>
                    </button>

                    <div v-if="imageMediaExpanded" class="p-6 border-t">
                        <!-- Image Preview -->
                        <UploadFileFeature 
                            v-model:uploadedFilesData="postTag.image"
                            :fb="mediaFb"
                            :property="'image'"
                            @upload="uploadSidebarMediaImage($event, 'image')"
                            @removeUploadedFile="deleteSidebarMediaImage($event, 'image')"
                        />

                        <Divider />
                    </div>
                </div>


            </div>
        </div>
    </div>
</template>

<style scoped>
/* Optional custom styles */
</style>
