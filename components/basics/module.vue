<template>
  <div class="--pocket" :id="unique ? name : null" :class="[name ? name : noNameWarning(), transform ? transform : null, {'--pocket--wrap': wrap}]">

    <!-- EFFECT -->
    <div v-if="effect" :id="unique ? name + '-effect' : null" class="--pocket--effect" :class="[name ? name + '-effect' : null, group ? '--effect--group--' + group : '--effect--group--1']">

      <!-- CONTENT -->
      <div :id="unique ? name + '-content' : null" class="--pocket--content" :class="[name ? name + '-content' : null, display ? display : null]">
        <slot></slot>
      </div>

    </div>

    <!-- NON-EFFECT -->
    <!-- CONTENT -->
    <div v-else :id="unique ? name + '-content' : null" class="--pocket--content" :class="[name ? name + '-content' : null, display ? display : null]">
      <slot></slot>
    </div>

  </div>
</template>

<!-- JAVASCRIPT -->
<script>
export default {

  name: "Pocket",

  props: {
    name: String,
    unique: Boolean,
    effect: Boolean,
    wrap: Boolean,
    group: String,
    transform: String | [String],
    display: String | [String],
  },

  data: () => ({

  }),

  methods: {
    noNameWarning() {
      console.warn("Layer without name.");
    },
  },

}
</script>

<!-- SCSS -->
<style lang="scss">

.--pocket {
    position: relative;
    display: flex;

    &--effect {
      flex: 1 1 auto;
      position: relative;
      display: flex;
      overflow: auto;
    }

    &--content {
        flex: 1 1 auto;
    }

    &--wrap {
      overflow: hidden;
    }
}

</style>