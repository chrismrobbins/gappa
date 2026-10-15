import type { Unit } from '../../types'
import { it } from '../item'

// Unit 5 — family, festivals and sweet words.

export const unit5: Unit = {
  id: 'mr-u5',
  title: 'Family & festivals',
  nativeTitle: 'कुटुंब आणि सण',
  lessons: [
    {
      id: 'mr-5-1',
      title: 'Extended family',
      tip: {
        title: 'Marathi names every relative',
        body: [
          'Father’s side: **काका** (father’s brother) and **आत्या** (father’s sister). Mother’s side: **मामा** (mother’s brother) and **मावशी** (mother’s sister).',
          'You can also call any older man **काका** and any older woman **काकू** as a polite address.',
        ],
      },
      words: [
        it('आजी', 'aajee', 'grandmother'),
        it('आजोबा', 'aajobaa', 'grandfather'),
        it('काका', 'kaakaa', 'uncle', { note: 'Father’s brother, or any older man' }),
        it('काकू', 'kaakoo', 'aunt', { note: 'Wife of काका, or any older woman' }),
        it('मावशी', 'maavashee', 'mother’s sister'),
        it('मामा', 'maamaa', 'mother’s brother'),
        it('आत्या', 'aatyaa', 'father’s sister'),
      ],
      phrases: [
        it('ही माझी आजी आहे.', 'hee maajhee aajee aahe.', 'This is my grandmother.'),
        it('हे माझे आजोबा आहेत.', 'he maajhe aajobaa aahet.', 'This is my grandfather.'),
        it('माझी मावशी पुण्यात राहते.', 'maajhee maavashee punyaat raahte.', 'My aunt lives in Pune.', { note: 'राहते = lives' }),
        it('माझे काका आणि काकू घरी आहेत.', 'maajhe kaakaa aani kaakoo gharee aahet.', 'My uncle and aunt are at home.'),
        it('तुमचे मामा कुठे आहेत?', 'tumche maamaa kuthe aahet?', 'Where is your uncle?', { register: 'polite' }),
      ],
    },
    {
      id: 'mr-5-2',
      title: 'Describing people',
      tip: {
        title: 'Big and small',
        body: [
          '**मोठा** (big or older) changes with the person: **मोठा भाऊ**, **मोठी बहीण**. Words like **उंच**, **हुशार** and **लहान** do not change.',
        ],
      },
      words: [
        it('उंच', 'unch', 'tall'),
        it('हुशार', 'hushaar', 'clever', { alsoEn: ['smart', 'intelligent'] }),
        it('प्रेमळ', 'premal', 'loving', { alsoEn: ['affectionate', 'kind'] }),
        it('मोठा', 'mothaa', 'big', { alsoEn: ['older'], note: 'For masculine words' }),
        it('मोठी', 'mothee', 'big (f.)', { alsoEn: ['older'], note: 'For feminine words' }),
        it('लहान', 'lahaan', 'small', { alsoEn: ['little', 'younger'] }),
      ],
      phrases: [
        it('माझी आजी खूप प्रेमळ आहे.', 'maajhee aajee khoop premal aahe.', 'My grandmother is very loving.'),
        it('माझा भाऊ उंच आहे.', 'maajhaa bhaaoo unch aahe.', 'My brother is tall.'),
        it('ती खूप हुशार आहे.', 'tee khoop hushaar aahe.', 'She is very clever.'),
        it('माझी बहीण मोठी आहे.', 'maajhee baheen mothee aahe.', 'My sister is older.'),
        it('तुमची आई खूप छान आहे.', 'tumchee aaee khoop chhaan aahe.', 'Your mother is very nice.', { register: 'polite' }),
      ],
    },
    {
      id: 'mr-5-3',
      title: 'Meeting the family',
      tip: {
        title: 'Always polite',
        body: [
          'With your partner’s parents use **तुम्ही** and the plural verb, never **तू**. Greet them as **काका** and **काकू**, or whatever your partner suggests.',
          'Touching an elder’s feet is a sign of respect; they respond with **आशीर्वाद**, a blessing.',
        ],
      },
      words: [
        it('बसा', 'basaa', 'sit', { alsoEn: ['please sit'], register: 'polite' }),
        it('या', 'yaa', 'come', { alsoEn: ['come in'], register: 'polite' }),
        it('तुमचं', 'tumcha', 'your', { register: 'polite', note: 'With neuter words like घर' }),
        it('आनंद', 'aanand', 'joy', { alsoEn: ['happiness'] }),
        it('आशीर्वाद', 'aasheervaad', 'blessing'),
      ],
      phrases: [
        it('नमस्कार काका, नमस्कार काकू.', 'namaskaar kaakaa, namaskaar kaakoo.', 'Hello uncle, hello aunt.', { register: 'polite' }),
        it('तुम्हाला भेटून आनंद झाला.', 'tumhaalaa bhetoon aanand jhaalaa.', 'Nice to meet you.', { register: 'polite' }),
        it('या ना, बसा.', 'yaa naa, basaa.', 'Please come in and sit down.', { register: 'polite' }),
        it('तुमचं घर खूप छान आहे.', 'tumcha ghar khoop chhaan aahe.', 'Your home is very nice.', { register: 'polite' }),
        it('आशीर्वाद असू द्या.', 'aasheervaad asoo dyaa.', 'Please bless me.', { register: 'polite', note: 'Said to elders, e.g. after touching their feet' }),
      ],
    },
    {
      id: 'mr-5-4',
      title: 'Festivals',
      tip: {
        title: 'Festival greetings',
        body: [
          'Ganeshotsav and Diwali are the big ones. At Ganpati, everyone calls out **गणपती बाप्पा मोरया!** and offers **मोदक**.',
          'Greet people with **शुभेच्छा** (good wishes): **दिवाळीच्या हार्दिक शुभेच्छा!**',
        ],
      },
      words: [
        it('गणपती', 'ganapatee', 'Ganpati', { alsoEn: ['Ganesh'] }),
        it('बाप्पा', 'baappaa', 'Bappa', { note: 'Affectionate name for Ganpati' }),
        it('दिवाळी', 'divaalee', 'Diwali'),
        it('सण', 'san', 'festival'),
        it('शुभेच्छा', 'shubhechchhaa', 'good wishes', { alsoEn: ['greetings', 'best wishes'] }),
        it('मोदक', 'modak', 'modak', { note: 'Sweet dumpling, Ganpati’s favorite' }),
      ],
      phrases: [
        it('दिवाळीच्या हार्दिक शुभेच्छा!', 'divaaleechyaa haardik shubhechchhaa!', 'Happy Diwali!'),
        it('गणपती बाप्पा मोरया!', 'ganapatee baappaa moryaa!', 'Hail Ganpati Bappa!'),
        it('मला मोदक खूप आवडतात.', 'malaa modak khoop aavadtaat.', 'I like modak a lot.'),
        it('दिवाळी हा खूप मोठा सण आहे.', 'divaalee haa khoop mothaa san aahe.', 'Diwali is a very big festival.'),
        it('पुण्यात गणेशोत्सव खूप मोठा असतो.', 'punyaat ganeshotsav khoop mothaa asto.', 'In Pune, Ganeshotsav is huge.', { note: 'गणेशोत्सव = the Ganpati festival' }),
      ],
    },
    {
      id: 'mr-5-5',
      title: 'Sweet words',
      tip: {
        title: 'Just between you two',
        body: [
          'With your partner, use the casual **तू**: **तू खूप छान आहेस**. Keep these for them, not for their parents.',
          'If she says it first, answer **माझंही तुझ्यावर प्रेम आहे** (“I love you too”).',
        ],
      },
      words: [
        it('प्रेम', 'prem', 'love'),
        it('आठवण', 'aathvan', 'memory', { alsoEn: ['missing'], note: 'आठवण येते = I miss' }),
        it('तुझी', 'tujhee', 'your', { register: 'casual', note: 'With feminine words like आठवण' }),
        it('तुझ्यावर', 'tujhyaavar', 'on you', { register: 'casual' }),
        it('सुंदर', 'sundar', 'beautiful'),
      ],
      phrases: [
        it('मला तुझी आठवण येते.', 'malaa tujhee aathvan yete.', 'I miss you.', { register: 'casual' }),
        it('तू खूप छान आहेस.', 'too khoop chhaan aahes.', 'You are wonderful.', { register: 'casual' }),
        it('माझं तुझ्यावर प्रेम आहे.', 'maajha tujhyaavar prem aahe.', 'I love you.', { register: 'casual' }),
        it('तू खूप सुंदर आहेस.', 'too khoop sundar aahes.', 'You are very beautiful.', { register: 'casual' }),
        it('तुझी खूप आठवण आली.', 'tujhee khoop aathvan aalee.', 'I missed you a lot.', { register: 'casual' }),
      ],
    },
  ],
}
