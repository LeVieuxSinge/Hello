var simplified = {
  numbers: [
    {
      translation: 'One | 1',
      pinyin: 'yī',
      symbol: '一',
    },
    {
      translation: 'Two | 2',
      pinyin: 'èr',
      symbol: '二',
    },
    {
      translation: 'Three | 3',
      pinyin: 'sān',
      symbol: '三',
    },
    {
      translation: 'Four | 4',
      pinyin: 'sì',
      symbol: '四',
    },
    {
      translation: 'Five | 5',
      pinyin: 'wǔ',
      symbol: '五',
    },
    {
      translation: 'Six | 6',
      pinyin: 'liù',
      symbol: '六',
    },
    {
      translation: 'Seven | 7',
      pinyin: 'qī',
      symbol: '七',
    },
    {
      translation: 'Height | 8',
      pinyin: 'bā',
      symbol: '八',
    },
    {
      translation: 'Nine | 9',
      pinyin: 'jiǔ',
      symbol: '九',
    },
    {
      translation: 'Ten | 10',
      pinyin: 'shí',
      symbol: '十',
    },
  ],
  weeks: [{
    name: 'One',
    items: [{
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
    ],
  }, {
    name: 'Two',
    items: [{
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
  }],
  other: [{
    translation: 'Very',
    pinyin: 'hěn',
    symbol: '很',
  }, ],
};

var hello = {
  chinese: {
    getAll: () => {
      var output = [];
      for (let i = 0; i < simplified.weeks.length; i++) {
        output = output.concat(simplified.weeks[i].items);
      }
      return output;
    },
    getNumbers: () => {
      var output = [];
      output = output.concat(simplified.numbers);
      return output;
    },
    getWeek: (number) => {
      var output = [];
      output = output.concat(simplified.weeks[number - 1].items);
      return output;
    },
  }
};

export default ({
  app
}, inject) => {
  inject('hello', hello);
}