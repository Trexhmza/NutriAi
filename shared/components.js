const NutriUI = {
  config: {
    requireAuth: false,
    currentPage: 'home'
  },

  init(opts = {}) {
    Object.assign(this.config, opts);
    this.detectPage();
    this.injectHeader();
    this.injectAuthModal();
    this.injectFooter();
    this.injectSettingsModal();
    document.addEventListener('DOMContentLoaded', () => this.onReady());
  },

  detectPage() {
    const p = window.location.pathname.replace(/\/+$/, '');
    if (p.endsWith('/dashboard')) this.config.currentPage = 'dashboard';
    else if (p.endsWith('/log')) this.config.currentPage = 'log';
    else if (p.endsWith('/bmi')) this.config.currentPage = 'bmi';
    else if (p.endsWith('/contact')) this.config.currentPage = 'contact';
    else this.config.currentPage = 'home';
  },

  p(rel) {
    const depth = this.config.currentPage === 'home' ? '.' : '..';
    return `${depth}/${rel}`;
  },

  async onReady() {
    await this.updateAuthUI();
    this.positionLamp();
    if (this.config.requireAuth) {
      const user = await this.getUser();
      if (!user) { window.location.href = this.p('index.html'); return; }
    }
    document.addEventListener('click', (e) => {
      const dd = document.getElementById('userDropdown');
      const menu = document.getElementById('userMenu');
      if (dd && menu && !menu.contains(e.target) && !dd.classList.contains('hidden')) {
        dd.classList.add('hidden');
      }
    });
    window.addEventListener('resize', () => this.positionLamp());
    document.dispatchEvent(new Event('nutri-ready'));
  },

  injectHeader() {
    const s = document.createElement('style');
    s.textContent = `
      .site-header{position:fixed;top:0;left:0;right:0;z-index:50;background:transparent;height:4rem}
      @media(max-width:767px){.site-header{height:3.5rem}}
      .site-header-inner{max-width:80rem;margin:0 auto;padding:0 1rem;height:100%;display:flex;align-items:center;justify-content:space-between;position:relative}
      .pill-wrap{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%)}
      .pill-bar{display:inline-flex;align-items:center;gap:0.25rem;background:rgba(30,30,26,0.65);border:1px solid rgba(61,56,50,0.35);backdrop-filter:blur(24px);-webkit-backdrop-filter:blur(24px);padding:0.25rem;border-radius:9999px;box-shadow:0 4px 30px rgba(0,0,0,0.35);pointer-events:auto}
      .pill-item{position:relative;cursor:pointer;font-size:0.875rem;font-weight:600;padding:0.5rem 1.25rem;border-radius:9999px;transition:color 0.3s;color:#9e9488;white-space:nowrap;z-index:1;text-decoration:none}
      .pill-item:hover{color:#e8a87c}
      .pill-item.active{color:#e8a87c}
      .pill-item .pi-label{display:none}
      .pill-item .pi-icon{display:inline-flex;vertical-align:middle;font-size:1.25rem}
      @media(min-width:768px){
        .pill-item .pi-icon{display:none}
        .pill-item .pi-label{display:inline}
      }
      @media(max-width:767px){
        .pill-item{padding:0.375rem 0.625rem}
      }
      .pill-lamp{position:absolute;top:0;bottom:0;border-radius:9999px;background:rgba(232,168,124,0.06);transition:all 0.4s cubic-bezier(0.34,1.56,0.64,1);pointer-events:none;z-index:0}
      .pill-glow{position:absolute;top:-3px;left:50%;transform:translateX(-50%);width:32px;height:4px;background:#e8a87c;border-radius:9999px;filter:blur(6px);opacity:0.8;transition:all 0.4s cubic-bezier(0.34,1.56,0.64,1);pointer-events:none}
      .pill-glow::before{content:'';position:absolute;top:-1px;left:50%;transform:translateX(-50%);width:18px;height:3px;background:#e8a87c;border-radius:9999px;filter:blur(1px)}
      .pill-glow::after{content:'';position:absolute;top:-5px;left:50%;transform:translateX(-50%);width:48px;height:10px;background:rgba(232,168,124,0.12);border-radius:100%;filter:blur(12px)}
      .logo-icon{transition:all 0.4s cubic-bezier(0.34,1.56,0.64,1)}
      .logo-icon:hover{filter:drop-shadow(0 0 12px rgba(232,168,124,0.4)) drop-shadow(0 0 40px rgba(232,168,124,0.15))}
      .btn-glow{transition:all 0.3s cubic-bezier(0.34,1.56,0.64,1)}
      .btn-glow:hover{box-shadow:0 0 30px rgba(232,168,124,0.25);transform:translateY(-1.5px)}
    `;
    document.head.appendChild(s);

    const cp = this.config.currentPage;
    const items = [
      { id:'home', label:'Home', icon:'home', href: cp==='home' ? '#' : this.p('index.html'), publicOnly:true },
      { id:'dashboard', label:'Dashboard', icon:'dashboard', href: cp==='dashboard' ? '#' : this.p('dashboard/'), auth:true },
      { id:'log', label:'Log Meal', icon:'restaurant_menu', href: cp==='log' ? '#' : this.p('log/'), auth:true },
      { id:'bmi', label:'BMI', icon:'monitor_weight', href: cp==='bmi' ? '#' : this.p('bmi/') },
      { id:'contact', label:'Contact', icon:'mail', href: cp==='contact' ? '#' : this.p('contact/'), publicOnly:true }
    ];

    const navItems = items.map(i =>
      `<a href="${i.href}" data-page="${i.id}" class="pill-item ${cp===i.id?'active':''} ${i.auth?'auth-gated hidden ':''}${i.publicOnly?'public-only ':''}">
        <span class="pi-icon material-symbols-outlined">${i.icon}</span>
        <span class="pi-label">${i.label}</span>
      </a>`
    ).join('');

    const navM = items.map(i =>
      `<a href="${i.href}" class="text-lg font-medium text-on-surface-variant hover:text-primary transition-colors py-2 pl-3 ${i.auth?'auth-gated hidden ':''}${i.publicOnly?'public-only ':''}${cp===i.id?'text-primary font-semibold border-l-4 border-primary':''}">${i.label}</a>`
    ).join('');

    const h = `
      <header class="site-header">
        <div class="site-header-inner">
          <a href="${cp==='home'?'#':this.p('index.html')}" class="flex items-center gap-2 group z-10">
            <span class="material-symbols-outlined logo-icon text-primary text-2xl md:text-3xl group-hover:scale-110 group-hover:rotate-[8deg]">insights</span>
            <span class="text-xl md:text-2xl font-bold font-display tracking-tight bg-gradient-to-r from-primary to-primary-container bg-clip-text text-transparent group-hover:brightness-110 transition-all duration-300">NutriAI</span>
          </a>
          <div class="pill-wrap" id="pillWrap">
            <div class="pill-bar" id="pillBar">
              <div class="pill-lamp" id="pillLamp"></div>
              <div class="pill-glow" id="pillGlow"></div>
              ${navItems}
            </div>
          </div>
          <div class="flex items-center gap-2 z-10">
            <button onclick="NutriUI.openAuthModal()" id="signInBtn" class="btn-glow bg-primary/15 border border-primary/40 hover:bg-primary hover:text-on-primary text-primary px-5 py-2 text-sm rounded-full font-semibold">Sign In</button>
            <button onclick="NutriUI.toggleMobileMenu()" id="menuToggle" class="md:hidden text-on-surface hover:text-primary"><span id="menuIcon" class="material-symbols-outlined text-2xl">menu</span></button>
          </div>
        </div>
        <div id="mobileMenu" class="hidden md:hidden absolute top-full left-0 right-0 bg-surface/95 backdrop-blur-xl border-b border-outline-variant/30 flex flex-col p-6 space-y-4 shadow-xl animate-fade-in">
          ${navM}
          <div id="mobileUserSection" class="hidden border-t border-outline-variant/20 pt-4 mt-2 space-y-2">
            <p id="mobileUserEmail" class="text-xs text-on-surface-variant px-1 truncate"></p>
            <button onclick="NutriUI.openSettings()" class="w-full text-left text-sm font-medium text-on-surface-variant hover:text-primary py-2 pl-1 transition-colors flex items-center gap-2"><span class="material-symbols-outlined text-sm">settings</span> API Key Settings</button>
            <button onclick="NutriUI.signOut()" class="w-full text-left text-sm font-medium text-error hover:text-error py-2 pl-1 transition-colors flex items-center gap-2"><span class="material-symbols-outlined text-sm">logout</span> Sign Out</button>
          </div>
        </div>
      </header>`;

    document.body.insertAdjacentHTML('afterbegin', h);
    requestAnimationFrame(() => this.positionLamp());
  },

  positionLamp() {
    const lamp = document.getElementById('pillLamp');
    const glow = document.getElementById('pillGlow');
    const active = document.querySelector('.pill-item.active');
    const bar = document.getElementById('pillBar');
    if (!lamp || !glow || !active || !bar) return;
    const br = bar.getBoundingClientRect();
    const ar = active.getBoundingClientRect();
    lamp.style.left = (ar.left - br.left) + 'px';
    lamp.style.width = ar.width + 'px';
    glow.style.left = (ar.left - br.left + ar.width/2) + 'px';
  },

  injectFooter() {
    const f = `<footer class="bg-surface-container/20 border-t border-outline-variant/20 py-12 mt-auto">
      <div class="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div class="text-sm text-on-surface-variant font-medium">© 2026 NutriAI — All rights reserved</div>
        <div class="flex flex-wrap justify-center gap-6 text-sm text-on-surface-variant font-medium">
          <a href="#" class="hover:text-primary transition-colors">Privacy Policy</a>
          <a href="#" class="hover:text-primary transition-colors">Terms of Service</a>
          <a href="${this.p('contact/')}" class="hover:text-primary transition-colors">Contact</a>
        </div>
        <div class="flex items-center gap-4">
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" class="w-10 h-10 rounded-full bg-surface-container border border-outline-variant/30 flex items-center justify-center text-on-surface-variant hover:text-primary hover:border-primary/50 hover:scale-105 transition-all">
            <svg class="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" class="w-10 h-10 rounded-full bg-surface-container border border-outline-variant/30 flex items-center justify-center text-on-surface-variant hover:text-primary hover:border-primary/50 hover:scale-105 transition-all">
            <svg class="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
          </a>
          <a href="https://github.com" target="_blank" rel="noopener noreferrer" class="w-10 h-10 rounded-full bg-surface-container border border-outline-variant/30 flex items-center justify-center text-on-surface-variant hover:text-primary hover:border-primary/50 hover:scale-105 transition-all">
            <svg class="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
          </a>
        </div>
      </div>
    </footer>`;
    document.body.insertAdjacentHTML('beforeend', f);
  },

  injectAuthModal() {
    const m = `<div id="authModal" class="fixed inset-0 bg-background/80 backdrop-blur-md hidden items-center justify-center z-[60] p-4">
      <div class="bg-surface-container border border-outline-variant w-full max-w-md rounded-2xl p-8 relative shadow-2xl">
        <button onclick="NutriUI.closeAuthModal()" class="absolute top-4 right-4 text-on-surface-variant hover:text-on-surface transition-colors"><span class="material-symbols-outlined">close</span></button>
        <div class="text-center mb-6">
          <h2 class="text-2xl font-bold font-display text-on-surface mb-2">Welcome to NutriAI</h2>
          <p class="text-sm text-on-surface-variant">Sign in or create your account</p>
        </div>
        <div class="flex border-b border-outline-variant/30 mb-6">
          <button id="tabSignIn" onclick="NutriUI.switchAuthTab('signin')" class="flex-1 pb-2 text-sm font-semibold border-b-2 border-primary text-primary transition-all">Sign In</button>
          <button id="tabSignUp" onclick="NutriUI.switchAuthTab('signup')" class="flex-1 pb-2 text-sm font-semibold border-b-2 border-transparent text-on-surface-variant hover:text-on-surface transition-all">Sign Up</button>
        </div>
        <form id="authForm" onsubmit="NutriUI.handleAuthSubmit(event)" class="space-y-4">
          <div><label class="block text-xs font-mono uppercase text-on-surface-variant mb-1">Email</label><input type="email" id="authEmail" required class="w-full bg-surface-container-lowest border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary rounded-lg px-4 py-2.5 text-sm text-on-surface placeholder:text-on-surface-variant/40" placeholder="name@domain.com"></div>
          <div><label class="block text-xs font-mono uppercase text-on-surface-variant mb-1">Password</label><input type="password" id="authPassword" required class="w-full bg-surface-container-lowest border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary rounded-lg px-4 py-2.5 text-sm text-on-surface placeholder:text-on-surface-variant/40" placeholder="••••••••"></div>
          <button type="submit" id="authSubmitBtn" class="w-full py-3 bg-primary text-on-primary hover:brightness-110 text-sm font-semibold rounded-lg transition-all duration-300">Sign In</button>
        </form>
      </div>
    </div>`;
    document.body.insertAdjacentHTML('beforeend', m);
  },

  authMode: 'signin',
  _authLoading: false,

  toggleMobileMenu() {
    const m = document.getElementById('mobileMenu');
    const i = document.getElementById('menuIcon');
    if (!m || !i) return;
    if (m.classList.contains('hidden')) { m.classList.remove('hidden'); i.textContent = 'close'; }
    else { m.classList.add('hidden'); i.textContent = 'menu'; }
  },

  openAuthModal() {
    const m = document.getElementById('authModal');
    if (m) { m.classList.remove('hidden'); m.classList.add('flex'); }
  },
  closeAuthModal() {
    const m = document.getElementById('authModal');
    if (m) { m.classList.add('hidden'); m.classList.remove('flex'); }
  },
  switchAuthTab(mode) {
    this.authMode = mode;
    const si = document.getElementById('tabSignIn');
    const su = document.getElementById('tabSignUp');
    const btn = document.getElementById('authSubmitBtn');
    if (!si || !su || !btn) return;
    if (mode === 'signin') {
      si.className = "flex-1 pb-2 text-sm font-semibold border-b-2 border-primary text-primary transition-all";
      su.className = "flex-1 pb-2 text-sm font-semibold border-b-2 border-transparent text-on-surface-variant hover:text-on-surface transition-all";
      btn.textContent = "Sign In";
    } else {
      su.className = "flex-1 pb-2 text-sm font-semibold border-b-2 border-primary text-primary transition-all";
      si.className = "flex-1 pb-2 text-sm font-semibold border-b-2 border-transparent text-on-surface-variant hover:text-on-surface transition-all";
      btn.textContent = "Sign Up";
    }
  },

  toggleUserMenu(event) {
    if (event) event.stopPropagation();
    const dd = document.getElementById('userDropdown');
    if (dd) dd.classList.toggle('hidden');
  },

  openSettings() {
    const dd = document.getElementById('userDropdown');
    if (dd) dd.classList.add('hidden');
    const sm = document.getElementById('settingsModal');
    if (sm) { sm.classList.remove('hidden'); sm.classList.add('flex'); }
    const keyInput = document.getElementById('settingsApiKey');
    if (keyInput) {
      keyInput.value = NutriAIAgent.config.apiKey || '';
      keyInput.focus();
    }
  },

  closeSettings() {
    const m = document.getElementById('settingsModal');
    if (m) { m.classList.add('hidden'); m.classList.remove('flex'); }
  },

  async handleSettingsSubmit(event) {
    event.preventDefault();
    const key = document.getElementById('settingsApiKey').value.trim();
    if (!key) return;
    try {
      await NutriAIAgent.setApiKey(key);
      this.closeSettings();
      document.dispatchEvent(new Event('nutri-apikey-changed'));
    } catch (err) {
      alert('Error saving key: ' + err.message);
    }
  },

  injectSettingsModal() {
    const m = `<div id="settingsModal" class="fixed inset-0 bg-background/80 backdrop-blur-md hidden items-center justify-center z-[60] p-4">
      <div class="bg-surface-container border border-outline-variant w-full max-w-md rounded-2xl p-8 relative shadow-2xl">
        <button onclick="NutriUI.closeSettings()" class="absolute top-4 right-4 text-on-surface-variant hover:text-on-surface"><span class="material-symbols-outlined">close</span></button>
        <div class="text-center mb-6">
          <span class="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 text-primary mb-4"><span class="material-symbols-outlined text-3xl">key</span></span>
          <h2 class="text-2xl font-bold font-display text-on-surface mb-2">API Key</h2>
          <p class="text-sm text-on-surface-variant">Your Groq API key enables AI analysis &amp; calorie estimation. Saved to your account.</p>
        </div>
        <form onsubmit="NutriUI.handleSettingsSubmit(event)" class="space-y-4">
          <div><label class="block text-xs font-mono uppercase text-on-surface-variant mb-1">Groq API Key</label><input type="password" id="settingsApiKey" required class="w-full bg-surface-container-lowest border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary rounded-lg px-4 py-2.5 text-sm text-on-surface placeholder:text-on-surface-variant/40" placeholder="gsk_..."></div>
          <p class="text-xs text-on-surface-variant">Get your free key at <a href="https://console.groq.com/keys" target="_blank" class="text-primary underline">console.groq.com</a></p>
          <button type="submit" id="settingsSaveBtn" class="w-full py-3 bg-primary text-on-primary hover:brightness-110 text-sm font-semibold rounded-lg transition-all duration-300">Save</button>
        </form>
      </div>
    </div>`;
    document.body.insertAdjacentHTML('beforeend', m);
  },

  async handleAuthSubmit(event) {
    event.preventDefault();
    if (this._authLoading) return;
    this._authLoading = true;
    const btn = document.getElementById('authSubmitBtn');
    const orig = btn.textContent;
    btn.textContent = 'Processing...';
    btn.disabled = true;
    const email = document.getElementById('authEmail').value;
    const password = document.getElementById('authPassword').value;
    try {
      if (this.authMode === 'signin') {
        await NutriDB.signIn(email, password);
      } else {
        await NutriDB.signUp(email, password);
        alert('Account created! Check your email to confirm.');
        this.switchAuthTab('signin');
        btn.textContent = orig; btn.disabled = false; this._authLoading = false;
        return;
      }
      await this.updateAuthUI();
      this.closeAuthModal();
      window.location.href = this.p('dashboard/');
    } catch (err) {
      alert(err.message || 'Auth error');
    }
    btn.textContent = orig;
    btn.disabled = false;
    this._authLoading = false;
  },

  async signOut() {
    try { await NutriDB.signOut(); this.updateAuthUI(); window.location.href = this.p('index.html'); }
    catch (err) { alert(err.message); }
  },

  async getUser() {
    try { return await NutriDB.getUser(); }
    catch { return null; }
  },

  async updateAuthUI() {
    const user = await this.getUser();
    const sb = document.getElementById('signInBtn');
    const mu = document.getElementById('mobileUserSection');
    const mue = document.getElementById('mobileUserEmail');
    document.querySelectorAll('.auth-gated').forEach(el => el.classList.toggle('hidden', !user));
    document.querySelectorAll('.public-only').forEach(el => el.classList.toggle('hidden', !!user));
    if (user) {
      if (sb) sb.classList.add('hidden');
      if (mue) mue.textContent = user.email;
      if (mu) { mu.classList.remove('hidden'); mu.classList.add('block'); }
      const avatarUrl = user.user_metadata?.avatar_url || user.identities?.[0]?.identity_data?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.email)}&background=d4834a&color=12120f`;
      let um = document.getElementById('userMenu');
      if (!um) {
        um = document.createElement('div');
        um.id = 'userMenu';
        um.className = 'block relative';
        um.innerHTML = `
          <button onclick="NutriUI.toggleUserMenu(event)" class="w-10 h-10 md:w-11 md:h-11 rounded-full border-2 border-primary/60 overflow-hidden flex items-center justify-center bg-surface-container cursor-pointer hover:shadow-[0_0_0_3px_rgba(232,168,124,0.15),0_0_20px_rgba(232,168,124,0.15)] hover:border-primary transition-all"><img id="userAvatar" alt="" class="w-full h-full object-cover"></button>
          <div id="userDropdown" class="absolute right-0 mt-2 w-56 bg-surface-container-low border border-outline-variant rounded-xl p-2 hidden z-50 shadow-xl">
            <p id="userEmailDisplay" class="text-sm text-on-surface-variant px-3 py-2 truncate font-medium">${user.email}</p>
            <hr class="border-outline-variant/30 my-1"/>
            <button onclick="NutriUI.openSettings()" class="w-full text-left text-sm hover:bg-surface-container px-3 py-2.5 rounded-lg transition-colors flex items-center gap-2 hover:translate-x-0.5 transition-all"><span class="material-symbols-outlined">settings</span> API Key</button>
            <button onclick="NutriUI.signOut()" class="w-full text-left text-sm hover:bg-surface-container hover:text-error px-3 py-2.5 rounded-lg transition-colors flex items-center gap-2 hover:translate-x-0.5 transition-all"><span class="material-symbols-outlined">logout</span> Sign Out</button>
          </div>`;
        const mt = document.getElementById('menuToggle');
        if (mt) mt.parentNode.insertBefore(um, mt);
      }
      const ua = document.getElementById('userAvatar');
      if (ua) ua.src = avatarUrl;
    } else {
      if (sb) sb.classList.remove('hidden');
      if (mu) { mu.classList.remove('block'); mu.classList.add('hidden'); }
      const um = document.getElementById('userMenu');
      if (um) um.remove();
    }
  },

  updateActiveNav() {
    const cp = this.config.currentPage;
    document.querySelectorAll('.pill-item').forEach(el => {
      el.classList.toggle('active', el.dataset.page === cp);
    });
  },

  async hasGoals() {
    try {
      const g = await NutriDB.getUserGoals();
      return !!(g && g.goalCalories);
    } catch { return false; }
  },

  openQuestionnaire() {
    const m = document.getElementById('questionnaireModal');
    if (m) { m.classList.remove('hidden'); m.classList.add('flex'); }
  },
  closeQuestionnaire() {
    const m = document.getElementById('questionnaireModal');
    if (m) { m.classList.add('hidden'); m.classList.remove('flex'); }
  }
};
