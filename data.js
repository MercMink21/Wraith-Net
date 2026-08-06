/* ═══════════════════════════════════════════════════════════════════
   WRAITH//NET — curated + config data.
   LIVE = fetched at runtime from a free, no-key public source.
   REFERENCE = static curated content, snapshot only — verify against
   the primary/live source linked in each section before treating as fact.
   ═══════════════════════════════════════════════════════════════════ */

/* ---- 7 clocks ---- */
const TIMEZONES = [
  { id:'z',  label:'ZULU / UTC',     tz:'UTC',                 zulu:true },
  { id:'dc', label:'WASHINGTON DC',  tz:'America/New_York'   },
  { id:'br', label:'BRUSSELS',       tz:'Europe/Brussels'    },
  { id:'ta', label:'TEL AVIV',       tz:'Asia/Jerusalem'     },
  { id:'mo', label:'MOSCOW',         tz:'Europe/Moscow'      },
  { id:'bj', label:'BEIJING',        tz:'Asia/Shanghai'      },
  { id:'tk', label:'TOKYO',          tz:'Asia/Tokyo'         },
];

/* ---- weather cities (same 7, + coords for Open-Meteo, no key) ---- */
const WEATHER_CITIES = [
  { name:'WASHINGTON DC', lat:38.9072, lon:-77.0369 },
  { name:'BRUSSELS',      lat:50.8503, lon:4.3517   },
  { name:'TEL AVIV',      lat:32.0853, lon:34.7818  },
  { name:'MOSCOW',        lat:55.7558, lon:37.6173  },
  { name:'BEIJING',       lat:39.9042, lon:116.4074 },
  { name:'TOKYO',         lat:35.6762, lon:139.6503 },
  { name:'KYIV',          lat:50.4501, lon:30.5234  },
  { name:'LONDON',        lat:51.5074, lon:-0.1278  },
];

/* WMO weather codes -> label (Open-Meteo) */
const WMO = {
  0:'CLEAR',1:'MOSTLY CLEAR',2:'PARTLY CLOUDY',3:'OVERCAST',
  45:'FOG',48:'RIME FOG',51:'LIGHT DRIZZLE',53:'DRIZZLE',55:'DENSE DRIZZLE',
  61:'LIGHT RAIN',63:'RAIN',65:'HEAVY RAIN',71:'LIGHT SNOW',73:'SNOW',
  75:'HEAVY SNOW',80:'RAIN SHOWERS',81:'RAIN SHOWERS',82:'VIOLENT SHOWERS',
  95:'THUNDERSTORM',96:'STORM + HAIL',99:'SEVERE STORM',
};

/* ---- RSS sources (fetched live via CORS proxy) ----
   Reuters killed its public RSS years ago, so "wire" uses outlets
   that still publish open RSS with no key required. */
const RSS_FEEDS = {
  wire: [
    { name:'BBC WORLD',      url:'http://feeds.bbci.co.uk/news/world/rss.xml' },
    { name:'AL JAZEERA',     url:'https://www.aljazeera.com/xml/rss/all.xml' },
    { name:'THE GUARDIAN',   url:'https://www.theguardian.com/world/rss' },
    { name:'NPR WORLD',      url:'https://feeds.npr.org/1004/rss.xml' },
  ],
  domestic: [
    { name:'NPR NATIONAL',   url:'https://feeds.npr.org/1003/rss.xml' },
    { name:'GUARDIAN US',    url:'https://www.theguardian.com/us-news/rss' },
    { name:'AP-ALT (NPR POLITICS)', url:'https://feeds.npr.org/1014/rss.xml' },
  ],
  defense: [
    { name:'BREAKING DEFENSE', url:'https://breakingdefense.com/feed/' },
    { name:'DEFENSE NEWS',     url:'https://www.defensenews.com/arc/outboundfeeds/rss/' },
    { name:'THE WAR ZONE',     url:'https://www.twz.com/feed' },
  ],
  geo: [
    { name:'FOREIGN POLICY',  url:'https://foreignpolicy.com/feed/' },
    { name:'AL JAZEERA',      url:'https://www.aljazeera.com/xml/rss/all.xml' },
    { name:'GUARDIAN WORLD',  url:'https://www.theguardian.com/world/rss' },
  ],
  ground: [
    { name:'BBC WORLD', url:'http://feeds.bbci.co.uk/news/world/rss.xml' },
    { name:'TASS (STATE-RUN RU — CONTEXT ONLY)', url:'https://tass.com/rss/v2.xml' },
  ],
};

/* CORS proxies tried in order — all free, no key. First one that
   returns valid content wins; if all fail the panel shows a direct link. */
const CORS_PROXIES = [
  u => 'https://api.allorigins.win/raw?url=' + encodeURIComponent(u),
  u => 'https://api.codetabs.com/v1/proxy?quest=' + encodeURIComponent(u),
  u => 'https://corsproxy.io/?url=' + encodeURIComponent(u), // only works if this page is served from localhost, kept as last-resort
];

/* ---- Reddit (live via CORS proxy, .rss endpoints, no key/login) ---- */
const REDDIT_SUBS = [
  { sub:'worldnews',       label:'r/WORLDNEWS' },
  { sub:'geopolitics',     label:'r/GEOPOLITICS' },
  { sub:'OSINT',           label:'r/OSINT' },
  { sub:'CredibleDefense', label:'r/CREDIBLEDEFENSE' },
];

/* ---- Crypto (CoinGecko free API, CORS-open, no key) ---- */
const CRYPTO_IDS = ['bitcoin','ethereum','solana','ripple','the-open-network','dogecoin'];

/* ---- Stocks / indices (stooq.com free CSV, no key, via proxy) ---- */
const STOCK_SYMBOLS = {
  indices: [
    { sym:'^spx', name:'S&P 500' }, { sym:'^dji', name:'DOW JONES' },
    { sym:'^ndq', name:'NASDAQ' },  { sym:'^vix', name:'VIX (FEAR INDEX)' },
  ],
  defense: [
    { sym:'lmt.us', name:'LOCKHEED MARTIN' }, { sym:'rtx.us', name:'RTX (RAYTHEON)' },
    { sym:'noc.us', name:'NORTHROP GRUMMAN' }, { sym:'gd.us',  name:'GENERAL DYNAMICS' },
    { sym:'ba.us',  name:'BOEING' },
  ],
};

/* ---- OSINT / X accounts — link-out only (X blocks unauthenticated
   client-side scraping and its API requires a paid key; this is a
   curated directory, not a live feed) ---- */
const OSINT_X_ACCOUNTS = [
  { handle:'@disclosetv',      desc:'Fast-breaking intel & X trending stories', url:'https://x.com/disclosetv' },
  { handle:'@OSINTdefender',   desc:'Military OSINT, satellite imagery analysis', url:'https://x.com/OSINTdefender' },
  { handle:'@IntelCrab',       desc:'Intelligence aggregation & signals', url:'https://x.com/IntelCrab' },
  { handle:'@Osinttechnical',  desc:'Technical OSINT & geolocation', url:'https://x.com/Osinttechnical' },
  { handle:'@sentdefender',    desc:'Conflict data & sentiment analysis', url:'https://x.com/sentdefender' },
  { handle:'@bellingcat',      desc:'Open-source investigation organization', url:'https://x.com/bellingcat' },
  { handle:'@RALee85',         desc:'Russia / security expert analysis', url:'https://x.com/RALee85' },
  { handle:'@CalibreObscura',  desc:'Weapons & munitions identification', url:'https://x.com/CalibreObscura' },
];

/* ---- Instagram accounts — link-out only, same reasoning as above ---- */
const OSINT_IG_ACCOUNTS = [
  { handle:'@osintdefender',  desc:'Conflict zone imagery, satellite analysis, geolocations', url:'https://www.instagram.com/osintdefender/' },
  { handle:'@disclose.tv',    desc:'Breaking news & alerts', url:'https://www.instagram.com/disclose.tv/' },
  { handle:'@tessaron_news_3',desc:'Satellite imagery & geolocation analysis', url:'https://www.instagram.com/tessaron_news_3/' },
];

/* ---- Declassified / leaks — reference links, not live scrapers ---- */
const DECLASS_LINKS = [
  { name:'CIA CREST (FULL DECLASSIFIED ARCHIVE)', desc:'CIA Records Search Tool — 13M+ declassified pages', url:'https://www.cia.gov/readingroom/' },
  { name:'CIA FOIA ELECTRONIC READING ROOM',      desc:'Topical declassified collections (UFO, MKUltra, etc.)', url:'https://www.cia.gov/readingroom/collection/' },
  { name:'NATIONAL SECURITY ARCHIVE (GWU)',       desc:'Independent FOIA-obtained document archive', url:'https://nsarchive.gwu.edu/' },
  { name:'WIKILEAKS — CABLEGATE',                 desc:'U.S. State Department diplomatic cables', url:'https://wikileaks.org/cablegate.html' },
  { name:'WIKILEAKS — VAULT 7',                   desc:'CIA hacking tools documentation', url:'https://wikileaks.org/ciav7p1/' },
  { name:'CRYPTOME',                              desc:'Security & intelligence document archive', url:'https://cryptome.org/' },
  { name:'DDOSECRETS',                            desc:'Distributed Denial of Secrets archive', url:'https://ddosecrets.com/' },
];

/* ---- NDAA / NSS reference text (static — these are annual/periodic
   documents, not live feeds; verify against whitehouse.gov / congress.gov) ---- */
const NSS_NDAA = {
  nss: {
    title:'NATIONAL SECURITY STRATEGY (NSS)',
    body:'The NSS is the President’s periodic statement of U.S. strategic priorities: defending the homeland, promoting prosperity, preserving peace through strength, and advancing American influence abroad. Recent iterations have framed China as the pacing challenge, Russia as an acute threat, and prioritized the Indo-Pacific alongside continued commitments in Europe and the Middle East.',
    tags:['CHINA — PACING CHALLENGE','RUSSIA — ACUTE THREAT','INDO-PACIFIC PRIORITY','INTEGRATED DETERRENCE'],
    link:'https://www.whitehouse.gov/',
  },
  ndaa: {
    title:'NATIONAL DEFENSE AUTHORIZATION ACT (NDAA)',
    body:'The NDAA is Congress’s annual defense policy bill, authorizing budget top-lines and setting policy for the Department of Defense. Recurring pillars across recent NDAAs: Pacific Deterrence Initiative funding, European Deterrence Initiative, nuclear triad modernization, shipbuilding, and expanded AI / cyber acquisition authority. Exact authorized totals change every fiscal year — check congress.gov for the current bill text.',
    tags:['ANNUAL DEFENSE POLICY BILL','PACIFIC DETERRENCE INITIATIVE','TRIAD MODERNIZATION','CYBER/AI AUTHORITIES'],
    link:'https://www.congress.gov/',
  },
  implications: [
    { theater:'INDOPACOM', text:'Enhanced force posture, AUKUS submarine/tech partnership, Taiwan defense assistance debates.' },
    { theater:'EUCOM',     text:'NATO reinforcement, continued Ukraine security assistance, Russia deterrence posture.' },
    { theater:'CENTCOM',   text:'Counter-terrorism operations, Iran containment, Red Sea freedom-of-navigation.' },
    { theater:'AFRICOM',   text:'Counter-VEO operations, great-power competition (China/Russia influence) in Sahel & coastal West Africa.' },
    { theater:'SOUTHCOM',  text:'Counter-narcotics operations, countering PRC infrastructure/port influence in the hemisphere.' },
  ],
};

/* ---- US Combatant Commands (reference).
   situation/implications/status are structural, durable-framing summaries
   — NOT live intelligence. confidence reflects how well-established each
   claim is from open reporting: HIGH = widely corroborated across
   independent sources, MEDIUM = reported but less consistently verified,
   LOW = contested, fast-moving, or single-source. Always treat as a
   starting point, not a current assessment — check the official site. ---- */
const THEATERS = [
  { name:'CENTCOM', full:'Central Command', aor:'Middle East, Central Asia, South Asia', hq:'MacDill AFB, Florida', url:'https://www.centcom.mil/',
    status:'ELEVATED', confidence:'HIGH',
    situation:'Highest-tempo theater in the joint force: counter-Houthi maritime security in the Red Sea/Gulf of Aden, residual counter-ISIS operations in Iraq/Syria, and standing deterrence posture against Iran-aligned proxy groups targeting U.S. forces in the region.',
    implications:'Sustained CENTCOM tempo pulls carrier and air-defense assets away from other theaters (opportunity cost for INDOPACOM/EUCOM). Red Sea disruption has direct global shipping-cost and insurance implications.',
    relatedHotspots:['GAZA / ISRAEL','RED SEA / YEMEN','IRAN'] },
  { name:'EUCOM', full:'European Command', aor:'Europe, Russia, Turkey, Greenland', hq:'Stuttgart, Germany', url:'https://www.eucom.mil/',
    status:'ELEVATED', confidence:'HIGH',
    situation:'Forward-deployed NATO battlegroups reinforced since 2022; sustained security-assistance pipeline to Ukraine; periodic hybrid incidents (undersea cable damage, GPS jamming, airspace incursions) attributed to Russian state or proxy activity.',
    implications:'European deterrence posture is the theater most directly shaped by NATO burden-sharing debates and the trajectory of the Russia-Ukraine war; a ceasefire or escalation would rapidly change EUCOM force-posture requirements.',
    relatedHotspots:['UKRAINE','BALTICS / NATO EASTERN FLANK'] },
  { name:'INDOPACOM', full:'Indo-Pacific Command', aor:'Asia-Pacific, Indian Ocean', hq:'Camp H.M. Smith, Hawaii', url:'https://www.pacom.mil/',
    status:'STEADY / WATCHING', confidence:'MEDIUM',
    situation:'Largest AOR by geography. Continuous PLA air/naval activity around Taiwan and in the South China Sea; AUKUS submarine-technology partnership maturing; DPRK missile testing continues alongside deepening Russia-DPRK cooperation.',
    implications:'Widely assessed as the U.S. "pacing" theater — force posture, basing access, and semiconductor supply-chain security are all downstream of how Taiwan Strait and South China Sea tension trend.',
    relatedHotspots:['TAIWAN STRAIT','SOUTH CHINA SEA','KOREAN PENINSULA'] },
  { name:'SOUTHCOM', full:'Southern Command', aor:'Central/South America, Caribbean', hq:'Doral, Florida', url:'https://www.southcom.mil/',
    status:'STEADY STATE', confidence:'MEDIUM',
    situation:'Primary mission set is counter-narcotics and counter-transnational-organized-crime cooperation with regional partners, alongside disaster-response and humanitarian engagement. Growing PRC port/infrastructure investment across the region is a standing watch item.',
    implications:'Lowest kinetic-risk theater currently, but PRC economic influence expansion and regional migration pressure are the two long-run trends most likely to raise its profile.',
    relatedHotspots:[] },
  { name:'AFRICOM', full:'Africa Command', aor:'Africa (except Egypt)', hq:'Stuttgart, Germany', url:'https://www.africom.mil/',
    status:'ELEVATED', confidence:'MEDIUM',
    situation:'Sahel juntas (Mali, Niger, Burkina Faso) have pivoted from Western security partnerships toward Russian (Wagner/Africa Corps) cooperation amid ongoing jihadist insurgencies; U.S. basing access in the region has contracted accordingly.',
    implications:'Reduced Western basing access degrades regional counter-terrorism reach just as insurgent groups (JNIM, ISWAP/ISGS affiliates) remain active — a gap great-power competitors are moving to fill.',
    relatedHotspots:['SAHEL'] },
  { name:'NORTHCOM', full:'Northern Command', aor:'North America, Homeland Defense', hq:'Peterson SFB, Colorado', url:'https://www.northcom.mil/',
    status:'STEADY STATE', confidence:'MEDIUM',
    situation:'Homeland air-defense (NORAD-shared mission), Arctic approaches monitoring, and southern-border support operations are the standing lines of effort.',
    implications:'Arctic-approach and cruise-missile-defense modernization needs are the main long-run driver of NORTHCOM posture change as competitor long-range strike capability improves.',
    relatedHotspots:[] },
  { name:'SPACECOM', full:'Space Command', aor:'Space Operations', hq:'Peterson SFB, Colorado', url:'https://www.spacecom.mil/',
    status:'STEADY / WATCHING', confidence:'LOW',
    situation:'Responsible for space-domain awareness and protecting satellite infrastructure amid reported Russian and Chinese counter-space weapons development (co-orbital and directed-energy systems).',
    implications:'Satellite-dependent systems (GPS, ISR, communications) underpin almost every other theater’s operations — SPACECOM posture is a force multiplier for all COCOMs, not just its own AOR. Public detail on adversary counter-space capability is comparatively thin, hence lower confidence.',
    relatedHotspots:[] },
  { name:'CYBERCOM', full:'Cyber Command', aor:'Cyberspace Operations', hq:'Fort Meade, Maryland', url:'https://www.cybercom.mil/',
    status:'ELEVATED', confidence:'LOW',
    situation:'Defends DoD networks and conducts "defend forward" operations against state-linked ransomware and critical-infrastructure intrusion attempts; publicly attributed activity clusters around Russian, Chinese, Iranian, and DPRK-linked actors.',
    implications:'Cyber incidents against critical infrastructure are a standing, low-visibility risk that can escalate faster than conventional indicators — but open-source attribution and scale are inherently harder to verify than physical-domain activity, hence lower confidence.',
    relatedHotspots:[] },
];

/* ---- Military power reference table.
   ILLUSTRATIVE / APPROXIMATE — modeled loosely on the kind of factors
   public indices (e.g. Global Firepower) publish. Figures are rounded
   snapshots for orientation only; do not cite as precise or current
   without checking a primary source. ---- */
const MILITARY_RANKINGS = [
  { rank:1, country:'UNITED STATES', budget:'$880B+', personnel:'~1.3M active', note:'Global power projection, 11 carriers, largest air force' },
  { rank:2, country:'RUSSIA', budget:'~$110B', personnel:'~1.0M active', note:'Largest nuclear arsenal, extensive armor/artillery inventory' },
  { rank:3, country:'CHINA', budget:'~$230B (official)', personnel:'~2.0M active', note:'Largest navy by hull count, rapid modernization pace' },
  { rank:4, country:'INDIA', budget:'~$85B', personnel:'~1.4M active', note:'Large land force, growing indigenous defense industry' },
  { rank:5, country:'SOUTH KOREA', budget:'~$45B', personnel:'~500K active', note:'High readiness posture facing DPRK' },
  { rank:6, country:'UNITED KINGDOM', budget:'~$70B', personnel:'~150K active', note:'Nuclear deterrent, NATO power-projection capability' },
  { rank:7, country:'FRANCE', budget:'~$60B', personnel:'~200K active', note:'Independent nuclear deterrent, African/Indo-Pacific presence' },
  { rank:8, country:'JAPAN', budget:'~$55B', personnel:'~250K active', note:'Expanding counterstrike capability, alliance with U.S.' },
  { rank:9, country:'ISRAEL', budget:'~$27B', personnel:'~170K active (+reserves)', note:'High-tech edge, extensive missile defense layers' },
  { rank:10, country:'TURKEY', budget:'~$40B', personnel:'~500K active', note:'NATO’s 2nd-largest standing force, growing drone industry' },
];
const MIL_RANKINGS_SOURCE_NOTE = 'Reference snapshot only — figures are rounded/approximate and change yearly. Cross-check against SIPRI, IISS Military Balance, or Global Firepower before citing.';

/* ---- Defense industry news link-outs (in addition to live RSS above) ---- */
const DEFENSE_LINKS = [
  { name:'DEFENSE NEWS', url:'https://www.defensenews.com/' },
  { name:'BREAKING DEFENSE', url:'https://breakingdefense.com/' },
  { name:'THE WAR ZONE', url:'https://www.twz.com/' },
  { name:'JANES', url:'https://www.janes.com/' },
  { name:'SIPRI ARMS TRANSFERS DB', url:'https://www.sipri.org/databases/armstransfers' },
];

/* ---- Globe hotspots (Three.js clickable regions) — REFERENCE snapshot,
   deliberately generic/durable framing since these situations evolve
   daily; each links out to a live tracker for current status. ---- */
const GLOBE_HOTSPOTS = [
  { name:'UKRAINE', lat:49.0, lon:31.5, sev:'high', conf:'HIGH',
    brief:'Active conventional war between Russia and Ukraine, ongoing since Feb 2022. Frontline in the east/south, sustained strikes on infrastructure. Key indicators to watch: territorial movement, Western aid packages, mobilization on both sides.',
    tags:['ACTIVE CONFLICT','NATO SUPPORT','ENERGY IMPACT'], link:'https://liveuamap.com/' },
  { name:'GAZA / ISRAEL', lat:31.5, lon:34.45, sev:'high', conf:'HIGH',
    brief:'Israel-Hamas conflict and broader regional friction involving Hezbollah (Lebanon) and Iran-aligned actors. Watch for ceasefire/hostage negotiations, humanitarian corridor status, and northern-border escalation risk.',
    tags:['ACTIVE CONFLICT','HUMANITARIAN CRISIS','REGIONAL SPILLOVER'], link:'https://liveuamap.com/' },
  { name:'RED SEA / YEMEN', lat:14.5, lon:44.0, sev:'high', conf:'HIGH',
    brief:'Houthi attacks on commercial shipping through the Bab-el-Mandeb strait have disrupted Red Sea traffic, prompting U.S./UK naval responses. Watch shipping-lane diversions around the Cape of Good Hope and insurance-cost signals.',
    tags:['MARITIME SECURITY','SHIPPING DISRUPTION'], link:'https://www.marinetraffic.com/' },
  { name:'TAIWAN STRAIT', lat:24.0, lon:121.0, sev:'med', conf:'MEDIUM',
    brief:'PLA military pressure (air incursions, naval exercises) around Taiwan continues amid cross-strait tension. Watch for changes in ADIZ incursion frequency and U.S. arms-sale announcements.',
    tags:['STRATEGIC COMPETITION','CHIP SUPPLY CHAIN'], link:'https://liveuamap.com/' },
  { name:'SOUTH CHINA SEA', lat:12.0, lon:114.0, sev:'med', conf:'MEDIUM',
    brief:'Overlapping territorial claims (China, Philippines, Vietnam, Malaysia) around reefs and shoals. Recurring friction points: Second Thomas Shoal resupply missions, coast-guard confrontations.',
    tags:['TERRITORIAL DISPUTE','FREEDOM OF NAVIGATION'], link:'https://liveuamap.com/' },
  { name:'KOREAN PENINSULA', lat:38.0, lon:127.0, sev:'med', conf:'MEDIUM',
    brief:'DPRK missile/weapons testing continues alongside deepening Russia-DPRK cooperation. Watch for satellite-launch attempts and joint U.S.-ROK exercise cycles.',
    tags:['NUCLEAR PROLIFERATION','ALLIANCE POSTURE'], link:'https://liveuamap.com/' },
  { name:'SAHEL', lat:15.0, lon:2.0, sev:'med', conf:'MEDIUM',
    brief:'Coup-affected governments (Mali, Niger, Burkina Faso) have pivoted from Western partners toward Russian (Wagner/Africa Corps) security cooperation, amid ongoing jihadist insurgencies.',
    tags:['INSURGENCY','GREAT POWER COMPETITION'], link:'https://liveuamap.com/' },
  { name:'IRAN', lat:32.4, lon:53.7, sev:'med', conf:'MEDIUM',
    brief:'Nuclear-program status, proxy-network activity (Iraq, Syria, Lebanon, Yemen), and sanctions posture are the core watch items; direct Iran-Israel exchanges have occurred episodically.',
    tags:['NUCLEAR PROGRAM','PROXY NETWORK'], link:'https://liveuamap.com/' },
  { name:'BALTICS / NATO EASTERN FLANK', lat:56.9, lon:24.1, sev:'low', conf:'LOW',
    brief:'NATO forward-deployed battlegroups, periodic hybrid incidents (undersea cable damage, GPS jamming, airspace violations) attributed to Russian activity.',
    tags:['HYBRID WARFARE','NATO POSTURE'], link:'https://liveuamap.com/' },
];

/* Leaflet conflict-map markers mirror the globe hotspots */
const CONFLICT_MARKERS = GLOBE_HOTSPOTS;

/* ---- Wikipedia trending config (live, wikimedia REST API, no key) ---- */
const WIKI_PROJECT = 'en.wikipedia';

/* ---- Military asset / deployment posture — REFERENCE snapshot only.
   There is no free, no-key API that returns real military deployment
   data (real-time order-of-battle tracking is genuinely hard even for
   professional OSINT shops). This is a curated, illustrative posture
   summary — treat as a starting orientation, not surveillance data.
   For real positions: use FLIGHTS/MARITIME trackers (unit-agnostic) or
   professional sources (Janes, IISS Military Balance). ---- */
const DEPLOYMENTS = [
  { country:'UNITED STATES', confidence:'MEDIUM',
    branches:['Navy: 11 carrier strike groups (nuclear-powered), forward-deployed 7th Fleet (Japan) and 5th Fleet (Bahrain)','Air Force: Global strike + airlift network, rotational bomber task forces','Nuclear triad: ICBM (Minuteman III), SLBM (Ohio-class), strategic bombers (B-2/B-52)'],
    deployments:['Carrier presence sustained in CENTCOM AOR (Red Sea / Gulf) amid Houthi maritime threat','Rotational bomber and fighter deployments to INDOPACOM amid Taiwan Strait tension','Continued security-assistance and training presence supporting EUCOM/Ukraine effort'],
  },
  { country:'RUSSIA', confidence:'MEDIUM',
    branches:['Ground forces: Bulk of combat-experienced units committed to Ukraine front','Navy: Black Sea Fleet surface presence reduced after sustained Ukrainian strikes; submarine force largely intact','Nuclear triad: Full triad maintained (Yars ICBM, Borei-class SSBN, strategic aviation)'],
    deployments:['Majority of deployable ground combat power remains committed inside Ukraine','Wagner/Africa Corps successor presence in Sahel states (Mali, CAR, Libya)','Baltic Fleet and Kaliningrad exclave garrison sustaining NATO-facing posture'],
  },
  { country:'CHINA', confidence:'MEDIUM',
    branches:['Navy (PLAN): Largest naval fleet by hull count; expanding carrier program (3 in service/trials)','Rocket Force: Growing conventional and nuclear missile inventory, includes DF-series ASBMs','Air Force: Rapidly modernizing fighter fleet (J-20 stealth), expanding airlift'],
    deployments:['Sustained naval and air presence around Taiwan (near-daily ADIZ activity)','Coast guard and maritime militia presence in South China Sea disputed features','Growing overseas logistics footprint (Djibouti base; port-access agreements)'],
  },
  { country:'IRAN', confidence:'LOW',
    branches:['IRGC: Parallel military structure controlling missile force and proxy-network coordination','Navy: Fast-attack/asymmetric Gulf posture rather than blue-water fleet','Missile force: Large short/medium-range ballistic and cruise missile inventory'],
    deployments:['IRGC-linked advisors and materiel support to regional proxy networks (Iraq, Syria, Lebanon, Yemen)','Naval/IRGC presence in the Strait of Hormuz and Persian Gulf','Continued, contested nuclear-fuel enrichment activity (monitored by IAEA)'],
  },
  { country:'NORTH KOREA (DPRK)', confidence:'LOW',
    branches:['Army: Very large standing force (~1.2M+) concentrated near the DMZ','Missile force: Expanding solid-fuel ICBM and hypersonic-glide-vehicle testing program','Navy: Coastal/littoral force plus a growing submarine-launched ballistic-missile effort'],
    deployments:['Standing forward deployment along the DMZ opposite South Korea','Reported troop and munitions support to Russia in exchange for technology transfer','Continued missile-testing cadence timed around U.S.-ROK exercise cycles'],
  },
  { country:'ISRAEL', confidence:'MEDIUM',
    branches:['Air Force: Regional air-superiority edge, F-35I stealth fleet','Missile defense: Layered system (Iron Dome, David’s Sling, Arrow)','Reserves: Large mobilizable reserve force relative to population'],
    deployments:['Active operations/posture across the Gaza periphery and northern border with Lebanon','Standing alert posture against Iran-linked missile/drone threats','Periodic strikes attributed to Israel against Iran-linked targets in Syria/Iraq'],
  },
];
const DEPLOYMENTS_SOURCE_NOTE = 'Illustrative posture summary only, not live order-of-battle tracking — force positioning changes constantly and is often deliberately obscured. Cross-check against IISS Military Balance, Janes, or current wire reporting before treating as current.';

/* ---- Historical parallels — interpretive context linking today's
   hotspots to earlier historical episodes. Educational framing device,
   not a claim that history repeats exactly. ---- */
const HISTORY_CONTEXT = [
  { hotspot:'UKRAINE', era:'Cold War proxy conflicts (1950s–80s) & WWII Eastern Front logistics',
    parallel:'Large-scale, industrial-tempo land warfare in Europe was widely assumed obsolete after 1945 outside limited proxy conflicts. The war’s reliance on artillery attrition and mass mobilization echoes WWI/WWII logistics more than the fast maneuver warfare of 1990s Iraq.',
    lesson:'Attritional wars historically end via exhaustion, external-support shifts, or negotiated freeze rather than decisive battlefield collapse — a pattern worth weighing against expectations of rapid resolution.' },
  { hotspot:'TAIWAN STRAIT', era:'Cross-strait crises of 1954–55, 1958, and 1995–96',
    parallel:'This is at least the fourth major Taiwan Strait tension cycle since 1949; prior crises involved artillery exchanges (1958) and missile tests near Taiwan (1995–96) without escalating to full invasion.',
    lesson:'Historically, coercive signaling (military exercises, ADIZ pressure) has been the dominant pattern rather than direct invasion — though China’s relative military capability today is far greater than in prior cycles, which is why analysts weight this era differently.' },
  { hotspot:'GAZA / ISRAEL', era:'Post-1948 Arab-Israeli wars and prior Gaza escalations (2008-09, 2012, 2014, 2021)',
    parallel:'Gaza has seen multiple prior rounds of major escalation followed by ceasefire-and-rebuild cycles; the current conflict is distinguished by its scale and duration relative to those precedents.',
    lesson:'Prior cycles suggest ceasefires historically address immediate hostilities without resolving root political status questions — a pattern relevant to assessing durability of any future ceasefire.' },
  { hotspot:'KOREAN PENINSULA', era:'Korean War armistice (1953) — never a formal peace treaty',
    parallel:'The peninsula has technically remained in a state of armistice, not peace, for over 70 years, with periodic crisis spikes (1968 Pueblo incident, 1976 axe murder incident, 2010 Yeonpyeong shelling) that did not escalate to renewed full war.',
    lesson:'Long precedent of high-rhetoric/low-follow-through cycles — useful context, though DPRK’s missile capability today is categorically more advanced than in any prior crisis window.' },
  { hotspot:'BALTICS / NATO EASTERN FLANK', era:'Cold War Berlin crises (1948, 1958–61) and Baltic annexation history (1940)',
    parallel:'The Baltic states’ 1940 Soviet annexation and the Cold War-era Berlin standoffs are the closest historical analogues for current "hybrid pressure short of open war" dynamics (blockade/access pressure then, cable-cutting/GPS-jamming now).',
    lesson:'NATO Article 5 collective-defense commitment (absent during the 1940 annexation) is the key structural difference cited by analysts for why direct territorial action is assessed as less likely today.' },
];

/* ---- Scenario planning — explicitly conditional "if/then" branches,
   NOT predictions or forecasts. likelihood uses qualitative labels on
   purpose (no fake percentages) to avoid implying false precision. ---- */
const SCENARIOS = {
  'UKRAINE': [
    { condition:'If Western material support continues at roughly the current pace', outcome:'Frontline most likely stays close to its current shape, with grinding, localized attritional shifts rather than a large territorial swing.', watch:'Aid-package votes, ammunition production rates, mobilization announcements', likelihood:'BASELINE TRAJECTORY' },
    { condition:'If a ceasefire framework gains real traction', outcome:'A negotiated freeze along roughly the existing line is more plausible than a comprehensive settlement of territorial status.', watch:'Track-2 diplomacy reports, third-party mediation signals, POW-exchange cadence', likelihood:'POSSIBLE' },
    { condition:'If either side achieves a major battlefield breakthrough', outcome:'Would likely force a rapid reassessment of Western support levels and could sharply accelerate or compress the conflict’s timeline.', watch:'Sudden territorial-control map shifts, emergency NATO consultations', likelihood:'TAIL RISK' },
  ],
  'TAIWAN STRAIT': [
    { condition:'If current coercive-pressure patterns continue', outcome:'Continued high-frequency ADIZ incursions and exercises without a direct kinetic move — the dominant historical pattern (see HISTORY tab).', watch:'ADIZ incursion counts, PLA exercise naming/scale, Taiwan election cycle', likelihood:'BASELINE TRAJECTORY' },
    { condition:'If a blockade/quarantine short of invasion is attempted', outcome:'Would test U.S./allied response thresholds without full-scale war, and could still severely disrupt semiconductor supply chains.', watch:'Unusual PLAN/coast-guard concentration near Taiwan’s ports, insurance-market signals', likelihood:'POSSIBLE' },
    { condition:'If a decision is made to attempt direct action', outcome:'Assessed by most public defense analysis as the least likely near-term path given invasion-logistics difficulty, but would be the most consequential.', watch:'Large-scale amphibious-lift mobilization, unusual reservist call-ups', likelihood:'TAIL RISK' },
  ],
  'RED SEA / YEMEN': [
    { condition:'If Houthi attacks continue at the current tempo', outcome:'Sustained elevated shipping costs and Cape-of-Good-Hope rerouting remain the norm rather than the exception.', watch:'Shipping-insurance premiums, transit-volume data through Bab-el-Mandeb', likelihood:'BASELINE TRAJECTORY' },
    { condition:'If a broader Gaza ceasefire is reached', outcome:'Houthi attacks have been explicitly linked to the Gaza conflict; a ceasefire could plausibly reduce (though not necessarily eliminate) strike frequency.', watch:'Houthi public statements tying actions to Gaza developments', likelihood:'POSSIBLE' },
  ],
  'KOREAN PENINSULA': [
    { condition:'If DPRK-Russia cooperation keeps deepening', outcome:'Continued technology transfer could accelerate DPRK missile/reentry-vehicle reliability faster than pre-2022 trend lines.', watch:'DPRK missile-test success rates, satellite-launch attempts', likelihood:'BASELINE TRAJECTORY' },
    { condition:'If U.S.-ROK-Japan trilateral coordination keeps expanding', outcome:'Increases combined deterrence signaling but also raises DPRK rhetorical escalation around each exercise cycle (historically has not led to renewed war — see HISTORY tab).', watch:'Joint exercise announcements, DPRK statements timed to them', likelihood:'BASELINE TRAJECTORY' },
  ],
  'IRAN': [
    { condition:'If nuclear negotiations remain stalled', outcome:'Continued incremental enrichment advances and sanctions pressure, without a clean resolution either direction.', watch:'IAEA reporting on enrichment levels, sanctions-relief negotiation signals', likelihood:'BASELINE TRAJECTORY' },
    { condition:'If direct Iran-Israel exchanges recur', outcome:'Past exchanges have been calibrated/contained rather than open war, but each round tests that ceiling further.', watch:'Direct strike claims by either side, IRGC/proxy activity spikes', likelihood:'POSSIBLE' },
  ],
};
const SCENARIOS_NOTE = 'These are illustrative if/then branches for orientation, not predictions or forecasts of what will happen. Likelihood labels are qualitative judgment calls, not statistical probabilities.';
