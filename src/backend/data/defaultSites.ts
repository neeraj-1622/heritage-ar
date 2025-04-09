import { HistoricalSite } from '../../../lib/supabase';

export const defaultSites: HistoricalSite[] = [
  {
    id: '1',
    name: 'Great Pyramid of Giza',
    period: 'Ancient Egyptian',
    location: 'Giza, Egypt',
    short_description: 'One of the Seven Wonders of the Ancient World, built around 2560 BCE.',
    long_description: 'The Great Pyramid of Giza stands as the last surviving wonder of the ancient world. Built during the reign of Pharaoh Khufu, it served as both a tomb and a symbol of ancient Egyptian architectural mastery.',
    mythology: 'Rising majestically from the edge of the Sahara, the Great Pyramid of Giza is more than a tomb—it is an eternal beacon of the power and ingenuity of ancient Egypt.',
    image_url: 'https://example.com/pyramid.jpg',
    ar_model_url: '/models/pyramid.glb',
    coordinates: { lat: 29.9792, lng: 31.1342 },
    ar_enabled: true,
    created_by: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Machu Picchu',
    period: 'Inca',
    location: 'Cusco Region, Peru',
    short_description: '15th-century Inca citadel located in southern Peru.',
    long_description: 'Machu Picchu is an ancient Inca city set high in the Andes Mountains. Built in the 15th century and later abandoned, it is renowned for its sophisticated dry-stone walls that fuse huge blocks without the use of mortar.',
    mythology: 'Perched high in the Andean mountains and shrouded in a perpetual mist, Machu Picchu is a dazzling testament to the ingenuity and spirituality of the Inca Empire.',
    image_url: 'https://example.com/machupicchu.jpg',
    ar_model_url: '/models/machupicchu.glb',
    coordinates: { lat: -13.1631, lng: -72.5450 },
    ar_enabled: true,
    created_by: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '3',
    name: 'The Colosseum',
    period: 'Ancient Rome',
    location: 'Rome, Italy',
    short_description: 'An oval amphitheatre in the centre of Rome, built of travertine limestone, tuff, and brick-faced concrete.',
    long_description: 'The Colosseum is an oval amphitheatre in the centre of the city of Rome, Italy, just east of the Roman Forum. It is the largest ancient amphitheatre ever built, and is still the largest standing amphitheatre in the world today, despite its age.',
    image_url: '/images/colosseum.jpg',
    coordinates: { lat: 41.8902, lng: 12.4922 },
    ar_model_url: '/models/colosseum.glb',
    ar_enabled: true,
    created_by: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '4',
    name: 'Parthenon',
    period: 'Ancient Greece',
    location: 'Athens, Greece',
    short_description: 'A former temple dedicated to the goddess Athena, completed in 438 BC.',
    long_description: 'The Parthenon is a former temple on the Athenian Acropolis, Greece, dedicated to the goddess Athena, whom the people of Athens considered their patron. Construction began in 447 BC when the Athenian Empire was at the peak of its power.',
    image_url: '/images/parthenon.jpg',
    coordinates: { lat: 37.9715, lng: 23.7267 },
    ar_model_url: '/models/parthenon.glb',
    ar_enabled: true,
    created_by: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '5',
    name: 'Taj Mahal',
    period: 'Mughal Empire',
    location: 'Agra, India',
    short_description: 'An ivory-white marble mausoleum commissioned in 1632 by the Mughal emperor Shah Jahan.',
    long_description: 'The Taj Mahal is an ivory-white marble mausoleum on the south bank of the Yamuna river in the Indian city of Agra. It was commissioned in 1632 by the Mughal emperor, Shah Jahan, to house the tomb of his favourite wife, Mumtaz Mahal.',
    image_url: '/images/tajmahal.jpg',
    coordinates: { lat: 27.1751, lng: 78.0421 },
    ar_model_url: '/models/taj_mahal.glb',
    ar_enabled: true,
    created_by: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '6',
    name: 'Stonehenge',
    period: 'Neolithic',
    location: 'Wiltshire, England',
    short_description: 'A prehistoric monument consisting of a ring of standing stones, each around 13 feet high, seven feet wide, and weighing around 25 tons.',
    long_description: 'Stonehenge is a prehistoric monument on Salisbury Plain in Wiltshire, England. It consists of an outer ring of vertical sarsen standing stones, each around 13 feet high, seven feet wide, and weighing around 25 tons, topped by connecting horizontal lintel stones. Inside is a ring of smaller bluestones. The whole monument, now ruined, is oriented towards the sunrise on the summer solstice.',
    image_url: '/images/stonehenge.jpg',
    coordinates: { lat: 51.1789, lng: -1.8262 },
    ar_model_url: '/models/stonehenge.glb',
    ar_enabled: true,
    created_by: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];
