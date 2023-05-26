<template>
  <div
    :id="unique ? name : undefined"
    class="--pocket"
    :class="[name ? name : noNameWarning(), transform ? transform : null, {'--pocket--wrap': wrap}]"
  >
    <!-- EFFECT -->
    <div
      v-if="props.effect"
      :id="unique ? name + '-effect' : 'effect'"
      class="--pocket--effect"
      :class="[name ? name + '-effect' : null, group ? '--effect--group--' + group : '--effect--group--1']"
    >
      <!-- CONTENT -->
      <div
        :id="unique ? name + '-content' : 'content'"
        class="--pocket--content"
        :class="[name ? name + '-content' : null, display ? display : null]"
      >
        <slot />
      </div>
    </div>

    <!-- NON-EFFECT -->
    <!-- CONTENT -->
    <div
      v-else
      :id="unique ? name + '-content' : 'content'"
      class="--pocket--content"
      :class="[name ? name + '-content' : null, display ? display : null]"
    >
      <slot />
    </div>
  </div>
</template>

<script lang="ts" setup>
const props = withDefaults(defineProps<{
    name: string,
    unique: boolean,
    effect: boolean,
    wrap: boolean,
    group: string,
    transform: string | string[],
    display: string | string[],
}>(), {
    name: "",
    unique: false,
    effect: false,
    wrap: false,
    group: "",
    transform: "",
    display: "",
});

const noNameWarning = () => {
    console.warn("Pocket without name.");
};
</script>

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
