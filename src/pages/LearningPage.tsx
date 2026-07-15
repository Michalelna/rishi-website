import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { DiamondSymbol, LearningSymbol } from '../components/Symbols'
import ChakraBody from '../components/ChakraBody'

const subNav = [
  'Sanskrit',
  'History',
  'Chakras',
]


interface SanskritWord {
  file: string
  roman: string
  devanagari: string
  translation: string
  stage: string
  short: string
  meaning: string
  tradition: string
}

interface SanskritGroup {
  title: string
  subtitle: string
  words: SanskritWord[]
}

const sanskritGroups: SanskritGroup[] = [
  {
    title: 'Seven Stages of Knowledge',
    subtitle: 'Jnana Bhumikas · Yoga Vasishtha',
    words: [
      {
        file: 'subbecha',
        roman: 'Subhecchā',
        devanagari: 'सुबेच्छा',
        translation: 'Right Aspiration',
        stage: 'Stage I · Jnana Bhumika',
        short: 'The first awakening of genuine desire for liberation.',
        meaning: 'From "su" (right, good) and "icchā" (will, desire). The soul\'s initial turning toward the light — not born of fear or convention, but from a sincere longing for what is real. Subhecchā is the seed: a quiet but unshakeable recognition that something deeper is possible. Without it, all practice is performance.',
        tradition: 'Yoga Vasishtha',
      },
      {
        file: 'vicharana',
        roman: 'Vicharaṇā',
        devanagari: 'विचारण',
        translation: 'Inquiry',
        stage: 'Stage II · Jnana Bhumika',
        short: 'Sustained investigation into the nature of the Self.',
        meaning: 'The practice of turning awareness back upon itself — questioning "Who am I?" not as a riddle but as a living investigation. Vicharaṇā is discriminative, patient, and relentless. It dissolves layer after layer of assumed identity. Where Subhecchā opens the door, Vicharaṇā walks through it.',
        tradition: 'Yoga Vasishtha',
      },
      {
        file: 'viveka',
        roman: 'Viveka',
        devanagari: 'विवेक',
        translation: 'Discernment',
        stage: 'Sadhana Chatushtaya',
        short: 'The eye that sees the real from the unreal.',
        meaning: 'Viveka is the refined capacity to distinguish between the eternal (nitya) and the transient (anitya), between pure awareness and its contents. It is not cynicism or detachment from life — it is clarity. The Bhagavad Gita calls it "the sword of knowledge." One of the four qualifications (Sadhana Chatushtaya) for the study of Vedanta.',
        tradition: 'Advaita Vedanta',
      },
      {
        file: 'mumukshutava',
        roman: 'Mumukṣutva',
        devanagari: 'मुमुक्षुत्व',
        translation: 'Longing for Liberation',
        stage: 'Sadhana Chatushtaya',
        short: 'A burning, existential thirst for freedom.',
        meaning: 'From "mumukṣu" (one who desires liberation) and the suffix "-tva" (the quality of being). This is not casual spiritual interest — it is the fire that cannot be extinguished. Mumukṣutva is what drives the seeker through difficulty, doubt, and monotony. Shankara placed it as the fourth and most essential of the qualifications for Vedanta study, because without it, knowledge becomes a mere hobby.',
        tradition: 'Advaita Vedanta',
      },
      {
        file: 'Asamshakti',
        roman: 'Asaṃsakti',
        devanagari: 'असंसक्ति',
        translation: 'Non-Attachment',
        stage: 'Stage V · Jnana Bhumika',
        short: 'In the world, undisturbed — the lotus on water.',
        meaning: 'From "a" (not) and "saṃsakti" (clinging, sticking). Asaṃsakti does not mean withdrawal from life. It means acting, feeling, and relating fully — while leaving no residue, forming no hook. The practitioner at this stage participates in existence without being enslaved by it. Desires arise and pass like clouds. There is nothing to protect.',
        tradition: 'Yoga Vasishtha',
      },
      {
        file: 'Padarthbhawna',
        roman: 'Padārthabhāvanā',
        devanagari: 'पदार्थभावना',
        translation: 'Clear Seeing',
        stage: 'Stage VI · Jnana Bhumika',
        short: 'Reality perceived without the veil of conditioning.',
        meaning: 'From "padārtha" (the nature of things, objects of experience) and "bhāvanā" (contemplation, reflection). At this stage the practitioner sees all phenomena with the same transparent, non-distorting awareness — as if for the first time, every time. Personal history no longer colours perception. The world is not rejected; it is seen for what it is: luminous, empty, and whole.',
        tradition: 'Yoga Vasishtha',
      },
      {
        file: 'Turiya',
        roman: 'Turīya',
        devanagari: 'तुरीय',
        translation: 'The Fourth State',
        stage: 'Mandukya Upanishad',
        short: 'The witness beneath waking, dreaming, and sleep.',
        meaning: 'Sanskrit for "the fourth" — not a state one enters, but the ever-present ground that contains all states. Waking (jagrat), dreaming (svapna), and deep sleep (sushupti) arise and dissolve within Turīya like waves in an ocean. The Mandukya Upanishad describes it as neither outward-turned nor inward-turned, neither cognitive nor non-cognitive — it is pure consciousness itself, the silence in which all sound occurs.',
        tradition: 'Mandukya Upanishad',
      },
    ],
  },
  {
    title: 'Kleśhas & Obstacles',
    subtitle: 'Afflictions of the Mind · Yoga Sutras of Patanjali',
    words: [
      {
        file: 'avidya',
        roman: 'Avidyā',
        devanagari: 'अविद्या',
        translation: 'Ignorance',
        stage: 'Kleśha I · Yoga Sutras 2.3',
        short: 'The root affliction — mistaking the impermanent for the permanent.',
        meaning: 'From "a" (not) and "vidyā" (knowledge, wisdom). Avidyā is not mere lack of information — it is a fundamental misperception: taking the body for the Self, the impermanent for the eternal, pleasure for truth. Patanjali names it the field in which all other afflictions grow. Without uprooting avidyā, no transformation is lasting.',
        tradition: 'Yoga Sutras',
      },
      {
        file: 'mlkalesh',
        roman: 'Mūla Kleśa',
        devanagari: 'मूल क्लेश',
        translation: 'Root Affliction',
        stage: 'Kleśha · Yoga Sutras 2.3',
        short: 'The five afflictions that veil the luminosity of pure awareness.',
        meaning: 'Kleśa means "that which causes suffering." Patanjali names five: avidyā (ignorance), asmitā (ego-identification), rāga (attachment), dveṣa (aversion), and abhiniveśa (clinging to life). They are called "root" because they are not random — they form a causal chain rooted in avidyā. Yoga practice systematically thins and eventually burns these seeds so they cannot sprout.',
        tradition: 'Yoga Sutras',
      },
      {
        file: 'raga',
        roman: 'Rāga',
        devanagari: 'राग',
        translation: 'Attachment',
        stage: 'Kleśha III · Yoga Sutras 2.7',
        short: 'The pull toward pleasure — the hook that binds.',
        meaning: 'From the root "rañj" (to be coloured, to be attracted). Rāga is the compulsive movement of the mind toward what has brought pleasure before — the assumption that repeating an experience will repeat its joy. Patanjali says rāga follows sukha (pleasure) the way a shadow follows a form. It creates attachment to outcomes and poisons the present moment with craving.',
        tradition: 'Yoga Sutras',
      },
      {
        file: 'pratigha',
        roman: 'Pratigha / Dveṣa',
        devanagari: 'प्रतिघ',
        translation: 'Aversion',
        stage: 'Kleśha IV · Yoga Sutras 2.8',
        short: 'The repulsion toward pain — the opposite face of craving.',
        meaning: 'Pratigha (resistance, hostility) is the movement away from what has caused pain — the mind\'s refusal. Like rāga, it is based in memory and projection. Dveṣa means "that which is disliked." Together, rāga and dveṣa form the oscillation at the heart of ordinary suffering: the mind swinging between desire and aversion, never settled, never free.',
        tradition: 'Yoga Sutras',
      },
      {
        file: 'vicikitsa',
        roman: 'Vicikitsā',
        devanagari: 'विचिकित्सा',
        translation: 'Doubt',
        stage: 'Antarāya · Yoga Sutras 1.30',
        short: 'The doubt that paralyses practice and scatters the mind.',
        meaning: 'One of the nine obstacles (antarāyas) that Patanjali lists in Yoga Sutras 1.30. Vicikitsā is not healthy philosophical inquiry — it is the corrosive doubt that undermines commitment: "Is this path real? Am I capable? Does it matter?" It scatters energy and delays. The antidote is prasāda (clarity of mind) cultivated through steady, unbroken practice.',
        tradition: 'Yoga Sutras',
      },
      {
        file: 'mana',
        roman: 'Manas',
        devanagari: 'मनस्',
        translation: 'Mind',
        stage: 'Antaḥkaraṇa · Samkhya Philosophy',
        short: 'The sensory-cognitive mind that processes and responds.',
        meaning: 'In Samkhya-Yoga philosophy, the inner instrument (antaḥkaraṇa) has four aspects: manas (the sensory-processing mind), ahamkāra (ego/I-making), buddhi (discriminative intellect), and citta (the storehouse of impressions). Manas is the gatekeeper — it receives the raw data of experience from the senses and passes it inward. Yoga is, in part, the art of training manas so it serves buddhi rather than the senses.',
        tradition: 'Samkhya-Yoga',
      },
      {
        file: 'drishti',
        roman: 'Dṛṣṭi',
        devanagari: 'दृष्टि',
        translation: 'Gazing Point',
        stage: 'Ashtanga Vinyasa · Sixth Limb',
        short: 'Where the eyes rest — where the mind follows.',
        meaning: 'From the root "dṛś" (to see). In Ashtanga Vinyasa yoga, each posture has a prescribed dṛṣṭi — a point of focus for the gaze: the tip of the nose, the navel, the thumb, the horizon. The principle is that vision stabilises attention. When the eyes wander, the mind scatters. When the gaze is steady, the mind becomes single-pointed. Dṛṣṭi is an outer form of dharana — concentration made visible.',
        tradition: 'Ashtanga Vinyasa',
      },
      {
        file: 'sanskar',
        roman: 'Saṃskāra',
        devanagari: 'संस्कार',
        translation: 'Mental Impression',
        stage: 'Citta · Yoga Sutras 1.50',
        short: 'The grooves carved in the mind by repeated experience.',
        meaning: 'From "sam" (complete, well) and "kāra" (doing, making). Saṃskāras are the subtle imprints left in consciousness by every thought, action, and experience. They accumulate as vāsanās (tendencies) and determine the patterns we repeat. Yoga works at the level of saṃskāra: not just changing behaviour, but changing the deep grooves from which behaviour arises. The final stages of samādhi are said to create a saṃskāra that destroys all other saṃskāras.',
        tradition: 'Yoga Sutras',
      },
    ],
  },
  {
    title: 'The Eight Limbs',
    subtitle: 'Ashtanga Yoga · Patanjali\'s Yoga Sutras',
    words: [
      {
        file: 'niyamas',
        roman: 'Niyama',
        devanagari: 'नियम',
        translation: 'Personal Observances',
        stage: 'Second Limb · Ashtanga',
        short: 'Five inner disciplines that purify the practitioner.',
        meaning: 'The niyamas are the second limb of Patanjali\'s Ashtanga — turned inward where the yamas face outward. The five are: saucha (purity), santosha (contentment), tapas (disciplined effort), svādhyāya (self-study), and Ishvara pranidhāna (surrender to the Divine). Together they constitute a complete inner curriculum: cleanse, be content, burn, study, and release. Each builds on the last.',
        tradition: 'Yoga Sutras',
      },
      {
        file: 'saucha',
        roman: 'Śauca',
        devanagari: 'शौच',
        translation: 'Purity',
        stage: 'Niyama I · Yoga Sutras 2.40',
        short: 'Cleanliness of body, environment, and mind.',
        meaning: 'The first niyama. Śauca refers to inner and outer purity: clean food, a clean body, a clean space — and beyond that, a mind uncontaminated by resentment, envy, and ill-will. Patanjali says that through śauca comes distaste for one\'s own body and non-contact with others\' bodies — not as ascetic rejection, but as the natural result of seeing clearly what is impermanent. A pure vessel is necessary for subtle energy to flow unobstructed.',
        tradition: 'Yoga Sutras',
      },
      {
        file: 'santosh',
        roman: 'Santoṣa',
        devanagari: 'संतोष',
        translation: 'Contentment',
        stage: 'Niyama II · Yoga Sutras 2.42',
        short: 'The radical acceptance of what is — the end of craving.',
        meaning: 'From "sam" (completely) and "tuṣ" (to be satisfied). Santoṣa is not passive resignation — it is an active, deliberate embrace of the present moment as it is. Patanjali says supreme happiness (anuttama sukha) arises from santoṣa. In a culture of perpetual upgrade and improvement, contentment is a revolutionary act. It does not prevent growth; it removes the suffering that comes from insisting things be other than they are.',
        tradition: 'Yoga Sutras',
      },
      {
        file: 'tapas',
        roman: 'Tapas',
        devanagari: 'तपस्',
        translation: 'Disciplined Effort',
        stage: 'Niyama III · Yoga Sutras 2.43',
        short: 'The heat of sustained practice that burns impurity.',
        meaning: 'From the root "tap" (to heat, to burn). Tapas is the willingness to endure difficulty in the service of transformation. Not mortification for its own sake, but the deliberate choosing of challenge: early mornings on the mat, silence when speech would be easier, simplicity when indulgence is available. Patanjali says tapas destroys impurity and perfects the body and senses. The Bhagavad Gita speaks of tapas of body, speech, and mind as the threefold austerity.',
        tradition: 'Yoga Sutras',
      },
      {
        file: 'svadhaya',
        roman: 'Svādhyāya',
        devanagari: 'स्वाध्याय',
        translation: 'Self-Study',
        stage: 'Niyama IV · Yoga Sutras 2.44',
        short: 'Study of sacred texts and study of oneself.',
        meaning: 'From "sva" (self) and "adhyāya" (study, lesson). Svādhyāya is the practice of turning learning back upon the learner. It means reading the sacred texts — the Upanishads, the Gita, the Sutras — not for information but for transformation. And beyond texts, it means watching oneself: noticing the habitual patterns of thought and reaction without flinching. Through svādhyāya comes communion with one\'s chosen deity, says Patanjali.',
        tradition: 'Yoga Sutras',
      },
      {
        file: 'ishwar-pranidhana',
        roman: 'Īśvara Praṇidhāna',
        devanagari: 'ईश्वर प्रणिधान',
        translation: 'Surrender to the Divine',
        stage: 'Niyama V · Yoga Sutras 2.45',
        short: 'The offering of all action and its fruit to the highest.',
        meaning: 'From "Īśvara" (the Lord, pure consciousness untouched by affliction) and "praṇidhāna" (dedication, laying down before). Patanjali presents Ishvara Pranidhana in two contexts: as the fifth niyama, and as a direct path to samādhi (1.23). It means ceasing to be the author of one\'s actions — offering effort, outcome, and ego to something larger. In the Gita\'s language: act fully, attach to nothing.',
        tradition: 'Yoga Sutras',
      },
      {
        file: 'asana',
        roman: 'Āsana',
        devanagari: 'आसन',
        translation: 'Posture',
        stage: 'Third Limb · Yoga Sutras 2.46',
        short: 'A steady, comfortable seat — the foundation of practice.',
        meaning: 'From the root "as" (to sit, to be present). Patanjali\'s definition of āsana is simply: "sthira sukham āsanam" — posture is steady and comfortable. The vast physical vocabulary of modern yoga springs from this seed. But at its root, āsana is not acrobatics — it is the art of finding ease within structure, stillness within form. When āsana is mastered, the pairs of opposites cease to disturb.',
        tradition: 'Yoga Sutras',
      },
      {
        file: 'pranayama',
        roman: 'Prāṇāyāma',
        devanagari: 'प्राणायाम',
        translation: 'Breath Extension',
        stage: 'Fourth Limb · Yoga Sutras 2.49',
        short: 'The regulation of life-force through conscious breathing.',
        meaning: 'From "prāṇa" (life-force, breath) and "āyāma" (extension, expansion — not merely control). Prāṇāyāma works on the bridge between body and mind: the breath. When the breath is agitated, the mind is agitated. When the breath is slow, deep, and even, the mind follows. Patanjali says prāṇāyāma dissolves the veil covering the inner light. The classical forms — kumbhaka (retention), pūraka (inhalation), recaka (exhalation) — are each instruments of awareness.',
        tradition: 'Yoga Sutras',
      },
      {
        file: 'pratyahar',
        roman: 'Pratyāhāra',
        devanagari: 'प्रत्याहार',
        translation: 'Withdrawal of the Senses',
        stage: 'Fifth Limb · Yoga Sutras 2.54',
        short: 'Turning the senses inward — the threshold of meditation.',
        meaning: 'From "prati" (against, back) and "āhāra" (food, nourishment). Pratyāhāra is the reversal of the senses\' outward flow — not suppression, but redirection. The analogy Patanjali gives: as a tortoise withdraws its limbs into its shell. The senses no longer drag the mind outward; instead they follow the mind\'s direction. Pratyāhāra is the bridge between the outer limbs (yama, niyama, āsana, prāṇāyāma) and the inner limbs (dharaṇā, dhyāna, samādhi).',
        tradition: 'Yoga Sutras',
      },
      {
        file: 'dharana',
        roman: 'Dhāraṇā',
        devanagari: 'धारणा',
        translation: 'Concentration',
        stage: 'Sixth Limb · Yoga Sutras 3.1',
        short: 'The binding of attention to a single point.',
        meaning: 'From "dhṛ" (to hold, to support). Dhāraṇā is the practice of fixing the mind upon a single object — a flame, a mantra, a bodily centre, a concept — and returning to it each time attention drifts. It is the beginning of the inner limbs (antaraṅga sādhanā). The gap between pratyāhāra and dhāraṇā is the gap between not being pulled outward and actively directing inward. Effort is still present; the concentration is still intentional.',
        tradition: 'Yoga Sutras',
      },
      {
        file: 'dhyana',
        roman: 'Dhyāna',
        devanagari: 'ध्यान',
        translation: 'Meditation',
        stage: 'Seventh Limb · Yoga Sutras 3.2',
        short: 'The unbroken flow of attention — concentration become effortless.',
        meaning: 'Where dhāraṇā is the act of fixing the mind, dhyāna is when that fixing becomes unbroken — a continuous, uninterrupted flow of awareness toward the object. There is no longer the effortful returning; the mind rests in an unfluctuating stream. The meditator, the act of meditating, and the object of meditation begin to merge at the edges. Dhyāna is not something one does — it is what practice makes possible.',
        tradition: 'Yoga Sutras',
      },
      {
        file: 'samadhi',
        roman: 'Samādhi',
        devanagari: 'समाधि',
        translation: 'Union',
        stage: 'Eighth Limb · Yoga Sutras 3.3',
        short: 'The dissolution of the meditator into the object of meditation.',
        meaning: 'From "sam" (together, completely) and "ādhi" (placing, putting). Samādhi is the culmination of the eight-limbed path — and also its most misunderstood. It is not a trance or blankness, but the luminous state in which the sense of a separate self dissolves into pure awareness. Patanjali distinguishes many grades: samprajñāta (with object) and asamprajñāta (without object). Ultimately, kaivalya — aloneness, freedom — is what Samādhi opens into.',
        tradition: 'Yoga Sutras',
      },
      {
        file: 'asteya',
        roman: 'Asteya',
        devanagari: 'अस्तेय',
        translation: 'Non-Stealing',
        stage: 'Yama III · Yoga Sutras 2.37',
        short: 'Refraining from taking what is not freely given.',
        meaning: 'From "a" (not) and "steya" (stealing). Asteya goes beyond the obvious prohibition. It includes not stealing time, attention, ideas, energy, or credit. And more subtly: not coveting — not allowing desire for what belongs to another to colour perception. Patanjali says when asteya is established, all jewels present themselves. The logic is energetic: the one who truly does not take creates a field that invites abundance.',
        tradition: 'Yoga Sutras',
      },
      {
        file: 'aparigraha',
        roman: 'Aparigraha',
        devanagari: 'अपरिग्रह',
        translation: 'Non-Possessiveness',
        stage: 'Yama V · Yoga Sutras 2.39',
        short: 'Holding lightly — not clinging to what has been given.',
        meaning: 'From "a" (not) and "parigraha" (grasping, hoarding, possessing). Aparigraha is the fifth yama and in many ways the most comprehensive. It addresses the mind\'s tendency to accumulate: objects, relationships, identities, memories. When aparigraha is established, Patanjali says, there arises knowledge of the how and why of birth — the practitioner sees clearly the patterns of karma and conditioning that shape life. Non-grasping opens the deepest understanding.',
        tradition: 'Yoga Sutras',
      },
      {
        file: 'satya',
        roman: 'Satya',
        devanagari: 'सत्य',
        translation: 'Truthfulness',
        stage: 'Yama II · Yoga Sutras 2.36',
        short: 'Alignment between thought, word, and action.',
        meaning: 'From "sat" (that which is, truth, being). Satya is not just speaking facts — it is the alignment of inner experience with outer expression. It requires first knowing what is true within (which takes pratyāhāra and dhyāna), and then speaking and acting from that knowing without distortion. The classical teaching: when satya is rooted, whatever the sage speaks becomes true. Words carry power when they carry truth.',
        tradition: 'Yoga Sutras',
      },
    ],
  },
]

function WordCard({
  word, isActive, isHovered, anyHovered,
  onActivate, onHover, onHoverEnd,
  enterDelay,
}: {
  word: SanskritWord
  idx: number
  isActive: boolean
  isHovered: boolean
  anyHovered: boolean
  onActivate: () => void
  onHover: () => void
  onHoverEnd: () => void
  enterDelay: number
}) {
  const dim = anyHovered && !isHovered && !isActive

  const imgFilter = isActive
    ? 'invert(1) sepia(0.65) saturate(4) brightness(1.05)'
    : isHovered
      ? 'invert(1) sepia(0.5) saturate(3) brightness(1)'
      : 'invert(1) sepia(0.25) saturate(1.4) brightness(0.62)'

  return (
    <motion.button
      onClick={onActivate}
      onHoverStart={onHover}
      onHoverEnd={onHoverEnd}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: dim ? 0.32 : 1, y: 0 }}
      whileTap={{ scale: 0.97 }}
      transition={{ delay: enterDelay, duration: 0.45, opacity: { duration: 0.2 } }}
      style={{
        position: 'relative',
        background: isActive ? 'rgba(201,169,110,0.07)' : 'transparent',
        border: `1px solid ${isActive ? 'rgba(201,169,110,0.45)' : isHovered ? 'rgba(201,169,110,0.2)' : 'rgba(245,240,232,0.05)'}`,
        cursor: 'pointer',
        padding: '20px 16px 16px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 0,
        overflow: 'hidden',
        transition: 'border-color 0.3s, background 0.3s',
      } as React.CSSProperties}
    >
      {/* Active top accent bar */}
      <motion.div
        animate={{ scaleX: isActive ? 1 : 0, opacity: isActive ? 1 : 0 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        style={{
          position: 'absolute', top: 0, left: 0, right: 0,
          height: 2, background: 'rgba(201,169,110,0.7)',
          transformOrigin: 'left',
        }}
      />

      {/* Hover background shimmer */}
      <motion.div
        animate={{ opacity: isHovered && !isActive ? 1 : 0 }}
        transition={{ duration: 0.25 }}
        style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: 'radial-gradient(ellipse at 50% 30%, rgba(201,169,110,0.08) 0%, transparent 70%)',
        }}
      />

      {/* Calligraphy image */}
      <div style={{ height: 80, display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', marginBottom: 10 }}>
        <motion.img
          src={`/sanskrit/${word.file}.png`}
          alt={word.devanagari}
          animate={{ scale: isActive ? 1.06 : isHovered ? 1.04 : 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 22 }}
          style={{
            maxHeight: 72, maxWidth: '100%', objectFit: 'contain',
            filter: imgFilter,
            transition: 'filter 0.35s ease',
          }}
        />
      </div>

      {/* Roman name */}
      <span style={{
        fontFamily: "'Cormorant Garamond', serif",
        fontSize: 13,
        fontWeight: isActive ? 400 : 300,
        letterSpacing: '0.04em',
        color: isActive ? 'rgba(245,240,232,0.95)' : isHovered ? 'rgba(245,240,232,0.85)' : 'rgba(245,240,232,0.68)',
        textAlign: 'center',
        lineHeight: 1.2,
        transition: 'color 0.25s',
        marginBottom: 4,
      }}>
        {word.roman}
      </span>

      {/* Translation — slides in on hover */}
      <motion.span
        animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 4 }}
        transition={{ duration: 0.2 }}
        style={{
          fontFamily: "'Raleway', sans-serif",
          fontSize: 9,
          fontWeight: 300,
          letterSpacing: '0.02em',
          color: 'rgba(201,169,110,0.92)',
          textAlign: 'center',
          lineHeight: 1.5,
        }}
      >
        {word.translation}
      </motion.span>
    </motion.button>
  )
}

function SanskritDictionary() {
  const [active, setActive] = useState<number>(0)
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null)

  let globalIndex = 0

  return (
    <div style={{ padding: '64px 80px 120px' }}>
      {/* Page header */}
      <div style={{ marginBottom: 72 }}>
        <p style={{
          fontFamily: "'Raleway', sans-serif", fontSize: 10, fontWeight: 300,
          letterSpacing: '0.4em', color: 'rgba(201,169,110,0.95)',
          textTransform: 'uppercase', marginBottom: 16,
        }}>Sacred Language</p>
        <h2 style={{
          fontFamily: "'Cormorant Garamond', serif", fontSize: 42, fontWeight: 300,
          letterSpacing: '0.05em', color: 'rgba(245,240,232,0.9)', marginBottom: 16,
        }}>Sanskrit Dictionary</h2>
        <p style={{
          fontFamily: "'Cormorant Garamond', serif", fontSize: 17, fontWeight: 300,
          fontStyle: 'italic', color: 'rgba(245,240,232,0.90)', maxWidth: 560, lineHeight: 1.8,
        }}>
          Thirty words from the Yoga Vasishtha, the Yoga Sutras, and Advaita Vedanta — rendered in classical calligraphy.
        </p>
      </div>

      {sanskritGroups.map((group) => {
        const groupStart = globalIndex
        globalIndex += group.words.length
        const activeInGroup = active >= groupStart && active < groupStart + group.words.length
        const activeWord = activeInGroup ? group.words[active - groupStart] : null

        return (
          <div key={group.title} style={{ marginBottom: 80 }}>
            {/* Group header */}
            <div style={{ marginBottom: 28, paddingBottom: 20, borderBottom: '1px solid rgba(201,169,110,0.16)' }}>
              <h3 style={{
                fontFamily: "'Cormorant Garamond', serif", fontSize: 28, fontWeight: 300,
                letterSpacing: '0.06em', color: 'rgba(245,240,232,0.95)', marginBottom: 6,
              }}>{group.title}</h3>
              <p style={{
                fontFamily: "'Raleway', sans-serif", fontSize: 9, fontWeight: 300,
                letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(201,169,110,0.91)',
              }}>{group.subtitle}</p>
            </div>

            {/* Thumbnail grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
              gap: 3,
              marginBottom: 3,
            }}>
              {group.words.map((word, i) => {
                const idx = groupStart + i
                return (
                  <WordCard
                    key={word.file}
                    word={word}
                    idx={idx}
                    isActive={active === idx}
                    isHovered={hoveredIdx === idx}
                    anyHovered={hoveredIdx !== null}
                    onActivate={() => setActive(idx)}
                    onHover={() => setHoveredIdx(idx)}
                    onHoverEnd={() => setHoveredIdx(null)}
                    enterDelay={i * 0.04}
                  />
                )
              })}
            </div>

            {/* Detail panel */}
            <AnimatePresence mode="wait">
              {activeWord && (
                <motion.div
                  key={active}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8, transition: { duration: 0.18 } }}
                  transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1.8fr',
                    border: '1px solid rgba(201,169,110,0.18)',
                    background: 'linear-gradient(135deg, rgba(0,0,0,0.28) 0%, rgba(201,169,110,0.03) 100%)',
                    minHeight: 480,
                    overflow: 'hidden',
                  }}
                >
                  {/* Left: large calligraphy */}
                  <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    padding: '48px 40px',
                    borderRight: '1px solid rgba(201,169,110,0.13)',
                    background: 'rgba(0,0,0,0.18)',
                    position: 'relative',
                    overflow: 'hidden',
                  }}>
                    {/* Ambient glow behind image */}
                    <div style={{
                      position: 'absolute', inset: 0, pointerEvents: 'none',
                      background: 'radial-gradient(ellipse at center, rgba(201,169,110,0.08) 0%, transparent 65%)',
                    }} />
                    <motion.img
                      key={activeWord.file}
                      src={`/sanskrit/${activeWord.file}.png`}
                      alt={activeWord.devanagari}
                      initial={{ opacity: 0, scale: 0.84 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                      style={{
                        width: '100%', maxWidth: 300, position: 'relative', zIndex: 1,
                        filter: 'invert(1) sepia(0.55) saturate(3.2) brightness(0.95)',
                        mixBlendMode: 'screen',
                      }}
                    />
                  </div>

                  {/* Right: staggered definition */}
                  <div style={{ padding: '48px 56px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <motion.p
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.05, duration: 0.35 }}
                      style={{
                        fontFamily: "'Raleway', sans-serif", fontSize: 9, fontWeight: 300,
                        letterSpacing: '0.35em', color: 'rgba(201,169,110,0.86)',
                        textTransform: 'uppercase', marginBottom: 16,
                      }}
                    >{activeWord.stage}</motion.p>

                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1, duration: 0.4 }}
                      style={{ display: 'flex', alignItems: 'baseline', gap: 24, marginBottom: 8, flexWrap: 'wrap' }}
                    >
                      <h3 style={{
                        fontFamily: "'Cormorant Garamond', serif", fontSize: 72, fontWeight: 300,
                        letterSpacing: '0.02em', color: 'rgba(245,240,232,0.95)', lineHeight: 1,
                      }}>{activeWord.roman}</h3>
                      <span style={{
                        fontFamily: "'Cormorant Garamond', serif", fontSize: 28, fontWeight: 300,
                        fontStyle: 'italic', color: 'rgba(245,240,232,0.74)',
                      }}>{activeWord.devanagari}</span>
                    </motion.div>

                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.15, duration: 0.35 }}
                      style={{
                        fontFamily: "'Raleway', sans-serif", fontSize: 11, fontWeight: 300,
                        letterSpacing: '0.3em', color: 'rgba(201,169,110,0.92)',
                        textTransform: 'uppercase', marginBottom: 32,
                      }}
                    >{activeWord.translation}</motion.p>

                    {/* Divider line — animates width */}
                    <motion.div
                      initial={{ width: 0, opacity: 0 }}
                      animate={{ width: 36, opacity: 1 }}
                      transition={{ delay: 0.2, duration: 0.45, ease: 'easeOut' }}
                      style={{ height: 1, background: 'rgba(201,169,110,0.4)', marginBottom: 28 }}
                    />

                    <motion.p
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.25, duration: 0.45 }}
                      style={{
                        fontFamily: "'Cormorant Garamond', serif", fontSize: 20, fontWeight: 300,
                        fontStyle: 'italic', lineHeight: 1.9, color: 'rgba(245,240,232,0.89)',
                        marginBottom: 32, maxWidth: 520,
                      }}
                    >{activeWord.meaning}</motion.p>

                    <motion.span
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.35, duration: 0.35 }}
                      style={{
                        fontFamily: "'Raleway', sans-serif", fontSize: 9, fontWeight: 300,
                        letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(201,169,110,0.87)',
                        border: '1px solid rgba(201,169,110,0.18)', padding: '4px 12px', alignSelf: 'flex-start',
                      }}
                    >{activeWord.tradition}</motion.span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )
      })}
    </div>
  )
}

export default function LearningPage() {
  const [activeNav, setActiveNav] = useState(0)

  const isSanskrit = activeNav === 0
  const isHistory = activeNav === 1
  const isChakras = activeNav === 2

  return (
    <div style={{ background: '#1c1820', minHeight: '100vh' }}>
      {/* Hero */}
      <div style={{
        position: 'relative',
        height: '60vh',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'flex-end',
      }}>
        <motion.div
          layoutId="panel-bg-learning"
          transition={{ type: 'spring', stiffness: 70, damping: 18, mass: 1 }}
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url(https://images.unsplash.com/photo-1571844088753-73ca0880bcd9?w=1200&q=55&fit=crop&fm=webp)`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, rgba(10,6,2,0.78) 60%, #1c1820 100%)',
        }} />

        <motion.h1
          layoutId="panel-label-learning"
          transition={{ type: 'spring', stiffness: 70, damping: 18, mass: 1 }}
          animate={{ opacity: 1 }}
          style={{
            position: 'absolute',
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 'clamp(80px, 15vw, 200px)',
            fontWeight: 300,
            letterSpacing: '0.15em',
            color: 'rgba(245,240,232,0.1)',
            userSelect: 'none',
            pointerEvents: 'none',
            lineHeight: 1,
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            whiteSpace: 'nowrap',
          }}
        >
          LEARNING
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 1.6, ease: 'easeOut' }}
          style={{
            position: 'absolute',
            top: -40,
            right: -40,
            zIndex: 2,
            pointerEvents: 'none',
          }}
        >
          <LearningSymbol size={480} color="rgba(201,169,110,0.12)" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3, ease: 'easeOut' }}
          style={{
            position: 'relative',
            zIndex: 2,
            padding: '0 80px 48px',
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
          }}
        >
          <span style={{
            fontFamily: "'Raleway', sans-serif",
            fontSize: 11,
            fontWeight: 300,
            letterSpacing: '0.35em',
            color: 'rgba(201,169,110,0.94)',
            textTransform: 'uppercase',
          }}>
            Ancient wisdom · Modern practice
          </span>
          <h2 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 48,
            fontWeight: 300,
            letterSpacing: '0.08em',
            color: 'var(--white)',
            lineHeight: 1.1,
          }}>
            Learning
          </h2>
        </motion.div>
      </div>

      {/* Diamond divider */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '12px 0',
      }}>
        <div style={{ flex: 1, height: 1, background: 'linear-gradient(to right, transparent, rgba(201,169,110,0.3))' }} />
        <div style={{ padding: '0 24px' }}>
          <DiamondSymbol size={48} color="rgba(201,169,110,0.6)" />
        </div>
        <div style={{ flex: 1, height: 1, background: 'linear-gradient(to left, transparent, rgba(201,169,110,0.3))' }} />
      </div>

      {/* Sub navigation */}
      <motion.nav
        aria-label="Learning sections"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: 48,
          padding: '24px 80px 48px',
          borderBottom: '1px solid rgba(201,169,110,0.16)',
          flexWrap: 'wrap',
        }}
      >
        {subNav.map((item, i) => (
          <button
            key={item}
            onClick={() => setActiveNav(i)}
            aria-current={activeNav === i ? 'true' : undefined}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontFamily: "'Raleway', sans-serif",
              fontSize: 12,
              fontWeight: activeNav === i ? 400 : 300,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: activeNav === i
                ? (item === 'Sanskrit' ? 'rgba(201,169,110,1)' : 'var(--gold-light)')
                : 'rgba(245,240,232,0.82)',
              padding: '4px 0',
              position: 'relative',
              transition: 'color 0.3s ease',
            }}
          >
            {item}
            {activeNav === i && (
              <motion.div
                layoutId="subnav-underline"
                style={{
                  position: 'absolute',
                  bottom: -2,
                  left: 0,
                  right: 0,
                  height: 1,
                  background: item === 'Sanskrit' ? 'rgba(201,169,110,0.7)' : 'var(--gold)',
                }}
              />
            )}
          </button>
        ))}
      </motion.nav>

      <AnimatePresence mode="wait">
        {isSanskrit ? (
          <motion.div
            key="sanskrit"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.4 }}
          >
            <SanskritDictionary />
          </motion.div>
        ) : isChakras ? (
          <motion.div
            key="chakras"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.4 }}
          >
            <ChakraBody />
          </motion.div>
        ) : isHistory ? (
          <motion.div
            key="main"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.4 }}
          >
            {/* Yoga History */}
            <div style={{ padding: '72px 80px 0' }}>
              <div style={{ maxWidth: 820, margin: '0 auto' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 40 }}>
                  <div style={{ width: 32, height: 1, background: 'rgba(201,169,110,0.5)', flexShrink: 0 }} />
                  <span style={{
                    fontFamily: "'Raleway', sans-serif", fontSize: 10, fontWeight: 300,
                    letterSpacing: '0.38em', color: 'rgba(201,169,110,0.90)', textTransform: 'uppercase',
                  }}>Origins</span>
                </div>
                <h2 style={{
                  fontFamily: "'Cormorant Garamond', serif", fontSize: 42, fontWeight: 300,
                  letterSpacing: '0.05em', color: 'var(--white)', marginBottom: 40, lineHeight: 1.15,
                }}>A Brief History of Yoga</h2>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px 56px' }}>
                  {[
                    {
                      era: 'c. 3000 BCE',
                      title: 'Vedic Origins',
                      body: 'Yoga\'s earliest roots appear in the Indus Valley civilisation. The Rigveda — the oldest of the four Vedas — introduces the word "yuj", meaning to yoke or unite. Vedic yoga was centred on ritual, sacrifice, and chanting to connect with the divine.',
                    },
                    {
                      era: 'c. 800–200 BCE',
                      title: 'Upanishadic Era',
                      body: 'The Upanishads distilled thousands of Vedic scriptures into the essential truth: Atman (individual self) is Brahman (universal self). This era gave yoga its philosophical core — the pursuit of liberation through self-knowledge, breath, and withdrawal of the senses.',
                    },
                    {
                      era: 'c. 400 BCE – 200 CE',
                      title: 'Classical Period',
                      body: 'Patañjali codified the practice into 196 sutras — the Yoga Sutras — organising the path into eight limbs (Ashtanga): ethical restraints, personal observances, posture, breath, withdrawal, concentration, meditation, and samadhi. This remains the definitive classical text.',
                    },
                    {
                      era: 'c. 500–1500 CE',
                      title: 'Tantra & Hatha Yoga',
                      body: 'Tantra introduced the body as a vehicle for liberation rather than an obstacle. Hatha Yoga emerged — systematising asana, pranayama, mudra, and bandha. The Hatha Yoga Pradipika (c. 1350 CE) became its foundational manual, describing the body as a temple of the divine.',
                    },
                    {
                      era: '1800s – Early 1900s',
                      title: 'Modern Revival',
                      body: 'Swami Vivekananda introduced yoga to the West at the 1893 Parliament of Religions in Chicago. Teachers like Krishnamacharya later systematised asana practice in Mysore, training students who would become the founding teachers of modern yoga: Iyengar, Jois, and Desikachar.',
                    },
                    {
                      era: '1960s – Present',
                      title: 'Global Yoga',
                      body: 'Yoga crossed all borders. From Kundalini brought by Yogi Bhajan to the studios of every city on earth, the practice has branched into hundreds of styles. Despite this diversity, the essence remains unchanged: union — of body and mind, self and world, individual and infinite.',
                    },
                  ].map((item, i) => (
                    <motion.div
                      key={item.era}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.08, duration: 0.6 }}
                      style={{ paddingTop: 24, borderTop: '1px solid rgba(245,240,232,0.07)' }}
                    >
                      <span style={{
                        fontFamily: "'Raleway', sans-serif", fontSize: 9, fontWeight: 300,
                        letterSpacing: '0.28em', color: 'rgba(201,169,110,0.88)', textTransform: 'uppercase',
                        display: 'block', marginBottom: 10,
                      }}>{item.era}</span>
                      <h3 style={{
                        fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 400,
                        letterSpacing: '0.04em', color: 'rgba(245,240,232,0.92)', marginBottom: 12,
                      }}>{item.title}</h3>
                      <p style={{
                        fontFamily: "'Raleway', sans-serif", fontSize: 12, fontWeight: 300,
                        lineHeight: 1.85, color: 'rgba(245,240,232,0.86)', letterSpacing: '0.02em',
                      }}>{item.body}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

          </motion.div>
        ) : null}
      </AnimatePresence>

      {/* Bottom gradient fade — softens transition to footer */}
      <div style={{
        height: 160,
        background: 'linear-gradient(to bottom, transparent 0%, #1c1820 100%)',
        marginTop: -120,
        position: 'relative',
        zIndex: 1,
        pointerEvents: 'none',
      }} />
    </div>
  )
}
