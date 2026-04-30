(function () {
  'use strict';

  const CHARS  = '0123456789ABCDEFabcdef@#$%^&*!?/\\|アイウエオカキクケコサシスセソタチツ≠∑∞§≈±×÷';

  // Dark mode palette
  const BLUE   = '#5865f2';
  const GREEN  = '#22c55e';
  const PURPLE = '#9333ea';
  const WHITE  = '#e0e0e0';

  // Light mode palette
  const L_BLACK  = '#1a1a1a';
  const L_RED    = '#dc2626';
  const L_ORANGE = '#ea580c';
  const L_HEAD   = '#ffffff';

  function getTheme() {
    return document.documentElement.getAttribute('data-theme') || 'light';
  }

  // Remap dark-palette colors to light-palette equivalents
  function mapColor(c) {
    if (c === GREEN)  return L_RED;
    if (c === PURPLE) return L_ORANGE;
    if (c === BLUE)   return L_BLACK;
    if (c === WHITE)  return L_HEAD;
    return c;
  }

  function rand(a, b)    { return a + Math.random() * (b - a); }
  function randInt(a, b) { return Math.floor(rand(a, b + 1)); }
  function rc()          { return CHARS[randInt(0, CHARS.length - 1)]; }

  // ── Multi-language word definitions ───────────────────────────────────────
  // sizes are vw fractions — capped at 560px in draw() so they never exceed ~2× the site logo on wide screens
  const WORD_DEFS = [
    { t: ['Btwinus'],  color: BLUE,   size: 0.11,  bold: true, special: true },
    {
      t: ['ENCRYPTED','CHIFFRÉ','CIFRADO','加密','VERSCHLÜSSELT','ЗАШИФРОВАНО','暗号化','مشفر','CRIPTOGRAFADO'],
      color: BLUE, size: 0.065
    },
    {
      t: ['NO SERVERS','SANS SERVEURS','SIN SERVIDORES','无服务器','KEIN SERVER','БЕЗ СЕРВЕРА','サーバーなし','بدون خادم'],
      color: GREEN, size: 0.062
    },
    {
      t: ['ANONYMOUS','ANONYME','ANÓNIMO','匿名','ANONYM','АНОНИМНО','無名','مجهول','익명'],
      color: BLUE, size: 0.068
    },
    {
      t: ['NO TRACE','AUCUNE TRACE','SIN RASTRO','无痕迹','KEINE SPUR','БЕЗ СЛЕДА','痕跡なし','لا أثر'],
      color: PURPLE, size: 0.065
    },
    {
      t: ['PRIVATE','PRIVÉ','PRIVADO','私人','PRIVAT','ЧАСТНЫЙ','プライベート','خاص','개인적인'],
      color: GREEN, size: 0.072
    },
    {
      t: ['END-TO-END','DE BOUT EN BOUT','端到端','VON ENDE ZU ENDE','КОНЕЦ В КОНЕЦ','エンドツーエンド','من طرف لطرف'],
      color: PURPLE, size: 0.054
    },
    {
      t: ['SECURE','SÉCURISÉ','SEGURO','安全','SICHER','БЕЗОПАСНО','セキュア','آمن','보안'],
      color: BLUE, size: 0.072
    },
    {
      t: ['FREE','GRATUIT','GRATIS','免费','KOSTENLOS','БЕСПЛАТНО','無料','مجاني','무료'],
      color: GREEN, size: 0.072
    },
    {
      t: ['NO LOGS','SANS JOURNAUX','SIN REGISTROS','无日志','KEINE LOGS','БЕЗ ЛОГОВ','ログなし','بدون سجلات'],
      color: BLUE, size: 0.062
    },
    {
      t: ['GHOST MODE','MODE FANTÔME','MODO FANTASMA','幽灵模式','GEISTERMODUS','РЕЖИМ ПРИЗРАКА','ゴーストモード'],
      color: PURPLE, size: 0.062
    },
    {
      t: ['#PRIVACY','#CONFIDENTIALITÉ','#PRIVACIDAD','#隐私','#DATENSCHUTZ','#КОНФИДЕНЦИАЛЬНОСТЬ','#プライバシー','#خصوصية'],
      color: BLUE, size: 0.062
    },
    {
      t: ['ZERO KNOWLEDGE','CONNAISSANCE ZÉRO','CERO CONOCIMIENTO','零知识','KEIN WISSEN','НУЛЕВОЕ ЗНАНИЕ','ゼロ知識'],
      color: PURPLE, size: 0.052
    },
    {
      t: ['256-BIT','256 BITS','256位','256-BIT','256ビット','256 بت'],
      color: GREEN, size: 0.068
    },
    {
      t: ['P2P','PAIR À PAIR','PUNTO A PUNTO','点对点','PEER-TO-PEER','ОДНОРАНГОВЫЙ','ピアツーピア'],
      color: BLUE, size: 0.068
    },
    {
      t: ['DISAPPEARS ON CLOSE','DISPARAÎT À LA FERMETURE','DESAPARECE AL CERRAR','关闭即消失','VERSCHWINDET BEIM SCHLIESSEN','ИСЧЕЗАЕТ ПРИ ЗАКРЫТИИ','閉じると消える'],
      color: GREEN, size: 0.047
    },
  ];

  // ── Falling rain column ───────────────────────────────────────────────────
  class RainDrop {
    constructor(x, h) {
      this.x         = x;
      this.darkColor = Math.random() < 0.28 ? GREEN : BLUE;
      this.lightColor = Math.random() < 0.28 ? L_RED : L_BLACK;
      this.reset(h, true);
    }
    reset(h, init = false) {
      this.y      = init ? rand(-h, 0) : rand(-200, -20);
      this.speed  = rand(7, 20);
      this.trail  = [];
      this.maxLen = randInt(7, 26);
      this.tick   = 0;
    }
    update(h) {
      this.y += this.speed * 0.28;
      this.tick++;
      if (this.tick % 2 === 0) {
        this.trail.unshift(rc());
        if (this.trail.length > this.maxLen) this.trail.pop();
      }
      if (this.y - this.maxLen * 16 > h) this.reset(h);
    }
    draw(ctx) {
      const light = getTheme() === 'light';
      const color = light ? this.lightColor : this.darkColor;
      const head  = light ? L_ORANGE : WHITE;

      this.trail.forEach((ch, i) => {
        const cy = this.y - i * 16;
        if (cy < 0) return;
        const a = i === 0 ? 0.9 : Math.pow(1 - i / this.trail.length, 1.6) * 0.6;
        ctx.globalAlpha = a;
        ctx.fillStyle   = i === 0 ? head : color;
        ctx.font        = `${i === 0 ? 'bold ' : ''}13px monospace`;
        ctx.fillText(ch, this.x, cy);
      });
    }
  }

  // ── Rising fume particle ──────────────────────────────────────────────────
  class Fume {
    constructor(W, H) { this.W = W; this.H = H; this.reset(true); }
    reset(init = false) {
      this.x       = rand(0, this.W);
      this.y       = init ? rand(0, this.H) : this.H + rand(0, 40);
      this.ch      = rc();
      this.speed   = rand(0.35, 1.1);
      this.drift   = rand(-0.35, 0.35);
      this.maxOp   = rand(0.1, 0.3);
      this.size    = randInt(10, 17);
      this.life    = 0;
      this.maxLife = rand(70, 220);
      this.ctick   = randInt(18, 45);
    }
    update() {
      this.y -= this.speed;
      this.x += this.drift;
      this.life++;
      if (--this.ctick <= 0) { this.ch = rc(); this.ctick = randInt(15, 40); }
      if (this.life > this.maxLife || this.y < -20) this.reset();
    }
    draw(ctx) {
      const alpha = this.maxOp * Math.sin((this.life / this.maxLife) * Math.PI);
      ctx.globalAlpha = alpha;
      ctx.fillStyle   = getTheme() === 'light' ? L_ORANGE : PURPLE;
      ctx.font        = `${this.size}px monospace`;
      ctx.fillText(this.ch, this.x, this.y);
    }
  }

  // ── Floating word — encrypts, decrypts, then translates ──────────────────
  class FloatingWord {
    constructor(def, W, H) {
      this.def      = def;
      this.W        = W;
      this.H        = H;
      this.langIdx  = randInt(0, def.t.length - 1);
      this._place();
    }
    get _text() { return this.def.t[this.langIdx % this.def.t.length]; }
    _scramble()  { return this._text.split('').map(c => c === ' ' ? ' ' : rc()).join(''); }
    _place() {
      const pad   = Math.round(this.W * 0.04);
      this.x      = rand(pad, this.W - pad);
      this.y      = rand(pad, this.H - pad);
      this.dx     = rand(-0.32, 0.32);
      this.dy     = rand(-0.32, 0.32);
      this.state  = 'encrypted';
      this.disp   = this._scramble();
      this.timer  = randInt(60, 240);
      this.glow   = 0;
    }
    update() {
      this.x += this.dx;
      this.y += this.dy;
      if (this.x < 40 || this.x > this.W - 160) this.dx *= -1;
      if (this.y < 30  || this.y > this.H  - 30)  this.dy *= -1;

      this.timer--;
      const len = this._text.length;

      if (this.state === 'encrypted') {
        if (Math.random() < 0.1) this.disp = this._scramble();
        if (this.timer <= 0) {
          this.state = 'decrypting';
          this.timer = len * 6;
        }
      } else if (this.state === 'decrypting') {
        const revealed = Math.floor((1 - this.timer / (len * 6)) * len);
        this.disp = this._text.split('').map((c, i) =>
          c === ' ' ? ' ' : (i < revealed ? c : rc())
        ).join('');
        this.glow = Math.min(this.glow + 0.06, 1);
        if (this.timer <= 0) {
          this.state = 'readable';
          this.disp  = this._text;
          this.timer = randInt(100, 300);
        }
      } else if (this.state === 'readable') {
        if (this.timer <= 0) {
          this.state = 'encrypting';
          this.timer = len * 6;
        }
      } else if (this.state === 'encrypting') {
        const scrambled = Math.floor((1 - this.timer / (len * 6)) * len);
        this.disp = this._text.split('').map((c, i) =>
          c === ' ' ? ' ' : (i < scrambled ? rc() : c)
        ).join('');
        this.glow = Math.max(this.glow - 0.05, 0);
        if (this.timer <= 0) {
          this.langIdx = (this.langIdx + 1) % this.def.t.length;
          this.state   = 'encrypted';
          this.disp    = this._scramble();
          this.timer   = randInt(80, 260);
        }
      }
    }
    draw(ctx) {
      const light    = getTheme() === 'light';
      const readable = this.state === 'readable';
      const { def }  = this;
      const color    = light ? mapColor(def.color) : def.color;
      const alpha    = readable
        ? (def.special ? 1.0  : 0.92)
        : (def.special ? 0.55 : 0.38);

      const fontSize  = Math.round(def.size * Math.min(this.W, 560));
      ctx.globalAlpha = alpha;
      ctx.fillStyle   = color;
      ctx.font        = `${def.bold && readable ? 'bold ' : ''}${fontSize}px monospace`;

      if (this.glow > 0) {
        ctx.shadowColor = color;
        ctx.shadowBlur  = def.special ? 28 * this.glow : 10 * this.glow;
      }
      ctx.fillText(this.disp, this.x, this.y);
      ctx.shadowBlur = 0;
    }
  }

  // ── Main animation controller ─────────────────────────────────────────────
  class MatrixBG {
    constructor(canvas) {
      this.canvas = canvas;
      this.ctx    = canvas.getContext('2d');
      this.alive  = true;
      this.W = this.H = 0;
      this.drops = []; this.fumes = []; this.words = [];
      this._resize();
      window.addEventListener('resize', () => this._resize());
      // Resume the RAF chain when the user returns to the tab
      document.addEventListener('visibilitychange', () => {
        if (!document.hidden && this.alive) requestAnimationFrame(() => this._loop());
      });
      this._loop();
    }
    _resize() {
      const dpr  = window.devicePixelRatio || 1;
      this.W     = window.innerWidth;
      this.H     = window.innerHeight;
      this.canvas.width  = this.W * dpr;
      this.canvas.height = this.H * dpr;
      this.canvas.style.width  = this.W + 'px';
      this.canvas.style.height = this.H + 'px';
      this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const colW = 20;
      this.drops = Array.from({ length: Math.floor(this.W / colW) }, (_, i) =>
        new RainDrop(i * colW + colW / 2, this.H)
      );
      this.fumes = Array.from({ length: 80 }, () => new Fume(this.W, this.H));
      if (!this.words.length) {
        this.words = WORD_DEFS.map(d => new FloatingWord(d, this.W, this.H));
      }
    }
    _loop() {
      if (!this.alive || document.hidden) return;
      const { ctx, W, H } = this;
      // Fade overlay matches the page background for each theme
      ctx.fillStyle = getTheme() === 'light'
        ? 'rgba(236,236,244,0.16)'
        : 'rgba(7,7,15,0.16)';
      ctx.fillRect(0, 0, W, H);
      this.fumes.forEach(f => { f.update(); f.draw(ctx); });
      this.drops.forEach(d => { d.update(H); d.draw(ctx); });
      this.words.forEach(w => { w.update(); w.draw(ctx); });
      ctx.globalAlpha = 1;
      requestAnimationFrame(() => this._loop());
    }
    destroy() { this.alive = false; }
  }

  function boot() {
    const c = document.getElementById('matrix-canvas');
    if (!c) return;
    if (window._matrixBG) window._matrixBG.destroy();
    window._matrixBG = new MatrixBG(c);
  }

  document.readyState === 'loading'
    ? document.addEventListener('DOMContentLoaded', boot)
    : boot();
})();
