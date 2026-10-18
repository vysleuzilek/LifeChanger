/* Life Changer – v1 (data se ukládají v zařízení; Firebase přijde později) */
'use strict';

/* ---------- Nastavení rozvrhu (uprav si podle sebe) ---------- */
const ROZVRH = {
  skola: { 1: '8–16', 3: '8–17' },   // 0 = Po, 1 = Út, 3 = Čt
  smenaCas: '11–21'                  // výchozí čas směny (směny si přidáváš sám v kalendáři)
};

/* ---------- Pomocníci ---------- */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
const num = v => { const n = parseFloat(String(v ?? '').replace(/\s/g, '').replace(',', '.')); return isNaN(n) ? 0 : n; };
const kc = n => Math.round(n || 0).toLocaleString('cs-CZ');
const sgn = n => (n >= 0 ? '+ ' : '− ') + kc(Math.abs(n));
const dec2 = n => (Math.round(n * 100) / 100).toFixed(2).replace('.', ',');
const pad = n => String(n).padStart(2, '0');
const iso = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const fromIso = s => { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d); };
const today = () => iso(new Date());
const addDays = (s, n) => { const d = fromIso(s); d.setDate(d.getDate() + n); return iso(d); };
const dow = s => (fromIso(s).getDay() + 6) % 7;
const DOW = ['Po', 'Út', 'St', 'Čt', 'Pá', 'So', 'Ne'];
const DOWL = ['Pondělí', 'Úterý', 'Středa', 'Čtvrtek', 'Pátek', 'Sobota', 'Neděle'];
const MON = ['Leden', 'Únor', 'Březen', 'Duben', 'Květen', 'Červen', 'Červenec', 'Srpen', 'Září', 'Říjen', 'Listopad', 'Prosinec'];
const shortD = s => { const d = fromIso(s); return `${DOW[dow(s)]} ${d.getDate()}. ${d.getMonth() + 1}.`; };
const dayNum = s => fromIso(s).getDate();
const weekStart = s => addDays(s, -dow(s));
const daysBetween = (a, b) => Math.round((fromIso(b) - fromIso(a)) / 864e5);
function isoWeek(s) {
  const d = fromIso(s); const t = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const day = t.getUTCDay() || 7; t.setUTCDate(t.getUTCDate() + 4 - day);
  const y0 = new Date(Date.UTC(t.getUTCFullYear(), 0, 1));
  return Math.ceil(((t - y0) / 864e5 + 1) / 7);
}
const relDay = s => { const n = daysBetween(today(), s); return n === 0 ? 'dnes' : n === 1 ? 'zítra' : n === -1 ? 'včera' : n > 1 ? `za ${n} dní` : `před ${-n} dny`; };
const PAL = ['#2C2118', '#F6EEE2', '#6A3E22', '#B7C27F', '#8C735E', '#D9B48A', '#6E7F45', '#A9B0D0'];
const LPAL = ['#E39A72', '#B7C27F', '#F1E6D6', '#D9B48A', '#C9A98A', '#A9B0D0'];

const I = {
  home: '<path d="M3 10l9-7 9 7v10a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z"/>',
  money: '<rect x="3" y="6" width="18" height="14" rx="2"/><path d="M16 13h2"/>',
  shop: '<path d="M5 8h14l-1 12H6z"/><path d="M9 8a3 3 0 0 1 6 0"/>',
  school: '<path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z"/><path d="M4 19V5"/>',
  leaf: '<path d="M5 19c0-8 6-14 14-14 0 8-6 14-14 14z"/><path d="M5 19l7-7"/>',
  sprout: '<path d="M12 21V11"/><path d="M12 13c-4 0-6-3-6-7 4 0 6 3 6 7z"/><path d="M12 11c0-4 2-7 6-7 0 4-2 7-6 7z"/>',
  stem: '<path d="M12 21V12"/><path d="M8 21h8"/>',
  drop: '<path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z"/>',
  ads: '<path d="M3 11v2l13 5V6z"/><path d="M16 9a3 3 0 0 1 0 6"/><path d="M7 14v4"/>',
  box: '<path d="M3 7l9-4 9 4v10l-9 4-9-4z"/><path d="M3 7l9 4 9-4M12 11v10"/>',
  cam: '<path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  doc: '<path d="M6 3h9l3 3v15H6z"/><path d="M9 11h6M9 15h6"/>',
  minus: '<path d="M5 12h14"/>', plus: '<path d="M12 5v14M5 12h14"/>',
  person: '<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-6 8-6s8 2 8 6"/>',
  link: '<path d="M10 14a4 4 0 0 0 6 0l3-3a4 4 0 0 0-6-6l-1 1"/><path d="M14 10a4 4 0 0 0-6 0l-3 3a4 4 0 0 0 6 6l1-1"/>',
  text: '<path d="M4 6h16M4 12h16M4 18h10"/>',
  dots: '<circle cx="5" cy="12" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="19" cy="12" r="1.5"/>'
};
const svg = (n, s = 22, w = 1.8, c = 'currentColor') => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${I[n]}</svg>`;

/* ---------- Úložiště ---------- */
const KEY = 'lifechanger-v1';
function defaults() {
  return {
    v: 1,
    todos: {}, events: {}, gym: [], food: [],
    envs: [{ id: uid(), name: 'Volné', pct: 100 }],
    tx: [], debts: [],
    shops: [{ id: uid(), name: 'Tlapramen', price: '', cost: '', days: [], links: [
      { id: uid(), name: 'Meta reklamy', url: 'https://adsmanager.facebook.com' },
      { id: uid(), name: 'Shopify', url: 'https://admin.shopify.com' },
      { id: uid(), name: 'Podpora', url: 'mailto:podpora@tlapramen.cz' },
      { id: uid(), name: 'Web shopu', url: 'https://tlapramen.cz' }
    ] }],
    activeShop: null,
    school: {
      links: [{ id: uid(), name: 'Přehled', url: 'https://vysleuzilek.github.io/Studium/' }],
      share: [], deadlines: [],
      projects: [{ id: uid(), name: 'Momento', note: 'ICT návrh pro Pražírnu kávy MOMENTO · tým', progress: 0 }]
    },
    plants: [
      { id: uid(), name: 'Řízek A', sub: 'Monstera · z monstery z Lidlu', where: 'voda', roots: 4, leaves: 0, interval: 7, lastCare: null, entries: [] },
      { id: uid(), name: 'Řízek B', sub: 'Monstera · z monstery z Lidlu', where: 'voda', roots: 3, leaves: 1, interval: 7, lastCare: null, entries: [] },
      { id: uid(), name: 'Monstera z Lidlu', sub: 'Monstera · mateřská', where: 'substrát', roots: '', leaves: '', interval: 0, lastCare: null, entries: [] },
      { id: uid(), name: 'Stará monstera', sub: 'Monstera · z bývalého bytu', where: 'voda', roots: 0, leaves: 0, interval: 7, lastCare: null, entries: [] }
    ]
  };
}
function load() {
  try { const s = JSON.parse(localStorage.getItem(KEY)); if (s && s.v) return Object.assign(defaults(), s); } catch (e) { }
  return defaults();
}
let S = load();
if (!S.activeShop) S.activeShop = S.shops[0]?.id || null;
function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { toast('Úložiště je plné'); } }

/* Soubory a fotky (IndexedDB) */
const IDB = (() => {
  let p;
  const db = () => p || (p = new Promise((res, rej) => { const r = indexedDB.open('lifechanger', 1); r.onupgradeneeded = () => r.result.createObjectStore('files'); r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error); }));
  const tx = (mode, fn) => db().then(d => new Promise((res, rej) => { const t = d.transaction('files', mode); const r = fn(t.objectStore('files')); t.oncomplete = () => res(r && r.result); t.onerror = () => rej(t.error); }));
  return { put: (k, v) => tx('readwrite', s => s.put(v, k)), get: k => tx('readonly', s => s.get(k)), del: k => tx('readwrite', s => s.delete(k)) };
})();
const urlCache = new Map();
async function fileUrl(id) {
  if (urlCache.has(id)) return urlCache.get(id);
  const b = await IDB.get(id); if (!b) return '';
  const u = URL.createObjectURL(b); urlCache.set(id, u); return u;
}
function compressImage(file, max = 1280, q = 0.72) {
  return new Promise((res, rej) => {
    const url = URL.createObjectURL(file); const img = new Image();
    img.onload = () => {
      const s = Math.min(1, max / Math.max(img.width, img.height));
      const c = document.createElement('canvas'); c.width = Math.round(img.width * s); c.height = Math.round(img.height * s);
      c.getContext('2d').drawImage(img, 0, 0, c.width, c.height); URL.revokeObjectURL(url);
      c.toBlob(b => b ? res(b) : rej(new Error('img')), 'image/jpeg', q);
    };
    img.onerror = () => { URL.revokeObjectURL(url); rej(new Error('img')); };
    img.src = url;
  });
}
async function storeFile(file) {
  const id = 'f_' + uid();
  const blob = file.type.startsWith('image/') ? await compressImage(file) : file;
  await IDB.put(id, blob); return id;
}

/* ---------- UI stav (neukládá se) ---------- */
const U = {
  sel: today(), calMonth: today().slice(0, 7),
  moneyTab: 0, shopTab: 0, schoolTab: 0, period: 'week', periodMenu: false,
  editLinks: false, editSchoolLinks: false,
  device: localStorage.getItem('lc-device') || (/iPhone|iPad|Android/i.test(navigator.userAgent) ? 'Mobil' : 'Doma PC'),
  draft: null, day: null, pdraft: null, envDraft: null, sheetFn: null, sheetArg: null
};

function toast(t) { const el = $('#toast'); el.textContent = t; el.classList.add('show'); clearTimeout(toast.t); toast.t = setTimeout(() => el.classList.remove('show'), 2200); }

/* ---------- Výpočty ---------- */
function autoEvents(s) {
  const w = dow(s), out = [];
  if (ROZVRH.skola[w]) out.push({ kind: 'school', time: ROZVRH.skola[w], text: 'Škola' });
  return out;
}
function dayEvents(s) {
  const a = autoEvents(s);
  (S.events[s] || []).forEach(e => a.push({ kind: e.kind || 'mine', time: e.time || '', text: e.text, id: e.id }));
  S.school.deadlines.filter(d => d.date === s).forEach(d => a.push({ kind: 'deadline', time: 'termín', text: d.title }));
  return a;
}
const counts = t => !(t.type === 'invoice' && !t.paid);
function envBalance(id) { return S.tx.filter(counts).reduce((a, t) => a + (t.alloc?.[id] || 0), 0); }
function totalMoney() { return S.tx.filter(counts).reduce((a, t) => a + Object.values(t.alloc || {}).reduce((x, y) => x + y, 0), 0); }
function signed(t) { return (t.type === 'in' || t.type === 'shift') ? t.amount : -t.amount; }
function nextSchool() {
  for (let i = 0; i < 14; i++) { const s = addDays(today(), i); const w = dow(s); if (ROZVRH.skola[w]) return `${i === 0 ? 'dnes' : i === 1 ? 'zítra' : DOW[w]} ${ROZVRH.skola[w]}`; }
  return '—';
}
function plantDue(p) { return p.interval > 0 && (!p.lastCare || daysBetween(p.lastCare, today()) >= p.interval); }
const careWord = p => p.where === 'voda' ? 'vyměnit vodu' : 'zalít';
function foodStreak() {
  const set = new Set(S.food); let d = set.has(today()) ? today() : addDays(today(), -1), n = 0;
  while (set.has(d)) { n++; d = addDays(d, -1); }
  return n;
}
function latestPhoto(p) { const e = (p.entries || []).find(x => x.photo); return e ? e.photo : null; }

/* ---------- Navigace ---------- */
const NAV = [['domu', 'Domů', 'home'], ['penize', 'Peníze', 'money'], ['shopy', 'Shopy', 'shop'], ['skola', 'Škola', 'school'], ['rostliny', 'Rostliny', 'leaf']];
function route() { return (location.hash.replace(/^#\/?/, '') || 'domu').split('/'); }
function go(h) { location.hash = '#/' + h; }
window.addEventListener('hashchange', () => { U.periodMenu = false; if (route()[1] !== 'obalky') U.envDraft = null; render(); window.scrollTo(0, 0); });

function render() {
  const [r, a] = route();
  const views = { domu: vHome, kalendar: vCalendar, penize: a === 'obalky' ? vEnvelopes : vMoney, shopy: vShops, skola: vSchool, rostliny: vPlants, rostlina: () => vPlant(a) };
  const fn = views[r] || vHome;
  $('#app').innerHTML = fn();
  const top = { kalendar: 'domu', rostlina: 'rostliny' }[r] || r;
  $('.nav-in').innerHTML = NAV.map(([k, l, ic]) => `<button class="${top === k ? 'on' : ''}" data-act="nav" data-to="${k}" aria-label="${l}">${svg(ic)}${l}</button>`).join('');
  $('#fab').hidden = !((r === 'penize' && a !== 'obalky') || r === 'skola');
  hydrate($('#app'));
  LIVE.dayPrev();
}
function hydrate(root) {
  $$('img[data-img]', root).forEach(async el => { const u = await fileUrl(el.dataset.img); if (u) el.src = u; else el.remove(); });
}

/* ---------- Sheet (spodní okno) ---------- */
function openSheet(fn, arg) { U.sheetFn = fn; U.sheetArg = arg; drawSheet(); }
function drawSheet() {
  if (!U.sheetFn) { $('#sheet').innerHTML = ''; return; }
  const sc = $('.sheet')?.scrollTop || 0;
  $('#sheet').innerHTML = `<div class="sheet-bg" data-act="bg"><div class="sheet" role="dialog" aria-modal="true"><div class="grab"></div>${SHEETS[U.sheetFn](U.sheetArg)}</div></div>`;
  const sh = $('.sheet'); if (sh) sh.scrollTop = sc;
  hydrate($('#sheet'));
  if (U.sheetFn === 'tx') txPreview();
}
function closeSheet() { U.sheetFn = null; drawSheet(); }

/* ======================================================
   DOMŮ
   ====================================================== */
function vHome() {
  const t = today(), ws = weekStart(t);
  const week = [...Array(7)].map((_, i) => addDays(ws, i)).map(s => {
    const ev = dayEvents(s); const k = ev.find(e => e.kind === 'work') ? 'work' : ev.find(e => e.kind === 'school') ? 'school' : 'free';
    const mine = (S.events[s] || []).length || S.school.deadlines.some(d => d.date === s);
    return `<div class="wd ${s === t ? 'today' : ''}"><span>${DOW[dow(s)]}</span>${s === t ? '<span style="font-size:10px">dnes</span>' : `<span class="dot ${k}"></span>`}</div>`;
  }).join('');
  const due = S.plants.filter(plantDue).length;
  const tiles = S.plants.map(p => { const ph = latestPhoto(p); const w = p.where === 'voda' && !p.roots && !p.leaves;
    return `<a class="ptile ${w ? 'wait' : ''}" href="#/rostlina/${p.id}">${ph ? `<img data-img="${ph}" alt="">` : svg(w ? 'stem' : 'sprout', 34, 1.6, w ? '#8A6F5A' : '#4F5A2A')}<span class="sm b">${esc(p.name)}</span><span class="xs ${w ? 'mutd' : 'ok'}">${esc(plantShort(p))}</span></a>`; }).join('');
  const todos = S.todos[t] || [];
  const tdHtml = todos.length ? todos.map(x => `<div class="todo"><button class="tbtn" data-act="todo" data-id="${x.id}"><span class="cbox ${x.done ? 'on' : ''}">${x.done ? '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#2C2118" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12l5 5 9-10"/></svg>' : ''}</span><span class="${x.done ? 'done-t' : ''}">${esc(x.text)}</span></button><button class="xbtn" data-act="todoDel" data-id="${x.id}" aria-label="Smazat úkol">×</button></div>`).join('') : '<div class="empty">Na dnešek nic. Přidej si úkol.</div>';
  const done = todos.filter(x => x.done).length;
  const gymW = S.gym.filter(d => weekStart(d) === ws).length;
  const gymToday = S.gym.includes(t), foodToday = S.food.includes(t);
  const gd = [1, 2, 3].map(i => `<span style="flex:1;height:8px;border-radius:4px;background:${gymW >= i ? '#4F5A2A' : '#E3D5C3'}"></span>`).join('');
  return `
  <div class="row"><h1 class="h1">Life <i>Changer</i></h1><div class="row gap8"><span class="sm mut">${shortD(t)}</span><button class="xbtn" data-act="settings" aria-label="Nastavení">${svg('dots')}</button></div></div>
  <a href="#/kalendar" class="col gap6" style="text-decoration:none" aria-label="Otevřít kalendář"><div class="week">${week}</div><div class="xs mut" style="text-align:right">otevřít kalendář ›</div></a>
  <div class="card cream" style="padding:16px 16px">
    <div class="row base"><div class="ttl" style="font-size:26px">Moje rostliny</div><a href="#/rostliny" class="sm b" style="text-decoration:none">${due ? `péče: ${due}` : 'vše ok'} ›</a></div>
    <div class="hs">${tiles}<a class="ptile add" href="#/rostliny" data-act="addPlant">${svg('plus', 26)}<span class="sm b">Přidat rostlinu</span></a></div>
  </div>
  <div class="card">
    <div class="row base"><div class="ttl" style="font-size:24px">Dnes</div><span class="sm mut">${done} / ${todos.length} hotovo</span></div>
    ${tdHtml}
    <div class="addrow"><label for="newTodo" class="sr">Nový úkol</label><input id="newTodo" placeholder="Přidat úkol…" enterkeyhint="done" data-enter="addTodo"><button data-act="addTodo">Přidat</button></div>
  </div>
  <div class="row gap12" style="align-items:stretch">
    <a href="#/penize" class="card terra" style="flex:1;gap:2px;text-decoration:none"><span class="sm b">Peníze</span><span class="mid" style="font-size:30px">${kc(totalMoney())} Kč</span><span class="xs b" style="padding-top:8px">aktuální stav</span><span class="xs" style="color:#5A3A26">napočítáno ze sekce Peníze</span></a>
    <div class="card cream" style="flex:1;gap:4px">
      <span class="sm b mutd">Gym tento týden</span><span class="mid" style="font-size:30px">${gymW} / 3</span>
      <div style="display:flex;gap:6px;padding-top:4px">${gd}</div>
      <div class="chips" style="padding-top:6px"><button class="chip ${gymToday ? 'on' : ''}" style="min-height:32px;padding:0 10px;font-size:12px" data-act="gym">${gymToday ? '✓ gym' : '+ gym'}</button><button class="chip ${foodToday ? 'on' : ''}" style="min-height:32px;padding:0 10px;font-size:12px" data-act="food">${foodToday ? '✓ jídlo' : '+ jídlo'}</button></div>
      <span class="xs mutd">jídelníček ${foodStreak()}. den</span>
    </div>
  </div>`;
}
function plantShort(p) { if (p.where === 'voda') return p.roots ? `${p.roots} kořeny${p.leaves ? ' + list' : ''}` : 'čeká'; return p.where || ''; }

/* ======================================================
   KALENDÁŘ
   ====================================================== */
function vCalendar() {
  const [y, m] = U.calMonth.split('-').map(Number);
  const first = `${y}-${pad(m)}-01`, lead = dow(first), dim = new Date(y, m, 0).getDate();
  let cells = '';
  for (let i = 0; i < lead; i++) cells += '<span class="cday empty"></span>';
  for (let d = 1; d <= dim; d++) {
    const s = `${y}-${pad(m)}-${pad(d)}`, ev = dayEvents(s), sel = s === U.sel;
    const has = k => ev.some(e => e.kind === k);
    const dots = [['work', '#E39A72'], ['school', '#B7C27F'], ['mine', sel ? '#2C2118' : '#F1E6D6'], ['deadline', '#D9B48A']].filter(([k]) => has(k)).map(([, c]) => `<span style="background:${c}"></span>`).join('');
    cells += `<button class="cday ${sel ? 'sel' : ''} ${s === today() ? 'today' : ''}" data-act="pickDay" data-d="${s}" aria-label="${d}. ${m}."><span>${d}</span><span class="dots">${dots}</span></button>`;
  }
  const ev = dayEvents(U.sel);
  const col = { work: '#E39A72', school: '#7E8A45', mine: '#3B2A1E', deadline: '#D9B48A' };
  const list = ev.length ? ev.map(e => `<div class="ev"><span class="bar4" style="background:${col[e.kind]}"></span><span class="sm mutd" style="width:64px;flex-shrink:0">${esc(e.time || 'moje')}</span><span class="grow">${esc(e.text)}</span>${e.id ? `<button class="xbtn" data-act="evDel" data-id="${e.id}" aria-label="Smazat">×</button>` : ''}</div>`).join('') : '<div class="note">Volno. Nic tu zatím není.</div>';
  return `
  <div class="row"><a class="back" href="#/domu">‹ Domů</a><span class="sm mut">${(() => { const n = Object.entries(S.events).filter(([d, l]) => d.startsWith(U.calMonth) && l.some(e => e.kind === 'work')).length; return n ? `${n} směn v měsíci` : ''; })()}</span></div>
  <div class="row"><h1 class="h1">${MON[m - 1]} <i>${y}</i></h1><div class="row gap6"><button class="hbtn" data-act="mon" data-n="-1" aria-label="Předchozí měsíc">‹</button><button class="hbtn" data-act="mon" data-n="1" aria-label="Další měsíc">›</button></div></div>
  <div class="card" style="padding:12px">
    <div class="calgrid xs mut" style="text-align:center">${DOW.map(d => `<span>${d}</span>`).join('')}</div>
    <div class="calgrid">${cells}</div>
    <div class="chips xs mut" style="gap:14px"><span style="color:#E39A72">● směna</span><span style="color:#B7C27F">● škola</span><span style="color:#F1E6D6">● moje</span><span style="color:#D9B48A">● termín</span></div>
  </div>
  <div class="card cream">
    <div class="ttl" style="font-size:24px">${DOWL[dow(U.sel)]} ${dayNum(U.sel)}. ${fromIso(U.sel).getMonth() + 1}.</div>
    ${list}
    <button class="btn ${ev.some(e => e.kind === 'work') ? 'light' : 'moss'}" data-act="shiftToggle">${ev.some(e => e.kind === 'work') ? 'Odebrat směnu' : `+ Směna ${ROZVRH.smenaCas}`}</button>
    <div class="row gap8"><label for="evTime" class="sr">Čas</label><input id="evTime" class="inp" style="width:90px" placeholder="čas" inputmode="text"><label for="evText" class="sr">Co</label><input id="evText" class="inp" placeholder="Zapsat věc…" data-enter="addEv"></div>
    <button class="btn" data-act="addEv">Přidat</button>
  </div>`;
}

/* ======================================================
   PENÍZE
   ====================================================== */
const TXT = { in: 'Příjem', out: 'Výdaj', shift: 'Směna', invoice: 'Faktura' };
function vMoney() {
  const total = totalMoney(), ws = weekStart(today());
  const weekNet = S.tx.filter(counts).filter(t => t.date >= ws).reduce((a, t) => a + signed(t), 0);
  const bal = S.envs.map((e, i) => ({ ...e, b: envBalance(e.id), c: PAL[i % PAL.length] }));
  const pos = bal.reduce((a, e) => a + Math.max(0, e.b), 0);
  const stack = pos > 0 ? bal.filter(e => e.b > 0).map(e => `<i style="flex:${e.b};background:${e.c}"></i>`).join('') : '<i style="flex:1;background:rgba(0,0,0,.08)"></i>';
  const tabs = ['Vše', 'Směny', 'Faktury', 'Výdaje', 'Dluhy'];
  const t = U.moneyTab; let rows = '', title = '', sum = '';
  const sorted = [...S.tx].sort((a, b) => b.date.localeCompare(a.date) || (b.ts || 0) - (a.ts || 0));
  const mStart = today().slice(0, 7);
  if (t === 4) {
    title = 'Dluhy'; const tot = S.debts.reduce((a, d) => a + num(d.amount), 0); sum = tot ? `dluží mi ${kc(tot)} Kč` : '';
    rows = S.debts.map(d => `<button class="lrow" data-act="debt" data-id="${d.id}"><span class="badge" style="background:#EADBC8">${svg('person', 18, 2, '#6E5340')}</span><span class="col grow"><span class="md b">${esc(d.who)}</span><span class="sm mutd">${esc(d.note || 'dluží mi')}</span></span><span class="md b">${kc(d.amount)}</span></button>`).join('') + `<button class="lrow" data-act="debtNew"><span class="badge" style="background:#EFE6DA">+</span><span class="md b">Přidat dluh</span></button>`;
  } else {
    const f = [null, x => x.type === 'shift', x => x.type === 'invoice', x => x.type === 'out' || x.type === 'invoice'][t];
    const list = f ? sorted.filter(f) : sorted.slice(0, 40);
    title = ['Poslední pohyby', 'Směny', 'Faktury', 'Výdaje'][t];
    if (t === 1) { const m = list.filter(x => x.date.startsWith(mStart)); sum = `${MON[+mStart.slice(5) - 1].toLowerCase()}: ${kc(m.reduce((a, x) => a + x.amount, 0))} Kč`; }
    if (t === 2) { const w = list.filter(x => !x.paid).length; sum = w ? `${w} čeká` : 'vše zaplaceno'; }
    if (t === 3) { const m = list.filter(x => x.date.startsWith(mStart) && counts(x)); sum = `− ${kc(m.reduce((a, x) => a + x.amount, 0))} Kč`; }
    rows = list.length ? list.map(txRow).join('') : '<div class="empty">Zatím nic. Přidej první záznam tlačítkem +</div>';
  }
  return `
  <div class="row"><h1 class="h1">Peníze</h1><span class="md b" style="color:${weekNet >= 0 ? 'var(--moss)' : 'var(--terra)'}">${sgn(weekNet)} tento týden</span></div>
  <div class="card terra hero">
    <div class="row"><span class="md b">Mám teď</span><a href="#/penize/obalky" class="sm b" style="text-decoration:underline;text-underline-offset:3px">nastavit obálky ›</a></div>
    <div class="big">${kc(total)} Kč</div>
    <div class="stack">${stack}</div>
    <div class="stats3">${bal.map(e => `<div><span><span style="display:inline-block;width:8px;height:8px;border-radius:4px;background:${e.c};box-shadow:inset 0 0 0 1px rgba(0,0,0,.3)"></span> ${esc(e.name)}</span><b>${kc(e.b)}</b></div>`).join('')}</div>
  </div>
  <div class="tabs" role="tablist">${tabs.map((x, i) => `<button role="tab" class="${i === t ? 'on' : ''}" style="font-size:12px" data-act="moneyTab" data-i="${i}">${x}</button>`).join('')}</div>
  <div class="card cream" style="gap:6px">
    <div class="row base"><div class="ttl">${title}</div><span class="sm b mutd">${esc(sum)}</span></div>
    <div class="col">${rows}</div>
  </div>`;
}
function txRow(x) {
  const env = x.type === 'invoice' || x.type === 'out' ? S.envs.find(e => x.alloc && e.id === Object.keys(x.alloc)[0])?.name : null;
  const ic = { in: ['plus', '#E4E7CF', '#4F5A2A'], shift: ['clock', '#E4E7CF', '#4F5A2A'], out: ['minus', '#F2D9C8', '#8E3F22'], invoice: ['doc', '#F2D9C8', '#8E3F22'] }[x.type];
  const t = x.type === 'shift' ? `Směna${x.hours ? ' · ' + x.hours + ' h' : ''}` : x.name;
  const sub = [shortD(x.date), x.type === 'shift' && x.tips ? `dýško ${kc(x.tips)}` : '', env ? `z ${env}` : ''].filter(Boolean).join(' · ');
  const pill = x.type === 'invoice' ? `<span class="pill ${x.paid ? 'ok' : 'bad'}">${x.paid ? 'zaplaceno' : 'čeká'}</span>` : '';
  return `<button class="lrow" data-act="txOpen" data-id="${x.id}"><span class="badge" style="background:${ic[1]}">${svg(ic[0], 18, 2, ic[2])}</span><span class="col grow"><span class="md b ell">${esc(t)}</span><span class="sm mutd ell">${esc(sub)}</span></span><span class="col" style="align-items:flex-end;gap:3px"><span class="md b ${signed(x) >= 0 ? 'ok' : 'bad'}">${sgn(signed(x))}</span>${pill}</span></button>`;
}

function vEnvelopes() {
  if (!U.envDraft) U.envDraft = S.envs.map(e => ({ ...e }));
  const list = U.envDraft, total = list.reduce((a, e) => a + num(e.pct), 0), ok = total === 100;
  return `
  <div><a class="back" href="#/penize" data-act="envBack">‹ Peníze</a></div>
  <h1 class="h1">Moje <i>obálky</i></h1>
  <div class="sm mut">Pojmenuj si je, jak chceš, a nastav, kolik % z každého příjmu do nich jde.</div>
  <div class="stack" style="height:14px">${list.map((e, i) => `<i style="flex:${num(e.pct)} 0 0;background:${PAL[i % PAL.length]}"></i>`).join('')}</div>
  <div class="sm b" style="color:${ok ? 'var(--moss)' : 'var(--terra)'}">${list.length ? (ok ? 'Celkem 100 % ✓' : `Celkem ${total} % · musí to dát 100 %`) : 'Zatím nemáš žádnou obálku'}</div>
  <div class="card cream">
    ${list.map((e, i) => `<div class="env-row"><div class="row gap8"><span class="dot" style="width:12px;height:12px;border-radius:6px;background:${PAL[i % PAL.length]};box-shadow:inset 0 0 0 1px #CDB9A3"></span><label class="sr" for="env${i}">Název obálky</label><input id="env${i}" value="${esc(e.name)}" data-bind="envDraft.${i}.name"><button class="rbtn" data-act="envPct" data-i="${i}" data-n="-5" aria-label="Ubrat">−</button><span class="serif" style="width:46px;text-align:center;font-size:22px">${num(e.pct)} %</span><button class="rbtn d" data-act="envPct" data-i="${i}" data-n="5" aria-label="Přidat">+</button></div><div class="row xs mutd" style="padding-left:22px"><span>v obálce: ${kc(envBalance(e.id))} Kč</span><button class="xbtn" style="font-size:12px;color:var(--red);font-weight:600" data-act="envDel" data-i="${i}">smazat</button></div></div>`).join('')}
    <div class="row gap8"><label for="envNew" class="sr">Nová obálka</label><input id="envNew" class="inp" placeholder="Nová obálka (třeba Investice)" data-enter="envAdd"><button class="btn moss" style="width:auto" data-act="envAdd">Přidat</button></div>
    <div class="note">Tyhle obálky uvidíš u každého příjmu („kam to dát“) i výdaje („odkud beru“).</div>
    <button class="btn" data-act="envSave">Uložit</button>
  </div>`;
}

/* ======================================================
   SHOPY
   ====================================================== */
const PERIODS = [['today', 'Dnes'], ['yday', 'Včera'], ['week', 'Tento týden'], ['7d', 'Posledních 7 dní'], ['month', 'Tento měsíc'], ['all', 'Vše']];
function inPeriod(s) {
  const t = today();
  switch (U.period) {
    case 'today': return s === t; case 'yday': return s === addDays(t, -1);
    case 'week': return s >= weekStart(t) && s <= t; case '7d': return s > addDays(t, -7) && s <= t;
    case 'month': return s.slice(0, 7) === t.slice(0, 7); default: return true;
  }
}
function shop() { return S.shops.find(x => x.id === S.activeShop) || S.shops[0]; }
function vShops() {
  const sh = shop();
  const chips = S.shops.map(x => `<button class="chip ${x.id === sh?.id ? 'on' : ''}" data-act="shopPick" data-id="${x.id}">${esc(x.name)}</button>`).join('') + '<button class="chip add" data-act="shopNew">+ shop</button>';
  const pl = PERIODS.find(p => p[0] === U.period)[1];
  const menu = U.periodMenu ? `<div class="menu">${PERIODS.map(([k, l]) => `<button class="${k === U.period ? 'on' : ''}" data-act="period" data-k="${k}">${l}</button>`).join('')}</div>` : '';
  const head = `<div class="row rel" style="z-index:5"><h1 class="h1">Shopy</h1><button class="hbtn" data-act="periodMenu" aria-label="Vybrat období">${pl} ▾</button>${menu}</div><div class="chips">${chips}</div>`;
  if (!sh) return head + '<div class="empty">Přidej si první shop.</div>';
  const days = sh.days.filter(d => inPeriod(d.date)).sort((a, b) => a.date.localeCompare(b.date));
  const sum = k => days.reduce((a, d) => a + num(d[k]), 0);
  const ads = sum('ads'), rev = sum('rev'), ful = sum('ful'), profit = rev - ads - ful;
  const roas = ads > 0 ? rev / ads : 0;
  const price = num(sh.price), cost = num(sh.cost), be = price > cost && cost > 0 ? price / (price - cost) : 0;
  const scale = Math.max(4, be * 1.6);
  const ordersEntered = days.filter(d => d.orders !== '' && d.orders != null);
  const orders = ordersEntered.length ? sum('orders') : (price ? Math.round(rev / price) : null);
  const avg = k => { const v = days.filter(d => d[k] !== '' && d[k] != null && num(d[k]) > 0); return v.length ? v.reduce((a, d) => a + num(d[k]), 0) / v.length : null; };
  const cpc = avg('cpc'), ctr = avg('ctr');
  const good = be ? roas >= be : profit >= 0;
  const t = U.shopTab;
  let body = '';
  if (t === 0) {
    const tiles = sh.links.map((l, i) => linkTile(l, i, 'shopLinkDel', U.editLinks)).join('');
    body = `<div class="card cream"><div class="row base"><div class="ttl">Rychlé odkazy</div><button class="xbtn sm b mutd" style="font-size:12px" data-act="editLinks">${U.editLinks ? 'hotovo' : 'upravit'}</button></div><div class="tiles" style="grid-template-columns:repeat(3,minmax(0,1fr))">${tiles}<button class="tile add" data-act="linkNew" data-to="shop"><span style="font-size:22px">+</span>Přidat</button></div></div>`;
  } else {
    if (!U.day) U.day = { date: addDays(today(), -1), ads: '', rev: '', ful: '', orders: '', cpc: '', ctr: '', more: false, other: false };
    const D = U.day, y = addDays(today(), -1);
    const dchips = [[y, `Včera ${dayNum(y)}. ${fromIso(y).getMonth() + 1}.`], [today(), 'Dnes']].map(([d, l]) => `<button class="chip ${D.date === d && !D.other ? 'on' : ''}" style="min-height:34px;font-size:12px" data-act="dayDate" data-d="${d}">${l}</button>`).join('') + `<button class="chip ${D.other ? 'on' : ''}" style="min-height:34px;font-size:12px" data-act="dayOther">Jiný…</button>`;
    const fbox = (k, l, ic, c) => `<div class="fbox"><span class="ico" style="background:${c}">${svg(ic, 18, 2)}</span><label for="d_${k}">${l}</label><input id="d_${k}" inputmode="decimal" placeholder="0" value="${esc(D[k])}" data-bind="day.${k}" data-live="dayPrev"></div>`;
    const rowsT = days.map(d => { const p = num(d.rev) - num(d.ads) - num(d.ful); return `<button class="trow" data-act="dayOpen" data-d="${d.date}"><span class="b">${DOW[dow(d.date)]} ${dayNum(d.date)}.</span><span>${kc(d.ads)}</span><span>${kc(d.rev)}</span><span>${kc(d.ful)}</span><span class="b ${p >= 0 ? 'ok' : 'bad'}">${sgn(p)}</span></button>`; }).join('');
    body = `<div class="card" style="padding:12px">
      <div class="chips"><span class="xs b mut">Za den:</span>${dchips}</div>
      ${D.other ? `<label for="dayDateInp" class="sr">Datum</label><input id="dayDateInp" type="date" class="inp" value="${D.date}" data-bind="day.date" style="background:var(--cream)">` : ''}
      <div class="fields3">${fbox('ads', 'Reklamy', 'ads', '#E39A72')}${fbox('rev', 'Tržby', 'shop', '#B7C27F')}${fbox('ful', 'Fulfill', 'box', '#D9B48A')}</div>
      ${D.more ? `<div class="fields3">${['orders|Objednávky', 'cpc|CPC (Kč)', 'ctr|CTR (%)'].map(x => { const [k, l] = x.split('|'); return `<div class="fbox" style="padding:8px"><label for="d_${k}">${l}</label><input id="d_${k}" inputmode="decimal" placeholder="—" value="${esc(D[k])}" data-bind="day.${k}"></div>`; }).join('')}</div>` : `<button class="xbtn xs b mut" style="font-size:12px;text-align:left" data-act="dayMore">+ další čísla (objednávky, CPC, CTR)</button>`}
      <div class="row gap8"><div id="dayPrev" class="col" style="flex-grow:1;border-radius:14px;padding:6px 12px;color:var(--dark)"></div><button class="btn light" style="width:auto;min-height:52px" data-act="daySave">Uložit den</button></div>
    </div>
    <div class="card cream" style="padding:10px 14px;gap:0"><div class="trow head"><span>Den</span><span>Reklamy</span><span>Tržby</span><span>Fulfill</span><span>Zisk</span></div>${rowsT || '<div class="empty">V tomhle období nic. Zapiš první den.</div>'}</div>`;
  }
  return `${head}
  <div class="card hero" style="background:${profit >= 0 ? 'var(--moss)' : 'var(--terra)'};color:var(--dark)">
    <span class="md b">Zisk · ${pl.toLowerCase()}</span><div class="big">${sgn(profit)} Kč</div>
    <div class="stats3"><div><span>Tržby</span><b>${kc(rev)}</b></div><div><span>Reklamy</span><b>− ${kc(ads)}</b></div><div><span>Fulfill</span><b>− ${kc(ful)}</b></div></div>
  </div>
  <div class="card" style="gap:8px">
    <div class="row base"><div class="ttl">ROAS</div><div class="md"><b style="color:${good ? 'var(--moss)' : 'var(--terra)'}">${ads ? dec2(roas) : '—'}</b> <span class="mut">/ breakeven ${be ? dec2(be) : '<button class="xbtn" style="font-size:13px;color:var(--moss);font-weight:600;min-height:0" data-act="shopEdit">nastavit</button>'}</span></div></div>
    <div class="bar"><i style="width:${Math.min(100, roas / scale * 100)}%;background:${good ? 'var(--moss)' : 'var(--terra)'}"></i>${be ? `<span class="mark" style="left:${be / scale * 100}%"></span>` : ''}</div>
    <div class="stats3 mut"><div><span>Nákupy</span><b style="color:var(--ink)">${orders ?? '—'}</b></div><div><span>CPC</span><b style="color:var(--ink)">${cpc != null ? dec2(cpc) + ' Kč' : '—'}</b></div><div><span>CTR</span><b style="color:var(--ink)">${ctr != null ? dec2(ctr) + ' %' : '—'}</b></div></div>
    <button class="xbtn xs mut" style="font-size:11px;text-align:right;min-height:20px" data-act="shopEdit">upravit shop (cena, náklad) ›</button>
  </div>
  <div class="tabs" role="tablist">${['Rychlé odkazy', 'Denní výsledky'].map((x, i) => `<button role="tab" class="${i === t ? 'on' : ''}" data-act="shopTab" data-i="${i}">${x}</button>`).join('')}</div>
  ${body}`;
}
function linkTile(l, i, delAct, edit) {
  const c = LPAL[i % LPAL.length]; const ini = esc((l.name || '?').trim()[0]?.toUpperCase() || '?');
  const inner = `<span class="ico" style="background:${c}">${ini}</span>${esc(l.name)}`;
  return edit ? `<div class="tile">${inner}<button class="x" data-act="${delAct}" data-id="${l.id}" aria-label="Smazat ${esc(l.name)}">×</button></div>`
    : `<a class="tile" href="${esc(l.url)}" target="_blank" rel="noopener">${inner}</a>`;
}
const LIVE = {
  dayPrev() {
    const el = $('#dayPrev'); if (!el || !U.day) return;
    const p = num(U.day.rev) - num(U.day.ads) - num(U.day.ful);
    el.style.background = p >= 0 ? 'var(--moss)' : 'var(--terra)';
    el.innerHTML = `<span class="xs b">Zisk za ${U.day.date === today() ? 'dnes' : U.day.date === addDays(today(), -1) ? 'včera' : shortD(U.day.date)}</span><span class="serif" style="font-size:24px">${sgn(p)} Kč</span>`;
  },
  txPrev() { txPreview(); }
};

/* ======================================================
   ŠKOLA
   ====================================================== */
function vSchool() {
  const sc = S.school, t = today();
  const next = sc.deadlines.filter(d => d.date >= t).sort((a, b) => a.date.localeCompare(b.date))[0];
  const tiles = sc.links.map((l, i) => linkTile(l, i, 'schoolLinkDel', U.editSchoolLinks)).join('');
  const tab = U.schoolTab; let rows = '';
  if (tab === 0) {
    rows = sc.share.length ? sc.share.map(x => {
      const ic = { file: ['doc', '#F2D9C8', '#8E3F22', 'stáhnout'], link: ['link', '#E4E7CF', '#4F5A2A', 'otevřít'], text: ['text', '#EADBC8', '#6E5340', 'kopírovat'] }[x.kind];
      const act = x.kind === 'link' ? `<a class="sm b ok" href="${esc(x.text)}" target="_blank" rel="noopener" style="text-decoration:none">${ic[3]}</a>` : `<button class="xbtn sm b ok" style="font-size:12px;color:var(--moss-d)" data-act="${x.kind === 'file' ? 'shareDl' : 'shareCopy'}" data-id="${x.id}">${ic[3]}</button>`;
      return `<div class="lrow"><span class="badge" style="background:${ic[1]}">${svg(ic[0], 18, 2, ic[2])}</span><span class="col grow"><span class="md b ell">${esc(x.kind === 'file' ? x.fileName : x.text)}</span><span class="sm mutd">z ${esc(x.from)} · ${relDay(x.date)}</span></span>${act}<button class="xbtn" data-act="shareDel" data-id="${x.id}" aria-label="Smazat">×</button></div>`;
    }).join('') : '<div class="empty">Schránka je prázdná. Pošli si sem něco tlačítkem +</div>';
  } else if (tab === 1) {
    rows = sc.projects.length ? sc.projects.map(p => `<button class="lrow" data-act="projOpen" data-id="${p.id}"><span class="badge" style="background:#E39A72">${esc(p.name[0] || '?')}</span><span class="col grow"><span class="md b">${esc(p.name)}</span><span class="sm mutd ell">${esc(p.note)}</span></span><span class="sm b" style="color:var(--ink-d)">${num(p.progress)} %</span></button>`).join('') : '<div class="empty">Žádný projekt. Přidej ho tlačítkem +</div>';
  } else {
    const ds = [...sc.deadlines].sort((a, b) => a.date.localeCompare(b.date));
    rows = ds.length ? ds.map(d => { const n = daysBetween(t, d.date); return `<button class="lrow" data-act="dlOpen" data-id="${d.id}"><span class="badge" style="background:${n < 0 ? '#EFE6DA' : n <= 7 ? '#E39A72' : '#EADBC8'}">${dayNum(d.date)}</span><span class="col grow"><span class="md b">${esc(d.title)}</span><span class="sm mutd">${shortD(d.date)}</span></span><span class="sm b ${n <= 7 && n >= 0 ? 'bad' : 'mutd'}">${relDay(d.date)}</span></button>`; }).join('') : '<div class="empty">Žádné termíny. Přidej je tlačítkem +</div>';
  }
  return `
  <div class="row"><h1 class="h1">Škola</h1>${next ? `<span class="pill terra">${esc(next.title)} · ${relDay(next.date)}</span>` : ''}</div>
  <div class="card">
    <div class="row base"><div class="ttl">Odkazy</div><div class="row gap8"><span class="sm mut">další škola: ${nextSchool()}</span><button class="xbtn xs mut" style="font-size:11px" data-act="editSchoolLinks">${U.editSchoolLinks ? 'hotovo' : 'upravit'}</button></div></div>
    <div class="tiles" style="grid-template-columns:repeat(5,minmax(0,1fr))">${tiles}<button class="tile add" data-act="linkNew" data-to="school"><span style="font-size:20px">+</span>Přidat</button></div>
  </div>
  <div class="tabs" role="tablist">${['Sdílení', 'Projekty', 'Termíny'].map((x, i) => `<button role="tab" class="${i === tab ? 'on' : ''}" data-act="schoolTab" data-i="${i}">${x}</button>`).join('')}</div>
  <div class="card cream flat">${rows}</div>`;
}

/* ======================================================
   ROSTLINY
   ====================================================== */
function vPlants() {
  const due = S.plants.filter(plantDue);
  const groups = {}; due.forEach(p => { (groups[careWord(p)] ||= []).push(p.name); });
  const hero = due.length ? Object.entries(groups).map(([w, n]) => `${w[0].toUpperCase() + w.slice(1)}: ${n.join(', ')}`).join('<br>') : 'Dnes nic.<br>Všechno v pohodě.';
  const cards = S.plants.map(p => {
    const ph = latestPhoto(p), last = p.entries?.[0];
    const w = p.where === 'voda' && !p.roots && !p.leaves;
    return `<a class="pcard" href="#/rostlina/${p.id}"><div class="ph ${w ? 'wait' : ''}">${ph ? `<img data-img="${ph}" alt="">` : svg(w ? 'stem' : 'sprout', 44, 1.5, w ? '#8A6F5A' : '#4F5A2A')}</div><span class="md b" style="font-size:15px">${esc(p.name)}</span><span class="sm mutd">${esc([p.where, p.roots ? p.roots + ' kořeny' : '', p.leaves ? p.leaves + ' nové listy' : ''].filter(Boolean).join(' · '))}</span><span class="xs b ${plantDue(p) ? 'bad' : 'ok'}">${plantDue(p) ? careWord(p) + ' dnes' : last ? 'poslední zápis: ' + relDay(last.date) : 'zatím bez zápisu'}</span></a>`;
  }).join('');
  return `
  <div class="row"><h1 class="h1">Rostliny</h1><span class="sm mut">${S.plants.length} rostliny</span></div>
  <div class="card moss hero" style="flex-direction:row;justify-content:space-between;align-items:center"><div class="col gap4"><span class="md b">Dnes udělat</span><span class="mid">${hero}</span></div>${svg('drop', 52, 1.5, '#2C2118')}</div>
  <div class="pgrid">${cards}</div>
  <button class="tile add" style="min-height:52px;font-size:14px;border-radius:22px;border:2px dashed var(--dash)" data-act="addPlant">+ Přidat rostlinu</button>`;
}
function vPlant(id) {
  const p = S.plants.find(x => x.id === id);
  if (!p) return '<a class="back" href="#/rostliny">‹ Rostliny</a><div class="empty">Rostlina nenalezena.</div>';
  if (!U.pdraft || U.pdraft.id !== id) U.pdraft = { id, text: '', file: null, url: '' };
  const D = U.pdraft;
  const careN = p.interval > 0 ? (p.lastCare ? p.interval - daysBetween(p.lastCare, today()) : 0) : null;
  const care = p.interval > 0 ? `<div class="card" style="flex-direction:row;align-items:center;justify-content:space-between"><div class="col"><span class="sm mut">Další péče (${careWord(p)})</span><span class="md b" style="color:${careN <= 0 ? 'var(--terra)' : 'var(--ink)'}">${careN <= 0 ? 'dnes' : `za ${careN} dní`}</span></div><button class="btn moss" style="width:auto;min-height:44px" data-act="careDone" data-id="${p.id}">✓ Hotovo</button></div>` : '';
  const ents = (p.entries || []).map((e, i) => `<button class="entry" data-act="entryOpen" data-id="${p.id}" data-i="${i}">${e.photo ? `<img data-img="${e.photo}" alt="Fotka ${esc(p.name)}">` : ''}<span class="tx"><span class="sm b" style="color:var(--moss)">${shortD(e.date)}${e.date === today() ? ' · dnes' : ''}</span>${e.text ? `<span class="md" style="line-height:1.4">${esc(e.text)}</span>` : ''}</span></button>`).join('');
  const photos = (p.entries || []).filter(e => e.photo).length;
  return `
  <div class="row"><a class="back" href="#/rostliny">‹ Rostliny</a><button class="hbtn" data-act="plantEdit" data-id="${p.id}">upravit</button></div>
  <div class="col gap4"><h1 class="h1" style="font-size:38px">${esc(p.name)}</h1><span class="md mut">${esc(p.sub)}</span></div>
  <div class="minis"><div class="mini"><span>Kořeny</span><b>${esc(p.roots === '' ? '—' : p.roots)}</b></div><div class="mini"><span>Nové listy</span><b style="color:var(--moss)">${esc(p.leaves === '' ? '—' : p.leaves)}</b></div><div class="mini"><span>Kde je</span><b>${esc(p.where || '—')}</b></div></div>
  ${care}
  <div class="card cream">
    <div class="ttl">Nový zápis</div>
    <div class="row gap10" style="align-items:stretch">
      <label class="photo-btn filebtn" aria-label="Přidat fotku">${D.url ? `<img src="${D.url}" alt="">` : `${svg('cam', 24)}fotka`}<input type="file" accept="image/*" data-file="plantPhoto"></label>
      <label for="pText" class="sr">Co je nového</label><textarea id="pText" class="inp" placeholder="Co je nového? (nový list, přesazeno, vyměněná voda…)" data-bind="pdraft.text">${esc(D.text)}</textarea>
    </div>
    <button class="btn" data-act="entrySave" data-id="${p.id}">Uložit do deníku</button>
  </div>
  <div class="row base"><div class="ttl" style="font-size:24px">Deník</div><span class="sm mut">${(p.entries || []).length} zápisů · ${photos} fotek</span></div>
  ${ents || '<div class="empty">Zatím žádný zápis. Udělej první fotku.</div>'}`;
}

/* ======================================================
   SHEETY
   ====================================================== */
const SHEETS = {
  tx() {
    const D = U.draft, isIn = D.type === 'in' || D.type === 'shift';
    const types = Object.entries(TXT).map(([k, l]) => `<button class="${D.type === k ? 'on' : ''}" data-act="txType" data-k="${k}">${l}</button>`).join('');
    const cats = D.type === 'invoice' ? ['Reklamy', 'Dodavatel', 'Shopify / appky', 'Ostatní'] : ['Reklamy', 'Zboží', 'Jídlo', 'Benzín', 'Bydlení', 'Ostatní'];
    const envOpts = isIn
      ? [{ id: 'split', name: `Rozdělit podle % (${S.envs.map(e => num(e.pct)).join(' / ')})` }, ...S.envs].map(e => `<button class="opt ${D.dest === e.id ? 'on' : ''}" data-act="txDest" data-id="${e.id}"><span class="rd"></span><span class="grow md b">${esc(e.name)}</span><span class="col sm" style="align-items:flex-end">${e.id === 'split' ? '' : `<span class="mutd">${kc(envBalance(e.id))} Kč</span>`}<span class="xs b ok" data-prev="${e.id}"></span></span></button>`).join('')
      : S.envs.map(e => `<button class="opt ${D.env === e.id ? 'on' : ''}" data-act="txEnv" data-id="${e.id}"><span class="rd"></span><span class="grow md b">${esc(e.name)}</span><span class="col sm" style="align-items:flex-end"><span class="mutd">${kc(envBalance(e.id))} Kč</span><span class="xs b" data-prev="${e.id}"></span></span></button>`).join('');
    return `
    <div class="row"><span class="md b" style="color:var(--moss-d)">Nový záznam</span><button class="xbtn" data-act="close" aria-label="Zavřít">×</button></div>
    <div class="tabs" style="background:var(--dark)">${types}</div>
    <div class="amount"><span class="sign" style="color:${isIn ? 'var(--moss-d)' : 'var(--red)'}">${isIn ? '+' : '−'}</span><label for="txAmt" class="sr">Částka</label><input id="txAmt" inputmode="decimal" placeholder="0" value="${esc(D.amount)}" data-bind="draft.amount" data-live="txPrev"><span class="serif mutd" style="font-size:26px">Kč</span></div>
    <div class="row gap8"><div class="col gap4 grow"><label for="txName" class="lbl">Název</label><input id="txName" class="inp" placeholder="${{ in: 'Za co? (prodej, dárek…)', out: 'Za co? (nákup Lidl…)', shift: 'Směna – rozvoz', invoice: 'Od koho? (Meta Ads…)' }[D.type]}" value="${esc(D.name)}" data-bind="draft.name" data-live="txPrev"></div><div class="col gap4" style="width:150px"><label for="txDate" class="lbl">Datum</label><input id="txDate" type="date" class="inp" value="${D.date}" data-bind="draft.date"></div></div>
    ${D.type === 'shift' ? `<div class="row gap8"><div class="col gap4 grow"><label for="txH" class="lbl">Hodiny</label><input id="txH" class="inp" inputmode="decimal" value="${esc(D.hours)}" data-bind="draft.hours"></div><div class="col gap4 grow"><label for="txT" class="lbl">Z toho dýško (Kč)</label><input id="txT" class="inp" inputmode="decimal" value="${esc(D.tips)}" data-bind="draft.tips"></div></div><div class="note">Částka nahoře = celkem za směnu včetně dýška.</div>` : ''}
    ${D.type === 'out' || D.type === 'invoice' ? `<div class="col gap6"><span class="lbl">Kategorie</span><div class="chips">${cats.map(c => `<button class="chip ${D.cat === c ? 'on' : ''}" data-act="txCat" data-c="${c}">${c}</button>`).join('')}</div></div>` : ''}
    ${D.type === 'invoice' ? `<div class="col gap8"><span class="lbl">Doklad pro účetní</span><div class="row gap8"><label class="btn light filebtn" style="flex:1;border:2px dashed #CDB9A3;display:flex;align-items:center;justify-content:center">${D.file ? '✓ ' + esc(D.file.name).slice(0, 18) : '+ PDF / foto'}<input type="file" accept="application/pdf,image/*" data-file="txFile"></label><button class="btn light" style="flex:1;border:2px dashed #CDB9A3" data-act="txLink">+ Odkaz</button></div>${D.showLink ? `<label for="txL" class="sr">Odkaz</label><input id="txL" class="inp" placeholder="https://…" value="${esc(D.link)}" data-bind="draft.link">` : ''}<div class="chips">${[['1', 'Zaplaceno'], ['0', 'Čeká na zaplacení']].map(([v, l]) => `<button class="chip ${String(+D.paid) === v ? 'on' : ''}" data-act="txPaid" data-v="${v}">${l}</button>`).join('')}</div></div>` : ''}
    <div class="col gap6"><span class="lbl">${isIn ? 'Kam to dát' : 'Odkud to beru'}</span>${envOpts || '<div class="warn">Nemáš žádnou obálku. Vytvoř si ji v Peníze → nastavit obálky.</div>'}</div>
    <div id="txWarn"></div>
    <button class="btn" id="txSave" data-act="txSave">${{ in: 'Uložit příjem', out: 'Uložit výdaj', shift: 'Uložit směnu', invoice: 'Uložit fakturu' }[D.type]}</button>`;
  },
  txView(id) {
    const x = S.tx.find(t => t.id === id); if (!x) return '';
    const alloc = Object.entries(x.alloc || {}).map(([eid, v]) => `${esc(S.envs.find(e => e.id === eid)?.name || 'smazaná obálka')}: ${sgn(v)} Kč`).join('<br>');
    return `<div class="row"><span class="md b">${TXT[x.type]}</span><button class="xbtn" data-act="close" aria-label="Zavřít">×</button></div>
    <div class="mid">${esc(x.type === 'shift' ? 'Směna' : x.name)}</div>
    <div class="serif" style="font-size:38px;color:${signed(x) >= 0 ? 'var(--moss-d)' : 'var(--red)'}">${sgn(signed(x))} Kč</div>
    <div class="md">${shortD(x.date)}${x.cat ? ' · ' + esc(x.cat) : ''}${x.hours ? ' · ' + esc(x.hours) + ' h' : ''}${x.tips ? ' · dýško ' + kc(x.tips) : ''}</div>
    <div class="note">${alloc}</div>
    ${x.link ? `<a class="btn light" style="display:flex;align-items:center;justify-content:center;text-decoration:none" href="${esc(x.link)}" target="_blank" rel="noopener">Otevřít odkaz ↗</a>` : ''}
    ${x.fileId ? `<button class="btn light" data-act="txFileOpen" data-id="${x.id}">Otevřít doklad (${esc(x.fileName)})</button>` : ''}
    ${x.type === 'invoice' ? `<button class="btn ${x.paid ? 'light' : 'moss'}" data-act="txTogglePaid" data-id="${x.id}">${x.paid ? 'Označit jako nezaplaceno' : 'Označit jako zaplaceno'}</button>` : ''}
    <button class="btn ghost" data-act="txDel" data-id="${x.id}">Smazat záznam</button>`;
  },
  debtNew() {
    return `<div class="row"><span class="md b">Nový dluh</span><button class="xbtn" data-act="close" aria-label="Zavřít">×</button></div>
    <label class="lbl" for="dbWho">Kdo mi dluží</label><input id="dbWho" class="inp" placeholder="Jméno">
    <label class="lbl" for="dbAmt">Kolik (Kč)</label><input id="dbAmt" class="inp" inputmode="decimal">
    <label class="lbl" for="dbNote">Poznámka</label><input id="dbNote" class="inp" placeholder="za co, do kdy…">
    <button class="btn" data-act="debtSave">Uložit</button>`;
  },
  debt(id) {
    const d = S.debts.find(x => x.id === id); if (!d) return '';
    return `<div class="row"><span class="md b">Dluh</span><button class="xbtn" data-act="close" aria-label="Zavřít">×</button></div>
    <div class="mid">${esc(d.who)}</div><div class="serif" style="font-size:38px">${kc(d.amount)} Kč</div><div class="note">${esc(d.note)}</div>
    <label class="lbl" for="dbPay">Zaplatil splátku (Kč)</label><input id="dbPay" class="inp" inputmode="decimal">
    <button class="btn moss" data-act="debtPay" data-id="${d.id}">Odečíst splátku</button>
    <button class="btn ghost" data-act="debtDel" data-id="${d.id}">Smazat dluh</button>`;
  },
  link(to) {
    return `<div class="row"><span class="md b">Nový odkaz</span><button class="xbtn" data-act="close" aria-label="Zavřít">×</button></div>
    <label class="lbl" for="lnName">Název</label><input id="lnName" class="inp" placeholder="${to === 'school' ? 'Moodle, STAG, Email…' : 'Meta, Shopify, TeemDrop…'}">
    <label class="lbl" for="lnUrl">Odkaz</label><input id="lnUrl" class="inp" inputmode="url" placeholder="https://…">
    <button class="btn" data-act="linkSave" data-to="${to}">Přidat</button>`;
  },
  shopNew() {
    return `<div class="row"><span class="md b">Nový shop</span><button class="xbtn" data-act="close" aria-label="Zavřít">×</button></div>
    <label class="lbl" for="shName">Název shopu</label><input id="shName" class="inp">
    <button class="btn" data-act="shopSave">Vytvořit</button>`;
  },
  shopEdit() {
    const sh = shop();
    return `<div class="row"><span class="md b">Upravit shop</span><button class="xbtn" data-act="close" aria-label="Zavřít">×</button></div>
    <label class="lbl" for="seName">Název</label><input id="seName" class="inp" value="${esc(sh.name)}">
    <div class="row gap8"><div class="col gap4 grow"><label class="lbl" for="sePrice">Prodejní cena (Kč)</label><input id="sePrice" class="inp" inputmode="decimal" value="${esc(sh.price)}"></div><div class="col gap4 grow"><label class="lbl" for="seCost">Náklad na kus (Kč)</label><input id="seCost" class="inp" inputmode="decimal" value="${esc(sh.cost)}"></div></div>
    <div class="note">Z ceny a nákladu se spočítá breakeven ROAS.</div>
    <button class="btn" data-act="shopEditSave">Uložit</button>
    ${S.shops.length > 1 ? '<button class="btn ghost" data-act="shopDel">Smazat shop</button>' : ''}`;
  },
  dayView(d) {
    const x = shop().days.find(y => y.date === d); if (!x) return '';
    const p = num(x.rev) - num(x.ads) - num(x.ful);
    return `<div class="row"><span class="md b">${shortD(d)}</span><button class="xbtn" data-act="close" aria-label="Zavřít">×</button></div>
    <div class="serif" style="font-size:38px;color:${p >= 0 ? 'var(--moss-d)' : 'var(--red)'}">${sgn(p)} Kč</div>
    <div class="md">Reklamy ${kc(x.ads)} · Tržby ${kc(x.rev)} · Fulfill ${kc(x.ful)}</div>
    <button class="btn" data-act="dayEdit" data-d="${d}">Upravit</button>
    <button class="btn ghost" data-act="dayDel" data-d="${d}">Smazat den</button>`;
  },
  share() {
    const D = U.draft;
    return `<div class="row"><span class="md b">Poslat do schránky</span><button class="xbtn" data-act="close" aria-label="Zavřít">×</button></div>
    <div class="col gap6"><span class="lbl">Posílám z</span><div class="chips">${['Mobil', 'Doma PC', 'Škola PC'].map(d => `<button class="chip ${U.device === d ? 'on' : ''}" data-act="device" data-d="${d}">${d}</button>`).join('')}</div></div>
    <label for="shText" class="sr">Text nebo odkaz</label><textarea id="shText" class="inp" placeholder="Napiš poznámku nebo vlož odkaz…" data-bind="draft.text">${esc(D.text)}</textarea>
    <label class="btn light filebtn" style="border:2px dashed #CDB9A3;display:flex;align-items:center;justify-content:center">${D.file ? '✓ ' + esc(D.file.name).slice(0, 26) : '+ Soubor / foto'}<input type="file" data-file="shareFile"></label>
    <div class="note">Zatím se ukládá jen v tomhle zařízení. Sdílení mezi mobilem a PC zapneme s Firebase.</div>
    <button class="btn" data-act="shareSave">Poslat</button>`;
  },
  project(id) {
    const p = id ? S.school.projects.find(x => x.id === id) : { name: '', note: '', progress: 0 };
    return `<div class="row"><span class="md b">${id ? 'Projekt' : 'Nový projekt'}</span><button class="xbtn" data-act="close" aria-label="Zavřít">×</button></div>
    <label class="lbl" for="prName">Název</label><input id="prName" class="inp" value="${esc(p.name)}">
    <label class="lbl" for="prNote">Poznámka</label><textarea id="prNote" class="inp">${esc(p.note)}</textarea>
    <label class="lbl" for="prProg">Hotovo: <span id="prVal">${num(p.progress)}</span> %</label><input id="prProg" type="range" min="0" max="100" step="5" value="${num(p.progress)}" oninput="document.getElementById('prVal').textContent=this.value">
    <button class="btn" data-act="projSave" data-id="${id || ''}">Uložit</button>
    ${id ? `<button class="btn ghost" data-act="projDel" data-id="${id}">Smazat projekt</button>` : ''}`;
  },
  deadline(id) {
    const d = id ? S.school.deadlines.find(x => x.id === id) : null;
    if (d) return `<div class="row"><span class="md b">Termín</span><button class="xbtn" data-act="close" aria-label="Zavřít">×</button></div><div class="mid">${esc(d.title)}</div><div class="md">${shortD(d.date)} · ${relDay(d.date)}</div><button class="btn ghost" data-act="dlDel" data-id="${d.id}">Smazat termín</button>`;
    return `<div class="row"><span class="md b">Nový termín</span><button class="xbtn" data-act="close" aria-label="Zavřít">×</button></div>
    <label class="lbl" for="dlTitle">Co odevzdat / napsat</label><input id="dlTitle" class="inp" placeholder="Momento – návrh řešení">
    <label class="lbl" for="dlDate">Do kdy</label><input id="dlDate" type="date" class="inp" value="${addDays(today(), 7)}">
    <div class="note">Termín se ukáže i v kalendáři.</div>
    <button class="btn" data-act="dlSave">Uložit</button>`;
  },
  plant(id) {
    const p = id ? S.plants.find(x => x.id === id) : { name: '', sub: '', where: 'voda', roots: '', leaves: '', interval: 7 };
    return `<div class="row"><span class="md b">${id ? 'Upravit rostlinu' : 'Nová rostlina'}</span><button class="xbtn" data-act="close" aria-label="Zavřít">×</button></div>
    <label class="lbl" for="plName">Název</label><input id="plName" class="inp" value="${esc(p.name)}" placeholder="Řízek C">
    <label class="lbl" for="plSub">Druh / odkud je</label><input id="plSub" class="inp" value="${esc(p.sub)}" placeholder="Monstera · z Futuru">
    <label class="lbl" for="plWhere">Kde je</label><input id="plWhere" class="inp" value="${esc(p.where)}" list="whereList"><datalist id="whereList"><option value="voda"><option value="substrát"><option value="kůra + hlína"><option value="substrát + hlína"></datalist>
    <div class="row gap8"><div class="col gap4 grow"><label class="lbl" for="plRoots">Kořeny</label><input id="plRoots" class="inp" inputmode="numeric" value="${esc(p.roots)}"></div><div class="col gap4 grow"><label class="lbl" for="plLeaves">Nové listy</label><input id="plLeaves" class="inp" inputmode="numeric" value="${esc(p.leaves)}"></div></div>
    <label class="lbl" for="plInt">Připomenout péči každých (dní, 0 = vypnuto)</label><input id="plInt" class="inp" inputmode="numeric" value="${esc(p.interval)}">
    <button class="btn" data-act="plantSave" data-id="${id || ''}">Uložit</button>
    ${id ? `<button class="btn ghost" data-act="plantDel" data-id="${id}">Smazat rostlinu</button>` : ''}`;
  },
  entry(arg) {
    const [pid, i] = arg; const p = S.plants.find(x => x.id === pid); const e = p?.entries[i]; if (!e) return '';
    return `<div class="row"><span class="md b">${shortD(e.date)}</span><button class="xbtn" data-act="close" aria-label="Zavřít">×</button></div>
    ${e.photo ? `<img data-img="${e.photo}" alt="" style="width:100%;border-radius:18px">` : ''}
    <div class="md">${esc(e.text)}</div>
    <button class="btn ghost" data-act="entryDel" data-id="${pid}" data-i="${i}">Smazat zápis</button>`;
  },
  settings() {
    return `<div class="row"><span class="md b">Nastavení</span><button class="xbtn" data-act="close" aria-label="Zavřít">×</button></div>
    <div class="note">Všechna data jsou zatím uložená jen v tomhle zařízení. Občas si stáhni zálohu.</div>
    <button class="btn" data-act="backup">Stáhnout zálohu (bez fotek)</button>
    <label class="btn light filebtn" style="display:flex;align-items:center;justify-content:center">Nahrát zálohu<input type="file" accept="application/json" data-file="restore"></label>
    <div class="note">Rozvrh školy upravíš na začátku souboru app.js (ROZVRH). Směny si přidáváš sám v kalendáři.</div>`;
  }
};

function txPreview() {
  const D = U.draft; if (!D || U.sheetFn !== 'tx') return;
  const amt = num(D.amount), isIn = D.type === 'in' || D.type === 'shift';
  $$('[data-prev]').forEach(el => { el.textContent = ''; });
  let warn = '';
  if (isIn) {
    const sp = splitAlloc(amt);
    if (D.dest === 'split') { const el = $('[data-prev="split"]'); if (el) el.textContent = S.envs.map(e => kc(sp[e.id] || 0)).join(' · '); }
    else { const el = $(`[data-prev="${D.dest}"]`); if (el) el.textContent = 'bude ' + kc(envBalance(D.dest) + amt); }
  } else {
    const el = $(`[data-prev="${D.env}"]`); const left = envBalance(D.env) - amt;
    if (el) { el.textContent = 'zbyde ' + kc(left); el.style.color = left < 0 ? 'var(--red)' : 'var(--moss-d)'; }
    if (amt > 0 && left < 0 && !(D.type === 'invoice' && !D.paid)) warn = '<div class="warn">V téhle obálce na to nemáš. Vyber jinou nebo sniž částku.</div>';
  }
  const w = $('#txWarn'); if (w) w.innerHTML = warn;
  const named = String(D.name).trim() || D.type === 'shift';
  const b = $('#txSave'); if (b) { b.disabled = !(named && amt > 0); if (!named) b.textContent = 'Doplň název'; else b.textContent = { in: 'Uložit příjem', out: 'Uložit výdaj', shift: 'Uložit směnu', invoice: 'Uložit fakturu' }[D.type]; }
}
function splitAlloc(amt) {
  const tot = S.envs.reduce((a, e) => a + num(e.pct), 0); const out = {};
  if (!S.envs.length) return out;
  if (!tot) { out[S.envs[0].id] = amt; return out; }
  let used = 0; S.envs.forEach(e => { const v = Math.floor(amt * num(e.pct) / tot); out[e.id] = v; used += v; });
  const big = [...S.envs].sort((a, b) => num(b.pct) - num(a.pct))[0]; out[big.id] += amt - used;
  return out;
}

/* ======================================================
   AKCE
   ====================================================== */
function setPath(path, v) { const ks = path.split('.'); let o = U; for (let i = 0; i < ks.length - 1; i++) o = o[ks[i]]; o[ks.at(-1)] = v; }
const val = id => ($('#' + id)?.value ?? '').trim();

const ACT = {
  nav: el => { if (el.dataset.to === 'penize') U.envDraft = null; go(el.dataset.to); },
  bg: (el, e) => { if (e.target === el) closeSheet(); },
  close: closeSheet,
  settings: () => openSheet('settings'),
  /* domů */
  addTodo: () => { const t = val('newTodo'); if (!t) return; (S.todos[today()] ||= []).push({ id: uid(), text: t, done: false }); save(); render(); $('#newTodo')?.focus(); },
  todo: el => { const x = (S.todos[today()] || []).find(y => y.id === el.dataset.id); if (x) { x.done = !x.done; save(); render(); } },
  todoDel: el => { S.todos[today()] = (S.todos[today()] || []).filter(y => y.id !== el.dataset.id); save(); render(); },
  gym: () => { const t = today(); S.gym = S.gym.includes(t) ? S.gym.filter(d => d !== t) : [...S.gym, t]; save(); render(); },
  food: () => { const t = today(); S.food = S.food.includes(t) ? S.food.filter(d => d !== t) : [...S.food, t]; save(); render(); },
  /* kalendář */
  pickDay: el => { U.sel = el.dataset.d; render(); },
  mon: el => { const [y, m] = U.calMonth.split('-').map(Number); const d = new Date(y, m - 1 + +el.dataset.n, 1); U.calMonth = iso(d).slice(0, 7); U.sel = iso(d); render(); },
  addEv: () => { const t = val('evText'); if (!t) return; (S.events[U.sel] ||= []).push({ id: uid(), time: val('evTime'), text: t }); save(); render(); },
  shiftToggle: () => {
    const l = S.events[U.sel] ||= [];
    if (l.some(e => e.kind === 'work')) S.events[U.sel] = l.filter(e => e.kind !== 'work');
    else l.unshift({ id: uid(), kind: 'work', time: val('evTime') || ROZVRH.smenaCas, text: 'Směna – rozvoz' });
    save(); render();
  },
  evDel: el => { S.events[U.sel] = (S.events[U.sel] || []).filter(e => e.id !== el.dataset.id); save(); render(); },
  /* peníze */
  moneyTab: el => { U.moneyTab = +el.dataset.i; render(); },
  fab: () => {
    const [r] = route();
    if (r === 'penize') { if (U.moneyTab === 4) return openSheet('debtNew'); const type = [null, 'shift', 'invoice', 'out'][U.moneyTab] || 'out'; U.draft = { type, amount: '', name: '', date: today(), hours: '', tips: '', cat: '', env: S.envs[0]?.id, dest: 'split', paid: true, link: '', showLink: false, file: null }; openSheet('tx'); txPreview(); }
    if (r === 'skola') { if (U.schoolTab === 0) { U.draft = { text: '', file: null }; openSheet('share'); } else if (U.schoolTab === 1) openSheet('project'); else openSheet('deadline'); }
  },
  txType: el => { U.draft.type = el.dataset.k; drawSheet(); txPreview(); },
  txCat: el => { U.draft.cat = el.dataset.c; drawSheet(); txPreview(); },
  txEnv: el => { U.draft.env = el.dataset.id; drawSheet(); txPreview(); },
  txDest: el => { U.draft.dest = el.dataset.id; drawSheet(); txPreview(); },
  txPaid: el => { U.draft.paid = el.dataset.v === '1'; drawSheet(); txPreview(); },
  txLink: () => { U.draft.showLink = !U.draft.showLink; drawSheet(); txPreview(); },
  txSave: async () => {
    const D = U.draft, amt = num(D.amount); if (!(amt > 0)) return;
    const isIn = D.type === 'in' || D.type === 'shift';
    if (!isIn && !D.env) return toast('Nejdřív si vytvoř obálku');
    const x = { id: uid(), ts: Date.now(), type: D.type, name: D.type === 'shift' ? (D.name || 'Směna – rozvoz') : D.name.trim(), amount: amt, date: D.date || today(), cat: D.cat, hours: D.hours, tips: num(D.tips), link: D.link, paid: D.type === 'invoice' ? D.paid : true };
    x.alloc = isIn ? (D.dest === 'split' ? splitAlloc(amt) : { [D.dest]: amt }) : { [D.env]: -amt };
    if (D.file) { try { x.fileId = await storeFile(D.file); x.fileName = D.file.name; } catch (e) { toast('Soubor se nepodařilo uložit'); } }
    S.tx.push(x); save(); closeSheet(); render(); toast('Uloženo');
  },
  txOpen: el => openSheet('txView', el.dataset.id),
  txTogglePaid: el => { const x = S.tx.find(t => t.id === el.dataset.id); x.paid = !x.paid; save(); drawSheet(); render(); },
  txDel: async el => { if (!confirm('Opravdu smazat?')) return; const x = S.tx.find(t => t.id === el.dataset.id); if (x?.fileId) await IDB.del(x.fileId); S.tx = S.tx.filter(t => t.id !== el.dataset.id); save(); closeSheet(); render(); },
  txFileOpen: async el => { const x = S.tx.find(t => t.id === el.dataset.id); const u = await fileUrl(x.fileId); if (u) window.open(u, '_blank'); },
  debtNew: () => openSheet('debtNew'),
  debtSave: () => { const who = val('dbWho'), a = num(val('dbAmt')); if (!who || !a) return; S.debts.push({ id: uid(), who, amount: a, note: val('dbNote') }); save(); closeSheet(); render(); },
  debt: el => openSheet('debt', el.dataset.id),
  debtPay: el => { const d = S.debts.find(x => x.id === el.dataset.id); d.amount = Math.max(0, num(d.amount) - num(val('dbPay'))); d.note = (d.note ? d.note + ' · ' : '') + `splátka ${kc(num(val('dbPay')))} (${shortD(today())})`; save(); drawSheet(); render(); },
  debtDel: el => { if (!confirm('Smazat dluh?')) return; S.debts = S.debts.filter(x => x.id !== el.dataset.id); save(); closeSheet(); render(); },
  /* obálky */
  envBack: () => { U.envDraft = null; },
  envPct: el => { const e = U.envDraft[+el.dataset.i]; e.pct = Math.max(0, Math.min(100, num(e.pct) + +el.dataset.n)); render(); },
  envAdd: () => { const n = val('envNew'); if (!n) return; U.envDraft.push({ id: uid(), name: n, pct: 0 }); render(); },
  envDel: el => { const e = U.envDraft[+el.dataset.i]; const b = envBalance(e.id); if (Math.round(b) !== 0) return toast(`V obálce je ${kc(b)} Kč – nejdřív je vyber výdajem`); U.envDraft.splice(+el.dataset.i, 1); render(); },
  envSave: () => { const t = U.envDraft.reduce((a, e) => a + num(e.pct), 0); if (U.envDraft.length && t !== 100) return toast('Procenta musí dát dohromady 100 %'); if (U.envDraft.some(e => !String(e.name).trim())) return toast('Každá obálka potřebuje název'); S.envs = U.envDraft.map(e => ({ ...e, name: String(e.name).trim() })); U.envDraft = null; save(); toast('Obálky uloženy'); go('penize'); },
  /* shopy */
  periodMenu: () => { U.periodMenu = !U.periodMenu; render(); },
  period: el => { U.period = el.dataset.k; U.periodMenu = false; render(); },
  shopPick: el => { S.activeShop = el.dataset.id; save(); render(); },
  shopNew: () => openSheet('shopNew'),
  shopSave: () => { const n = val('shName'); if (!n) return; const s = { id: uid(), name: n, price: '', cost: '', days: [], links: [] }; S.shops.push(s); S.activeShop = s.id; save(); closeSheet(); render(); },
  shopEdit: () => openSheet('shopEdit'),
  shopEditSave: () => { const s = shop(); s.name = val('seName') || s.name; s.price = val('sePrice'); s.cost = val('seCost'); save(); closeSheet(); render(); },
  shopDel: () => { if (!confirm('Smazat shop i s výsledky?')) return; S.shops = S.shops.filter(x => x.id !== S.activeShop); S.activeShop = S.shops[0]?.id; save(); closeSheet(); render(); },
  shopTab: el => { U.shopTab = +el.dataset.i; render(); LIVE.dayPrev(); },
  editLinks: () => { U.editLinks = !U.editLinks; render(); },
  linkNew: el => openSheet('link', el.dataset.to),
  linkSave: el => { const n = val('lnName'); let u = val('lnUrl'); if (!n || !u) return; if (!/^(https?:|mailto:|tel:)/i.test(u)) u = 'https://' + u; const l = { id: uid(), name: n, url: u }; (el.dataset.to === 'school' ? S.school.links : shop().links).push(l); save(); closeSheet(); render(); },
  shopLinkDel: el => { const s = shop(); s.links = s.links.filter(l => l.id !== el.dataset.id); save(); render(); },
  dayDate: el => { U.day.date = el.dataset.d; U.day.other = false; render(); LIVE.dayPrev(); },
  dayOther: () => { U.day.other = true; render(); LIVE.dayPrev(); },
  dayMore: () => { U.day.more = true; render(); LIVE.dayPrev(); },
  daySave: () => {
    const D = U.day; if (!D.ads && !D.rev && !D.ful) return toast('Vyplň aspoň jedno číslo');
    const s = shop(); s.days = s.days.filter(x => x.date !== D.date);
    s.days.push({ date: D.date, ads: num(D.ads), rev: num(D.rev), ful: num(D.ful), orders: D.orders === '' ? '' : num(D.orders), cpc: D.cpc === '' ? '' : num(D.cpc), ctr: D.ctr === '' ? '' : num(D.ctr) });
    s.days.sort((a, b) => a.date.localeCompare(b.date));
    U.day = { ...D, ads: '', rev: '', ful: '', orders: '', cpc: '', ctr: '' };
    if (!inPeriod(D.date)) U.period = 'all';
    save(); render(); LIVE.dayPrev(); toast('Den uložen');
  },
  dayOpen: el => openSheet('dayView', el.dataset.d),
  dayEdit: el => { const x = shop().days.find(y => y.date === el.dataset.d); U.day = { date: x.date, ads: String(x.ads), rev: String(x.rev), ful: String(x.ful), orders: String(x.orders ?? ''), cpc: String(x.cpc ?? ''), ctr: String(x.ctr ?? ''), more: !!(x.orders || x.cpc || x.ctr), other: true }; closeSheet(); render(); LIVE.dayPrev(); },
  dayDel: el => { if (!confirm('Smazat tenhle den?')) return; const s = shop(); s.days = s.days.filter(y => y.date !== el.dataset.d); save(); closeSheet(); render(); LIVE.dayPrev(); },
  /* škola */
  schoolTab: el => { U.schoolTab = +el.dataset.i; render(); },
  editSchoolLinks: () => { U.editSchoolLinks = !U.editSchoolLinks; render(); },
  schoolLinkDel: el => { S.school.links = S.school.links.filter(l => l.id !== el.dataset.id); save(); render(); },
  device: el => { U.device = el.dataset.d; localStorage.setItem('lc-device', U.device); drawSheet(); },
  shareSave: async () => {
    const D = U.draft, t = String(D.text).trim(); if (!t && !D.file) return;
    if (D.file) { try { const id = await storeFile(D.file); S.school.share.unshift({ id: uid(), kind: 'file', fileId: id, fileName: D.file.name, from: U.device, date: today() }); } catch (e) { toast('Soubor se nepodařilo uložit'); } }
    if (t) S.school.share.unshift({ id: uid(), kind: /^https?:\/\/\S+$/.test(t) ? 'link' : 'text', text: t, from: U.device, date: today() });
    save(); closeSheet(); render();
  },
  shareCopy: async el => { const x = S.school.share.find(s => s.id === el.dataset.id); try { await navigator.clipboard.writeText(x.text); toast('Zkopírováno'); } catch (e) { toast('Nepodařilo se zkopírovat'); } },
  shareDl: async el => { const x = S.school.share.find(s => s.id === el.dataset.id); const u = await fileUrl(x.fileId); if (!u) return toast('Soubor nenalezen'); const a = document.createElement('a'); a.href = u; a.download = x.fileName; document.body.appendChild(a); a.click(); a.remove(); },
  shareDel: async el => { const x = S.school.share.find(s => s.id === el.dataset.id); if (x?.fileId) await IDB.del(x.fileId); S.school.share = S.school.share.filter(s => s.id !== el.dataset.id); save(); render(); },
  projOpen: el => openSheet('project', el.dataset.id),
  projSave: el => { const n = val('prName'); if (!n) return; const id = el.dataset.id; const data = { name: n, note: val('prNote'), progress: num(val('prProg')) }; if (id) Object.assign(S.school.projects.find(p => p.id === id), data); else S.school.projects.push({ id: uid(), ...data }); save(); closeSheet(); render(); },
  projDel: el => { if (!confirm('Smazat projekt?')) return; S.school.projects = S.school.projects.filter(p => p.id !== el.dataset.id); save(); closeSheet(); render(); },
  dlOpen: el => openSheet('deadline', el.dataset.id),
  dlSave: () => { const t = val('dlTitle'), d = val('dlDate'); if (!t || !d) return; S.school.deadlines.push({ id: uid(), title: t, date: d }); save(); closeSheet(); render(); },
  dlDel: el => { S.school.deadlines = S.school.deadlines.filter(x => x.id !== el.dataset.id); save(); closeSheet(); render(); },
  /* rostliny */
  addPlant: (el, e) => { e?.preventDefault(); openSheet('plant'); },
  plantEdit: el => openSheet('plant', el.dataset.id),
  plantSave: el => {
    const n = val('plName'); if (!n) return; const id = el.dataset.id;
    const data = { name: n, sub: val('plSub'), where: val('plWhere'), roots: val('plRoots') === '' ? '' : num(val('plRoots')), leaves: val('plLeaves') === '' ? '' : num(val('plLeaves')), interval: num(val('plInt')) };
    if (id) Object.assign(S.plants.find(p => p.id === id), data); else S.plants.push({ id: uid(), lastCare: null, entries: [], ...data });
    save(); closeSheet(); render();
  },
  plantDel: async el => { if (!confirm('Smazat rostlinu i s deníkem?')) return; const p = S.plants.find(x => x.id === el.dataset.id); for (const e of p.entries) if (e.photo) await IDB.del(e.photo); S.plants = S.plants.filter(x => x.id !== el.dataset.id); save(); closeSheet(); go('rostliny'); },
  careDone: el => { const p = S.plants.find(x => x.id === el.dataset.id); p.lastCare = today(); p.entries.unshift({ date: today(), text: p.where === 'voda' ? 'Vyměněna voda' : 'Zalito', photo: null }); save(); render(); toast('Hotovo ✓'); },
  entrySave: async el => {
    const p = S.plants.find(x => x.id === el.dataset.id), D = U.pdraft; const t = String(D.text).trim();
    if (!t && !D.file) return toast('Přidej fotku nebo text');
    let photo = null; if (D.file) { try { photo = await storeFile(D.file); } catch (e) { return toast('Fotku se nepodařilo uložit'); } }
    p.entries.unshift({ date: today(), text: t, photo });
    if (D.url) URL.revokeObjectURL(D.url);
    U.pdraft = { id: p.id, text: '', file: null, url: '' }; save(); render(); toast('Uloženo do deníku');
  },
  entryOpen: el => openSheet('entry', [el.dataset.id, +el.dataset.i]),
  entryDel: async el => { const p = S.plants.find(x => x.id === el.dataset.id); const [e] = p.entries.splice(+el.dataset.i, 1); if (e?.photo) await IDB.del(e.photo); save(); closeSheet(); render(); },
  /* záloha */
  backup: () => { const b = new Blob([JSON.stringify(S, null, 1)], { type: 'application/json' }); const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = `lifechanger-zaloha-${today()}.json`; a.click(); }
};
const FILE = {
  plantPhoto: el => { const f = el.files[0]; if (!f) return; if (U.pdraft.url) URL.revokeObjectURL(U.pdraft.url); U.pdraft.file = f; U.pdraft.url = URL.createObjectURL(f); render(); },
  txFile: el => { U.draft.file = el.files[0] || null; drawSheet(); txPreview(); },
  shareFile: el => { U.draft.file = el.files[0] || null; drawSheet(); },
  restore: el => { const f = el.files[0]; if (!f) return; f.text().then(t => { const d = JSON.parse(t); if (!d.v) throw 0; if (!confirm('Přepsat současná data zálohou?')) return; S = Object.assign(defaults(), d); save(); closeSheet(); render(); toast('Záloha nahrána'); }).catch(() => toast('Tohle není záloha Life Changeru')); }
};

document.addEventListener('click', e => { const el = e.target.closest('[data-act]'); if (!el) return; const f = ACT[el.dataset.act]; if (f) { if (el.tagName === 'A' && el.dataset.act !== 'nav') { /* necháme odkaz fungovat */ } f(el, e); } });
document.addEventListener('input', e => { const el = e.target; if (el.dataset.bind) { setPath(el.dataset.bind, el.value); if (el.dataset.live) LIVE[el.dataset.live]?.(); } });
document.addEventListener('change', e => { const el = e.target; if (el.dataset.file) FILE[el.dataset.file]?.(el); if (el.dataset.bind && el.type === 'date') { setPath(el.dataset.bind, el.value); if (U.sheetFn !== 'tx') LIVE.dayPrev(); } });
document.addEventListener('keydown', e => { if (e.key === 'Enter' && e.target.dataset?.enter) { e.preventDefault(); ACT[e.target.dataset.enter]?.(e.target, e); } });

render();
LIVE.dayPrev();
if ('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js').catch(() => { });
