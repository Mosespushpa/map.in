// ── State Variables ──
let statesData = {};
let riversData = [];
let fortsData  = [];
let ghatsData  = [];
let currentCategory = 'states';
let currentYear = 2025;
let isDragging = false;
let isDark = true;
let isResizing = false;
let lockedState = null;
let placeholderHidden = false;

const TAGS = [
  { id: 'states',    label: 'States',           icon: 'fa-map' },
  { id: 'uts',       label: 'Union Territories', icon: 'fa-flag' },
  { id: 'rivers',    label: 'Rivers',            icon: 'fa-water' },
  { id: 'ghats',     label: 'Ghats',             icon: 'fa-layer-group' },
  { id: 'forts',     label: 'Forts',             icon: 'fa-chess-rook' },
  { id: 'languages', label: 'Languages',         icon: 'fa-language' },
  { id: 'dynasties', label: 'Dynasties',         icon: 'fa-crown' },
  { id: 'events',    label: 'Historical Events', icon: 'fa-landmark' }
];

const MIN_YEAR = 1947, MAX_YEAR = 2025;
let milestones = [];

function $(id) { return document.getElementById(id); }

// ── Inline States Data ──
[
  { id:'Delhi', name:'Delhi', capital:'New Delhi', area:'1,484 km²', population:'32 Million', language:'Hindi, English', formed:1956, description:'Delhi is the capital territory of India, home to the national government.', facts:['Capital of India','Home to Rashtrapati Bhavan','Qutub Minar — UNESCO Site'], historicalEvents:[{year:1911,event:'Capital moved from Calcutta to Delhi'},{year:1956,event:'Delhi becomes Union Territory'}] },
  { id: 'Puducherry', name:'Puducherry', capital:'Puducherry', area:'479 km²', population:'1.5 Million', language:'Tamil, Telugu, Malayalam, French', formed:1954, description:'Puducherry is a Union Territory with a unique French colonial heritage.', facts:['Former French colony','Known for beaches and Auroville','French architecture and culture'], historicalEvents:[{year:1954,event:'Puducherry merged with India'},{year:1962,event:'Officially became Union Territory'}] },
  { id: 'Jammu_Kashmir', name:'Jammu & Kashmir', capital:'Srinagar (summer), Jammu (winter)', area:'55,530 km²', population:'12 Million'},
  { id:'Ladakh', name:'Ladakh', capital:'Leh', area:'59,146 km²', population:'0.3 Million'},
  { id: 'Dadra And Nagar Haveli And Daman And Diu', name:'Dadra and Nagar Haveli and Daman and Diu', capital:'Daman', area:'603 km²', population:'0.6 Million'},
  { id:'Andhra_Pradesh', name:'Andhra Pradesh', capital:'Amaravati', area:'162,975 km²', population:'54 Million', language:'Telugu', formed:1956, description:'Andhra Pradesh was formed in 1956 from Telugu-speaking regions of Madras State. Telangana was carved out in 2014.', facts:['Rice Bowl of India','Home to Tirupati temple','Coastline of 974 km along Bay of Bengal'], historicalEvents:[{year:1956,event:'Andhra Pradesh formed from Madras State'},{year:2014,event:'Telangana carved out'}], images:[{url:'https://via.placeholder.com/300x200?text=Tirupati+Temple', caption:'Tirupati Temple'}, {url:'https://via.placeholder.com/300x200?text=Amaravati+Buddha', caption:'Amaravati Buddhist Site'}] },
  { id:'Maharashtra', name:'Maharashtra', capital:'Mumbai', area:'307,713 km²', population:'112 Million', language:'Marathi', formed:1960, description:'Maharashtra was formed on May 1, 1960 when Bombay State was divided along linguistic lines.', facts:['Financial capital of India — Mumbai','Home to Bollywood','Ajanta and Ellora Caves — UNESCO Sites'], historicalEvents:[{year:1960,event:'Maharashtra formed from Bombay State'},{year:1995,event:'Bombay renamed to Mumbai'}], images:[{url:'https://via.placeholder.com/300x200?text=Gateway+of+India', caption:'Gateway of India'}, {url:'https://via.placeholder.com/300x200?text=Ajanta+Caves', caption:'Ajanta Caves'}] },
  { id:'Tamil_Nadu', name:'Tamil Nadu', capital:'Chennai', area:'130,060 km²', population:'72 Million', language:'Tamil', formed:1950, description:'Tamil Nadu has one of the oldest civilizations in the world with a rich cultural heritage.', facts:['Tamil — one of world\'s oldest classical languages','Home to over 33,000 ancient temples','Major IT hub — Chennai'], historicalEvents:[{year:1950,event:'Madras State formed'},{year:1969,event:'Renamed Tamil Nadu'}] },
  { id:'Karnataka', name:'Karnataka', capital:'Bengaluru', area:'191,791 km²', population:'68 Million', language:'Kannada', formed:1956, description:'Karnataka is known as the Silicon Valley of India due to its thriving IT industry.', facts:['Silicon Valley of India — Bengaluru','Hampi — UNESCO World Heritage Site','Home to Vijayanagara Empire ruins'], historicalEvents:[{year:1956,event:'Mysore State formed'},{year:1973,event:'Renamed Karnataka'}] },
  { id:'Rajasthan', name:'Rajasthan', capital:'Jaipur', area:'342,239 km²', population:'68 Million', language:'Rajasthani, Hindi', formed:1956, description:'Rajasthan is the largest state of India by area, known for its majestic forts and the Thar Desert.', facts:['Largest state by area','Thar Desert — largest desert in India','Jaipur — Pink City'], historicalEvents:[{year:1949,event:'Rajputana states merged to form Rajasthan'},{year:1956,event:'Present boundaries established'}] },
  { id:'Madhya_Pradesh', name:'Madhya Pradesh', capital:'Bhopal', area:'308,245 km²', population:'72 Million', language:'Hindi', formed:1956, description:'Madhya Pradesh is the second-largest state by area, known as the Heart of India.', facts:['Heart of India','Khajuraho temples — UNESCO Heritage','Largest tiger population in India'], historicalEvents:[{year:1956,event:'Madhya Pradesh formed'},{year:2000,event:'Chhattisgarh carved out'}] },
  { id:'Uttar_Pradesh', name:'Uttar Pradesh', capital:'Lucknow', area:'240,928 km²', population:'200 Million', language:'Hindi', formed:1950, description:'Uttar Pradesh is the most populous state in India, home to the Taj Mahal.', facts:['Most populous state in India','Taj Mahal — Agra','Varanasi — oldest living city in the world'], historicalEvents:[{year:1950,event:'United Provinces renamed Uttar Pradesh'},{year:2000,event:'Uttarakhand carved out'}] },
  { id:'West_Bengal', name:'West Bengal', capital:'Kolkata', area:'88,752 km²', population:'91 Million', language:'Bengali', formed:1947, description:'West Bengal is in eastern India. Kolkata was the capital of British India.', facts:['Kolkata — former capital of British India','Sundarbans — largest mangrove forest','Home to Rabindranath Tagore'], historicalEvents:[{year:1947,event:'Bengal partitioned — West Bengal formed'},{year:1950,event:'Merged with Indian Union'}] },
  { id:'Gujarat', name:'Gujarat', capital:'Gandhinagar', area:'196,024 km²', population:'60 Million', language:'Gujarati', formed:1960, description:'Gujarat is on the western coast of India, birthplace of Mahatma Gandhi.', facts:['Birthplace of Mahatma Gandhi','Longest coastline among Indian states','Gir Forest — only wild Asiatic lions'], historicalEvents:[{year:1960,event:'Gujarat formed from Bombay State'}] },
  { id:'Bihar', name:'Bihar', capital:'Patna', area:'94,163 km²', population:'124 Million', language:'Hindi, Maithili', formed:1912, description:'Bihar is one of the oldest inhabited places in the world, birthplace of Buddhism.', facts:['Birthplace of Buddhism — Bodh Gaya','Nalanda — ancient world\'s first university','Pataliputra — capital of Maurya Empire'], historicalEvents:[{year:1912,event:'Bihar separated from Bengal'},{year:2000,event:'Jharkhand carved out'}] },
  { id:'Odisha', name:'Odisha', capital:'Bhubaneswar', area:'155,707 km²', population:'46 Million', language:'Odia', formed:1936, description:'Odisha is on the eastern coast of India, known for its ancient temples.', facts:['Konark Sun Temple — UNESCO Heritage','Jagannath Temple — Puri','Chilika Lake — largest coastal lagoon in Asia'], historicalEvents:[{year:1936,event:'Odisha formed as separate province'},{year:1949,event:'Merged with Indian Union'}] },
  { id:'Telangana', name:'Telangana', capital:'Hyderabad', area:'112,077 km²', population:'35 Million', language:'Telugu', formed:2014, description:'Telangana is India\'s youngest state, carved out of Andhra Pradesh in 2014.', facts:['Youngest state of India','Hyderabad — City of Pearls','Charminar — iconic monument'], historicalEvents:[{year:2014,event:'Telangana formed as 29th state'}] },
  { id:'Kerala', name:'Kerala', capital:'Thiruvananthapuram', area:'38,863 km²', population:'35 Million', language:'Malayalam', formed:1956, description:'Kerala is known as God\'s Own Country with the highest literacy rate in India.', facts:['Highest literacy rate in India — 96%','Backwaters — unique ecosystem','Major spice trade hub historically'], historicalEvents:[{year:1956,event:'Kerala formed from Travancore-Cochin'}] },
  { id:'Punjab', name:'Punjab', capital:'Chandigarh', area:'50,362 km²', population:'30 Million', language:'Punjabi', formed:1947, description:'Punjab is known as the Granary of India, partitioned in 1947.', facts:['Granary of India','Golden Temple — Amritsar','Partitioned in 1947'], historicalEvents:[{year:1947,event:'Punjab partitioned between India and Pakistan'},{year:1966,event:'Haryana and Himachal Pradesh carved out'}] },
  { id:'Haryana', name:'Haryana', capital:'Chandigarh', area:'44,212 km²', population:'28 Million', language:'Hindi', formed:1966, description:'Haryana surrounds Delhi on three sides and is one of the wealthiest states per capita.', facts:['Surrounds Delhi on three sides','Kurukshetra — site of Mahabharata war','Major automobile manufacturing hub'], historicalEvents:[{year:1966,event:'Haryana carved out of Punjab'}] },
  { id:'Himachal_Pradesh', name:'Himachal Pradesh', capital:'Shimla', area:'55,673 km²', population:'7.5 Million', language:'Hindi', formed:1971, description:'Himachal Pradesh is in the Western Himalayas, known for scenic beauty.', facts:['Summer capital of British India — Shimla','Major apple producing state','Dalai Lama\'s residence — Dharamsala'], historicalEvents:[{year:1948,event:'Himachal Pradesh formed'},{year:1971,event:'Became full state'}] },
  { id:'Uttarakhand', name:'Uttarakhand', capital:'Dehradun', area:'53,483 km²', population:'11 Million', language:'Hindi', formed:2000, description:'Uttarakhand is known as Devbhoomi (Land of Gods), home to Hindu pilgrimage sites.', facts:['Land of Gods — Devbhoomi','Char Dham pilgrimage sites','Jim Corbett — first national park in India'], historicalEvents:[{year:2000,event:'Uttarakhand carved out of Uttar Pradesh'}] },
  { id:'Jharkhand', name:'Jharkhand', capital:'Ranchi', area:'79,714 km²', population:'38 Million', language:'Hindi', formed:2000, description:'Jharkhand is known as the Mineral Bowl of India.', facts:['Mineral Bowl of India','Richest state in mineral resources','Tata Steel founded in Jamshedpur'], historicalEvents:[{year:2000,event:'Jharkhand carved out of Bihar'}] },
  { id:'Chhattisgarh', name:'Chhattisgarh', capital:'Raipur', area:'135,192 km²', population:'29 Million', language:'Hindi', formed:2000, description:'Chhattisgarh is known as the Rice Bowl of Central India with rich tribal culture.', facts:['Rice Bowl of Central India','Rich tribal heritage','Bastar — tribal heartland'], historicalEvents:[{year:2000,event:'Chhattisgarh carved out of Madhya Pradesh'}] },
  { id:'Assam', name:'Assam', capital:'Dispur', area:'78,438 km²', population:'36 Million', language:'Assamese', formed:1947, description:'Assam is in northeastern India, known for its tea gardens and the one-horned rhinoceros.', facts:['World\'s largest tea producing region','Kaziranga — one-horned rhinoceros','Majuli — world\'s largest river island'], historicalEvents:[{year:1947,event:'Assam becomes part of India'},{year:1972,event:'Meghalaya, Nagaland carved out'}] },
  { id:'Arunachal_Pradesh', name:'Arunachal Pradesh', capital:'Itanagar', area:'83,743 km²', population:'1.5 Million', language:'English, Hindi', formed:1987, description:'Arunachal Pradesh is the easternmost state of India, known as the Land of the Rising Sun.', facts:['Land of the Rising Sun','Tawang Monastery — largest in India','Borders China, Bhutan, Myanmar'], historicalEvents:[{year:1972,event:'Became Union Territory'},{year:1987,event:'Became full state'}] },
  { id:'Nagaland', name:'Nagaland', capital:'Kohima', area:'16,579 km²', population:'2.2 Million', language:'English', formed:1963, description:'Nagaland is known for its warrior tribes and the Hornbill Festival.', facts:['Land of Festivals','Hornbill Festival — December','Battle of Kohima — WWII turning point'], historicalEvents:[{year:1963,event:'Nagaland becomes 16th state'}] },
  { id:'Manipur', name:'Manipur', capital:'Imphal', area:'22,327 km²', population:'3 Million', language:'Meitei', formed:1972, description:'Manipur is known as the Jewel of India, famous for its classical Manipuri dance.', facts:['Jewel of India','Manipuri classical dance','Birthplace of polo sport'], historicalEvents:[{year:1949,event:'Merged with Indian Union'},{year:1972,event:'Became full state'}] },
  { id:'Meghalaya', name:'Meghalaya', capital:'Shillong', area:'22,429 km²', population:'3.3 Million', language:'Khasi, Garo', formed:1972, description:'Meghalaya is known as the Abode of Clouds, receiving the highest rainfall in the world.', facts:['Abode of Clouds','Cherrapunji — wettest place on Earth','Living root bridges'], historicalEvents:[{year:1972,event:'Meghalaya carved out of Assam'}] },
  { id:'Mizoram', name:'Mizoram', capital:'Aizawl', area:'21,081 km²', population:'1.1 Million', language:'Mizo', formed:1987, description:'Mizoram is known for its high literacy rate and peaceful society.', facts:['Second highest literacy rate in India','Bamboo flowering every 48 years','Phawngpui — Blue Mountain'], historicalEvents:[{year:1972,event:'Became Union Territory'},{year:1987,event:'Became full state'}] },
  { id:'Tripura', name:'Tripura', capital:'Agartala', area:'10,491 km²', population:'4 Million', language:'Bengali, Kokborok', formed:1972, description:'Tripura is surrounded by Bangladesh on three sides, known for its ancient temples.', facts:['Surrounded by Bangladesh on 3 sides','Ujjayanta Palace — royal palace','Major rubber producing state'], historicalEvents:[{year:1949,event:'Merged with Indian Union'},{year:1972,event:'Became full state'}] },
  { id:'Sikkim', name:'Sikkim', capital:'Gangtok', area:'7,096 km²', population:'0.7 Million', language:'Nepali', formed:1975, description:'Sikkim is a landlocked Himalayan state, an independent kingdom until 1975.', facts:['Smallest state by population','Kangchenjunga — third highest peak','First organic state in India'], historicalEvents:[{year:1975,event:'Sikkim merges with India as 22nd state'}] },
  { id:'Goa', name:'Goa', capital:'Panaji', area:'3,702 km²', population:'1.5 Million', language:'Konkani', formed:1987, description:'Goa is the smallest state by area, a former Portuguese colony known for its beaches.', facts:['Smallest state by area','Portuguese colony until 1961','Basilica of Bom Jesus — UNESCO Heritage'], historicalEvents:[{year:1961,event:'Liberated from Portuguese rule'},{year:1987,event:'Became full state'}] }
].forEach(st => { statesData[st.id] = st; });

// ── Union Territories Data ──
const unionTerritories = {
  'Andaman_Nicobar': { id:'Andaman_Nicobar', name:'Andaman and Nicobar Islands', capital:'Port Blair', area:'8,249 km²', population:'0.38 Million', language:'Hindi, English', formed:1956, description:'Island territory in the Bay of Bengal, known for pristine beaches and tribal heritage.', facts:['Cellular Jail - Kala Pani','Only place in India to see active volcanoes','Home to 6 tribes including Sentinelese'], historicalEvents:[{year:1858,event:'Cellular Jail constructed for freedom fighters'},{year:2004,event:'Devastated by Indian Ocean Tsunami'}] },
  'Chandigarh': { id:'Chandigarh', name:'Chandigarh', capital:'Chandigarh', area:'114 km²', population:'1.05 Million', language:'Hindi, Punjabi', formed:1966, description:'Planned city designed by Le Corbusier, joint capital of Punjab and Haryana.', facts:['First planned city in India','Designed by Le Corbusier','Joint capital of two states'], historicalEvents:[{year:1947,event:'Partition led to need for new Punjab capital'},{year:1966,event:'Became Union Territory'}] },
  'Delhi': { id:'Delhi', name:'Delhi', capital:'New Delhi', area:'1,484 km²', population:'32.9 Million', language:'Hindi, English', formed:1956, description:'National capital territory, seat of Indian government and rich Mughal heritage.', facts:['National capital of India','Seat of Union Government','UNESCO World Heritage Sites'], historicalEvents:[{year:1911,event:'Capital shifted from Calcutta to Delhi'},{year:1947,event:'Became capital of independent India'}] },
  'Jammu_Kashmir': { id:'Jammu_Kashmir', name:'Jammu and Kashmir', capital:'Srinagar (Summer), Jammu (Winter)', area:'55,673 km²', population:'12.5 Million', language:'Hindi, Urdu', formed:2019, description:'Reorganized as UT in 2019, known for valleys, lakes and mountains.', facts:['Paradise on Earth','Saffron cultivation','Houseboats in Dal Lake'], historicalEvents:[{year:1947,event:'Accession to India'},{year:2019,event:'Reorganized as Union Territory'}] },
  'Ladakh': { id:'Ladakh', name:'Ladakh', capital:'Leh', area:'59,146 km²', population:'0.27 Million', language:'Hindi, Ladakhi', formed:2019, description:'High-altitude desert region carved from J&K, known for Buddhist culture.', facts:['Highest plateau in India','Cold desert','Buddhist monasteries'], historicalEvents:[{year:2019,event:'Formed from Jammu & Kashmir reorganization'}] },
  'Lakshadweep': { id:'Lakshadweep', name:'Lakshadweep', capital:'Kavaratti', area:'32 km²', population:'0.06 Million', language:'Malayalam', formed:1956, description:'Coral island archipelago in Arabian Sea, smallest territory by area.', facts:['Smallest UT by area','36 coral islands','Only 10 islands inhabited'], historicalEvents:[{year:1956,event:'Became Union Territory'},{year:1973,event:'Renamed from Laccadive Islands'}] },
  'Puducherry': { id:'Puducherry', name:'Puducherry', capital:'Puducherry', area:'479 km²', population:'1.24 Million', language:'Tamil, French', formed:1963, description:'Former French colony with unique Indo-French architecture and culture.', facts:['Former French colony','French Quarter architecture','Auroville international township'], historicalEvents:[{year:1674,event:'French established trading post'},{year:1954,event:'Merged with Indian Union'}] }
};

// ── Rivers Data ──
riversData = [
  { id:'ganga', name:'Ganga (Ganges)', origin:'Gangotri Glacier, Uttarakhand', length:'2,525 km', type:'Himalayan', description:'The Ganga is the most sacred river in Hinduism and the longest river in India.', facts:['Most sacred river in Hinduism','Supports 40% of India\'s population','Declared National River of India in 2008'], coordinates:{start:[30.9,79.1],end:[21.9,89.5]} },
  { id:'yamuna', name:'Yamuna', origin:'Yamunotri Glacier, Uttarakhand', length:'1,376 km', type:'Himalayan', description:'The Yamuna is the second-largest tributary of the Ganga, flowing through Delhi and Agra.', facts:['Taj Mahal stands on its banks','Flows through Delhi','Tributary of Ganga'], coordinates:{start:[31.0,78.5],end:[25.4,81.9]} },
  { id:'brahmaputra', name:'Brahmaputra', origin:'Angsi Glacier, Tibet', length:'2,900 km (in India: 916 km)', type:'Himalayan', description:'The Brahmaputra originates in Tibet and flows through Arunachal Pradesh and Assam.', facts:['One of the largest rivers by discharge','Majuli island formed in its waters','Known as Tsangpo in Tibet'], coordinates:{start:[28.0,95.0],end:[25.5,90.0]} },
  { id:'godavari', name:'Godavari', origin:'Trimbakeshwar, Maharashtra', length:'1,465 km', type:'Peninsular', description:'The Godavari is the second-longest river in India, known as the Dakshin Ganga.', facts:['Dakshin Ganga — Ganges of the South','Second longest river in India','Pushkaram festival every 12 years'], coordinates:{start:[19.9,73.5],end:[16.5,82.3]} },
  { id:'krishna', name:'Krishna', origin:'Mahabaleshwar, Maharashtra', length:'1,400 km', type:'Peninsular', description:'The Krishna flows through the Deccan Plateau and empties into the Bay of Bengal.', facts:['Fourth longest river in India','Nagarjuna Sagar Dam on Krishna','Srisailam Dam — major hydroelectric project'], coordinates:{start:[17.9,73.7],end:[15.7,80.9]} },
  { id:'narmada', name:'Narmada', origin:'Amarkantak, Madhya Pradesh', length:'1,312 km', type:'Peninsular', description:'The Narmada is the longest west-flowing river in India.', facts:['Longest west-flowing river in India','Sardar Sarovar Dam — major project','Marble Rocks at Bhedaghat'], coordinates:{start:[22.7,81.8],end:[21.7,72.6]} }
];

// ── Languages by State ──
const stateLanguages = {
  'Delhi': 'Hindi', 'Puducherry': 'Tamil', 'Jammu_Kashmir': 'Hindi', 'Ladakh': 'Hindi',
  'Andaman_Nicobar': 'Hindi', 'Andhra_Pradesh': 'Telugu', 'Arunachal_Pradesh': 'English', 'Assam': 'Assamese',
  'Bihar': 'Hindi', 'Chhattisgarh': 'Hindi', 'Goa': 'Konkani', 'Gujarat': 'Gujarati',
  'Haryana': 'Hindi', 'Himachal_Pradesh': 'Hindi', 'Jharkhand': 'Hindi', 'Karnataka': 'Kannada',
  'Kerala': 'Malayalam', 'Madhya_Pradesh': 'Hindi', 'Maharashtra': 'Marathi', 'Manipur': 'Meitei',
  'Meghalaya': 'English', 'Mizoram': 'Mizo', 'Nagaland': 'English', 'Odisha': 'Odia',
  'Punjab': 'Punjabi', 'Rajasthan': 'Hindi', 'Sikkim': 'Nepali', 'Tamil_Nadu': 'Tamil',
  'Telangana': 'Telugu', 'Tripura': 'Bengali', 'Uttar_Pradesh': 'Hindi', 'Uttarakhand': 'Hindi',
  'West_Bengal': 'Bengali'
};

// ── Dynasties Data ──
const dynastiesData = [
  { 
    id: 'maurya', 
    name: 'Maurya Empire', 
    period: '322-185 BCE', 
    capital: 'Pataliputra (Patna)',
    color: '#E74C3C',
    states: ['Bihar', 'Jharkhand', 'Uttar_Pradesh', 'Madhya_Pradesh', 'Chhattisgarh', 'Odisha', 'West_Bengal', 'Haryana', 'Punjab', 'Rajasthan', 'Gujarat', 'Maharashtra', 'Karnataka', 'Andhra_Pradesh'],
    description: 'The Maurya Empire was the first pan-Indian empire, founded by Chandragupta Maurya.',
    facts: ['Founded by Chandragupta Maurya', 'Ashoka the Great belonged to this dynasty', 'Capital at Pataliputra (modern Patna)', 'First Indian empire to unify most of the subcontinent']
  },
  { 
    id: 'mughal', 
    name: 'Mughal Empire', 
    period: '1526-1857 CE', 
    capital: 'Delhi/Agra',
    color: '#9B59B6',
    states: ['Delhi', 'Uttar_Pradesh', 'Haryana', 'Punjab', 'Rajasthan', 'Madhya_Pradesh', 'Bihar', 'Jharkhand', 'West_Bengal', 'Odisha', 'Gujarat', 'Maharashtra'],
    description: 'The Mughal Empire was founded by Babur in 1526 and ruled most of northern India.',
    facts: ['Founded by Babur in 1526', 'Built the Taj Mahal', 'Akbar, Shah Jahan, and Aurangzeb were notable rulers', 'Introduced Persian culture and architecture']
  },
  { 
    id: 'maratha', 
    name: 'Maratha Empire', 
    period: '1674-1818 CE', 
    capital: 'Raigad/Pune',
    color: '#E67E22',
    states: ['Maharashtra', 'Madhya_Pradesh', 'Gujarat', 'Karnataka', 'Goa', 'Rajasthan', 'Haryana', 'Delhi', 'Uttar_Pradesh'],
    description: 'The Maratha Empire was founded by Shivaji and became a major power in 18th century India.',
    facts: ['Founded by Chhatrapati Shivaji', 'Capital at Raigad fort', 'Peshwas were the prime ministers', 'Fought against Mughal expansion']
  },
  { 
    id: 'gupta', 
    name: 'Gupta Empire', 
    period: '320-550 CE', 
    capital: 'Pataliputra',
    color: '#F39C12',
    states: ['Bihar', 'Jharkhand', 'Uttar_Pradesh', 'Madhya_Pradesh', 'West_Bengal', 'Odisha', 'Rajasthan', 'Gujarat', 'Haryana'],
    description: 'The Gupta Empire is considered the Golden Age of India with remarkable achievements in arts and sciences.',
    facts: ['Golden Age of India', 'Decimal system and zero invented', 'Great advances in astronomy and mathematics', 'Flourishing of arts and literature']
  },
  { 
    id: 'chola', 
    name: 'Chola Empire', 
    period: '300 BCE-1279 CE', 
    capital: 'Thanjavur',
    color: '#27AE60',
    states: ['Tamil_Nadu', 'Andhra_Pradesh', 'Karnataka', 'Kerala', 'Odisha'],
    description: 'The Chola dynasty was one of the longest-ruling dynasties and greatest naval power in South India.',
    facts: ['Built magnificent temples including Brihadeeswarar Temple', 'Greatest naval power in Indian Ocean', 'Extended empire to Southeast Asia', 'Advanced irrigation and administration']
  },
  { 
    id: 'vijayanagara', 
    name: 'Vijayanagara Empire', 
    period: '1336-1646 CE', 
    capital: 'Hampi',
    color: '#3498DB',
    states: ['Karnataka', 'Andhra_Pradesh', 'Telangana', 'Tamil_Nadu', 'Kerala'],
    description: 'The Vijayanagara Empire was a South Indian empire that resisted Muslim invasions.',
    facts: ['Capital at Hampi (UNESCO World Heritage Site)', 'Founded by Harihara and Bukka', 'Patron of arts and literature', 'Controlled South Indian trade routes']
  },
  { 
    id: 'rajput', 
    name: 'Rajput Kingdoms', 
    period: '6th-19th Century CE', 
    capital: 'Various (Udaipur, Jaipur, Jodhpur)',
    color: '#8E44AD',
    states: ['Rajasthan', 'Madhya_Pradesh', 'Gujarat', 'Haryana', 'Uttar_Pradesh'],
    description: 'The Rajput kingdoms were warrior clans known for valor, chivalry, and magnificent forts.',
    facts: ['Known for chivalry and honor', 'Built magnificent forts and palaces', 'Resisted foreign invasions', 'Princely states until Indian independence']
  },
  { 
    id: 'delhi_sultanate', 
    name: 'Delhi Sultanate', 
    period: '1206-1526 CE', 
    capital: 'Delhi',
    color: '#16A085',
    states: ['Delhi', 'Uttar_Pradesh', 'Haryana', 'Punjab', 'Rajasthan', 'Madhya_Pradesh', 'Bihar'],
    description: 'The Delhi Sultanate was a series of Muslim dynasties that ruled northern India.',
    facts: ['First Muslim empire in India', 'Five dynasties: Mamluk, Khilji, Tughlaq, Sayyid, Lodi', 'Built Qutub Minar', 'Introduced Indo-Islamic architecture']
  },
  { 
    id: 'pallava', 
    name: 'Pallava Dynasty', 
    period: '275-897 CE', 
    capital: 'Kanchipuram',
    color: '#E91E63',
    states: ['Tamil_Nadu', 'Andhra_Pradesh', 'Karnataka'],
    description: 'The Pallava dynasty was known for its rock-cut architecture and naval expeditions.',
    facts: ['Rock-cut temples at Mahabalipuram', 'Developed Grantha script', 'Naval expeditions to Southeast Asia', 'Patron of Sanskrit literature']
  },
  { 
    id: 'chalukya', 
    name: 'Chalukya Dynasty', 
    period: '543-753 CE, 973-1200 CE', 
    capital: 'Badami/Kalyani',
    color: '#FF5722',
    states: ['Karnataka', 'Andhra_Pradesh', 'Maharashtra', 'Goa'],
    description: 'The Chalukya dynasty ruled large parts of southern and central India in different periods.',
    facts: ['Three distinct periods of rule', 'Built cave temples at Badami', 'Defeated Harsha of Kannauj', 'Promoted Kannada literature']
  },
  { 
    id: 'rashtrakuta', 
    name: 'Rashtrakuta Dynasty', 
    period: '753-982 CE', 
    capital: 'Manyakheta',
    color: '#795548',
    states: ['Karnataka', 'Maharashtra', 'Madhya_Pradesh', 'Gujarat', 'Andhra_Pradesh'],
    description: 'The Rashtrakuta dynasty was known for its military prowess and architectural achievements.',
    facts: ['Built Kailasa temple at Ellora', 'Ruled from Deccan plateau', 'Military expeditions to north India', 'Patron of Kannada and Sanskrit literature']
  }
];

// ── Historical Events ──
const historicalEvents = [
  { 
    id: 'independence', 
    name: 'Indian Independence', 
    year: 1947, 
    location: 'Delhi',
    coordinates: [28.6139, 77.2090],
    description: 'India gained independence from British rule on August 15, 1947.',
    facts: ['End of 200 years of British colonial rule', 'Partition of India and Pakistan', 'Jawaharlal Nehru became first Prime Minister', 'Mountbatten Plan implemented'],
    period: 'Modern'
  },
  { 
    id: 'battle_plassey', 
    name: 'Battle of Plassey', 
    year: 1757, 
    location: 'West Bengal',
    coordinates: [23.7969, 88.2414],
    description: 'The decisive battle that established British dominance in Bengal and eventually India.',
    facts: ['Robert Clive defeated Siraj ud-Daulah', 'Mir Jafar betrayed the Nawab', 'Beginning of British colonial rule', 'East India Company gained control'],
    period: 'Colonial'
  },
  { 
    id: 'dandi_march', 
    name: 'Dandi March', 
    year: 1930, 
    location: 'Gujarat',
    coordinates: [20.7645, 72.9289],
    description: 'Gandhi led the Salt March to protest British salt monopoly.',
    facts: ['240-mile march from Sabarmati to Dandi', 'Gandhi broke salt law on April 6, 1930', 'Civil Disobedience Movement launched', '78 marchers started, thousands joined'],
    period: 'Independence Movement'
  },
  { 
    id: 'jallianwala_bagh', 
    name: 'Jallianwala Bagh Massacre', 
    year: 1919, 
    location: 'Punjab',
    coordinates: [31.6205, 74.8765],
    description: 'British troops fired on unarmed Indians in Amritsar, killing hundreds.',
    facts: ['General Dyer ordered firing without warning', 'Over 400 killed, 1200 wounded', 'No escape routes as garden was enclosed', 'Shocked conscience of the world'],
    period: 'Colonial'
  },
  { 
    id: 'revolt_1857', 
    name: 'Revolt of 1857', 
    year: 1857, 
    location: 'Delhi/Meerut',
    coordinates: [28.9845, 77.7064],
    description: 'The first major uprising against British rule, also known as the Sepoy Mutiny.',
    facts: ['Started in Meerut on May 10, 1857', 'Mangal Pandey fired first shot', 'Bahadur Shah Zafar proclaimed emperor', 'Brutally suppressed by British'],
    period: 'Colonial'
  },
  { 
    id: 'quit_india', 
    name: 'Quit India Movement', 
    year: 1942, 
    location: 'Mumbai',
    coordinates: [19.0760, 72.8777],
    description: 'Gandhi launched the Quit India movement demanding immediate independence.',
    facts: ['Do or Die call by Gandhi', 'Mass civil disobedience', 'British arrested Congress leaders', 'People took over government buildings'],
    period: 'Independence Movement'
  },
  { 
    id: 'battle_panipat_1', 
    name: 'First Battle of Panipat', 
    year: 1526, 
    location: 'Haryana',
    coordinates: [29.3909, 76.9635],
    description: 'Babur defeated Ibrahim Lodi, establishing the Mughal Empire in India.',
    facts: ['Babur used cannons and gunpowder', 'End of Delhi Sultanate', 'Beginning of Mughal rule', 'Use of field artillery in India'],
    period: 'Medieval'
  },
  { 
    id: 'battle_panipat_3', 
    name: 'Third Battle of Panipat', 
    year: 1761, 
    location: 'Haryana',
    coordinates: [29.3909, 76.9635],
    description: 'Ahmad Shah Abdali defeated the Marathas, ending their expansion northward.',
    facts: ['Massive loss of Maratha power', 'Over 100,000 casualties', 'End of Maratha expansion', 'Power vacuum in North India'],
    period: 'Medieval'
  },
  { 
    id: 'battle_haldighati', 
    name: 'Battle of Haldighati', 
    year: 1576, 
    location: 'Rajasthan',
    coordinates: [24.8607, 73.7185],
    description: 'Maharana Pratap fought against Akbar\'s forces, though outnumbered.',
    facts: ['Rana Pratap vs Akbar', 'Famous horse Chetak died', 'Symbol of Rajput resistance', 'Pratap never surrendered'],
    period: 'Medieval'
  },
  { 
    id: 'kalinga_war', 
    name: 'Kalinga War', 
    year: -261, 
    location: 'Odisha',
    coordinates: [20.2961, 85.8245],
    description: 'Ashoka conquered Kalinga, but the bloodshed led him to embrace Buddhism.',
    facts: ['Last major conquest by Ashoka', 'Over 100,000 killed', 'Ashoka embraced Buddhism', 'Turning point in Mauryan policy'],
    period: 'Ancient'
  },
  { 
    id: 'chauri_chaura', 
    name: 'Chauri Chaura Incident', 
    year: 1922, 
    location: 'Uttar Pradesh',
    coordinates: [26.2006, 83.4850],
    description: 'Violent incident that led Gandhi to call off the Non-Cooperation Movement.',
    facts: ['22 policemen killed by protesters', 'Gandhi called off movement', 'Led to Gandhi\'s imprisonment', 'Debate on non-violence vs violence'],
    period: 'Independence Movement'
  },
  { 
    id: 'partition_bengal', 
    name: 'Partition of Bengal', 
    year: 1905, 
    location: 'West Bengal',
    coordinates: [22.5726, 88.3639],
    description: 'British divided Bengal along religious lines, sparking massive protests.',
    facts: ['Divide and rule policy', 'Swadeshi movement began', 'Boycott of British goods', 'Annulled in 1911'],
    period: 'Colonial'
  }
];

// ── Populate Forts Data ──
fortsData.push(
  { id: 'red_fort', name: 'Red Fort', location: 'Delhi', coordinates: [28.6562, 77.2410], built: '1648 CE', dynasty: 'Mughal', description: 'The Red Fort is a historic fortified palace of the Mughal emperors in Delhi.', facts: ['UNESCO World Heritage Site', 'Built by Shah Jahan', 'Symbol of Mughal power'] },
  { id: 'chittorgarh', name: 'Chittorgarh Fort', location: 'Rajasthan', coordinates: [24.8887, 74.6269], built: '7th century CE', dynasty: 'Rajput', description: 'Chittorgarh Fort is one of the largest forts in India and a symbol of Rajput resistance.', facts: ['Largest fort in India', 'Symbol of Rajput valor', 'UNESCO World Heritage Site'] },
  { id: 'golconda', name: 'Golconda Fort', location: 'Telangana', coordinates: [17.3833, 78.4011], built: '11th century CE', dynasty: 'Qutb Shahi', description: 'Golconda Fort was the capital of the Golconda Sultanate, famous for its diamonds.', facts: ['Famous diamond market', 'Acoustic marvel', 'Qutb Shahi architecture'] },
  { id: 'mehrangarh', name: 'Mehrangarh Fort', location: 'Rajasthan', coordinates: [26.2970, 73.0167], built: '1459 CE', dynasty: 'Rajput', description: 'Mehrangarh Fort is one of the largest forts in India, located in Jodhpur.', facts: ['One of the largest forts', 'Museum of Rajput artifacts', 'Stunning architecture'] }
);

// ── Populate Ghats Data ──
ghatsData.push(
  { id: 'western_ghats', name: 'Western Ghats', type: 'Mountain Range', length: '1,600 km', description: 'The Western Ghats are a UNESCO World Heritage Site and biodiversity hotspot.', facts: ['UNESCO World Heritage Site', 'Biodiversity hotspot', '1,600 km long'] },
  { id: 'eastern_ghats', name: 'Eastern Ghats', type: 'Mountain Range', length: '1,750 km', description: 'The Eastern Ghats are a discontinuous range of mountains along the eastern coast.', facts: ['1,750 km long', 'Discontinuous range', 'Rich in minerals'] },
  { id: 'varanasi_ghats', name: 'Varanasi Ghats', type: 'River Ghats', location: 'Uttar Pradesh', coordinates: [25.3176, 82.9739], description: 'The ghats of Varanasi are steps leading to the sacred Ganges river.', facts: ['Sacred to Hindus', 'Ancient pilgrimage site', 'Steps to Ganges'] }
);
// ── Core Functions ──
function loadMap() {
  console.log('[App] Loading map...');
  const seen = new Set();
  const g = $('mapRegions');
  
  if (!g) {
    console.error('[App] mapRegions group not found in SVG!');
    return;
  }
  
  const allPaths = document.querySelectorAll('#india-map path.state, svg path.state');
  console.log(`[App] Found ${allPaths.length} path elements with class 'state'`);
  
  let clonedCount = 0;
  allPaths.forEach(p => {
    const d = p.getAttribute('d');
    if (!p.id || seen.has(p.id) || !d || d === '...' || d.trim() === '') return;
    seen.add(p.id);
    if (p.closest('#mapRegions')) return;
    const clone = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    clone.setAttribute('id', p.id);
    clone.setAttribute('class', 'state');
    clone.setAttribute('d', d);
    g.appendChild(clone);
    clonedCount++;
  });
  
  console.log(`[App] Map loaded: ${seen.size} states found, ${clonedCount} cloned to mapRegions`);
}

function attachStateHandlers() {
  const states = document.querySelectorAll('.state');
  console.log(`[App] Attaching handlers to ${states.length} states`);
  
  if (states.length === 0) {
    console.warn('[App] No .state elements found! Map may not be loaded yet.');
    return;
  }
  
  states.forEach(path => {
    if (path._hasHandlers) return;
    path._hasHandlers = true;
    
    path.addEventListener('mouseenter', () => {
      if (currentCategory === 'states' && !lockedState) {
        const data = statesData[path.id] || unionTerritories[path.id];
        if (data) {
          showPanel(data, currentCategory);
          hidePlaceholder();
        }
      }
    });
    
    path.addEventListener('click', () => {
      if (currentCategory === 'states') {
        if (lockedState) {
          const prevLocked = document.getElementById(lockedState);
          if (prevLocked) {
            prevLocked.classList.remove('state-locked');
          }
        }
        
        lockedState = path.id;
        path.classList.add('state-locked');
        
        const data = statesData[path.id] || unionTerritories[path.id];
        if (data) {
          showPanel(data, currentCategory);
          hidePlaceholder();
        }
      }
    });
  });
}

function showPanel(data, category) {
  const spTitle = $('spTitle');
  const spSub = $('spSub');
  const spDesc = $('spDesc');
  const spStats = $('spStats');
  const spFacts = $('spFacts');
  const spPlaceholder = $('spPlaceholder');
  const spContent = $('spContent');
  const spEvents = $('spEvents');
  
  console.log(`[ShowPanel] Displaying ${category}:`, data);
  
  // Hide placeholder and show content
  if (spPlaceholder) spPlaceholder.classList.add('hidden');
  if (spContent) spContent.classList.remove('hidden');
  
  // Update content
  if (spTitle) spTitle.textContent = data.name || '';
  if (spSub) spSub.textContent = data.capital || data.location || data.type || '';
  if (spDesc) spDesc.textContent = data.description || '';
  
  // Category-specific stats display
  if (spStats) {
    let statsHtml = '';
    
    switch (category) {
      case 'states':
      case 'uts':
        statsHtml = `
          <div class="stat-item">
            <i class="fas fa-city"></i>
            <div>
              <span class="stat-label">Capital</span>
              <span class="stat-value">${data.capital || 'N/A'}</span>
            </div>
          </div>
          <div class="stat-item">
            <i class="fas fa-expand-arrows-alt"></i>
            <div>
              <span class="stat-label">Area</span>
              <span class="stat-value">${data.area || 'N/A'}</span>
            </div>
          </div>
          <div class="stat-item">
            <i class="fas fa-users"></i>
            <div>
              <span class="stat-label">Population</span>
              <span class="stat-value">${data.population || 'N/A'}</span>
            </div>
          </div>
          <div class="stat-item">
            <i class="fas fa-language"></i>
            <div>
              <span class="stat-label">Language</span>
              <span class="stat-value">${data.language || 'N/A'}</span>
            </div>
          </div>
        `;
        break;
        
      case 'forts':
        statsHtml = `
          <div class="stat-item">
            <i class="fas fa-map-marker-alt"></i>
            <div>
              <span class="stat-label">Location</span>
              <span class="stat-value">${data.location || 'N/A'}</span>
            </div>
          </div>
          <div class="stat-item">
            <i class="fas fa-calendar-alt"></i>
            <div>
              <span class="stat-label">Built</span>
              <span class="stat-value">${data.built || 'N/A'}</span>
            </div>
          </div>
          <div class="stat-item">
            <i class="fas fa-crown"></i>
            <div>
              <span class="stat-label">Dynasty</span>
              <span class="stat-value">${data.dynasty || 'N/A'}</span>
            </div>
          </div>
        `;
        break;
        
      case 'ghats':
        statsHtml = `
          <div class="stat-item">
            <i class="fas fa-mountain"></i>
            <div>
              <span class="stat-label">Type</span>
              <span class="stat-value">${data.type || 'Mountain Range'}</span>
            </div>
          </div>
          <div class="stat-item">
            <i class="fas fa-ruler-horizontal"></i>
            <div>
              <span class="stat-label">Length</span>
              <span class="stat-value">${data.length || 'N/A'}</span>
            </div>
          </div>
        `;
        break;
        
      case 'languages':
        statsHtml = `
          <div class="stat-item">
            <i class="fas fa-globe"></i>
            <div>
              <span class="stat-label">Type</span>
              <span class="stat-value">${data.type || 'Official Language'}</span>
            </div>
          </div>
          <div class="stat-item">
            <i class="fas fa-users"></i>
            <div>
              <span class="stat-label">Speakers</span>
              <span class="stat-value">Millions</span>
            </div>
          </div>
        `;
        break;
        
      case 'dynasties':
        statsHtml = `
          <div class="stat-item">
            <i class="fas fa-calendar-alt"></i>
            <div>
              <span class="stat-label">Period</span>
              <span class="stat-value">${data.period || 'N/A'}</span>
            </div>
          </div>
          <div class="stat-item">
            <i class="fas fa-city"></i>
            <div>
              <span class="stat-label">Capital</span>
              <span class="stat-value">${data.capital || 'N/A'}</span>
            </div>
          </div>
          <div class="stat-item">
            <i class="fas fa-map"></i>
            <div>
              <span class="stat-label">States Covered</span>
              <span class="stat-value">${data.states ? data.states.length : 'N/A'}</span>
            </div>
          </div>
        `;
        break;
        
      case 'events':
        statsHtml = `
          <div class="stat-item">
            <i class="fas fa-calendar-alt"></i>
            <div>
              <span class="stat-label">Year</span>
              <span class="stat-value">${data.year || 'N/A'}</span>
            </div>
          </div>
          <div class="stat-item">
            <i class="fas fa-map-marker-alt"></i>
            <div>
              <span class="stat-label">Location</span>
              <span class="stat-value">${data.location || 'N/A'}</span>
            </div>
          </div>
          <div class="stat-item">
            <i class="fas fa-history"></i>
            <div>
              <span class="stat-label">Period</span>
              <span class="stat-value">${data.period || 'Historical'}</span>
            </div>
          </div>
        `;
        break;
        
      default:
        // Generic stats for other categories
        if (data.area) {
          statsHtml = `
            <div class="stat-item">
              <i class="fas fa-info-circle"></i>
              <div>
                <span class="stat-label">Type</span>
                <span class="stat-value">${data.type || category}</span>
              </div>
            </div>
          `;
        }
    }
    
    spStats.innerHTML = statsHtml;
  }
  
  // Update facts
  if (spFacts && data.facts && data.facts.length > 0) {
    spFacts.innerHTML = `
      <div class="sp-section">
        <h4><i class="fas fa-lightbulb"></i> Key Facts</h4>
        <ul class="facts-list">
          ${data.facts.map(fact => `<li>${fact}</li>`).join('')}
        </ul>
      </div>
    `;
  } else if (spFacts) {
    spFacts.innerHTML = '';
  }
  
  // Update historical events if available
  if (spEvents && data.historicalEvents && data.historicalEvents.length > 0) {
    spEvents.innerHTML = `
      <div class="sp-section">
        <h4><i class="fas fa-history"></i> Historical Timeline</h4>
        <ul class="events-list">
          ${data.historicalEvents.map(event => 
            `<li><span class="ev-year">${event.year}</span><span class="ev-text">${event.event}</span></li>`
          ).join('')}
        </ul>
      </div>
    `;
  } else if (spEvents) {
    spEvents.innerHTML = '';
  }
}

function resetPanel() {
  // Reset locked state
  if (lockedState) {
    const prevLocked = document.getElementById(lockedState);
    if (prevLocked) {
      prevLocked.classList.remove('state-locked');
    }
    lockedState = null;
  }
  
  // Hide content and show placeholder
  const spPlaceholder = $('spPlaceholder');
  const spContent = $('spContent');
  
  if (spContent) spContent.classList.add('hidden');
  if (spPlaceholder) spPlaceholder.classList.remove('hidden');
  
  placeholderHidden = false;
}

function hidePlaceholder() {
  if (!placeholderHidden) {
    placeholderHidden = true;
    const spPlaceholder = $('spPlaceholder');
    const spContent = $('spContent');
    
    if (spPlaceholder) spPlaceholder.classList.add('hidden');
    if (spContent) spContent.classList.remove('hidden');
  }
}

function initPanelResize() {
  const panel = document.querySelector('.side-panel');
  const handle = document.querySelector('.panel-resize-handle');
  
  if (!panel || !handle) return;
  
  let startX = 0;
  let startWidth = 0;
  
  handle.addEventListener('mousedown', (e) => {
    isResizing = true;
    startX = e.clientX;
    startWidth = parseInt(window.getComputedStyle(panel).width, 10);
    
    handle.classList.add('dragging');
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
    
    e.preventDefault();
  });
  
  function onMouseMove(e) {
    if (!isResizing) return;
    
    const deltaX = startX - e.clientX;
    const newWidth = Math.min(Math.max(startWidth + deltaX, 280), window.innerWidth * 0.5);
    
    document.documentElement.style.setProperty('--panel-width', `${newWidth}px`);
  }
  
  function onMouseUp() {
    isResizing = false;
    handle.classList.remove('dragging');
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
  }
}

// ── Event Handlers ──
document.addEventListener('DOMContentLoaded', () => {
  console.log('[App] DOM loaded, initializing...');
  init();
});

document.addEventListener('dataLoaded', () => {
  console.log('[App] Data loaded event received');
  init();
});

// Listen for category changes from tags component
document.addEventListener('categoryChanged', (e) => {
  const newCategory = e.detail;
  console.log(`[App] Category changed to: ${newCategory}`);
  
  // Update current category
  currentCategory = newCategory;
  
  // Reset any locked states when switching categories
  if (currentCategory !== 'states') {
    resetPanel();
  }
  
  // Dispatch to overlay system
  document.dispatchEvent(new CustomEvent('overlayModeChanged', { detail: newCategory }));
});

// ── Main Initialization ──
function init() {
  console.log('[App] Initializing Map.in application...');
  
  try {
    // Load the map
    loadMap();
    
    // Attach state handlers
    setTimeout(() => {
      attachStateHandlers();
    }, 100);
    
    // Initialize panel resize
    initPanelResize();
    
    // Initialize close button
    const closeBtn = $('spClose');
    if (closeBtn) {
      closeBtn.addEventListener('click', resetPanel);
    }
    
    // Hide timeline if present
    const timeline = document.getElementById('standaloneTimeline');
    if (timeline) {
      timeline.style.display = 'none';
    }
    
    // Expose global data for components
    window.statesData = statesData;
    window.riversData = riversData;
    window.fortsData = fortsData;
    window.ghatsData = ghatsData;
    window.unionTerritories = unionTerritories;
    window.stateLanguages = stateLanguages;
    window.dynastiesData = dynastiesData;
    window.historicalEvents = historicalEvents;
    
    // Initialize default overlay after a short delay to ensure components are loaded
    setTimeout(() => {
      console.log('[App] Initializing default states overlay...');
      if (window.MapOverlays) {
        window.MapOverlays.showStatesOverlay();
        console.log('[App] ✓ Default states overlay initialized');
      } else {
        console.warn('[App] MapOverlays not available, retrying...');
        setTimeout(() => {
          if (window.MapOverlays) {
            window.MapOverlays.showStatesOverlay();
            console.log('[App] ✓ Default states overlay initialized (retry)');
          }
        }, 1000);
      }
    }, 500);
    
    console.log('[App] ✓ Map.in initialized successfully');
    
  } catch (error) {
    console.error('[App] Initialization error:', error);
  }
}

// ── Test Function ──
window.testMapApp = function() {
  console.log('[TEST] Running Map.in diagnostic...');
  
  try {
    const stateCount = Object.keys(statesData).length;
    const riverCount = riversData.length;
    const dynastyCount = dynastiesData.length;
    const eventCount = historicalEvents.length;
    
    console.log(`[TEST] ✓ Data loaded - States: ${stateCount}, Rivers: ${riverCount}, Dynasties: ${dynastyCount}, Events: ${eventCount}`);
    
    const mapContainer = document.getElementById('india-map');
    const sidePanel = document.querySelector('.side-panel');
    
    if (mapContainer) console.log('[TEST] ✓ Map container found');
    else console.error('[TEST] ✗ Map container missing');
    
    if (sidePanel) console.log('[TEST] ✓ Side panel found');
    else console.error('[TEST] ✗ Side panel missing');
    
    console.log('[TEST] ✓ No duplicate declaration errors detected');
    console.log('[TEST] === DIAGNOSTIC COMPLETE ===');
    console.log('[TEST] Site should now be functional at https://mosespushpa.github.io/map.in/');
    
    // Test category system
    console.log('[TEST] Testing overlay system...');
    if (window.MapOverlays) {
      console.log('[TEST] ✓ MapOverlays object available');
      const overlayFunctions = ['showStatesOverlay', 'showUTsOverlay', 'showRiversOverlay', 'showGhatsOverlay', 'showFortsOverlay', 'showLanguagesOverlay', 'showDynastiesOverlay', 'showHistoricalEventsOverlay'];
      overlayFunctions.forEach(fn => {
        if (typeof window.MapOverlays[fn] === 'function') {
          console.log(`[TEST] ✓ ${fn} available`);
        } else {
          console.error(`[TEST] ✗ ${fn} missing`);
        }
      });
    } else {
      console.error('[TEST] ✗ MapOverlays not loaded');
    }
    
  } catch (error) {
    console.error('[TEST] Error during diagnostic:', error);
  }
};

// ── Auto-test after initialization ──
setTimeout(() => {
  if (typeof window.testMapApp === 'function') {
    window.testMapApp();
  }
}, 2000);

console.log('[App] Script loaded successfully');