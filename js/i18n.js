const I18N = {
  en: {
    // ── Home ──────────────────────────────────────────────────────────────
    home_tagline:      'Anonymous encrypted chat via a link.<br>No account. No server. No history.',
    home_new_chat:     'Start a new chat',
    home_divider:      'or join an existing one',
    home_join_ph:      'Paste a chat link…',
    home_join_btn:     'Join',
    home_join_error:   'Paste the full invite link someone shared with you.',
    home_how_anchor:   'How does this work? ↓',
    home_install_text: 'Add Btwinus to your home screen',
    home_install_btn:  'Install',
    home_install_ios:  'Tap <strong>Share ↑</strong> then <strong>Add to Home Screen</strong>',

    // ── Security strip ────────────────────────────────────────────────────
    sec_eyebrow:    '🛡 Encryption standard',
    sec_title:      'We put military-grade encryption<br>in a browser link. No app. No account. No server.',
    sec_sub:        'Until now, this level of encryption required apps, accounts, and trust in a company. Signal needs your phone number. PGP needs software. Enterprise tools need registration. Btwinus puts AES-256 end-to-end encryption directly in a shareable link — anyone can use it, nothing is stored, and no one is in between.',
    spec_cipher:    'Cipher',
    spec_key_deriv: 'Key derivation',
    spec_transport: 'Transport',
    spec_arch:      'Architecture',
    spec_relay:     'No relay server',

    // ── Demo ──────────────────────────────────────────────────────────────
    demo_eyebrow: 'Live demo',
    demo_heading: 'Watch it happen in real time',
    demo_sub:     'Alice and Gradi K. starting a private chat — no accounts, no setup',

    // ── How it works ──────────────────────────────────────────────────────
    how_title:   'How it works',
    how_1_title: 'Start a chat',
    how_1_body:  'Click "Start a new chat". You instantly get two things: an <strong>encrypted invite link</strong> and a <strong>passphrase</strong>.',
    how_2_title: 'Share them separately',
    how_2_body:  'Send the <strong>link</strong> via WhatsApp, email, or any app. Send the <strong>passphrase</strong> a different way — a phone call, SMS, or say it in person. Keeping them apart means nobody can intercept both.',
    how_3_title: 'They open the link &amp; reply',
    how_3_body:  'The other person opens your link, types the passphrase, and gets a <strong>reply link</strong> that is automatically copied. They send it back to you.',
    how_4_title: 'Paste &amp; you\'re connected',
    how_4_body:  'Paste their reply link — you\'re instantly connected. Everything is <strong>end-to-end encrypted</strong>. No accounts, no servers, no history. Gone when you close the tab.',

    // ── Use cases ─────────────────────────────────────────────────────────
    usecases_title:        'Who uses Btwinus',
    uc_journalists_title:  'Journalists &amp; sources',
    uc_journalists_body:   'Receive anonymous tips and communicate with whistleblowers without leaving a server trail. Nothing is stored — not even metadata.',
    uc_lawyers_title:      'Lawyers &amp; clients',
    uc_lawyers_body:       'Privileged conversations that disappear on close. No law firm server, no cloud provider — just a direct encrypted connection.',
    uc_negotiations_title: 'Secure negotiations',
    uc_negotiations_body:  'Discuss sensitive terms anonymously — salary, deals, disputes — with no transcript and no identity required.',
    uc_feedback_title:     'Anonymous feedback',
    uc_feedback_body:      'Employees, students, or customers send honest feedback without worrying about identity. No account means no trace.',
    uc_passwords_title:    'Sending passwords &amp; secrets',
    uc_passwords_body:     'Share a password, API key, or crypto seed phrase once — directly browser-to-browser. Far safer than email, Slack, or WhatsApp.',
    uc_support_title:      'Private one-on-one support',
    uc_support_body:       'Crisis lines, peer support, therapy pre-sessions — temporary secure chat that leaves no history behind.',

    // ── Chat page ─────────────────────────────────────────────────────────
    chat_new_chat:    'New chat',
    hs_loading_text:  'Setting up connection…',

    hs_step1_label:   'Send this encrypted link to the other person',
    hs_step1_tip:     'Safe to share publicly — it\'s encrypted. They still need the passphrase to use it.',
    hs_copy:          'Copy',
    hs_qr:            'QR',
    hs_qr_hint:       'Scan with your phone\'s camera — no copy/paste needed',
    hs_expiry_label:  'Link expires:',
    expiry_1h:        'in 1 hour',
    expiry_6h:        'in 6 hours',
    expiry_24h:       'in 24 hours',
    expiry_never:     'never',

    hs_step2_label:   'Send this passphrase via a <strong>different channel</strong> — SMS, voice, in person',
    hs_step2_tip:     'If someone intercepts the link, they still can\'t connect without this passphrase. Two channels = two locks.',

    hs_step3_label:   'Paste the link they send back',
    hs_step3_tip:     'After they enter the passphrase, they\'ll get a reply link that\'s auto-copied. Ask them to send it to you here.',
    hs_answer_ph:     'Paste their reply link…',
    hs_connect:       'Connect',

    hs_pass_title:    'Enter the passphrase',
    hs_pass_label:    'The person who invited you should have sent it via a separate channel',
    hs_pass_ph:       'e.g. storm-fox-river-4821',
    hs_unlock:        'Unlock',
    hs_pass_error:    'Wrong passphrase — try again',

    hs_answer_label:  'Send this encrypted link back to the person who invited you',
    hs_waiting:       'Waiting for them to connect…',

    hs_expired_title: 'This link has expired',
    hs_expired_label: 'Ask the person to start a new chat and send you a fresh link.',

    session_tip:      'Both of you should see the same code. If it matches, your chat is private and no one is in between.',
    typing_text:      ' is typing…',
    msg_ph:           'Message…',

    footer_encrypted:  '🔒 Encrypted',
    footer_no_servers: 'No servers',
    footer_disappears: 'Disappears on close',
    footer_anonymous:  'Anonymous',
  },

  fr: {
    // ── Home ──────────────────────────────────────────────────────────────
    home_tagline:      'Chat anonyme et chiffré via un lien.<br>Sans compte. Sans serveur. Sans historique.',
    home_new_chat:     'Démarrer une conversation',
    home_divider:      'ou rejoindre une conversation existante',
    home_join_ph:      'Collez un lien d\'invitation…',
    home_join_btn:     'Rejoindre',
    home_join_error:   'Collez le lien complet partagé par votre contact.',
    home_how_anchor:   'Comment ça marche ? ↓',
    home_install_text: 'Ajouter Btwinus à l\'écran d\'accueil',
    home_install_btn:  'Installer',
    home_install_ios:  'Appuyez sur <strong>Partager ↑</strong> puis <strong>Sur l\'écran d\'accueil</strong>',

    // ── Security strip ────────────────────────────────────────────────────
    sec_eyebrow:    '🛡 Standard de chiffrement',
    sec_title:      'Nous avons mis le chiffrement militaire<br>dans un lien. Sans appli. Sans compte. Sans serveur.',
    sec_sub:        'Jusqu\'ici, ce niveau de chiffrement nécessitait des applications, des comptes et de la confiance envers une entreprise. Signal demande votre numéro. PGP demande un logiciel. Btwinus met le chiffrement AES-256 directement dans un lien partageable — accessible à tous, rien n\'est stocké, personne n\'est au milieu.',
    spec_cipher:    'Chiffrement',
    spec_key_deriv: 'Dérivation de clé',
    spec_transport: 'Transport',
    spec_arch:      'Architecture',
    spec_relay:     'Sans serveur relais',

    // ── Demo ──────────────────────────────────────────────────────────────
    demo_eyebrow: 'Démo en direct',
    demo_heading: 'Regardez en temps réel',
    demo_sub:     'Alice et Gradi K. démarrent une conversation privée — sans compte, sans installation',

    // ── How it works ──────────────────────────────────────────────────────
    how_title:   'Comment ça marche',
    how_1_title: 'Démarrer une conversation',
    how_1_body:  'Cliquez sur "Démarrer une conversation". Vous obtenez instantanément deux choses : un <strong>lien d\'invitation chiffré</strong> et une <strong>phrase de passe</strong>.',
    how_2_title: 'Partagez-les séparément',
    how_2_body:  'Envoyez le <strong>lien</strong> via WhatsApp, email ou toute autre appli. Envoyez la <strong>phrase de passe</strong> autrement — appel, SMS ou en personne. Les séparer empêche toute interception.',
    how_3_title: 'Ils ouvrent le lien &amp; répondent',
    how_3_body:  'L\'autre personne ouvre votre lien, saisit la phrase de passe et reçoit un <strong>lien de réponse</strong> copié automatiquement. Elle vous le renvoie.',
    how_4_title: 'Collez &amp; vous êtes connectés',
    how_4_body:  'Collez leur lien de réponse — vous êtes instantanément connectés. Tout est <strong>chiffré de bout en bout</strong>. Sans compte, sans serveur, sans historique.',

    // ── Use cases ─────────────────────────────────────────────────────────
    usecases_title:        'Qui utilise Btwinus',
    uc_journalists_title:  'Journalistes &amp; sources',
    uc_journalists_body:   'Recevez des informations anonymes et communiquez avec des lanceurs d\'alerte sans laisser de trace. Rien n\'est stocké — pas même les métadonnées.',
    uc_lawyers_title:      'Avocats &amp; clients',
    uc_lawyers_body:       'Conversations confidentielles qui disparaissent à la fermeture. Pas de serveur du cabinet, pas de cloud — une connexion directe chiffrée.',
    uc_negotiations_title: 'Négociations sécurisées',
    uc_negotiations_body:  'Discutez de termes sensibles anonymement — salaire, accords, litiges — sans transcript et sans identité requise.',
    uc_feedback_title:     'Feedback anonyme',
    uc_feedback_body:      'Employés, étudiants ou clients donnent un avis honnête sans crainte d\'être identifiés. Sans compte, sans trace.',
    uc_passwords_title:    'Envoi de mots de passe &amp; secrets',
    uc_passwords_body:     'Partagez un mot de passe, une clé API ou une phrase mnémotechnique une seule fois — de navigateur à navigateur. Bien plus sûr que l\'email, Slack ou WhatsApp.',
    uc_support_title:      'Soutien individuel privé',
    uc_support_body:       'Lignes de crise, soutien entre pairs, pré-séances thérapeutiques — chat temporaire et sécurisé sans aucun historique.',

    // ── Chat page ─────────────────────────────────────────────────────────
    chat_new_chat:    'Nouvelle conversation',
    hs_loading_text:  'Configuration de la connexion…',

    hs_step1_label:   'Envoyez ce lien chiffré à l\'autre personne',
    hs_step1_tip:     'Peut être partagé publiquement — il est chiffré. L\'autre personne a encore besoin de la phrase de passe.',
    hs_copy:          'Copier',
    hs_qr:            'QR',
    hs_qr_hint:       'Scannez avec l\'appareil photo de votre téléphone — pas besoin de copier/coller',
    hs_expiry_label:  'Le lien expire :',
    expiry_1h:        'dans 1 heure',
    expiry_6h:        'dans 6 heures',
    expiry_24h:       'dans 24 heures',
    expiry_never:     'jamais',

    hs_step2_label:   'Envoyez cette phrase de passe via un <strong>canal différent</strong> — SMS, appel, en personne',
    hs_step2_tip:     'Si quelqu\'un intercepte le lien, il ne peut toujours pas se connecter sans la phrase de passe. Deux canaux = deux verrous.',

    hs_step3_label:   'Collez le lien qu\'ils vous renvoient',
    hs_step3_tip:     'Après avoir saisi la phrase de passe, ils recevront un lien de réponse copié automatiquement. Demandez-leur de vous l\'envoyer.',
    hs_answer_ph:     'Collez leur lien de réponse…',
    hs_connect:       'Connecter',

    hs_pass_title:    'Entrez la phrase de passe',
    hs_pass_label:    'La personne qui vous a invité devrait vous l\'avoir envoyée via un canal séparé',
    hs_pass_ph:       'ex. tempête-renard-rivière-4821',
    hs_unlock:        'Déverrouiller',
    hs_pass_error:    'Phrase de passe incorrecte — réessayez',

    hs_answer_label:  'Renvoyez ce lien chiffré à la personne qui vous a invité',
    hs_waiting:       'En attente de leur connexion…',

    hs_expired_title: 'Ce lien a expiré',
    hs_expired_label: 'Demandez à la personne de démarrer une nouvelle conversation et de vous envoyer un nouveau lien.',

    session_tip:      'Vous devriez tous les deux voir le même code. S\'il correspond, votre chat est privé et personne n\'est au milieu.',
    typing_text:      ' est en train d\'écrire…',
    msg_ph:           'Message…',

    footer_encrypted:  '🔒 Chiffré',
    footer_no_servers: 'Sans serveur',
    footer_disappears: 'Disparaît à la fermeture',
    footer_anonymous:  'Anonyme',
  },

  ln: {
    // ── Home ──────────────────────────────────────────────────────────────
    home_tagline:      'Lisolo ya bonkundi mpe ekangami na nzela ya lien.<br>Konti te. Sɛrvɛr te. Istware te.',
    home_new_chat:     'Banda lisolo ya sika',
    home_divider:      'to kɔta na lisolo oyo ezali',
    home_join_ph:      'Tia lien ya lisolo awa…',
    home_join_btn:     'Kɔta',
    home_join_error:   'Tia lien mobimba oyo moto apesi yo.',
    home_how_anchor:   'Esalemaka ndenge nini? ↓',
    home_install_text: 'Bakisa Btwinus na ekran ya yo',
    home_install_btn:  'Tia',
    home_install_ios:  'Fina <strong>Partage ↑</strong> sima <strong>Bakisa na ekran</strong>',

    // ── Security strip ────────────────────────────────────────────────────
    sec_eyebrow:    '🛡 Mibeko ya bokangami',
    sec_title:      'Tozali kotia bokangami ya mampinga<br>na kati ya lien. Aplikasyo te. Konti te. Sɛrvɛr te.',
    sec_sub:        'Tii lelo, bokangami ya boye esengaki aplikasyo, konti, mpe kotyela kompani motema. Signal esɛngaka nimero ya yo. PGP esɛngaka logiciel. Btwinus etii bokangami AES-256 ya ndɛlɛ-na-ndɛlɛ na lien moko ya kopesa — moto nyonso akoki kosalela yango, eloko ebombami te, mpe moto azali na katikati te.',
    spec_cipher:    'Bokangami',
    spec_key_deriv: 'Bobimisi ya fungola',
    spec_transport: 'Botambwisi',
    spec_arch:      'Boyemi',
    spec_relay:     'Sɛrvɛr ya bokitisi te',

    // ── Demo ──────────────────────────────────────────────────────────────
    demo_eyebrow: 'Emonisami sikoyo',
    demo_heading: 'Talá yango ezali kosalema na ntango wana wana',
    demo_sub:     'Alice na Gradi K. bazali kobanda lisolo ya bonkundi — konti te, bobongisi te',

    // ── How it works ──────────────────────────────────────────────────────
    how_title:   'Esalemaka ndenge nini',
    how_1_title: 'Banda lisolo',
    how_1_body:  'Fina "Banda lisolo ya sika". Okozwa mbala moko biloko mibale: <strong>lien ya libyangi ekangami</strong> mpe <strong>liloba ya bokɔti</strong>.',
    how_2_title: 'Tinda yango ekeseni',
    how_2_body:  'Tinda <strong>lien</strong> na nzela ya WhatsApp, email, to aplikasyo nyonso. Tinda <strong>liloba ya bokɔti</strong> na nzela mosusu — mbila ya telefoni, SMS, to lobá yango miso na miso. Kokabola yango esalisaka ete moto moko te akoki kozwa nyonso mibale.',
    how_3_title: 'Bafungoli lien &amp; bayanoli',
    how_3_body:  'Moto mosusu afungoli lien na yo, akomi liloba ya bokɔti, mpe azwi <strong>lien ya eyano</strong> oyo ekopiami yango moko. Atindeli yo yango.',
    how_4_title: 'Tia &amp; bokangami',
    how_4_body:  'Tia lien ya eyano na bango — bokangami mbala moko. Nyonso ezali <strong>ekangami ndɛlɛ-na-ndɛlɛ</strong>. Konti te, sɛrvɛr te, istware te. Ekosila ntango okokanga onglet.',

    // ── Use cases ─────────────────────────────────────────────────────────
    usecases_title:        'Banani basalelaka Btwinus',
    uc_journalists_title:  'Bazwa-sango &amp; basangisi',
    uc_journalists_body:   'Yamba bansango ya bonkundi mpe sololela bato bayebani te oyo balingi koyebisa makambo, kozanga kotika nzela na sɛrvɛr. Eloko ebombami te — ata métadonnée te.',
    uc_lawyers_title:      'Avocats &amp; ba-kliyan',
    uc_lawyers_body:       'Masolo ya sekele oyo ekobungisama ntango okokanga. Sɛrvɛr ya cabinet te, cloud te — kokangana kaka ya semba mpe ekangami.',
    uc_negotiations_title: 'Bondimi ya sekele',
    uc_negotiations_body:  'Solola makambo ya kitoko na bonkundi — lifuti, boyokani, matata — kozanga botiki maloba mpe kozanga kolakisa nani ozali.',
    uc_feedback_title:     'Maloba ya bonkundi',
    uc_feedback_body:      'Basali, bayekoli, to ba-kliyan bapesi makanisi ya solo kozanga kobanga ete bakoyebana. Konti te, nzela te.',
    uc_passwords_title:    'Botindi ya bansinga ya bokɔti &amp; sekele',
    uc_passwords_body:     'Kabola sinza ya bokɔti, fungola API, to liloba ya crypto mbala moko — kaka navigateur na navigateur. Ezali na libateli koleka email, Slack, to WhatsApp.',
    uc_support_title:      'Lisalisi ya yo moko ya sekele',
    uc_support_body:       'Mibembo ya lisalisi, lisalisi ya baninga, makita ya thérapie — lisolo ya ntango moke oyo etiki istware te.',

    // ── Chat page ─────────────────────────────────────────────────────────
    chat_new_chat:    'Lisolo ya sika',
    hs_loading_text:  'Kobongisa kokangana…',

    hs_step1_label:   'Tinda lien oyo ekangami epai ya moto mosusu',
    hs_step1_tip:     'Okoki kokabola yango polele — ekangami. Bango basengeli kaka liloba ya bokɔti mpo na kosalela yango.',
    hs_copy:          'Kopia',
    hs_qr:            'QR',
    hs_qr_hint:       'Scan na kamera ya telefoni na yo — kopia te kotia te',
    hs_expiry_label:  'Lien ekosila:',
    expiry_1h:        'na ngonga 1',
    expiry_6h:        'na bangonga 6',
    expiry_24h:       'na bangonga 24',
    expiry_never:     'esili te',

    hs_step2_label:   'Tinda liloba ya bokɔti na <strong>nzela mosusu</strong> — SMS, mbila, miso na miso',
    hs_step2_tip:     'Soki moto azwi lien, akoki kokangana te kozanga liloba ya bokɔti. Banzela mibale = bizipeli mibale.',

    hs_step3_label:   'Tia lien oyo bazongiseli yo',
    hs_step3_tip:     'Sima ya kokoma liloba ya bokɔti, bakozwa lien ya eyano oyo ekopiami yango moko. Sɛnga bango batinda yo yango awa.',
    hs_answer_ph:     'Tia lien ya eyano na bango…',
    hs_connect:       'Kangana',

    hs_pass_title:    'Koma liloba ya bokɔti',
    hs_pass_label:    'Moto oyo abyangi yo asengelaki kotinda yango na nzela mosusu',
    hs_pass_ph:       'ndakisa: mopepe-mbwa-ebale-4821',
    hs_unlock:        'Fungola',
    hs_pass_error:    'Liloba ya bokɔti ezali mabe — meka lisusu',

    hs_answer_label:  'Zongisela moto oyo abyangi yo lien oyo ekangami',
    hs_waiting:       'Kozela bakangana…',

    hs_expired_title: 'Lien oyo esili',
    hs_expired_label: 'Sɛnga moto abanda lisolo ya sika mpe atinda yo lien ya sika.',

    session_tip:      'Bino mibale bosengeli komona kɔdɛ moko. Soki ekokani, lisolo na bino ezali ya sekele mpe moto azali na katikati te.',
    typing_text:      ' azali kokoma…',
    msg_ph:           'Liloba…',

    footer_encrypted:  '🔒 Ekangami',
    footer_no_servers: 'Sɛrvɛr te',
    footer_disappears: 'Esili na bofungwami',
    footer_anonymous:  'Bonkundi',
  }
};

const LANG_LIST = ['en', 'fr', 'ln'];

function getLang() {
  const saved = localStorage.getItem('btw_lang');
  return LANG_LIST.includes(saved) ? saved : 'en';
}

function setLang(lang) {
  if (!LANG_LIST.includes(lang)) lang = 'en';
  localStorage.setItem('btw_lang', lang);
  applyLang(lang);
  updatePickerActive(lang);
  document.documentElement.lang = lang;
}

// Kept for backwards compat — cycles through languages
function toggleLang() {
  const i = LANG_LIST.indexOf(getLang());
  setLang(LANG_LIST[(i + 1) % LANG_LIST.length]);
}

function updatePickerActive(lang) {
  document.querySelectorAll('.lang-picker [data-lang]').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
    btn.setAttribute('aria-pressed', btn.getAttribute('data-lang') === lang ? 'true' : 'false');
  });
}

function applyLang(lang) {
  const t = I18N[lang] || I18N.en;

  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (t[key] !== undefined) el.innerHTML = t[key];
  });

  document.querySelectorAll('[data-i18n-ph]').forEach(el => {
    const key = el.getAttribute('data-i18n-ph');
    if (t[key] !== undefined) el.placeholder = t[key];
  });

  document.querySelectorAll('option[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (t[key] !== undefined) el.textContent = t[key];
  });
}

// Auto-apply on load (script is at end of body so DOM is ready)
(function () {
  const lang = getLang();
  applyLang(lang);
  updatePickerActive(lang);
  document.documentElement.lang = lang;
})();
