import { ProjectStatus } from '@/models/Project';
import { Showroom, ShowroomSection, SectionProduct, SectionImage, ShowroomStatus } from '@/models/Showroom.ts';
import FeedbackHandler from '@/utils/FeedbackHandler';
import { defineStore } from 'pinia';

export interface ShowroomState {
  showrooms: Showroom[];
  showroom: Showroom;
  sections: ShowroomSection[];
  section: ShowroomSection;
  sectionProducts: SectionProduct[];
  sectionProduct: SectionProduct;
  sectionImages: SectionImage[];
  sectionImage: SectionImage;
  statuses: ShowroomStatus[];
  fb: FeedbackHandler;
  model: string;
  showroomStatuses: ShowroomStatus[];
}

export const useShowroomStore = defineStore('showroom', {
  state: (): ShowroomState => ({
    showrooms: [],
    showroom: new Showroom(),
    sections: [],
    section: new ShowroomSection(),
    sectionProducts: [],
    sectionProduct: new SectionProduct(),
    sectionImages: [],
    sectionImage: new SectionImage(),
    fb: new FeedbackHandler(),
    model: 'showroom',
    showroomStatuses: [],
    statuses: []
  }),
  actions: {
    resetShowroom() {},
    async getShowrooms() { },
    async createShowrooms(newShowroom: Showroom): Promise<Showroom | any> { },
    async getShowroomById(showroomId: number | string) { },
    async updateShowroom(updatedShowroom: Showroom) { },
    async deleteShowroom(showroomId: number | string) { },
    async deleteShowroomImageByProperty(showroomId: number | string, property: string, type: string) { },
    async uploadShowroomImage(files: FileToUpload[], context: string, id: number | string, showroomId: number | string) { },
    async getSections(showroom_id: number | string) { },
    async addSection(section: Object): Promise<ShowroomSection | null> { },
    async getSectionDetails(showroomSlug: string, slug: string) { },
    async updateSection(any: any) { },
    async deleteSection(section_id: number | string) { },
    async getSectionImages(section_id: number | string) { },
    async getSectionImagesById(section_id: number | string) { },
    async createSectionImages(section_id: number | string) { },
    async updateSectionImage(section_id: number | string) { },
    async deleteSectionImage(section_id: number | string, project_section_images_id: number | null) { },
    async getSectionProducts(section_id: number | string) { },
    async getSectionProductsById(section_id: number | string) { },
    async addSectionProducts(requestData: Object) { },
    async updateSectionProduct(section_id: number | string) { },
    async deleteSectionProduct(section_id: number | string, sectionProductId: number | null) { },
    async deleteSectionImage(section_id: number | string) { },
    async getStatuses(): Promise<ShowroomStatus[]> { },

    async updateShowroomWayPoints(showroomId: number | string, wayPoints: any) : Object {},
    async getWayPointSuggestions(query: string): Promise<any[]> {}
  }
}); 