<template>

  <!-- VUETIFY -->
  <v-main v-if="vuetify" :id="name ? name : noNameWarning()">
    <v-container :id="name ? name + '-container' : null" :fluid="fluid" :fill-height="fillHeight" :fill-width="fillWidth">
      <slot></slot>
    </v-container>
  </v-main>

  <!-- ARTISTIC -->
  <div v-else class="--composition" :id="name ? name : noNameWarning()">
    <div class="--composition--content" :id="name ? name + '-content' : null">
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
    fluid: Boolean,
    'fill-height': Boolean,
    'fill-width': Boolean,
  },

  methods: {
    noNameWarning() {
      console.warn("Composition without name!");
    },
  },

}
</script>

<!-- SCSS -->
<style lang="scss" scoped>

.--composition {
  display: flex;
  flex: 1 0 auto;
  max-width: 100%;
}

.--compositon--content {
  position: relative;
  flex: 1 1 auto;
  max-width: 100%;
}

</style>