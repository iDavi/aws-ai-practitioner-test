# Certification Practice Exams — Spaced Repetition

Multi-certification exam simulator with **spaced repetition**, 100% static (plain HTML/CSS/JS) — ready for GitHub Pages. Currently covers two certifications, switchable from the home screen:

- 🟠 **AWS Certified AI Practitioner (AIF-C01)** — UI and question bank in Portuguese.
- 🟣 **HashiCorp Certified: Terraform Associate (004)** — UI and question bank in English.

Each certification keeps its own question bank, spaced-repetition progress, and exam history, stored independently in the browser (`localStorage`), and each mimics the visual style of its real testing platform.

## What's in it

### AWS Certified AI Practitioner (AIF-C01)
164 questions in Portuguese covering all 5 domains at their official exam weights:

| Domain | Weight | Questions |
|---|---|---|
| 1 — Fundamentos de IA e ML | 20% | 36 |
| 2 — Fundamentos de IA Generativa | 24% | 38 |
| 3 — Aplicações de Modelos de Fundação | 28% | 45 |
| 4 — Diretrizes para IA Responsável | 14% | 23 |
| 5 — Segurança, Conformidade e Governança | 14% | 22 |

Practice exam: 65 questions, 90 minutes, scored on the real AWS 100–1000 scale (passing: 700).

### HashiCorp Certified: Terraform Associate (004)
119 questions in English covering all 8 objective domains from HashiCorp's current (004) exam guide:

| Domain | Questions |
|---|---|
| 1 — IaC Concepts | 9 |
| 2 — Terraform Fundamentals | 14 |
| 3 — Core Terraform Workflow | 16 |
| 4 — Terraform Configuration | 26 |
| 5 — Terraform Modules | 13 |
| 6 — Terraform State Management | 17 |
| 7 — Maintain Infrastructure with Terraform | 10 |
| 8 — HCP Terraform | 14 |

Practice exam: 57 questions, 60 minutes. HashiCorp does not publish an official passing score or per-domain weighting, so the exam sample size per domain is an unofficial estimate and results are reported as a percentage with the commonly cited ~70% pass bar, clearly labeled as such — not presented as official HashiCorp data.

> Note: the 003 exam version retired on January 8, 2026. This simulator targets the current **004** exam guide.

### Every question, in both banks, includes a didactic explanation — why the correct answer is right, and why each distractor is wrong.

## Features

- **Study session with spaced repetition** (SM-2 algorithm): a queue that reviews what's due first, introduces new questions gradually, and grades each question (Again / Hard / Good / Easy) to schedule its next review.
- **Full practice exam**: questions sampled per the real per-domain distribution, a countdown clock, flag-for-review, a final review screen, and a score report — no feedback during the exam, matching the real testing experience.
- **Practice by domain** and coverage/accuracy stats on the dashboard.
- **Certification switcher** on the home screen — progress, settings, and exam history are kept fully separate per certification.

## Publishing to GitHub Pages

1. In the repository, go to **Settings → Pages**.
2. Under **Build and deployment → Source**, choose **GitHub Actions** (the workflow at `.github/workflows/deploy-pages.yml` deploys automatically on every push).
   - Alternative without Actions: choose **Deploy from a branch** and select this branch with the `/ (root)` folder.
3. Visit `https://<your-username>.github.io/aws-ai-practitioner-test/`.

## Run locally

Just open `index.html` in a browser, or:

```bash
python3 -m http.server 8000
# http://localhost:8000
```

## Anki decks

Pre-built `.apkg` decks (one note per question, organized into per-domain subdecks, with the answer and explanation on the back) are available in `anki/`:

- `anki/AIF-C01-simulado.apkg`
- `anki/Terraform-Associate-004-simulado.apkg`

Import either one via Anki's **File → Import**.

## Structure

```
index.html                    # SPA entry point
css/style.css                 # exam-platform visual style (shared, theme-aware)
js/certs.js                   # certification registry + i18n strings (pt/en)
js/app.js                     # dashboard, study mode, exam mode, results
js/srs.js                     # spaced-repetition engine (SM-2), per-cert storage key
js/data/domainN.js            # AWS AIF-C01 question bank, by domain
js/data/terraform/domainN.js  # Terraform Associate 004 question bank, by domain
anki/*.apkg                   # pre-built Anki decks
```

> Unofficial study content created for exam preparation. AWS, AWS Certified AI Practitioner, HashiCorp, and Terraform Associate are trademarks of their respective owners.
