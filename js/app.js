// ── Config ────────────────────────────────────────────────────────────────
const ICE_SERVERS = [{ urls: 'stun:stun.l.google.com:19302' }];

// ── State ─────────────────────────────────────────────────────────────────
let pc        = null;
let dc        = null;
let myId      = '';
let messages  = [];
let pendingOfferEncrypted = null;
let offerEncrypted        = null;
let localNonce      = null;
let remoteNonce     = null;
let peerTypingTimer = null;
let lastTypingSent  = 0;
let historyMode     = false;
let peerLeft        = false;
let chatStarted     = false;

// ── Session persistence ───────────────────────────────────────────────────

// sessionStorage, not localStorage: survives a reload of this tab only, gone when the tab closes.
const MSGS_KEY = 'btw_msgs';
const MSGS_TTL = 24 * 60 * 60 * 1000;

function saveMessages() {
  if (!messages.length) return;
  try {
    sessionStorage.setItem(MSGS_KEY, JSON.stringify({
      msgs: messages, peer: peerName, id: myId, ts: Date.now()
    }));
  } catch (_) {}
}

function clearHistory() {
  sessionStorage.removeItem(MSGS_KEY);
  historyMode = false;
}

function loadSavedMessages() {
  try {
    const raw = sessionStorage.getItem(MSGS_KEY);
    if (!raw) return null;
    const d = JSON.parse(raw);
    if (Date.now() - d.ts > MSGS_TTL) { sessionStorage.removeItem(MSGS_KEY); return null; }
    return d;
  } catch (_) { return null; }
}

// ── Identity ──────────────────────────────────────────────────────────────
const HANDLES = [
  'Wolf','Fox','Bear','Lynx','Crow','Hawk',
  'Viper','Ghost','Storm','Shade','Raven','Pike'
];

function getMyId() {
  let id = sessionStorage.getItem('btw_id');
  if (!id) {
    const name = HANDLES[Math.floor(Math.random() * HANDLES.length)];
    const code = Math.random().toString(36).slice(2, 5).toUpperCase();
    id = name + code;
    sessionStorage.setItem('btw_id', id);
  }
  return id;
}

// ── Passphrase generation ─────────────────────────────────────────────────
// EFF short wordlist #1 (1,296 words, CC BY 3.0, 'yo-yo' dropped because '-' is the separator).
// 4 words + 4 digits ≈ 2^54 combinations; short words so it can be read out over the phone.
const WORDS = [
  'acid','acorn','acre','acts','afar','affix','aged','agent','agile','aging','agony','ahead',
  'aide','aids','aim','ajar','alarm','alias','alibi','alien','alike','alive','aloe','aloft',
  'aloha','alone','amend','amino','ample','amuse','angel','anger','angle','ankle','apple','april',
  'apron','aqua','area','arena','argue','arise','armed','armor','army','aroma','array','arson',
  'art','ashen','ashes','atlas','atom','attic','audio','avert','avoid','awake','award','awoke',
  'axis','bacon','badge','bagel','baggy','baked','baker','balmy','banjo','barge','barn','bash',
  'basil','bask','batch','bath','baton','bats','blade','blank','blast','blaze','bleak','blend',
  'bless','blimp','blink','bloat','blob','blog','blot','blunt','blurt','blush','boast','boat',
  'body','boil','bok','bolt','boned','boney','bonus','bony','book','booth','boots','boss',
  'botch','both','boxer','breed','bribe','brick','bride','brim','bring','brink','brisk','broad',
  'broil','broke','brook','broom','brush','buck','bud','buggy','bulge','bulk','bully','bunch',
  'bunny','bunt','bush','bust','busy','buzz','cable','cache','cadet','cage','cake','calm',
  'cameo','canal','candy','cane','canon','cape','card','cargo','carol','carry','carve','case',
  'cash','cause','cedar','chain','chair','chant','chaos','charm','chase','cheek','cheer','chef',
  'chess','chest','chew','chief','chili','chill','chip','chomp','chop','chow','chuck','chump',
  'chunk','churn','chute','cider','cinch','city','civic','civil','clad','claim','clamp','clap',
  'clash','clasp','class','claw','clay','clean','clear','cleat','cleft','clerk','click','cling',
  'clink','clip','cloak','clock','clone','cloth','cloud','clump','coach','coast','coat','cod',
  'coil','coke','cola','cold','colt','coma','come','comic','comma','cone','cope','copy',
  'coral','cork','cost','cot','couch','cough','cover','cozy','craft','cramp','crane','crank',
  'crate','crave','crawl','crazy','creme','crepe','crept','crib','cried','crisp','crook','crop',
  'cross','crowd','crown','crumb','crush','crust','cub','cult','cupid','cure','curl','curry',
  'curse','curve','curvy','cushy','cut','cycle','dab','dad','daily','dairy','daisy','dance',
  'dandy','darn','dart','dash','data','date','dawn','deaf','deal','dean','debit','debt',
  'debug','decaf','decal','decay','deck','decor','decoy','deed','delay','denim','dense','dent',
  'depth','derby','desk','dial','diary','dice','dig','dill','dime','dimly','diner','dingy',
  'disco','dish','disk','ditch','ditzy','dizzy','dock','dodge','doing','doll','dome','donor',
  'donut','dose','dot','dove','down','dowry','doze','drab','drama','drank','draw','dress',
  'dried','drift','drill','drive','drone','droop','drove','drown','drum','dry','duck','duct',
  'dude','dug','duke','duo','dusk','dust','duty','dwarf','dwell','eagle','early','earth',
  'easel','east','eaten','eats','ebay','ebony','ebook','echo','edge','eel','eject','elbow',
  'elder','elf','elk','elm','elope','elude','elves','email','emit','empty','emu','enter',
  'entry','envoy','equal','erase','error','erupt','essay','etch','evade','even','evict','evil',
  'evoke','exact','exit','fable','faced','fact','fade','fall','false','fancy','fang','fax',
  'feast','feed','femur','fence','fend','ferry','fetal','fetch','fever','fiber','fifth','fifty',
  'film','filth','final','finch','fit','five','flag','flaky','flame','flap','flask','fled',
  'flick','fling','flint','flip','flirt','float','flock','flop','floss','flyer','foam','foe',
  'fog','foil','folic','folk','food','fool','found','fox','foyer','frail','frame','fray',
  'fresh','fried','frill','frisk','from','front','frost','froth','frown','froze','fruit','gag',
  'gains','gala','game','gap','gas','gave','gear','gecko','geek','gem','genre','gift',
  'gig','gills','given','giver','glad','glass','glide','gloss','glove','glow','glue','goal',
  'going','golf','gong','good','gooey','goofy','gore','gown','grab','grain','grant','grape',
  'graph','grasp','grass','grave','gravy','gray','green','greet','grew','grid','grief','grill',
  'grip','grit','groom','grope','growl','grub','grunt','guide','gulf','gulp','gummy','guru',
  'gush','gut','guy','habit','half','halo','halt','happy','harm','hash','hasty','hatch',
  'hate','haven','hazel','hazy','heap','heat','heave','hedge','hefty','help','herbs','hers',
  'hub','hug','hula','hull','human','humid','hump','hung','hunk','hunt','hurry','hurt',
  'hush','hut','ice','icing','icon','icy','igloo','image','ion','iron','islam','issue',
  'item','ivory','ivy','jab','jam','jaws','jazz','jeep','jelly','jet','jiffy','job',
  'jog','jolly','jolt','jot','joy','judge','juice','juicy','july','jumbo','jump','junky',
  'juror','jury','keep','keg','kept','kick','kilt','king','kite','kitty','kiwi','knee',
  'knelt','koala','kung','ladle','lady','lair','lake','lance','land','lapel','large','lash',
  'lasso','last','latch','late','lazy','left','legal','lemon','lend','lens','lent','level',
  'lever','lid','life','lift','lilac','lily','limb','limes','line','lint','lion','lip',
  'list','lived','liver','lunar','lunch','lung','lurch','lure','lurk','lying','lyric','mace',
  'maker','malt','mama','mango','manor','many','map','march','mardi','marry','mash','match',
  'mate','math','moan','mocha','moist','mold','mom','moody','mop','morse','most','motor',
  'motto','mount','mouse','mousy','mouth','move','movie','mower','mud','mug','mulch','mule',
  'mull','mumbo','mummy','mural','muse','music','musky','mute','nacho','nag','nail','name',
  'nanny','nap','navy','near','neat','neon','nerd','nest','net','next','niece','ninth',
  'nutty','oak','oasis','oat','ocean','oil','old','olive','omen','onion','only','ooze',
  'opal','open','opera','opt','otter','ouch','ounce','outer','oval','oven','owl','ozone',
  'pace','pagan','pager','palm','panda','panic','pants','panty','paper','park','party','pasta',
  'patch','path','patio','payer','pecan','penny','pep','perch','perky','perm','pest','petal',
  'petri','petty','photo','plank','plant','plaza','plead','plot','plow','pluck','plug','plus',
  'poach','pod','poem','poet','pogo','point','poise','poker','polar','polio','polka','polo',
  'pond','pony','poppy','pork','poser','pouch','pound','pout','power','prank','press','print',
  'prior','prism','prize','probe','prong','proof','props','prude','prune','pry','pug','pull',
  'pulp','pulse','puma','punch','punk','pupil','puppy','purr','purse','push','putt','quack',
  'quake','query','quiet','quill','quilt','quit','quota','quote','rabid','race','rack','radar',
  'radio','raft','rage','raid','rail','rake','rally','ramp','ranch','range','rank','rant',
  'rash','raven','reach','react','ream','rebel','recap','relax','relay','relic','remix','repay',
  'repel','reply','rerun','reset','rhyme','rice','rich','ride','rigid','rigor','rinse','riot',
  'ripen','rise','risk','ritzy','rival','river','roast','robe','robin','rock','rogue','roman',
  'romp','rope','rover','royal','ruby','rug','ruin','rule','runny','rush','rust','rut',
  'sadly','sage','said','saint','salad','salon','salsa','salt','same','sandy','santa','satin',
  'sauna','saved','savor','sax','say','scale','scam','scan','scare','scarf','scary','scoff',
  'scold','scoop','scoot','scope','score','scorn','scout','scowl','scrap','scrub','scuba','scuff',
  'sect','sedan','self','send','sepia','serve','set','seven','shack','shade','shady','shaft',
  'shaky','sham','shape','share','sharp','shed','sheep','sheet','shelf','shell','shine','shiny',
  'ship','shirt','shock','shop','shore','shout','shove','shown','showy','shred','shrug','shun',
  'shush','shut','shy','sift','silk','silly','silo','sip','siren','sixth','size','skate',
  'skew','skid','skier','skies','skip','skirt','skit','sky','slab','slack','slain','slam',
  'slang','slash','slate','slaw','sled','sleek','sleep','sleet','slept','slice','slick','slimy',
  'sling','slip','slit','slob','slot','slug','slum','slurp','slush','small','smash','smell',
  'smile','smirk','smog','snack','snap','snare','snarl','sneak','sneer','sniff','snore','snort',
  'snout','snowy','snub','snuff','speak','speed','spend','spent','spew','spied','spill','spiny',
  'spoil','spoke','spoof','spool','spoon','sport','spot','spout','spray','spree','spur','squad',
  'squat','squid','stack','staff','stage','stain','stall','stamp','stand','stank','stark','start',
  'stash','state','stays','steam','steep','stem','step','stew','stick','sting','stir','stock',
  'stole','stomp','stony','stood','stool','stoop','stop','storm','stout','stove','straw','stray',
  'strut','stuck','stud','stuff','stump','stung','stunt','suds','sugar','sulk','surf','sushi',
  'swab','swan','swarm','sway','swear','sweat','sweep','swell','swept','swim','swing','swipe',
  'swirl','swoop','swore','syrup','tacky','taco','tag','take','tall','talon','tamer','tank',
  'taper','taps','tarot','tart','task','taste','tasty','taunt','thank','thaw','theft','theme',
  'thigh','thing','think','thong','thorn','those','throb','thud','thumb','thump','thus','tiara',
  'tidal','tidy','tiger','tile','tilt','tint','tiny','trace','track','trade','train','trait',
  'trap','trash','tray','treat','tree','trek','trend','trial','tribe','trick','trio','trout',
  'truce','truck','trump','trunk','try','tug','tulip','tummy','turf','tusk','tutor','tutu',
  'tux','tweak','tweet','twice','twine','twins','twirl','twist','uncle','uncut','undo','unify',
  'union','unit','untie','upon','upper','urban','used','user','usher','utter','value','vapor',
  'vegan','venue','verse','vest','veto','vice','video','view','viral','virus','visa','visor',
  'vixen','vocal','voice','void','volt','voter','vowel','wad','wafer','wager','wages','wagon',
  'wake','walk','wand','wasp','watch','water','wavy','wheat','whiff','whole','whoop','wick',
  'widen','widow','width','wife','wifi','wilt','wimp','wind','wing','wink','wipe','wired',
  'wiry','wise','wish','wispy','wok','wolf','womb','wool','woozy','word','work','worry',
  'wound','woven','wrath','wreck','wrist','xerox','yahoo','yam','yard','year','yeast','yelp',
  'yield','yodel','yoga','yoyo','yummy','zebra','zero','zesty','zippy','zone','zoom'
];

function randBelow(n) {
  // Rejection sampling over a 32-bit CSPRNG draw, so there is no modulo bias.
  const limit = Math.floor(0x100000000 / n) * n;
  const buf = new Uint32Array(1);
  let x;
  do { crypto.getRandomValues(buf); x = buf[0]; } while (x >= limit);
  return x % n;
}

function genPassphrase() {
  const pick = () => WORDS[randBelow(WORDS.length)];
  const num  = String(randBelow(9000) + 1000);
  return `${pick()}-${pick()}-${pick()}-${pick()}-${num}`;
}

// ── AES-GCM encryption (Web Crypto, no library) ──────────────────────────

async function deriveKey(passphrase, salt) {
  const raw = await crypto.subtle.importKey(
    'raw', new TextEncoder().encode(passphrase),
    'PBKDF2', false, ['deriveKey']
  );
  return crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt, iterations: 100000, hash: 'SHA-256' },
    raw,
    { name: 'AES-GCM', length: 256 },
    false, ['encrypt', 'decrypt']
  );
}

async function encryptText(text, passphrase) {
  const salt      = crypto.getRandomValues(new Uint8Array(16));
  const iv        = crypto.getRandomValues(new Uint8Array(12));
  const key       = await deriveKey(passphrase, salt);
  const encrypted = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv }, key, new TextEncoder().encode(text)
  );
  // Pack: salt(16) + iv(12) + ciphertext
  const out = new Uint8Array(16 + 12 + encrypted.byteLength);
  out.set(salt, 0);
  out.set(iv, 16);
  out.set(new Uint8Array(encrypted), 28);
  return toB64(out);
}

async function decryptText(encoded, passphrase) {
  const buf  = fromB64(encoded);
  const salt = buf.slice(0, 16);
  const iv   = buf.slice(16, 28);
  const data = buf.slice(28);
  const key  = await deriveKey(passphrase, salt);
  const dec  = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, data);
  return new TextDecoder().decode(dec);
}

// ── Compression ───────────────────────────────────────────────────────────

async function compress(str) {
  const bytes = new TextEncoder().encode(str);
  if (window.CompressionStream) {
    const cs = new CompressionStream('deflate-raw');
    const w  = cs.writable.getWriter();
    w.write(bytes); w.close();
    const chunks = [];
    const r = cs.readable.getReader();
    while (true) { const { done, value } = await r.read(); if (done) break; chunks.push(value); }
    let len = 0; for (const c of chunks) len += c.length;
    const out = new Uint8Array(len); let off = 0;
    for (const c of chunks) { out.set(c, off); off += c.length; }
    return toB64(out);
  }
  return toB64(bytes);
}

async function decompress(str) {
  const bytes = fromB64(str);
  if (window.DecompressionStream) {
    try {
      const ds = new DecompressionStream('deflate-raw');
      const w  = ds.writable.getWriter();
      w.write(bytes); w.close();
      const chunks = [];
      const r = ds.readable.getReader();
      while (true) { const { done, value } = await r.read(); if (done) break; chunks.push(value); }
      let len = 0; for (const c of chunks) len += c.length;
      const out = new Uint8Array(len); let off = 0;
      for (const c of chunks) { out.set(c, off); off += c.length; }
      return new TextDecoder().decode(out);
    } catch (_) {}
  }
  return new TextDecoder().decode(bytes);
}

function toB64(bytes) {
  let bin = '';
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  return btoa(bin).replace(/\+/g,'-').replace(/\//g,'_').replace(/=/g,'');
}

function fromB64(str) {
  const b64 = str.replace(/-/g,'+').replace(/_/g,'/');
  const bin = atob(b64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

// ── UI state machine ──────────────────────────────────────────────────────

function showState(state) {
  ['hs-loading','hs-offering','hs-passphrase','hs-answering','hs-expired',
   'handshake','messages','composer'].forEach(id => {
    document.getElementById(id).classList.add('hidden');
  });

  if (state === 'chat') {
    document.getElementById('messages').classList.remove('hidden');
    document.getElementById('composer').classList.remove('hidden');
    document.getElementById('msg-input').focus();
  } else if (state === 'history') {
    document.getElementById('messages').classList.remove('hidden');
    // composer stays hidden, read-only view of previous session
  } else {
    document.getElementById('handshake').classList.remove('hidden');
    const map = { loading:'hs-loading', offering:'hs-offering',
                  passphrase:'hs-passphrase', answering:'hs-answering', expired:'hs-expired' };
    if (map[state]) document.getElementById(map[state]).classList.remove('hidden');
  }
}

function setStatus(text) {
  document.getElementById('status-label').textContent = text;
}

// ── ICE gathering ─────────────────────────────────────────────────────────

function waitForICE(conn) {
  return new Promise(resolve => {
    if (conn.iceGatheringState === 'complete') { resolve(); return; }
    const t = setTimeout(resolve, 6000);
    conn.addEventListener('icegatheringstatechange', function h() {
      if (conn.iceGatheringState === 'complete') {
        clearTimeout(t);
        conn.removeEventListener('icegatheringstatechange', h);
        resolve();
      }
    });
  });
}

// ── Peer status ───────────────────────────────────────────────────────────

let peerName      = 'Other person';
let activityTimer = null;

function setPeerStatus(state) {
  const bar  = document.getElementById('peer-status');
  const dot  = document.getElementById('peer-dot');
  const text = document.getElementById('peer-status-text');

  dot.className = 'peer-dot ' + state;

  const labels = {
    connecting:   'Connecting…',
    active:       peerName + ' is active',
    idle:         peerName + ' has been idle for a minute',
    away:         peerName + '\'s tab is in the background',
    disconnected: peerName + ' disconnected'
  };

  text.textContent = labels[state] || state;
  bar.classList.remove('hidden');
}

function sendStatus(s) {
  if (dc && dc.readyState === 'open') {
    dc.send(JSON.stringify({ type: 'status', s, u: myId }));
  }
}

function startActivityTracking() {
  // Track local visibility → tell peer when we go away/come back
  document.addEventListener('visibilitychange', () => {
    sendStatus(document.hidden ? 'away' : 'active');
  });

  // Track mouse/keyboard, if silent for 60s, tell peer we're idle
  const onActivity = () => {
    sendStatus('active');
    clearTimeout(activityTimer);
    activityTimer = setTimeout(() => sendStatus('idle'), 60000);
  };

  document.addEventListener('mousemove',  onActivity, { passive: true });
  document.addEventListener('keydown',    onActivity, { passive: true });
  document.addEventListener('touchstart', onActivity, { passive: true });

  // Kick off the first idle timer
  activityTimer = setTimeout(() => sendStatus('idle'), 60000);
}

// ── Session verification (SAS, short authentication string) ─────────────

function genNonce() {
  return Array.from(crypto.getRandomValues(new Uint8Array(8)))
    .map(b => b.toString(16).padStart(2, '0')).join('');
}

function dtlsFingerprint(desc) {
  const m = desc && desc.sdp && desc.sdp.match(/a=fingerprint:sha-256 ([0-9A-F:]+)/i);
  return m ? m[1].toUpperCase() : '';
}

async function computeSessionCode(a, b) {
  // Bind the code to both DTLS certificate fingerprints so a relaying
  // man-in-the-middle (who terminates DTLS on each side) produces a mismatch.
  // The nonces alone would be forwarded unchanged by such an attacker.
  const [n1, n2] = [a, b].sort();
  const fps = [dtlsFingerprint(pc && pc.localDescription), dtlsFingerprint(pc && pc.remoteDescription)].sort();
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(fps.join('|') + '|' + n1 + n2));
  return Array.from(new Uint8Array(buf)).slice(0, 6)
    .map(b => b.toString(16).padStart(2, '0').toUpperCase())
    .join('·'); // middle-dot separator
}

function showSessionCode(code) {
  const el  = document.getElementById('session-code');
  const val = document.getElementById('session-code-val');
  const sep = document.getElementById('session-sep');
  if (!el) return;
  if (val) val.textContent = '🔐 ' + code;
  el.classList.remove('hidden');
  if (sep) sep.classList.remove('hidden');
}

// ── QR Code for offer URL (lazy-loaded on first button click) ────────────

let _qrUrl = null;

function renderOfferQR(url) {
  _qrUrl = url; // stored; library loads only when the button is tapped
}

function _doRenderQR() {
  if (!_qrUrl) return;
  try {
    var qr = qrcode(0, 'M');
    qr.addData(_qrUrl, 'Byte');
    qr.make();
    var svg = qr.createSvgTag({ scalable: true, margin: 2 });
    document.getElementById('offer-qr').innerHTML = svg;
  } catch (_) {
    var btn = document.getElementById('qr-toggle');
    if (btn) btn.style.display = 'none';
  }
}

// ── System messages ──────────────────────────────────────────────────────

function systemMsg(text) {
  messages.push({ type: 'system', m: text, t: Date.now() });
  render();
  saveMessages();
}

// ── Typing indicator ─────────────────────────────────────────────────────

function showTyping() {
  const el = document.getElementById('typing-indicator');
  const nm = document.getElementById('typing-name');
  if (!el) return;
  if (nm) nm.textContent = peerName;
  el.classList.remove('hidden');
}

function hideTyping() {
  const el = document.getElementById('typing-indicator');
  if (el) el.classList.add('hidden');
  clearTimeout(peerTypingTimer);
}

function sendTyping() {
  if (!dc || dc.readyState !== 'open') return;
  const now = Date.now();
  if (now - lastTypingSent < 2000) return;  // throttle to once per 2s
  lastTypingSent = now;
  dc.send(JSON.stringify({ type: 'typing', u: myId }));
}

// ── DataChannel ───────────────────────────────────────────────────────────

function setupChannel(channel) {
  dc = channel;
  dc.addEventListener('open', () => {
    chatStarted = true;
    clearHistory();
    setStatus('🔒 Connected');
    showState('chat');
    systemMsg('🔒 Chat started, end-to-end encrypted. Refreshing or closing this tab ends the session permanently.');
    toast('Connected, fully encrypted');
    setPeerStatus('connecting');
    startActivityTracking();
    sendStatus('active');
    // Exchange nonces to compute a session verification code
    localNonce = genNonce();
    dc.send(JSON.stringify({ type: 'verify', nonce: localNonce }));
    // Passphrase no longer needed once the DataChannel is open
    sessionStorage.removeItem('btw_pass');
    // Notify peer when the tab is actually closed or navigated away
    window.addEventListener('beforeunload', () => {
      try { dc.send(JSON.stringify({ type: 'bye', u: myId })); } catch (_) {}
    });
  });
  dc.addEventListener('message', e => {
    const data = JSON.parse(e.data);
    if (data.type === 'verify') {
      remoteNonce = data.nonce;
      if (localNonce) {
        computeSessionCode(localNonce, remoteNonce).then(showSessionCode);
      }
    } else if (data.type === 'bye') {
      const who = data.u ? escHtml(data.u) : 'Other person';
      hideTyping();
      peerLeft = true;
      systemMsg(who + ' left the chat');
      setStatus('Disconnected');
      setPeerStatus('disconnected');
    } else if (data.type === 'typing') {
      if (data.u) peerName = data.u;
      showTyping();
      clearTimeout(peerTypingTimer);
      peerTypingTimer = setTimeout(hideTyping, 3000);
    } else if (data.type === 'status') {
      if (data.u) peerName = data.u;
      setPeerStatus(data.s);
    } else {
      if (data.u) peerName = data.u;
      hideTyping();
      messages.push(data);
      render();
      saveMessages();
    }
  });
  dc.addEventListener('close', () => {
    if (!peerLeft) systemMsg('Other person left the chat');
    peerLeft = false;
    setStatus('Disconnected');
    setPeerStatus('disconnected');
  });
}

// ── User A: create + encrypt offer ────────────────────────────────────────

async function initOffer() {
  showState('loading');
  setStatus('Setting up…');

  const passphrase = genPassphrase();
  sessionStorage.setItem('btw_pass', passphrase);

  pc = new RTCPeerConnection({ iceServers: ICE_SERVERS });
  pc.addEventListener('connectionstatechange', onConnState);
  setupChannel(pc.createDataChannel('chat'));

  await pc.setLocalDescription(await pc.createOffer());
  await waitForICE(pc);

  // Compress then encrypt the SDP
  const compressed = await compress(JSON.stringify(pc.localDescription));
  offerEncrypted   = await encryptText(compressed, passphrase);

  const ms  = parseInt(document.getElementById('expiry-select').value);
  const exp = ms > 0 ? Date.now() + ms : 0;
  let url   = location.origin + location.pathname + '#offer=' + offerEncrypted;
  if (exp) url += '&exp=' + exp;
  document.getElementById('offer-url').value = url;
  document.getElementById('passphrase-display').textContent = passphrase;
  renderOfferQR(url);

  setStatus('Waiting for reply');
  showState('offering');

  // Auto-copy invite link
  copyText(url, false);
  toast('Invite link copied, share it, then send the passphrase separately');
}

// ── User B: show passphrase entry ─────────────────────────────────────────

function promptPassphrase(offerEncrypted) {
  pendingOfferEncrypted = offerEncrypted;
  setStatus('Enter passphrase');
  showState('passphrase');
  document.getElementById('passphrase-input').focus();
}

async function unlockOffer() {
  const passphrase = document.getElementById('passphrase-input').value.trim();
  const errEl      = document.getElementById('passphrase-error');
  errEl.classList.add('hidden');

  if (!passphrase) return;

  showState('loading');
  setStatus('Decrypting…');

  try {
    const compressed = await decryptText(pendingOfferEncrypted, passphrase);
    sessionStorage.setItem('btw_pass', passphrase);
    await buildAnswer(compressed);
  } catch (_) {
    // AES-GCM auth tag failure = wrong passphrase
    showState('passphrase');
    setStatus('Enter passphrase');
    errEl.classList.remove('hidden');
    document.getElementById('passphrase-input').focus();
  }
}

// ── User B: create + encrypt answer ──────────────────────────────────────

async function buildAnswer(compressedOffer) {
  showState('loading');
  setStatus('Preparing reply…');

  const passphrase = sessionStorage.getItem('btw_pass');

  pc = new RTCPeerConnection({ iceServers: ICE_SERVERS });
  pc.addEventListener('connectionstatechange', onConnState);
  pc.addEventListener('datachannel', e => setupChannel(e.channel));

  const offer = JSON.parse(await decompress(compressedOffer));
  await pc.setRemoteDescription(new RTCSessionDescription(offer));
  await pc.setLocalDescription(await pc.createAnswer());
  await waitForICE(pc);

  const compressed = await compress(JSON.stringify(pc.localDescription));
  const encrypted  = await encryptText(compressed, passphrase);

  const url = location.origin + location.pathname + '#answer=' + encrypted;
  document.getElementById('answer-url').value = url;

  setStatus('Waiting for connection');
  showState('answering');

  copyText(url, false);
  toast('Reply link copied, send it back to them');
}

// ── User A: decrypt answer + complete connection ──────────────────────────

async function completeConnection() {
  const raw = document.getElementById('answer-paste').value.trim();
  if (!raw) return;

  let encoded = raw;
  if (raw.includes('#answer=')) encoded = raw.split('#answer=')[1];
  else if (raw.includes('answer=')) encoded = raw.split('answer=')[1];
  encoded = encoded.split('&')[0];

  showState('loading');
  setStatus('Connecting…');

  try {
    const passphrase = sessionStorage.getItem('btw_pass');
    const compressed = await decryptText(encoded, passphrase);
    const answer     = JSON.parse(await decompress(compressed));
    await pc.setRemoteDescription(new RTCSessionDescription(answer));
    // DataChannel 'open' fires → transitions to chat
  } catch (_) {
    showState('offering');
    setStatus('Waiting for reply');
    toast('Invalid or tampered link, try again');
  }
}

function onConnState() {
  if (pc.connectionState === 'failed') {
    if (chatStarted) {
      if (!peerLeft) {
        setStatus('Disconnected');
        setPeerStatus('disconnected');
        systemMsg('Connection lost, start a new chat to reconnect');
      }
    } else {
      setStatus('Connection failed');
      systemMsg('Could not connect, check your network and try a new chat');
    }
    chatStarted = false;
  }
}

// ── Send message ──────────────────────────────────────────────────────────

function sendMessage() {
  const input = document.getElementById('msg-input');
  const text  = input.value.trim();
  if (!text || !dc || dc.readyState !== 'open') return;

  const msg = { type: 'msg', u: myId, m: text, t: Date.now() };
  messages.push(msg);
  dc.send(JSON.stringify(msg));
  input.value = '';
  render();
  saveMessages();
}

// ── Render ────────────────────────────────────────────────────────────────

function render() {
  const el     = document.getElementById('messages');
  const banner = historyMode
    ? '<div class="history-banner">Previous session, read only. Start a new chat to reconnect.</div>'
    : '';
  if (!messages.length) {
    el.innerHTML = banner + '<div class="empty-state"><div class="icon">🔒</div><p>Connected &amp; encrypted.<br>Say hello.</p></div>';
    return;
  }
  el.innerHTML = banner + messages.map(msg => {
    if (msg.type === 'system') {
      return `<div class="msg-system">${escHtml(msg.m)} · ${fmtTime(msg.t)}</div>`;
    }
    const own = msg.u === myId;
    return `<div class="msg ${own ? 'own' : 'them'}">
      ${!own ? `<span class="msg-name">${escHtml(msg.u)}</span>` : ''}
      <div class="msg-bubble">${escHtml(msg.m)}<span class="msg-time">${fmtTime(msg.t)}</span></div>
    </div>`;
  }).join('');
  el.scrollTop = el.scrollHeight;
}

// ── Toast ─────────────────────────────────────────────────────────────────

let toastTimer;
function toast(text) {
  const el = document.getElementById('toast');
  el.textContent = text;
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), 3500);
}

// ── Copy ──────────────────────────────────────────────────────────────────

async function copyText(text, notify = true) {
  try {
    await navigator.clipboard.writeText(text);
    if (notify) toast('Copied!');
  } catch (_) {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.cssText = 'position:fixed;opacity:0';
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
    if (notify) toast('Copied!');
  }
}

// ── Utilities ─────────────────────────────────────────────────────────────

function escHtml(s) {
  return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function fmtTime(ts) {
  const d = new Date(ts);
  return d.getHours().toString().padStart(2,'0') + ':' + d.getMinutes().toString().padStart(2,'0');
}

// ── Init ──────────────────────────────────────────────────────────────────

async function init() {
  myId = getMyId();
  document.getElementById('my-id-label').textContent = myId;

  const params        = new URLSearchParams(location.hash.slice(1));
  const offerEncoded  = params.get('offer');
  const expParam      = params.get('exp');

  history.replaceState(null, '', location.pathname);

  // Wire buttons
  document.getElementById('new-chat-btn').addEventListener('click', () => { clearHistory(); location.href = 'chat.html'; });
  document.getElementById('copy-offer').addEventListener('click', () => copyText(document.getElementById('offer-url').value));
  document.getElementById('qr-toggle').addEventListener('click', function () {
    const wrap = document.getElementById('offer-qr-wrap');
    const btn  = this;

    if (!window.qrcode) {
      // First tap: pull in the 55 KB library, render, then reveal
      const s = document.createElement('script');
      s.src = 'js/qr.js';
      s.onload = () => {
        _doRenderQR();
        wrap.classList.remove('hidden');
        btn.setAttribute('aria-expanded', 'true');
        btn.textContent = 'Hide QR';
      };
      s.onerror = () => { btn.style.display = 'none'; };
      document.head.appendChild(s);
      return;
    }

    const nowHidden = wrap.classList.toggle('hidden');
    btn.setAttribute('aria-expanded', nowHidden ? 'false' : 'true');
    btn.textContent = nowHidden ? 'QR' : 'Hide QR';
  });
  document.getElementById('copy-passphrase').addEventListener('click', () => copyText(document.getElementById('passphrase-display').textContent));
  document.getElementById('copy-answer').addEventListener('click', () => copyText(document.getElementById('answer-url').value));
  document.getElementById('connect-btn').addEventListener('click', completeConnection);
  document.getElementById('answer-paste').addEventListener('keydown', e => { if (e.key === 'Enter') completeConnection(); });
  document.getElementById('unlock-btn').addEventListener('click', unlockOffer);
  document.getElementById('passphrase-input').addEventListener('keydown', e => { if (e.key === 'Enter') unlockOffer(); });
  document.getElementById('send-btn').addEventListener('click', sendMessage);
  document.getElementById('msg-input').addEventListener('keydown', e => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); return; }
    sendTyping();
  });
  document.getElementById('expiry-select').addEventListener('change', () => {
    if (!offerEncrypted) return;
    const ms  = parseInt(document.getElementById('expiry-select').value);
    const exp = ms > 0 ? Date.now() + ms : 0;
    let url   = location.origin + location.pathname + '#offer=' + offerEncrypted;
    if (exp) url += '&exp=' + exp;
    document.getElementById('offer-url').value = url;
    renderOfferQR(url);
    copyText(url, false);
    toast('Link updated, share the new one');
  });

  if (offerEncoded) {
    clearHistory();
    if (expParam && Date.now() > parseInt(expParam)) {
      setStatus('Link expired');
      showState('expired');
      return;
    }
    promptPassphrase(offerEncoded);  // User B
  } else {
    const saved = loadSavedMessages();
    if (saved) {
      messages    = saved.msgs;
      peerName    = saved.peer || 'Other person';
      myId        = saved.id   || myId;
      historyMode = true;
      document.getElementById('my-id-label').textContent = myId;
      setStatus('Previous session');
      showState('history');
      render();
      toast('Previous session restored, tap "New chat" to reconnect');
    } else {
      await initOffer();             // User A, fresh start
    }
  }
}

init();
