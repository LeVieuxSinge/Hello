<script lang="ts" setup>
import { useDisplay, useTheme } from "vuetify";

console.log(useNuxtApp().$yan);
onMounted(() => {
    useNuxtApp().$yan.synthesis("shíjiān");
});

const { mobile } = useDisplay();
const theme = useTheme();
const drawer = ref(false);

function toggleTheme() {
    theme.global.name.value = theme.global.name.value === "light" ? "dark" : "light";
}

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

<template>
  <v-app :theme="theme.global.name.value">
    <v-navigation-drawer
      v-model="drawer"
      :expand-on-hover="!mobile"
      :rail="!mobile"
      rounded="e-lg"
      :width="mobile ? 300 : 350"
    >
      <template #default>
        <v-list>
          <v-list-item
            prepend-icon="mdi-hand-wave"
            title="Hello"
            subtitle="A language learning app"
            rounded="lg"
          />
        </v-list>

        <v-divider />

        <v-list
          density="compact"
          nav
        >
          <v-list-group
            v-for="(group, index) in groups"
            :key="index"
          >
            <template #activator="{ props }">
              <v-list-item
                v-bind="props"
                prepend-icon="mdi-account-circle"
                :title="group.title"
                rounded="lg"
              />
            </template>

            <v-list-item
              v-for="(item, index) in group.items"
              :key="index"
              :to="item.to"
              :title="item.title"
              nuxt
              rounded="lg"
            />
          </v-list-group>
        </v-list>
      </template>

      <template #append>
        <v-divider />

        <v-list
          nav
        >
          <v-list-item
            :prepend-icon="theme.global.name.value === 'light' ? 'mdi-weather-night' : 'mdi-weather-sunny'"
            :title="theme.global.name.value === 'light' ? 'Night Mode' : 'Day Mode'"
            rounded="lg"
            @click="() => toggleTheme()"
          />
        </v-list>
      </template>
    </v-navigation-drawer>

    <v-app-bar
      v-if="mobile"
      flat
      color="transparent"
    >
      <v-app-bar-nav-icon
        @click="drawer = !drawer"
      />
    </v-app-bar>

    <v-main>
      <v-container
        fluid
        class="fill-height"
      >
        <v-row
          justify="center"
        >
          <v-sheet
            class="sheet pa-4"
            elevation="6"
            rounded="lg"
          >
            <v-row
              class="flex-column fill-height"
              dense
              justify="space-between"
              align="center"
            >
              <v-col
                class="text-caption"
                cols="auto"
                style="opacity: 0.7;"
              >
                Translation
              </v-col>

              <v-col
                class="item"
                cols="auto"
              >
                <!-- <v-sheet
                  class="item-content pa-2"
                  height="100%"
                  outlined
                  rounded
                  :class="sections.translation.active ? 'item-content-active' : 'null'"
                  @click="sections.translation.active = true"
                >
                  <div class="text-subtitle-1">
                    {{ sections.translation.content }}
                  </div>
                </v-sheet> -->
              </v-col>

              <v-col
                class="text-caption"
                cols="auto"
                style="opacity: 0.7;"
              >
                Pinyin
              </v-col>

              <v-col
                class="item"
                cols="auto"
              >
                <!-- <v-sheet
                  class="item-content pa-2"
                  height="100%"
                  outlined
                  rounded
                  :class="sections.pinyin.active ? 'item-content-active' : 'null'"
                  @click="sections.pinyin.active = true"
                >
                  <div class="text-h6">
                    {{ sections.pinyin.content }}
                  </div>
                </v-sheet> -->
              </v-col>

              <v-col
                class="text-caption"
                cols="auto"
                style="opacity: 0.7;"
              >
                Symbol
              </v-col>

              <v-col
                class="item"
                cols="auto"
              >
                <!-- <v-sheet
                  class="item-content pa-2"
                  height="100%"
                  outlined
                  rounded
                  :class="sections.symbol.active ? 'item-content-active' : 'null'"
                  @click="sections.symbol.active = true"
                >
                  <div class="text-h2">
                    {{ sections.symbol.content }}
                  </div>
                </v-sheet> -->
              </v-col>

              <v-col cols="auto">
                <v-btn
                  elevation="4"
                >
                  Next
                </v-btn>
              </v-col>
            </v-row>
          </v-sheet>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>
