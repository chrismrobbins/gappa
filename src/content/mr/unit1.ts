import type { Unit } from '../../types'
import { it } from '../item'

// Unit 1 — greetings and introductions, Pune-standard Marathi.
// Sentences about "I" use masculine forms (the learner); tips teach the feminine forms too.

export const unit1: Unit = {
  id: 'mr-u1',
  title: 'Hello!',
  nativeTitle: 'नमस्कार!',
  lessons: [
    {
      id: 'mr-1-1',
      title: 'Greetings',
      tip: {
        title: 'Polite or close',
        body: [
          'Marathi changes its words depending on who you are talking to.',
          '**कसे आहात?** is polite: use it with elders, strangers and her parents.',
          'With a close friend it depends on them: **कसा आहेस?** to a man, **कशी आहेस?** to a woman.',
        ],
        examples: [
          it('कसा आहेस?', 'kasaa aahes?', 'How are you? (to a man, casual)', { register: 'casual' }),
        ],
      },
      words: [
        it('नमस्कार', 'namaskaar', 'hello', { alsoEn: ['namaste', 'hi'], note: 'Polite greeting, any time of day' }),
        it('हो', 'ho', 'yes'),
        it('नाही', 'naahee', 'no', { alsoEn: ['not'] }),
        it('धन्यवाद', 'dhanyavaad', 'thank you', { alsoEn: ['thanks'] }),
        it('ठीक आहे', 'theek aahe', 'okay', { alsoEn: ['fine', 'all right'] }),
      ],
      phrases: [
        it('नमस्कार, कसे आहात?', 'namaskaar, kase aahaat?', 'Hello, how are you?', { register: 'polite' }),
        it('मी ठीक आहे.', 'mee theek aahe.', 'I am fine.'),
        it('हो, धन्यवाद.', 'ho, dhanyavaad.', 'Yes, thank you.'),
        it('कशी आहेस?', 'kashee aahes?', 'How are you? (to a woman)', { register: 'casual' }),
      ],
    },
    {
      id: 'mr-1-2',
      title: 'My name is…',
      tip: {
        title: 'The verb goes last',
        body: [
          '**आहे** means “is” or “am”, and it comes at the end of the sentence.',
          '**माझं नाव क्रिस आहे** is literally “my name Chris is”.',
        ],
      },
      words: [
        it('मी', 'mee', 'I'),
        it('तुम्ही', 'tumhee', 'you', { note: 'Polite, or more than one person', register: 'polite' }),
        it('तू', 'too', 'you', { note: 'Casual: close friends and family', register: 'casual' }),
        it('नाव', 'naav', 'name'),
        it('काय', 'kaay', 'what'),
        it('आहे', 'aahe', 'is', { alsoEn: ['am'] }),
        it('माझं', 'maajha', 'my', { note: 'With नाव and other neuter words' }),
      ],
      phrases: [
        it('माझं नाव क्रिस आहे.', 'maajha naav kris aahe.', 'My name is Chris.'),
        it('तुमचं नाव काय आहे?', 'tumcha naav kaay aahe?', 'What is your name?', { register: 'polite' }),
        it('तुझं नाव काय?', 'tujha naav kaay?', 'What’s your name?', { register: 'casual' }),
      ],
    },
    {
      id: 'mr-1-3',
      title: 'Where are you from?',
      tip: {
        title: 'Endings change',
        body: [
          'Place names change their ending: **पुणे** becomes **पुण्यात** (in Pune) and **पुण्याची** (from Pune).',
          '“From” a place is **-चा** for a man and **-ची** for a woman: **अमेरिकेचा**, **पुण्याची**.',
        ],
      },
      words: [
        it('कुठे', 'kuthe', 'where'),
        it('कुठून', 'kuthoon', 'from where'),
        it('भारत', 'bhaarat', 'India'),
        it('अमेरिका', 'amerikaa', 'America', { alsoEn: ['USA', 'the US'] }),
        it('पुणे', 'pune', 'Pune'),
        it('ती', 'tee', 'she'),
        it('तो', 'to', 'he'),
      ],
      phrases: [
        it('तुम्ही कुठून आहात?', 'tumhee kuthoon aahaat?', 'Where are you from?', { register: 'polite' }),
        it('मी अमेरिकेचा आहे.', 'mee amerikechaa aahe.', 'I am from America.', { note: 'Said by a man' }),
        it('ती पुण्याची आहे.', 'tee punyaachee aahe.', 'She is from Pune.'),
        it('पुणे कुठे आहे?', 'pune kuthe aahe?', 'Where is Pune?'),
        it('पुणे भारतात आहे.', 'pune bhaarataat aahe.', 'Pune is in India.'),
      ],
    },
    {
      id: 'mr-1-4',
      title: 'Family',
      tip: {
        title: '“My” agrees',
        body: [
          '“My” changes with the word after it: **माझा भाऊ**, **माझी आई**, **माझं नाव**.',
          'Elders get respectful plural forms: **हे माझे बाबा आहेत**.',
        ],
      },
      words: [
        it('आई', 'aaee', 'mother', { alsoEn: ['mom', 'mum'] }),
        it('बाबा', 'baabaa', 'father', { alsoEn: ['dad'] }),
        it('भाऊ', 'bhaaoo', 'brother'),
        it('बहीण', 'baheen', 'sister'),
        it('घरी', 'gharee', 'at home', { alsoEn: ['home'] }),
        it('ही', 'hee', 'this', { note: 'For a woman or feminine word', alsoEn: ['she'] }),
      ],
      phrases: [
        it('ही माझी आई आहे.', 'hee maajhee aaee aahe.', 'This is my mother.'),
        it('हे माझे बाबा आहेत.', 'he maajhe baabaa aahet.', 'This is my father.', { note: 'हे and आहेत show respect' }),
        it('माझा भाऊ पुण्यात आहे.', 'maajhaa bhaaoo punyaat aahe.', 'My brother is in Pune.'),
        it('माझी बहीण घरी आहे.', 'maajhee baheen gharee aahe.', 'My sister is at home.'),
      ],
    },
    {
      id: 'mr-1-5',
      title: 'I’m learning',
      tip: {
        title: 'Knowing a language',
        body: [
          'Marathi says **मला मराठी येतं**: literally “Marathi comes to me”.',
          'Add **ना** or **जरा** to make a request softer and friendlier.',
        ],
      },
      words: [
        it('मला', 'malaa', 'to me', { alsoEn: ['me', 'I'] }),
        it('मराठी', 'maraathee', 'Marathi'),
        it('थोडं', 'thoda', 'a little', { alsoEn: ['a bit', 'little'] }),
        it('समजलं', 'samajla', 'understood'),
        it('परत', 'parat', 'again'),
        it('हळू', 'haloo', 'slowly'),
        it('बोला', 'bolaa', 'speak', { alsoEn: ['talk'], register: 'polite' }),
        it('माफ करा', 'maaf karaa', 'sorry', { alsoEn: ['excuse me', 'pardon'] }),
      ],
      phrases: [
        it('मला थोडं मराठी येतं.', 'malaa thoda maraathee yeta.', 'I know a little Marathi.'),
        it('मला समजलं नाही.', 'malaa samajla naahee.', 'I didn’t understand.'),
        it('परत सांगा ना.', 'parat saangaa naa.', 'Please say it again.'),
        it('जरा हळू बोला.', 'jaraa haloo bolaa.', 'Please speak slowly.'),
        it('माफ करा, मला समजलं नाही.', 'maaf karaa, malaa samajla naahee.', 'Sorry, I didn’t understand.'),
      ],
    },
  ],
}
