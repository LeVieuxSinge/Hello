<template>
  <composition name="home" vuetify fill-height>

    <v-sheet class="sheet pa-4" elevation="6" rounded>
      <v-row class="flex-column fill-height" dense justify="space-between" align="center">

        <v-col class="text-caption" cols="auto" style="opacity: 0.7;">
          Translation
        </v-col>

        <v-col class="item" cols="auto">
          <v-sheet class="item-content pa-2" height="100%" outlined rounded :class="sections.translation.active ? 'item-content-active' : 'null'" @click="sections.translation.active = true">
            <div class="text-subtitle-1">
              {{ sections.translation.content }}
            </div>
          </v-sheet>
        </v-col>

        <v-col class="text-caption" cols="auto" style="opacity: 0.7;">
          Pinyin
        </v-col>

        <v-col class="item" cols="auto">
          <v-sheet class="item-content pa-2" height="100%" outlined rounded :class="sections.pinyin.active ? 'item-content-active' : 'null'" @click="sections.pinyin.active = true">
            <div class="text-h6">
              {{ sections.pinyin.content }}
            </div>
          </v-sheet>
        </v-col>

        <v-col class="text-caption" cols="auto" style="opacity: 0.7;">
          Symbol
        </v-col>
        
        <v-col class="item" cols="auto">
          <v-sheet class="item-content pa-2" height="100%" outlined rounded :class="sections.symbol.active ? 'item-content-active' : 'null'" @click="sections.symbol.active = true">
            <div class="text-h2">
              {{ sections.symbol.content }}
            </div>
          </v-sheet>
        </v-col>

        <v-col cols="auto">
          <v-btn elevation="4" @click="nextItem">
            Next
          </v-btn>
        </v-col>

      </v-row>
    </v-sheet>

  </composition>
</template>

<!-- JAVASCRIPT -->
<script>
import Composition from '~/components/basics/composition.vue';
export default {

  components: {
    Composition,
  },

  mounted() {
    // Select first item
    this.nextItem();
    // Debugging
    console.log(this.items.length + " items in array.");
  },

  data: () => ({
    sections: {
      translation: {
        content: '',
        active: false,
      },
      pinyin: {
        content: '',
        active: false,
      },
      symbol: {
        content: '',
        active: false,
      },
    },
    items: [
      {
        translation: 'Very',
        pinyin: 'hěn',
        symbol: '很',
      },
      {
        translation: 'You',
        pinyin: 'nǐ',
        symbol: '你',
      },
      {
        translation: 'Fine | Good | OK',
        pinyin: 'hǎo',
        symbol: '好',
      },
      {
        translation: 'Please (polite request)',
        pinyin: 'qǐng',
        symbol: '请',
      },
      {
        translation: 'To ask (a question)',
        pinyin: 'wèn',
        symbol: '问',
      },
      {
        translation: 'Honorable | Expensive',
        pinyin: 'guì',
        symbol: '贵',
      },
      {
        translation: 'Surname | To be surnamed',
        pinyin: 'xìng',
        symbol: '姓',
      },
      {
        translation: 'I | Me',
        pinyin: 'wǒ',
        symbol: '我',
      },
      {
        translation: '(Question particle)',
        pinyin: 'ne',
        symbol: '呢',
      },
      {
        translation: 'Miss | Young lady',
        pinyin: 'xiǎojiě',
        symbol: '小姐',
      },
      {
        translation: 'To be called | To call',
        pinyin: 'jiào',
        symbol: '叫',
      },
      {
        translation: 'What',
        pinyin: 'shénme',
        symbol: '什么',
      },
      {
        translation: 'Name',
        pinyin: 'míngzi',
        symbol: '名字',
      },
      {
        translation: 'Mr. | Husband',
        pinyin: 'xiānsheng',
        symbol: '先生',
      },
      {
        translation: '(Personal Name)',
        pinyin: 'Lǐ Yǒu',
        symbol: '李友',
      },
      {
        translation: '(Surname) | Plum',
        pinyin: 'lǐ',
        symbol: '李',
      },
      {
        translation: '(Personal Name)',
        pinyin: 'Wáng Péng',
        symbol: '王朋',
      },
      {
        translation: 'King',
        pinyin: 'wáng',
        symbol: '王',
      },
      {
        translation: 'To be',
        pinyin: 'shì',
        symbol: '是',
      },
      {
        translation: 'Teacher',
        pinyin: 'lǎoshī',
        symbol: '老师',
      },
      {
        translation: '(Question Particle)',
        pinyin: 'ma',
        symbol: '吗',
      },
      {
        translation: 'Not | No',
        pinyin: 'bù',
        symbol: '不',
      },
      {
        translation: 'Student',
        pinyin: 'xuésheng',
        symbol: '学生',
      },
      {
        translation: 'Too | Also',
        pinyin: 'yě',
        symbol: '也',
      },
      {
        translation: 'People | Person',
        pinyin: 'rén',
        symbol: '人',
      },
      {
        translation: 'China',
        pinyin: 'Zhōngguó',
        symbol: '中国',
      },
      {
        translation: 'Beijing',
        pinyin: 'Běijīng',
        symbol: '北京',
      },
      {
        translation: 'United States | America',
        pinyin: 'Měiguó',
        symbol: '美国',
      },
      {
        translation: 'New York',
        pinyin: 'Niǔyuě',
        symbol: '纽约',
      },
    ],
  }),

  methods: {
    nextItem() {
      var randItem = this.items[Math.floor(Math.random() * this.items.length)];
      // Reset active
      this.sections.translation.active = false;
      this.sections.pinyin.active = false;
      this.sections.symbol.active = false;
      // Wait for items to be blur
      setTimeout(() => {
        // Set values
        this.sections.translation.content = randItem.translation;
        this.sections.pinyin.content = randItem.pinyin;
        this.sections.symbol.content = randItem.symbol;

        // Set random active
        switch (Math.floor(Math.random() * 3)) {
          case 0:
            this.sections.translation.active = true;
            break;
          case 1:
            this.sections.pinyin.active = true;
            break;
          case 2:
            this.sections.symbol.active = true;
            break;
        }
      }, 50);
    },
  },

}
</script>

<!-- SCSS -->
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
