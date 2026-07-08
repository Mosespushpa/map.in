// ── State Variables ──
let statesData = {};
let riversData = [];
let fortsData  = [];
let ghatsData  = [];
let currentCategory = 'states';
let currentYear = 2024;
let isDragging = false;
let isDark = true;

const TAGS = [
  { id: 'states',    label: 'States',           icon: 'fa-map' },
  { id: 'uts',       label: 'Union Territories', icon: 'fa-flag' },
  { id: 'rivers',    label: 'Rivers',            icon: 'fa-water' },
  { id: 'mountains', label: 'Mountains',         icon: 'fa-mountain' },
  { id: 'ghats',     label: 'Ghats',             icon: 'fa-layer-group' },
  { id: 'forts',     label: 'Forts',             icon: 'fa-chess-rook' },
  { id: 'dynasties', label: 'Dynasties',         icon: 'fa-crown' },
  { id: 'languages', label: 'Languages',         icon: 'fa-language' },
  { id: 'events',    label: 'Historical Events', icon: 'fa-landmark' }
];

const MIN_YEAR = 1947, MAX_YEAR = 2024;
let milestones = [];

function $(id) { return document.getElementById(id); }

// ── Part 1: Inline States Data ──
[
  { id:'Andhra_Pradesh', name:'Andhra Pradesh', capital:'Amaravati', area:'162,975 km²', population:'54 Million', language:'Telugu', formed:1956, description:'Andhra Pradesh was formed in 1956 from Telugu-speaking regions of Madras State. Telangana was carved out in 2014.', facts:['Rice Bowl of India','Home to Tirupati temple','Coastline of 974 km along Bay of Bengal'], historicalEvents:[{year:1956,event:'Andhra Pradesh formed from Madras State'},{year:2014,event:'Telangana carved out'}] },
  { id:'Maharashtra', name:'Maharashtra', capital:'Mumbai', area:'307,713 km²', population:'112 Million', language:'Marathi', formed:1960, description:'Maharashtra was formed on May 1, 1960 when Bombay State was divided along linguistic lines.', facts:['Financial capital of India — Mumbai','Home to Bollywood','Ajanta and Ellora Caves — UNESCO Sites'], historicalEvents:[{year:1960,event:'Maharashtra formed from Bombay State'},{year:1995,event:'Bombay renamed to Mumbai'}] },
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

// ── Part 2: Inline Rivers Data ──
riversData = [
  { id:'ganga', name:'Ganga (Ganges)', origin:'Gangotri Glacier, Uttarakhand', length:'2,525 km', type:'Himalayan', description:'The Ganga is the most sacred river in Hinduism and the longest river in India.', facts:['Most sacred river in Hinduism','Supports 40% of India\'s population','Declared National River of India in 2008'], coordinates:{start:[30.9,79.1],end:[21.9,89.5]} },
  { id:'yamuna', name:'Yamuna', origin:'Yamunotri Glacier, Uttarakhand', length:'1,376 km', type:'Himalayan', description:'The Yamuna is the second-largest tributary of the Ganga, flowing through Delhi and Agra.', facts:['Taj Mahal stands on its banks','Flows through Delhi','Tributary of Ganga'], coordinates:{start:[31.0,78.5],end:[25.4,81.9]} },
  { id:'brahmaputra', name:'Brahmaputra', origin:'Angsi Glacier, Tibet', length:'2,900 km (in India: 916 km)', type:'Himalayan', description:'The Brahmaputra originates in Tibet and flows through Arunachal Pradesh and Assam.', facts:['One of the largest rivers by discharge','Majuli island formed in its waters','Known as Tsangpo in Tibet'], coordinates:{start:[28.0,95.0],end:[25.5,90.0]} },
  { id:'godavari', name:'Godavari', origin:'Trimbakeshwar, Maharashtra', length:'1,465 km', type:'Peninsular', description:'The Godavari is the second-longest river in India, known as the Dakshin Ganga.', facts:['Dakshin Ganga — Ganges of the South','Second longest river in India','Pushkaram festival every 12 years'], coordinates:{start:[19.9,73.5],end:[16.5,82.3]} },
  { id:'krishna', name:'Krishna', origin:'Mahabaleshwar, Maharashtra', length:'1,400 km', type:'Peninsular', description:'The Krishna flows through the Deccan Plateau and empties into the Bay of Bengal.', facts:['Fourth longest river in India','Nagarjuna Sagar Dam on Krishna','Srisailam Dam — major hydroelectric project'], coordinates:{start:[17.9,73.7],end:[15.7,80.9]} },
  { id:'narmada', name:'Narmada', origin:'Amarkantak, Madhya Pradesh', length:'1,312 km', type:'Peninsular', description:'The Narmada is the longest west-flowing river in India.', facts:['Longest west-flowing river in India','Sardar Sarovar Dam — major project','Marble Rocks at Bhedaghat'], coordinates:{start:[22.7,81.8],end:[21.7,72.6]} },
  { id:'cauvery', name:'Cauvery (Kaveri)', origin:'Talakaveri, Karnataka', length:'800 km', type:'Peninsular', description:'The Cauvery is a sacred river in South India, source of water for Bengaluru and Chennai.', facts:['Sacred river of South India','Cauvery water dispute between Karnataka and Tamil Nadu','Hogenakkal Falls — Niagara of India'], coordinates:{start:[12.4,75.5],end:[11.1,79.9]} },
  { id:'mahanadi', name:'Mahanadi', origin:'Sihawa, Chhattisgarh', length:'858 km', type:'Peninsular', description:'The Mahanadi is the major river of Odisha. Hirakud Dam is one of the longest earthen dams.', facts:['Hirakud Dam — longest earthen dam','Chilika Lake fed by Mahanadi','Mahanadi means Great River'], coordinates:{start:[20.5,82.1],end:[20.3,86.7]} },
  { id:'indus', name:'Indus', origin:'Tibetan Plateau', length:'3,180 km (in India: 1,114 km)', type:'Himalayan', description:'The Indus is one of the longest rivers in Asia. The Indus Valley Civilization flourished on its banks.', facts:['Indus Valley Civilization — 3300 BCE','India named after Indus river','Indus Waters Treaty with Pakistan'], coordinates:{start:[32.5,79.5],end:[24.0,67.5]} },
  { id:'tapti', name:'Tapti (Tapi)', origin:'Satpura Range, Madhya Pradesh', length:'724 km', type:'Peninsular', description:'The Tapti is one of the major west-flowing rivers of India, flowing parallel to the Narmada.', facts:['Second major west-flowing river','Flows parallel to Narmada','Surat city on its banks'], coordinates:{start:[21.8,78.2],end:[21.2,72.6]} }
];

// ── Part 2: Inline Forts Data ──
fortsData = [
  { id:'red_fort', name:'Red Fort', location:'Delhi', state:'Delhi', built:'1639', builtBy:'Shah Jahan', dynasty:'Mughal', type:'Imperial Fort', description:'The Red Fort served as the main residence of the Mughal Emperors. It is a UNESCO World Heritage Site.', facts:['UNESCO World Heritage Site','Independence Day flag hoisting site','Built by Shah Jahan in 1639'], coordinates:[28.6562,77.2410] },
  { id:'agra_fort', name:'Agra Fort', location:'Agra', state:'Uttar_Pradesh', built:'1565', builtBy:'Akbar', dynasty:'Mughal', type:'Imperial Fort', description:'Agra Fort is a UNESCO World Heritage Site, main residence of Mughal emperors until 1638.', facts:['UNESCO World Heritage Site','Shah Jahan imprisoned here by Aurangzeb','Visible from Taj Mahal'], coordinates:[27.1795,78.0211] },
  { id:'chittorgarh', name:'Chittorgarh Fort', location:'Chittorgarh', state:'Rajasthan', built:'7th century', builtBy:'Chitrangada Mori', dynasty:'Rajput', type:'Hill Fort', description:'Chittorgarh Fort is the largest fort in India and a UNESCO World Heritage Site.', facts:['Largest fort in India','UNESCO World Heritage Site','Three sieges — 1303, 1535, 1568'], coordinates:[24.8887,74.6269] },
  { id:'mehrangarh', name:'Mehrangarh Fort', location:'Jodhpur', state:'Rajasthan', built:'1459', builtBy:'Rao Jodha', dynasty:'Rathore', type:'Hill Fort', description:'Mehrangarh Fort stands 410 feet above the city of Jodhpur.', facts:['One of largest forts in India','410 feet above Jodhpur city','Museum with royal artifacts'], coordinates:[26.2980,73.0188] },
  { id:'golconda', name:'Golconda Fort', location:'Hyderabad', state:'Telangana', built:'13th century', builtBy:'Kakatiya dynasty', dynasty:'Qutb Shahi', type:'Hill Fort', description:'Golconda Fort was famous for its diamond trade, including the Kohinoor diamond.', facts:['Source of Kohinoor diamond','Acoustic system — clap at entrance heard at top','Hyderabad founded nearby in 1591'], coordinates:[17.3833,78.4011] },
  { id:'gwalior_fort', name:'Gwalior Fort', location:'Gwalior', state:'Madhya_Pradesh', built:'8th century', builtBy:'Suraj Sen', dynasty:'Various', type:'Hill Fort', description:'Gwalior Fort was called the pearl amongst fortresses in India by Babur.', facts:['Called pearl amongst fortresses by Babur','Man Singh Palace inside','Rani Lakshmibai died near here'], coordinates:[26.2183,78.1828] },
  { id:'jaisalmer_fort', name:'Jaisalmer Fort', location:'Jaisalmer', state:'Rajasthan', built:'1156', builtBy:'Rawal Jaisal', dynasty:'Bhati Rajput', type:'Desert Fort', description:'Jaisalmer Fort is one of the few living forts in the world, a UNESCO World Heritage Site.', facts:['Living fort — 3000 people reside inside','UNESCO World Heritage Site','Golden Fort — Sonar Quila'], coordinates:[26.9124,70.9152] },
  { id:'amber_fort', name:'Amber Fort', location:'Jaipur', state:'Rajasthan', built:'1592', builtBy:'Raja Man Singh I', dynasty:'Kachwaha Rajput', type:'Hill Fort', description:'Amber Fort is a UNESCO World Heritage Site known for blending Hindu and Mughal architecture.', facts:['UNESCO World Heritage Site','Sheesh Mahal — Hall of Mirrors','Blend of Hindu and Mughal architecture'], coordinates:[26.9855,75.8513] },
  { id:'daulatabad', name:'Daulatabad Fort', location:'Aurangabad', state:'Maharashtra', built:'12th century', builtBy:'Yadava dynasty', dynasty:'Various', type:'Hill Fort', description:'Daulatabad Fort is one of the most formidable forts in India.', facts:['Muhammad bin Tughluq moved capital here','Considered impregnable','Ellora Caves nearby'], coordinates:[19.9400,75.2200] },
  { id:'purana_qila', name:'Purana Qila', location:'Delhi', state:'Delhi', built:'16th century', builtBy:'Humayun / Sher Shah Suri', dynasty:'Mughal / Sur', type:'Imperial Fort', description:'Purana Qila is believed to be built on the site of Indraprastha, capital of the Pandavas.', facts:['Believed to be site of Indraprastha','Built by Humayun and Sher Shah Suri','Qila-i-Kuhna Mosque inside'], coordinates:[28.6100,77.2431] }
];

// ── Part 3: Inline Ghats Data ──
ghatsData = [
  { id:'western_ghats', name:'Western Ghats', type:'Mountain Range', length:'1,600 km', states:['Gujarat','Maharashtra','Goa','Karnataka','Kerala','Tamil_Nadu'], description:'The Western Ghats is a UNESCO World Heritage Site and one of the world\'s eight hottest biodiversity hotspots.', facts:['UNESCO World Heritage Site','One of 8 global biodiversity hotspots','Source of major peninsular rivers','Over 5,000 species of flowering plants'], highestPeak:'Anamudi — 2,695 m' },
  { id:'eastern_ghats', name:'Eastern Ghats', type:'Mountain Range', length:'1,750 km', states:['Odisha','Andhra_Pradesh','Tamil_Nadu'], description:'The Eastern Ghats are a discontinuous range of mountains along the eastern coast of India.', facts:['Discontinuous mountain range','Older than Western Ghats','Araku Valley — coffee growing region','Tribal heartland'], highestPeak:'Jindhagada — 1,690 m' },
  { id:'varanasi_ghats', name:'Varanasi Ghats', type:'River Ghats', count:'88 ghats', state:'Uttar_Pradesh', description:'The ghats of Varanasi are a series of steps leading down to the Ganges river, the spiritual heart of Hinduism.', facts:['88 ghats along the Ganges','Dashashwamedh Ghat — main ghat','Manikarnika Ghat — cremation ghat','Ganga Aarti every evening'], famousGhats:['Dashashwamedh','Manikarnika','Assi','Panchganga'] },
  { id:'rishikesh_ghats', name:'Rishikesh Ghats', type:'River Ghats', state:'Uttarakhand', description:'The ghats of Rishikesh on the Ganges are famous for yoga, meditation, and adventure sports.', facts:['Yoga Capital of the World','Triveni Ghat — main ghat','Ram Jhula and Lakshman Jhula bridges','Beatles visited Maharishi Mahesh Yogi here'], famousGhats:['Triveni Ghat','Swarg Ashram Ghat'] },
  { id:'haridwar_ghats', name:'Haridwar Ghats', type:'River Ghats', state:'Uttarakhand', description:'Haridwar is one of the seven holiest places in Hinduism. The Har Ki Pauri ghat is the most sacred spot.', facts:['One of 7 holiest Hindu cities','Har Ki Pauri — most sacred ghat','Kumbh Mela held every 12 years','Gateway to Char Dham pilgrimage'], famousGhats:['Har Ki Pauri','Kushavarta Ghat'] }
];

// ── Part 3: Load Map from inline SVG (no fetch) ──
milestones = [
  { year:1947, label:'Independence', description:'India gains independence from British rule on August 15, 1947. The country is partitioned into India and Pakistan.', events:['Partition of British India','Independence Day - Aug 15','Jawaharlal Nehru becomes first PM'] },
  { year:1950, label:'Republic', description:'India becomes a republic on January 26, 1950. The Constitution of India comes into effect.', events:['Constitution adopted - Jan 26','Dr. Rajendra Prasad becomes first President','Integration of princely states begins'] },
  { year:1956, label:'States Reorganisation', description:'States Reorganisation Act reorganises Indian states along linguistic lines.', events:['States Reorganisation Act','14 states and 6 union territories formed','Linguistic basis for state boundaries'] },
  { year:1960, label:'Bombay Split', description:'Bombay State is divided into Maharashtra and Gujarat on May 1, 1960.', events:['Maharashtra formed','Gujarat formed','Bombay becomes capital of Maharashtra'] },
  { year:1971, label:'Bangladesh War', description:'India-Pakistan war leads to creation of Bangladesh. Himachal Pradesh becomes a full state.', events:['Bangladesh Liberation War','Himachal Pradesh becomes state','Meghalaya, Manipur, Tripura become states'] },
  { year:2000, label:'New States', description:'Three new states carved out — Chhattisgarh, Jharkhand, and Uttarakhand.', events:['Chhattisgarh from Madhya Pradesh','Jharkhand from Bihar','Uttarakhand from Uttar Pradesh'] },
  { year:2014, label:'Telangana', description:'Telangana is carved out of Andhra Pradesh, becoming India\'s 29th state.', events:['Telangana becomes 29th state','Hyderabad as joint capital','Andhra Pradesh reorganised'] },
  { year:2019, label:'J&K Reorganisation', description:'Jammu & Kashmir is reorganised into two Union Territories — J&K and Ladakh.', events:['Article 370 abrogated','J&K becomes Union Territory','Ladakh becomes Union Territory'] },
  { year:2024, label:'Present', description:'India today has 28 states and 8 Union Territories.', events:['28 States','8 Union Territories','Population: 1.4 Billion'] }
];

// ── Part 3: Load Map from inline SVG (no fetch) ──
function loadMap() {
  const seen = new Set();
  const g = $('mapRegions');
  document.querySelectorAll('#india-map path.state, svg path.state').forEach(p => {
    const d = p.getAttribute('d');
    if (!p.id || seen.has(p.id) || !d || d === '...' || d.trim() === '') return;
    seen.add(p.id);
    if (p.closest('#mapRegions')) return; // already in place
    const clone = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    clone.setAttribute('id', p.id);
    clone.setAttribute('class', 'state');
    clone.setAttribute('d', d);
    g.appendChild(clone);
  });
}

// ── Part 3: Tags — delegated to tags.js via categoryChanged event ──
function renderTags() { /* handled by components/tags.js */ }

// ── Part 3: Timeline — delegated to components/timeline.js via yearChanged event ──
function pct(year) { return ((year - MIN_YEAR) / (MAX_YEAR - MIN_YEAR)) * 100; }
function renderTimeline() { /* handled by components/timeline.js */ }
function updateHandle() {}
function attachTimelineEvents() {}

function setYear(year) {
  currentYear = Math.max(MIN_YEAR, Math.min(MAX_YEAR, year));
  applyYearFilter();
}

// ── Part 3: Map Handlers ──
function attachStateHandlers() {
  document.querySelectorAll('.state').forEach(path => {
    path.addEventListener('mouseenter', () => {
      const data = statesData[path.id];
      if (data) showPanel(data, currentCategory);
    });
    path.addEventListener('click', () => {
      const data = statesData[path.id];
      if (data) showPanel(data, currentCategory);
    });
  });
}

function applyYearFilter() {
  document.querySelectorAll('.state').forEach(path => {
    const data = statesData[path.id];
    if (data && data.formed > currentYear) {
      path.style.opacity = '0.25';
      path.style.filter  = 'grayscale(1)';
    } else {
      path.style.opacity = '1';
      path.style.filter  = 'none';
    }
  });
}

function applyOverlays() {
  const svg = $('india-map');
  if (!svg) return;
  svg.querySelectorAll('.overlay-marker').forEach(el => el.remove());
  const g = svg.querySelector('.regions');
  if (currentCategory === 'forts') {
    fortsData.forEach(fort => {
      const [x, y] = latLngToSVG(fort.coordinates[0], fort.coordinates[1]);
      const c = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      c.setAttribute('cx', x); c.setAttribute('cy', y); c.setAttribute('r', '5');
      c.setAttribute('class', 'overlay-marker fort-marker');
      c.style.cursor = 'pointer';
      c.addEventListener('click', () => showPanel(fort, 'forts'));
      g.appendChild(c);
    });
  }
  if (currentCategory === 'rivers') {
    riversData.forEach(river => {
      const [x, y] = latLngToSVG(
        (river.coordinates.start[0] + river.coordinates.end[0]) / 2,
        (river.coordinates.start[1] + river.coordinates.end[1]) / 2
      );
      const t = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      t.setAttribute('x', x); t.setAttribute('y', y);
      t.setAttribute('class', 'overlay-marker river-label');
      t.textContent = river.name.split(' ')[0];
      t.style.cursor = 'pointer';
      t.addEventListener('click', () => showPanel(river, 'rivers'));
      g.appendChild(t);
    });
  }
}

function latLngToSVG(lat, lng) {
  return [((lng - 68) / 29) * 432, ((37 - lat) / 29) * 488];
}

/// ── Part 4: Unified Side Panel Configuration Engine ──
function showPanel(data, category) {
  $('spPlaceholder').classList.add('hidden');
  $('spContent').classList.remove('hidden');
  $('spTitle').textContent = data.name || data.title || '—';
  $('spSub').textContent   = getSubtitle(data, category);
  $('spDesc').textContent  = data.description || '';
  
  // Dynamically swap the tray header icon to match the specific data category
  const iconWrapper = $('spIcon');
  if (iconWrapper) {
    const iconEl = iconWrapper.querySelector('i');
    if (iconEl) {
      const tagConfig = TAGS.find(t => t.id === category);
      iconEl.className = tagConfig ? `fas ${tagConfig.icon}` : 'fas fa-map';
    }
  }

  renderStats(data);
  renderFacts(data.facts || []);
  renderEvents(data.historicalEvents || data.events || []);
}

function getSubtitle(data, category) {
  if (category === 'states' || category === 'uts')
    return data.language ? `${data.language} · Formed ${data.formed}` : '';
  if (category === 'rivers') return data.type ? `${data.type} River` : 'River Network';
  if (category === 'forts')  return data.dynasty ? `${data.dynasty} Dynasty · ${data.built || 'Ancient'}` : 'Imperial Fort';
  if (category === 'ghats')  return data.type ? `${data.type}` : 'Geographical Feature';
  return data.type || '';
}

function renderStats(data) {
  const stats = [];
  
  // Dynamically assemble cards for any populated metrics across all database profiles
  if (data.capital)     stats.push(['fa-city',           'Capital',      data.capital]);
  if (data.area)        stats.push(['fa-ruler-combined', 'Area',         data.area]);
  if (data.population)  stats.push(['fa-users',          'Population',   data.population]);
  if (data.length)      stats.push(['fa-route',          'Length',       data.length]);
  if (data.origin)      stats.push(['fa-map-pin',        'Origin',       data.origin]);
  if (data.builtBy)     stats.push(['fa-hammer',         'Built By',     data.builtBy]);
  if (data.built)       stats.push(['fa-calendar',       'Built Year',   data.built]);
  if (data.location)    stats.push(['fa-location-dot',   'Location',     data.location]);
  if (data.highestPeak) stats.push(['fa-mountain',        'Highest Peak', data.highestPeak]);
  if (data.count)       stats.push(['fa-list-ol',        'Total Count',  data.count]);
  
  if (data.states && Array.isArray(data.states)) {
    stats.push(['fa-globe', 'States Covered', data.states.join(', ')]);
  }

  $('spStats').innerHTML = stats.length ? `<div class="stats-grid">${stats.map(([icon, label, val]) =>
    `<div class="stat-item"><i class="fas ${icon}"></i><div>
      <span class="stat-label">${label}</span>
      <span class="stat-value">${val}</span></div></div>`).join('')}</div>` : '';
}

function renderFacts(facts) {
  $('spFacts').innerHTML = facts.length ? `
    <div class="sp-section">
      <h4><i class="fas fa-lightbulb"></i> Key Facts</h4>
      <ul class="facts-list">${facts.map(f => `<li>${f}</li>`).join('')}</ul>
    </div>` : '';
}

function renderEvents(events) {
  if (!events.length) { $('spEvents').innerHTML = ''; return; }
  const isObj = typeof events[0] === 'object';
  $('spEvents').innerHTML = `
    <div class="sp-section">
      <h4><i class="fas fa-history"></i> Historical Events</h4>
      <ul class="events-list">${events.map(e => isObj
        ? `<li><span class="ev-year">${e.year}</span><span class="ev-text">${e.event}</span></li>`
        : `<li>${e}</li>`).join('')}
      </ul>
    </div>`;
}

// Map base mouse events context isolation fix
function attachStateHandlers() {
  document.querySelectorAll('.state').forEach(path => {
    path.addEventListener('mouseenter', () => {
      const data = statesData[path.id];
      // CRITICAL FIX: Always pass 'states' context to prevent subtitle string layout corruption
      if (data) showPanel(data, 'states');
    });
    path.addEventListener('click', () => {
      const data = statesData[path.id];
      if (data) showPanel(data, 'states');
    });
  });
}

function showMilestone(ms) {
  showPanel({ name: `${ms.year} — ${ms.label}`, description: ms.description || '', events: ms.events || [] }, 'events');
}

function resetPanel() {
  $('spPlaceholder').classList.remove('hidden');
  $('spContent').classList.add('hidden');
}

// Expose the view configuration globally so autonomous external modules can tap into it safely
window.showPanel = showPanel;

// ── Part 4: Clean Standalone Search Integration ──

// Expose state highlight globally for search selection usage
function highlightState(id) {
  document.querySelectorAll('.state').forEach(p => p.classList.remove('highlighted'));
  const el = document.getElementById(id);
  if (el) el.classList.add('highlighted');
}

// Global Event Hub Listener for Search Results
document.addEventListener('searchResultSelected', (e) => {
  const result = e.detail;
  if (!result) return;

  console.log('[App Hook] Search selection received:', result);

  // Synchronize with Side Panel and Map Views based on Category Type
  if (result.type === 'state') {
    const data = statesData[result.id];
    if (data) {
      showPanel(data, 'states');
      highlightState(result.id);
    }
  } else if (result.type === 'river') {
    const data = riversData.find(r => r.id === result.id);
    if (data) showPanel(data, 'rivers');
  } else if (result.type === 'fort') {
    const data = fortsData.find(f => f.id === result.id);
    if (data) showPanel(data, 'forts');
  } else if (result.type === 'ghat') {
    const data = ghatsData.find(g => g.id === result.id);
    if (data) showPanel(data, 'ghats');
  } else if (result.type === 'historical-event') {
    showPanel({
      name: result.label,
      description: result.description || `Historical record for the year ${result.year}.`,
      facts: []
    }, 'events');
  }
});

// ── Part 4: Navbar Layout & UI Event Bindings ──
function attachNavbarEvents() {
  // Theme Toggle Logic
  $('themeToggleBtn').addEventListener('click', () => {
    isDark = !isDark;
    document.body.classList.toggle('dark', isDark);
    document.body.classList.toggle('light', !isDark);
    $('themeToggleBtn').querySelector('i').className = isDark ? 'fas fa-moon' : 'fas fa-sun';
    $('themeToggleBtn').classList.toggle('active', isDark);

    // Broadcast message so auxiliary layers (like river paths) can adapt
    document.dispatchEvent(new CustomEvent('themeChanged', { detail: { isDark } }));
  });

  // Bottom Detail Tray Close Button Trigger
  $('spClose').addEventListener('click', resetPanel);
}

// ── Part 4: Unified System Initialization ──
function init() {
  loadMap();
  attachStateHandlers();
  attachNavbarEvents();
}

// Intercept loaded pipeline data arrays from data-loader.js
document.addEventListener('dataLoaded', (e) => {
  const externalData = e.detail;

  // FIX 1: Normalize and un-nest states object array into a clean key-value lookup dictionary
  if (externalData.statesData) {
    statesData = {};
    const statesArray = Array.isArray(externalData.statesData) ? externalData.statesData : (externalData.statesData.states || []);
    statesArray.forEach(st => {
      statesData[st.id] = st;
    });
  }

  // FIX 2: Normalize remaining datasets to clean arrays to prevent .find() or .forEach() exceptions
  if (externalData.riversData) {
    riversData = Array.isArray(externalData.riversData) ? externalData.riversData : (externalData.riversData.rivers || []);
  }
  if (externalData.fortsData) {
    fortsData = Array.isArray(externalData.fortsData) ? externalData.fortsData : (externalData.fortsData.forts || []);
  }
  if (externalData.ghatsData) {
    ghatsData = Array.isArray(externalData.ghatsData) ? externalData.ghatsData : (externalData.ghatsData.ghats || []);
  }
  if (externalData.timelineData) {
    milestones = Array.isArray(externalData.timelineData) ? externalData.timelineData : (externalData.timelineData.timeline || externalData.timelineData.milestones || []);
  }

  // Expose clean, sanitized values onto window object for search.js to discover safely
  window.statesData = statesData;
  window.riversData = riversData;
  window.fortsData = fortsData;
  window.ghatsData = ghatsData;
  window.milestones = milestones;

  // Fire UI structural setups
  init();

  // Explicitly trigger search engine index build now that datasets match perfectly
  if (window.SearchEngine && typeof window.SearchEngine.buildIndex === 'function') {
    window.SearchEngine.buildIndex();
  }
});