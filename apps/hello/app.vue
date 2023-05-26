<template>
  <v-app>
    <v-navigation-drawer
      v-model="drawer"
    >
      <v-list
        nav
        dense
      >
        <v-list-group
          v-for="(group, index) in groups"
          :key="index"
          v-model="group.active"
          :disabled="group.disabled"
          prepend-icon="mdi-translate"
        >
          <template #activator>
            <v-list-item-title>
              {{ group.title }}
            </v-list-item-title>
          </template>

          <v-list-item
            v-for="(item, index) in group.items"
            :key="index"
            :to="item.to"
            nuxt
            class="pl-16 mb-1"
          >
            <v-list-item-title>
              {{ item.title }}
            </v-list-item-title>
          </v-list-item>
        </v-list-group>

        <v-list-item class="justify-center">
          <v-switch
            v-model="theme.global.name"
            inset
            label="Theme"
            hide-details
          />
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar>
      <v-app-bar-nav-icon
        @click="drawer = !drawer"
      />
      <v-toolbar-title>
        Hello
      </v-toolbar-title>
    </v-app-bar>

    <v-main>
      <v-container
        class="fill-height"
        fluid
      >
        <v-btn />
        <NuxtPage />
      </v-container>
    </v-main>
  </v-app>
</template>

<script lang="ts" setup>
import { useDisplay, useTheme } from "vuetify";
const { smAndDown } = useDisplay();
const theme = useTheme();

const drawer = ref(false);
const groups = reactive([{
    title: "Chinese (Simplified)",
    active: false,
    disabled: false,
    items: [
        {
            title: "All",
            to: "/"
        },
        {
            title: "Numbers",
            to: "/chinese-simplified/numbers"
        },
        {
            title: "Destinations",
            to: "/chinese-simplified/destinations"
        },
        {
            title: "Professions",
            to: "/chinese-simplified/professions"
        },
        {
            title: "Week 1",
            to: "/chinese-simplified/week-1"
        },
        {
            title: "Week 2",
            to: "/chinese-simplified/week-2"
        },
        {
            title: "Week 3",
            to: "/chinese-simplified/week-3"
        },
        {
            title: "Week 4",
            to: "/chinese-simplified/week-4"
        },
        {
            title: "Week 5",
            to: "/chinese-simplified/week-5"
        },
        {
            title: "Week 6",
            to: "/chinese-simplified/week-6"
        },
        {
            title: "Week 7",
            to: "/chinese-simplified/week-7"
        },
        {
            title: "Week 8",
            to: "/chinese-simplified/week-8"
        },
        {
            title: "Week 9",
            to: "/chinese-simplified/week-9"
        },
        {
            title: "Week 10",
            to: "/chinese-simplified/week-10"
        },
        {
            title: "Week 11",
            to: "/chinese-simplified/week-11"
        },
        {
            title: "Week 12",
            to: "/chinese-simplified/week-12"
        },
        {
            title: "Week 13",
            to: "/chinese-simplified/week-13"
        },
        {
            title: "Week 14",
            to: "/chinese-simplified/week-14"
        },
    ],
}]);
</script>
