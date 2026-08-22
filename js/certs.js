/* ============================================================
 * Registro de certificações + strings de interface (i18n).
 * Cada certificação define seu próprio idioma de UI, banco de
 * questões, distribuição de domínios, formato de exame e
 * modelo de pontuação — e persiste progresso em uma chave de
 * localStorage própria (via SRS.load/save).
 * ============================================================ */
(function () {
  "use strict";

  const AIF_BANK = [].concat(window.DOMAIN1, window.DOMAIN2, window.DOMAIN3, window.DOMAIN4, window.DOMAIN5);
  const TF_BANK = [].concat(
    window.TF_DOMAIN1, window.TF_DOMAIN2, window.TF_DOMAIN3, window.TF_DOMAIN4,
    window.TF_DOMAIN5, window.TF_DOMAIN6, window.TF_DOMAIN7, window.TF_DOMAIN8
  );
  const DVA_BANK = [].concat(window.DVA_DOMAIN1, window.DVA_DOMAIN2, window.DVA_DOMAIN3, window.DVA_DOMAIN4);

  const CERTS = {
    aif: {
      id: "aif",
      lang: "pt",
      shortName: "AWS AI Practitioner",
      fullName: "AWS Certified AI Practitioner (AIF-C01)",
      titleHtml: '<span class="smile">AWS</span> Certified AI Practitioner (AIF-C01)',
      badgeText: "com repetição espaçada",
      heroText:
        "Banco de {n} questões no estilo do exame oficial, cobrindo os 5 domínios do guia AIF-C01. " +
        "Estude com repetição espaçada para fixar o conteúdo e faça simulados completos de {examQuestions} questões em {examMinutes} minutos, " +
        "na interface da plataforma de aplicação de exames.",
      bank: AIF_BANK,
      domains: {
        1: { name: "Fundamentos de IA e ML", examCount: 13, weight: 20 },
        2: { name: "Fundamentos de IA Generativa", examCount: 16, weight: 24 },
        3: { name: "Aplicações de Modelos de Fundação", examCount: 18, weight: 28 },
        4: { name: "Diretrizes para IA Responsável", examCount: 9, weight: 14 },
        5: { name: "Segurança, Conformidade e Governança", examCount: 9, weight: 14 }
      },
      examMinutes: 90,
      examQuestions: 65,
      scoring: "scaled",
      passScaled: 700,
      officialWeights: true,
      srsKey: "aif-c01-srs-v1"
    },
    tf: {
      id: "tf",
      lang: "en",
      shortName: "Terraform Associate",
      fullName: "HashiCorp Certified: Terraform Associate (004)",
      titleHtml: '<span class="smile">HashiCorp</span> Certified: Terraform Associate (004)',
      badgeText: "with spaced repetition",
      heroText:
        "A bank of {n} exam-style questions covering all 8 objective domains of the Terraform Associate (004) exam guide. " +
        "Study with spaced repetition to make it stick, then take a full {examQuestions}-question, {examMinutes}-minute practice exam " +
        "in an interface modeled on the real certification testing platform.",
      bank: TF_BANK,
      domains: {
        1: { name: "IaC Concepts", examCount: 5 },
        2: { name: "Terraform Fundamentals", examCount: 7 },
        3: { name: "Core Terraform Workflow", examCount: 8 },
        4: { name: "Terraform Configuration", examCount: 12 },
        5: { name: "Terraform Modules", examCount: 6 },
        6: { name: "Terraform State Management", examCount: 8 },
        7: { name: "Maintain Infrastructure with Terraform", examCount: 5 },
        8: { name: "HCP Terraform", examCount: 6 }
      },
      examMinutes: 60,
      examQuestions: 57,
      scoring: "percent",
      passPercent: 70,
      officialWeights: false,
      srsKey: "tf-004-srs-v1"
    },
    dva: {
      id: "dva",
      lang: "en",
      shortName: "AWS Developer Associate",
      fullName: "AWS Certified Developer – Associate (DVA-C02)",
      titleHtml: '<span class="smile">AWS</span> Certified Developer – Associate (DVA-C02)',
      badgeText: "with spaced repetition",
      heroText:
        "A bank of {n} exam-style questions covering the 4 domains of the DVA-C02 exam guide at their official weights, " +
        "pitched slightly above the real exam so the real thing feels easier. Every explanation teaches the underlying rule, " +
        "not just the answer. Study with spaced repetition, then sit a full {examQuestions}-question, {examMinutes}-minute practice exam " +
        "in an interface modeled on the real certification testing platform.",
      bank: DVA_BANK,
      domains: {
        1: { name: "Development with AWS Services", examCount: 21, weight: 32 },
        2: { name: "Security", examCount: 17, weight: 26 },
        3: { name: "Deployment", examCount: 16, weight: 24 },
        4: { name: "Troubleshooting and Optimization", examCount: 11, weight: 18 }
      },
      examMinutes: 130,
      examQuestions: 65,
      scoring: "scaled",
      passScaled: 720,
      officialWeights: true,
      srsKey: "dva-c02-srs-v1"
    }
  };

  /* ---------------- i18n ---------------- */
  const STR = {
    pt: {
      statDue: "Revisões vencidas hoje",
      statNew: "Questões novas",
      statLearning: "Em aprendizado",
      statMastered: "Dominadas (intervalo ≥ 21 d)",

      modeStudyTitle: "📚 Sessão de estudo",
      modeStudyDesc: "Fila inteligente de repetição espaçada: revisa primeiro o que está vencido e introduz questões novas aos poucos. Feedback imediato com explicação detalhada de cada alternativa.",
      modeStudyMeta: "{due} vencidas · até {n} novas por sessão",
      modeStudyBtn: "Iniciar sessão",

      modeExamTitle: "🖥️ Exame simulado completo",
      modeExamDesc: "{n} questões sorteadas com os pesos oficiais por domínio, {min} minutos no relógio, marcação para revisão e relatório de pontuação. Sem feedback durante a prova — igual ao exame real.",
      modeExamMeta: "Sem feedback durante a prova — igual ao exame real",
      modeExamBtn: "Iniciar exame",

      modeSettingsTitle: "⚙️ Configurações",
      modeSettingsDesc: "Ajuste o ritmo da repetição espaçada.",
      settingsNewLabel: "Novas por sessão:",
      settingsSizeLabel: "Tamanho da sessão:",
      settingsSave: "Salvar",
      settingsReset: "Zerar progresso",

      sectionDomainPerf: "Desempenho por domínio",
      sectionExamHistory: "Histórico de simulados",
      thDomain: "Domínio", thCoverage: "Cobertura", thAccuracy: "Precisão",
      thDate: "Data", thScore: "Pontuação", thResult: "Resultado", thCorrect: "Acertos",
      historyEmpty: "Nenhum simulado concluído ainda.",
      coveragePctSeen: "{pct}% visto",
      accuracyPct: "{pct}% acerto",
      accuracyNone: "—",
      practiceBtn: "Praticar",
      domainMetaOfficial: "{pct}% do exame · {bankCount} questões no banco · {due} a revisar",
      domainMetaEstimated: "~{pct}% do exame ({examCount} de {examQuestions} questões) · {bankCount} questões no banco · {due} a revisar",

      chipNew: "NOVA", chipDue: "REVISÃO",
      chipDone: "{n} feitas",
      remainingLabel: "Restam {n}",
      questionOf: "Questão {i} de {n}",
      directiveSingle: "Selecione UMA alternativa.",
      directiveMulti2: "Selecione DUAS alternativas.",
      directiveMulti3: "Selecione TRÊS alternativas.",
      feedbackCorrect: "✔ Resposta correta",
      feedbackIncorrect: "✘ Resposta incorreta",
      explanationHeader: "Explicação",
      srsHint: "Como foi lembrar desta questão? Isso define quando ela voltará a aparecer.",
      gradeAgain: "Errei", gradeHard: "Difícil", gradeGood: "Bom", gradeEasy: "Fácil",
      gradeContinue: "Continuar (rever em breve)",
      footerQuit: "Encerrar sessão", footerCheck: "Responder",
      studyDoneTitle: "Sessão concluída!",
      studyDoneBody: "Você respondeu <strong>{done}</strong> questões com <strong>{acc}%</strong> de acerto.<br>Ainda restam <strong>{due}</strong> revisões vencidas e <strong>{neu}</strong> questões novas no banco.",
      studyDoneNewSession: "Nova sessão", studyDoneHome: "Voltar ao início",
      studySubtitle: "Sessão de estudo",
      practiceSubtitle: "Prática: Domínio {d}",

      candidateLabel: "Candidato(a): você",
      markForReview: "Marcar para revisão",
      reviewAll: "Revisar tudo",
      prevBtn: "‹ Anterior", nextBtn: "Próxima ›", goReviewBtn: "Ir para revisão ›",
      reviewTitle: "Revisão das questões",
      reviewBodyUnanswered: "Clique em uma questão para voltar a ela. Questões marcadas com <span style=\"color:var(--err)\">⚑</span> foram sinalizadas para revisão. <strong style=\"color:var(--warn)\">Atenção: {n} questão(ões) sem resposta.</strong>",
      reviewBodyClean: "Clique em uma questão para voltar a ela. Questões marcadas com <span style=\"color:var(--err)\">⚑</span> foram sinalizadas para revisão. Todas as questões foram respondidas.",
      legendAnswered: "⬜ Respondida", legendUnanswered: "🟧 Sem resposta", legendFlagged: "⚑ Marcada para revisão",
      reviewMarked: "Revisar marcadas", reviewBlank: "Revisar sem resposta", finishExamBtn: "Finalizar exame",
      answeredLabel: "Respondida", unansweredLabel: "Sem resposta",
      reviewSubtitle: "Revisão — {n} questões",

      modalFinishTitle: "Finalizar exame?",
      modalFinishBodyUnanswered: "Você ainda tem <strong>{n}</strong> questão(ões) sem resposta. Depois de finalizar, não será possível voltar.",
      modalFinishBodyClean: "Depois de finalizar, não será possível voltar às questões.",
      modalCancel: "Cancelar", modalConfirmFinish: "Finalizar exame",

      resultsSubtitle: "Relatório de pontuação",
      timeUpNotice: "⏱ Tempo esgotado — o exame foi encerrado automaticamente.",
      verdictPass: "APROVADO", verdictFail: "REPROVADO",
      scoreNoteScaled: "Pontuação em escala de 100 a 1000 · nota de corte: {cut} · {correct}/{total} acertos",
      scoreNotePercent: "{correct}/{total} acertos · a HashiCorp não publica a nota de corte oficial, mas ela gira historicamente em torno de {cut}%",
      addWrongBtn: "Adicionar {n} erro(s) à fila de revisão",
      addWrongDone: "✔ Adicionados à fila de revisão",
      newExamBtn: "Novo simulado", homeBtn: "Voltar ao início",
      domainMeets: "Atende às competências", domainNeedsWork: "Precisa de reforço",
      correctionTitle: "Correção comentada",
      tagCorrect: "ACERTOU", tagIncorrect: "ERROU",
      tagDomain: "Domínio {d}",
      questionLabel: "Questão {i}",
      yourAnswerMark: "✘ sua resposta", correctMark: "✔ correta",

      resetConfirmTitle: "Zerar todo o progresso?",
      resetConfirmBody: "Isso apaga o histórico de repetição espaçada e de simulados deste navegador para esta certificação. Não é possível desfazer.",
      resetConfirmBtn: "Zerar tudo",

      emptyStudyDoneIcon: "🎉"
    },
    en: {
      statDue: "Due for review today",
      statNew: "New questions",
      statLearning: "Learning",
      statMastered: "Mastered (interval ≥ 21 d)",

      modeStudyTitle: "📚 Study session",
      modeStudyDesc: "A spaced-repetition queue that reviews what's due first and introduces new questions gradually. Immediate feedback with a detailed explanation for every option.",
      modeStudyMeta: "{due} due · up to {n} new per session",
      modeStudyBtn: "Start session",

      modeExamTitle: "🖥️ Full practice exam",
      modeExamDesc: "{n} questions drawn with the real per-domain distribution, a {min}-minute clock, flag-for-review, and a full score report. No feedback during the exam — just like the real thing.",
      modeExamMeta: "No feedback during the exam — just like the real thing",
      modeExamBtn: "Start exam",

      modeSettingsTitle: "⚙️ Settings",
      modeSettingsDesc: "Tune the pace of spaced repetition.",
      settingsNewLabel: "New per session:",
      settingsSizeLabel: "Session size:",
      settingsSave: "Save",
      settingsReset: "Reset progress",

      sectionDomainPerf: "Performance by domain",
      sectionExamHistory: "Practice exam history",
      thDomain: "Domain", thCoverage: "Coverage", thAccuracy: "Accuracy",
      thDate: "Date", thScore: "Score", thResult: "Result", thCorrect: "Correct",
      historyEmpty: "No practice exam completed yet.",
      coveragePctSeen: "{pct}% seen",
      accuracyPct: "{pct}% correct",
      accuracyNone: "—",
      practiceBtn: "Practice",
      domainMetaOfficial: "{pct}% of the exam · {bankCount} questions in bank · {due} due",
      domainMetaEstimated: "~{pct}% of the exam ({examCount} of {examQuestions} questions, unofficial estimate) · {bankCount} questions in bank · {due} due",

      chipNew: "NEW", chipDue: "DUE",
      chipDone: "{n} done",
      remainingLabel: "{n} left",
      questionOf: "Question {i} of {n}",
      directiveSingle: "Select ONE option.",
      directiveMulti2: "Select TWO options.",
      directiveMulti3: "Select THREE options.",
      feedbackCorrect: "✔ Correct answer",
      feedbackIncorrect: "✘ Incorrect answer",
      explanationHeader: "Explanation",
      srsHint: "How did it feel to recall this one? This decides when it comes back around.",
      gradeAgain: "Again", gradeHard: "Hard", gradeGood: "Good", gradeEasy: "Easy",
      gradeContinue: "Continue (review again soon)",
      footerQuit: "End session", footerCheck: "Check answer",
      studyDoneTitle: "Session complete!",
      studyDoneBody: "You answered <strong>{done}</strong> questions with <strong>{acc}%</strong> accuracy.<br>There are still <strong>{due}</strong> reviews due and <strong>{neu}</strong> new questions in the bank.",
      studyDoneNewSession: "New session", studyDoneHome: "Back to dashboard",
      studySubtitle: "Study session",
      practiceSubtitle: "Practice: Domain {d}",

      candidateLabel: "Candidate: you",
      markForReview: "Mark for review",
      reviewAll: "Review all",
      prevBtn: "‹ Previous", nextBtn: "Next ›", goReviewBtn: "Go to review ›",
      reviewTitle: "Review questions",
      reviewBodyUnanswered: "Click a question to jump back to it. Questions marked with <span style=\"color:var(--err)\">⚑</span> were flagged for review. <strong style=\"color:var(--warn)\">Warning: {n} question(s) unanswered.</strong>",
      reviewBodyClean: "Click a question to jump back to it. Questions marked with <span style=\"color:var(--err)\">⚑</span> were flagged for review. All questions have been answered.",
      legendAnswered: "⬜ Answered", legendUnanswered: "🟧 Unanswered", legendFlagged: "⚑ Flagged for review",
      reviewMarked: "Review flagged", reviewBlank: "Review unanswered", finishExamBtn: "End exam",
      answeredLabel: "Answered", unansweredLabel: "Unanswered",
      reviewSubtitle: "Review — {n} questions",

      modalFinishTitle: "End the exam?",
      modalFinishBodyUnanswered: "You still have <strong>{n}</strong> question(s) unanswered. Once you end the exam, you won't be able to go back.",
      modalFinishBodyClean: "Once you end the exam, you won't be able to go back to any question.",
      modalCancel: "Cancel", modalConfirmFinish: "End exam",

      resultsSubtitle: "Score Report",
      timeUpNotice: "⏱ Time's up — the exam was ended automatically.",
      verdictPass: "PASS", verdictFail: "FAIL",
      scoreNoteScaled: "Score on a 100–1000 scale · passing score: {cut} · {correct}/{total} correct",
      scoreNotePercent: "{correct}/{total} correct · HashiCorp does not publish an official passing score, but candidates historically need roughly {cut}% to pass",
      addWrongBtn: "Add {n} mistake(s) to the review queue",
      addWrongDone: "✔ Added to the review queue",
      newExamBtn: "New practice exam", homeBtn: "Back to dashboard",
      domainMeets: "Meets the bar", domainNeedsWork: "Needs more work",
      correctionTitle: "Answer Review",
      tagCorrect: "CORRECT", tagIncorrect: "INCORRECT",
      tagDomain: "Domain {d}",
      questionLabel: "Question {i}",
      yourAnswerMark: "✘ your answer", correctMark: "✔ correct",

      resetConfirmTitle: "Reset all progress?",
      resetConfirmBody: "This erases the spaced-repetition and practice-exam history stored in this browser for this certification. This cannot be undone.",
      resetConfirmBtn: "Reset everything",

      emptyStudyDoneIcon: "🎉"
    }
  };

  function fmt(str, vars) {
    if (!str) return "";
    return str.replace(/\{(\w+)\}/g, (_, k) => (vars && vars[k] != null ? vars[k] : ""));
  }

  window.CERTS = CERTS;
  window.I18N = {
    t(langOrCert, key, vars) {
      const lang = typeof langOrCert === "string" ? langOrCert : langOrCert.lang;
      const str = (STR[lang] && STR[lang][key]) || (STR.pt[key]) || key;
      return fmt(str, vars);
    }
  };
})();
