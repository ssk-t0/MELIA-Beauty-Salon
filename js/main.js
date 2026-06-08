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

const RESERVATION_STORAGE_KEY = 'meliaReservations';

function getReservations() {
  try {
    return JSON.parse(localStorage.getItem(RESERVATION_STORAGE_KEY)) || [];
  } catch (e) {
    return [];
  }
}

function saveReservations(reservations) {
  localStorage.setItem(RESERVATION_STORAGE_KEY, JSON.stringify(reservations));
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

function getTodayInputValue() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const date = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${date}`;
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

  renderReservations();
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

function updateReservationStatus(id, status) {
  const reservations = getReservations().map(function (reservation) {
    if (reservation.id === id) {
      return Object.assign({}, reservation, { status: status });
    }
    return reservation;
  });

  saveReservations(reservations);
  renderReservations();
}

function deleteReservation(id) {
  if (!window.confirm('この予約を削除しますか？')) return;

  const reservations = getReservations().filter(function (reservation) {
    return reservation.id !== id;
  });

  saveReservations(reservations);
  renderReservations();
}

function renderReservations() {
  const reservations = getReservations().sort(function (a, b) {
    return `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`);
  });
  const count = document.getElementById('admin-count');
  const empty = document.getElementById('admin-empty');
  const tableWrap = document.getElementById('admin-table-wrap');
  const list = document.getElementById('admin-reservation-list');

  if (count) {
    count.textContent = `予約 ${reservations.length}件`;
  }

  if (!list || !empty || !tableWrap) return;

  if (!reservations.length) {
    list.innerHTML = '';
    empty.removeAttribute('hidden');
    tableWrap.setAttribute('hidden', '');
    return;
  }

  empty.setAttribute('hidden', '');
  tableWrap.removeAttribute('hidden');
  list.innerHTML = reservations.map(function (reservation) {
    const message = reservation.message
      ? `<p class="admin-message">${escapeHtml(reservation.message)}</p>`
      : '';
    const status = reservation.status || '新規';

    return `
      <tr>
        <td>
          <span class="admin-id">${escapeHtml(reservation.id)}</span>
          <span class="admin-created">${escapeHtml(reservation.createdAtLabel)}</span>
        </td>
        <td>${escapeHtml(reservation.date)}<br>${escapeHtml(reservation.time)}</td>
        <td>
          ${escapeHtml(reservation.name)}<br>
          <span class="admin-sub">${escapeHtml(reservation.visitType)}</span>
          ${message}
        </td>
        <td>${escapeHtml(reservation.menu)}</td>
        <td>
          <a href="tel:${escapeHtml(reservation.tel)}">${escapeHtml(reservation.tel)}</a><br>
          <a href="mailto:${escapeHtml(reservation.email)}">${escapeHtml(reservation.email)}</a>
        </td>
        <td>
          <select class="admin-status" aria-label="予約状態" onchange="updateReservationStatus('${escapeHtml(reservation.id)}', this.value)">
            <option value="新規"${status === '新規' ? ' selected' : ''}>新規</option>
            <option value="確認済み"${status === '確認済み' ? ' selected' : ''}>確認済み</option>
            <option value="来店済み"${status === '来店済み' ? ' selected' : ''}>来店済み</option>
            <option value="キャンセル"${status === 'キャンセル' ? ' selected' : ''}>キャンセル</option>
          </select>
        </td>
        <td>
          <button type="button" class="admin-delete" onclick="deleteReservation('${escapeHtml(reservation.id)}')">削除</button>
        </td>
      </tr>
    `;
  }).join('');
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

      const formData = new FormData(form);
      const now = new Date();
      const reservation = {
        id: createReservationId(),
        name: formData.get('name'),
        tel: formData.get('tel'),
        email: formData.get('email'),
        menu: formData.get('menu'),
        date: formData.get('date'),
        time: formData.get('time'),
        visitType: formData.get('visitType'),
        message: formData.get('message'),
        status: '新規',
        createdAt: now.toISOString(),
        createdAtLabel: now.toLocaleString('ja-JP')
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
