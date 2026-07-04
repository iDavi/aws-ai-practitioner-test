/* ============================================================
 * Simulado AWS Certified AI Practitioner (AIF-C01)
 * SPA sem dependências. Modos: estudo (SRS), prática por
 * domínio e exame simulado completo (65 questões / 90 min).
 * ============================================================ */
(function () {
  "use strict";

  const BANK = [].concat(
    window.DOMAIN1, window.DOMAIN2, window.DOMAIN3, window.DOMAIN4, window.DOMAIN5
  );
  const BY_ID = {};
  BANK.forEach((q) => (BY_ID[q.id] = q));

  const DOMAINS = {
    1: { name: "Fundamentos de IA e ML", weight: 0.20, examCount: 13 },
    2: { name: "Fundamentos de IA Generativa", weight: 0.24, examCount: 16 },
    3: { name: "Aplicações de Modelos de Fundação", weight: 0.28, examCount: 18 },
    4: { name: "Diretrizes para IA Responsável", weight: 0.14, examCount: 9 },
    5: { name: "Segurança, Conformidade e Governança", weight: 0.14, examCount: 9 }
  };

  const EXAM_MINUTES = 90;
  const PASS_SCALED = 700;

  const app = document.getElementById("app");
  let state = SRS.load();

  /* ---------- estado volátil da sessão ---------- */
  let study = null; // { queue, idx, order, selection:Set, checked, mode, domain, done, correctCount }
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

  function scaled(fraction) {
    return Math.round(100 + fraction * 900);
  }

  function fmtClock(ms) {
    const s = Math.max(0, Math.floor(ms / 1000));
    const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), sec = s % 60;
    return String(h).padStart(2, "0") + ":" + String(m).padStart(2, "0") + ":" + String(sec).padStart(2, "0");
  }

  function stopTimer() {
    if (exam && exam.timerId) { clearInterval(exam.timerId); exam.timerId = null; }
  }

  /* ================= chrome comum ================= */
  function topbar(rightHtml, subtitle) {
    return `
      <div class="exam-topbar">
        <div class="exam-title"><span class="smile">AWS</span> Certified AI Practitioner (AIF-C01)${subtitle ? " — " + subtitle : ""}</div>
        <div class="exam-meta">${rightHtml || ""}</div>
      </div>`;
  }

  /* ================= HOME ================= */
  function renderHome() {
    stopTimer();
    study = null; exam = null;
    const st = SRS.stats(state, BANK);
    const history = state.examHistory.slice().reverse().slice(0, 8);

    const domRows = Object.keys(DOMAINS).map((d) => {
      const qs = BANK.filter((q) => q.domain === +d);
      let seen = 0, correct = 0, answered = 0, due = 0;
      const now = Date.now();
      qs.forEach((q) => {
        const c = state.cards[q.id];
        if (c && c.seen > 0) {
          seen++;
          answered += c.correct + c.wrong;
          correct += c.correct;
          if (c.due <= now) due++;
        }
      });
      const acc = answered ? Math.round((100 * correct) / answered) : null;
      const cover = Math.round((100 * seen) / qs.length);
      return `<tr>
        <td><strong>Domínio ${d}</strong> — ${DOMAINS[d].name}<br><span style="color:var(--text-2);font-size:12px">${Math.round(DOMAINS[d].weight * 100)}% do exame · ${qs.length} questões no banco · ${due} a revisar</span></td>
        <td style="width:180px"><div class="bar-wrap"><div class="bar" style="width:${cover}%"></div></div><span style="font-size:12px;color:var(--text-2)">${cover}% visto</span></td>
        <td style="width:110px">${acc == null ? "—" : `<strong style="color:${acc >= 70 ? "var(--ok)" : "var(--err)"}">${acc}%</strong> acerto`}</td>
        <td style="width:100px"><button class="link-btn" data-action="practice-domain" data-domain="${d}">Praticar</button></td>
      </tr>`;
    }).join("");

    const histRows = history.length
      ? history.map((h) => `<tr>
          <td>${new Date(h.date).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" })}</td>
          <td><strong>${h.scaled}</strong>/1000</td>
          <td class="${h.pass ? "pill-pass" : "pill-fail"}">${h.pass ? "APROVADO" : "REPROVADO"}</td>
          <td>${h.correct}/${h.total}</td>
        </tr>`).join("")
      : `<tr><td colspan="4" style="color:var(--text-2)">Nenhum simulado concluído ainda.</td></tr>`;

    app.innerHTML = `
      <div class="home-header"><div class="inner">
        <h1><span class="smile">AWS</span> Certified AI Practitioner (AIF-C01) — Simulado<span class="badge-beta">com repetição espaçada</span></h1>
        <p>Banco de ${BANK.length} questões no estilo do exame oficial, cobrindo os 5 domínios do guia AIF-C01.
        Estude com repetição espaçada para fixar o conteúdo e faça simulados completos de 65 questões em 90 minutos,
        na interface da plataforma de aplicação de exames.</p>
      </div></div>
      <div class="home-main">
        <div class="stat-row">
          <div class="stat-card due"><div class="num">${st.due}</div><div class="lbl">Revisões vencidas hoje</div></div>
          <div class="stat-card new"><div class="num">${st.neu}</div><div class="lbl">Questões novas</div></div>
          <div class="stat-card learn"><div class="num">${st.learning + st.young}</div><div class="lbl">Em aprendizado</div></div>
          <div class="stat-card master"><div class="num">${st.mature}</div><div class="lbl">Dominadas (intervalo ≥ 21 d)</div></div>
        </div>

        <div class="mode-grid">
          <div class="mode-card">
            <h3>📚 Sessão de estudo</h3>
            <p>Fila inteligente de repetição espaçada: revisa primeiro o que está vencido e introduz questões novas aos poucos. Feedback imediato com explicação detalhada de cada alternativa.</p>
            <div class="meta">${st.due} vencidas · até ${state.settings.newPerSession} novas por sessão</div>
            <button class="btn btn-primary btn-lg" data-action="start-study">Iniciar sessão</button>
          </div>
          <div class="mode-card">
            <h3>🖥️ Exame simulado completo</h3>
            <p>65 questões sorteadas com os pesos oficiais por domínio, 90 minutos no relógio, marcação para revisão e relatório de pontuação em escala de 100–1000 (aprovação: 700).</p>
            <div class="meta">Sem feedback durante a prova — igual ao exame real</div>
            <button class="btn btn-blue btn-lg" data-action="start-exam">Iniciar exame</button>
          </div>
          <div class="mode-card">
            <h3>⚙️ Configurações</h3>
            <p>Ajuste o ritmo da repetição espaçada.</p>
            <div class="settings-row"><label>Novas por sessão:</label><input type="number" min="0" max="100" id="set-new" value="${state.settings.newPerSession}"></div>
            <div class="settings-row"><label>Tamanho da sessão:</label><input type="number" min="5" max="200" id="set-size" value="${state.settings.sessionSize}"></div>
            <div style="display:flex;gap:10px;flex-wrap:wrap">
              <button class="btn btn-light" data-action="save-settings">Salvar</button>
              <button class="btn btn-light" data-action="reset-progress" style="color:var(--err)">Zerar progresso</button>
            </div>
          </div>
        </div>

        <div class="section-title">Desempenho por domínio</div>
        <table class="domain-table"><thead><tr><th>Domínio</th><th>Cobertura</th><th>Precisão</th><th></th></tr></thead><tbody>${domRows}</tbody></table>

        <div class="section-title">Histórico de simulados</div>
        <table class="domain-table exam-history-table"><thead><tr><th>Data</th><th>Pontuação</th><th>Resultado</th><th>Acertos</th></tr></thead><tbody>${histRows}</tbody></table>
      </div>`;
  }

  /* ================= MODO ESTUDO ================= */
  function startStudy(domain) {
    const queue = SRS.buildQueue(state, BANK, domain ? { domain, maxTotal: 20, maxNew: 10 } : {});
    if (!queue.length) {
      // nada vencido/novo: reforça as mais fracas do escopo
      const pool = domain ? BANK.filter((q) => q.domain === domain) : BANK;
      const weak = pool.slice().sort((a, b) => {
        const ca = state.cards[a.id], cb = state.cards[b.id];
        const ra = ca ? ca.correct / Math.max(1, ca.correct + ca.wrong) : 1;
        const rb = cb ? cb.correct / Math.max(1, cb.correct + cb.wrong) : 1;
        return ra - rb;
      }).slice(0, 15);
      study = { queue: SRS.shuffle(weak), extraMode: true };
    } else {
      study = { queue, extraMode: false };
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
    const nCorrect = q.correct.length;
    const chip = SRS.isNew(state, q.id) ? '<span class="chip c-new">NOVA</span>' : '<span class="chip c-due">REVISÃO</span>';

    const optionsHtml = s.order.map((origIdx, pos) => {
      const sel = s.selection.has(origIdx);
      let cls = "q-option" + (sel ? " selected" : "");
      let mark = "";
      if (s.checked) {
        cls += " disabled";
        const isC = q.correct.includes(origIdx);
        if (isC) { cls += " correct"; mark = '<span class="opt-mark">✔ correta</span>'; }
        else if (sel) { cls += " incorrect"; mark = '<span class="opt-mark">✘</span>'; }
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
        <div class="feedback-banner ${ok ? "ok" : "err"}">${ok ? "✔ Resposta correta" : "✘ Resposta incorreta"}</div>
        <div class="explanation"><h4>Explicação</h4>${esc(q.explanation)}</div>
        <div class="srs-grade-bar">
          <div class="hint">Como foi lembrar desta questão? Isso define quando ela voltará a aparecer.</div>
          ${ok ? `
            <button class="grade-btn grade-again" data-grade="0">Errei<small>${prev.again}</small></button>
            <button class="grade-btn grade-hard" data-grade="1">Difícil<small>${prev.hard}</small></button>
            <button class="grade-btn grade-good" data-grade="2">Bom<small>${prev.good}</small></button>
            <button class="grade-btn grade-easy" data-grade="3">Fácil<small>${prev.easy}</small></button>
          ` : `
            <button class="grade-btn grade-again" data-grade="0">Continuar (rever em breve)<small>${prev.again}</small></button>
          `}
        </div>`;
    }

    app.innerHTML = `
      <div class="exam-shell">
        ${topbar(`<span class="study-progress">
            ${chip}
            <span class="chip c-done">${s.done} feitas</span>
            <span>Restam ${s.queue.length - s.idx}</span>
          </span>`, s.domain ? "Prática: Domínio " + s.domain : "Sessão de estudo")}
        <div class="exam-subbar">
          <span class="qcount">Questão ${s.idx + 1} de ${s.queue.length}</span>
          <span class="tag dom">Domínio ${q.domain} — ${DOMAINS[q.domain].name}</span>
        </div>
        <div class="exam-body">
          <div class="q-stem">${esc(q.stem)}</div>
          <div class="q-directive">${isMulti ? `Selecione ${nCorrect === 2 ? "DUAS" : "TRÊS"} alternativas.` : "Selecione UMA alternativa."}</div>
          <ul class="q-options">${optionsHtml}</ul>
          ${feedback}
        </div>
        <div class="exam-footer">
          <div class="group"><button class="btn btn-secondary" data-action="quit-study">Encerrar sessão</button></div>
          <div class="group">
            ${s.checked ? "" : `<button class="btn btn-primary" data-action="check" ${s.selection.size ? "" : "disabled"}>Responder</button>`}
          </div>
        </div>
      </div>`;
  }

  function renderStudyDone() {
    const s = study;
    const acc = s.done ? Math.round((100 * s.correctCount) / s.done) : 0;
    const st = SRS.stats(state, BANK);
    app.innerHTML = `
      <div class="exam-shell">
        ${topbar("", "Sessão concluída")}
        <div class="empty-note">
          <div class="big">🎉</div>
          <h2 style="margin:10px 0">Sessão concluída!</h2>
          <p>Você respondeu <strong>${s.done}</strong> questões com <strong>${acc}%</strong> de acerto.<br>
          Ainda restam <strong>${st.due}</strong> revisões vencidas e <strong>${st.neu}</strong> questões novas no banco.</p>
          <div style="margin-top:22px;display:flex;gap:12px;justify-content:center;flex-wrap:wrap">
            ${st.due + st.neu > 0 ? `<button class="btn btn-primary btn-lg" data-action="start-study">Nova sessão</button>` : ""}
            <button class="btn btn-light btn-lg" data-action="home">Voltar ao início</button>
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
      // errou: volta para o fim da fila da sessão (rever hoje mesmo)
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
    const questions = [];
    Object.keys(DOMAINS).forEach((d) => {
      const pool = SRS.shuffle(BANK.filter((q) => q.domain === +d));
      questions.push(...pool.slice(0, DOMAINS[d].examCount));
    });
    exam = {
      questions: SRS.shuffle(questions),
      idx: 0,
      answers: {},   // qIdx -> Set(origIdx)
      orders: {},    // qIdx -> permutação das opções
      flags: new Set(),
      endsAt: Date.now() + EXAM_MINUTES * 60 * 1000,
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
          <div class="exam-title"><span class="smile">AWS</span> Certified AI Practitioner (AIF-C01)</div>
          <div class="exam-meta">
            <span>Candidato(a): você</span>
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
       <div class="q-directive">${isMulti ? `Selecione ${q.correct.length === 2 ? "DUAS" : "TRÊS"} alternativas.` : "Selecione UMA alternativa."}</div>
       <ul class="q-options">${optionsHtml}</ul>`,
      `<div class="exam-subbar">
         <span class="qcount">Questão ${e.idx + 1} de ${e.questions.length}</span>
         <label class="flag-toggle ${flagged ? "flagged" : ""}" data-action="toggle-flag">
           <input type="checkbox" ${flagged ? "checked" : ""} tabindex="-1"><span class="flag-icon">⚑</span> Marcar para revisão
         </label>
       </div>`,
      `<div class="group">
         <button class="btn btn-secondary" data-action="exam-review">Revisar tudo</button>
       </div>
       <div class="group">
         <button class="btn btn-secondary" data-action="exam-prev" ${e.idx === 0 ? "disabled" : ""}>‹ Anterior</button>
         ${e.idx === e.questions.length - 1
           ? `<button class="btn btn-primary" data-action="exam-review">Ir para revisão ›</button>`
           : `<button class="btn btn-primary" data-action="exam-next">Próxima ›</button>`}
       </div>`
    );
  }

  function renderExamReview() {
    const e = exam;
    const cells = e.questions.map((q, i) => {
      const answered = e.answers[i] && e.answers[i].size > 0;
      return `<div class="review-cell ${answered ? "" : "unanswered"} ${e.flags.has(i) ? "flagged" : ""}" data-goto="${i}">
        <span class="n">${i + 1}</span><span class="s">${answered ? "Respondida" : "Sem resposta"}</span>
      </div>`;
    }).join("");
    const unanswered = e.questions.filter((_, i) => !(e.answers[i] && e.answers[i].size)).length;

    app.innerHTML = examChrome(
      `<h2 style="font-size:19px">Revisão das questões</h2>
       <p style="color:var(--text-2);margin-top:8px;font-size:13.5px">Clique em uma questão para voltar a ela. Questões marcadas com <span style="color:var(--err)">⚑</span> foram sinalizadas para revisão.
       ${unanswered ? `<strong style="color:var(--warn)">Atenção: ${unanswered} questão(ões) sem resposta.</strong>` : "Todas as questões foram respondidas."}</p>
       <div class="review-grid">${cells}</div>
       <div class="review-legend">
         <span>⬜ Respondida</span><span style="color:var(--warn)">🟧 Sem resposta</span><span style="color:var(--err)">⚑ Marcada para revisão</span>
       </div>`,
      `<div class="exam-subbar"><span class="qcount">Revisão — ${e.questions.length} questões</span></div>`,
      `<div class="group">
         <button class="btn btn-secondary" data-action="exam-back-first-flag" ${e.flags.size ? "" : "disabled"}>Revisar marcadas</button>
         <button class="btn btn-secondary" data-action="exam-back-first-blank" ${unanswered ? "" : "disabled"}>Revisar sem resposta</button>
       </div>
       <div class="group">
         <button class="btn btn-danger" data-action="exam-finish">Finalizar exame</button>
       </div>`
    );
  }

  function confirmModal(title, body, confirmLabel, onConfirm) {
    const wrap = document.createElement("div");
    wrap.className = "modal-backdrop";
    wrap.innerHTML = `<div class="modal">
      <h3>${title}</h3><p>${body}</p>
      <div class="modal-actions">
        <button class="btn btn-light" data-m="cancel">Cancelar</button>
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

    let correct = 0;
    const byDomain = {};
    Object.keys(DOMAINS).forEach((d) => (byDomain[d] = { correct: 0, total: 0 }));
    const detail = e.questions.map((q, i) => {
      const sel = e.answers[i] || new Set();
      const ok = setEq(sel, q.correct);
      if (ok) correct++;
      byDomain[q.domain].total++;
      if (ok) byDomain[q.domain].correct++;
      return { q, sel: Array.from(sel), ok };
    });

    const total = e.questions.length;
    const score = scaled(correct / total);
    const pass = score >= PASS_SCALED;

    state.examHistory.push({
      date: Date.now(), scaled: score, pass, correct, total,
      byDomain: JSON.parse(JSON.stringify(byDomain))
    });
    SRS.save(state);

    renderResults({ score, pass, correct, total, byDomain, detail, byTimeout });
  }

  function renderResults(r) {
    const pct = ((r.score - 100) / 900) * 100;
    const domRows = Object.keys(DOMAINS).map((d) => {
      const b = r.byDomain[d];
      const p = b.total ? Math.round((100 * b.correct) / b.total) : 0;
      const good = p >= 70;
      return `<tr>
        <td><strong>Domínio ${d}</strong> — ${DOMAINS[d].name}</td>
        <td style="width:200px"><div class="bar-wrap"><div class="bar ${good ? "good" : "bad"}" style="width:${p}%"></div></div></td>
        <td style="width:130px"><strong>${b.correct}/${b.total}</strong> (${p}%)</td>
        <td style="width:190px;color:${good ? "var(--ok)" : "var(--err)"};font-weight:600">${good ? "Atende às competências" : "Precisa de reforço"}</td>
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
        let mark = isC ? '<span class="opt-mark">✔ correta</span>' : isS ? '<span class="opt-mark">✘ sua resposta</span>' : "";
        return `<li class="${cls}"><span>${esc(o)}</span>${mark}</li>`;
      }).join("");
      return `<div class="q-review-item">
        <div style="margin-bottom:10px">
          <span class="tag ${d.ok ? "ok" : "err"}">${d.ok ? "ACERTOU" : "ERROU"}</span>
          <span class="tag dom">Domínio ${q.domain}</span>
          <strong>Questão ${i + 1}</strong>
        </div>
        <div class="q-stem" style="font-size:14.5px">${esc(q.stem)}</div>
        <ul class="q-options" style="margin-top:12px">${opts}</ul>
        <div class="explanation"><h4>Explicação</h4>${esc(q.explanation)}</div>
      </div>`;
    }).join("");

    app.innerHTML = `
      <div class="exam-shell">
        ${topbar("", "Relatório de pontuação")}
        <div class="result-hero">
          ${r.byTimeout ? '<p style="color:var(--warn);font-weight:600;margin-bottom:10px">⏱ Tempo esgotado — o exame foi encerrado automaticamente.</p>' : ""}
          <div class="verdict ${r.pass ? "pass" : "fail"}">${r.pass ? "APROVADO" : "REPROVADO"}</div>
          <div class="scaled">${r.score}</div>
          <div class="scale-note">Pontuação em escala de 100 a 1000 · nota de corte: 700 · ${r.correct}/${r.total} acertos</div>
          <div class="score-scale">
            <div class="track"><div class="cut"></div><div class="marker" style="left:${pct}%"></div></div>
            <div class="labels"><span>100</span><span>700 (corte)</span><span>1000</span></div>
          </div>
          <div style="margin-top:26px;display:flex;gap:12px;justify-content:center;flex-wrap:wrap">
            ${wrongCount ? `<button class="btn btn-primary" data-action="queue-wrong">Adicionar ${wrongCount} erro(s) à fila de revisão</button>` : ""}
            <button class="btn btn-light" data-action="start-exam">Novo simulado</button>
            <button class="btn btn-light" data-action="home">Voltar ao início</button>
          </div>
        </div>
        <div class="result-detail">
          <div class="section-title">Desempenho por domínio</div>
          <table class="domain-table"><tbody>${domRows}</tbody></table>
          <div class="section-title">Correção comentada</div>
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
        "Finalizar exame?",
        unanswered
          ? `Você ainda tem <strong>${unanswered}</strong> questão(ões) sem resposta. Depois de finalizar, não será possível voltar.`
          : "Depois de finalizar, não será possível voltar às questões.",
        "Finalizar exame",
        () => finishExam(false)
      );
    }
    else if (a === "queue-wrong") {
      const ids = JSON.parse(app.dataset.wrongIds || "[]");
      ids.forEach((id) => {
        const c = SRS.getCard(state, id);
        if (c.seen === 0) { c.seen = 1; c.wrong = 1; } // entra como aprendizado
        c.reps = 0; c.interval = 0; c.due = Date.now();
      });
      SRS.save(state);
      btn.textContent = "✔ Adicionados à fila de revisão";
      btn.disabled = true;
    }
    else if (a === "save-settings") {
      state.settings.newPerSession = Math.max(0, +($("#set-new").value || 0));
      state.settings.sessionSize = Math.max(5, +($("#set-size").value || 30));
      SRS.save(state);
      renderHome();
    }
    else if (a === "reset-progress") {
      confirmModal("Zerar todo o progresso?", "Isso apaga o histórico de repetição espaçada e de simulados deste navegador. Não é possível desfazer.", "Zerar tudo", () => {
        localStorage.removeItem("aif-c01-srs-v1");
        state = SRS.load();
        renderHome();
      });
    }
  });

  function toggleSelection(sel, origIdx, q) {
    if (q.type === "multiple") {
      if (sel.has(origIdx)) sel.delete(origIdx);
      else if (sel.size < q.correct.length) sel.add(origIdx);
      else { // limite atingido: substitui informando visualmente (mantém comportamento simples: ignora)
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
