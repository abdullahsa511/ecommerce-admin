import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import ShowroomService from '../service/ShowroomService';
import { Showroom, ShowroomSection, SectionProduct, SectionImage } from '../models/Showroom.ts';
import FeedbackHandler from '../utils/FeedbackHandler';
import { FileModel } from '@/models/Media.ts';
import { WayPoint } from '@/models/WayPoint';

export const useShowroomStore = defineStore('showroom', () => {

    //State Start Here
    const server = import.meta.env.VITE_API_BASE_URL; 
    const webServer = import.meta.env.VITE_STATIC_BASE_URL;
    const statuses = ref([]);
    /**
     * @type {import('vue').Ref<Showroom[]>}
     */
    const showrooms = ref([]);
    const sections = ref([]);
 
     /**
     * @type {import('vue').Ref<FeedbackHandler>}
     */
    const showroom = ref(new Showroom());
    const section = ref(new ShowroomSection());
    /**
     * @type {import('vue').Ref<SectionProduct[]>}
     */
    const sectionProducts = ref([]);
    /**
     * @type {import('vue').Ref<FileModel[]>}
     */
    const sectionImages = ref([]);
    const fb = ref(new FeedbackHandler());
    const model = 'showroom';
    const showroomStatuses = ref([]);
     //State Finish here

    //Action start here
    const getShowrooms = async () => {
        fb.value.clearError(model);
        fb.value.removeSuccess(model);
        fb.value.startLoading(model);
        try {
            const response = await ShowroomService.getShowrooms();
            showrooms.value = response.map(showroom => new Showroom(showroom)) ?? [];
            fb.value.showSuccess(model);
        } catch (err) {
            console.log(err);
            fb.value.setError(err, model);
        } finally {
            fb.value.finishLoading(model);
        }
    };

    const createShowrooms = async (newShowroom) => {
    fb.value.clearError(model + '.create');
    fb.value.removeSuccess(model + '.create');
    fb.value.startLoading(model + '.create');
    try {
        const createdShowroom = await ShowroomService.createShowrooms(newShowroom);
        // let showroom = new Showroom(createdShowroom);
        // showroom.value = showroom;
        const showroomObj = new Showroom(createdShowroom);
        showroomObj.value = showroomObj;
        fb.value.showSuccess(model + '.create');
        return showroomObj.value;
    } catch (err) {
        // Set error in FeedbackHandler
        fb.value.setError(err, model + '.create');
        // Re-throw the error so caller can catch it
        throw err;
    } finally {
        fb.value.finishLoading(model + '.create');
    }
    };

    const getShowroomById = async (showroomId) => {
        fb.value.clearError(model+'.show');
        fb.value.removeSuccess(model+'.show');
        fb.value.startLoading(model+'.show');
        try {
            const data = await ShowroomService.getShowroomById(showroomId);
            showroom.value = new Showroom(data);
            if(showroom.value.banner_way_points.length <= 0) {
                showroom.value.banner_way_points = [
                    new WayPoint({
                        id: 1,
                        leftPx: 0,
                        topPx: 0,
                        leftPercent: 2,
                        topPercent: 2,
                        linkActive: false,
                        label: "Point 1",
                    }),
                ];
            }
            fb.value.showSuccess(model+'.show');
            return showroom.value;
        } catch (err) {
            console.log(err);
            fb.value.setError(err, model+'.show');
        } finally {
            fb.value.finishLoading(model+'.show');
        }
    };

     const updateShowroom = async (updatedShowroom) => {
        fb.value.clearError(model+'.update');
        fb.value.removeSuccess(model+'.update');
        fb.value.startLoading(model+'.update');
        try {
            const showroom = await ShowroomService.updateShowroom(updatedShowroom);
            // fb.value.showSuccess(model+'.update');
            // return new Showroom(showroom);
            const showroomObj = new Showroom(showroom);
            showroomObj.value = showroomObj;
            fb.value.showSuccess(model + '.update');
            return showroomObj.value;
        } catch (err) {
            fb.value.setError(err, model + '.update');
            throw err;
        } finally {
            fb.value.finishLoading(model+'.update');
        }
    };

    const deleteShowroom = async (showroomId) => {
        
        fb.value.clearError(model + '.delete.'+showroomId);
        fb.value.removeSuccess(model + '.delete.'+showroomId);
        fb.value.startLoading(model + '.delete.'+showroomId);
        try {
            await ShowroomService.deleteShowroom(showroomId);
            showrooms.value = showrooms.value.filter(p => p.showrooms_id !== showroomId);
            fb.value.showSuccess(model + '.delete.'+showroomId);
        } catch (err) {
            fb.value.setError(err, model + '.delete.'+showroomId);
        } finally {
            fb.value.finishLoading(model + '.delete.'+showroomId);
        }
    };
    const deleteShowroomImageByProperty = async (showroomId, property, type = 'showroom') => {
        fb.value.clearError(model+'.delete-showroom-image');
        fb.value.removeSuccess(model+'.delete-showroom-image');
        fb.value.startLoading(model+'.delete-showroom-image');
        try {
            await ShowroomService.deleteShowroomImageByProperty(showroomId, property, type);
            showroom.value[property] = [];
            fb.value.showSuccess(model+'.delete-showroom-image');
        } catch (err) {
            fb.value.setError(err, model+'.delete-showroom-image');
        } finally {
            fb.value.finishLoading(model+'.delete-showroom-image');
        }
    };

    // showroom section 

    const getSections = async (showroomId) => {
        fb.value.clearError(model+'.show.sections');
        fb.value.removeSuccess(model+'.show.sections');
        fb.value.startLoading(model+'.show.sections');
        try {
            const response = await ShowroomService.getSections(showroomId);
            sections.value = response?.map(section => new ShowroomSection(section)) ?? [];
              console.log('jjj', sections.value);
            fb.value.showSuccess(model+'.show.sections');
        } catch (err) {
            console.log(err);
            fb.value.setError(err, model+'.show.sections');
        } finally {
            fb.value.finishLoading(model+'.show.sections');
        }
    };

    const addSection = async (reqData) => {
        fb.value.clearError(model+'.section.add');
        fb.value.removeSuccess(model+'.section.add');
        fb.value.startLoading(model+'.section.add');
        try {
            const createdSection = await ShowroomService.addSection(reqData);
            sections.value.push(createdSection);
            fb.value.showSuccess(model+'section.add');
            return createdSection;
        } catch (err) {
            fb.value.setError(err, model+'.section.add');
            throw err;
        } finally {
            fb.value.finishLoading(model+'.section.add');
        }
    };

    const getSectionDetails = async (showroomSlug,slug) => {
        fb.value.clearError(model+'.section.show');
        fb.value.removeSuccess(model+'.section.show');
        fb.value.startLoading(model+'.section.show');
        try {
            const data = await ShowroomService.getSectionDetails(showroomSlug,slug);
            if(data.error){
                fb.value.setError(data.error, model+'.section.show');
                return section.value;
            }
            fb.value.showSuccess(model+'.section.show');
            section.value = new ShowroomSection(data);
            if(section.value.project_sections_id){
                getSectionImages(section.value.project_sections_id);
            }
            return section.value;
        } catch (err) {
            console.log(err);
            fb.value.setError(err, model+'.section.show');
        } finally {
            fb.value.finishLoading(model+'.section.show');
        }
    };

    const updateSection = async (reqData) => {
        fb.value.clearError(model+'.update');
        fb.value.removeSuccess(model+'.update');
        fb.value.startLoading(model+'.update');
        try {
            const section = await ShowroomService.updateSection(reqData);
            if(section.error){
                fb.value.setError(section.error, model+'.update');
                return section.value;
            }
            fb.value.showSuccess(model+'.update');
            return new ShowroomSection(section);
        } catch (err) {
            fb.value.setError(err, model+'.update');
        } finally {
            fb.value.finishLoading(model+'.update');
        }
    };

    const deleteSection = async (sectionId) => {
        fb.value.clearError(model + '.delete.'+sectionId);
        fb.value.removeSuccess(model + '.delete.'+sectionId);
        fb.value.startLoading(model + '.delete.'+sectionId);
        try {
            await ShowroomService.deleteSection(sectionId);
            sections.value = sections.value.filter(p => p.project_sections_id !== sectionId);
            fb.value.showSuccess(model + '.delete.'+sectionId);
        } catch (err) {
            fb.value.setError(err, model + '.delete.'+sectionId);
        } finally {
            fb.value.finishLoading(model + '.delete.'+sectionId);
        }
    };

    // section image 
    const getSectionImages = async (sectionId) => {
        console.log('section id ', sectionId);
        fb.value.clearError(model+'.section.show');
        fb.value.removeSuccess(model+'.section.show');
        fb.value.startLoading(model+'.section.show');
        try {
            const response = await ShowroomService.getSectionImages(sectionId);
            console.log('section image ', response);

            sectionImages.value = response?.map(item => {
                const ifile = item.image?.[0] ?? {};
                ifile.project_section_images_id = item.project_section_images_id;
                return new FileModel(ifile)
            }) ?? [];

            fb.value.showSuccess(model+'.section.show');
        } catch (err) {
            console.log(err);
            fb.value.setError(err, model+'.section.show');
        } finally {
            fb.value.finishLoading(model+'.section.show');
        }
    };


    const getSectionImagesById = async (sectionId) => {
        fb.value.clearError(model+'.show');
        fb.value.removeSuccess(model+'.show');
        fb.value.startLoading(model+'.show');
        try {
            const data = await ShowroomService.getSectionImagesById(sectionId);
            fb.value.showSuccess(model+'.show');
            showroom.value = new Showroom(data);
            return showroom.value;
        } catch (err) {
            console.log(err);
            fb.value.setError(err, model+'.show');
        } finally {
            fb.value.finishLoading(model+'.show');
        }
    };

    const createSectionImages = async (sectionId) => {
        fb.value.clearError(model+'.create');
        fb.value.removeSuccess(model+'.create');
        fb.value.startLoading(model+'.create');
        try {
            const createdShowroom = await ShowroomService.createSectionImages(sectionId);
            let showroom = new Showroom(createdShowroom);
            showrooms.value.push(showroom);
            fb.value.showSuccess(model+'.create');
            return showroom;
        } catch (err) {
            fb.value.setError(err, model+'.create');
        } finally {
            fb.value.finishLoading(model+'.create');
        }
    };

     const updateSectionImage = async (sectionId) => {
        fb.value.clearError(model+'.update');
        fb.value.removeSuccess(model+'.update');
        fb.value.startLoading(model+'.update');
        try {
            const showroom = await ShowroomService.updateSectionImage(sectionId);
            fb.value.showSuccess(model+'.update');
            return new Showroom(showroom);
        } catch (err) {
            fb.value.setError(err, model+'.update');
        } finally {
            fb.value.finishLoading(model+'.update');
        }
    };

    const deleteSectionImage = async (sectionId, imageId) => {
        fb.value.clearError(model);
        fb.value.removeSuccess(model);
        fb.value.startLoading(model);
        try {
            await ShowroomService.deleteSectionImage(sectionId, imageId);
            sectionImages.value = sectionImages.value.filter(p => p.project_section_images_id !== imageId);
            fb.value.showSuccess(model);
        } catch (err) {
            fb.value.setError(err, model);
        } finally {
            fb.value.finishLoading(model);
        }
    };

    const resetShowroom = () => {
        showroom.value = new Showroom();
    };

    const getSectionProducts = async (sectionId) => {
            fb.value.clearError(model);
            fb.value.removeSuccess(model);
            fb.value.startLoading(model);
            try {
                const response = await ShowroomService.getSectionProducts(sectionId);
                console.log('section product ', response);

                sectionProducts.value = response?.map(item => new SectionProduct(item)) ?? [];
                
                fb.value.showSuccess(model);
            } catch (err) {
                console.log(err);
                fb.value.setError(err, model);
            } finally {
                fb.value.finishLoading(model);
            }
    };

     const getSectionProductsById = async (section_id) => {
        fb.value.clearError(model+'.show');
        fb.value.removeSuccess(model+'.show');
        fb.value.startLoading(model+'.show');
        try {
            const data = await ShowroomService.getSectionProductsById(section_id);
            fb.value.showSuccess(model+'.show');
            showroom.value = new Showroom(data);
            return showroom.value;
        } catch (err) {
            console.log(err);
            fb.value.setError(err, model+'.show');
        } finally {
            fb.value.finishLoading(model+'.show');
        }
    };

    const addSectionProducts = async (reqData) => {
        fb.value.clearError(model+'.create');
        fb.value.removeSuccess(model+'.create');
        fb.value.startLoading(model+'.create');
        try {

            const products = await ShowroomService.addSectionProducts(reqData);
            console.log('data api', reqData);
            sectionProducts.value= products.map(product => new SectionProduct(product));
            fb.value.showSuccess(model+'.create');
            return sectionProducts.value;
        } catch (err) {
            fb.value.setError(err, model+'.create');
            throw err;
        } finally {
            fb.value.finishLoading(model+'.create');
        }
    };

     const updateSectionProduct = async (section_id) => {
        fb.value.clearError(model+'.update');
        fb.value.removeSuccess(model+'.update');
        fb.value.startLoading(model+'.update');
        try {
            const showroom = await ShowroomService.updateSectionProduct(section_id);
            fb.value.showSuccess(model+'.update');
            return new Showroom(showroom);
        } catch (err) {
            fb.value.setError(err, model+'.update');
        } finally {
            fb.value.finishLoading(model+'.update');
        }
    };

    const deleteSectionProduct = async (sectionId, sectionProductId) => {
        fb.value.clearError(model);
        fb.value.removeSuccess(model);
        fb.value.startLoading(model);
        try {
            await ShowroomService.deleteSectionProduct(sectionId, sectionProductId);
            sectionProducts.value = sectionProducts.value.filter(p => p.project_section_products_id !== sectionProductId);
            fb.value.showSuccess(model);
        } catch (err) {
            fb.value.setError(err, model);
        } finally {
            fb.value.finishLoading(model);
        }
    };

    const uploadShowroomImage = async (files, context, id, showroomId) => {
        fb.value.clearError(model);
        fb.value.removeSuccess(model);
        fb.value.startLoading(model);
        try {
            const response = await ShowroomService.uploadShowroomImage(files, context, id, showroomId);
            if(context === 'showroom') {
                showroom.value.image = response.image.map(item => new FileModel(item));
            } 
            else if(context === 'banner_image') {
                showroom.value.banner_image = response.banner_image.map(item => new FileModel(item));
            }
            else if(context === 'overview_image') {
                showroom.value.overview_image = response.overview_image.map(item => new FileModel(item));
            }
            else if(context === 'section') {
                section.value.image = response.image.map(item => new FileModel(item));
            } else if(context === 'section-gallery') {
                sectionImages.value = response?.map(item => {
                    const ifile = item.image?.[0] ?? {};
                    ifile.project_section_images_id = item.project_section_images_id;
                    return new FileModel(ifile)
                }) ?? [];
            }
            fb.value.showSuccess(model);
        } catch (err) {
            fb.value.setError(err, model);
        } finally {
            fb.value.finishLoading(model);
        }
    };

     

    const getStatuses = async () => {
        fb.value.clearError(model+'.statuses');
        fb.value.removeSuccess(model+'.statuses');
        fb.value.startLoading(model+'.statuses');
        try {
            const response = await ShowroomService.getStatuses();
            statuses.value = response;
            fb.value.showSuccess(model+'.statuses');
            return response;
        } catch (err) {
            fb.value.setError(err, model+'.statuses');
        } finally {
            fb.value.finishLoading(model+'.statuses');
        }
    };
    //Action Finish here


    //Getters start here
    const showroomNames = computed(() => {
        return showrooms.value.map(showroom => showroom.name);
    });
    //Getters End here

    const updateShowroomWayPoints = async (showroomId, wayPoints) => {
        fb.value.clearError(model+'.wayPoints.'+showroomId);
        fb.value.removeSuccess(model+'.wayPoints.'+showroomId);
        fb.value.startLoading(model+'.wayPoints.'+showroomId);
        try {
            const property = 'showroom';
            const response = await ShowroomService.updateShowroomWayPoints(showroomId, property, wayPoints);
            let updatedWayPoints = [];
            if (Array.isArray(response)) {
                updatedWayPoints = response;
            } else if (response && Array.isArray(response.way_points)) {
                updatedWayPoints = response.way_points;
            } else {
                updatedWayPoints = wayPoints;
            }

            showroom.value.banner_way_points = updatedWayPoints;
            fb.value.showSuccess(model+'.way-points.'+showroomId);
            return response;
        } catch (err) {
            fb.value.setError(err, model+'.wayPoints.'+showroomId);
            throw err;
        } finally {
            fb.value.finishLoading(model+'.wayPoints.'+showroomId);
        }
    };

    // Get way point suggestions
    const getWayPointSuggestions = async (query) => {
        fb.value.clearError(model+'.way-points-suggestions.'+query);
        fb.value.removeSuccess(model+'.way-points-suggestions.'+query);
        fb.value.startLoading(model+'.way-points-suggestions.'+query);
        try {
            const response = await ShowroomService.getWayPointSuggestions(query);

            return response;
        } catch (err) {
            fb.value.setError(err, model+'.way-points-suggestions.'+query);
            throw err;
        } finally {
            fb.value.finishLoading(model+'.way-points-suggestions.'+query);
        }
    };

    return { 
        //State
        statuses,
        showrooms, 
        showroom,
        sections,
        section,
        sectionProducts,
        sectionImages,
        fb, 
        model, 
        showroomNames, 
        showroomStatuses,
        // actions ====================================
        resetShowroom,
        getShowrooms,
        createShowrooms,
        getShowroomById,
        updateShowroom,
        deleteShowroom,
        uploadShowroomImage,
        deleteShowroomImageByProperty,
        getSections,
        addSection,
        getSectionDetails,
        updateSection,
        deleteSection,
        getSectionImages,
        getSectionImagesById,
        createSectionImages,
        updateSectionImage,
        deleteSectionImage,
        getSectionProducts,
        getSectionProductsById,
        addSectionProducts,
        updateSectionProduct,
        deleteSectionProduct,
        getStatuses,
        updateShowroomWayPoints,
        getWayPointSuggestions
    };
}); 
