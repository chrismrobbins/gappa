import type { Unit } from '../../types'
import { it } from '../item'

// Unit 2 — food and chai, Pune-standard Marathi.

export const unit2: Unit = {
  id: 'mr-u2',
  title: 'Food & chai',
  nativeTitle: 'चहा आणि खाणं',
  lessons: [
    {
      id: 'mr-2-1',
      title: 'Chai time',
      tip: {
        title: 'Wanting things',
        body: [
          '“I want” is **मला … हवा / हवी / हवं**: the ending matches the thing you want. **चहा** takes **हवा**, **कॉफी** and **साखर** take **हवी**, **पाणी** and **दूध** take **हवं**.',
          '**नको** means “I don’t want it”. It never changes, and it is the polite way to say no thanks.',
        ],
        examples: [it('दूध हवं का?', 'doodh hava kaa?', 'Do you want milk?')],
      },
      words: [
        it('चहा', 'chahaa', 'tea', { alsoEn: ['chai'] }),
        it('कॉफी', 'kofee', 'coffee'),
        it('पाणी', 'paanee', 'water'),
        it('दूध', 'doodh', 'milk'),
        it('साखर', 'saakhar', 'sugar'),
        it('हवा', 'havaa', 'wanted', { alsoEn: ['want', 'need'], note: 'For masculine things like चहा' }),
        it('नको', 'nako', 'no thanks', { alsoEn: ['don’t want'] }),
      ],
      phrases: [
        it('तुम्हाला चहा हवा का?', 'tumhaalaa chahaa havaa kaa?', 'Would you like tea?', { register: 'polite' }),
        it('तुला कॉफी हवी का?', 'tulaa kofee havee kaa?', 'Do you want coffee?', { register: 'casual' }),
        it('मला पाणी हवं.', 'malaa paanee hava.', 'I would like water.'),
        it('चहात साखर नको.', 'chahaat saakhar nako.', 'No sugar in the tea.'),
        it('मला कॉफी नको, चहा हवा.', 'malaa kofee nako, chahaa havaa.', 'I don’t want coffee, I want tea.'),
      ],
    },
    {
      id: 'mr-2-2',
      title: 'Home food',
      tip: {
        title: 'A home meal',
        body: [
          'A typical Maharashtrian meal is **वरण भात**, **पोळी** and **भाजी**. **वरण** is plain dal; **आमटी** is a spicier, tangier one.',
          '**जेवण** means both “meal” and “food”. To ask someone if they have eaten: **जेवलात का?**',
        ],
      },
      words: [
        it('जेवण', 'jevan', 'meal', { alsoEn: ['food', 'lunch', 'dinner'] }),
        it('भात', 'bhaat', 'rice'),
        it('पोळी', 'polee', 'chapati', { alsoEn: ['roti'] }),
        it('भाजी', 'bhaajee', 'vegetable dish', { alsoEn: ['vegetable'] }),
        it('वरण', 'varan', 'plain dal'),
        it('आमटी', 'aamtee', 'spiced dal', { alsoEn: ['curry'] }),
        it('आणि', 'aani', 'and'),
      ],
      phrases: [
        it('जेवण तयार आहे.', 'jevan tayaar aahe.', 'The meal is ready.'),
        it('वरण भात आणि पोळी.', 'varan bhaat aani polee.', 'Dal, rice and chapati.'),
        it('आज भाजी काय आहे?', 'aaj bhaajee kaay aahe?', 'What is the vegetable today?'),
        it('तुम्ही जेवलात का?', 'tumhee jevlaat kaa?', 'Have you eaten?', { register: 'polite' }),
        it('हो, मी जेवलो.', 'ho, mee jevlo.', 'Yes, I have eaten.'),
      ],
    },
    {
      id: 'mr-2-3',
      title: 'Tastes & likes',
      tip: {
        title: 'Liking things',
        body: [
          '“I like” is **मला … आवडतं**: “to me … is liked”. It agrees with the thing: **मला चहा आवडतो**, **मला भाजी आवडते**, **मला गोड आवडतं**. Plural: **मला पोहे आवडतात**.',
          'To say you don’t like something: **आवडत नाही**.',
        ],
      },
      words: [
        it('गोड', 'god', 'sweet'),
        it('तिखट', 'tikhat', 'spicy'),
        it('छान', 'chhaan', 'nice', { alsoEn: ['good', 'lovely'] }),
        it('खूप', 'khoop', 'very', { alsoEn: ['a lot', 'very much'] }),
        it('मस्त', 'mast', 'awesome', { alsoEn: ['great', 'excellent'], note: 'Very common, casual' }),
        it('आवडतं', 'aavadta', 'liked', { note: 'मला … आवडतं = I like …' }),
      ],
      phrases: [
        it('मला चहा आवडतो.', 'malaa chahaa aavadto.', 'I like tea.'),
        it('मला गोड आवडतं.', 'malaa god aavadta.', 'I like sweet things.'),
        it('मला तिखट आवडत नाही.', 'malaa tikhat aavadat naahee.', 'I don’t like spicy food.'),
        it('भाजी खूप छान आहे.', 'bhaajee khoop chhaan aahe.', 'The vegetable dish is very good.'),
        it('हे खूप तिखट आहे!', 'he khoop tikhat aahe!', 'This is very spicy!'),
      ],
    },
    {
      id: 'mr-2-4',
      title: 'Eating out in Pune',
      tip: {
        title: 'Street food',
        body: [
          'Pune’s classics: **मिसळ पाव** (spicy sprouts curry with bread), **वडापाव** and **पोहे**. Order with **द्या** (“give”): **एक मिसळ पाव द्या**.',
          'To ask for the bill, say **बिल किती झालं?** or just **किती झाले?** (“how much has it come to?”).',
        ],
      },
      words: [
        it('मिसळ पाव', 'misal paav', 'misal pav', { note: 'Spicy sprout curry with bread' }),
        it('वडापाव', 'vadaapaav', 'vada pav'),
        it('पोहे', 'pohe', 'poha', { note: 'Flattened-rice breakfast' }),
        it('रुपये', 'rupaye', 'rupees'),
        it('बिल', 'bil', 'bill'),
        it('द्या', 'dyaa', 'give', { alsoEn: ['please give'], register: 'polite' }),
      ],
      phrases: [
        it('एक मिसळ पाव द्या.', 'ek misal paav dyaa.', 'One misal pav, please.'),
        it('दोन पोहे द्या.', 'don pohe dyaa.', 'Two plates of poha, please.'),
        it('बिल किती झालं?', 'bil kitee jhala?', 'How much is the bill?'),
        it('शंभर रुपये झाले.', 'shambhar rupaye jhaale.', 'That comes to a hundred rupees.', { note: 'शंभर = 100' }),
        it('मला पोहे आवडतात.', 'malaa pohe aavadtaat.', 'I like poha.'),
      ],
    },
    {
      id: 'mr-2-5',
      title: 'Being a guest',
      tip: {
        title: 'Say no twice',
        body: [
          'A Maharashtrian host will keep serving: **अजून थोडं घ्या ना!** It is polite to refuse once or twice, then accept a little.',
          'To stop the serving, say **पुरे** or **बस** (“enough”), and praise the food: **खूप छान झालंय**.',
        ],
      },
      words: [
        it('अजून', 'ajoon', 'more', { alsoEn: ['still', 'yet'] }),
        it('पुरे', 'pure', 'enough'),
        it('बस', 'bas', 'that’s enough', { alsoEn: ['stop'] }),
        it('घ्या', 'ghyaa', 'take', { register: 'polite' }),
        it('पोट भरलं', 'pot bharla', 'I’m full', { note: 'Literally “the stomach is full”' }),
        it('आता', 'aataa', 'now'),
      ],
      phrases: [
        it('अजून थोडं घ्या ना.', 'ajoon thoda ghyaa naa.', 'Please, take a little more.', { register: 'polite' }),
        it('नको, आता पुरे.', 'nako, aataa pure.', 'No thanks, that’s enough now.'),
        it('माझं पोट भरलं.', 'maajha pot bharla.', 'I’m full.'),
        it('आता बस, धन्यवाद.', 'aataa bas, dhanyavaad.', 'That’s enough now, thank you.'),
        it('जेवण खूप छान झालंय.', 'jevan khoop chhaan jhaalay.', 'The meal was really good.'),
      ],
    },
  ],
}
