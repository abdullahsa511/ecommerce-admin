import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import BookingManagement from '@/models/BookingManagement';
import BookingManagementFilter from '@/filters/BookingManagementFilter';
import FeedbackHandler from '@/utils/FeedbackHandler';
import BookingManagementService from '@/service/BookingManagementService';

export const useBookingManagementStore = defineStore('bookingManagement', () => {
  const bookingManagements = ref([]);
  const contactPersons = ref([]);
  const showrooms = ref([]);
  const bookingManagement = ref(new BookingManagement());
  const filter = ref(new BookingManagementFilter());
  const fb = ref(new FeedbackHandler());
  const model = 'bookingManagement';

  const resetform = () => {
    bookingManagement.value = new BookingManagement();
  };

  const fetchContactPersons = async () => {
    fb.value.clearError(model + '.contact-persons');
    fb.value.removeSuccess(model + '.contact-persons');
    fb.value.startLoading(model + '.contact-persons');
    try {
      const response = await BookingManagementService.fetchContactPersons();
      // console.log('response:', response.locations[0]);
      contactPersons.value = response.sales_teams.map((member) => ({
        showroom_contact_id: member.showroom_contact_id,
        name: member.name
      }));
      showrooms.value = response.locations.map((showroom) => ({
        showroom_id: showroom.showroom_id,
        name: showroom.showroom_title,
        location: showroom.showroom_address
      }));
      fb.value.showSuccess(model + '.contact-persons');
      return contactPersons.value;
    } catch (err) {
      fb.value.setError(err, model + '.contact-persons');
    } finally {
      fb.value.finishLoading(model + '.contact-persons');
    }
  };

  const fetchBookingManagements = async (userId, showroomId) => {
    fb.value.clearError(model + '.list');
    fb.value.removeSuccess(model + '.list');
    fb.value.startLoading(model + '.list');
    try {
      const response = await BookingManagementService.fetchBookingManagements(userId, showroomId);
      const groupedData = response?.data ?? {};

      // console.log('items vvv:', groupedData);

      bookingManagements.value = Object.entries(groupedData).map(([date, items]) => {
        // console.log('items 555ss:', items);
        return new BookingManagement({
          title: date,
          data: Array.isArray(items) ? items : []
        });
      });

      console.log('bookingManagements:', bookingManagements.value);
      console.log('first item raw:', bookingManagements.value[0]?.data[0]);
      fb.value.showSuccess(model + '.list');
      return bookingManagements.value;
    } catch (err) {
      fb.value.setError(err, model + '.list');
    } finally {
      fb.value.finishLoading(model + '.list');
    }
  };
  const getBookingManagementById = async (id) => {
    fb.value.clearError(model + '.booking-management.' + id);
    fb.value.removeSuccess(model + '.booking-management.' + id);
    fb.value.startLoading(model + '.booking-management.' + id);
    try {
      const response = await BookingManagementService.getBookingManagementById(id);
      bookingManagement.value = new BookingManagement(response);
      fb.value.showSuccess(model + '.booking-management.' + id);
      return bookingManagement.value;
    } catch (err) {
      console.error('Failed to fetch booking management:', err);
      fb.value.setError(err, model + '.booking-management.' + id);
    } finally {
      fb.value.finishLoading(model + '.booking-management.' + id);
    }
  };

  const updateBookingManagement = async (id, updatedBookingManagement) => {
    fb.value.clearError(model + '.booking-management.' + id);
    fb.value.removeSuccess(model + '.booking-management.' + id);
    fb.value.startLoading(model + '.booking-management.' + id);
    try {
      const response = await BookingManagementService.updateBookingManagement(
        id,
        updatedBookingManagement
      );
      if (response.success) {
        const groupedData = response?.data ?? {};
        bookingManagements.value = Object.entries(groupedData).map(([date, items]) => {
          return new BookingManagement({
            title: date,
            data: Array.isArray(items) ? items : []
          });
        });
      }
      fb.value.showSuccess(model + '.booking-management.' + id);
      return response;
    } catch (err) {
      console.error('Failed to update booking management:', err);
      fb.value.setError(err, model + '.booking-management.' + id);
    } finally {
      fb.value.finishLoading(model + '.booking-management.' + id);
    }
  };

  const createBookingManagement = async (newBookingManagement) => {
    fb.value.clearError(model + '.create');
    fb.value.removeSuccess(model + '.create');
    fb.value.startLoading(model + '.create');
    try {
      const response = await BookingManagementService.createBookingManagement(newBookingManagement);
      if (response.success) {
        const groupedData = response?.data ?? {};
        bookingManagements.value = Object.entries(groupedData).map(([date, items]) => {
          return new BookingManagement({
            title: date,
            data: Array.isArray(items) ? items : []
          });
        });
      }
      fb.value.showSuccess(model + '.create');
      return response;
    } catch (err) {
      console.error('Failed to create booking management:', err);
      fb.value.setError(err, model + '.create');
    } finally {
      fb.value.finishLoading(model + '.create');
    }
  };

  const deleteBookingManagement = async (id) => {
    fb.value.clearError(model + '.delete.' + id);
    fb.value.removeSuccess(model + '.delete.' + id);
    fb.value.startLoading(model + '.delete.' + id);
    try {
      await BookingManagementService.deleteBookingManagement(id);
      bookingManagements.value = bookingManagements.value.filter(
        (b) => b.booking_management_id !== id
      );
      fb.value.showSuccess(model + '.delete.' + id);
    } catch (err) {
      console.error('Failed to delete booking management:', err);
      fb.value.setError(err, model + '.delete.' + id);
    } finally {
      fb.value.finishLoading(model + '.delete.' + id);
    }
  };

  function clearFilter() {
    filter.value = new BookingManagementFilter();
  }

  const sendAbsentEmail = async (visitShowroomId) => {
    fb.value.clearError(model + '.send-absent-email.' + visitShowroomId);
    fb.value.removeSuccess(model + '.send-absent-email.' + visitShowroomId);
    fb.value.startLoading(model + '.send-absent-email.' + visitShowroomId);
    try {
      const response = await BookingManagementService.sendAbsentEmail(visitShowroomId);
      fb.value.showSuccess(model + '.send-absent-email.' + visitShowroomId);
      return response;
    } catch (err) {
      console.error('Failed to send absent email:', err);
      fb.value.setError(err, model + '.send-absent-email.' + visitShowroomId);
    } finally {
      fb.value.finishLoading(model + '.send-absent-email.' + visitShowroomId);
    }
  };

  const cancelBooking = async (visitShowroomId) => {
    fb.value.clearError(model + '.cancel-booking.' + visitShowroomId);
    fb.value.removeSuccess(model + '.cancel-booking.' + visitShowroomId);
    fb.value.startLoading(model + '.cancel-booking.' + visitShowroomId);
    try {
      const response = await BookingManagementService.cancelBooking(visitShowroomId);
      bookingManagements.value = bookingManagements.value
      .map((group) => ({
        ...group,
        data: group.data.filter(
          (item) => item.visit_showroom_id !== visitShowroomId
        )
      }))
      .filter((group) => group.data.length > 0);
      fb.value.showSuccess(model + '.cancel-booking.' + visitShowroomId);
      return response;
    } catch (err) {
      fb.value.setError(err, model + '.cancel-booking.' + visitShowroomId);
    } finally {
      fb.value.finishLoading(model + '.cancel-booking.' + visitShowroomId);
    }
  };

  return {
    bookingManagements,
    fetchContactPersons,
    contactPersons,
    showrooms,
    bookingManagement,
    filter,
    fb,
    model,
    resetform,
    fetchBookingManagements,
    getBookingManagementById,
    createBookingManagement,
    updateBookingManagement,
    deleteBookingManagement,
    clearFilter,
    sendAbsentEmail,
    cancelBooking
  };
});
