/* ═══════════════════════════════════════════════════════════════════
   WRAITH//NET — app logic.
   Sections: boot, bg-canvas, clocks, ticker, tabs, RSS engine, reddit,
   wikipedia trending, weather, crypto, stocks, leaflet map, three.js globe,
   daily synopsis (local keyword analysis — no external AI call is made,
   since no LLM key is configured; see README note in index.html).
   ═══════════════════════════════════════════════════════════════════ */

/* ---------------------------------------------------------------------
   BOOT SEQUENCE
--------------------------------------------------------------------- */
const BOOT_LINES = [
  'INITIALIZING WRAITH//NET CORE...',
  'LOADING CRYPTOGRAPHIC HANDSHAKE... <span class="ok">OK</span>',
  'ESTABLISHING FEED RELAYS (RSS/REDDIT/WIKI)... <span class="ok">OK</span>',
  'CALIBRATING GLOBE PROJECTION... <span class="ok">OK</span>',
  'SYNCING WORLD CLOCKS (7 ZONES)... <span class="ok">OK</span>',
  'ARMING THREAT MATRIX... <span class="ok">OK</span>',
  'LOADING CURATED REFERENCE ARCHIVES... <span class="ok">OK</span>',
  'ALL SYSTEMS NOMINAL.',
];
function boot(){
  const log = document.getElementById('boot-log');
  const bar = document.getElementById('bbar');
  const pct = document.getElementById('bpct');
  const stat = document.getElementById('bstat');
  let i = 0;
  BOOT_LINES.forEach(l=>{
    const d = document.createElement('div');
    d.className = 'bline';
    d.innerHTML = '&gt; ' + l;
    log.appendChild(d);
  });
  const lines = log.querySelectorAll('.bline');
  const step = ()=>{
    if(i < lines.length){
      lines[i].classList.add('on');
      const p = Math.round(((i+1)/lines.length)*100);
      bar.style.width = p+'%';
      pct.textContent = p+'%';
      stat.textContent = i===lines.length-1 ? 'READY' : 'BOOTING SUBSYSTEMS...';
      i++;
      setTimeout(step, 220);
    } else {
      setTimeout(()=>{
        document.getElementById('boot').style.transition = 'opacity .8s';
        document.getElementById('boot').style.opacity = '0';
        document.getElementById('app').classList.add('on');
        setTimeout(()=>document.getElementById('boot').style.display='none', 800);
        initEverything();
      }, 400);
    }
  };
  step();
}

/* ---------------------------------------------------------------------
   MOUSE-REACTIVE BACKGROUND PARTICLE GRID
--------------------------------------------------------------------- */
function initBgCanvas(){
  const canvas = document.getElementById('bg-canvas');
  const ctx = canvas.getContext('2d');
  let w, h, particles = [];
  const mouse = { x: -9999, y: -9999 };
  const N = Math.min(65, Math.floor((window.innerWidth*window.innerHeight)/22000));

  function resize(){
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }
  function makeParticles(){
    particles = Array.from({length:N}, ()=>({
      x: Math.random()*w, y: Math.random()*h,
      vx: (Math.random()-0.5)*0.25, vy: (Math.random()-0.5)*0.25,
      r: Math.random()*1.6+0.6,
    }));
  }
  window.addEventListener('resize', ()=>{ resize(); });
  window.addEventListener('mousemove', e=>{ mouse.x = e.clientX; mouse.y = e.clientY; });
  window.addEventListener('mouseleave', ()=>{ mouse.x = -9999; mouse.y = -9999; });

  resize(); makeParticles();

  function tick(){
    ctx.clearRect(0,0,w,h);
    for(const p of particles){
      // gentle drift
      p.x += p.vx; p.y += p.vy;
      if(p.x<0||p.x>w) p.vx*=-1;
      if(p.y<0||p.y>h) p.vy*=-1;
      // mouse repel
      const dx = p.x-mouse.x, dy = p.y-mouse.y;
      const d2 = dx*dx+dy*dy;
      if(d2 < 14000){
        const f = (14000-d2)/14000;
        p.x += dx*f*0.03; p.y += dy*f*0.03;
      }
      ctx.beginPath();
      ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
      ctx.fillStyle = 'rgba(79,195,255,0.55)';
      ctx.fill();
    }
    // connective lines
    for(let a=0;a<particles.length;a++){
      for(let b=a+1;b<particles.length;b++){
        const dx = particles[a].x-particles[b].x, dy = particles[a].y-particles[b].y;
        const d2 = dx*dx+dy*dy;
        if(d2 < 12000){
          ctx.strokeStyle = 'rgba(79,195,255,'+(0.12*(1-d2/12000))+')';
          ctx.lineWidth = 0.6;
          ctx.beginPath();
          ctx.moveTo(particles[a].x,particles[a].y);
          ctx.lineTo(particles[b].x,particles[b].y);
          ctx.stroke();
        }
      }
      // line to mouse for nearby particles = interactive feel
      const dxm = particles[a].x-mouse.x, dym = particles[a].y-mouse.y;
      const d2m = dxm*dxm+dym*dym;
      if(d2m < 16000){
        ctx.strokeStyle = 'rgba(255,45,78,'+(0.35*(1-d2m/16000))+')';
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.moveTo(particles[a].x,particles[a].y);
        ctx.lineTo(mouse.x,mouse.y);
        ctx.stroke();
      }
    }
    if(!document.hidden) requestAnimationFrame(tick);
    else bgPaused = true;
  }
  let bgPaused = false;
  document.addEventListener('visibilitychange', ()=>{
    if(!document.hidden && bgPaused){ bgPaused = false; tick(); }
  });
  tick();
}

/* ---------------------------------------------------------------------
   CLOCKS (7 zones, day/night indicator)
--------------------------------------------------------------------- */
function updateClocks(){
  const now = new Date();
  TIMEZONES.forEach(z=>{
    const fmt = new Intl.DateTimeFormat('en-GB', {
      timeZone: z.tz, hour:'2-digit', minute:'2-digit', second:'2-digit', hour12:false
    });
    const dfmt = new Intl.DateTimeFormat('en-GB', {
      timeZone: z.tz, weekday:'short', day:'2-digit', month:'short'
    });
    const t = fmt.format(now);
    const d = dfmt.format(now);
    const tEl = document.getElementById('ck-t-'+z.id);
    const dEl = document.getElementById('ck-d-'+z.id);
    if(tEl) tEl.textContent = t;
    if(dEl) dEl.textContent = d;
    const hourStr = new Intl.DateTimeFormat('en-GB',{timeZone:z.tz,hour:'2-digit',hour12:false}).format(now);
    const hour = parseInt(hourStr,10);
    const wrap = document.getElementById('ck-wrap-'+z.id);
    if(wrap){
      wrap.classList.toggle('night', !(hour>=6 && hour<19));
      wrap.classList.toggle('day', (hour>=6 && hour<19));
    }
  });
  const lupd = document.getElementById('lupd');
  if(lupd) lupd.textContent = 'SYNC: '+new Intl.DateTimeFormat('en-GB',{timeZone:'UTC',hour:'2-digit',minute:'2-digit',second:'2-digit',hour12:false}).format(now)+' Z';
}

/* ---------------------------------------------------------------------
   TAB SWITCHING
--------------------------------------------------------------------- */
function initTabs(){
  document.querySelectorAll('.tb').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      document.querySelectorAll('.tb').forEach(b=>b.classList.remove('on'));
      document.querySelectorAll('.tp').forEach(p=>p.classList.remove('on'));
      btn.classList.add('on');
      const tabId = btn.dataset.t;
      document.getElementById('tp-'+tabId).classList.add('on');
      const sel = document.querySelector('.sec-select[data-group="'+tabId+'"]');
      if(sel) activateSubpanel(tabId, sel.value);
    });
  });
  document.getElementById('globe-icon-btn')?.addEventListener('click', ()=>{
    document.querySelector('.tb[data-t="geospatial"]')?.click();
    const sel = document.querySelector('.sec-select[data-group="geospatial"]');
    if(sel && sel.value !== 'globe'){ sel.value = 'globe'; activateSubpanel('geospatial','globe'); }
    window.scrollTo({top:0, behavior:'smooth'});
  });
}

/* ---------------------------------------------------------------------
   SUBPANEL / DROPDOWN ENGINE — several tabs bundle multiple sources
   behind a <select>. Heavy widgets (maps, globe, iframes) are lazily
   initialized the first time their subpanel is actually shown, rather
   than all at page load, to keep initial load light.
--------------------------------------------------------------------- */
const TRACKERS = {
  flights:  { url:'https://globe.adsbexchange.com/', title:'▶ LIVE FLIGHT TRACKING — ADS-B EXCHANGE',
    note:'Live flight-tracking embed from ADS-B Exchange — unfiltered feed (includes aircraft other trackers filter out on request).' },
  maritime: { url:'https://www.marinetraffic.com/en/ais/home/centerx:-12.0/centery:25.0/zoom:4', title:'≈ LIVE VESSEL TRACKING — MARINETRAFFIC',
    note:'Live AIS vessel-tracking embed from MarineTraffic.' },
  pizza:    { url:'https://www.pizzint.watch/', title:'○ PIZZA INDEX — LIVE EMBED',
    note:'The "Pentagon Pizza Index" is a long-running joke/informal indicator theorizing that late-night pizza-delivery spikes near the Pentagon correlate with crisis activity — treat it as a curiosity, not a validated signal.' },
};
function setTracker(key){
  const t = TRACKERS[key];
  const ifr = document.getElementById('tracker-iframe');
  if(ifr && ifr.dataset.current !== key){ ifr.src = t.url; ifr.dataset.current = key; }
  const titleEl = document.getElementById('tracker-title');
  const noteEl = document.getElementById('tracker-note');
  if(titleEl) titleEl.textContent = t.title;
  if(noteEl) noteEl.textContent = t.note;
}

function activateSubpanel(group, key){
  document.querySelectorAll('.subpanel[data-group="'+group+'"]').forEach(p=>{
    p.style.display = (p.dataset.key===key) ? '' : 'none';
  });
  onSubpanelShown(group, key);
}

function onSubpanelShown(group, key){
  if(group==='news' && key==='ground'){
    const ifr = document.querySelector('#tp-news [data-key="ground"] iframe[data-lazy-src]');
    if(ifr && !ifr.src) ifr.src = ifr.dataset.lazySrc;
  }
  if(group==='social' && key==='reddit' && !window.__redditInited){
    window.__redditInited = true;
    initRedditTab();
  }
  if(group==='trackers'){
    setTracker(key);
  }
  if(group==='geospatial'){
    if(key==='warmap'){
      if(!window.__conflictMap) initConflictMap();
      else setTimeout(()=>window.__conflictMap.invalidateSize(), 60);
    }
    if(key==='globe'){
      if(!window.__wraithGlobe) initGlobe();
      else window.__wraithGlobe.onResize();
    }
    if(key==='satellite'){
      if(!window.__satMap) initSatelliteMap();
      else setTimeout(()=>window.__satMap.invalidateSize(), 60);
    }
  }
}

function initSubpanelSelects(){
  document.querySelectorAll('.sec-select').forEach(sel=>{
    sel.addEventListener('change', ()=> activateSubpanel(sel.dataset.group, sel.value));
  });
}

/* ---------------------------------------------------------------------
   FETCH-VIA-PROXY ENGINE (RSS/XML sources with no CORS headers)
--------------------------------------------------------------------- */
function looksLikeFeed(text){
  if(!text || text.length < 40) return false;
  const head = text.slice(0,400).toLowerCase();
  return head.includes('<?xml') || head.includes('<rss') || head.includes('<feed') || text.includes('<item') || text.includes('<entry');
}
async function fetchOnce(url, timeoutMs){
  const ctrl = new AbortController();
  const t = setTimeout(()=>ctrl.abort(), timeoutMs);
  try{
    const res = await fetch(url, { signal: ctrl.signal });
    if(!res.ok) throw new Error('HTTP '+res.status);
    const text = await res.text();
    if(!looksLikeFeed(text)) throw new Error('proxy returned non-feed content (blocked/rate-limited)');
    return text;
  } finally { clearTimeout(t); }
}
async function fetchViaProxies(url, timeoutMs=14000){
  let lastErr;
  for(const build of CORS_PROXIES){
    const proxied = build(url);
    // retry once per proxy — the free proxies above are flaky under burst load
    for(let attempt=0; attempt<2; attempt++){
      try{ return await fetchOnce(proxied, timeoutMs); }
      catch(e){ lastErr = e; if(attempt===0) await new Promise(r=>setTimeout(r, 700)); }
    }
  }
  throw lastErr || new Error('all proxies failed');
}

function stripHtml(s){
  return (s||'').replace(/<!\[CDATA\[|\]\]>/g,'').replace(/<[^>]*>/g,'').replace(/&nbsp;/g,' ').replace(/&amp;/g,'&').replace(/&#39;|&apos;/g,"'").replace(/&quot;/g,'"').trim();
}

/* Parses both RSS 2.0 <item> and Atom <entry> formats */
function parseFeedXML(xmlText, sourceName){
  const items = [];
  try{
    const doc = new DOMParser().parseFromString(xmlText, 'text/xml');
    if(doc.querySelector('parsererror')) throw new Error('parse error');
    const rssItems = doc.querySelectorAll('item');
    if(rssItems.length){
      rssItems.forEach(it=>{
        items.push({
          title: stripHtml(it.querySelector('title')?.textContent || '(no title)'),
          link: it.querySelector('link')?.textContent || '#',
          date: it.querySelector('pubDate')?.textContent || '',
          desc: stripHtml(it.querySelector('description')?.textContent || '').slice(0,180),
          source: sourceName,
        });
      });
    } else {
      const entries = doc.querySelectorAll('entry');
      entries.forEach(en=>{
        const linkEl = en.querySelector('link');
        items.push({
          title: stripHtml(en.querySelector('title')?.textContent || '(no title)'),
          link: (linkEl && (linkEl.getAttribute('href')||linkEl.textContent)) || '#',
          date: en.querySelector('updated')?.textContent || en.querySelector('published')?.textContent || '',
          desc: stripHtml(en.querySelector('summary')?.textContent || en.querySelector('content')?.textContent || '').slice(0,180),
          source: sourceName,
        });
      });
    }
  }catch(e){ /* return whatever we have */ }
  return items;
}

function timeAgo(dateStr){
  if(!dateStr) return '';
  const d = new Date(dateStr);
  if(isNaN(d)) return '';
  const diffMin = Math.round((Date.now()-d.getTime())/60000);
  if(diffMin < 1) return 'JUST NOW';
  if(diffMin < 60) return diffMin+'M AGO';
  const h = Math.round(diffMin/60);
  if(h < 24) return h+'H AGO';
  return Math.round(h/24)+'D AGO';
}

function renderFeed(containerId, items, tagClass, tagLabel, limit=14){
  const el = document.getElementById(containerId);
  if(!el) return;
  if(!items.length){ el.innerHTML = '<div class="err-txt">X — NO ITEMS RETURNED — SOURCE MAY BE RATE-LIMITING THE PROXY. TRY REFRESH.</div>'; return; }
  el.innerHTML = items.slice(0,limit).map(it=>`
    <div class="ni" onclick="window.open('${it.link.replace(/'/g,"%27")}','_blank')">
      <div class="ni-t">${it.title}</div>
      <div class="ni-m"><span class="tag ${tagClass}">${tagLabel || it.source}</span>${it.date?`<span>${timeAgo(it.date)}</span>`:''}</div>
      ${it.desc?`<div class="ni-src">${it.desc.slice(0,140)}</div>`:''}
    </div>`).join('');
}

let ALL_HEADLINES = []; // accumulated across feeds, used by daily synopsis

const wait = ms => new Promise(r=>setTimeout(r, ms));
async function loadFeedGroup(containerId, feeds, tagClass){
  const el = document.getElementById(containerId);
  if(el) el.innerHTML = '<div class="loading-txt"><span class="spin">◌</span> PULLING LIVE FEEDS...</div>';
  // stagger individual requests within the group too — same proxy, same burst problem
  const results = await Promise.allSettled(feeds.map((f,i)=>
    wait(i*450).then(()=>fetchViaProxies(f.url)).then(txt=>parseFeedXML(txt, f.name))
  ));
  let merged = [];
  results.forEach(r=>{ if(r.status==='fulfilled') merged = merged.concat(r.value); });
  merged.sort((a,b)=> new Date(b.date||0) - new Date(a.date||0));
  ALL_HEADLINES = ALL_HEADLINES.concat(merged.map(m=>m.title));
  renderFeed(containerId, merged, tagClass);
  return merged;
}

async function loadSingleRSS(containerId, url, name, tagClass){
  const el = document.getElementById(containerId);
  if(el) el.innerHTML = '<div class="loading-txt"><span class="spin">◌</span> LOADING '+name+'...</div>';
  try{
    const txt = await fetchViaProxies(url);
    const items = parseFeedXML(txt, name);
    renderFeed(containerId, items, tagClass);
  }catch(e){
    if(el) el.innerHTML = `<div class="err-txt">X — COULD NOT REACH ${name} VIA PROXY. <a href="${url}" target="_blank" style="color:var(--c)">Open source directly ↗</a></div>`;
  }
}
window.loadSingleRSS = loadSingleRSS;

/* ---------------------------------------------------------------------
   REDDIT (live .rss via CORS proxy)
--------------------------------------------------------------------- */
async function loadReddit(sub, containerId){
  const el = document.getElementById(containerId);
  if(el) el.innerHTML = '<div class="loading-txt"><span class="spin">◌</span> LOADING r/'+sub+'...</div>';
  try{
    const txt = await fetchViaProxies('https://www.reddit.com/r/'+sub+'/.rss');
    const items = parseFeedXML(txt, 'r/'+sub);
    ALL_HEADLINES = ALL_HEADLINES.concat(items.map(i=>i.title));
    renderFeed(containerId, items, 'tc', 'r/'+sub);
  }catch(e){
    if(el) el.innerHTML = `<div class="err-txt">X — REDDIT UNREACHABLE VIA PROXY. <a href="https://www.reddit.com/r/${sub}/" target="_blank" style="color:var(--c)">Open r/${sub} directly ↗</a></div>`;
  }
}
window.loadReddit = loadReddit;

function initRedditTab(){
  const wrap = document.getElementById('reddit-panels');
  wrap.innerHTML = REDDIT_SUBS.map(s=>`
    <div class="pnl">
      <div class="ph"><div class="pt">◈ ${s.label}</div>
        <button class="rbtn" onclick="loadReddit('${s.sub}','feed-r-${s.sub}')">↻ REFRESH</button>
      </div>
      <div class="pb"><div class="feed" id="feed-r-${s.sub}" style="max-height:340px;"></div></div>
    </div>`).join('');
  REDDIT_SUBS.forEach(s=>loadReddit(s.sub, 'feed-r-'+s.sub));
}

/* ---------------------------------------------------------------------
   WIKIPEDIA TRENDING (live, Wikimedia REST API, no key, CORS-open)
--------------------------------------------------------------------- */
async function loadWikiTrending(){
  const el = document.getElementById('wiki-trending');
  el.innerHTML = '<div class="loading-txt"><span class="spin">◌</span> LOADING WIKIPEDIA TOP ARTICLES...</div>';
  const d = new Date(Date.now() - 86400000*2); // 2 days ago — ensures data is finalized
  const y = d.getUTCFullYear(), m = String(d.getUTCMonth()+1).padStart(2,'0'), day = String(d.getUTCDate()).padStart(2,'0');
  const url = `https://wikimedia.org/api/rest_v1/metrics/pageviews/top/${WIKI_PROJECT}/all-access/${y}/${m}/${day}`;
  try{
    const res = await fetch(url);
    const j = await res.json();
    const articles = (j.items?.[0]?.articles || []).filter(a=>!/^(Main_Page|Special:|Wikipedia:)/.test(a.article)).slice(0,20);
    el.innerHTML = articles.map((a,i)=>`
      <div class="ni">
        <div class="ni-t"><span style="color:var(--r);font-family:'Orbitron',sans-serif;font-size:10px;">#${i+1}</span> ${a.article.replace(/_/g,' ')}</div>
        <div class="ni-m"><span class="tag tc">${a.views.toLocaleString()} VIEWS</span><a href="https://en.wikipedia.org/wiki/${a.article}" target="_blank" style="color:var(--mu);font-size:9px;">OPEN ARTICLE ↗</a></div>
      </div>`).join('');
  }catch(e){
    el.innerHTML = '<div class="err-txt">X — WIKIMEDIA API UNREACHABLE. <a href="https://en.wikipedia.org/wiki/Special:RecentChanges" target="_blank" style="color:var(--c)">Open Wikipedia directly ↗</a></div>';
  }
}

/* ---------------------------------------------------------------------
   WEATHER (live, Open-Meteo, no key, CORS-open)
--------------------------------------------------------------------- */
async function loadWeather(){
  const el = document.getElementById('wx-grid');
  el.innerHTML = '<div class="loading-txt"><span class="spin">◌</span> PULLING GLOBAL WEATHER...</div>';
  try{
    const results = await Promise.all(WEATHER_CITIES.map(c=>
      fetch(`https://api.open-meteo.com/v1/forecast?latitude=${c.lat}&longitude=${c.lon}&current=temperature_2m,weather_code,wind_speed_10m,relative_humidity_2m,precipitation,rain`)
        .then(r=>r.json()).then(j=>({city:c.name, lat:c.lat, lon:c.lon, cur:j.current})).catch(()=>({city:c.name, lat:c.lat, lon:c.lon, cur:null}))
    ));
    el.innerHTML = results.map(r=>{
      const coordTxt = `${Math.abs(r.lat).toFixed(2)}°${r.lat>=0?'N':'S'}, ${Math.abs(r.lon).toFixed(2)}°${r.lon>=0?'E':'W'}`;
      if(!r.cur) return `<div class="wx-card"><div class="wx-city">${r.city}</div><div class="wx-coord">${coordTxt}</div><div class="err-txt">N/A</div></div>`;
      const label = WMO[r.cur.weather_code] || 'UNKNOWN';
      const c = r.cur.temperature_2m, f = (c*9/5)+32;
      const precip = r.cur.precipitation ?? 0, rain = r.cur.rain ?? 0;
      return `<div class="wx-card">
        <div class="wx-city">${r.city}</div>
        <div class="wx-coord">${coordTxt}</div>
        <div class="wx-temp">${Math.round(c)}°C <span class="wx-temp-f">/ ${Math.round(f)}°F</span></div>
        <div class="wx-desc">${label}</div>
        <div class="wx-meta"><span>RH ${r.cur.relative_humidity_2m}%</span><span>WIND ${Math.round(r.cur.wind_speed_10m)}KM/H</span></div>
        <div class="wx-meta"><span>PRECIP ${precip.toFixed(1)}MM</span><span>RAIN ${rain.toFixed(1)}MM</span></div>
      </div>`;
    }).join('');
  }catch(e){
    el.innerHTML = '<div class="err-txt">X — WEATHER API UNREACHABLE.</div>';
  }
}

/* ---------------------------------------------------------------------
   CRYPTO (live, CoinGecko free API, no key, CORS-open)
--------------------------------------------------------------------- */
async function loadCrypto(){
  const el = document.getElementById('crypto-list');
  el.innerHTML = '<div class="loading-txt"><span class="spin">◌</span> LOADING CRYPTO MARKETS...</div>';
  try{
    const res = await fetch(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${CRYPTO_IDS.join(',')}&order=market_cap_desc`);
    const data = await res.json();
    el.innerHTML = data.map(c=>`
      <div class="crow">
        <div><div class="csym">${c.symbol.toUpperCase()}</div><div class="cname">${c.name}</div></div>
        <div style="text-align:right;">
          <div class="cprice">$${c.current_price.toLocaleString(undefined,{maximumFractionDigits: c.current_price<1?4:2})}</div>
          <div class="cchg ${c.price_change_percentage_24h>=0?'up':'dn'}">${c.price_change_percentage_24h>=0?'▲':'▼'} ${Math.abs(c.price_change_percentage_24h||0).toFixed(2)}%</div>
        </div>
      </div>`).join('');
    window.__cryptoCache = data;
    buildTicker();
  }catch(e){
    el.innerHTML = '<div class="err-txt">X — COINGECKO API UNREACHABLE.</div>';
  }
}

/* ---------------------------------------------------------------------
   STOCKS (live, stooq.com free CSV, no key, via proxy)
--------------------------------------------------------------------- */
function parseStooqCSV(text){
  return text.trim().split('\n').slice(1).map(line=>{
    const parts = line.split(',');
    const [sym,,,open,,,close] = parts;
    const o = parseFloat(open), c = parseFloat(close);
    const chg = (o && c) ? ((c-o)/o*100) : 0;
    return { sym: (sym||'').toUpperCase(), close: c, chg };
  }).filter(r=>!isNaN(r.close));
}
async function loadStocks(){
  const idxEl = document.getElementById('stock-indices');
  const defEl = document.getElementById('stock-defense');
  idxEl.innerHTML = defEl.innerHTML = '<div class="loading-txt"><span class="spin">◌</span> LOADING MARKET DATA...</div>';
  try{
    const idxSyms = STOCK_SYMBOLS.indices.map(s=>s.sym).join(',');
    const defSyms = STOCK_SYMBOLS.defense.map(s=>s.sym).join(',');
    const [idxTxt, defTxt] = await Promise.all([
      fetchViaProxies(`https://stooq.com/q/l/?s=${idxSyms}&f=sd2t2ohlc&h&e=csv`),
      fetchViaProxies(`https://stooq.com/q/l/?s=${defSyms}&f=sd2t2ohlc&h&e=csv`),
    ]);
    renderStockRows(idxEl, parseStooqCSV(idxTxt), STOCK_SYMBOLS.indices);
    renderStockRows(defEl, parseStooqCSV(defTxt), STOCK_SYMBOLS.defense);
  }catch(e){
    idxEl.innerHTML = defEl.innerHTML = '<div class="err-txt">X — STOOQ FEED UNREACHABLE VIA PROXY. <a href="https://stooq.com/" target="_blank" style="color:var(--c)">Open stooq.com ↗</a></div>';
  }
}
function renderStockRows(el, rows, meta){
  if(!rows.length){ el.innerHTML = '<div class="err-txt">X — NO DATA RETURNED.</div>'; return; }
  el.innerHTML = rows.map(r=>{
    const m = meta.find(x=>x.sym.toUpperCase()===r.sym) || {name:r.sym};
    return `<div class="mrow">
      <div><div class="msym">${m.name}</div><div class="mname">${r.sym}</div></div>
      <div style="text-align:right;">
        <div class="mprice">${isNaN(r.close)?'—':r.close.toFixed(2)}</div>
        <div class="mchg ${r.chg>=0?'up':'dn'}">${r.chg>=0?'▲':'▼'} ${Math.abs(r.chg).toFixed(2)}%</div>
      </div>
    </div>`;
  }).join('');
}

/* ---------------------------------------------------------------------
   GLOBAL TICKER (built from live crypto + static reference labels)
--------------------------------------------------------------------- */
function buildTicker(){
  const el = document.getElementById('global-ticker');
  if(!el) return;
  const crypto = window.__cryptoCache || [];
  const items = crypto.map(c=>`<div class="ti"><span class="ti-s">${c.symbol.toUpperCase()}</span><span>$${c.current_price.toLocaleString()}</span><span class="${c.price_change_percentage_24h>=0?'up':'dn'}">${c.price_change_percentage_24h>=0?'▲':'▼'}${Math.abs(c.price_change_percentage_24h||0).toFixed(1)}%</span></div>`);
  const staticItems = [
    '<div class="ti"><span class="ti-s">WRAITH//NET</span><span>OSINT AGGREGATION ACTIVE</span></div>',
    '<div class="ti"><span class="ti-s">FEEDS</span><span>RSS · REDDIT · WIKI · CRYPTO · MARKETS LIVE</span></div>',
  ];
  const all = items.concat(staticItems);
  el.innerHTML = all.concat(all).join(''); // duplicate for seamless loop
}

/* ---------------------------------------------------------------------
   DAILY SYNOPSIS — local keyword-frequency analysis over headlines
   pulled this session. NOT an AI/LLM call (no key configured) — this
   is a transparent, deterministic keyword scan, labeled as such in UI.
--------------------------------------------------------------------- */
const STOPWORDS = new Set('the a an of to in on for and or with at by from as is are was were be been will would could should this that it its his her their they we you your our not no after over amid amid says say said new us u.s uk eu'.split(' '));
const THEME_MAP = [
  { kw:['ukraine','kyiv','zelensky','kremlin','russia','russian','putin'], label:'RUSSIA / UKRAINE WAR', implication:'Continued attrition warfare keeps Western aid packages, sanctions enforcement, and NATO posture in the headlines — watch for shifts in territorial control or ceasefire signaling.' },
  { kw:['gaza','israel','hamas','idf','hezbollah','lebanon','netanyahu'], label:'ISRAEL / GAZA / REGIONAL', implication:'Any escalation on the Israel-Lebanon border or hostage/ceasefire developments carries direct risk of wider regional spillover.' },
  { kw:['china','taiwan','beijing','pla','xi'], label:'CHINA / TAIWAN', implication:'PLA activity near Taiwan and U.S.-China trade/tech friction remain the top structural risk in the Indo-Pacific.' },
  { kw:['iran','tehran','houthi','yemen','irgc'], label:'IRAN / RED SEA', implication:'Houthi shipping attacks and Iran-linked proxy activity continue to pressure Red Sea shipping insurance and transit times.' },
  { kw:['nato','alliance','deterrence'], label:'NATO / ALLIANCE POSTURE', implication:'NATO force-posture and burden-sharing debates directly shape EUCOM resourcing.' },
  { kw:['sanctions','tariff','export','trade'], label:'SANCTIONS / TRADE POLICY', implication:'New sanctions or export-control actions typically move commodity and defense-sector equities within days.' },
  { kw:['cyber','ransomware','hack','breach'], label:'CYBER THREATS', implication:'Cyber incidents against critical infrastructure or government networks are a recurring, low-visibility risk vector.' },
  { kw:['korea','pyongyang','kim','dprk','missile'], label:'KOREAN PENINSULA', implication:'DPRK missile tests and Russia-DPRK cooperation are worth tracking against U.S.-ROK exercise cycles.' },
  { kw:['election','vote','president','congress'], label:'ELECTIONS / DOMESTIC POLITICS', implication:'Election-cycle dynamics affect the durability of current foreign-policy commitments.' },
  { kw:['fed','inflation','rate','market','stocks'], label:'ECONOMIC / MARKETS', implication:'Rate and inflation signals move alongside the geopolitical risk premium priced into defense and energy equities.' },
];

function generateDailySynopsis(){
  const el = document.getElementById('brief-body');
  const ts = document.getElementById('brief-timestamp');
  if(!el) return;
  if(!ALL_HEADLINES.length){
    el.innerHTML = '<div class="loading-txt">Waiting on live feeds to populate before synopsis can be generated — visit the WIRE/GEOPOLITICS/DEFENSE tabs to pull data, then return here.</div>';
    return;
  }
  const freq = {};
  ALL_HEADLINES.forEach(title=>{
    title.toLowerCase().replace(/[^a-z0-9\s]/g,' ').split(/\s+/).forEach(w=>{
      if(w.length>3 && !STOPWORDS.has(w)) freq[w] = (freq[w]||0)+1;
    });
  });
  const topWords = Object.entries(freq).sort((a,b)=>b[1]-a[1]).slice(0,12);

  const detectedThemes = THEME_MAP.filter(t=>
    t.kw.some(k=> ALL_HEADLINES.some(h=>h.toLowerCase().includes(k)))
  );

  const themeHtml = detectedThemes.length ? detectedThemes.map(t=>`
    <div class="brief-section">
      <div class="brief-section-title">▸ ${t.label}</div>
      <div>Detected across current headline set.</div>
      <div class="brief-implication">IMPLICATION: ${t.implication}</div>
    </div>`).join('') : '<div class="brief-section">No strong thematic signal detected in current headline sample.</div>';

  const wordHtml = topWords.map(([w,n])=>`<span class="gtag">${w.toUpperCase()} ×${n}</span>`).join(' ');

  el.innerHTML = `
    <div class="brief-section">
      <div class="brief-section-title">▸ SAMPLE SIZE</div>
      <div>${ALL_HEADLINES.length} headlines analyzed across active feed tabs this session.</div>
    </div>
    ${themeHtml}
    <div class="brief-section">
      <div class="brief-section-title">▸ TOP RECURRING TERMS</div>
      <div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:4px;">${wordHtml}</div>
    </div>
    <div class="ref-note"><b>METHOD:</b> This synopsis is generated locally in your browser via deterministic keyword-frequency analysis of headlines you've pulled this session — it is <b>not</b> an AI/LLM-generated interpretation (no external AI key is configured). Pull more feed tabs for a richer sample.</div>
  `;
  if(ts) ts.textContent = 'GENERATED '+new Date().toLocaleTimeString()+' · LOCAL ANALYSIS';
}
window.generateDailySynopsis = generateDailySynopsis;

/* ---------------------------------------------------------------------
   SEVERITY FILTER CHIPS — reusable across trend cards, conflict map, globe
--------------------------------------------------------------------- */
function buildFilterChips(containerId, onChange){
  const el = document.getElementById(containerId);
  if(!el) return;
  const levels = [['high','HIGH','#ff2d4e'],['med','MED','#ff9633'],['low','LOW','#ffcc33']];
  let active = new Set(['high','med','low']);
  function render(){
    el.innerHTML = '<span class="filter-label">SEVERITY</span>' +
      levels.map(([key,label,color])=>`<button class="fchip${active.has(key)?' on':''}" data-k="${key}" style="--fc:${color}">${label}</button>`).join('') +
      `<button class="fchip fchip-all">ALL</button>`;
    el.querySelectorAll('.fchip[data-k]').forEach(btn=>{
      btn.addEventListener('click', ()=>{
        const k = btn.dataset.k;
        if(active.has(k)) active.delete(k); else active.add(k);
        if(active.size===0) active = new Set(levels.map(l=>l[0]));
        render(); onChange(active);
      });
    });
    el.querySelector('.fchip-all').addEventListener('click', ()=>{
      active = new Set(levels.map(l=>l[0]));
      render(); onChange(active);
    });
  }
  render();
  onChange(active);
}

/* ---------------------------------------------------------------------
   LEAFLET MAPS — conflict map + satellite (NASA GIBS, no key)
--------------------------------------------------------------------- */
function sevColor(sev){ return sev==='high' ? '#ff2d4e' : sev==='med' ? '#ff9633' : '#ffcc33'; }
function sevClass(sev){ return sev==='high' ? 'sev-crit' : sev==='med' ? 'sev-high' : 'sev-med'; }

function initConflictMap(){
  const map = L.map('conflict-map', { worldCopyJump:true }).setView([25,20], 2.4);
  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution:'© OpenStreetMap, © CARTO', maxZoom:18, subdomains:'abcd',
  }).addTo(map);
  const markerRecords = [];
  CONFLICT_MARKERS.forEach(m=>{
    const marker = L.circleMarker([m.lat,m.lon], {
      radius: m.sev==='high'?9:m.sev==='med'?7:5.5,
      color: sevColor(m.sev), weight:2, fillColor: sevColor(m.sev), fillOpacity:0.55,
      className:'pulse-marker',
    }).addTo(map);
    marker.bindPopup(`<div class="mpop"><h4>${m.name}</h4><p>${m.brief}</p><span class="sev-tag ${sevClass(m.sev)}">${m.sev.toUpperCase()} SEVERITY</span> <span class="sev-tag" style="border-color:var(--bc2);color:var(--c);">CONFIDENCE: ${m.conf||'—'}</span><br><a href="${m.link}" target="_blank" style="color:var(--c);font-size:10px;">LIVE TRACKER ↗</a></div>`);
    markerRecords.push({ marker, sev:m.sev });
  });
  buildFilterChips('map-filter', active=>{
    markerRecords.forEach(r=>{
      if(active.has(r.sev)){ if(!map.hasLayer(r.marker)) map.addLayer(r.marker); }
      else{ if(map.hasLayer(r.marker)) map.removeLayer(r.marker); }
    });
  });
  window.__conflictMap = map;
}

function initSatelliteMap(){
  const map = L.map('satellite-map', { worldCopyJump:true }).setView([20,10], 2.2);
  const today = new Date(Date.now()-86400000*2).toISOString().slice(0,10); // GIBS needs a finalized date
  const gibs = L.tileLayer(
    `https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/MODIS_Terra_CorrectedReflectance_TrueColor/default/${today}/GoogleMapsCompatible_Level9/{z}/{y}/{x}.jpg`,
    { attribution:'NASA EOSDIS GIBS / MODIS Terra', maxZoom:9, tileSize:256, className:'map-layer-toggle' }
  ).addTo(map);
  const dark = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution:'© OpenStreetMap, © CARTO', maxZoom:18, subdomains:'abcd',
  });
  L.control.layers({ 'NASA MODIS TRUE-COLOR (LIVE)': gibs, 'DARK REFERENCE MAP': dark }).addTo(map);
  window.__satMap = map;
}

/* ---------------------------------------------------------------------
   THREE.JS INTERACTIVE GLOBE — click a hotspot to see its brief
--------------------------------------------------------------------- */
function latLonToVec3(lat, lon, r){
  const phi = (90-lat)*(Math.PI/180);
  const theta = (lon+180)*(Math.PI/180);
  return new THREE.Vector3(
    -r*Math.sin(phi)*Math.cos(theta),
    r*Math.cos(phi),
    r*Math.sin(phi)*Math.sin(theta)
  );
}
function initGlobe(){
  const wrap = document.getElementById('globe-wrap');
  const canvasEl = document.getElementById('globe-canvas-el');
  const loadingEl = document.getElementById('globe-loading');
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, wrap.clientWidth/wrap.clientHeight, 0.1, 1000);
  camera.position.set(0,0,7.5);
  const renderer = new THREE.WebGLRenderer({ canvas:canvasEl, antialias:true, alpha:true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));
  renderer.setSize(wrap.clientWidth, wrap.clientHeight);

  const controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true; controls.dampingFactor = 0.08;
  controls.autoRotate = true; controls.autoRotateSpeed = 0.5;
  controls.minDistance = 4.5; controls.maxDistance = 14;

  scene.add(new THREE.AmbientLight(0x6fa8ff, 0.9));
  const sun = new THREE.DirectionalLight(0xffffff, 1.1);
  sun.position.set(5,3,5);
  scene.add(sun);

  const R = 2.6;
  const geo = new THREE.SphereGeometry(R, 64, 64);
  const loader = new THREE.TextureLoader();
  loader.crossOrigin = 'anonymous';
  const mat = new THREE.MeshPhongMaterial({ color:0x3a6fb0, shininess:8 });
  const globe = new THREE.Mesh(geo, mat);
  scene.add(globe);
  loader.load('https://unpkg.com/three@0.150.1/examples/textures/planets/earth_atmos_2048.jpg',
    tex=>{ mat.map = tex; mat.color.set(0xffffff); mat.needsUpdate = true; if(loadingEl) loadingEl.style.display='none'; },
    undefined,
    ()=>{ if(loadingEl) loadingEl.textContent = 'TEXTURE UNAVAILABLE — SHOWING WIREFRAME REFERENCE'; }
  );

  // atmosphere glow
  const glowGeo = new THREE.SphereGeometry(R*1.04, 64, 64);
  const glowMat = new THREE.MeshBasicMaterial({ color:0x4fc3ff, transparent:true, opacity:0.08, side:THREE.BackSide });
  scene.add(new THREE.Mesh(glowGeo, glowMat));

  // wireframe overlay for cyberpunk feel
  const wireGeo = new THREE.SphereGeometry(R*1.002, 32, 32);
  const wireMat = new THREE.MeshBasicMaterial({ color:0x4fc3ff, wireframe:true, transparent:true, opacity:0.06 });
  scene.add(new THREE.Mesh(wireGeo, wireMat));

  // hotspot markers
  const markerObjs = [];
  const markerRecords = [];
  GLOBE_HOTSPOTS.forEach(h=>{
    const pos = latLonToVec3(h.lat, h.lon, R*1.015);
    const color = h.sev==='high' ? 0xff2d4e : h.sev==='med' ? 0xff9633 : 0xffcc33;
    const mGeo = new THREE.SphereGeometry(0.045, 12, 12);
    const mMat = new THREE.MeshBasicMaterial({ color });
    const mesh = new THREE.Mesh(mGeo, mMat);
    mesh.position.copy(pos);
    mesh.userData.hotspot = h;
    scene.add(mesh);
    markerObjs.push(mesh);
    // pulsing ring
    const ringGeo = new THREE.RingGeometry(0.06,0.09,24);
    const ringMat = new THREE.MeshBasicMaterial({ color, transparent:true, opacity:0.5, side:THREE.DoubleSide });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.position.copy(pos);
    ring.lookAt(0,0,0);
    scene.add(ring);
    markerRecords.push({ mesh, ring, sev:h.sev });
  });
  buildFilterChips('globe-filter', active=>{
    markerRecords.forEach(r=>{
      const on = active.has(r.sev);
      r.mesh.visible = on; r.ring.visible = on;
    });
  });

  const raycaster = new THREE.Raycaster();
  const ndc = new THREE.Vector2();
  function showInfo(h){
    const info = document.getElementById('globe-info');
    document.getElementById('globe-info-title').textContent = h.name+' — '+h.sev.toUpperCase()+' SEVERITY';
    document.getElementById('globe-info-body').textContent = h.brief;
    document.getElementById('globe-info-tags').innerHTML = h.tags.map(t=>`<span class="gtag ${h.sev}">${t}</span>`).join('') +
      `<span class="gtag" style="border-color:var(--bc2);color:var(--c);">CONFIDENCE: ${h.conf||'—'}</span>`;
    document.getElementById('globe-info-link').href = h.link;
    info.classList.add('on');
  }
  renderer.domElement.addEventListener('click', e=>{
    const rect = renderer.domElement.getBoundingClientRect();
    ndc.x = ((e.clientX-rect.left)/rect.width)*2-1;
    ndc.y = -((e.clientY-rect.top)/rect.height)*2+1;
    raycaster.setFromCamera(ndc, camera);
    const hits = raycaster.intersectObjects(markerObjs);
    if(hits.length) showInfo(hits[0].object.userData.hotspot);
  });
  document.getElementById('globe-info-close')?.addEventListener('click', ()=>{
    document.getElementById('globe-info').classList.remove('on');
  });

  function animate(){
    requestAnimationFrame(animate);
    // skip work entirely when the globe subpanel is scrolled out of the DOM
    // (display:none) or the browser tab itself isn't visible — this is a
    // WebGL scene with continuous rendering, the single most expensive
    // widget in the app, so it's worth the extra check every frame.
    if(document.hidden || wrap.offsetParent === null) return;
    controls.update();
    renderer.render(scene, camera);
  }
  animate();

  function onResize(){
    const wpx = wrap.clientWidth, hpx = wrap.clientHeight;
    camera.aspect = wpx/hpx; camera.updateProjectionMatrix();
    renderer.setSize(wpx, hpx);
  }
  window.addEventListener('resize', onResize);
  window.__wraithGlobe = { onResize };
}

/* ---------------------------------------------------------------------
   STATIC REFERENCE TABS — render curated data.js content into the DOM
--------------------------------------------------------------------- */
function renderStaticSections(){
  const hc = document.getElementById('st-hotspot-count');
  if(hc) hc.textContent = GLOBE_HOTSPOTS.length;

  // OSINT X directory
  document.getElementById('osint-x-cards').innerHTML = OSINT_X_ACCOUNTS.map(a=>`
    <a class="lcard r" href="${a.url}" target="_blank">
      <div class="lcard-name">${a.handle}</div><div class="lcard-desc">${a.desc}</div>
    </a>`).join('');

  // Instagram directory
  document.getElementById('ig-cards').innerHTML = OSINT_IG_ACCOUNTS.map(a=>`
    <a class="lcard" href="${a.url}" target="_blank">
      <div class="lcard-name">${a.handle}</div><div class="lcard-desc">${a.desc}</div>
    </a>`).join('');

  // Declassified / leaks
  document.getElementById('declass-cards').innerHTML = DECLASS_LINKS.map(l=>`
    <a class="lcard" href="${l.url}" target="_blank">
      <div class="lcard-name">${l.name}</div><div class="lcard-desc">${l.desc}</div>
    </a>`).join('');

  // Defense industry links
  document.getElementById('defense-links').innerHTML = DEFENSE_LINKS.map(l=>`
    <a class="lcard" href="${l.url}" target="_blank"><div class="lcard-name">${l.name}</div></a>`).join('');

  // NDAA / NSS
  document.getElementById('nss-block').innerHTML = `
    <div class="trend-card"><div class="trend-title">${NSS_NDAA.nss.title}</div>
      <div class="trend-body">${NSS_NDAA.nss.body}</div>
      <div class="trend-tags">${NSS_NDAA.nss.tags.map(t=>`<span class="gtag">${t}</span>`).join('')}</div>
      <div style="margin-top:10px;"><a href="${NSS_NDAA.nss.link}" target="_blank" style="color:var(--c);font-size:10px;">PRIMARY SOURCE ↗</a></div>
    </div>
    <div class="trend-card"><div class="trend-title">${NSS_NDAA.ndaa.title}</div>
      <div class="trend-body">${NSS_NDAA.ndaa.body}</div>
      <div class="trend-tags">${NSS_NDAA.ndaa.tags.map(t=>`<span class="gtag">${t}</span>`).join('')}</div>
      <div style="margin-top:10px;"><a href="${NSS_NDAA.ndaa.link}" target="_blank" style="color:var(--c);font-size:10px;">PRIMARY SOURCE ↗</a></div>
    </div>
    <div class="trend-card"><div class="trend-title">THEATER-SPECIFIC IMPLICATIONS</div>
      ${NSS_NDAA.implications.map(i=>`<div style="margin-bottom:6px;font-size:11.5px;"><b style="color:var(--r);">${i.theater}:</b> <span style="color:var(--text2);">${i.text}</span></div>`).join('')}
    </div>
    <div class="ref-note"><b>NOTE:</b> NSS/NDAA content changes with each administration/fiscal year — this is a structural reference summary, not a live feed. Verify current text via the primary-source links above.</div>
  `;

  // Military rankings
  document.getElementById('mil-rankings-body').innerHTML = MILITARY_RANKINGS.map(m=>`
    <tr>
      <td><span class="rank-badge ${m.rank<=3?'top3':''}">${m.rank}</span></td>
      <td style="color:var(--white);font-weight:bold;">${m.country}</td>
      <td>${m.budget}</td>
      <td>${m.personnel}</td>
      <td style="color:var(--text2);">${m.note}</td>
    </tr>`).join('');
  document.getElementById('mil-source-note').textContent = MIL_RANKINGS_SOURCE_NOTE;

  // Geopolitics trend explainer cards (implications-focused, ties to globe hotspots)
  document.getElementById('trend-explainers').innerHTML = GLOBE_HOTSPOTS.map(h=>`
    <div class="trend-card" data-sev="${h.sev}">
      <span class="trend-label">${h.name}</span>
      <div class="trend-body">${h.brief}</div>
      <div class="trend-tags">${h.tags.map(t=>`<span class="gtag ${h.sev}">${t}</span>`).join('')}<span class="gtag" style="border-color:var(--bc2);color:var(--c);">CONFIDENCE: ${h.conf||'—'}</span></div>
      <div style="margin-top:8px;"><a href="${h.link}" target="_blank" style="color:var(--c);font-size:10px;">LIVE TRACKER ↗</a></div>
    </div>`).join('');
  buildFilterChips('trend-filter', active=>{
    document.querySelectorAll('#trend-explainers .trend-card').forEach(el=>{
      el.style.display = active.has(el.dataset.sev) ? '' : 'none';
    });
  });

  initCommandsTab();
  initAssetsTab();
  initHistoryTab();
  initScenarioSection();
}

/* ---------------------------------------------------------------------
   REGIONS TAB — US Combatant Commands detail, driven by a dropdown
--------------------------------------------------------------------- */
function confColor(conf){ return conf==='HIGH' ? 'var(--g)' : conf==='MEDIUM' ? 'var(--y)' : 'var(--r)'; }
function renderCommandDetail(name){
  const t = THEATERS.find(x=>x.name===name) || THEATERS[0];
  const related = (t.relatedHotspots||[]).map(hn=>GLOBE_HOTSPOTS.find(h=>h.name===hn)).filter(Boolean);
  document.getElementById('commands-detail').innerHTML = `
    <div class="trend-card">
      <div class="trend-title">${t.name} <span style="color:var(--mu);font-weight:normal;font-size:12px;">— ${t.full}</span></div>
      <div style="font-size:11px;color:var(--text2);margin:8px 0 2px;">AOR: ${t.aor}</div>
      <div style="font-size:11px;color:var(--mu);margin-bottom:10px;">HQ: ${t.hq}</div>
      <div class="trend-tags" style="margin-bottom:12px;">
        <span class="gtag" style="border-color:var(--c);color:var(--c);">STATUS: ${t.status}</span>
        <span class="gtag" style="border-color:${confColor(t.confidence)};color:${confColor(t.confidence)};">CONFIDENCE: ${t.confidence}</span>
      </div>
      <div class="brief-section-title">CURRENT SITUATION</div>
      <div class="trend-body">${t.situation}</div>
      <div class="brief-section-title">IMPLICATIONS</div>
      <div class="trend-body">${t.implications}</div>
      ${related.length ? `<div class="brief-section-title">RELATED HOTSPOTS</div>
        <div class="trend-tags">${related.map(h=>`<span class="gtag ${h.sev}">${h.name}</span>`).join('')}</div>` : ''}
      <div style="margin-top:12px;"><a href="${t.url}" target="_blank" style="color:var(--c);font-size:10px;">OFFICIAL SITE ↗</a></div>
    </div>
    <div class="ref-note">Structural reference, not a live intelligence feed — status/confidence reflect how well-established the situation is from open reporting, not a real-time assessment. Cross-check against the official site and current wire coverage.</div>
  `;
}
function initCommandsTab(){
  const sel = document.getElementById('commands-select');
  if(!sel) return;
  sel.innerHTML = THEATERS.map(t=>`<option value="${t.name}">${t.name} — ${t.full}</option>`).join('');
  sel.addEventListener('change', ()=> renderCommandDetail(sel.value));
  renderCommandDetail(THEATERS[0].name);
}

/* ---------------------------------------------------------------------
   ASSETS TAB — per-country military posture, driven by a dropdown
--------------------------------------------------------------------- */
function renderAssetDetail(country){
  const d = DEPLOYMENTS.find(x=>x.country===country) || DEPLOYMENTS[0];
  document.getElementById('assets-detail').innerHTML = `
    <div class="trend-card">
      <div class="trend-title">${d.country}</div>
      <div class="trend-tags" style="margin:8px 0 12px;">
        <span class="gtag" style="border-color:${confColor(d.confidence)};color:${confColor(d.confidence)};">CONFIDENCE: ${d.confidence}</span>
      </div>
      <div class="brief-section-title">BRANCHES / CAPABILITY NOTES</div>
      <ul style="margin:6px 0 12px 18px;padding:0;color:var(--text2);font-size:11.5px;line-height:1.8;">
        ${d.branches.map(b=>`<li>${b}</li>`).join('')}
      </ul>
      <div class="brief-section-title">NOTABLE CURRENT DEPLOYMENTS</div>
      <ul style="margin:6px 0 0 18px;padding:0;color:var(--text2);font-size:11.5px;line-height:1.8;">
        ${d.deployments.map(b=>`<li>${b}</li>`).join('')}
      </ul>
    </div>
    <div class="ref-note">${DEPLOYMENTS_SOURCE_NOTE}</div>
  `;
}
function initAssetsTab(){
  const sel = document.getElementById('assets-select');
  if(!sel) return;
  sel.innerHTML = DEPLOYMENTS.map(d=>`<option value="${d.country}">${d.country}</option>`).join('');
  sel.addEventListener('change', ()=> renderAssetDetail(sel.value));
  renderAssetDetail(DEPLOYMENTS[0].country);
}

/* ---------------------------------------------------------------------
   HISTORY TAB — historical parallels to current hotspots
--------------------------------------------------------------------- */
function initHistoryTab(){
  const el = document.getElementById('history-cards');
  if(!el) return;
  el.innerHTML = HISTORY_CONTEXT.map(h=>`
    <div class="trend-card">
      <span class="trend-label">${h.hotspot}</span>
      <div style="font-size:10.5px;color:var(--y);letter-spacing:.5px;margin-bottom:8px;">HISTORICAL PARALLEL: ${h.era}</div>
      <div class="brief-section-title">WHAT HAPPENED / THE PARALLEL</div>
      <div class="trend-body">${h.parallel}</div>
      <div class="brief-section-title">WHY IT'S RELEVANT NOW</div>
      <div class="trend-body">${h.lesson}</div>
    </div>`).join('');
}

/* ---------------------------------------------------------------------
   SCENARIO PLANNING — conditional if/then branches, not predictions
--------------------------------------------------------------------- */
function likelihoodColor(l){ return l==='TAIL RISK' ? 'var(--r)' : l==='POSSIBLE' ? 'var(--y)' : 'var(--c)'; }
function renderScenarioDetail(region){
  const list = SCENARIOS[region] || [];
  document.getElementById('scenario-detail').innerHTML = list.map(s=>`
    <div class="trend-card" style="margin-bottom:10px;">
      <div style="font-size:9px;font-family:'Orbitron',sans-serif;letter-spacing:1px;color:${likelihoodColor(s.likelihood)};margin-bottom:6px;">${s.likelihood}</div>
      <div style="font-size:12px;color:var(--white);font-weight:bold;margin-bottom:6px;">${s.condition}</div>
      <div class="trend-body" style="margin-bottom:8px;">${s.outcome}</div>
      <div style="font-size:10.5px;color:var(--mu);"><b style="color:var(--c);">WATCH FOR:</b> ${s.watch}</div>
    </div>`).join('') + `<div class="ref-note">${SCENARIOS_NOTE}</div>`;
}
function initScenarioSection(){
  const sel = document.getElementById('scenario-select');
  if(!sel) return;
  const regions = Object.keys(SCENARIOS);
  sel.innerHTML = regions.map(r=>`<option value="${r}">${r}</option>`).join('');
  sel.addEventListener('change', ()=> renderScenarioDetail(sel.value));
  renderScenarioDetail(regions[0]);
}

/* ---------------------------------------------------------------------
   INIT EVERYTHING (called after boot completes)
--------------------------------------------------------------------- */
function initEverything(){
  initBgCanvas();
  updateClocks(); setInterval(updateClocks, 1000);
  initTabs();
  initSubpanelSelects();
  renderStaticSections();

  // Geospatial (2x Leaflet + Three.js), Reddit, and the Ground News/tracker
  // iframes are lazy — they init the first time their tab/dropdown option is
  // actually opened (see activateSubpanel/onSubpanelShown), not at page load.
  // This keeps first paint light, especially on mobile.

  // live data — staggered on purpose: the free CORS proxies this relies on
  // (no-key by design) rate-limit hard under burst load, so spread the
  // initial requests out instead of firing them all at once.
  loadSingleRSS('feed-cmd', RSS_FEEDS.wire[0].url, RSS_FEEDS.wire[0].name, 'tc');
  loadCrypto();
  loadWeather();
  setTimeout(()=>loadFeedGroup('feed-wire', RSS_FEEDS.wire, 'tc'), 600);
  setTimeout(()=>loadWikiTrending(), 1200);
  setTimeout(()=>loadFeedGroup('feed-domestic', RSS_FEEDS.domestic, 'tc'), 3200);
  setTimeout(()=>loadFeedGroup('feed-defense', RSS_FEEDS.defense, 'tr'), 4600);
  setTimeout(()=>loadFeedGroup('feed-geo', RSS_FEEDS.geo, 'tc'), 6000);
  setTimeout(()=>loadStocks(), 1000);

  setTimeout(generateDailySynopsis, 6000); // give feeds a head start before first synopsis pass

  // periodic refresh — keeps the dashboard current without user action.
  // Intervals are spaced out (and skip entirely while the tab is in the
  // background) so it doesn't hammer the free proxies/APIs this runs on.
  const refreshIfVisible = fn => { if(!document.hidden) fn(); };
  setInterval(()=>refreshIfVisible(loadCrypto), 60000);              // 1 min
  setInterval(()=>refreshIfVisible(loadWeather), 900000);            // 15 min
  setInterval(()=>refreshIfVisible(loadStocks), 300000);             // 5 min
  setInterval(()=>refreshIfVisible(loadWikiTrending), 3600000);      // 60 min
  setInterval(()=>refreshIfVisible(()=>loadFeedGroup('feed-wire', RSS_FEEDS.wire, 'tc')), 600000);        // 10 min
  setInterval(()=>refreshIfVisible(()=>loadFeedGroup('feed-domestic', RSS_FEEDS.domestic, 'tc')), 600000); // 10 min
  setInterval(()=>refreshIfVisible(()=>loadFeedGroup('feed-geo', RSS_FEEDS.geo, 'tc')), 600000);          // 10 min
  setInterval(()=>refreshIfVisible(()=>loadFeedGroup('feed-defense', RSS_FEEDS.defense, 'tr')), 900000);  // 15 min
  setInterval(()=>refreshIfVisible(generateDailySynopsis), 900000);  // 15 min
}

document.addEventListener('DOMContentLoaded', boot);
