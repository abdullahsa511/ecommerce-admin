<script setup>
import { ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import Comment from '@/models/Comment';
import { useCommentStore } from '@/stores/comment';
/**
 * @type {import('vue').Ref<Comment>}
 */
const newComment = ref(new Comment());
const router = useRouter();
const commentStore = useCommentStore();
const { fb } = storeToRefs(commentStore);


const statusOptions = [
    { label: 'Pending', value: 0 },
    { label: 'Approved', value: 1 },
    { label: 'Spam', value: 2 },
    { label: 'Trash', value: 3 }
];

const goToCommentList = () => {
    router.push('/posts/comments');
};

const saveComment = () => {
    // unset(newComment.value, 'parent_id');
    // console.log(newComment.value);
    commentStore.createComment(newComment.value);
    goToCommentList();
};

</script>

<template>
    <div class="flex justify-end gap-2 mb-6">
        <Button 
            icon="pi pi-arrow-left"
            label="Comment List"
            severity="secondary"
            :disabled="fb.loading.comment"
            @click="goToCommentList"
            class="p-button-md"
        />
        <Button 
            icon="pi pi-save"
            label="Save"
            severity="primary"
            :loading="fb.loading.comment"
            :disabled="fb.loading.comment"
            @click="saveComment"
            class="p-button-md"
        />
    </div>
    <Fluid class="flex flex-col md:flex-row gap-8 mb-20">
        <div class="w-full">
            
            <div class="flex flex-col gap-6">
                <div class="grid grid-cols-12 gap-2">
                    <label for="author" class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0 text-lg">Author</label>
                    <div class="col-span-12 md:col-span-10">
                        <InputText class="text-lg" id="author" type="text" placeholder="Author" v-model="newComment.author" />
                    </div>
                </div>
                <div class="grid grid-cols-12 gap-2">
                    <label for="email" class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0 text-lg">Email</label>
                    <div class="col-span-12 md:col-span-10">
                        <InputText class="text-lg" id="email" type="email" placeholder="Email" v-model="newComment.email" />
                    </div>
                </div>

                <div class="grid grid-cols-12 gap-2">
                    <label for="url" class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0 text-lg">Url</label>
                    <div class="col-span-12 md:col-span-10">
                        <InputText class="text-lg" id="url" type="text" placeholder="Url" v-model="newComment.url" />
                    </div>
                </div>

                <div class="grid grid-cols-12 gap-2">
                    <label for="content" class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0 text-lg">Content</label>
                    <div class="col-span-12 md:col-span-10">
                        <Textarea class="text-xl" placeholder="Description" :autoResize="true" rows="3" cols="30" v-model="newComment.content" />
                    </div>
                </div>

                <div class="grid grid-cols-12 gap-2">
                    <label for="status" class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0">Status</label>
                    <div class="col-span-12 md:col-span-10">
                        <Dropdown 
                            v-model="newComment.status"
                            :options="statusOptions"
                            optionLabel="label"
                            optionValue="value"
                            class="text-lg w-full"
                            placeholder="Select status"
                        />
                    </div>
                </div>
            </div>
        </div>
        
    </Fluid>
</template>

<style scoped>
label {
    font-size: 1.2rem;
}
:deep(input::placeholder),
:deep(textarea::placeholder) {
    color: #767779 !important;
    opacity: 1;
    font-size: 1.2rem;
}
</style>
