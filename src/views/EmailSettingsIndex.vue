<script setup lang="ts">
    import { ref, computed, onMounted } from 'vue'
    import { useRouter } from 'vue-router';
    // Remove curly braces for default import
    import { storeToRefs } from 'pinia';
    import Button from 'primevue/button';
    import { useToast } from 'primevue/usetoast';
    import { useSiteStore } from '@/stores/site';
    // @ts-ignore
    import EmailSettingsAdd from '@/views/EmailSettingsAdd.vue';
    import { MailEngine } from '@/models/Site';
  
    const router = useRouter();
    const siteStore = useSiteStore();
    const { fb, emailSetting } = storeToRefs(siteStore);
    const toast = useToast();
     
    //Define local variables here
    const items = ref([
      { route: `/configuration/settings/email-settings`, label: 'Email Settings', icon: 'pi pi-home' },
    ]);

    const currentRoute = computed(() => {
      return router.currentRoute.value.path;
    });
    
    const updateMailEngine = (mailEngine: MailEngine) => {
      // console.log('updateMailEngine', mailEngine);
      emailSetting.value.mail_engine = mailEngine;
      // console.log('emailSetting', emailSetting.value);
    };
    
    // Fetch taxonomy if route is edit
    const handleSave = async () => {
      // console.log('handleSave', emailSetting.value);
      try {
        let response: any;
        response = await siteStore.createEmailSetting(emailSetting.value);
        if(response?.key) {
          toast.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Email settings saved successfully',
            life: 3000
          });
        }
      } catch (error) {
        toast.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error saving email settings: ' + (error as any)?.message || 'Unknown error',
          life: 5000
        });
      }
    }; 

    // mount fetch email settings
    onMounted(async () => {
      await siteStore.fetchEmailSettings();
    });
    </script>
    
    <template>
      <div class="email-settings card relative">
        <Button 
        :label="fb.loading['email-settings.create'] ? 'Saving...' : 'Save Settings'" 
        :icon="fb.loading['email-settings.create'] ? 'pi pi-spinner pi-spin' : 'pi pi-save'" 
        class="p-button-md" 
        @click="handleSave" 
        :loading="fb.loading['email-settings.create']" />

        <Tabs :value="currentRoute" scrollable>
          <TabList>
            <template v-for="tab in items" :key="tab.label">
              <router-link v-if="tab.route" v-slot="{ href, navigate }" :to="tab.route" custom>
                <Tab :active="currentRoute === tab.route" :key="tab.label" :value="tab.route" @click="navigate">
                  <a v-ripple :href="href" @click="navigate" class="flex items-center gap-2 text-inherit">
                    <i :class="tab.icon" />
                    <span>{{ tab.label }}</span>
                  </a>
                </Tab>
              </router-link>
            </template>
          </TabList>
          <div class="py-6">
            <EmailSettingsAdd :emailSetting="emailSetting" @saved="handleSave" @add:emailEngine="updateMailEngine" :fb="fb" />
            <!-- <router-view @editTabUnmunted="refreshTabs" @saved="handleSave" @editTabMounted="refreshTabs" /> -->
          </div>
        </Tabs>
      </div>
    </template>