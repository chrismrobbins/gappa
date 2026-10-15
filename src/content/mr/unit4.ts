import type { Unit } from '../../types'
import { it } from '../item'

// Unit 4 — plans, time and feelings.

export const unit4: Unit = {
  id: 'mr-u4',
  title: 'Plans & time',
  nativeTitle: 'आज काय करायचं?',
  lessons: [
    {
      id: 'mr-4-1',
      title: 'Today & tomorrow',
      tip: {
        title: 'Time words',
        body: [
          '**आज** is today, **उद्या** is tomorrow and **काल** is yesterday. Add **रात्री** to say “last night”: **काल रात्री**.',
          '**असतो** means “I usually am” (a man speaking); a woman says **असते**.',
        ],
      },
      words: [
        it('आज', 'aaj', 'today'),
        it('उद्या', 'udyaa', 'tomorrow'),
        it('काल', 'kaal', 'yesterday'),
        it('सकाळी', 'sakaalee', 'in the morning'),
        it('संध्याकाळी', 'sandhyaakaalee', 'in the evening'),
        it('रात्री', 'raatree', 'at night'),
      ],
      phrases: [
        it('आज मी घरी आहे.', 'aaj mee gharee aahe.', 'Today I am at home.'),
        it('काल मी हॉटेलमध्ये होतो.', 'kaal mee hotelmadhye hoto.', 'Yesterday I was at the hotel.'),
        it('सकाळी मला चहा हवा.', 'sakaalee malaa chahaa havaa.', 'In the morning I want tea.'),
        it('संध्याकाळी मी घरी असतो.', 'sandhyaakaalee mee gharee asto.', 'In the evening I am usually at home.'),
        it('काल रात्री जेवण छान होतं.', 'kaal raatree jevan chhaan hota.', 'Last night the meal was great.'),
      ],
    },
    {
      id: 'mr-4-2',
      title: 'Days of the week',
      tip: {
        title: 'Every day is a -वार',
        body: [
          'Every weekday ends in **-वार**, which is why Pune’s **शनिवारवाडा** means “Saturday mansion”.',
          'Add **-ी** for “on”: **रविवारी** is “on Sunday”.',
        ],
      },
      words: [
        it('सोमवार', 'somvaar', 'Monday'),
        it('मंगळवार', 'mangalvaar', 'Tuesday'),
        it('बुधवार', 'budhvaar', 'Wednesday'),
        it('गुरुवार', 'guruvaar', 'Thursday'),
        it('शुक्रवार', 'shukravaar', 'Friday'),
        it('शनिवार', 'shanivaar', 'Saturday'),
        it('रविवार', 'ravivaar', 'Sunday'),
      ],
      phrases: [
        it('आज कोणता वार आहे?', 'aaj konta vaar aahe?', 'What day is it today?'),
        it('आज गुरुवार आहे.', 'aaj guruvaar aahe.', 'Today is Thursday.'),
        it('काल रविवार होता.', 'kaal ravivaar hota.', 'Yesterday was Sunday.'),
        it('रविवारी मी घरी असतो.', 'ravivaaree mee gharee asto.', 'On Sundays I am at home.'),
        it('शनिवारी आणि रविवारी सुट्टी आहे.', 'shanivaaree aani ravivaaree suttee aahe.', 'There is a holiday on Saturday and Sunday.'),
      ],
    },
    {
      id: 'mr-4-3',
      title: 'Telling time',
      tip: {
        title: 'What time is it?',
        body: [
          'Say the number, then **वाजले**: **तीन वाजले** is “it is three o’clock”. **किती वाजले?** asks the time.',
          '**वाजता** means “at”: **पाच वाजता** is “at five o’clock”.',
        ],
      },
      words: [
        it('आता', 'aataa', 'now'),
        it('वाजले', 'vaajle', 'o’clock', { note: 'किती वाजले? = What time is it?' }),
        it('वाजता', 'vaajtaa', 'at … o’clock'),
        it('तास', 'taas', 'hour'),
        it('अर्धा', 'ardhaa', 'half'),
        it('उशीर', 'usheer', 'delay', { alsoEn: ['late'] }),
      ],
      phrases: [
        it('आता किती वाजले?', 'aataa kitee vaajle?', 'What time is it now?'),
        it('आता तीन वाजले.', 'aataa teen vaajle.', 'It is three o’clock now.'),
        it('मी पाच वाजता घरी असतो.', 'mee paach vaajtaa gharee asto.', 'I am at home at five.'),
        it('अर्धा तास लागेल.', 'ardhaa taas laagel.', 'It will take half an hour.', { note: 'लागेल = it will take' }),
        it('माफ करा, मला उशीर झाला.', 'maaf karaa, malaa usheer jhaalaa.', 'Sorry, I’m late.'),
      ],
    },
    {
      id: 'mr-4-4',
      title: 'Making plans',
      tip: {
        title: 'Let’s…',
        body: [
          'Add **-ऊया** to a verb for “let’s”: **जाऊया** (let’s go), **भेटूया** (let’s meet). **आपण** means “we” when including the listener.',
          '**चालेल** is the all-purpose “that works for me”.',
        ],
      },
      words: [
        it('जाऊया', 'jaaooyaa', 'let’s go'),
        it('भेटूया', 'bhetooyaa', 'let’s meet'),
        it('फिरायला', 'phiraayalaa', 'for a walk', { alsoEn: ['to stroll around', 'to roam'] }),
        it('सिनेमा', 'sinemaa', 'movie', { alsoEn: ['cinema'] }),
        it('चालेल', 'chaalel', 'that works', { alsoEn: ['okay', 'fine with me'] }),
        it('आपण', 'aapan', 'we', { note: 'Includes the person you are talking to' }),
      ],
      phrases: [
        it('आपण उद्या भेटूया.', 'aapan udyaa bhetooyaa.', 'Let’s meet tomorrow.'),
        it('आज फिरायला जाऊया.', 'aaj phiraayalaa jaaooyaa.', 'Let’s go out for a walk today.'),
        it('आज सिनेमाला जाऊया का?', 'aaj sinemaalaa jaaooyaa kaa?', 'Shall we go to a movie today?'),
        it('संध्याकाळी सहा वाजता चालेल का?', 'sandhyaakaalee sahaa vaajtaa chaalel kaa?', 'Does six in the evening work?'),
        it('हो, चालेल.', 'ho, chaalel.', 'Yes, that works.'),
      ],
    },
    {
      id: 'mr-4-5',
      title: 'How I feel',
      tip: {
        title: 'Feelings come to you',
        body: [
          'Hunger and sleep “come to” you: **मला भूक लागली आहे**, **मला झोप येतेय**, **मला कंटाळा आला**.',
          'Describing yourself uses “I”: **मी दमलो** for a man, **मी दमले** for a woman.',
        ],
      },
      words: [
        it('भूक लागली', 'bhook laaglee', 'I’m hungry', { note: 'Literally “hunger has been felt”' }),
        it('दमलो', 'damlo', 'I’m tired', { note: 'Said by a man' }),
        it('झोप येते', 'jhop yete', 'feel sleepy', { note: 'Literally “sleep comes”' }),
        it('खूश', 'khoosh', 'happy', { alsoEn: ['pleased'] }),
        it('कंटाळा', 'kantaalaa', 'boredom', { alsoEn: ['bored'] }),
      ],
      phrases: [
        it('मला भूक लागली आहे.', 'malaa bhook laaglee aahe.', 'I am hungry.'),
        it('मी खूप दमलो.', 'mee khoop damlo.', 'I am very tired.', { note: 'Said by a man' }),
        it('मला झोप येतेय.', 'malaa jhop yetey.', 'I am feeling sleepy.'),
        it('मी आज खूप खूश आहे.', 'mee aaj khoop khoosh aahe.', 'I am very happy today.'),
        it('मला कंटाळा आला.', 'malaa kantaalaa aalaa.', 'I got bored.'),
      ],
    },
  ],
}
