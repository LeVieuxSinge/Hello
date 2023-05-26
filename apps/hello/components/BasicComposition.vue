<template>
  <!-- VUETIFY -->
  <v-main
    v-if="vuetify"
    :id="props.name ? props.name : noNameWarning()"
  >
    <v-container
      :id="name ? name + '-container' : null"
      :fluid="fluid"
      :fill-height="fillHeight"
      :fill-width="fillWidth"
    >
      <slot />
    </v-container>
  </v-main>

  <!-- ARTISTIC -->
  <div
    v-else
    :id="name ? name : undefined"
    class="--composition"
  >
    <div
      :id="name ? name + '-content' : undefined"
      class="--composition--content"
    >
      <slot />
    </div>
  </div>
</template>

<script lang="ts" setup>
const props = withDefaults(defineProps<{
  name?: string,
  vuetify?: boolean,
  fluid?: boolean,
  fillHeight?: boolean,
  fillWidth?: boolean,
}>(), {
    name: "",
    vuetify: false,
    fluid: false,
    fillHeight: false,
    fillWidth: false,
});

function noNameWarning() {
    console.warn("Composition without name!");
}
</script>

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
