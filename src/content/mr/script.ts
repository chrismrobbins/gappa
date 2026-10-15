import type { ScriptLesson } from '../../types'
import { letter } from '../item'

// Devanagari letters track (अक्षरं). Example words follow the classic Marathi primer where natural.

export const script: ScriptLesson[] = [
  {
    id: 'mr-s-1',
    title: 'Vowels I',
    note: 'Each vowel has a short and a long form: अ / आ, इ / ई, उ / ऊ.',
    letters: [
      letter('अ', 'a', 'अननस', 'ananas', 'pineapple'),
      letter('आ', 'aa', 'आई', 'aaee', 'mother'),
      letter('इ', 'i', 'इमारत', 'imaarat', 'building'),
      letter('ई', 'ee', 'ईश्वर', 'eeshwar', 'God'),
      letter('उ', 'u', 'उंदीर', 'undeer', 'mouse'),
      letter('ऊ', 'oo', 'ऊस', 'oos', 'sugarcane'),
    ],
  },
  {
    id: 'mr-s-2',
    title: 'Vowels II',
    letters: [
      letter('ए', 'e', 'एक', 'ek', 'one'),
      letter('ऐ', 'ai', 'ऐका', 'aikaa', 'listen'),
      letter('ओ', 'o', 'ओठ', 'oth', 'lip'),
      letter('औ', 'au', 'औषध', 'aushadh', 'medicine'),
      letter('अं', 'am', 'अंगठी', 'angthee', 'ring'),
    ],
  },
  {
    id: 'mr-s-3',
    title: 'Consonants I',
    note: 'Every consonant carries a built-in “a”: क is “ka”, not “k”.',
    letters: [
      letter('क', 'ka', 'कमळ', 'kamal', 'lotus'),
      letter('ख', 'kha', 'खिडकी', 'khidkee', 'window'),
      letter('ग', 'ga', 'गाय', 'gaay', 'cow'),
      letter('घ', 'gha', 'घर', 'ghar', 'house'),
      letter('म', 'ma', 'मासा', 'maasaa', 'fish'),
      letter('न', 'na', 'नाक', 'naak', 'nose'),
    ],
  },
  {
    id: 'mr-s-4',
    title: 'Consonants II',
    letters: [
      letter('च', 'cha', 'चहा', 'chahaa', 'tea'),
      letter('ज', 'ja', 'जेवण', 'jevan', 'meal'),
      letter('त', 'ta', 'तारा', 'taaraa', 'star'),
      letter('द', 'da', 'दूध', 'doodh', 'milk'),
      letter('प', 'pa', 'पाणी', 'paanee', 'water'),
      letter('ब', 'ba', 'बदक', 'badak', 'duck'),
    ],
  },
  {
    id: 'mr-s-5',
    title: 'Consonants III',
    letters: [
      letter('र', 'ra', 'रस्ता', 'rastaa', 'road'),
      letter('ल', 'la', 'लाडू', 'laadoo', 'laddoo (sweet)'),
      letter('व', 'va', 'वडा', 'vadaa', 'vada (snack)'),
      letter('स', 'sa', 'ससा', 'sasaa', 'rabbit'),
      letter('ह', 'ha', 'हात', 'haat', 'hand'),
      letter('य', 'ya', 'यश', 'yash', 'success'),
    ],
  },
  {
    id: 'mr-s-6',
    title: 'Vowel signs',
    note: 'After a consonant, a vowel becomes a small sign (मात्रा). This chart is the बाराखडी.',
    letters: [
      letter('का', 'kaa', 'काका', 'kaakaa', 'uncle'),
      letter('कि', 'ki', 'किल्ला', 'killaa', 'fort'),
      letter('की', 'kee', 'किल्ली', 'killee', 'key'),
      letter('कु', 'ku', 'कुत्रा', 'kutraa', 'dog'),
      letter('के', 'ke', 'केळं', 'kela', 'banana'),
      letter('कै', 'kai', 'कैरी', 'kairee', 'raw mango'),
      letter('को', 'ko', 'कोबी', 'kobee', 'cabbage'),
    ],
  },
  {
    id: 'mr-s-7',
    title: 'Tongue-back sounds',
    note: 'Capital letters mean the tongue curls back: त is “ta”, ट is “Ta”. ळ is a very Marathi sound.',
    letters: [
      letter('ट', 'Ta', 'टाळी', 'taalee', 'clap'),
      letter('ठ', 'Tha', 'ठिपका', 'thipkaa', 'dot'),
      letter('ड', 'Da', 'डोळा', 'dolaa', 'eye'),
      letter('ढ', 'Dha', 'ढग', 'dhag', 'cloud'),
      letter('ण', 'Na', 'बाण', 'baan', 'arrow'),
      letter('ळ', 'La', 'बाळ', 'baal', 'baby'),
      letter('श', 'sha', 'शाळा', 'shaalaa', 'school'),
      letter('झ', 'jha', 'झाड', 'jhaad', 'tree'),
    ],
  },
  {
    id: 'mr-s-8',
    title: 'Numerals',
    note: 'Marathi has its own digits, used on signs, calendars and prices.',
    letters: [
      letter('१', '1', 'एक', 'ek', 'one'),
      letter('२', '2', 'दोन', 'don', 'two'),
      letter('३', '3', 'तीन', 'teen', 'three'),
      letter('४', '4', 'चार', 'chaar', 'four'),
      letter('५', '5', 'पाच', 'paach', 'five'),
      letter('६', '6', 'सहा', 'sahaa', 'six'),
      letter('७', '7', 'सात', 'saat', 'seven'),
      letter('८', '8', 'आठ', 'aath', 'eight'),
      letter('९', '9', 'नऊ', 'nau', 'nine'),
      letter('१०', '10', 'दहा', 'dahaa', 'ten'),
    ],
  },
]
