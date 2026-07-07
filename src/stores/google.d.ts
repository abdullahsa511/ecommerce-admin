import Component from '@/models/Component';
import { FileToUpload } from '@/models/File';
import { FeedbackHandler } from '@/utils/FeedbackHandler';
import { Ref } from 'vue';
import { defineStore } from 'pinia';
import Site from '@/models/Site';

export interface GoogleState {
  fb: FeedbackHandler;
  model: string;
}

export const useGoogleStore = defineStore('google', {
  state: (): GoogleState => ({
    fb: new FeedbackHandler(),
    model: 'google'
  }),
  actions: {
    async searchAddresses(query: string): Promise<Address[]>
  }
}); 