import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import Message from '../models/Message';
import MessageService from '../service/MessageService';
import FeedbackHandler from '../utils/FeedbackHandler';
import MessageFilter from '../filters/MessageFilter';
export const useMessageStore = defineStore('message', () => {
    /**
     * @type {Ref<Message[]>}
     */
    const messages = ref([]);
    const filter = ref(new MessageFilter());

    const selectedStatus = ref('All');

    /**
     * @type {import('vue').Ref<FeedbackHandler>}
     */
    const fb = ref(new FeedbackHandler());
    const model = 'message';

    // const filteredMessages = computed(() => {
    //     return messages.value.filter(message => filter.value.matches(message));
    // });

    const filteredMessages = computed(() => {
        if (selectedStatus.value === 'All') {
            return messages.value;
        }
        return messages.value.filter(message => message.status === selectedStatus.value);
        // return messages.value.filter(message => filter.value.matches(message));
    });


    async function fetchMessages() {
        fb.value.clearError(model);
        fb.value.removeSuccess(model);
        fb.value.startLoading(model);
        try {
            messages.value = await MessageService.getMessages();
            fb.value.showSuccess(model);
        } catch (err) {
            console.error(err);
            fb.value.setError(err, model);
        } finally {
            fb.value.finishLoading(model);
        }
    };

    const setStatus = (status) => {
        selectedStatus.value = status;
    }


    const fetchMessageById = async (messageId) => {
        fb.value.clearError(model);
        fb.value.removeSuccess(model);
        fb.value.startLoading(model);
        try {
            const message = await MessageService.getMessageById(messageId);
            return message;
        } catch (err) {
            fb.value.setError(err, model);
        } finally {
            fb.value.finishLoading(model);
        }
    }

    const createMessage = async (newMessage) => {
        fb.value.clearError(model);
        fb.value.removeSuccess(model);
        fb.value.startLoading(model);
        
        try {
            const createdMessage = await MessageService.createMessage(newMessage);
            messages.value.push(createdMessage);
            fb.value.showSuccess(model);
        } catch (err) {
            fb.value.setError(err, model);
        } finally {
            fb.value.finishLoading(model);
        }
    };

    const updateMessage = async (MessageId, updatedMessage) => {
        fb.value.clearError(model);
        fb.value.removeSuccess(model);
        fb.value.startLoading(model);
        try {
            const message = await MessageService.updateMessage(MessageId, updatedMessage);
            const index = messages.value.findIndex(t => t.Message_id === MessageId);
            if (index !== -1) {
                messages.value[index] = message;
            }
            fb.value.showSuccess('Message updated successfully');
        } catch (err) {
            fb.value.setError(err);
        } finally {
            fb.value.finishLoading();
        }
    };

    const deleteMessage = async (MessageId) => {
        fb.value.clearError(model);
        fb.value.removeSuccess(model);
        fb.value.startLoading(model);
        try {
            await MessageService.deleteMessage(MessageId);
            messages.value = messages.value.filter(t => t.Message_id !== MessageId);
            fb.value.showSuccess(model);
        } catch (err) {
            fb.value.setError(err, model);
        } finally {
            fb.value.finishLoading(model);
        }
    };
    

    function setFilter(newFilter) {
        filter.value = newFilter;
    }



    return {
        messages,
        selectedStatus,
        setStatus,
        filter,
        fb,
        filteredMessages,
        fetchMessages,
        fetchMessageById,
        setFilter,
        createMessage,
        updateMessage,
        deleteMessage
    };
}); 