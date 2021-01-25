<template>
  <framework name="application" vuetify>

    <!-- APP BAR -->
    <v-app-bar app clipped-left>
      <v-app-bar-nav-icon v-if="$vuetify.breakpoint.smAndDown" @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>Hello</v-toolbar-title>
    </v-app-bar>

    <!-- APP DRAWER -->
    <v-navigation-drawer app v-model="drawer" clipped :permanent="!$vuetify.breakpoint.smAndDown" :width="$vuetify.breakpoint.smAndDown ? '256' : 'auto'">
      
      <v-list nav dense>

        <v-list-group v-for="(group, index) in groups" :key="index" v-model="group.active" :disabled="group.disabled" prepend-icon="mdi-translate">

          <template v-slot:activator>
              <v-list-item-title>{{ group.title }}</v-list-item-title>
          </template>

          <v-list-item v-for="(item, index) in group.items" :key="index" link nuxt class="pl-16 mb-1">

            <v-list-item-title v-text="item.title"></v-list-item-title>
          
          </v-list-item>

        </v-list-group>

        <v-list-item class="justify-center">
          <v-switch v-model="$vuetify.theme.dark" inset label="Theme" hide-details></v-switch>
        </v-list-item>

      </v-list>
    </v-navigation-drawer>

    <!-- MY CONTENT -->
    <Nuxt />

  </framework>
</template>

<!-- JAVASCRIPT -->
<script>
import Framework from '~/components/basics/framework.vue';
export default {
  components: { Framework },

  data: () =>({
    drawer: false,
    groups: [
      {
        title: 'Chinese (Simplified)',
        items: [
          {
            title: 'Random',
          },
        ],
      },
    ],
  }),
}
</script>

<!-- SCSS -->
<style lang="scss">

html {
  overflow: hidden !important;
}

</style>
