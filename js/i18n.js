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
    sec_title:      'We put AES-256 end-to-end encryption<br>in a browser link. No app. No account. No server.',
    sec_sub:        'Until now, this level of encryption required apps, accounts, and trust in a company. Signal needs your phone number. PGP needs software. Enterprise tools need registration. Btwinus puts AES-256 end-to-end encryption directly in a shareable link. Anyone can use it, nothing is stored, and no one is in between.',
    spec_cipher:    'Cipher',
    spec_key_deriv: 'Key derivation',
    spec_transport: 'Transport',
    spec_arch:      'Architecture',
    spec_relay:     'No relay server',

    // ── Demo ──────────────────────────────────────────────────────────────
    demo_eyebrow: 'Live demo',
    demo_heading: 'Watch it happen in real time',
    demo_sub:     'Alice and Gradi K. starting a private chat, no accounts, no setup',

    // ── How it works ──────────────────────────────────────────────────────
    how_title:   'How it works',
    how_1_title: 'Start a chat',
    how_1_body:  'Click "Start a new chat". You instantly get two things: an <strong>encrypted invite link</strong> and a <strong>passphrase</strong>.',
    how_2_title: 'Share them separately',
    how_2_body:  'Send the <strong>link</strong> via WhatsApp, email, or any app. Send the <strong>passphrase</strong> a different way: a phone call, SMS, or say it in person. Keeping them apart means nobody can intercept both.',
    how_3_title: 'They open the link &amp; reply',
    how_3_body:  'The other person opens your link, types the passphrase, and gets a <strong>reply link</strong> that is automatically copied. They send it back to you.',
    how_4_title: 'Paste &amp; you\'re connected',
    how_4_body:  'Paste their reply link and you\'re instantly connected. Everything is <strong>end-to-end encrypted</strong>. No accounts, no servers, no history. Gone when you close the tab.',

    // ── Use cases ─────────────────────────────────────────────────────────
    usecases_title:        'Who uses Btwinus',
    uc_journalists_title:  'Journalists &amp; sources',
    uc_journalists_body:   'Receive anonymous tips and communicate with whistleblowers without leaving a server trail. Nothing is stored, not even metadata.',
    uc_lawyers_title:      'Lawyers &amp; clients',
    uc_lawyers_body:       'Privileged conversations that disappear on close. No law firm server, no cloud provider, just a direct encrypted connection.',
    uc_negotiations_title: 'Secure negotiations',
    uc_negotiations_body:  'Discuss sensitive terms anonymously (salary, deals, disputes) with no transcript and no identity required.',
    uc_feedback_title:     'Anonymous feedback',
    uc_feedback_body:      'Employees, students, or customers send honest feedback without worrying about identity. No account means no trace.',
    uc_passwords_title:    'Sending passwords &amp; secrets',
    uc_passwords_body:     'Share a password, API key, or crypto seed phrase once, directly browser-to-browser. Far safer than email, Slack, or WhatsApp.',
    uc_support_title:      'Private one-on-one support',
    uc_support_body:       'Crisis lines, peer support, therapy pre-sessions. Temporary secure chat that leaves no history behind.',
    uc_more:               'Learn more →',

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
    hs_pass_ph:       'e.g. storm-fox-river-oak-4821',
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

    // ── FAQ ───────────────────────────────────────────────────────────────
    faq_title: 'Frequently asked questions',
    faq_1_q: 'Is Btwinus free?',
    faq_1_a: 'Yes. There is no subscription, no ads, and no premium tier. Everything runs in your browser, so there is nothing to pay for.',
    faq_2_q: 'Do I need to install an app or create an account?',
    faq_2_a: 'No. Open the link in any modern browser. No email, no phone number, no sign-up of any kind.',
    faq_3_q: 'Where are my messages stored?',
    faq_3_a: 'Nowhere. Messages travel directly between the two browsers over an encrypted WebRTC connection. When either person closes the tab, the conversation is gone.',
    faq_4_q: 'Why do I have to send the passphrase separately?',
    faq_4_a: 'The link is encrypted with the passphrase. If both travel through the same channel, whoever can read that channel has both. Sending the passphrase by phone, SMS, or in person means an attacker would have to compromise two channels instead of one.',
    faq_5_q: 'How is this different from Signal or WhatsApp?',
    faq_5_a: 'Those need an app, a phone number, and a company’s servers to route messages. Btwinus needs none of that. It is built for one-off private conversations, not as a replacement for your everyday messenger.',
    faq_6_q: 'Does it work on mobile?',
    faq_6_a: 'Yes, in Chrome, Safari, Firefox, and Edge on iOS and Android. The invite link can be shown as a QR code so the other person only has to scan it.',
    faq_7_q: 'Is there really no server at all?',
    faq_7_a: 'No Btwinus server, and no relay. The handshake travels inside the link, and messages go straight between the two browsers. The one outside party is a STUN server (currently Google’s), which each browser asks for its own public address. It sees your IP, never any content. There is no fallback relay, so on some strict corporate or mobile networks a direct connection cannot be made and the chat will not connect.',

    // ── Site footer ───────────────────────────────────────────────────────
    site_footer_tagline: 'Anonymous, end-to-end encrypted chat via a link. No app, no account, no server.',
    site_footer_guides:  'Guides',
    site_footer_legal:   'Legal',
    site_footer_project: 'Project',
    site_footer_source:  'Source code on GitHub',
    site_footer_privacy: 'Privacy policy',
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
    sec_title:      'Nous avons mis le chiffrement AES-256 de bout en bout<br>dans un lien. Sans appli. Sans compte. Sans serveur.',
    sec_sub:        'Jusqu\'ici, ce niveau de chiffrement nécessitait des applications, des comptes et de la confiance envers une entreprise. Signal demande votre numéro. PGP demande un logiciel. Btwinus met le chiffrement AES-256 directement dans un lien partageable. Accessible à tous, rien n\'est stocké, personne n\'est au milieu.',
    spec_cipher:    'Chiffrement',
    spec_key_deriv: 'Dérivation de clé',
    spec_transport: 'Transport',
    spec_arch:      'Architecture',
    spec_relay:     'Sans serveur relais',

    // ── Demo ──────────────────────────────────────────────────────────────
    demo_eyebrow: 'Démo en direct',
    demo_heading: 'Regardez en temps réel',
    demo_sub:     'Alice et Gradi K. démarrent une conversation privée, sans compte, sans installation',

    // ── How it works ──────────────────────────────────────────────────────
    how_title:   'Comment ça marche',
    how_1_title: 'Démarrer une conversation',
    how_1_body:  'Cliquez sur "Démarrer une conversation". Vous obtenez instantanément deux choses : un <strong>lien d\'invitation chiffré</strong> et une <strong>phrase de passe</strong>.',
    how_2_title: 'Partagez-les séparément',
    how_2_body:  'Envoyez le <strong>lien</strong> via WhatsApp, email ou toute autre appli. Envoyez la <strong>phrase de passe</strong> autrement : appel, SMS ou en personne. Les séparer empêche toute interception.',
    how_3_title: 'Ils ouvrent le lien &amp; répondent',
    how_3_body:  'L\'autre personne ouvre votre lien, saisit la phrase de passe et reçoit un <strong>lien de réponse</strong> copié automatiquement. Elle vous le renvoie.',
    how_4_title: 'Collez &amp; vous êtes connectés',
    how_4_body:  'Collez leur lien de réponse et vous êtes instantanément connectés. Tout est <strong>chiffré de bout en bout</strong>. Sans compte, sans serveur, sans historique.',

    // ── Use cases ─────────────────────────────────────────────────────────
    usecases_title:        'Qui utilise Btwinus',
    uc_journalists_title:  'Journalistes &amp; sources',
    uc_journalists_body:   'Recevez des informations anonymes et communiquez avec des lanceurs d\'alerte sans laisser de trace. Rien n\'est stocké, pas même les métadonnées.',
    uc_lawyers_title:      'Avocats &amp; clients',
    uc_lawyers_body:       'Conversations confidentielles qui disparaissent à la fermeture. Pas de serveur du cabinet, pas de cloud, juste une connexion directe chiffrée.',
    uc_negotiations_title: 'Négociations sécurisées',
    uc_negotiations_body:  'Discutez de termes sensibles anonymement (salaire, accords, litiges) sans transcript et sans identité requise.',
    uc_feedback_title:     'Feedback anonyme',
    uc_feedback_body:      'Employés, étudiants ou clients donnent un avis honnête sans crainte d\'être identifiés. Sans compte, sans trace.',
    uc_passwords_title:    'Envoi de mots de passe &amp; secrets',
    uc_passwords_body:     'Partagez un mot de passe, une clé API ou une phrase mnémotechnique une seule fois, de navigateur à navigateur. Bien plus sûr que l\'email, Slack ou WhatsApp.',
    uc_support_title:      'Soutien individuel privé',
    uc_support_body:       'Lignes de crise, soutien entre pairs, pré-séances thérapeutiques. Chat temporaire et sécurisé sans aucun historique.',
    uc_more:               'En savoir plus →',

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
    hs_pass_ph:       'ex. tempête-renard-rivière-chêne-4821',
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

    // ── FAQ ───────────────────────────────────────────────────────────────
    faq_title: 'Questions fréquentes',
    faq_1_q: 'Btwinus est-il gratuit ?',
    faq_1_a: 'Oui. Pas d’abonnement, pas de publicité, pas de version premium. Tout fonctionne dans votre navigateur, il n’y a donc rien à payer.',
    faq_2_q: 'Faut-il installer une appli ou créer un compte ?',
    faq_2_a: 'Non. Ouvrez le lien dans n’importe quel navigateur moderne. Ni email, ni numéro de téléphone, ni inscription.',
    faq_3_q: 'Où sont stockés mes messages ?',
    faq_3_a: 'Nulle part. Les messages circulent directement entre les deux navigateurs via une connexion WebRTC chiffrée. Dès que l’un des deux ferme l’onglet, la conversation disparaît.',
    faq_4_q: 'Pourquoi envoyer la phrase de passe séparément ?',
    faq_4_a: 'Le lien est chiffré avec la phrase de passe. Si les deux passent par le même canal, quiconque lit ce canal possède les deux. Envoyer la phrase de passe par téléphone, SMS ou en personne oblige un attaquant à compromettre deux canaux au lieu d’un.',
    faq_5_q: 'Quelle différence avec Signal ou WhatsApp ?',
    faq_5_a: 'Ces services demandent une appli, un numéro de téléphone et les serveurs d’une entreprise pour acheminer les messages. Btwinus n’a besoin de rien de tout cela. Il est conçu pour des conversations privées ponctuelles, pas pour remplacer votre messagerie quotidienne.',
    faq_6_q: 'Ça marche sur mobile ?',
    faq_6_a: 'Oui, dans Chrome, Safari, Firefox et Edge sur iOS et Android. Le lien d’invitation peut s’afficher en QR code : l’autre personne n’a qu’à le scanner.',
    faq_7_q: 'Il n’y a vraiment aucun serveur ?',
    faq_7_a: 'Aucun serveur Btwinus et aucun relais. La poignée de main voyage dans le lien, et les messages vont directement d’un navigateur à l’autre. Le seul tiers est un serveur STUN (actuellement celui de Google), que chaque navigateur interroge pour connaître sa propre adresse publique. Il voit votre IP, jamais le contenu. Il n’y a pas de relais de secours : sur certains réseaux d’entreprise ou mobiles très stricts, la connexion directe est impossible et le chat ne s’établit pas.',

    // ── Site footer ───────────────────────────────────────────────────────
    site_footer_tagline: 'Chat anonyme et chiffré de bout en bout via un lien. Sans application, sans compte, sans serveur.',
    site_footer_guides:  'Guides',
    site_footer_legal:   'Mentions légales',
    site_footer_project: 'Projet',
    site_footer_source:  'Code source sur GitHub',
    site_footer_privacy: 'Confidentialité',
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
    sec_title:      'Tozali kotia bokangami AES-256 ya ndɛlɛ-na-ndɛlɛ<br>na kati ya lien. Aplikasyo te. Konti te. Sɛrvɛr te.',
    sec_sub:        'Tii lelo, bokangami ya boye esengaki aplikasyo, konti, mpe kotyela kompani motema. Signal esɛngaka nimero ya yo. PGP esɛngaka logiciel. Btwinus etii bokangami AES-256 ya ndɛlɛ-na-ndɛlɛ na lien moko ya kopesa. Moto nyonso akoki kosalela yango, eloko ebombami te, mpe moto azali na katikati te.',
    spec_cipher:    'Bokangami',
    spec_key_deriv: 'Bobimisi ya fungola',
    spec_transport: 'Botambwisi',
    spec_arch:      'Boyemi',
    spec_relay:     'Sɛrvɛr ya bokitisi te',

    // ── Demo ──────────────────────────────────────────────────────────────
    demo_eyebrow: 'Emonisami sikoyo',
    demo_heading: 'Talá yango ezali kosalema na ntango wana wana',
    demo_sub:     'Alice na Gradi K. bazali kobanda lisolo ya bonkundi, konti te, bobongisi te',

    // ── How it works ──────────────────────────────────────────────────────
    how_title:   'Esalemaka ndenge nini',
    how_1_title: 'Banda lisolo',
    how_1_body:  'Fina "Banda lisolo ya sika". Okozwa mbala moko biloko mibale: <strong>lien ya libyangi ekangami</strong> mpe <strong>liloba ya bokɔti</strong>.',
    how_2_title: 'Tinda yango ekeseni',
    how_2_body:  'Tinda <strong>lien</strong> na nzela ya WhatsApp, email, to aplikasyo nyonso. Tinda <strong>liloba ya bokɔti</strong> na nzela mosusu: mbila ya telefoni, SMS, to lobá yango miso na miso. Kokabola yango esalisaka ete moto moko te akoki kozwa nyonso mibale.',
    how_3_title: 'Bafungoli lien &amp; bayanoli',
    how_3_body:  'Moto mosusu afungoli lien na yo, akomi liloba ya bokɔti, mpe azwi <strong>lien ya eyano</strong> oyo ekopiami yango moko. Atindeli yo yango.',
    how_4_title: 'Tia &amp; bokangami',
    how_4_body:  'Tia lien ya eyano na bango, bokangami mbala moko. Nyonso ezali <strong>ekangami ndɛlɛ-na-ndɛlɛ</strong>. Konti te, sɛrvɛr te, istware te. Ekosila ntango okokanga onglet.',

    // ── Use cases ─────────────────────────────────────────────────────────
    usecases_title:        'Banani basalelaka Btwinus',
    uc_journalists_title:  'Bazwa-sango &amp; basangisi',
    uc_journalists_body:   'Yamba bansango ya bonkundi mpe sololela bato bayebani te oyo balingi koyebisa makambo, kozanga kotika nzela na sɛrvɛr. Eloko ebombami te, ata métadonnée te.',
    uc_lawyers_title:      'Avocats &amp; ba-kliyan',
    uc_lawyers_body:       'Masolo ya sekele oyo ekobungisama ntango okokanga. Sɛrvɛr ya cabinet te, cloud te, kokangana kaka ya semba mpe ekangami.',
    uc_negotiations_title: 'Bondimi ya sekele',
    uc_negotiations_body:  'Solola makambo ya kitoko na bonkundi (lifuti, boyokani, matata) kozanga botiki maloba mpe kozanga kolakisa nani ozali.',
    uc_feedback_title:     'Maloba ya bonkundi',
    uc_feedback_body:      'Basali, bayekoli, to ba-kliyan bapesi makanisi ya solo kozanga kobanga ete bakoyebana. Konti te, nzela te.',
    uc_passwords_title:    'Botindi ya bansinga ya bokɔti &amp; sekele',
    uc_passwords_body:     'Kabola sinza ya bokɔti, fungola API, to liloba ya crypto mbala moko, kaka navigateur na navigateur. Ezali na libateli koleka email, Slack, to WhatsApp.',
    uc_support_title:      'Lisalisi ya yo moko ya sekele',
    uc_support_body:       'Mibembo ya lisalisi, lisalisi ya baninga, makita ya thérapie. Lisolo ya ntango moke oyo etiki istware te.',
    uc_more:               'Yeba mingi →',

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
    hs_pass_ph:       'ndakisa: mopepe-mbwa-ebale-nzete-4821',
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

    // ── FAQ ───────────────────────────────────────────────────────────────
    faq_title: 'Mituna oyo batunaka mingi',
    faq_1_q: 'Btwinus ezali ofele?',
    faq_1_a: 'Ɛɛ. Abonnement te, piblisite te, version premium te. Nyonso esalaka na navigateur ya yo, boye eloko ya kofuta ezali te.',
    faq_2_q: 'Nasengeli kotia aplikasyo to kofungola konti?',
    faq_2_a: 'Te. Fungola lien na navigateur nyonso ya sika. Email te, nimero ya telefoni te, inscription te.',
    faq_3_q: 'Ba-message na ngai ebombami wapi?',
    faq_3_a: 'Esika moko te. Ba-message ekendaka semba kati ya ba-navigateur mibale na nzela ya WebRTC ekangami. Soki moto moko akangi onglet, lisolo esili.',
    faq_4_q: 'Mpo na nini nasengeli kotinda liloba ya bokɔti na nzela mosusu?',
    faq_4_a: 'Lien ekangami na liloba ya bokɔti. Soki nyonso mibale eleki na nzela moko, moto oyo atangi nzela yango azwi nyonso mibale. Kotinda liloba ya bokɔti na mbila, SMS, to miso na miso elingi koloba moyibi asengeli kobuka nzela mibale, kasi moko te.',
    faq_5_q: 'Ekeseni ndenge nini na Signal to WhatsApp?',
    faq_5_a: 'Yango esɛngaka aplikasyo, nimero ya telefoni, mpe ba-sɛrvɛr ya kompani mpo na kotinda ba-message. Btwinus esɛngaka ata moko te. Esalemi mpo na masolo ya sekele ya mbala moko, kasi mpo na kokitanisa messagerie ya yo ya mokolo na mokolo te.',
    faq_6_q: 'Esalaka na telefoni?',
    faq_6_a: 'Ɛɛ, na Chrome, Safari, Firefox, mpe Edge na iOS mpe Android. Lien ya libyangi ekoki komonisama lokola code QR mpo moto mosusu a-scanner yango kaka.',
    faq_7_q: 'Sɛrvɛr ezali mpenza te?',
    faq_7_a: 'Sɛrvɛr ya Btwinus te, mpe relais te. Bokutani ekendaka na kati ya lien, mpe ba-message ekendaka semba kati ya ba-navigateur mibale. Moto ya libanda kaka moko: sɛrvɛr STUN (sikoyo oyo ya Google), oyo navigateur moko na moko etunaka mpo na koyeba adrɛsi na yango ya libanda. Emonaka IP na yo, kasi makambo ya lisolo te. Relais ya lisungi ezali te: na ba-réseaux mosusu ya kompani to ya telefoni oyo ezali makasi, bokutani ya semba ekoki te mpe lisolo ekokangana te.',

    // ── Site footer ───────────────────────────────────────────────────────
    site_footer_tagline: 'Lisolo ya bonkundi mpe ekangami ndɛlɛ-na-ndɛlɛ na nzela ya lien. Aplikasyo te, konti te, sɛrvɛr te.',
    site_footer_guides:  'Malako',
    site_footer_legal:   'Mibeko',
    site_footer_project: 'Mosala',
    site_footer_source:  'Code source na GitHub',
    site_footer_privacy: 'Mibeko ya bonkundi',
  }
};

const LANG_LIST = ['en', 'fr', 'ln'];

function getLang() {
  // Server-rendered language pages (/, /fr/, /ln/) are the source of truth.
  // Fall back to localStorage only for pages that don't declare a known lang.
  const pageLang = document.documentElement.lang;
  if (LANG_LIST.includes(pageLang)) return pageLang;
  const saved = localStorage.getItem('btw_lang');
  return LANG_LIST.includes(saved) ? saved : 'en';
}

function setLang(lang) {
  if (!LANG_LIST.includes(lang)) lang = 'en';
  localStorage.setItem('btw_lang', lang);
  const target = lang === 'en' ? '/' : '/' + lang + '/';
  const currentLang = document.documentElement.lang;
  if (LANG_LIST.includes(currentLang) && currentLang !== lang) {
    location.href = target;
    return;
  }
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
