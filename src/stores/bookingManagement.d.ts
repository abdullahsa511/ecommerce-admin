import BookingManagement from "@/models/BookingManagement";
import FeedbackHandler from "@/utils/FeedbackHandler";
import { defineStore } from "pinia";


export interface BookingManagementState {
    bookingManagements: BookingManagement[];
    contactPersons: any[];
    showrooms: any[];
    bookingManagement: BookingManagement;
    model: string;
    fb: FeedbackHandler;
} 

export const useBookingManagementStore = defineStore('bookingManagement', {
    state: (): BookingManagementState => ({
        bookingManagements: [],
        contactPersons: [],
        showrooms: [],
        bookingManagement: new BookingManagement(),
        model: 'bookingManagement',
        fb: new FeedbackHandler(),
    }),
    actions: {
        async fetchContactPersons() { },
        async fetchBookingManagements(userId: number, showroomId: number) { },
        async getBookingManagementById(bookingManagementId: number | string) { },
        async createBookingManagement(newBookingManagement: Partial<BookingManagement>): Promise<BookingManagement | any> {},
        async updateBookingManagement(bookingManagementId: number | string, updatedBookingManagement: Partial<BookingManagement>): Promise<BookingManagement | any > { },
        async deleteBookingManagement(bookingManagementId: number | string) { },
        async sendAbsentEmail(visitShowroomId: number | string): Promise<any> { },
        async cancelBooking(visitShowroomId: number | string): Promise<any> { },
    }
})