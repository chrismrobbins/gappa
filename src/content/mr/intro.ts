import type { IntroLesson } from '../../types'

// "Start here" — how Marathi writing works, before any vocabulary.
// Every example's `text` is recorded and playable, so keep examples to real letters, syllables or words.

export const intro: IntroLesson[] = [
  {
    id: 'mr-0-1',
    title: 'Meet the script',
    slides: [
      {
        title: 'Marathi is written in Devanagari',
        body: [
          'Marathi uses **देवनागरी** (Devanagari), the same script as Hindi and Sanskrit. Learn it once and you can sound out signs all over India.',
          'It reads left to right, like English, and there are no capital letters.',
        ],
        examples: [{ text: 'मराठी', rom: 'maraathee', en: 'Marathi' }],
        check: {
          question: 'Which way does Marathi read?',
          options: ['Left to right', 'Right to left', 'Top to bottom'],
          answer: 0,
          explain: 'Just like English: left to right.',
        },
      },
      {
        title: 'Letters hang from a line',
        body: [
          'Most letters hang from a line across the top called the **शिरोरेखा** (head line).',
          'Inside a word the lines join up, so one unbroken line usually means one word.',
        ],
        examples: [{ parts: ['न', 'म', 'स्का', 'र'], text: 'नमस्कार', rom: 'namaskaar', en: 'hello' }],
      },
      {
        title: 'Say what you see',
        body: [
          'Marathi spelling is phonetic: each letter stands for a sound, and it is said the same way almost every time.',
          'There are no silent letters to memorise. If you can read the letters, you can say the word.',
        ],
        examples: [{ parts: ['घ', 'र'], text: 'घर', rom: 'ghar', en: 'house' }],
        check: {
          question: 'Is a Marathi letter usually said the same way every time?',
          options: ['Yes, almost always', 'No, it changes a lot'],
          answer: 0,
          explain: 'Yes. Reading Marathi is mostly sounding it out.',
        },
      },
    ],
  },
  {
    id: 'mr-0-2',
    title: 'Vowels and consonants',
    slides: [
      {
        title: 'Two kinds of letters',
        body: [
          '**स्वर** are vowels: sounds like a, aa, i, u.',
          '**व्यंजन** are consonants: sounds like ka, ga, ma, na.',
          'There are about a dozen vowels and three dozen consonants, but you will meet them a few at a time.',
        ],
        examples: [
          { text: 'अ', rom: 'a' },
          { text: 'आ', rom: 'aa' },
          { text: 'क', rom: 'ka' },
          { text: 'म', rom: 'ma' },
        ],
      },
      {
        title: 'Every consonant says “a”',
        body: [
          'Each consonant comes with a built-in “a”: **क** is “ka”, **म** is “ma”, **न** is “na”.',
          'At the end of a word that last “a” is usually dropped: **कमळ** is “kamal” (lotus), not “kamala”.',
        ],
        examples: [{ parts: ['क', 'म', 'ळ'], text: 'कमळ', rom: 'kamal', en: 'lotus' }],
        check: {
          question: 'How does this letter sound on its own?',
          prompt: 'क',
          options: ['ka', 'k', 'kee'],
          answer: 0,
          explain: 'Every consonant carries a built-in “a”.',
        },
      },
      {
        title: 'Short and long vowels',
        body: [
          'Several vowels come in pairs, one short and one long.',
          '**इ** is a short “i” and **ई** a long “ee”. **उ** is a short “u” and **ऊ** a long “oo”.',
        ],
        examples: [
          { text: 'इ', rom: 'i' },
          { text: 'ई', rom: 'ee' },
          { text: 'उ', rom: 'u' },
          { text: 'ऊ', rom: 'oo' },
        ],
        check: {
          question: 'Which one is the long “ee”?',
          options: ['इ', 'ई', 'उ'],
          answer: 1,
          explain: 'ई is long “ee”; इ is the short “i”.',
        },
      },
    ],
  },
  {
    id: 'mr-0-3',
    title: 'Vowel signs',
    slides: [
      {
        title: 'Vowels shrink after a consonant',
        body: [
          'A full vowel letter such as **आ** is used at the start of a word.',
          'After a consonant the vowel becomes a small mark called a **मात्रा**: **क** + **ा** = **का** (kaa).',
        ],
        examples: [
          { parts: ['क', 'ा'], text: 'का', rom: 'kaa' },
          { parts: ['म', 'ा'], text: 'मा', rom: 'maa' },
        ],
      },
      {
        title: 'Signs go all around',
        body: [
          'Some signs sit after the letter (**का**), some above (**के**), some below (**कु**).',
          'One is written before the letter but said after it: **कि** is “ki”.',
        ],
        examples: [
          { text: 'कि', rom: 'ki' },
          { text: 'की', rom: 'kee' },
          { text: 'कु', rom: 'ku' },
          { text: 'के', rom: 'ke' },
          { text: 'को', rom: 'ko' },
        ],
        check: {
          question: 'How do you say this?',
          prompt: 'कि',
          options: ['ki', 'ik', 'ka'],
          answer: 0,
          explain: 'The i-sign is written first but said after the consonant.',
        },
      },
      {
        title: 'The बाराखडी',
        body: [
          'Put every vowel sign on one consonant and you get a row of the **बाराखडी**, the chart every Marathi child learns.',
          'Once you know the signs, they work the same on every consonant.',
        ],
        examples: [{ text: 'का कि की कु कू के कै को कौ', rom: 'kaa ki kee ku koo ke kai ko kau' }],
        check: {
          question: 'Which one says “ko”?',
          options: ['को', 'कु', 'के'],
          answer: 0,
          explain: 'को is क with the “o” sign.',
        },
      },
    ],
  },
  {
    id: 'mr-0-4',
    title: 'Dots, halves and joins',
    slides: [
      {
        title: 'The dot on top',
        body: [
          'A dot above a letter, **ं** (अनुस्वार), adds a nasal “n” or “m” sound: **अं** is “am”.',
          'At the end of a word like **थोडं** (a little) it just makes the last sound slightly nasal.',
        ],
        examples: [
          { text: 'मंदिर', rom: 'mandir', en: 'temple' },
          { text: 'थोडं', rom: 'thoda', en: 'a little' },
        ],
      },
      {
        title: 'Half letters',
        body: [
          'When two consonants meet with no vowel between them, the first is written as a half letter and they join.',
          '**स्** + **ता** = **स्ता**: that is the “sta” in **रस्ता** (road).',
        ],
        examples: [
          { parts: ['र', 'स्', 'ता'], text: 'रस्ता', rom: 'rastaa', en: 'road' },
          { parts: ['ध', 'न्', 'य', 'वा', 'द'], text: 'धन्यवाद', rom: 'dhanyavaad', en: 'thank you' },
        ],
        check: {
          question: 'What happens when two consonants meet with no vowel between them?',
          options: ['The first becomes a half letter', 'Both keep their “a”', 'The second disappears'],
          answer: 0,
          explain: 'The first one loses its “a” and joins the next as a half letter.',
        },
      },
      {
        title: 'Special joins',
        body: [
          'A few joins look brand new: **क्ष** (ksha), **ज्ञ** (dnya in Marathi), and **र** changes shape inside **प्र** (pra).',
          'No need to memorise them now. You will pick them up word by word.',
        ],
        examples: [
          { text: 'क्ष', rom: 'ksha' },
          { text: 'ज्ञ', rom: 'dnya' },
          { text: 'प्र', rom: 'pra' },
        ],
      },
    ],
  },
  {
    id: 'mr-0-5',
    title: 'New sounds',
    slides: [
      {
        title: 'Breathy pairs',
        body: [
          'Many consonants come in pairs, plain and breathy. **क** (ka) is plain; **ख** (kha) has a puff of air.',
          'Hold your hand in front of your mouth: you should feel the puff on **ख** but not on **क**.',
        ],
        examples: [
          { text: 'क', rom: 'ka' },
          { text: 'ख', rom: 'kha' },
          { text: 'ग', rom: 'ga' },
          { text: 'घ', rom: 'gha' },
        ],
        check: {
          question: 'Which one has the puff of air?',
          options: ['क', 'ख'],
          answer: 1,
          explain: 'ख is the breathy “kha”.',
        },
      },
      {
        title: 'Two kinds of t and d',
        body: [
          '**त** and **द** are said with the tongue touching the back of your top teeth: softer than an English t or d.',
          '**ट** and **ड** are said with the tongue curled back. Gappa writes these with capitals: Ta, Da.',
        ],
        examples: [
          { text: 'त', rom: 'ta' },
          { text: 'ट', rom: 'Ta' },
          { text: 'द', rom: 'da' },
          { text: 'ड', rom: 'Da' },
        ],
      },
      {
        title: 'The Marathi L',
        body: [
          '**ळ** is an L with the tongue curled back. It is in **कमळ** (lotus), **बाळ** (baby) and **टाळी** (clap).',
          'Hindi does not use it, so saying it well makes you sound properly Marathi.',
        ],
        examples: [
          { text: 'ळ', rom: 'La' },
          { text: 'बाळ', rom: 'baal', en: 'baby' },
        ],
        check: {
          question: 'Which is the Marathi L with the tongue curled back?',
          options: ['ल', 'ळ'],
          answer: 1,
          explain: 'ळ is the curled-back L; ल is a plain L.',
        },
      },
    ],
  },
  {
    id: 'mr-0-6',
    title: 'Read your first words',
    slides: [
      {
        title: 'Sound it out',
        body: [
          'Read a word one piece at a time, then say it smoothly.',
          '**न** + **म** + **स्का** + **र** → **नमस्कार**',
        ],
        examples: [{ parts: ['न', 'म', 'स्का', 'र'], text: 'नमस्कार', rom: 'namaskaar', en: 'hello' }],
        check: {
          question: 'What does this word say?',
          prompt: 'आई',
          options: ['aaee (mother)', 'baabaa (father)', 'ghar (house)'],
          answer: 0,
          explain: 'आ + ई = आई, mother.',
        },
      },
      {
        title: 'Your turn',
        body: ['Try these three before you look at the romanization.'],
        examples: [
          { parts: ['च', 'हा'], text: 'चहा', rom: 'chahaa', en: 'tea' },
          { parts: ['पा', 'णी'], text: 'पाणी', rom: 'paanee', en: 'water' },
          { parts: ['घ', 'र'], text: 'घर', rom: 'ghar', en: 'house' },
        ],
        check: {
          question: 'What does this word say?',
          prompt: 'चहा',
          options: ['chahaa (tea)', 'paanee (water)', 'doodh (milk)'],
          answer: 0,
          explain: 'च + हा = चहा, tea.',
        },
      },
      {
        title: 'You’re ready',
        body: [
          'That is how Marathi writing works. Unit 1 starts with real words, and the **अक्षरं** · Letters track drills every letter whenever you want more practice.',
          'The English letters under each word will fade away as you level up.',
        ],
      },
    ],
  },
]
