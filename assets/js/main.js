(() => {
  const header = document.getElementById('siteHeader');
  const navToggle = document.getElementById('navToggle');
  const mainNav = document.getElementById('mainNav');

  const onScroll = () => {
    header.classList.toggle('is-scrolled', window.scrollY > 40);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  const closeNav = () => {
    mainNav.classList.remove('is-open');
    navToggle.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
  };

  navToggle.addEventListener('click', () => {
    const isOpen = mainNav.classList.toggle('is-open');
    navToggle.classList.toggle('is-open', isOpen);
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  mainNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeNav);
  });

  const revealEls = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          setTimeout(() => entry.target.classList.add('is-visible'), i * 60 % 240);
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
  );
  revealEls.forEach((el) => io.observe(el));

  // Before / after results — prices in 억, after = current asking price
  const results = [
    { name: '마포프레스티지자이', tag: '40중반 · 4인가족', bought: '24.11', before: 17.7, after: 24 },
    { name: 'e편한세상신촌', tag: '30초반 · 신혼', bought: '24.07', before: 13.5, after: 19 },
    { name: '성내삼성1차', tag: '30후반 · 신혼', bought: '24.11', before: 9.28, after: 13 },
    { name: '파크리오', tag: '30중반 · 3인가족', bought: '25.06', before: 26.4, after: 28 },
    { name: '마포더클래시', tag: '40후반 · 3인가족', bought: '25.02', before: 17.5, after: 24 },
    { name: '공덕래미안4차', tag: '30초반 · 신혼', bought: '25.01', before: 13.3, after: 19 },
    { name: '센트라스', tag: '40중반 · 4인가족', bought: '25.05', before: 15.6, after: 20 },
    { name: '신길센트럴자이', tag: '40초반 · 싱글', bought: '25.01', before: 12.8, after: 17 },
    { name: '잠실엘스', tag: '40중반 · 3인가족', bought: '25.05', before: 25.5, after: 30 },
    { name: '목동센트럴아이파크위브', tag: '30후반 · 2인가족', bought: '24.06', before: 6.92, after: 9 },
    { name: '래미안로이파크', tag: '40중반 · 4인가족', bought: '25.02', before: 16.85, after: 21 },
    { name: '송파롯데캐슬시그니처 59', tag: '40중반 · 3인가족', bought: '25.10', before: 17.95, after: 22 },
  ];
  const resultsGrid = document.getElementById('resultsGrid');
  if (resultsGrid) {
    const fmt = (n) => String(Math.round(n * 100) / 100);
    const totalBefore = results.reduce((s, r) => s + r.before, 0);
    const totalGain = results.reduce((s, r) => s + (r.after - r.before), 0);
    document.getElementById('resultsAvg').textContent = `+${(totalGain / totalBefore * 100).toFixed(1)}%`;
    document.getElementById('resultsTotal').textContent = `${fmt(totalGain)}억`;

    const card = (r) => {
      const gain = r.after - r.before;
      return `<article class="result-card">
        <div class="result-card-head">
          <span class="result-card-tag">${r.tag}</span>
          <span class="result-card-rate">+${(gain / r.before * 100).toFixed(1)}%</span>
        </div>
        <h3 class="result-card-name">${r.name}</h3>
        <div class="result-card-compare">
          <div class="result-box result-box-before">
            <div class="result-box-label">BEFORE</div>
            <div class="result-box-price">${fmt(r.before)}억</div>
            <div class="result-box-date">${r.bought} 매수</div>
          </div>
          <span class="result-arrow" aria-hidden="true">→</span>
          <div class="result-box result-box-after">
            <div class="result-box-label">AFTER · 호가</div>
            <div class="result-box-price">${fmt(r.after)}<small>억</small></div>
          </div>
        </div>
        <div class="result-bar" aria-hidden="true"><div class="result-bar-base" style="width:${r.before / r.after * 100}%"></div></div>
        <div class="result-card-foot"><span>매수가</span><span class="result-card-gain">▲ ${fmt(gain)}억 상승</span></div>
      </article>`;
    };
    const render = (sortByRate) => {
      const list = sortByRate
        ? [...results].sort((a, b) => b.after / b.before - a.after / a.before)
        : results;
      resultsGrid.innerHTML = list.map(card).join('');
    };

    const sortBtns = document.querySelectorAll('.results-sort-btn');
    sortBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        sortBtns.forEach((b) => b.classList.toggle('is-active', b === btn));
        render(btn.dataset.sort === 'rate');
      });
    });
    render(true);
  }

  // Review marquee — duplicate the cards so the track can loop seamlessly
  const reviewTrack = document.getElementById('reviewTrack');
  if (reviewTrack) {
    [...reviewTrack.children].forEach((card) => {
      const clone = card.cloneNode(true);
      clone.setAttribute('aria-hidden', 'true');
      reviewTrack.appendChild(clone);
    });

    const setMarqueeSpeed = () => {
      const loopWidth = reviewTrack.scrollWidth / 2;
      reviewTrack.style.setProperty('--marquee-duration', `${loopWidth / 55}s`);
    };
    setMarqueeSpeed();
    window.addEventListener('resize', setMarqueeSpeed);
  }

  // Mobile sticky apply bar — shown past the hero, hidden while a full apply CTA is on screen
  const stickyApply = document.getElementById('sticky-apply');
  if (stickyApply) {
    const stickyLink = stickyApply.querySelector('a');
    const ctasInView = new Set();
    let pastHero = false;
    const updateSticky = () => {
      const show = pastHero && ctasInView.size === 0;
      stickyApply.classList.toggle('is-shown', show);
      stickyApply.setAttribute('aria-hidden', String(!show));
      stickyLink.tabIndex = show ? 0 : -1;
    };
    // isIntersecting stays true for a sliver of overlap, so compare the ratio itself
    const ctaObserver = new IntersectionObserver((entries) => {
      entries.forEach((e) => (e.intersectionRatio >= 0.15 ? ctasInView.add(e.target) : ctasInView.delete(e.target)));
      updateSticky();
    }, { threshold: 0.15 });
    ['apply-card', 'final-cta'].forEach((id) => {
      const el = document.getElementById(id);
      if (el) ctaObserver.observe(el);
    });
    window.addEventListener('scroll', () => {
      pastHero = window.scrollY > window.innerHeight * 0.8;
      updateSticky();
    }, { passive: true });
  }

  // FAQ accordion
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach((item) => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    question.addEventListener('click', () => {
      const isOpen = item.classList.contains('is-open');
      faqItems.forEach((other) => {
        other.classList.remove('is-open');
        other.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
        other.querySelector('.faq-answer').style.maxHeight = null;
      });
      if (!isOpen) {
        item.classList.add('is-open');
        question.setAttribute('aria-expanded', 'true');
        answer.style.maxHeight = `${answer.scrollHeight}px`;
      }
    });
  });
})();
