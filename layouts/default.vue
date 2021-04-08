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

          <v-list-item v-for="(item, index) in group.items" :key="index" :to="item.to" nuxt class="pl-16 mb-1">

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
            title: 'All',
            to: '/'
          },
          {
            title: 'Numbers',
            to: '/chinese-simplified/numbers'
          },
          {
            title: 'Destinations',
            to: '/chinese-simplified/destinations'
          },
          {
            title: 'Professions',
            to: '/chinese-simplified/professions'
          },
          {
            title: 'Week 1',
            to: '/chinese-simplified/week-1'
          },
          {
            title: 'Week 2',
            to: '/chinese-simplified/week-2'
          },
          {
            title: 'Week 3',
            to: '/chinese-simplified/week-3'
          },
          {
            title: 'Week 4',
            to: '/chinese-simplified/week-4'
          },
          {
            title: 'Week 5',
            to: '/chinese-simplified/week-5'
          },
          {
            title: 'Week 6',
            to: '/chinese-simplified/week-6'
          },
          {
            title: 'Week 7',
            to: '/chinese-simplified/week-7'
          },
          {
            title: 'Week 8',
            to: '/chinese-simplified/week-8'
          },
          {
            title: 'Week 9',
            to: '/chinese-simplified/week-9'
          },
          {
            title: 'Week 10',
            to: '/chinese-simplified/week-10'
          },
          {
            title: 'Week 11',
            to: '/chinese-simplified/week-11'
          },
          {
            title: 'Week 12',
            to: '/chinese-simplified/week-12'
          },
          {
            title: 'Week 13',
            to: '/chinese-simplified/week-13'
          },
          {
            title: 'Week 14',
            to: '/chinese-simplified/week-14'
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
