/* ============================================================
 * Motor de repetição espaçada (variante do SM-2)
 * Estado persistido em localStorage.
 * ============================================================ */
(function () {
  const KEY = "aif-c01-srs-v1";
  const DAY = 24 * 60 * 60 * 1000;

  const defaultState = () => ({
    cards: {},            // id -> { ease, interval, reps, lapses, due, seen, correct, wrong }
    settings: { newPerSession: 15, sessionSize: 30 },
    examHistory: [],      // { date, scaled, pass, correct, total, byDomain }
    introduced: {}        // "YYYY-MM-DD" -> qtd de cartões novos introduzidos no dia
  });

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return defaultState();
      const s = JSON.parse(raw);
      return Object.assign(defaultState(), s, {
        settings: Object.assign(defaultState().settings, s.settings || {})
      });
    } catch (e) {
      return defaultState();
    }
  }

  function save(state) {
    localStorage.setItem(KEY, JSON.stringify(state));
  }

  function newCard() {
    return { ease: 2.5, interval: 0, reps: 0, lapses: 0, due: 0, seen: 0, correct: 0, wrong: 0 };
  }

  function getCard(state, id) {
    if (!state.cards[id]) state.cards[id] = newCard();
    return state.cards[id];
  }

  /* grade: 0 = errei | 1 = difícil | 2 = bom | 3 = fácil */
  function grade(state, id, g, wasCorrect) {
    const c = getCard(state, id);
    const now = Date.now();
    c.seen++;
    if (wasCorrect) c.correct++; else c.wrong++;

    if (g === 0) {
      c.reps = 0;
      c.lapses++;
      c.ease = Math.max(1.3, c.ease - 0.2);
      c.interval = 0;
      c.due = now + 10 * 60 * 1000; // reaparece em ~10 min (ou na mesma sessão)
    } else if (g === 1) {
      c.ease = Math.max(1.3, c.ease - 0.15);
      c.interval = Math.max(1, Math.round((c.interval || 1) * 1.2));
      c.reps++;
      c.due = now + c.interval * DAY;
    } else if (g === 2) {
      c.reps++;
      if (c.reps === 1) c.interval = 1;
      else if (c.reps === 2) c.interval = 3;
      else c.interval = Math.round(c.interval * c.ease);
      c.due = now + c.interval * DAY;
    } else {
      c.ease = Math.min(3.0, c.ease + 0.15);
      c.reps++;
      if (c.reps === 1) c.interval = 4;
      else c.interval = Math.round(Math.max(c.interval, 1) * c.ease * 1.3);
      c.due = now + c.interval * DAY;
    }
    save(state);
    return c;
  }

  function isNew(state, id) {
    const c = state.cards[id];
    return !c || c.seen === 0;
  }

  function isDue(state, id, now) {
    const c = state.cards[id];
    return c && c.seen > 0 && c.due <= (now || Date.now());
  }

  function stats(state, bank) {
    const now = Date.now();
    let neu = 0, learning = 0, young = 0, mature = 0, due = 0;
    bank.forEach((q) => {
      const c = state.cards[q.id];
      if (!c || c.seen === 0) { neu++; return; }
      if (c.due <= now) due++;
      if (c.interval < 1) learning++;
      else if (c.interval < 21) young++;
      else mature++;
    });
    return { neu, learning, young, mature, due, total: bank.length };
  }

  /* Fila de estudo: vencidos primeiro (mais atrasados antes), depois novos */
  function buildQueue(state, bank, opts) {
    opts = opts || {};
    const now = Date.now();
    const pool = opts.domain ? bank.filter((q) => q.domain === opts.domain) : bank.slice();

    const dueCards = pool
      .filter((q) => isDue(state, q.id, now))
      .sort((a, b) => state.cards[a.id].due - state.cards[b.id].due);

    const newCards = shuffle(pool.filter((q) => isNew(state, q.id)));

    const maxNew = opts.maxNew != null ? opts.maxNew : state.settings.newPerSession;
    const maxTotal = opts.maxTotal != null ? opts.maxTotal : state.settings.sessionSize;

    const queue = dueCards.slice(0, maxTotal);
    const room = Math.max(0, maxTotal - queue.length);
    queue.push(...newCards.slice(0, Math.min(maxNew, room)));
    return queue;
  }

  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function fmtInterval(days) {
    if (days < 1) return "&lt;1 d";
    if (days < 30) return days + " d";
    if (days < 365) return (days / 30).toFixed(1).replace(".0", "") + " m";
    return (days / 365).toFixed(1).replace(".0", "") + " a";
  }

  /* Prévia dos intervalos que cada botão de nota produziria */
  function previewIntervals(state, id) {
    const c = state.cards[id] ? JSON.parse(JSON.stringify(state.cards[id])) : newCard();
    const sim = (g) => {
      const t = JSON.parse(JSON.stringify(c));
      if (g === 0) return "10 min";
      if (g === 1) return fmtInterval(Math.max(1, Math.round((t.interval || 1) * 1.2)));
      if (g === 2) {
        const reps = t.reps + 1;
        if (reps === 1) return "1 d";
        if (reps === 2) return "3 d";
        return fmtInterval(Math.round(t.interval * t.ease));
      }
      const reps = t.reps + 1;
      if (reps === 1) return "4 d";
      return fmtInterval(Math.round(Math.max(t.interval, 1) * t.ease * 1.3));
    };
    return { again: sim(0), hard: sim(1), good: sim(2), easy: sim(3) };
  }

  window.SRS = { load, save, grade, isNew, isDue, stats, buildQueue, shuffle, previewIntervals, getCard };
})();
