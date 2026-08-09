/* ============================================================
 * Simulado de certificações — SPA sem dependências.
 * Certificações disponíveis: AWS AI Practitioner (AIF-C01) e
 * HashiCorp Terraform Associate (004), cada uma com seu próprio
 * idioma de UI, banco de questões e modelo de pontuação.
 * Modos: estudo (SRS), prática por domínio e exame simulado.
 * ============================================================ */
(function () {
  "use strict";

  const CERT_STORAGE_KEY = "app-current-cert-v1";
  const app = document.getElementById("app");

  let currentCertId = localStorage.getItem(CERT_STORAGE_KEY);
  if (!window.CERTS[currentCertId]) currentCertId = "aif";

  function cert() {
    return window.CERTS[currentCertId];
  }
  function t(key, vars) {
    return window.I18N.t(cert(), key, vars);
  }

  let state = SRS.load(cert().srsKey);

  /* ---------- estado volátil da sessão ---------- */
  let study = null; // { queue, idx, order, selection:Set, checked, domain, done, correctCount }
  let exam = null;  // { questions, idx, answers, orders, flags, endsAt, timerId, review, finished }

  /* ================= util ================= */
  const $ = (sel, el) => (el || document).querySelector(sel);
  const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const LETTERS = "ABCDEFGH";

  function optionOrder(q) {
    return SRS.shuffle(q.options.map((_, i) => i));
  }

  function setEq(a, b) {
    if (a.size !== b.length) return false;
    for (const x of b) if (!a.has(x)) return false;
    return true;
  }

  function fmtClock(ms) {
    const s = Math.max(0, Math.floor(ms / 1000));
    const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), sec = s % 60;
    return String(h).padStart(2, "0") + ":" + String(m).padStart(2, "0") + ":" + String(sec).padStart(2, "0");
  }

  function stopTimer() {
    if (exam && exam.timerId) { clearInterval(exam.timerId); exam.timerId = null; }
  }

  function directiveText(q) {
    if (q.type !== "multiple") return t("directiveSingle");
    return q.correct.length === 2 ? t("directiveMulti2") : t("directiveMulti3");
  }

  /* Modelo de pontuação genérico: AWS usa escala 100–1000 com nota
     de corte; Terraform (e certificações HashiCorp em geral) usam
     percentual, sem nota de corte oficial publicada. */
  function computeScore(correct, total) {
    const c = cert();
    if (c.scoring === "scaled") {
      const score = Math.round(100 + (correct / total) * 900);
      const cutPct = ((c.passScaled - 100) / 900) * 100;
      const pct = ((score - 100) / 900) * 100;
      return {
        score, pass: score >= c.passScaled, pct, cutPct,
        minLabel: "100", maxLabel: "1000", cutLabel: String(c.passScaled),
        noteKey: "scoreNoteScaled", cutForNote: c.passScaled
      };
    }
    const pct = Math.round((100 * correct) / total);
    return {
      score: pct, pass: pct >= c.passPercent, pct, cutPct: c.passPercent,
      minLabel: "0%", maxLabel: "100%", cutLabel: c.passPercent + "%",
      noteKey: "scoreNotePercent", cutForNote: c.passPercent
    };
  }

  /* ================= chrome comum ================= */
  function topbar(rightHtml, subtitle) {
    return `
      <div class="exam-topbar">
        <div class="exam-title">${cert().titleHtml}${subtitle ? " — " + subtitle : ""}</div>
        <div class="exam-meta">${rightHtml || ""}</div>
      </div>`;
  }

  function certSwitcher() {
    return `<div class="cert-switcher">
      ${Object.values(window.CERTS).map((c) => `
        <button class="cert-tab ${c.id === currentCertId ? "active" : ""}" data-action="switch-cert" data-cert="${c.id}">${esc(c.shortName)}</button>
      `).join("")}
    </div>`;
  }

  function switchCert(id) {
    if (!window.CERTS[id] || id === currentCertId) return;
    currentCertId = id;
    localStorage.setItem(CERT_STORAGE_KEY, id);
    state = SRS.load(cert().srsKey);
    renderHome();
  }

  /* ================= HOME ================= */
  function renderHome() {
    stopTimer();
    study = null; exam = null;
    const c = cert();
    const bank = c.bank;
    const st = SRS.stats(state, bank);
    const history = state.examHistory.slice().reverse().slice(0, 8);

    const domRows = Object.keys(c.domains).map((d) => {
      const qs = bank.filter((q) => q.domain === +d);
      let seen = 0, correct = 0, answered = 0, due = 0;
      const now = Date.now();
      qs.forEach((q) => {
        const cd = state.cards[q.id];
        if (cd && cd.seen > 0) {
          seen++;
          answered += cd.correct + cd.wrong;
          correct += cd.correct;
          if (cd.due <= now) due++;
        }
      });
      const acc = answered ? Math.round((100 * correct) / answered) : null;
      const cover = Math.round((100 * seen) / qs.length);
      const pct = Math.round((100 * c.domains[d].examCount) / c.examQuestions);
      const meta = c.officialWeights
        ? t("domainMetaOfficial", { pct, bankCount: qs.length, due })
        : t("domainMetaEstimated", { pct, examCount: c.domains[d].examCount, examQuestions: c.examQuestions, bankCount: qs.length, due });
      return `<tr>
        <td><strong>${t("tagDomain", { d })}</strong> — ${esc(c.domains[d].name)}<br><span style="color:var(--text-2);font-size:12px">${meta}</span></td>
        <td style="width:180px"><div class="bar-wrap"><div class="bar" style="width:${cover}%"></div></div><span style="font-size:12px;color:var(--text-2)">${t("coveragePctSeen", { pct: cover })}</span></td>
        <td style="width:110px">${acc == null ? t("accuracyNone") : `<strong style="color:${acc >= 70 ? "var(--ok)" : "var(--err)"}">${acc}%</strong> ${cert().lang === "pt" ? "acerto" : "correct"}`}</td>
        <td style="width:100px"><button class="link-btn" data-action="practice-domain" data-domain="${d}">${t("practiceBtn")}</button></td>
      </tr>`;
    }).join("");

    const histRows = history.length
      ? history.map((h) => `<tr>
          <td>${new Date(h.date).toLocaleString(c.lang === "pt" ? "pt-BR" : "en-US", { dateStyle: "short", timeStyle: "short" })}</td>
          <td><strong>${h.score}${c.scoring === "percent" ? "%" : ""}</strong>${c.scoring === "scaled" ? "/1000" : ""}</td>
          <td class="${h.pass ? "pill-pass" : "pill-fail"}">${h.pass ? t("verdictPass") : t("verdictFail")}</td>
          <td>${h.correct}/${h.total}</td>
        </tr>`).join("")
      : `<tr><td colspan="4" style="color:var(--text-2)">${t("historyEmpty")}</td></tr>`;

    app.innerHTML = `
      <div class="home-header"><div class="inner">
        ${certSwitcher()}
        <h1>${c.titleHtml}<span class="badge-beta">${esc(c.badgeText)}</span></h1>
        <p>${c.heroText.replace("{n}", bank.length).replace("{examQuestions}", c.examQuestions).replace("{examMinutes}", c.examMinutes)}</p>
      </div></div>
      <div class="home-main">
        <div class="stat-row">
          <div class="stat-card due"><div class="num">${st.due}</div><div class="lbl">${t("statDue")}</div></div>
          <div class="stat-card new"><div class="num">${st.neu}</div><div class="lbl">${t("statNew")}</div></div>
          <div class="stat-card learn"><div class="num">${st.learning + st.young}</div><div class="lbl">${t("statLearning")}</div></div>
          <div class="stat-card master"><div class="num">${st.mature}</div><div class="lbl">${t("statMastered")}</div></div>
        </div>

        <div class="mode-grid">
          <div class="mode-card">
            <h3>${t("modeStudyTitle")}</h3>
            <p>${t("modeStudyDesc")}</p>
            <div class="meta">${t("modeStudyMeta", { due: st.due, n: state.settings.newPerSession })}</div>
            <button class="btn btn-primary btn-lg" data-action="start-study">${t("modeStudyBtn")}</button>
          </div>
          <div class="mode-card">
            <h3>${t("modeExamTitle")}</h3>
            <p>${t("modeExamDesc", { n: c.examQuestions, min: c.examMinutes })}</p>
            <div class="meta">${t("modeExamMeta")}</div>
            <button class="btn btn-blue btn-lg" data-action="start-exam">${t("modeExamBtn")}</button>
          </div>
          <div class="mode-card">
            <h3>${t("modeSettingsTitle")}</h3>
            <p>${t("modeSettingsDesc")}</p>
            <div class="settings-row"><label>${t("settingsNewLabel")}</label><input type="number" min="0" max="100" id="set-new" value="${state.settings.newPerSession}"></div>
            <div class="settings-row"><label>${t("settingsSizeLabel")}</label><input type="number" min="5" max="200" id="set-size" value="${state.settings.sessionSize}"></div>
            <div style="display:flex;gap:10px;flex-wrap:wrap">
              <button class="btn btn-light" data-action="save-settings">${t("settingsSave")}</button>
              <button class="btn btn-light" data-action="reset-progress" style="color:var(--err)">${t("settingsReset")}</button>
            </div>
          </div>
        </div>

        <div class="section-title">${t("sectionDomainPerf")}</div>
        <table class="domain-table"><thead><tr><th>${t("thDomain")}</th><th>${t("thCoverage")}</th><th>${t("thAccuracy")}</th><th></th></tr></thead><tbody>${domRows}</tbody></table>

        <div class="section-title">${t("sectionExamHistory")}</div>
        <table class="domain-table exam-history-table"><thead><tr><th>${t("thDate")}</th><th>${t("thScore")}</th><th>${t("thResult")}</th><th>${t("thCorrect")}</th></tr></thead><tbody>${histRows}</tbody></table>
      </div>`;
  }

  /* ================= MODO ESTUDO ================= */
  function startStudy(domain) {
    const bank = cert().bank;
    const queue = SRS.buildQueue(state, bank, domain ? { domain, maxTotal: 20, maxNew: 10 } : {});
    if (!queue.length) {
      const pool = domain ? bank.filter((q) => q.domain === domain) : bank;
      const weak = pool.slice().sort((a, b) => {
        const ca = state.cards[a.id], cb = state.cards[b.id];
        const ra = ca ? ca.correct / Math.max(1, ca.correct + ca.wrong) : 1;
        const rb = cb ? cb.correct / Math.max(1, cb.correct + cb.wrong) : 1;
        return ra - rb;
      }).slice(0, 15);
      study = { queue: SRS.shuffle(weak) };
    } else {
      study = { queue };
    }
    Object.assign(study, {
      idx: 0, selection: new Set(), checked: false,
      domain: domain || null, done: 0, correctCount: 0, order: null
    });
    renderStudy();
  }

  function renderStudy() {
    const s = study;
    if (s.idx >= s.queue.length) return renderStudyDone();
    const q = s.queue[s.idx];
    if (!s.order) s.order = optionOrder(q);

    const isMulti = q.type === "multiple";
    const chip = SRS.isNew(state, q.id) ? `<span class="chip c-new">${t("chipNew")}</span>` : `<span class="chip c-due">${t("chipDue")}</span>`;

    const optionsHtml = s.order.map((origIdx, pos) => {
      const sel = s.selection.has(origIdx);
      let cls = "q-option" + (sel ? " selected" : "");
      let mark = "";
      if (s.checked) {
        cls += " disabled";
        const isC = q.correct.includes(origIdx);
        if (isC) { cls += " correct"; mark = `<span class="opt-mark">${t("correctMark")}</span>`; }
        else if (sel) { cls += " incorrect"; mark = `<span class="opt-mark">✘</span>`; }
      }
      return `<li class="${cls}" data-opt="${origIdx}">
        <input type="${isMulti ? "checkbox" : "radio"}" name="opt" ${sel ? "checked" : ""} ${s.checked ? "disabled" : ""} tabindex="-1">
        <span class="opt-letter">${LETTERS[pos]}.</span><span>${esc(q.options[origIdx])}</span>${mark}
      </li>`;
    }).join("");

    let feedback = "";
    if (s.checked) {
      const ok = setEq(s.selection, q.correct);
      const prev = SRS.previewIntervals(state, q.id);
      feedback = `
        <div class="feedback-banner ${ok ? "ok" : "err"}">${ok ? t("feedbackCorrect") : t("feedbackIncorrect")}</div>
        <div class="explanation"><h4>${t("explanationHeader")}</h4>${esc(q.explanation)}</div>
        <div class="srs-grade-bar">
          <div class="hint">${t("srsHint")}</div>
          ${ok ? `
            <button class="grade-btn grade-again" data-grade="0">${t("gradeAgain")}<small>${prev.again}</small></button>
            <button class="grade-btn grade-hard" data-grade="1">${t("gradeHard")}<small>${prev.hard}</small></button>
            <button class="grade-btn grade-good" data-grade="2">${t("gradeGood")}<small>${prev.good}</small></button>
            <button class="grade-btn grade-easy" data-grade="3">${t("gradeEasy")}<small>${prev.easy}</small></button>
          ` : `
            <button class="grade-btn grade-again" data-grade="0">${t("gradeContinue")}<small>${prev.again}</small></button>
          `}
        </div>`;
    }

    app.innerHTML = `
      <div class="exam-shell">
        ${topbar(`<span class="study-progress">
            ${chip}
            <span class="chip c-done">${t("chipDone", { n: s.done })}</span>
            <span>${t("remainingLabel", { n: s.queue.length - s.idx })}</span>
          </span>`, s.domain ? t("practiceSubtitle", { d: s.domain }) : t("studySubtitle"))}
        <div class="exam-subbar">
          <span class="qcount">${t("questionOf", { i: s.idx + 1, n: s.queue.length })}</span>
          <span class="tag dom">${t("tagDomain", { d: q.domain })} — ${esc(cert().domains[q.domain].name)}</span>
        </div>
        <div class="exam-body">
          <div class="q-stem">${esc(q.stem)}</div>
          <div class="q-directive">${directiveText(q)}</div>
          <ul class="q-options">${optionsHtml}</ul>
          ${feedback}
        </div>
        <div class="exam-footer">
          <div class="group"><button class="btn btn-secondary" data-action="quit-study">${t("footerQuit")}</button></div>
          <div class="group">
            ${s.checked ? "" : `<button class="btn btn-primary" data-action="check" ${s.selection.size ? "" : "disabled"}>${t("footerCheck")}</button>`}
          </div>
        </div>
      </div>`;
  }

  function renderStudyDone() {
    const s = study;
    const acc = s.done ? Math.round((100 * s.correctCount) / s.done) : 0;
    const st = SRS.stats(state, cert().bank);
    app.innerHTML = `
      <div class="exam-shell">
        ${topbar("", "")}
        <div class="empty-note">
          <div class="big">${t("emptyStudyDoneIcon")}</div>
          <h2 style="margin:10px 0">${t("studyDoneTitle")}</h2>
          <p>${t("studyDoneBody", { done: s.done, acc, due: st.due, neu: st.neu })}</p>
          <div style="margin-top:22px;display:flex;gap:12px;justify-content:center;flex-wrap:wrap">
            ${st.due + st.neu > 0 ? `<button class="btn btn-primary btn-lg" data-action="start-study">${t("studyDoneNewSession")}</button>` : ""}
            <button class="btn btn-light btn-lg" data-action="home">${t("studyDoneHome")}</button>
          </div>
        </div>
      </div>`;
  }

  function studyCheck() {
    const s = study;
    const q = s.queue[s.idx];
    s.checked = true;
    s.done++;
    if (setEq(s.selection, q.correct)) s.correctCount++;
    renderStudy();
  }

  function studyGrade(g) {
    const s = study;
    const q = s.queue[s.idx];
    const ok = setEq(s.selection, q.correct);
    SRS.grade(state, q.id, ok ? g : 0, ok);
    if (!ok || g === 0) {
      const pos = Math.min(s.queue.length, s.idx + 4);
      s.queue.splice(pos, 0, q);
    }
    s.idx++;
    s.selection = new Set();
    s.checked = false;
    s.order = null;
    renderStudy();
  }

  /* ================= EXAME SIMULADO ================= */
  function startExam() {
    const c = cert();
    const questions = [];
    Object.keys(c.domains).forEach((d) => {
      const pool = SRS.shuffle(c.bank.filter((q) => q.domain === +d));
      questions.push(...pool.slice(0, c.domains[d].examCount));
    });
    exam = {
      questions: SRS.shuffle(questions),
      idx: 0,
      answers: {},
      orders: {},
      flags: new Set(),
      endsAt: Date.now() + c.examMinutes * 60 * 1000,
      timerId: null,
      review: false,
      finished: false
    };
    exam.timerId = setInterval(tickExam, 1000);
    renderExam();
  }

  function tickExam() {
    if (!exam || exam.finished) return stopTimer();
    const left = exam.endsAt - Date.now();
    const el = $("#exam-clock");
    if (el) {
      el.textContent = fmtClock(left);
      el.classList.toggle("low", left < 15 * 60 * 1000);
      el.classList.toggle("critical", left < 5 * 60 * 1000);
    }
    if (left <= 0) finishExam(true);
  }

  function examChrome(innerHtml, subbarHtml, footerHtml) {
    const left = exam.endsAt - Date.now();
    return `
      <div class="exam-shell">
        <div class="exam-topbar">
          <div class="exam-title">${cert().titleHtml}</div>
          <div class="exam-meta">
            <span>${t("candidateLabel")}</span>
            <span class="exam-timer${left < 5 * 60 * 1000 ? " critical" : left < 15 * 60 * 1000 ? " low" : ""}" id="exam-clock">${fmtClock(left)}</span>
          </div>
        </div>
        ${subbarHtml || ""}
        <div class="exam-body">${innerHtml}</div>
        <div class="exam-footer">${footerHtml || ""}</div>
      </div>`;
  }

  function renderExam() {
    const e = exam;
    if (e.review) return renderExamReview();
    const q = e.questions[e.idx];
    if (!e.orders[e.idx]) e.orders[e.idx] = optionOrder(q);
    const order = e.orders[e.idx];
    const sel = e.answers[e.idx] || new Set();
    const isMulti = q.type === "multiple";
    const flagged = e.flags.has(e.idx);

    const optionsHtml = order.map((origIdx, pos) => `
      <li class="q-option ${sel.has(origIdx) ? "selected" : ""}" data-opt="${origIdx}">
        <input type="${isMulti ? "checkbox" : "radio"}" name="opt" ${sel.has(origIdx) ? "checked" : ""} tabindex="-1">
        <span class="opt-letter">${LETTERS[pos]}.</span><span>${esc(q.options[origIdx])}</span>
      </li>`).join("");

    app.innerHTML = examChrome(
      `<div class="q-stem">${esc(q.stem)}</div>
       <div class="q-directive">${directiveText(q)}</div>
       <ul class="q-options">${optionsHtml}</ul>`,
      `<div class="exam-subbar">
         <span class="qcount">${t("questionOf", { i: e.idx + 1, n: e.questions.length })}</span>
         <label class="flag-toggle ${flagged ? "flagged" : ""}" data-action="toggle-flag">
           <input type="checkbox" ${flagged ? "checked" : ""} tabindex="-1"><span class="flag-icon">⚑</span> ${t("markForReview")}
         </label>
       </div>`,
      `<div class="group">
         <button class="btn btn-secondary" data-action="exam-review">${t("reviewAll")}</button>
       </div>
       <div class="group">
         <button class="btn btn-secondary" data-action="exam-prev" ${e.idx === 0 ? "disabled" : ""}>${t("prevBtn")}</button>
         ${e.idx === e.questions.length - 1
           ? `<button class="btn btn-primary" data-action="exam-review">${t("goReviewBtn")}</button>`
           : `<button class="btn btn-primary" data-action="exam-next">${t("nextBtn")}</button>`}
       </div>`
    );
  }

  function renderExamReview() {
    const e = exam;
    const cells = e.questions.map((q, i) => {
      const answered = e.answers[i] && e.answers[i].size > 0;
      return `<div class="review-cell ${answered ? "" : "unanswered"} ${e.flags.has(i) ? "flagged" : ""}" data-goto="${i}">
        <span class="n">${i + 1}</span><span class="s">${answered ? t("answeredLabel") : t("unansweredLabel")}</span>
      </div>`;
    }).join("");
    const unanswered = e.questions.filter((_, i) => !(e.answers[i] && e.answers[i].size)).length;

    app.innerHTML = examChrome(
      `<h2 style="font-size:19px">${t("reviewTitle")}</h2>
       <p style="color:var(--text-2);margin-top:8px;font-size:13.5px">${unanswered ? t("reviewBodyUnanswered", { n: unanswered }) : t("reviewBodyClean")}</p>
       <div class="review-grid">${cells}</div>
       <div class="review-legend">
         <span>${t("legendAnswered")}</span><span style="color:var(--warn)">${t("legendUnanswered")}</span><span style="color:var(--err)">${t("legendFlagged")}</span>
       </div>`,
      `<div class="exam-subbar"><span class="qcount">${t("reviewSubtitle", { n: e.questions.length })}</span></div>`,
      `<div class="group">
         <button class="btn btn-secondary" data-action="exam-back-first-flag" ${e.flags.size ? "" : "disabled"}>${t("reviewMarked")}</button>
         <button class="btn btn-secondary" data-action="exam-back-first-blank" ${unanswered ? "" : "disabled"}>${t("reviewBlank")}</button>
       </div>
       <div class="group">
         <button class="btn btn-danger" data-action="exam-finish">${t("finishExamBtn")}</button>
       </div>`
    );
  }

  function confirmModal(title, body, confirmLabel, onConfirm) {
    const wrap = document.createElement("div");
    wrap.className = "modal-backdrop";
    wrap.innerHTML = `<div class="modal">
      <h3>${title}</h3><p>${body}</p>
      <div class="modal-actions">
        <button class="btn btn-light" data-m="cancel">${t("modalCancel")}</button>
        <button class="btn btn-danger" data-m="ok">${confirmLabel}</button>
      </div></div>`;
    wrap.addEventListener("click", (ev) => {
      const b = ev.target.closest("[data-m]");
      if (!b && ev.target !== wrap) return;
      wrap.remove();
      if (b && b.dataset.m === "ok") onConfirm();
    });
    document.body.appendChild(wrap);
  }

  function finishExam(byTimeout) {
    const e = exam;
    if (!e || e.finished) return;
    e.finished = true;
    stopTimer();

    const c = cert();
    let correct = 0;
    const byDomain = {};
    Object.keys(c.domains).forEach((d) => (byDomain[d] = { correct: 0, total: 0 }));
    const detail = e.questions.map((q, i) => {
      const sel = e.answers[i] || new Set();
      const ok = setEq(sel, q.correct);
      if (ok) correct++;
      byDomain[q.domain].total++;
      if (ok) byDomain[q.domain].correct++;
      return { q, sel: Array.from(sel), ok };
    });

    const total = e.questions.length;
    const scoreInfo = computeScore(correct, total);

    state.examHistory.push({
      date: Date.now(), score: scoreInfo.score, pass: scoreInfo.pass, correct, total,
      byDomain: JSON.parse(JSON.stringify(byDomain))
    });
    SRS.save(state);

    renderResults({ scoreInfo, correct, total, byDomain, detail, byTimeout });
  }

  function renderResults(r) {
    const c = cert();
    const domRows = Object.keys(c.domains).map((d) => {
      const b = r.byDomain[d];
      const p = b.total ? Math.round((100 * b.correct) / b.total) : 0;
      const good = p >= 70;
      return `<tr>
        <td><strong>${t("tagDomain", { d })}</strong> — ${esc(c.domains[d].name)}</td>
        <td style="width:200px"><div class="bar-wrap"><div class="bar ${good ? "good" : "bad"}" style="width:${p}%"></div></div></td>
        <td style="width:130px"><strong>${b.correct}/${b.total}</strong> (${p}%)</td>
        <td style="width:190px;color:${good ? "var(--ok)" : "var(--err)"};font-weight:600">${good ? t("domainMeets") : t("domainNeedsWork")}</td>
      </tr>`;
    }).join("");

    const wrongCount = r.detail.filter((d) => !d.ok).length;

    const items = r.detail.map((d, i) => {
      const q = d.q;
      const selSet = new Set(d.sel);
      const opts = q.options.map((o, oi) => {
        const isC = q.correct.includes(oi);
        const isS = selSet.has(oi);
        let cls = "q-option disabled" + (isC ? " correct" : isS ? " incorrect" : "");
        let mark = isC ? `<span class="opt-mark">${t("correctMark")}</span>` : isS ? `<span class="opt-mark">${t("yourAnswerMark")}</span>` : "";
        return `<li class="${cls}"><span>${esc(o)}</span>${mark}</li>`;
      }).join("");
      return `<div class="q-review-item">
        <div style="margin-bottom:10px">
          <span class="tag ${d.ok ? "ok" : "err"}">${d.ok ? t("tagCorrect") : t("tagIncorrect")}</span>
          <span class="tag dom">${t("tagDomain", { d: q.domain })}</span>
          <strong>${t("questionLabel", { i: i + 1 })}</strong>
        </div>
        <div class="q-stem" style="font-size:14.5px">${esc(q.stem)}</div>
        <ul class="q-options" style="margin-top:12px">${opts}</ul>
        <div class="explanation"><h4>${t("explanationHeader")}</h4>${esc(q.explanation)}</div>
      </div>`;
    }).join("");

    const si = r.scoreInfo;
    const noteVars = { correct: r.correct, total: r.total, cut: si.cutForNote };

    app.innerHTML = `
      <div class="exam-shell">
        ${topbar("", t("resultsSubtitle"))}
        <div class="result-hero">
          ${r.byTimeout ? `<p style="color:var(--warn);font-weight:600;margin-bottom:10px">${t("timeUpNotice")}</p>` : ""}
          <div class="verdict ${si.pass ? "pass" : "fail"}">${si.pass ? t("verdictPass") : t("verdictFail")}</div>
          <div class="scaled">${c.scoring === "percent" ? si.score + "%" : si.score}</div>
          <div class="scale-note">${t(si.noteKey, noteVars)}</div>
          <div class="score-scale">
            <div class="track" style="background:linear-gradient(to right, #f5c8bd 0 ${si.cutPct}%, #c8e6c9 ${si.cutPct}% 100%)">
              <div class="cut" style="left:${si.cutPct}%"></div>
              <div class="marker" style="left:${si.pct}%"></div>
            </div>
            <div class="labels"><span>${si.minLabel}</span><span>${si.cutLabel} ${c.lang === "pt" ? "(corte)" : "(cutoff)"}</span><span>${si.maxLabel}</span></div>
          </div>
          <div style="margin-top:26px;display:flex;gap:12px;justify-content:center;flex-wrap:wrap">
            ${wrongCount ? `<button class="btn btn-primary" data-action="queue-wrong">${t("addWrongBtn", { n: wrongCount })}</button>` : ""}
            <button class="btn btn-light" data-action="start-exam">${t("newExamBtn")}</button>
            <button class="btn btn-light" data-action="home">${t("homeBtn")}</button>
          </div>
        </div>
        <div class="result-detail">
          <div class="section-title">${t("sectionDomainPerf")}</div>
          <table class="domain-table"><tbody>${domRows}</tbody></table>
          <div class="section-title">${t("correctionTitle")}</div>
          ${items}
        </div>
      </div>`;

    app.dataset.wrongIds = JSON.stringify(r.detail.filter((d) => !d.ok).map((d) => d.q.id));
  }

  /* ================= eventos ================= */
  document.addEventListener("click", (ev) => {
    const opt = ev.target.closest(".q-option:not(.disabled)");
    if (opt && (study || exam)) {
      const origIdx = +opt.dataset.opt;
      if (study && !study.checked) {
        const q = study.queue[study.idx];
        toggleSelection(study.selection, origIdx, q);
        renderStudy();
        return;
      }
      if (exam && !exam.review && !exam.finished) {
        const q = exam.questions[exam.idx];
        if (!exam.answers[exam.idx]) exam.answers[exam.idx] = new Set();
        toggleSelection(exam.answers[exam.idx], origIdx, q);
        renderExam();
        return;
      }
    }

    const goto = ev.target.closest("[data-goto]");
    if (goto && exam) {
      exam.review = false;
      exam.idx = +goto.dataset.goto;
      renderExam();
      return;
    }

    const gr = ev.target.closest("[data-grade]");
    if (gr && study) { studyGrade(+gr.dataset.grade); return; }

    const btn = ev.target.closest("[data-action]");
    if (!btn) return;
    const a = btn.dataset.action;

    if (a === "home") renderHome();
    else if (a === "switch-cert") switchCert(btn.dataset.cert);
    else if (a === "start-study") startStudy(null);
    else if (a === "practice-domain") startStudy(+btn.dataset.domain);
    else if (a === "check") studyCheck();
    else if (a === "quit-study") renderHome();
    else if (a === "start-exam") startExam();
    else if (a === "exam-next") { exam.idx++; renderExam(); }
    else if (a === "exam-prev") { exam.idx--; renderExam(); }
    else if (a === "exam-review") { exam.review = true; renderExam(); }
    else if (a === "toggle-flag") {
      if (exam.flags.has(exam.idx)) exam.flags.delete(exam.idx); else exam.flags.add(exam.idx);
      renderExam();
    }
    else if (a === "exam-back-first-flag") {
      exam.review = false;
      exam.idx = Math.min(...Array.from(exam.flags));
      renderExam();
    }
    else if (a === "exam-back-first-blank") {
      exam.review = false;
      exam.idx = exam.questions.findIndex((_, i) => !(exam.answers[i] && exam.answers[i].size));
      renderExam();
    }
    else if (a === "exam-finish") {
      const unanswered = exam.questions.filter((_, i) => !(exam.answers[i] && exam.answers[i].size)).length;
      confirmModal(
        t("modalFinishTitle"),
        unanswered ? t("modalFinishBodyUnanswered", { n: unanswered }) : t("modalFinishBodyClean"),
        t("modalConfirmFinish"),
        () => finishExam(false)
      );
    }
    else if (a === "queue-wrong") {
      const ids = JSON.parse(app.dataset.wrongIds || "[]");
      ids.forEach((id) => {
        const cd = SRS.getCard(state, id);
        if (cd.seen === 0) { cd.seen = 1; cd.wrong = 1; }
        cd.reps = 0; cd.interval = 0; cd.due = Date.now();
      });
      SRS.save(state);
      btn.textContent = t("addWrongDone");
      btn.disabled = true;
    }
    else if (a === "save-settings") {
      state.settings.newPerSession = Math.max(0, +($("#set-new").value || 0));
      state.settings.sessionSize = Math.max(5, +($("#set-size").value || 30));
      SRS.save(state);
      renderHome();
    }
    else if (a === "reset-progress") {
      confirmModal(t("resetConfirmTitle"), t("resetConfirmBody"), t("resetConfirmBtn"), () => {
        const key = cert().srsKey;
        localStorage.removeItem(key);
        state = SRS.load(key);
        renderHome();
      });
    }
  });

  function toggleSelection(sel, origIdx, q) {
    if (q.type === "multiple") {
      if (sel.has(origIdx)) sel.delete(origIdx);
      else if (sel.size < q.correct.length) sel.add(origIdx);
      else {
        sel.delete(sel.values().next().value);
        sel.add(origIdx);
      }
    } else {
      sel.clear();
      sel.add(origIdx);
    }
  }

  window.addEventListener("beforeunload", (ev) => {
    if (exam && !exam.finished) { ev.preventDefault(); ev.returnValue = ""; }
  });

  renderHome();
})();
