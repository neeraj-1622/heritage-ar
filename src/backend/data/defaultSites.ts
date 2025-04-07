
import { HistoricalSite } from '../../lib/supabase';

export const defaultSites: Omit<HistoricalSite, 'created_at' | 'updated_at'>[] = [
  {
    id: '1',
    name: 'The Colosseum',
    period: 'Ancient Rome',
    location: 'Rome, Italy',
    short_description: 'An oval amphitheatre in the centre of Rome, built of travertine limestone, tuff, and brick-faced concrete.',
    long_description: 'The Colosseum is an oval amphitheatre in the centre of the city of Rome, Italy, just east of the Roman Forum. It is the largest ancient amphitheatre ever built, and is still the largest standing amphitheatre in the world today, despite its age.',
    image_url: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?q=80&w=1996&auto=format&fit=crop',
    coordinates: { lat: 41.8902, lng: 12.4922 },
    ar_model_url: '/models/colosseum.glb',
  },
  {
    id: '2',
    name: 'Machu Picchu',
    period: 'Inca Civilization',
    location: 'Cusco Region, Peru',
    short_description: 'A 15th-century Inca citadel situated on a mountain ridge above the Sacred Valley.',
    long_description: 'Machu Picchu is a 15th-century Inca citadel, located in the Eastern Cordillera of southern Peru, on a 2,430-meter (7,970 ft) mountain ridge. It was built as an estate for the Inca emperor Pachacuti (1438–1472).',
    image_url: 'https://images.unsplash.com/photo-1526392060635-9d6019884377?q=80&w=2070&auto=format&fit=crop',
    coordinates: { lat: -13.1631, lng: -72.5450 },
  },
  {
    id: '3',
    name: 'Parthenon',
    period: 'Ancient Greece',
    location: 'Athens, Greece',
    short_description: 'A former temple dedicated to the goddess Athena, completed in 438 BC.',
    long_description: 'The Parthenon is a former temple on the Athenian Acropolis, Greece, dedicated to the goddess Athena, whom the people of Athens considered their patron. Construction began in 447 BC when the Athenian Empire was at the peak of its power.',
    image_url: 'https://images.unsplash.com/photo-1603565816030-6b389eeb23cb?q=80&w=2070&auto=format&fit=crop',
    coordinates: { lat: 37.9715, lng: 23.7267 },
    ar_model_url: '/models/parthenon.glb',
  },
  {
    id: '4',
    name: 'Taj Mahal',
    period: 'Mughal Empire',
    location: 'Agra, India',
    short_description: 'An ivory-white marble mausoleum commissioned in 1632 by the Mughal emperor Shah Jahan.',
    long_description: 'The Taj Mahal is an ivory-white marble mausoleum on the south bank of the Yamuna river in the Indian city of Agra. It was commissioned in 1632 by the Mughal emperor, Shah Jahan, to house the tomb of his favourite wife, Mumtaz Mahal.',
    image_url: 'https://images.unsplash.com/photo-1548013146-72479768bada?q=80&w=2076&auto=format&fit=crop',
    coordinates: { lat: 27.1751, lng: 78.0421 },
    ar_model_url: '/models/taj_mahal.glb',
  },
  {
    id: '5',
    name: 'Angkor Wat',
    period: 'Khmer Empire',
    location: 'Siem Reap, Cambodia',
    short_description: 'A temple complex and the largest religious monument in the world, built in the early 12th century.',
    long_description: 'Angkor Wat is a temple complex in Cambodia and is the largest religious monument in the world, on a site measuring 162.6 hectares. Originally constructed as a Hindu temple dedicated to the god Vishnu for the Khmer Empire, it was gradually transformed into a Buddhist temple.',
    image_url: '/lovable-uploads/c6841666-c9f4-4e59-878f-025699b7b516.png',
    coordinates: { lat: 13.4125, lng: 103.8670 },
  },
  {
    id: '6',
    name: 'Chichen Itza',
    period: 'Maya Civilization',
    location: 'Yucatán, Mexico',
    short_description: 'A pre-Columbian city built by the Maya people, known for its step pyramid El Castillo.',
    long_description: 'Chichen Itza was a large pre-Columbian city built by the Maya people of the Terminal Classic period. The archaeological site is located in Tinúm Municipality, Yucatán State, Mexico. It was a major focal point of the Northern Maya Lowlands from the Late Classic through the Terminal Classic and into the early portion of the Postclassic period.',
    image_url: 'https://images.unsplash.com/photo-1518638150340-f706e86654de?q=80&w=2067&auto=format&fit=crop',
    coordinates: { lat: 20.6843, lng: -88.5699 },
  },
];
