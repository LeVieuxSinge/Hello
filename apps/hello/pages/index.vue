<template>
  <v-sheet
    class="sheet pa-4"
    elevation="6"
    rounded
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
        <v-sheet
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
        </v-sheet>
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
        <v-sheet
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
        </v-sheet>
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
        <v-sheet
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
        </v-sheet>
      </v-col>

      <v-col cols="auto">
        <v-btn
          elevation="4"
          @click="nextItem"
        >
          Next
        </v-btn>
      </v-col>
    </v-row>
  </v-sheet>
</template>

<script lang="ts" setup>
type ChineseItem = {
    translation: string,
    pinyin: string,
    symbol: string,
};

const sections = reactive({
    translation: {
        content: "",
        active: false,
    },
    pinyin: {
        content: "",
        active: false,
    },
    symbol: {
        content: "",
        active: false,
    },
});
const items: Ref<Array<ChineseItem>> = ref([]);

function nextItem() {
    let _items = unref(items);
    // Fill array if empty
    if (_items.length === 0) {
        _items = useNuxtApp().$hello.chinese.getAll();
    }

    // Select random index
    const randIndex = Math.floor(Math.random() * _items.length);
    // Get random item
    const randItem = _items[randIndex];
    // Reset active
    sections.translation.active = false;
    sections.pinyin.active = false;
    sections.symbol.active = false;
    // Wait for items to be blur
    setTimeout(() => {
        // Set values
        sections.translation.content = randItem.translation;
        sections.pinyin.content = randItem.pinyin;
        sections.symbol.content = randItem.symbol;

        // Remove item from array
        _items.splice(randIndex, 1);

        // Set random active
        switch (Math.floor(Math.random() * 3)) {
            case 0:
                sections.translation.active = true;
                break;
            case 1:
                sections.pinyin.active = true;
                break;
            case 2:
                sections.symbol.active = true;
                break;
        }
    }, 50);
}

onMounted(() => {
    // Select first item
    nextItem();
});
</script>

<style lang="scss">
#home {
  position: relative;
  max-height: 100vh;
}

#home-container {
  justify-content: center;
}

.sheet {
  width: 300px;
  max-width: 100%;
  height: 500px;
  max-height: 100%;
}

.item {
  width: 100%;
  flex: 1 1 auto;
}

.item-name {

}

.item-content {
  display: flex;

  @include for-hover {
    &:hover {
      cursor: pointer;
    }
  }

  >div {
    flex: 1 0 auto;
    display: flex;
    justify-content: center;
    align-items: center;
    filter: blur(10px);
    @include transition(filter 50ms);
  }
}

.item-content-active {
  >div {
    filter: blur(0px);
    @include transition(filter 200ms);
  }
}
</style>
