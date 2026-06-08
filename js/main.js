/**
 * MELIA Beauty Salon — メインスクリプト
 *
 * 機能一覧:
 * 1. ハンバーガーメニューの開閉
 * 2. スムーススクロール
 * 3. FAQアコーディオン
 * 4. ページトップへ戻るボタン
 * 5. スクロール時にヘッダーに影をつける
 * 6. スクロールアニメーション（フェードイン）
 * 7. 予約フォーム・管理画面
 */

'use strict';

/* ============================================================
   1. ハンバーガーメニューの開閉
============================================================ */
(function initHamburger() {
  const hamburger = document.getElementById('hamburger');
  const spMenu    = document.getElementById('sp-menu');

  if (!hamburger || !spMenu) return;

  // メニューを開く / 閉じる
  function toggleMenu(open) {
    hamburger.classList.toggle('open', open);
    hamburger.setAttribute('aria-expanded', String(open));

    if (open) {
      spMenu.removeAttribute('hidden');
    } else {
      spMenu.setAttribute('hidden', '');
    }
  }

  // ハンバーガーボタンクリック
  hamburger.addEventListener('click', function () {
    const isOpen = hamburger.classList.contains('open');
    toggleMenu(!isOpen);
  });

  // スマホメニュー内のリンクをクリックしたらメニューを閉じる
  spMenu.querySelectorAll('.sp-nav-link').forEach(function (link) {
    link.addEventListener('click', function () {
      toggleMenu(false);
    });
  });

  // メニュー外をクリックしたらメニューを閉じる
  document.addEventListener('click', function (e) {
    if (!hamburger.contains(e.target) && !spMenu.contains(e.target)) {
      toggleMenu(false);
    }
  });

  // ESCキーでメニューを閉じる
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      toggleMenu(false);
    }
  });
})();


/* ============================================================
   2. スムーススクロール
   ※ CSS scroll-behavior: smooth だけでは offset（ヘッダー分）が
     調整できないため、JSで制御しています。
============================================================ */
(function initSmoothScroll() {
  // ヘッダーの高さ（固定ヘッダー分のオフセット）
  const OFFSET = 80;

  // href="#..." のすべてのリンクを対象にする
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const hash = this.getAttribute('href');

      // "#" のみのリンク（ページトップ）は別処理
      if (hash === '#') {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }

      const target = document.querySelector(hash);
      if (!target) return;

      e.preventDefault();

      // ターゲット要素のトップ位置からヘッダー高さを引いてスクロール
      const top = target.getBoundingClientRect().top + window.scrollY - OFFSET;
      window.scrollTo({ top: top, behavior: 'smooth' });
    });
  });
})();


/* ============================================================
   3. FAQアコーディオン
============================================================ */
(function initFaq() {
  const toggles = document.querySelectorAll('.faq-toggle');

  toggles.forEach(function (toggle) {
    toggle.addEventListener('click', function () {
      const isOpen  = toggle.getAttribute('aria-expanded') === 'true';
      const targetId = toggle.getAttribute('aria-controls');
      const answer   = document.getElementById(targetId);

      if (!answer) return;

      if (isOpen) {
        // 閉じる
        toggle.setAttribute('aria-expanded', 'false');
        answer.setAttribute('hidden', '');
      } else {
        // 他のFAQをすべて閉じる（一つだけ開く仕様）
        toggles.forEach(function (other) {
          const otherId     = other.getAttribute('aria-controls');
          const otherAnswer = document.getElementById(otherId);
          other.setAttribute('aria-expanded', 'false');
          if (otherAnswer) {
            otherAnswer.setAttribute('hidden', '');
          }
        });

        // 対象を開く
        toggle.setAttribute('aria-expanded', 'true');
        answer.removeAttribute('hidden');
      }
    });
  });
})();


/* ============================================================
   4. ページトップへ戻るボタン
============================================================ */
(function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;

  // 200px 以上スクロールしたら表示
  const SHOW_THRESHOLD = 200;

  function updateVisibility() {
    if (window.scrollY > SHOW_THRESHOLD) {
      btn.removeAttribute('hidden');
    } else {
      btn.setAttribute('hidden', '');
    }
  }

  window.addEventListener('scroll', updateVisibility, { passive: true });

  btn.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // 初期チェック
  updateVisibility();
})();


/* ============================================================
   5. スクロール時にヘッダーに影をつける
============================================================ */
(function initHeaderScroll() {
  const header = document.getElementById('site-header');
  if (!header) return;

  function updateHeader() {
    if (window.scrollY > 10) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', updateHeader, { passive: true });

  // 初期チェック（ページをリロードしてスクロール位置が0以外の場合）
  updateHeader();
})();


/* ============================================================
   6. スクロールアニメーション（フェードイン）
   IntersectionObserver を使ってセクションが
   画面内に入ったときにふわっと表示する
============================================================ */
(function initScrollAnimation() {
  // IntersectionObserver が使えない古いブラウザでは全要素を表示
  if (!('IntersectionObserver' in window)) {
    document.querySelectorAll('.fade-in').forEach(function (el) {
      el.classList.add('visible');
    });
    return;
  }

  const options = {
    root: null,           // ビューポートを基準
    rootMargin: '0px',
    threshold: 0.12       // 要素の12%が見えたら発火
  };

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // 一度表示したら監視を解除（毎回アニメーションしない）
        observer.unobserve(entry.target);
      }
    });
  }, options);

  // .fade-in クラスを持つすべての要素を監視対象に
  document.querySelectorAll('.fade-in').forEach(function (el) {
    observer.observe(el);
  });
})();


/* ============================================================
   7. 予約フォーム・管理画面
   グローバル関数として定義（HTML の onclick から呼び出す）
============================================================ */

const RF_KEYS = {
  RESERVATIONS: 'melia_rf_reservations',
  CUSTOMERS: 'melia_rf_customers',
  STAFF: 'melia_rf_staff',
  SETTINGS: 'melia_rf_settings',
  AUTH: 'melia_rf_auth',
  INITIALIZED: 'melia_rf_initialized'
};

const SERVICES = [
  { name: 'Facial Care', amount: 12000 },
  { name: 'Body Treatment', amount: 15000 },
  { name: 'Bridal Beauty', amount: 28000 },
  { name: 'カウンセリング', amount: 5000 },
  { name: '定期メンテナンス', amount: 9000 }
];

const STATUS_LABELS = {
  reserved: '予約済み',
  visited: '来店済み',
  cancelled: 'キャンセル',
  no_show: '無断キャンセル'
};

const CUSTOMER_TAG_LABELS = {
  vip: 'VIP',
  new: '新規',
  repeater: 'リピーター',
  caution: '要注意'
};

const STAFF_STATUS_LABELS = {
  active: '稼働中',
  off: '休み',
  resigned: '退職'
};

const DEMO_ACCOUNTS = [
  { email: 'admin@example.com', password: 'password', role: 'admin', name: '管理者' },
  { email: 'staff@example.com', password: 'password', role: 'staff', name: 'スタッフ' }
];

let adminState = {
  view: 'dashboard',
  month: getMonthInputValue(new Date()),
  calendarDate: new Date(),
  selectedDate: getTodayInputValue(),
  editingReservationId: '',
  editingCustomerId: '',
  editingStaffId: '',
  reservationFilters: {
    q: '',
    date: '',
    status: '',
    staffId: ''
  }
};

function safeGet(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (e) {
    return fallback;
  }
}

function safeSet(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function getReservations() {
  return safeGet(RF_KEYS.RESERVATIONS, []);
}

function saveReservations(reservations) {
  safeSet(RF_KEYS.RESERVATIONS, reservations);
}

function getCustomers() {
  return safeGet(RF_KEYS.CUSTOMERS, []);
}

function saveCustomers(customers) {
  safeSet(RF_KEYS.CUSTOMERS, customers);
}

function getStaff() {
  return safeGet(RF_KEYS.STAFF, []);
}

function saveStaff(staff) {
  safeSet(RF_KEYS.STAFF, staff);
}

function getSettings() {
  return safeGet(RF_KEYS.SETTINGS, {
    storeName: 'MELIA Beauty Salon',
    openTime: '10:00',
    closeTime: '19:00',
    closedDays: ['水'],
    reservationUnit: 60,
    cancellationDeadline: 24,
    notificationEmail: 'admin@example.com'
  });
}

function saveSettings(settings) {
  safeSet(RF_KEYS.SETTINGS, settings);
}

function getAuthUser() {
  return safeGet(RF_KEYS.AUTH, null);
}

function saveAuthUser(user) {
  safeSet(RF_KEYS.AUTH, user);
}

function createReservationId() {
  const now = new Date();
  const date = [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, '0'),
    String(now.getDate()).padStart(2, '0')
  ].join('');
  const suffix = String(now.getTime()).slice(-5);
  return `ML-${date}-${suffix}`;
}

function createId(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2, 7)}`;
}

function getTodayInputValue() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const date = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${date}`;
}

function getMonthInputValue(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}

function formatDateTime(iso) {
  const date = new Date(iso);
  return date.toLocaleString('ja-JP', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
}

function formatCurrency(amount) {
  return `¥${Number(amount || 0).toLocaleString('ja-JP')}`;
}

function toDateTimeLocalValue(iso) {
  if (!iso) return `${getTodayInputValue()}T10:00`;
  const date = new Date(iso);
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, '0'),
    String(date.getDate()).padStart(2, '0')
  ].join('-') + 'T' + [
    String(date.getHours()).padStart(2, '0'),
    String(date.getMinutes()).padStart(2, '0')
  ].join(':');
}

function dateTimeLocalToIso(value) {
  return new Date(value).toISOString();
}

function escapeHtml(value) {
  return String(value || '').replace(/[&<>"']/g, function (char) {
    return {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    }[char];
  });
}

function downloadCsv(filename, rows) {
  const csv = rows.map(function (row) {
    return row.map(function (cell) {
      return `"${String(cell || '').replace(/"/g, '""')}"`;
    }).join(',');
  }).join('\n');
  const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function seedAdminData() {
  if (safeGet(RF_KEYS.INITIALIZED, false)) return;

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const addDays = function (days, hour) {
    const date = new Date(today);
    date.setDate(date.getDate() + days);
    date.setHours(hour || 10, 0, 0, 0);
    return date.toISOString();
  };

  const staff = [
    { id: 's-aoi', name: '田中 葵', role: 'シニアエステティシャン', email: 'aoi@melia.demo', phone: '090-1000-2000', status: 'active', createdAt: addDays(-700, 10) },
    { id: 's-rina', name: '佐藤 りな', role: 'ビューティーセラピスト', email: 'rina@melia.demo', phone: '090-1000-3000', status: 'active', createdAt: addDays(-420, 10) },
    { id: 's-mika', name: '中村 美香', role: 'ブライダル担当', email: 'mika@melia.demo', phone: '090-1000-4000', status: 'off', createdAt: addDays(-180, 10) }
  ];

  const customers = [
    { id: 'c-01', name: '山田 花', phone: '080-1111-2222', email: 'hana@example.com', visitCount: 8, lastReservationDate: addDays(-4, 12), tags: ['vip', 'repeater'], memo: '敏感肌。施術前に赤みを確認。', createdAt: addDays(-400, 10) },
    { id: 'c-02', name: '佐々木 美咲', phone: '080-2222-3333', email: 'misaki@example.com', visitCount: 2, lastReservationDate: addDays(1, 13), tags: ['new'], memo: 'ブライダル相談。', createdAt: addDays(-30, 10) },
    { id: 'c-03', name: '小林 優子', phone: '080-3333-4444', email: 'yuko@example.com', visitCount: 12, lastReservationDate: addDays(0, 15), tags: ['vip', 'repeater'], memo: '月1回の定期ケア。', createdAt: addDays(-520, 10) },
    { id: 'c-04', name: '渡辺 愛', phone: '080-4444-5555', email: 'ai@example.com', visitCount: 0, lastReservationDate: '', tags: ['new'], memo: '', createdAt: addDays(-2, 10) }
  ];

  const reservations = [
    { id: 'r-01', dateTime: addDays(0, 10), customerId: 'c-03', customerName: '小林 優子', staffId: 's-aoi', staffName: '田中 葵', serviceName: 'Facial Care', amount: 12000, status: 'reserved', memo: '保湿中心。', createdAt: addDays(-5, 10) },
    { id: 'r-02', dateTime: addDays(0, 14), customerId: 'c-01', customerName: '山田 花', staffId: 's-rina', staffName: '佐藤 りな', serviceName: 'Body Treatment', amount: 15000, status: 'visited', memo: '', createdAt: addDays(-8, 10) },
    { id: 'r-03', dateTime: addDays(1, 11), customerId: 'c-02', customerName: '佐々木 美咲', staffId: 's-mika', staffName: '中村 美香', serviceName: 'Bridal Beauty', amount: 28000, status: 'reserved', memo: '挙式2ヶ月前。', createdAt: addDays(-3, 10) },
    { id: 'r-04', dateTime: addDays(-6, 16), customerId: 'c-01', customerName: '山田 花', staffId: 's-aoi', staffName: '田中 葵', serviceName: '定期メンテナンス', amount: 9000, status: 'visited', memo: '', createdAt: addDays(-12, 10) },
    { id: 'r-05', dateTime: addDays(5, 13), customerId: 'c-04', customerName: '渡辺 愛', staffId: 's-rina', staffName: '佐藤 りな', serviceName: 'カウンセリング', amount: 5000, status: 'reserved', memo: '初回来店。', createdAt: addDays(-1, 10) }
  ];

  saveStaff(staff);
  saveCustomers(customers);
  saveReservations(reservations);
  saveSettings(getSettings());
  safeSet(RF_KEYS.INITIALIZED, true);
}

function setBodyLocked(isLocked) {
  document.body.style.overflow = isLocked ? 'hidden' : '';
}

function showReserveDemo() {
  showReserveModal();
}

function showReserveModal() {
  const modal = document.getElementById('reserve-modal');
  const form = document.getElementById('reserve-form');
  const success = document.getElementById('reserve-success');
  if (!modal) return;

  if (success) {
    success.setAttribute('hidden', '');
    success.textContent = '';
  }

  modal.removeAttribute('hidden');
  setBodyLocked(true);

  const firstInput = form ? form.querySelector('input, select, textarea, button') : null;
  if (firstInput) {
    firstInput.focus();
  }
}

function closeModal() {
  const modal = document.getElementById('reserve-modal');
  if (!modal) return;

  modal.setAttribute('hidden', '');
  setBodyLocked(false);
}

function showAdminPanel() {
  const modal = document.getElementById('admin-modal');
  if (!modal) return;

  seedAdminData();
  renderAdminApp();
  modal.removeAttribute('hidden');
  setBodyLocked(true);

  const closeBtn = document.getElementById('admin-close');
  if (closeBtn) {
    closeBtn.focus();
  }
}

function closeAdminPanel() {
  const modal = document.getElementById('admin-modal');
  if (!modal) return;

  modal.setAttribute('hidden', '');
  setBodyLocked(false);
}

function setAdminView(view) {
  adminState.view = view;
  adminState.editingReservationId = '';
  adminState.editingCustomerId = '';
  adminState.editingStaffId = '';
  renderAdminApp();
}

function renderAdminApp() {
  const root = document.getElementById('admin-app-root');
  if (!root) return;
  const user = getAuthUser();

  if (!user) {
    root.innerHTML = renderAdminLogin();
    return;
  }

  const navItems = [
    ['dashboard', 'Dashboard'],
    ['reservations', 'Reservations'],
    ['calendar', 'Calendar'],
    ['customers', 'Customers'],
    ['staff', 'Staff'],
    ['reports', 'Reports'],
    ['settings', 'Settings']
  ].filter(function (item) {
    return user.role === 'admin' || !['staff', 'reports', 'settings'].includes(item[0]);
  });

  root.innerHTML = `
    <div class="admin-shell">
      <aside class="admin-sidebar">
        <div class="admin-brand">
          <span class="admin-brand-main">MELIA</span>
          <span class="admin-brand-sub">ReserveFlow</span>
        </div>
        <nav class="admin-nav" aria-label="管理画面メニュー">
          ${navItems.map(function (item) {
            return `<button type="button" class="${adminState.view === item[0] ? 'active' : ''}" onclick="setAdminView('${item[0]}')">${item[1]}</button>`;
          }).join('')}
        </nav>
      </aside>
      <section class="admin-main">
        <header class="admin-header">
          <div>
            <p class="section-label">Admin</p>
            <h2 id="admin-title">${escapeHtml(getSettings().storeName)} 管理画面</h2>
          </div>
          <div class="admin-user">
            <span>${escapeHtml(user.name)} / ${user.role === 'admin' ? '管理者' : 'スタッフ'}</span>
            <button type="button" onclick="adminLogout()">ログアウト</button>
          </div>
        </header>
        <div class="admin-content">
          ${renderAdminView(user)}
        </div>
      </section>
    </div>
  `;
}

function renderAdminLogin() {
  return `
    <div class="admin-login-screen">
      <div class="admin-login-card">
        <p class="section-label">Admin Login</p>
        <h2 id="admin-title">MELIA 管理画面</h2>
        <p>予約・顧客・スタッフ・売上を確認するためのログイン画面です。</p>
        <form id="admin-login-form" class="admin-login-form">
          <label>メールアドレス<input type="email" name="email" placeholder="admin@example.com" required></label>
          <label>パスワード<input type="password" name="password" placeholder="password" required></label>
          <p class="admin-login-error" id="admin-login-error" hidden></p>
          <button type="submit" class="btn btn-primary">ログイン</button>
        </form>
        <div class="demo-accounts">
          ${DEMO_ACCOUNTS.map(function (account) {
            return `<button type="button" onclick="fillAdminDemo('${account.email}', '${account.password}')">
              <strong>${account.role === 'admin' ? '管理者' : 'スタッフ'}</strong>
              <span>${account.email} / ${account.password}</span>
            </button>`;
          }).join('')}
        </div>
      </div>
    </div>
  `;
}

function renderAdminView(user) {
  if (user.role !== 'admin' && ['staff', 'reports', 'settings'].includes(adminState.view)) {
    adminState.view = 'dashboard';
  }

  if (adminState.view === 'reservations') return renderReservationsPage();
  if (adminState.view === 'calendar') return renderCalendarPage();
  if (adminState.view === 'customers') return renderCustomersPage();
  if (adminState.view === 'staff') return renderStaffPage();
  if (adminState.view === 'reports') return renderReportsPage();
  if (adminState.view === 'settings') return renderSettingsPage();
  return renderDashboardPage();
}

function renderDashboardPage() {
  const reservations = getReservations();
  const customers = getCustomers();
  const staff = getStaff();
  const today = getTodayInputValue();
  const thisMonth = getMonthInputValue(new Date());
  const todayReservations = reservations.filter(function (r) { return r.dateTime.slice(0, 10) === today; });
  const monthlyVisited = reservations.filter(function (r) { return r.dateTime.slice(0, 7) === thisMonth && r.status === 'visited'; });
  const monthlySales = monthlyVisited.reduce(function (sum, r) { return sum + Number(r.amount || 0); }, 0);
  const upcoming = reservations.filter(function (r) { return r.status === 'reserved'; }).sort(function (a, b) { return a.dateTime.localeCompare(b.dateTime); }).slice(0, 6);

  return `
    <div class="admin-grid-cards">
      ${statCard('今日の予約', `${todayReservations.length}件`)}
      ${statCard('今月の売上', formatCurrency(monthlySales))}
      ${statCard('顧客数', `${customers.length}名`)}
      ${statCard('スタッフ数', `${staff.length}名`)}
    </div>
    <div class="admin-two-col">
      <div class="admin-panel">
        <h3>本日の予約</h3>
        ${renderReservationMiniList(todayReservations)}
      </div>
      <div class="admin-panel">
        <h3>直近の予約</h3>
        ${renderReservationMiniList(upcoming)}
      </div>
    </div>
    <div class="admin-two-col">
      <div class="admin-panel">${renderMonthlySalesChart()}</div>
      <div class="admin-panel">${renderStaffBookingChart()}</div>
    </div>
  `;
}

function statCard(label, value) {
  return `<article class="admin-stat"><span>${label}</span><strong>${value}</strong></article>`;
}

function renderReservationMiniList(items) {
  if (!items.length) return '<p class="admin-empty-text">該当する予約はありません。</p>';
  return `<ul class="admin-mini-list">${items.map(function (r) {
    return `<li><span>${formatDateTime(r.dateTime)}</span><strong>${escapeHtml(r.customerName)}</strong><em>${escapeHtml(r.serviceName)} / ${escapeHtml(STATUS_LABELS[r.status])}</em></li>`;
  }).join('')}</ul>`;
}

function renderMonthlySalesChart() {
  const reservations = getReservations();
  const months = [];
  const base = new Date();
  for (let i = 5; i >= 0; i -= 1) {
    const d = new Date(base.getFullYear(), base.getMonth() - i, 1);
    months.push(getMonthInputValue(d));
  }
  const values = months.map(function (month) {
    return reservations.filter(function (r) { return r.dateTime.slice(0, 7) === month && r.status === 'visited'; }).reduce(function (sum, r) { return sum + Number(r.amount || 0); }, 0);
  });
  const max = Math.max.apply(null, values.concat([1]));
  return `<h3>月別売上</h3><div class="bar-chart">${months.map(function (month, index) {
    return `<div class="bar-item"><div class="bar-track"><span style="height:${Math.max(6, (values[index] / max) * 100)}%"></span></div><small>${month.slice(5)}</small><em>${formatCurrency(values[index])}</em></div>`;
  }).join('')}</div>`;
}

function renderStaffBookingChart() {
  const reservations = getReservations();
  const staff = getStaff();
  const counts = staff.map(function (s) {
    return { name: s.name, count: reservations.filter(function (r) { return r.staffId === s.id; }).length };
  });
  const max = Math.max.apply(null, counts.map(function (item) { return item.count; }).concat([1]));
  return `<h3>スタッフ別予約数</h3><div class="rank-list">${counts.map(function (item) {
    return `<div class="rank-row"><span>${escapeHtml(item.name)}</span><div><i style="width:${(item.count / max) * 100}%"></i></div><strong>${item.count}件</strong></div>`;
  }).join('')}</div>`;
}

function renderReservationsPage() {
  const reservations = filterReservations();
  return `
    <div class="admin-page-head">
      <h3>予約管理</h3>
      <div><button type="button" class="admin-action" onclick="startReservationEdit('')">予約を追加</button><button type="button" class="admin-action ghost" onclick="exportReservationsCsv()">CSV出力</button></div>
    </div>
    ${renderReservationFilters()}
    ${adminState.editingReservationId ? renderReservationEditor(adminState.editingReservationId) : ''}
    ${renderReservationsTable(reservations)}
  `;
}

function filterReservations() {
  const filters = adminState.reservationFilters;
  return getReservations().filter(function (r) {
    return (!filters.q || r.customerName.includes(filters.q) || r.serviceName.includes(filters.q)) &&
      (!filters.date || r.dateTime.slice(0, 10) === filters.date) &&
      (!filters.status || r.status === filters.status) &&
      (!filters.staffId || r.staffId === filters.staffId);
  }).sort(function (a, b) { return a.dateTime.localeCompare(b.dateTime); });
}

function renderReservationFilters() {
  const filters = adminState.reservationFilters;
  return `<div class="admin-filters">
    <input id="admin-filter-q" type="search" placeholder="名前・メニューで検索" value="${escapeHtml(filters.q)}" onchange="updateReservationFilter('q', this.value)">
    <input id="admin-filter-date" type="date" value="${escapeHtml(filters.date)}" onchange="updateReservationFilter('date', this.value)">
    <select id="admin-filter-status" onchange="updateReservationFilter('status', this.value)"><option value="">全ステータス</option>${Object.keys(STATUS_LABELS).map(function (key) { return `<option value="${key}"${filters.status === key ? ' selected' : ''}>${STATUS_LABELS[key]}</option>`; }).join('')}</select>
    <select id="admin-filter-staff" onchange="updateReservationFilter('staffId', this.value)"><option value="">全スタッフ</option>${getStaff().map(function (s) { return `<option value="${s.id}"${filters.staffId === s.id ? ' selected' : ''}>${escapeHtml(s.name)}</option>`; }).join('')}</select>
  </div>`;
}

function updateReservationFilter(key, value) {
  adminState.reservationFilters[key] = value;
  renderAdminApp();
}

function renderReservationsTable(reservations) {
  if (!reservations.length) return '<div class="admin-empty">予約はありません。</div>';
  return `<div class="admin-table-wrap"><table class="admin-table"><thead><tr><th>日時</th><th>お客様</th><th>担当</th><th>メニュー</th><th>金額</th><th>状態</th><th>操作</th></tr></thead><tbody>${reservations.map(function (r) {
    return `<tr><td>${formatDateTime(r.dateTime)}</td><td>${escapeHtml(r.customerName)}</td><td>${escapeHtml(r.staffName)}</td><td>${escapeHtml(r.serviceName)}</td><td>${formatCurrency(r.amount)}</td><td><span class="status-badge ${r.status}">${STATUS_LABELS[r.status]}</span></td><td><button onclick="startReservationEdit('${r.id}')">編集</button><button onclick="deleteReservation('${r.id}')">削除</button></td></tr>`;
  }).join('')}</tbody></table></div>`;
}

function startReservationEdit(id) {
  adminState.editingReservationId = id || 'new';
  renderAdminApp();
}

function renderReservationEditor(id) {
  const isNew = id === 'new';
  const r = isNew ? {} : getReservations().find(function (item) { return item.id === id; }) || {};
  return `<form class="admin-editor" onsubmit="saveReservationFromAdmin(event, '${escapeHtml(id)}')">
    <h4>${isNew ? '予約を追加' : '予約を編集'}</h4>
    <label>日時<input type="datetime-local" name="dateTime" value="${toDateTimeLocalValue(r.dateTime)}" required></label>
    <label>顧客<select name="customerId" required>${getCustomers().map(function (c) { return `<option value="${c.id}"${r.customerId === c.id ? ' selected' : ''}>${escapeHtml(c.name)}</option>`; }).join('')}</select></label>
    <label>担当<select name="staffId" required>${getStaff().map(function (s) { return `<option value="${s.id}"${r.staffId === s.id ? ' selected' : ''}>${escapeHtml(s.name)}</option>`; }).join('')}</select></label>
    <label>サービス<select name="serviceName" required>${SERVICES.map(function (s) { return `<option value="${s.name}"${r.serviceName === s.name ? ' selected' : ''}>${escapeHtml(s.name)} / ${formatCurrency(s.amount)}</option>`; }).join('')}</select></label>
    <label>状態<select name="status">${Object.keys(STATUS_LABELS).map(function (key) { return `<option value="${key}"${r.status === key ? ' selected' : ''}>${STATUS_LABELS[key]}</option>`; }).join('')}</select></label>
    <label class="wide">メモ<textarea name="memo" rows="3">${escapeHtml(r.memo)}</textarea></label>
    <div class="admin-editor-actions"><button class="admin-action" type="submit">保存</button><button class="admin-action ghost" type="button" onclick="cancelAdminEdit()">キャンセル</button></div>
  </form>`;
}

function saveReservationFromAdmin(e, id) {
  e.preventDefault();
  const form = e.target;
  const data = new FormData(form);
  const customer = getCustomers().find(function (c) { return c.id === data.get('customerId'); }) || {};
  const staffMember = getStaff().find(function (s) { return s.id === data.get('staffId'); }) || {};
  const service = SERVICES.find(function (s) { return s.name === data.get('serviceName'); }) || SERVICES[0];
  const reservations = getReservations();
  const item = {
    id: id === 'new' ? createId('r') : id,
    dateTime: dateTimeLocalToIso(data.get('dateTime')),
    customerId: customer.id,
    customerName: customer.name,
    staffId: staffMember.id,
    staffName: staffMember.name,
    serviceName: service.name,
    amount: service.amount,
    status: data.get('status'),
    memo: data.get('memo'),
    createdAt: id === 'new' ? new Date().toISOString() : (reservations.find(function (r) { return r.id === id; }) || {}).createdAt || new Date().toISOString()
  };
  saveReservations(id === 'new' ? reservations.concat([item]) : reservations.map(function (r) { return r.id === id ? item : r; }));
  cancelAdminEdit();
}

function cancelAdminEdit() {
  adminState.editingReservationId = '';
  adminState.editingCustomerId = '';
  adminState.editingStaffId = '';
  renderAdminApp();
}

function deleteReservation(id) {
  if (!window.confirm('この予約を削除しますか？')) return;
  saveReservations(getReservations().filter(function (r) { return r.id !== id; }));
  renderAdminApp();
}

function renderCalendarPage() {
  const y = adminState.calendarDate.getFullYear();
  const m = adminState.calendarDate.getMonth();
  const first = new Date(y, m, 1);
  const start = new Date(y, m, 1 - first.getDay());
  const days = [];
  for (let i = 0; i < 42; i += 1) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    days.push(d);
  }
  const selected = getReservations().filter(function (r) { return r.dateTime.slice(0, 10) === adminState.selectedDate; });
  return `<div class="admin-page-head"><h3>カレンダー</h3><div><button class="admin-action ghost" onclick="moveCalendar(-1)">前月</button><button class="admin-action ghost" onclick="moveCalendar(1)">翌月</button></div></div>
    <h4 class="calendar-title">${y}年${m + 1}月</h4>
    <div class="admin-calendar">${['日','月','火','水','木','金','土'].map(function (w) { return `<b>${w}</b>`; }).join('')}${days.map(function (d) {
      const key = getTodayInputValueFromDate(d);
      const count = getReservations().filter(function (r) { return r.dateTime.slice(0, 10) === key; }).length;
      return `<button class="${d.getMonth() !== m ? 'muted' : ''} ${adminState.selectedDate === key ? 'selected' : ''}" onclick="selectCalendarDate('${key}')"><span>${d.getDate()}</span>${count ? `<em>${count}件</em>` : ''}</button>`;
    }).join('')}</div>
    <div class="admin-panel"><h3>${adminState.selectedDate} の予約</h3>${renderReservationMiniList(selected)}</div>`;
}

function getTodayInputValueFromDate(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function moveCalendar(delta) {
  adminState.calendarDate = new Date(adminState.calendarDate.getFullYear(), adminState.calendarDate.getMonth() + delta, 1);
  renderAdminApp();
}

function selectCalendarDate(date) {
  adminState.selectedDate = date;
  renderAdminApp();
}

function renderCustomersPage() {
  const customers = getCustomers();
  return `<div class="admin-page-head"><h3>顧客管理</h3><button class="admin-action" onclick="startCustomerEdit('new')">顧客を追加</button></div>
    <div id="customer-editor-slot">${adminState.editingCustomerId ? renderCustomerEditor(adminState.editingCustomerId) : ''}</div>
    <div class="admin-card-list">${customers.map(function (c) {
      const history = getReservations().filter(function (r) { return r.customerId === c.id; }).length;
      return `<article class="admin-data-card"><h4>${escapeHtml(c.name)}</h4><p>${escapeHtml(c.phone)}<br>${escapeHtml(c.email)}</p><div>${c.tags.map(function (tag) { return `<span class="tag ${tag}">${CUSTOMER_TAG_LABELS[tag]}</span>`; }).join('')}</div><small>来店 ${c.visitCount}回 / 予約履歴 ${history}件</small><p>${escapeHtml(c.memo)}</p><button onclick="startCustomerEdit('${c.id}')">編集</button><button onclick="deleteCustomer('${c.id}')">削除</button></article>`;
    }).join('')}</div>`;
}

function startCustomerEdit(id) {
  adminState.editingCustomerId = id;
  renderAdminApp();
}

function renderCustomerEditor(id) {
  const isNew = id === 'new';
  const c = isNew ? { tags: ['new'] } : getCustomers().find(function (item) { return item.id === id; }) || { tags: [] };
  return `<form class="admin-editor" onsubmit="saveCustomerFromAdmin(event, '${escapeHtml(id)}')"><h4>${isNew ? '顧客を追加' : '顧客を編集'}</h4>
    <label>名前<input name="name" value="${escapeHtml(c.name)}" required></label><label>電話<input name="phone" value="${escapeHtml(c.phone)}"></label><label>メール<input type="email" name="email" value="${escapeHtml(c.email)}"></label><label>来店回数<input type="number" name="visitCount" value="${c.visitCount || 0}"></label>
    <label class="wide">タグ<select name="tags" multiple>${Object.keys(CUSTOMER_TAG_LABELS).map(function (tag) { return `<option value="${tag}"${(c.tags || []).includes(tag) ? ' selected' : ''}>${CUSTOMER_TAG_LABELS[tag]}</option>`; }).join('')}</select></label>
    <label class="wide">メモ<textarea name="memo">${escapeHtml(c.memo)}</textarea></label><div class="admin-editor-actions"><button class="admin-action">保存</button><button type="button" class="admin-action ghost" onclick="cancelAdminEdit()">キャンセル</button></div></form>`;
}

function saveCustomerFromAdmin(e, id) {
  e.preventDefault();
  const form = e.target;
  const data = new FormData(form);
  const item = { id: id === 'new' ? createId('c') : id, name: data.get('name'), phone: data.get('phone'), email: data.get('email'), visitCount: Number(data.get('visitCount') || 0), lastReservationDate: '', tags: data.getAll('tags'), memo: data.get('memo'), createdAt: new Date().toISOString() };
  const customers = getCustomers();
  saveCustomers(id === 'new' ? customers.concat([item]) : customers.map(function (c) { return c.id === id ? item : c; }));
  cancelAdminEdit();
}

function deleteCustomer(id) {
  if (!window.confirm('この顧客を削除しますか？')) return;
  saveCustomers(getCustomers().filter(function (c) { return c.id !== id; }));
  renderAdminApp();
}

function renderStaffPage() {
  return `<div class="admin-page-head"><h3>スタッフ管理</h3><button class="admin-action" onclick="startStaffEdit('new')">スタッフを追加</button></div><div id="staff-editor-slot">${adminState.editingStaffId ? renderStaffEditor(adminState.editingStaffId) : ''}</div><div class="admin-card-list">${getStaff().map(function (s) {
    const monthly = getReservations().filter(function (r) { return r.staffId === s.id && r.dateTime.slice(0, 7) === adminState.month; });
    const sales = monthly.filter(function (r) { return r.status === 'visited'; }).reduce(function (sum, r) { return sum + r.amount; }, 0);
    return `<article class="admin-data-card"><h4>${escapeHtml(s.name)}</h4><p>${escapeHtml(s.role)}<br>${escapeHtml(s.email)}<br>${escapeHtml(s.phone)}</p><span class="status-badge ${s.status}">${STAFF_STATUS_LABELS[s.status]}</span><small>今月 ${monthly.length}件 / ${formatCurrency(sales)}</small><button onclick="startStaffEdit('${s.id}')">編集</button><button onclick="deleteStaff('${s.id}')">削除</button></article>`;
  }).join('')}</div>`;
}

function startStaffEdit(id) {
  adminState.editingStaffId = id;
  renderAdminApp();
}

function renderStaffEditor(id) {
  const isNew = id === 'new';
  const s = isNew ? {} : getStaff().find(function (item) { return item.id === id; }) || {};
  return `<form class="admin-editor" onsubmit="saveStaffFromAdmin(event, '${escapeHtml(id)}')"><h4>${isNew ? 'スタッフを追加' : 'スタッフを編集'}</h4><label>名前<input name="name" value="${escapeHtml(s.name)}" required></label><label>役割<input name="role" value="${escapeHtml(s.role)}"></label><label>メール<input type="email" name="email" value="${escapeHtml(s.email)}"></label><label>電話<input name="phone" value="${escapeHtml(s.phone)}"></label><label>状態<select name="status">${Object.keys(STAFF_STATUS_LABELS).map(function (key) { return `<option value="${key}"${s.status === key ? ' selected' : ''}>${STAFF_STATUS_LABELS[key]}</option>`; }).join('')}</select></label><div class="admin-editor-actions"><button class="admin-action">保存</button><button type="button" class="admin-action ghost" onclick="cancelAdminEdit()">キャンセル</button></div></form>`;
}

function saveStaffFromAdmin(e, id) {
  e.preventDefault();
  const data = new FormData(e.target);
  const item = { id: id === 'new' ? createId('s') : id, name: data.get('name'), role: data.get('role'), email: data.get('email'), phone: data.get('phone'), status: data.get('status'), createdAt: new Date().toISOString() };
  const staff = getStaff();
  saveStaff(id === 'new' ? staff.concat([item]) : staff.map(function (s) { return s.id === id ? item : s; }));
  cancelAdminEdit();
}

function deleteStaff(id) {
  if (!window.confirm('このスタッフを削除しますか？')) return;
  saveStaff(getStaff().filter(function (s) { return s.id !== id; }));
  renderAdminApp();
}

function renderReportsPage() {
  const month = adminState.month;
  const reservations = getReservations().filter(function (r) { return r.dateTime.slice(0, 7) === month; });
  const sales = reservations.filter(function (r) { return r.status === 'visited'; }).reduce(function (sum, r) { return sum + r.amount; }, 0);
  const cancelled = reservations.filter(function (r) { return r.status === 'cancelled' || r.status === 'no_show'; }).length;
  const cancelRate = reservations.length ? Math.round((cancelled / reservations.length) * 100) : 0;
  return `<div class="admin-page-head"><h3>売上レポート</h3><div><input type="month" value="${month}" onchange="adminState.month=this.value;renderAdminApp()"><button class="admin-action ghost" onclick="exportReportsCsv()">CSV出力</button></div></div><div class="admin-grid-cards">${statCard('月間売上', formatCurrency(sales))}${statCard('平均単価', formatCurrency(reservations.length ? Math.round(sales / reservations.length) : 0))}${statCard('予約数', `${reservations.length}件`)}${statCard('キャンセル率', `${cancelRate}%`)}</div><div class="admin-two-col"><div class="admin-panel">${renderStaffBookingChart()}</div><div class="admin-panel">${renderServiceBreakdown(reservations)}</div></div>`;
}

function renderServiceBreakdown(reservations) {
  return `<h3>サービス別内訳</h3><div class="rank-list">${SERVICES.map(function (service) {
    const items = reservations.filter(function (r) { return r.serviceName === service.name; });
    const sales = items.filter(function (r) { return r.status === 'visited'; }).reduce(function (sum, r) { return sum + r.amount; }, 0);
    return `<div class="rank-row"><span>${escapeHtml(service.name)}</span><div><i style="width:${Math.min(100, items.length * 20)}%"></i></div><strong>${items.length}件 / ${formatCurrency(sales)}</strong></div>`;
  }).join('')}</div>`;
}

function renderSettingsPage() {
  const s = getSettings();
  return `<form class="admin-editor settings-editor" onsubmit="saveSettingsFromAdmin(event)"><h3>設定</h3><label>店舗名<input name="storeName" value="${escapeHtml(s.storeName)}"></label><label>開店時間<input type="time" name="openTime" value="${escapeHtml(s.openTime)}"></label><label>閉店時間<input type="time" name="closeTime" value="${escapeHtml(s.closeTime)}"></label><label>予約単位（分）<input type="number" name="reservationUnit" value="${s.reservationUnit}"></label><label>キャンセル期限（時間）<input type="number" name="cancellationDeadline" value="${s.cancellationDeadline}"></label><label>通知メール<input type="email" name="notificationEmail" value="${escapeHtml(s.notificationEmail)}"></label><label class="wide">定休日<input name="closedDays" value="${escapeHtml((s.closedDays || []).join(','))}" placeholder="水,日"></label><div class="admin-editor-actions"><button class="admin-action">保存</button><button type="button" class="admin-action ghost" onclick="resetAdminData()">サンプルデータを再投入</button></div></form>`;
}

function saveSettingsFromAdmin(e) {
  e.preventDefault();
  const data = new FormData(e.target);
  saveSettings({ storeName: data.get('storeName'), openTime: data.get('openTime'), closeTime: data.get('closeTime'), closedDays: String(data.get('closedDays') || '').split(',').map(function (v) { return v.trim(); }).filter(Boolean), reservationUnit: Number(data.get('reservationUnit')), cancellationDeadline: Number(data.get('cancellationDeadline')), notificationEmail: data.get('notificationEmail') });
  renderAdminApp();
}

function resetAdminData() {
  if (!window.confirm('管理データをサンプルで初期化しますか？')) return;
  Object.keys(RF_KEYS).forEach(function (key) { localStorage.removeItem(RF_KEYS[key]); });
  seedAdminData();
  saveAuthUser(DEMO_ACCOUNTS[0]);
  renderAdminApp();
}

function fillAdminDemo(email, password) {
  const form = document.getElementById('admin-login-form');
  if (!form) return;
  form.email.value = email;
  form.password.value = password;
}

function adminLogout() {
  saveAuthUser(null);
  renderAdminApp();
}

function handleAdminLogin(e) {
  e.preventDefault();
  const data = new FormData(e.target);
  const account = DEMO_ACCOUNTS.find(function (item) {
    return item.email === data.get('email') && item.password === data.get('password');
  });
  const error = document.getElementById('admin-login-error');

  if (!account) {
    if (error) {
      error.textContent = 'メールアドレスまたはパスワードが正しくありません。';
      error.removeAttribute('hidden');
    }
    return;
  }

  saveAuthUser({ email: account.email, role: account.role, name: account.name });
  renderAdminApp();
}

function exportReservationsCsv() {
  const rows = [['日時', '顧客', '担当', 'サービス', '金額', '状態', 'メモ']].concat(getReservations().map(function (r) {
    return [formatDateTime(r.dateTime), r.customerName, r.staffName, r.serviceName, r.amount, STATUS_LABELS[r.status], r.memo];
  }));
  downloadCsv('melia-reservations.csv', rows);
}

function exportReportsCsv() {
  const rows = [['サービス', '件数', '売上']].concat(SERVICES.map(function (service) {
    const items = getReservations().filter(function (r) { return r.dateTime.slice(0, 7) === adminState.month && r.serviceName === service.name; });
    const sales = items.filter(function (r) { return r.status === 'visited'; }).reduce(function (sum, r) { return sum + r.amount; }, 0);
    return [service.name, items.length, sales];
  }));
  downloadCsv('melia-report.csv', rows);
}

(function initReservationSystem() {
  const reserveModal = document.getElementById('reserve-modal');
  const adminModal = document.getElementById('admin-modal');
  const reserveClose = document.getElementById('modal-close');
  const adminClose = document.getElementById('admin-close');
  const form = document.getElementById('reserve-form');
  const dateInput = document.getElementById('reserve-date');

  if (dateInput) {
    dateInput.min = getTodayInputValue();
  }

  if (reserveClose) {
    reserveClose.addEventListener('click', closeModal);
  }

  if (adminClose) {
    adminClose.addEventListener('click', closeAdminPanel);
  }

  if (reserveModal) {
    reserveModal.addEventListener('click', function (e) {
      if (e.target === reserveModal) {
        closeModal();
      }
    });
  }

  if (adminModal) {
    adminModal.addEventListener('click', function (e) {
      if (e.target === adminModal) {
        closeAdminPanel();
      }
    });
  }

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      seedAdminData();
      const formData = new FormData(form);
      const now = new Date();
      const customers = getCustomers();
      const service = SERVICES.find(function (item) {
        return item.name === formData.get('menu');
      }) || SERVICES[0];
      const staffMember = getStaff().find(function (item) {
        return item.status === 'active';
      }) || getStaff()[0] || { id: 'unassigned', name: '未定' };
      let customer = customers.find(function (item) {
        return item.email === formData.get('email') || item.phone === formData.get('tel');
      });

      if (customer) {
        customer = Object.assign({}, customer, {
          name: formData.get('name'),
          phone: formData.get('tel'),
          email: formData.get('email'),
          tags: Array.from(new Set((customer.tags || []).concat([formData.get('visitType') === '初めて' ? 'new' : 'repeater']))),
          memo: [customer.memo, formData.get('message')].filter(Boolean).join('\n')
        });
        saveCustomers(customers.map(function (item) {
          return item.id === customer.id ? customer : item;
        }));
      } else {
        customer = {
          id: createId('c'),
          name: formData.get('name'),
          phone: formData.get('tel'),
          email: formData.get('email'),
          visitCount: 0,
          lastReservationDate: '',
          tags: [formData.get('visitType') === '初めて' ? 'new' : 'repeater'],
          memo: formData.get('message'),
          createdAt: now.toISOString()
        };
        saveCustomers(customers.concat([customer]));
      }

      const reservation = {
        id: createReservationId(),
        dateTime: dateTimeLocalToIso(`${formData.get('date')}T${formData.get('time')}`),
        customerId: customer.id,
        customerName: customer.name,
        staffId: staffMember.id,
        staffName: staffMember.name,
        serviceName: service.name,
        amount: service.amount,
        status: 'reserved',
        memo: formData.get('message'),
        createdAt: now.toISOString()
      };

      const reservations = getReservations();
      reservations.push(reservation);
      saveReservations(reservations);

      form.reset();
      if (dateInput) {
        dateInput.min = getTodayInputValue();
      }

      const success = document.getElementById('reserve-success');
      if (success) {
        success.textContent = `予約を受け付けました。受付番号: ${reservation.id}`;
        success.removeAttribute('hidden');
      }
    });
  }

  document.addEventListener('submit', function (e) {
    if (e.target && e.target.id === 'admin-login-form') {
      handleAdminLogin(e);
    }
  });

  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;

    if (reserveModal && !reserveModal.hasAttribute('hidden')) {
      closeModal();
    }

    if (adminModal && !adminModal.hasAttribute('hidden')) {
      closeAdminPanel();
    }
  });
})();


/* ============================================================
   補足: ナビゲーションのアクティブリンク
   現在スクロールしているセクションに対応する
   ナビリンクをハイライトする
============================================================ */
(function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  if (!sections.length || !navLinks.length) return;

  function updateActiveLink() {
    const scrollY = window.scrollY + 100; // ヘッダー分のオフセット

    let currentSection = '';

    sections.forEach(function (section) {
      const top    = section.offsetTop;
      const height = section.offsetHeight;

      if (scrollY >= top && scrollY < top + height) {
        currentSection = section.getAttribute('id');
      }
    });

    navLinks.forEach(function (link) {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + currentSection) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', updateActiveLink, { passive: true });
  updateActiveLink();
})();
