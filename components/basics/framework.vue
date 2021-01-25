<template>

  <!-- VUETIFY -->
  <v-app v-if="show && vuetify" :class="[name ? name : noNameWarning()]">
    <slot></slot>
  </v-app>

  <!-- ARTISTIC -->
  <div v-else-if="show" class="--framework" :class="[name ? name : noNameWarning()]">
    <div class="--framework--content" :class="[name ? name + '-content' : null]">
      <slot></slot>
    </div>
  </div>

</template>

<!-- JAVASCRIPT -->
<script>
export default {

  props: {
    name: String,
    vuetify: Boolean,
  },

  mounted() {

    // Wait for loading to end
    var interval = setInterval(() => {
      if (!this.$nuxt.$loading.loading) {
        clearInterval(interval);
        this.show = true;
      } else {
        this.show = false;
      }
    }, 10);

  },

  data: () => ({
    show: false,
  }),

  methods: {
    noNameWarning() {
      console.warn("Framework without name!");
    },
  },

}
</script>

<!-- SCSS -->
<style lang="scss" scoped>

// --- To Remove Top Scroll Bounce ---
// html {
//   overscroll-behavior: auto contain;
// }

.framework {
  display: flex;
  // --- If Needed ---
  // font-family: 'Roboto', sans-serif;
  // line-height: 1.5;
}

.framework--content {
  position: relative;
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  max-width: 100%;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
}

</style>