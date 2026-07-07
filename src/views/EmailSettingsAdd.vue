<script setup>
import { ref, watch } from 'vue';
import { EmailSetting } from '@/models/Site';
import FeedbackHandler from '@/utils/FeedbackHandler';

const mailEngineOptions = ref([
    { name: 'Mail', code: 'mail' },
    { name: 'SMTP', code: 'smtp' },
    { name: 'Sendmail', code: 'sendmail' }
]);

const props = defineProps({
    emailSetting: {
        type: EmailSetting,
        required: true
    },
    fb: {
        type: FeedbackHandler,
        required: false,
        default: new FeedbackHandler()
    }
});

const emit = defineEmits(['saved', 'add:emailEngine']);

const sendTestEmail = () => {
    if (!props.emailSetting.test_email) {
        // TODO: Show validation error
        return;
    }
    // TODO: Implement test email sending logic
    console.log('Sending test email to:', props.emailSetting.test_email);
};

const handleMailEngineChange = (event) => {
    emit('add:emailEngine', event?.value ?? event);
};
</script>

<template>
    <Fluid class="flex flex-col md:flex-row ">
        <div class="loading-overlay" v-if="fb.loading['email.fetch']">
            <div class="flex justify-center items-center h-full spinner">
                <i class="pi pi-spin pi-spinner" style="font-size: 2rem;"></i>
                <p class="mt-2">Loading email settings. Please wait.</p>
            </div>
        </div>
        <div class="w-full">
            <div class="flex flex-col gap-6">
                <h3 class="text-xl font-semibold mb-4 border-b pb-2">Email Settings</h3>
                <!-- Mail Engine -->
                <div class="grid grid-cols-12 gap-2">
                    <label for="mail_engine" class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0 text-lg">Mail Engine</label>
                    <div class="col-span-12 md:col-span-10">
                        <Select 
                            class="text-lg w-full" 
                            v-model="props.emailSetting.mail_engine" 
                            :options="mailEngineOptions" 
                            optionLabel="name"
                            optionValue="code"
                            placeholder="Select Mail Engine"
                            :loading="fb.loading['email.fetch']"
                            @change="handleMailEngineChange"
                        />
                    </div>
                </div>

                <!-- Mail Parameters -->
                <div class="grid grid-cols-12 gap-2">
                    <label for="mail_parameters" class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0 text-lg">Mail Parameters</label>
                    <div class="col-span-12 md:col-span-10">
                        <Textarea 
                            class="text-lg w-full" 
                            v-model="props.emailSetting.mail_parameters" 
                            rows="3" 
                            placeholder="Additional Parameters"
                            :class="{ 'p-invalid': fb.errors['email.create']?.mail_parameters }"
                        />
                        <Message v-if="fb.errors['email.create']?.mail_parameters" severity="error" size="small" variant="title">
                            <span v-for="error in fb.errors['email.create']?.mail_parameters" :key="error" class="flex flex-col">
                                {{ error }}
                            </span>
                        </Message>
                        <small class="text-gray-500">e.g. -f email@mysite.com</small>
                    </div>
                </div>

                <!-- Send test email section -->
                <div class="border-t pt-6 mt-4">
                    <h2 class="text-xl font-semibold mb-4">Send test email</h2>
                    
                    <div class="grid grid-cols-12 gap-2 items-center">
                        <label for="test_email" class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0 text-lg">Send to email address</label>
                        <div class="col-span-12 md:col-span-8">
                            <InputText 
                                class="text-lg w-full" 
                                type="email" 
                                v-model="props.emailSetting.test_email" 
                                placeholder="myemailaddress@domain.com"
                                :class="{ 'p-invalid': fb.errors['email.create']?.test_email }"
                            />
                            <Message v-if="fb.errors['email.create']?.test_email" severity="error" size="small" variant="title">
                                <span v-for="error in fb.errors['email.create']?.test_email" :key="error" class="flex flex-col">
                                    {{ error }}
                                </span>
                            </Message>
                        </div>
                        <div class="col-span-12 md:col-span-2">
                            <Button 
                                label="Send email" 
                                icon="pi pi-send"
                                severity="success"
                                @click="sendTestEmail"
                                class="text-lg w-full"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </Fluid>
</template>