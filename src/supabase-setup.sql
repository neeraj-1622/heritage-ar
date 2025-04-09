-- Create tables for the HeritageAR application

-- Note: The uuid-ossp extension is already enabled in Supabase by default
-- No need to create it explicitly

-- Historical Sites Table
CREATE TABLE IF NOT EXISTS historical_sites (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  period TEXT NOT NULL,
  location TEXT NOT NULL,
  short_description TEXT NOT NULL,
  long_description TEXT,
  mythology TEXT,
  cultural_aspects TEXT,
  image_url TEXT NOT NULL,
  ar_model_url TEXT,
  coordinates JSONB,
  ar_enabled BOOLEAN DEFAULT false,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Users Profile Table (extends Auth users)
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  username TEXT NOT NULL,
  display_name TEXT,
  email TEXT NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT display_name_length CHECK (char_length(display_name) >= 2 AND char_length(display_name) <= 50)
);

-- User Favorites Table
CREATE TABLE IF NOT EXISTS user_favorites (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  site_id UUID REFERENCES historical_sites(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, site_id)
);

-- Enable Row Level Security
ALTER TABLE historical_sites ENABLE ROW LEVEL SECURITY;

-- Create policies for historical_sites
DROP POLICY IF EXISTS "Historical sites are viewable by everyone" ON historical_sites;
CREATE POLICY "Historical sites are viewable by everyone" 
  ON historical_sites 
  FOR SELECT 
  USING (true);

DROP POLICY IF EXISTS "Historical sites are editable by authenticated users" ON historical_sites;
CREATE POLICY "Historical sites are editable by authenticated users" 
  ON historical_sites 
  FOR INSERT 
  WITH CHECK (true);

DROP POLICY IF EXISTS "Historical sites are updatable by owners" ON historical_sites;
CREATE POLICY "Historical sites are updatable by owners" 
  ON historical_sites 
  FOR UPDATE 
  USING (auth.uid() = created_by);

DROP POLICY IF EXISTS "Historical sites are deletable by owners" ON historical_sites;
CREATE POLICY "Historical sites are deletable by owners" 
  ON historical_sites 
  FOR DELETE 
  USING (auth.uid() = created_by);

-- User Profiles (users can only read/edit their own data)
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for user_profiles
DROP POLICY IF EXISTS "Users can view their own profile" ON user_profiles;
CREATE POLICY "Users can view their own profile" 
  ON user_profiles 
  FOR SELECT 
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert their own profile" ON user_profiles;
CREATE POLICY "Users can insert their own profile" 
  ON user_profiles 
  FOR INSERT 
  WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update their own profile" ON user_profiles;
CREATE POLICY "Users can update their own profile" 
  ON user_profiles 
  FOR UPDATE 
  TO authenticated
  USING (auth.uid() = id);

-- Favorites (users can only access their own favorites)
ALTER TABLE user_favorites ENABLE ROW LEVEL SECURITY;

-- Create policies for user_favorites
DROP POLICY IF EXISTS "Users can view their own favorites" ON user_favorites;
CREATE POLICY "Users can view their own favorites" 
  ON user_favorites 
  FOR SELECT 
  TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can add their own favorites" ON user_favorites;
CREATE POLICY "Users can add their own favorites" 
  ON user_favorites 
  FOR INSERT 
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own favorites" ON user_favorites;
CREATE POLICY "Users can delete their own favorites" 
  ON user_favorites 
  FOR DELETE 
  TO authenticated
  USING (auth.uid() = user_id);

-- Function to automatically set updated_at
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
DROP TRIGGER IF EXISTS set_historical_sites_updated_at ON historical_sites;
CREATE TRIGGER set_historical_sites_updated_at
  BEFORE UPDATE ON historical_sites
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();

DROP TRIGGER IF EXISTS set_user_profiles_updated_at ON user_profiles;
CREATE TRIGGER set_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();

-- IMPROVED Function to create user profiles automatically when users are created
CREATE OR REPLACE FUNCTION public.create_user_profile()
RETURNS TRIGGER AS $$
DECLARE
  username_val TEXT;
  display_name_val TEXT;
BEGIN
  -- Set username with fallbacks
  username_val := COALESCE(
    NEW.raw_user_meta_data->>'name',
    split_part(NEW.email, '@', 1),
    'User'
  );
  
  -- Set display_name with fallbacks, prioritizing the display_name from metadata
  display_name_val := COALESCE(
    NEW.raw_user_meta_data->>'display_name',
    NEW.raw_user_meta_data->>'name',
    split_part(NEW.email, '@', 1),
    'User'
  );

  -- More robust insertion with explicit columns and avoiding constraint violations
  INSERT INTO public.user_profiles (
    id,
    username,
    display_name,
    email,
    avatar_url,
    created_at,
    updated_at
  ) VALUES (
    NEW.id,
    username_val,
    display_name_val,
    COALESCE(NEW.email, ''),
    NULL,
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO UPDATE
  SET 
    username = EXCLUDED.username,
    display_name = EXCLUDED.display_name,
    email = EXCLUDED.email,
    updated_at = NOW();
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create user profile on auth.users creation
DROP TRIGGER IF EXISTS create_profile_on_signup ON auth.users;
CREATE TRIGGER create_profile_on_signup
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.create_user_profile();

-- Add mythology and cultural_aspects columns if they don't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'historical_sites' 
    AND column_name = 'mythology'
  ) THEN
    ALTER TABLE historical_sites ADD COLUMN mythology TEXT;
  END IF;

  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'historical_sites' 
    AND column_name = 'cultural_aspects'
  ) THEN
    ALTER TABLE historical_sites ADD COLUMN cultural_aspects TEXT;
  END IF;
END $$;

-- Clear existing data from historical_sites table
DELETE FROM historical_sites;

-- Insert sample historical sites with mythology and cultural aspects
INSERT INTO historical_sites (name, period, location, short_description, long_description, mythology, cultural_aspects, image_url, ar_enabled) VALUES
('Great Pyramid of Giza', 'Ancient Egyptian', 'Giza, Egypt', 
'One of the Seven Wonders of the Ancient World, built around 2560 BCE.',
'The Great Pyramid of Giza stands as the last surviving wonder of the ancient world. Built during the reign of Pharaoh Khufu, it served as both a tomb and a symbol of ancient Egyptian architectural mastery.',
'Rising majestically from the edge of the Sahara, the Great Pyramid of Giza is more than a tomb—it is an eternal beacon of the power and ingenuity of ancient Egypt. Constructed around 2560 BCE during the reign of Pharaoh Khufu, this colossal structure was built as a staircase to the divine, a monumental gateway guiding the fallen king into the afterlife. Imagine an era where thousands of skilled craftsmen, laborers, and engineers worked meticulously under the relentless Egyptian sun, quarrying and hauling millions of limestone blocks with such precision that even today, modern scholars marvel at the techniques and mathematical knowledge embedded in its design.

Every stone of the pyramid is a silent witness to a civilization steeped in ritual, astronomy, and spirituality. The builders aligned the pyramid with the cardinal points and integrated subtle design elements that likely corresponded with the stars. Some theories suggest that the pyramid was connected to the great celestial cycle, symbolizing the eternal nature of the pharaoh’s soul. Its originally smooth, polished casing would have reflected the light of the sun, imbuing the monument with a radiant aura visible for miles around—a reminder of divine order and royal authority.

Over the millennia, the Great Pyramid has withstood the challenges of time, climate, and human interference. Looters and nature alike have weathered its imposing façade, yet its core mystery remains intact. It stands as the last of the Seven Wonders of the Ancient World, a relic that continues to inspire modern architects and engineers. For those who visit, it is not merely an edifice of stone but a portal to an era when the world was explained through magnificent constructs and divine order. The sheer scale, combined with the precision of its construction, reflects a society that revered the balance between the earthly and the eternal.

Every carved chamber and narrow passageway hints at untold stories of ceremonial practices and secretive rituals. The pyramid’s internal layout—with its Grand Gallery, King’s Chamber, and enigmatic air shafts—offers clues to the ancient belief in the journey beyond death. As the day fades, the pyramid’s shadow elongates across the desert, a solitary silhouette that seems to speak of mysteries lost to time yet preserved in its enduring silence. In its grandeur, the Great Pyramid invites us to ponder the ancient world, where spirituality and scientific acumen merged to create a legacy that still captivates us thousands of years later.',
'Historical and Cultural Context
Civilization: Built during the Old Kingdom of Egypt (around 2580–2560 BCE), the Great Pyramid of Giza is the quintessential emblem of ancient Egyptian civilization, whose legacy continues to influence modern Egyptian culture.

Language
Ancient Language: The pyramid is deeply connected with the ancient Egyptian language, which used hieroglyphs for religious texts, monumental inscriptions, and funerary documents.

Modern Influence: While modern Egypt primarily speaks Arabic, many cultural narratives and academic studies retain the significance of the ancient language as a symbol of Egypt’s rich past.

Customs & Traditions
Funerary Rituals: Egyptian customs were heavily focused on the journey of the soul, as reflected in the pyramid’s function as a tomb for pharaohs. Rituals involved elaborate mummification processes and tomb inscriptions meant to secure an eternal life in the afterlife.

Religious Practices: Temples, ceremonies, and festivals (such as Opet and Sed festivals) honored gods like Ra and Osiris, and helped define the calendar and social order.

Modern Celebrations: Contemporary Egypt often celebrates its Pharaonic past through cultural events, museum exhibitions, and public lectures that evoke the mystique of the ancient era.

Art & Literature
Architecture as Art: The precise engineering and monumental scale of the pyramid itself represent an enduring artistic and architectural achievement.

Reliefs and Inscriptions: Tomb paintings, sculptures, and carvings served both decorative and religious functions, telling stories of divine favor and the pharaoh’s journey to the afterlife.

Literary Legacy: Ancient texts, such as the Pyramid Texts and the Book of the Dead, form a literary corpus that has intrigued scholars and inspired modern literature, film, and art.

Food
Ancient Diet: The ancient Egyptian diet was based on staples like bread, beer, vegetables (onions, garlic, and leeks), and fish from the Nile. These elements held symbolic meaning in rituals.

Modern Connections: Many modern Egyptian foods still utilize ancient ingredients and recipes, bridging millennia of culinary tradition.

Clothing
Ancient Garments: Clothing was usually made from linen due to the hot climate. Both nobility and workers would don garments that reflected status and function—simple kilts for laborers and more elaborate robes for the elite.

Symbolic Ornamentation: Jewelry and headdresses often had religious significance and were depicted in art that adorned tomb walls and temples.

Additional Cultural Aspects
Craftsmanship & Innovation: The construction techniques and monumental architecture speak to an advanced understanding of mathematics and astronomy, integral to their worldview.

Symbolic Architecture: The pyramid’s alignment with celestial bodies underscores the ancient Egyptian integration of astronomy with religion and cultural identity.',
'https://xtobcqnmdqkhhcpahjiw.supabase.co/storage/v1/object/public/heritage-ar/historical-sites-images/pyramid.jpg', 
true),

('Machu Picchu', 'Inca', 'Cusco Region, Peru',
'15th-century Inca citadel located in southern Peru.',
'Machu Picchu is an ancient Inca city set high in the Andes Mountains. Built in the 15th century and later abandoned, it is renowned for its sophisticated dry-stone walls that fuse huge blocks without the use of mortar.',
'Perched high in the Andean mountains and shrouded in a perpetual mist, Machu Picchu is a dazzling testament to the ingenuity and spirituality of the Inca Empire. Built in the mid-15th century under the visionary rule of Emperor Pachacuti, this ancient citadel was not just a royal retreat but also a sacred center, seamlessly integrated into the dramatic mountain landscape. Every stone of Machu Picchu tells a story of harmony with nature; its precisely cut walls, joined without mortar, demonstrate a mastery of construction that has withstood centuries of earthquakes and erosion.

Walking through Machu Picchu feels like stepping back in time. Terraced fields cling to the mountainside, and every structure seems to emerge organically from the rugged terrain. The site was designed with a deep understanding of astronomy—the positioning of temples and ceremonial plazas aligned with solstices and equinoxes, indicating that the Incas tracked celestial rhythms to guide their agricultural and ceremonial calendars. It is believed that this high-altitude sanctuary served as a confluence of royal power and cosmic worship, where the natural landscape was revered as a manifestation of the divine.

The rediscovery of Machu Picchu in 1911 by the American explorer Hiram Bingham reawakened global fascination with the Inca civilization. Scholars, historians, and travelers alike have since been drawn to its mysterious beauty and the untold stories embedded in its stone pathways. Every panoramic view from its sun-washed terraces, every temple and ceremonial plaza, speaks to an advanced culture that valued both the human and the divine. The careful design of water channels, the integration of agriculture with monumental architecture, and the ingenious adaptation to steep slopes all highlight a sophisticated society that understood its environment in ways that still resonate today.

Machu Picchu is not merely an archaeological site; it is a living symbol of resilience and adaptation. It challenges visitors to contemplate how a civilization thrived in such an isolated and forbidding location, turning the hostile Andean environment into a cultural and architectural masterpiece. As clouds drift across the peaks and the sun casts long, golden hues over ancient stone, Machu Picchu endures as a bridge between a lost world and our quest to connect with history, where every breath of thin mountain air is filled with the spirits of the past.',
'Historical and Cultural Context
Civilization: Attributed to the Inca civilization (15th century CE), Machu Picchu is a magnificent representation of Incan ingenuity and their deep connection with nature, spirituality, and imperial power.

Language
Quechua Heritage: Quechua was the primary language of the Inca and remains widely spoken among Andean communities. It serves as a living link to the past.

Colonial Impact: Spanish later became dominant after colonization, yet Quechua retains cultural significance in literature, music, and daily life.

Customs & Traditions
Rituals and Ceremonies: Religion was integral, with ceremonies often performed to honor the sun (Inti), earth (Pachamama), and other natural deities. Festivals like Inti Raymi (Festival of the Sun) continue to celebrate these traditions.

Social Organization: The Inca organized society through a system that emphasized communal labor and reciprocity, which is remembered in local customs and agricultural practices.

Art & Literature
Stonework and Architecture: The construction at Machu Picchu illustrates a sophisticated art of stone masonry, with precisely cut stones that fit together without mortar.

Textile Art: The Inca excelled in weaving vibrant textiles with intricate patterns and symbolism, a craft that remains vital to Andean cultural expression.

Oral Traditions: Much of Incan history is passed down through oral lore, songs, and storytelling traditions that continue to influence regional literature.

Food
Andean Staples: Traditional Incan foods such as potatoes, maize, quinoa, and native fruits highlight the agricultural ingenuity of the region. These staples have been integrated into modern Peruvian cuisine.

Modern Gastronomy: Today, Peruvian cuisine is celebrated worldwide for its diversity, combining traditional ingredients with global culinary influences.

Clothing
Traditional Attire: Traditional Andean clothing features handwoven textiles, bright patterns, and distinctive headwear such as the chullo (a knitted hat with earflaps).

Cultural Symbols: Apparel often conveys social status, community identity, and ancestral heritage, with motifs rooted in Incan cosmology.

Additional Cultural Aspects
Connection with Nature: The Incan worldview was holistic, integrating astronomy, agriculture, and spirituality, which is epitomized in the site’s careful placement within the rugged Andean landscape.

Sustainable Practices: The terraces of Machu Picchu illustrate advanced agricultural methods adapted to steep mountain terrains, a legacy of environmental stewardship.',
'https://xtobcqnmdqkhhcpahjiw.supabase.co/storage/v1/object/public/heritage-ar/historical-sites-images/machupicchu.jpg',
true),

('Parthenon', 'Ancient Greek', 'Athens, Greece',
'Ancient Greek temple dedicated to the goddess Athena.',
'The Parthenon is a former temple on the Athenian Acropolis, Greece, dedicated to the goddess Athena, whom the people of Athens considered their patron.',
'Dominating the skyline of ancient Athens, the Parthenon is the quintessential symbol of classical beauty, political power, and cultural refinement. Constructed between 447 and 438 BCE during the zenith of Athenian democracy, the Parthenon was dedicated to Athena, the goddess of wisdom and war, whose patronage defined the spirit of the city. This magnificent temple, built from the shimmering Pentelic marble, has come to epitomize the pinnacle of ancient Greek architectural achievement.

Every meticulously carved column and sculpted frieze of the Parthenon speaks to the ideals of symmetry, proportion, and harmony that were the cornerstones of Greek art and philosophy. Ancient architects designed the temple with remarkable precision, incorporating subtle optical corrections—columns that lean inward ever so slightly, and a gently curving platform—to create an illusion of perfect balance. Such ingenious design features reflect a culture that was not only concerned with physical beauty but also sought to mirror the divine order of the cosmos.

The Parthenon was more than a temple; it was an emblem of the democratic aspirations of Athens. During its construction, Athens was experiencing a golden age of intellectual and artistic expression, with great philosophers, dramatists, and visionaries enriching its cultural life. The temple served as a repository of the city’s glory—a place where artistic innovation and civic pride converged. Its sculptural decorations, which depicted mythological battles and revered deities, offered a visual narrative of the city’s history and values.

Over the centuries, the Parthenon has played many roles. It has withstood the vicissitudes of war, fire, and even conversion into a church and mosque, each epoch leaving its mark on the sacred stone. Despite these transformations, its enduring majesty continues to inspire. In modern times, the Parthenon stands not only as a monument to ancient Greece but also as a symbol of enduring human creativity and the eternal quest for wisdom.

As you wander among its ruins, the Parthenon invites you to ponder the legacy of a civilization that laid the foundations for Western thought, art, and governance. Its weathered stones echo with the voices of ancient poets and philosophers, beckoning us to remember a time when beauty and reason intertwined to create something timeless and profound.',
'Historical and Cultural Context
Civilization: The Parthenon, built in the 5th century BCE on the Athenian Acropolis, is a symbol of Ancient Greece and its contributions to Western philosophy, art, and democracy.

Language
Ancient Greek: The language of the classical period, used in epic poetry (like Homer’s works), philosophy, and drama. Its influence persists in modern Greek and has shaped much of Western academic and literary traditions.

Philosophical and Literary Heritage: Texts in Ancient Greek have been instrumental in the development of Western literature and thought.

Customs & Traditions
Democratic Ideals: Athenian society laid the foundation for democratic practices, valuing civic participation and public discourse.

Religious Festivals: The ancient Greeks celebrated numerous festivals (such as the Panathenaia) dedicated to Athena, the patron goddess of Athens, fostering a rich tradition of theatrical performances, athletic contests, and communal feasts.

Art & Literature
Classical Sculpture and Architecture: The Parthenon itself is an architectural masterpiece decorated with sculptures and friezes that tell mythological and historical narratives. These works have profoundly influenced Western art.

Literary Achievements: Drama, epic poetry, and philosophy flourished during this period, with writers such as Sophocles, Euripides, and Plato setting enduring standards for art and thought.

Food
Mediterranean Diet: Ancient Greek cuisine featured staples such as olives, wine, bread, fish, and fruits. These ingredients remain central to modern Greek cooking.

Social Dining: Symposiums, communal feasts, and markets were integral to social and political life, reinforcing community bonds and philosophical dialogue.

Clothing
Classical Attire: Traditional garments like the chiton and himation were prevalent, symbolizing both practicality and aesthetic elegance.

Fashion and Identity: Clothing was not only a practical necessity but also an indicator of social status and civic identity, with draped garments highlighting the body’s form in a celebration of humanism.

Additional Cultural Aspects
Philosophy and Science: Greek culture’s pursuit of knowledge and the origins of Western scientific thought are exemplified by the intellectual legacy of the period.

Enduring Legacy: The ideas of civic responsibility, aesthetic beauty, and rational inquiry from Ancient Greece continue to influence modern Western culture and education.',
'https://xtobcqnmdqkhhcpahjiw.supabase.co/storage/v1/object/public/heritage-ar/historical-sites-images/parthenon.jpg',
true),

('Stonehenge', 'Neolithic', 'Wiltshire, England',
'Prehistoric monument in Wiltshire, England.',
'Stonehenge is a prehistoric monument in Wiltshire, England, consisting of a ring of standing stones. Each stone is around 13 feet high, seven feet wide, and weighs around 25 tons.',
'Shrouded in mists of prehistoric mystery, Stonehenge is one of the world’s most enigmatic monuments. Located on the Salisbury Plain in England, this ancient stone circle was constructed over several stages between 3000 and 2000 BCE, long before the advent of written history. The massive sarsen stones and the more delicate bluestones, some transported from as far away as Wales, stand in silent testimony to the remarkable organization and determination of Neolithic peoples.

Stonehenge’s architectural layout suggests that it was much more than a casual arrangement of stones. Its alignment with the sunrise of the summer solstice and the sunset of the winter solstice has led many to believe that it functioned as a sophisticated astronomical observatory, marking the cycles of nature in a ritualistic context. It is thought that ancient peoples gathered here during these pivotal times of the year, using the monument as a focal point for ceremonies that celebrated the rebirth of the sun and the passage of the seasons.

The mystery surrounding Stonehenge only deepens with each passing century. Was it a sacred site for ancient Druidic rites, a healing center, or even a place where the boundary between the natural and supernatural worlds blurred? While definitive answers may forever elude us, the effort required to shape, transport, and erect these megaliths speaks volumes about the cultural and spiritual significance they held. Stonehenge’s raw, enduring presence captures the imagination, offering a glimpse into a world where the forces of nature were both revered and meticulously observed.

For modern visitors, Stonehenge is more than just an archaeological curiosity—it is an invitation to connect with a time when human society was deeply intertwined with the rhythms of the earth. As sunlight filters through the stone circle on a crisp morning and shadows dance in harmonious patterns, one cannot help but feel the weight of ancient wisdom. The monument stands as a perpetual enigma, a relic of a distant past that continues to challenge our understanding and inspire a sense of wonder about the origins of civilization.',
'Historical and Cultural Context
Prehistoric Enigma: Stonehenge, constructed during the late Neolithic to early Bronze Age (around 3000–2000 BCE), is shrouded in mystery. It reflects the communal and ritualistic practices of prehistoric peoples in the British Isles.

Language
Mystery of Communication: As there is no written record from the people who built Stonehenge, the languages spoken are unknown. However, it is believed that early Celtic or pre-Celtic tongues were in use.

Folklore and Oral Traditions: Later Celtic cultures, whose languages and stories have been recorded, often interpret the site in myth and legend.

Customs & Traditions
Ceremonial Function: Stonehenge is widely thought to have played a role in religious or astronomical ceremonies, including solstice celebrations when the sun’s alignment underscores the passage of seasons.

Ritual Gatherings: The site might have been a place for community gatherings, healing rituals, or ancestor worship, reflecting a deep connection between the people and natural cycles.

Art & Literature
Megalithic Art: While not decorated in the conventional sense, the precise arrangement of stones itself is a statement of artistic and astronomical sophistication.

Cultural Narratives: Stonehenge features prominently in British folklore, inspiring literature, poetry, and modern reinterpretations in popular culture.

Food
Subsistence Lifestyle: The communities associated with Stonehenge were primarily agrarian and hunter-gatherers. Their diet would have consisted of locally sourced grains, vegetables, wild game, and fruits.

Evolution of Cuisine: Although direct culinary traditions from this era are not recorded, they laid the groundwork for later British culinary practices influenced by local ingredients and seasonal cycles.

Clothing
Prehistoric Attire: Clothing materials were likely sourced from natural fibers and animal hides. Styles would have been functional, reflecting the needs of a community adapting to their environment.

Symbolic Decoration: Though little is known about specific adornments, ornaments or body paint could have played roles in ritual ceremonies.

Additional Cultural Aspects
Astronomical Alignments: The site’s precise construction relative to solstices indicates advanced knowledge of astronomy and a worldview that saw nature as intimately connected with the cosmos.

Enduring Mystery: Stonehenge continues to inspire questions about prehistoric spirituality and social organization, underscoring its importance as a cultural and historical touchstone.',
'https://xtobcqnmdqkhhcpahjiw.supabase.co/storage/v1/object/public/heritage-ar/historical-sites-images/stonehenge.jpg',
true),

('Taj Mahal', 'Mughal', 'Agra, India',
'17th-century marble mausoleum built by Emperor Shah Jahan.',
'The Taj Mahal is an ivory-white marble mausoleum on the right bank of the river Yamuna in Agra, India. It was commissioned in 1632 by the Mughal emperor Shah Jahan to house the tomb of his favorite wife, Mumtaz Mahal.',
'In the heart of Agra, along the serene banks of the Yamuna River, the Taj Mahal rises as a beacon of love and artistic genius. Commissioned by the Mughal Emperor Shah Jahan in 1632, this ethereal mausoleum was built to immortalize the memory of his beloved wife, Mumtaz Mahal. Over a span of 22 years, countless artisans, craftsmen, and laborers transformed white marble and precious stones into one of the most breathtaking embodiments of romantic devotion ever created.

The Taj Mahal is a masterwork of Indo-Islamic architecture, where symmetry and balance are rendered in every detail. Its central dome, which soars gracefully into the sky, is flanked by four minarets and encircled by lush gardens, water channels, and reflective pools that mirror its beauty. The marble, inlaid with delicate floral designs crafted from semi-precious stones, appears to change color with the shifting light—from soft pinks at dawn to glowing white under the moon. Every element of the Taj Mahal is imbued with symbolism, evoking the themes of eternity, purity, and sublime beauty.

At its heart lies a poignant tale of love and loss. For Emperor Shah Jahan, the construction of the Taj Mahal was not just an act of architectural mastery but also a deeply personal, almost spiritual endeavor—a way to defy mortality and preserve the memory of his cherished Mumtaz Mahal. It is said that in creating this mausoleum, the emperor intended for the Taj to be the very embodiment of paradise, where earthly sorrow would be transformed into eternal reverence. Over centuries, the Taj Mahal has enchanted travelers and poets, its story of passionate romance resonating across cultures and generations.

As visitors wander through its serene courtyards and gaze upon its meticulously carved facades, they encounter not only a monument of stone but also a narrative imbued with human emotion and creative brilliance. The Taj Mahal stands as a testament to the timeless power of love—a structure where grief, artistry, and devotion merge into a singular, everlasting vision of beauty. It is a place where every delicate detail invites contemplation on the nature of memory and the imperishable nature of true affection.',
'Historical and Cultural Context
Mughal Splendor: Constructed in the mid-17th century by the Mughal Emperor Shah Jahan in memory of his wife Mumtaz Mahal, the Taj Mahal is a masterpiece of Mughal architecture, reflecting a synthesis of Persian, Islamic, and Indian cultural elements.

Language
Mughal Court Languages: Persian was the language of administration and high culture in the Mughal court, while local languages like Urdu and various regional dialects thrived among the people.

Literary Flourishing: Mughal literature and poetry, notably in Persian and Urdu, blossomed during this period, contributing to a vibrant literary tradition that celebrated love, beauty, and nature.

Customs & Traditions
Love and Mourning: The Taj Mahal, as a mausoleum, reflects the personal customs of mourning and memorialization, as well as the broader Mughal practices of lavish patronage of the arts and architecture.

Religious Synthesis: Mughal culture was marked by a blend of Islamic beliefs and local Hindu traditions, leading to unique ceremonies, festivals, and artistic expressions that bridged cultural divides.

Festivals and Rituals: Religious and seasonal festivals, such as Eid and Diwali, illustrate the pluralistic cultural fabric of India, with rituals that include music, dance, and communal feasting.

Art & Literature
Architectural Elegance: The Taj Mahal’s design, with its symmetrical layouts, intricate inlay work using semi-precious stones, and reflective pools, stands as a pinnacle of Mughal aesthetics.

Calligraphy and Miniature Paintings: Mughal art excelled in detailed miniature paintings and calligraphy, often inscribed with verses of poetry that celebrate beauty and transcendence.

Influence on Modern Art: The enduring appeal of Mughal art continues to influence contemporary Indian art, literature, and popular culture.

Food
Royal Cuisine: The Mughal era introduced rich culinary traditions that combined Persian and Indian influences—characterized by the use of spices, aromatic rice dishes (like biryani), and intricate desserts.

Street to Palace: Modern Indian cuisine reflects these influences, with regional variations that continue to celebrate both indulgent royal recipes and the everyday fare of local communities.

Clothing
Mughal Attire: Clothing in the Mughal court was elaborate, featuring richly embroidered garments, luxurious fabrics, and detailed jewelry. Men wore robes and turbans, while women adorned themselves with sarees and lehengas that featured intricate patterns.

Cultural Symbolism: Traditional dress not only indicated social status but also played a role in religious and festive ceremonies, tying into the broader artistic traditions of the era.

Additional Cultural Aspects
Syncretism and Identity: The Taj Mahal is emblematic of cultural syncretism, where the blending of religious, artistic, and intellectual traditions produces a legacy that celebrates both love and impermanence.

Architectural Innovation: The engineering feats behind the Taj Mahal’s construction continue to be studied as examples of innovation in building techniques, water management, and decorative art.',
'https://xtobcqnmdqkhhcpahjiw.supabase.co/storage/v1/object/public/heritage-ar/historical-sites-images/tajmahal.jpg',
true),

('The Colosseum', 'Ancient Roman', 'Rome, Italy',
'Ancient amphitheater in the heart of Rome.',
'The Colosseum is an oval amphitheatre in the centre of the city of Rome, Italy. Built of travertine limestone, tuff, and brick-faced concrete, it is the largest amphitheatre ever built.',
'In the heart of ancient Rome, the Colosseum emerges as a monumental arena where grandeur, violence, and spectacle converged to define an entire civilization. Built between 70 and 80 CE under the reign of Emperor Titus, this massive amphitheater was designed to seat tens of thousands of spectators who gathered to witness gladiatorial contests, wild beast hunts, and dramatic reenactments of historical battles. Its elliptical structure, constructed from a combination of travertine stone, concrete, and volcanic rock, was an engineering marvel of its time, boasting an intricate system of vaults, corridors, and underground passages—known as the hypogeum—that allowed for the seamless orchestration of myriad events.

The Colosseum was more than just a venue for blood sport; it served as the epicenter of Roman public life and imperial propaganda. It was here that the virtues of courage, skill, and endurance were celebrated, as gladiators—often slaves or prisoners—fought for their lives and, in the eyes of the populace, for the glory of Rome. The roaring cheers of the crowd, the dramatic flair of staged naval battles, and the elaborate ceremonies that accompanied each event helped solidify the Colosseum’s role as a symbol of Rome’s power and cultural dominance. For the people of ancient Rome, the Colosseum was a place where politics, entertainment, and spectacle intertwined, reinforcing the might of an empire built on both conquest and ingenuity.

Today, the Colosseum stands as a weathered yet powerful reminder of a bygone era. Despite centuries of natural decay, earthquakes, and deliberate stone-carving for new constructions, its imposing walls and iconic arches continue to captivate the imagination. Walkways that once hosted throngs of cheering citizens now echo with the silence of history, yet the spirit of those ancient days lingers in the very stones. For modern visitors, the Colosseum is not only an archaeological treasure but a visceral connection to a past where honor and brutality coexisted in a grand, ever-unfolding drama. It challenges us to reflect on the nature of spectacle, the impermanence of glory, and the enduring impact of human enterprise.',
'Historical and Cultural Context
Ancient Roman Empire: Built between 70–80 CE, the Colosseum is a monumental symbol of the power, engineering prowess, and cultural life of ancient Rome. It was a venue for spectacles that ranged from gladiatorial contests to public spectacles, reflecting the social and political life of the Roman Republic turned Empire.

Language
Latin Legacy: Latin was the language of the Romans, serving as the medium for administration, literature, law, and military commands. Its influence persists in modern Romance languages and academic terminology.

Literary and Legal Influences: Roman literature (from authors like Cicero, Virgil, and Ovid) and legal thought laid the foundation for Western legal and literary traditions.

Customs & Traditions
Public Spectacles: The gladiatorial games, animal hunts, and mock naval battles held in the Colosseum were central to Roman public life, serving both as entertainment and as a means to demonstrate state power.

Social Structure: Roman society was stratified, with citizenship, patronage networks, and public ceremonies that reinforced social order. Festivals and public holidays were integral in unifying diverse populations within the empire.

Civic Life: The Colosseum was also a forum for political propaganda and social gathering, embodying the ideals of Roman civic duty, spectacle, and power.

Art & Literature
Architectural Innovations: Roman architecture, as epitomized by the Colosseum’s elliptical structure, vaulting techniques, and use of concrete, has informed architectural practices through the centuries.

Roman Sculpture & Mosaics: Art in ancient Rome ranged from realistic portrait sculpture to elaborate mosaics and frescoes that depicted mythological, historical, and everyday themes.

Cultural Production: Roman literature, theater, and philosophical treatises continue to be foundational texts in Western education and thought.

Food
Roman Cuisine: The Roman diet was varied, including staples like bread, olives, cheese, fresh produce, and wine, along with imported delicacies reflecting the empire’s trade networks.

Feasting and Banquets: Social gatherings often revolved around banquets and feasts which were integral to displaying wealth, social status, and the enjoyment of civic life.

Clothing
Togas and Tunics: The toga, a distinctive garment of Roman citizens, symbolized civility and Roman identity. Tunics were worn by both the elite and common citizens, with differences in fabric and decoration reflecting social standing.

Fashion and Status: Clothing choices in ancient Rome were not only practical but served as indicators of legal status and civic identity, influencing styles that have echoed in Western fashion history.

Additional Cultural Aspects
Engineering and Urbanism: The organizational skills and engineering advancements reflected in the Colosseum’s construction are a testament to Roman innovation. Aqueducts, roads, and urban planning developed during this era have had a lasting influence on city infrastructure.

Legacy of Civic Entertainment: The concept of public entertainment, civic engagement, and the role of spectacles in society continue to influence modern sports, performance arts, and public gatherings.',
'https://xtobcqnmdqkhhcpahjiw.supabase.co/storage/v1/object/public/heritage-ar/historical-sites-images/colosseum.jpg',
true);
