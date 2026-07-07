import Timezone from '@/models/Timezone';
import FeedbackHandler from '@/utils/FeedbackHandler';
import { defineStore } from 'pinia';

export interface TimezoneState {
  timezones: Timezone[];
  timezone: Timezone;
  fb: FeedbackHandler;
  model: string;
  newTimezone: Timezone;
}

export const useTimezoneStore = defineStore('timezone', {
  state: (): TimezoneState => ({
    timezones: [],
    timezone: new Timezone(),
    fb: new FeedbackHandler(),
    model: 'timezone',
    newTimezone: new Timezone(),
  }),
  actions: {
    resetNewTimezone() {},
    async fetchTimezones() {},
    async fetchTimezoneById(timezoneId: number | string) {},
    async createTimezone(newTimezone: Timezone): Promise<Timezone | any> { },
    async updateTimezone(updatedTimezone: Timezone) { },
    async deleteTimezone(timezoneId: number | string) { }
  }
}); 