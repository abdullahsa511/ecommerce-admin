<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useShowroomContactStore } from '@/stores/showroomContact'
import { useMediaStore } from '@/stores/media'

const emit = defineEmits([
    'update:showroomContact',
    'saved',
    'editTabUnmunted',
    'editTabMounted'
])

const route = useRoute()
const showroomContactStore = useShowroomContactStore()
const { showroomContact, fb, showrooms, slotData } = storeToRefs(showroomContactStore)

const imageMediaExpanded = ref(true)
const mediaStore = useMediaStore ? useMediaStore() : null
const mediaFb = mediaStore ? mediaStore.fb : null

/* ---------------- IMAGE UPLOAD ---------------- */

const uploadShowroomContactImages = async (event: any) => {
    try {
        let files = event.files
        files = files.map((file: any) => {
            const existing = showroomContact.value.image.find(
                (img: any) => img.name === file.file?.name
            )
            if (existing) file.id = existing.id
            return file
        })
        await showroomContactStore.uploadShowroomContactImages(
            files,
            'image',
            showroomContact.value.showroom_contact_id
        )
    } catch (error) {
        console.error('Upload error:', error)
    }
}

const deleteShowroomContactImages = async (file: any) => {
    try {
        await showroomContactStore.deleteShowroomContactImages(
            file,
            showroomContact.value.showroom_contact_id
        )
        showroomContact.value.image = []
    } catch (error) {
        console.error('Delete error:', error)
    }
}

/* ---------------- SLOT SYSTEM ---------------- */

interface Slot {
    id: string
    value: string
    label: string
    locked: boolean
    note: string
}

// Define all possible slots
const morningSlots: Slot[] = [
    { id: "time-slot-1", value: "09:00:00", label: "9:00 AM", locked: false, note: "" },
    { id: "time-slot-2", value: "09:10:00", label: "9:10 AM", locked: false, note: "" },
    { id: "time-slot-3", value: "09:20:00", label: "9:20 AM", locked: false, note: "" },
    { id: "time-slot-4", value: "09:30:00", label: "9:30 AM", locked: false, note: "" },
    { id: "time-slot-5", value: "09:40:00", label: "9:40 AM", locked: false, note: "" },
    { id: "time-slot-6", value: "09:50:00", label: "9:50 AM", locked: false, note: "" },
    { id: "time-slot-7", value: "10:00:00", label: "10:00 AM", locked: false, note: "" },
    { id: "time-slot-8", value: "10:10:00", label: "10:10 AM", locked: false, note: "" },
    { id: "time-slot-9", value: "10:20:00", label: "10:20 AM", locked: false, note: "" },
    { id: "time-slot-10", value: "10:30:00", label: "10:30 AM", locked: false, note: "" },
]

const eveningSlots: Slot[] = [
    { id: "time-slot-11", value: "17:00:00", label: "5:00 PM", locked: false, note: "" },
    { id: "time-slot-12", value: "17:10:00", label: "5:10 PM", locked: false, note: "" },
    { id: "time-slot-13", value: "17:20:00", label: "5:20 PM", locked: false, note: "" },
    { id: "time-slot-14", value: "17:30:00", label: "5:30 PM", locked: false, note: "" },
    { id: "time-slot-15", value: "17:40:00", label: "5:40 PM", locked: false, note: "" },
    { id: "time-slot-16", value: "17:50:00", label: "5:50 PM", locked: false, note: "" },
    { id: "time-slot-17", value: "18:00:00", label: "6:00 PM", locked: false, note: "" },
    { id: "time-slot-18", value: "18:10:00", label: "6:10 PM", locked: false, note: "" },
    { id: "time-slot-19", value: "18:20:00", label: "6:20 PM", locked: false, note: "" },
]

const allSlots = [...morningSlots, ...eveningSlots]
const slots = ref<Slot[]>([])

const statuses = [
    { label: 'Active', value: 1 },
    { label: 'Inactive', value: 0 },
]

// Map backend slotData to reactive slots array
const mapSlots = () => {
    slots.value = allSlots.map(s => {
        const matched = slotData.value.find(d => d.slot_time === s.value)
        return {
            ...s,
            locked: matched ? !!matched.status : false,
            note: matched ? matched.note : ''
        }
    })
}

// Toggle lock/unlock and update backend
const toggleLock = async (slot: Slot) => {
    const updatedSlot = slots.value.find(s => s.value === slot.value)
    if (!updatedSlot) return

    updatedSlot.locked = !updatedSlot.locked

    // call server API
    await showroomContactStore.updateSlotStatus(showroomContact.value.showroom_contact_id, {
        value: updatedSlot.value,
        note: updatedSlot.note,
        locked: updatedSlot.locked
    })

    // update local slotData to keep backend & UI in sync
    const backendIndex = slotData.value.findIndex(d => d.slot_time === updatedSlot.value)
    if (backendIndex >= 0) {
        slotData.value[backendIndex].status = updatedSlot.locked ? 1 : 0
        slotData.value[backendIndex].note = updatedSlot.note
    } else {
        slotData.value.push({
            contact_time_slot_id: null,
            showroom_contact_id: showroomContact.value.showroom_contact_id,
            slot_time: updatedSlot.value,
            note: updatedSlot.note,
            status: updatedSlot.locked ? 1 : 0,
            created_at: null,
            updated_at: null
        })
    }
}

/* ---------------- LIFECYCLE ---------------- */
onMounted(async () => {
    emit('editTabMounted')
    if (route.params.id) {
        await showroomContactStore.getShowroomContactById(route.params.id as string)
        await showroomContactStore.getShowrooms()
        await showroomContactStore.fetchSlots(route.params.id as string)
        mapSlots()
    }
})

onUnmounted(() => {
    emit('editTabUnmunted')
})
</script>

<template>
    <div class="flex flex-col gap-6">

        <!-- Loading -->
        <div class="loading-overlay border-2" v-if="fb.loading['showroomContact.show.' + route.params.id]">
            <div class="flex justify-center items-center h-full spinner">
                <i class="pi pi-spin pi-spinner" style="font-size:2rem"></i>
                <p class="mt-2">Loading showroom contact details...</p>
            </div>
        </div>

        <div class="flex flex-col md:flex-row gap-6">

            <!-- LEFT FORM -->
            <div class="sm:w-full md:w-3/5 space-y-4">
                <h3 class="text-lg font-medium border-b pb-2">Edit Showroom Contact</h3>
                <div class="grid grid-cols-12 gap-x-6 gap-y-4">

                    <label class="col-span-3 flex items-center text-lg">Name</label>
                    <div class="col-span-9 py-2">
                        <InputText v-model="showroomContact.name" class="w-full border rounded p-2" />
                    </div>

                    <label class="col-span-3 flex items-center text-lg">Showroom</label>
                    <div class="col-span-9 py-2">
                        <Select v-model="showroomContact.showroom_id" :options="showrooms" optionLabel="title"
                            optionValue="showrooms_id" class="w-full" />
                    </div>

                    <label class="col-span-3 flex items-center text-lg">Email</label>
                    <div class="col-span-9 py-2">
                        <InputText v-model="showroomContact.email" class="w-full border rounded p-2" />
                    </div>

                    <label class="col-span-3 flex items-center text-lg">Phone</label>
                    <div class="col-span-9 py-2">
                        <InputText v-model="showroomContact.phone" class="w-full border rounded p-2" />
                    </div>

                    <label class="col-span-3 flex items-center text-lg">Designation</label>
                    <div class="col-span-9 py-2">
                        <InputText v-model="showroomContact.designation" class="w-full border rounded p-2" />
                    </div>
                    <!-- sort order -->
                    <label class="col-span-3 flex items-center text-lg">Sort Order</label>
                    <div class="col-span-9 py-2">
                        <InputText v-model="showroomContact.sort_order as any" type="number" class="w-full border rounded p-2" placeholder="Enter sort order" />
                    </div>
                    <!-- status -->
                    <label class="col-span-3 flex items-center text-lg">Status</label>
                    <div class="col-span-9 py-2">
                        <Select v-model="showroomContact.status" :options="statuses" optionLabel="label" optionValue="value" class="w-full" />
                    </div>
                </div>
            </div>

            <!-- RIGHT IMAGE -->
            <div class="sm:w-full md:w-2/5">
                <div class="bg-white rounded shadow">
                    <button @click="imageMediaExpanded = !imageMediaExpanded"
                        class="w-full px-6 py-4 flex justify-between text-lg">
                        Showroom Contact Thumbnail
                        <i :class="['pi', imageMediaExpanded ? 'pi-chevron-up' : 'pi-chevron-down']" />
                    </button>
                    <div v-if="imageMediaExpanded" class="p-6 border-t">
                        <UploadFileFeature v-model:uploadedFilesData="showroomContact.image" :fb="mediaFb"
                            :property="'image'" @upload="uploadShowroomContactImages"
                            @removeUploadedFile="deleteShowroomContactImages" />
                    </div>
                </div>
            </div>

        </div>

        <!-- SLOT MANAGER -->
        <!-- <div class="mt-8">
            <h3 class="text-lg font-medium border-b pb-2">Booking Slot Manager</h3>
            <table class="w-full border mt-4">
                <thead>
                    <tr class="bg-gray-100">
                        <th class="border p-2">Time</th>
                        <th class="border p-2">Status</th>
                        <th class="border p-2">Note</th>
                        <th class="border p-2">Action</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="slot in slots" :key="slot.id">
                        <td class="border p-2 text-center">{{ slot.label }}</td>
                        <td class="border p-2 text-center">
                            <span :class="slot.locked ? 'text-red-600' : 'text-green-600'">
                                {{ slot.locked ? 'Locked' : 'Available' }}
                            </span>
                        </td>
                        <td class="border p-2">
                            <input v-model="slot.note" class="border p-1 rounded w-full" placeholder="Add note" />
                        </td>
                        <td class="border p-2 text-center space-x-2">
                            <button @click="toggleLock(slot)" class="px-2 py-1 bg-blue-600 text-white rounded">
                                {{ slot.locked ? 'Unlock' : 'Lock' }}
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div> -->

    </div>
</template>

<style scoped>
table th,
table td {
    text-align: center;
}
</style>