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
 * 7. 予約モーダル（デモ表示）
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
   7. 予約モーダル（デモ表示）
   グローバル関数として定義（HTML の onclick から呼び出す）
============================================================ */

// モーダルを開く
function showReserveDemo() {
  const modal = document.getElementById('reserve-modal');
  if (!modal) return;

  modal.removeAttribute('hidden');

  // 背景スクロールを禁止
  document.body.style.overflow = 'hidden';

  // モーダル内の閉じるボタンにフォーカス
  const closeBtn = document.getElementById('modal-close');
  if (closeBtn) {
    closeBtn.focus();
  }
}

// モーダルを閉じる
function closeModal() {
  const modal = document.getElementById('reserve-modal');
  if (!modal) return;

  modal.setAttribute('hidden', '');

  // 背景スクロールを再開
  document.body.style.overflow = '';
}

// モーダル関連のイベントリスナー
(function initModal() {
  const modal   = document.getElementById('reserve-modal');
  const closeBtn = document.getElementById('modal-close');
  if (!modal || !closeBtn) return;

  // 閉じるボタン
  closeBtn.addEventListener('click', closeModal);

  // オーバーレイ（モーダルの外側）クリックで閉じる
  modal.addEventListener('click', function (e) {
    if (e.target === modal) {
      closeModal();
    }
  });

  // ESCキーで閉じる
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !modal.hasAttribute('hidden')) {
      closeModal();
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
