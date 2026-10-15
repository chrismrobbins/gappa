import type { Unit } from '../../types'
import { it } from '../item'

// Unit 3 — getting around Pune.

export const unit3: Unit = {
  id: 'mr-u3',
  title: 'Around Pune',
  nativeTitle: 'पुण्यात फिरूया',
  lessons: [
    {
      id: 'mr-3-1',
      title: 'Places',
      tip: {
        title: 'In a place',
        body: [
          'To say “in” or “at” a place, add **-त**: **बाजार** becomes **बाजारात**, **दुकान** becomes **दुकानात**, **पुणे** becomes **पुण्यात**.',
          '“At home” is a special form: **घरी**.',
        ],
      },
      words: [
        it('दुकान', 'dukaan', 'shop'),
        it('बाजार', 'baajaar', 'market'),
        it('स्टेशन', 'steshan', 'station'),
        it('मंदिर', 'mandir', 'temple'),
        it('हॉटेल', 'hotel', 'hotel', { alsoEn: ['restaurant'] }),
        it('घर', 'ghar', 'house', { alsoEn: ['home'] }),
      ],
      phrases: [
        it('स्टेशन कुठे आहे?', 'steshan kuthe aahe?', 'Where is the station?'),
        it('मंदिर कुठे आहे?', 'mandir kuthe aahe?', 'Where is the temple?'),
        it('मी बाजारात आहे.', 'mee baajaaraat aahe.', 'I am at the market.'),
        it('माझं घर पुण्यात आहे.', 'maajha ghar punyaat aahe.', 'My house is in Pune.'),
        it('ते हॉटेल खूप छान आहे.', 'te hotel khoop chhaan aahe.', 'That hotel is very nice.'),
      ],
    },
    {
      id: 'mr-3-2',
      title: 'Directions',
      tip: {
        title: 'Left, right, straight',
        body: [
          '**डावीकडे** is left, **उजवीकडे** is right, **सरळ** is straight. **जा** means “go”.',
          '**इथे** is “here” and **तिथे** is “there”. **इथून** is “from here”.',
        ],
      },
      words: [
        it('डावीकडे', 'daaveekade', 'left', { alsoEn: ['to the left'] }),
        it('उजवीकडे', 'ujaveekade', 'right', { alsoEn: ['to the right'] }),
        it('सरळ', 'saral', 'straight'),
        it('जवळ', 'javal', 'near', { alsoEn: ['close'] }),
        it('लांब', 'laamb', 'far'),
        it('इथे', 'ithe', 'here'),
        it('तिथे', 'tithe', 'there'),
      ],
      phrases: [
        it('स्टेशन इथे जवळ आहे.', 'steshan ithe javal aahe.', 'The station is near here.'),
        it('मंदिर डावीकडे आहे.', 'mandir daaveekade aahe.', 'The temple is on the left.'),
        it('सरळ जा, मग उजवीकडे.', 'saral jaa, mag ujaveekade.', 'Go straight, then right.'),
        it('बाजार लांब आहे का?', 'baajaar laamb aahe kaa?', 'Is the market far?'),
        it('हॉटेल तिथे आहे.', 'hotel tithe aahe.', 'The hotel is there.'),
      ],
    },
    {
      id: 'mr-3-3',
      title: 'Rickshaw',
      tip: {
        title: 'Taking a rickshaw',
        body: [
          'Ask for the meter: **मीटर टाका ना.** Say where to stop with **इथे थांबा**.',
          'To ask the fare at the end: **किती पैसे झाले?**',
        ],
      },
      words: [
        it('रिक्षा', 'rikshaa', 'auto-rickshaw', { alsoEn: ['rickshaw'] }),
        it('चला', 'chalaa', 'let’s go', { alsoEn: ['come on', 'go ahead'], register: 'polite' }),
        it('थांबा', 'thaambaa', 'stop', { alsoEn: ['wait'], register: 'polite' }),
        it('मीटर', 'meetar', 'meter'),
        it('पैसे', 'paise', 'money', { alsoEn: ['fare'] }),
        it('टाका', 'taakaa', 'put', { alsoEn: ['put in', 'turn on'], register: 'polite' }),
      ],
      phrases: [
        it('स्टेशनला येणार का?', 'steshanlaa yenaar kaa?', 'Will you go to the station?', { note: 'येणार का? = will you come?' }),
        it('मीटर टाका ना.', 'meetar taakaa naa.', 'Please put the meter on.'),
        it('इथे डावीकडे थांबा.', 'ithe daaveekade thaambaa.', 'Stop here on the left.'),
        it('किती पैसे झाले?', 'kitee paise jhaale?', 'How much is the fare?'),
        it('चला, रिक्षा इथे आहे.', 'chalaa, rikshaa ithe aahe.', 'Come on, the rickshaw is here.'),
      ],
    },
    {
      id: 'mr-3-4',
      title: 'Pune landmarks',
      tip: {
        title: 'Places to see',
        body: [
          '**शनिवारवाडा** is the old Peshwa palace-fort and **सिंहगड** is a hill fort outside the city. **दगडूशेठ गणपती** is Pune’s most famous Ganesh temple, and **तुळशीबाग** is the market for shopping.',
          '**पुण्याजवळ** means “near Pune”: the ending joins the word.',
        ],
      },
      words: [
        it('शनिवारवाडा', 'shanivaarvaadaa', 'Shaniwar Wada'),
        it('सिंहगड', 'sinhagad', 'Sinhagad'),
        it('दगडूशेठ गणपती', 'dagdoosheth ganapatee', 'Dagdusheth Ganpati'),
        it('तुळशीबाग', 'tulsheebaag', 'Tulshibaug', { note: 'The famous shopping market' }),
        it('किल्ला', 'killaa', 'fort'),
      ],
      phrases: [
        it('शनिवारवाडा कुठे आहे?', 'shanivaarvaadaa kuthe aahe?', 'Where is Shaniwar Wada?'),
        it('सिंहगड एक किल्ला आहे.', 'sinhagad ek killaa aahe.', 'Sinhagad is a fort.'),
        it('सिंहगड पुण्याजवळ आहे.', 'sinhagad punyaajaval aahe.', 'Sinhagad is near Pune.'),
        it('मला तुळशीबाग आवडते.', 'malaa tulsheebaag aavadte.', 'I like Tulshibaug.'),
        it('दगडूशेठ गणपती मंदिर खूप छान आहे.', 'dagdoosheth ganapatee mandir khoop chhaan aahe.', 'The Dagdusheth Ganpati temple is very beautiful.'),
      ],
    },
    {
      id: 'mr-3-5',
      title: 'Asking for help',
      tip: {
        title: 'When you’re stuck',
        body: [
          '**हरवलो** is “I’m lost” for a man; a woman says **हरवले**. **मला माहीत नाही** is “I don’t know”.',
          'In everyday speech people often say **प्लीज** instead of **कृपया**, but **कृपया** is always polite.',
        ],
      },
      words: [
        it('मदत', 'madat', 'help'),
        it('कृपया', 'krupayaa', 'please', { register: 'polite' }),
        it('माहीत', 'maaheet', 'known', { note: 'मला माहीत नाही = I don’t know' }),
        it('पत्ता', 'pattaa', 'address'),
        it('हरवलो', 'harvalo', 'I’m lost', { note: 'Said by a man' }),
      ],
      phrases: [
        it('मला मदत हवी आहे.', 'malaa madat havee aahe.', 'I need help.'),
        it('कृपया मदत करा.', 'krupayaa madat karaa.', 'Please help me.', { register: 'polite' }),
        it('मला माहीत नाही.', 'malaa maaheet naahee.', 'I don’t know.'),
        it('मी हरवलो आहे.', 'mee harvalo aahe.', 'I am lost.', { note: 'Said by a man' }),
        it('हा पत्ता कुठे आहे?', 'haa pattaa kuthe aahe?', 'Where is this address?'),
      ],
    },
  ],
}
