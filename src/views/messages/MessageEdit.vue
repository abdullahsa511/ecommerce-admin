<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useMessageStore } from '@/stores/message';
import { useToast } from 'primevue/usetoast';
import Editor from 'primevue/editor';

const router = useRouter();
const route = useRoute();
const toast = useToast();
const messageStore = useMessageStore();
const loading = ref(false);
const messageId = route.params.id;

const formData = ref({
    author: '',
    email: '',
    url: '',
    content: '',
    status: 0,
    post_id: 1
});

const loadMessage = async () => {
    try {
        loading.value = true;
        const message = await messageStore.fetchMessageById(messageId);
        formData.value = {
            author: message.author,
            email: message.email,
            url: message.url,
            content: message.content,
            status: message.status,
            post_id: message.post_id
        };
    } catch (error) {
        console.error('Error loading message:', error);
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to load message. Please try again later.',
            life: 3000
        });
        router.push('/messages');
    } finally {
        loading.value = false;
    }
};

onMounted(() => {
    loadMessage();
});

const saveMessage = async () => {
    try {
        loading.value = true;
        await messageStore.updateMessage(messageId, formData.value);
        toast.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Message updated successfully',
            life: 3000
        });
        router.push('/messages');
    } catch (error) {
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to update message. Please try again later.',
            life: 3000
        });
    } finally {
        loading.value = false;
    }
};

const goToMessageList = () => {
    router.push('/messages');
};

const statusOptions = [
    { label: 'Pending', value: 0 },
    { label: 'Approved', value: 1 },
    { label: 'Spam', value: 2 },
    { label: 'Trash', value: 3 }
];
</script>

<template>
    <div class="flex justify-end gap-2 mb-6">
        <Button 
            icon="pi pi-arrow-left"
            label="Message List"
            severity="secondary"
            @click="goToMessageList"
            class="p-button-md"
        />
        <Button 
            icon="pi pi-save"
            label="Save"
            severity="primary"
            @click="saveMessage"
            :loading="loading"
            class="p-button-md"
        />
    </div>
    <Fluid class="flex flex-col md:flex-row gap-8 mb-20">
        <div class="w-full">
            
            <div class="flex flex-col gap-6">
                <div class="grid grid-cols-12 gap-2">
                    <label for="author" class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0 text-lg">Author</label>
                    <div class="col-span-12 md:col-span-10">
                        <InputText v-model="formData.author" class="text-lg" id="author" type="text" placeholder="Author" />
                    </div>
                </div>
                <div class="grid grid-cols-12 gap-2">
                    <label for="email" class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0 text-lg">Email</label>
                    <div class="col-span-12 md:col-span-10">
                        <InputText v-model="formData.email" class="text-lg" id="email" type="email" placeholder="Email" />
                    </div>
                </div>

                <div class="grid grid-cols-12 gap-2">
                    <label for="url" class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0 text-lg">Url</label>
                    <div class="col-span-12 md:col-span-10">
                        <InputText v-model="formData.url" class="text-lg" id="url" type="text" placeholder="Url" />
                    </div>
                </div>

                <div class="grid grid-cols-12 gap-2">
                    <label for="content" class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0 text-lg">Content</label>
                    <div class="col-span-12 md:col-span-10">
                        <Textarea 
                            v-model="formData.content"
                            class="text-xl" 
                            placeholder="Description" 
                            :autoResize="true" 
                            rows="3" cols="30" 
                        />
                    </div>
                </div>

                <div class="grid grid-cols-12 gap-2">
                    <label for="status" class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0">Status</label>
                    <div class="col-span-12 md:col-span-10">
                        <Dropdown 
                            v-model="formData.status"
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
:deep(.p-editor-container) {
    border: 1px solid #e2e8f0;
    border-radius: 0.5rem;
}

:deep(.p-editor-content) {
    min-height: 320px;
}

:deep(.p-inputtext),
:deep(.p-dropdown) {
    width: 100%;
    font-size: 1.125rem;
}

:deep(.p-button) {
    border-radius: 0.5rem;
}

:deep(input::placeholder) {
    color: #767779 !important;
    opacity: 1;
    font-size: 1.2rem;
}
</style> 