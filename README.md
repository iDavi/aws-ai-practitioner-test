# Simulado AWS Certified AI Practitioner (AIF-C01)

Simulador do exame **AWS Certified AI Practitioner (AIF-C01)** com **repetição espaçada**, 100% estático (HTML/CSS/JS puro) — pronto para GitHub Pages.

## O que tem

- **164 questões em português** no estilo do exame oficial, cobrindo os 5 domínios com os pesos do guia do exame:
  - Domínio 1 — Fundamentos de IA e ML (20%) — 36 questões
  - Domínio 2 — Fundamentos de IA Generativa (24%) — 38 questões
  - Domínio 3 — Aplicações de Modelos de Fundação (28%) — 45 questões
  - Domínio 4 — Diretrizes para IA Responsável (14%) — 23 questões
  - Domínio 5 — Segurança, Conformidade e Governança (14%) — 22 questões
- Cada questão tem **explicação didática** (por que a correta está certa e as erradas, erradas).
- **Modo estudo com repetição espaçada** (algoritmo SM-2): revisa primeiro o que está vencido, introduz novas aos poucos, e você gradua cada questão (Errei / Difícil / Bom / Fácil).
- **Exame simulado completo**: 65 questões sorteadas com os pesos oficiais, 90 minutos, marcação para revisão, tela de revisão final e relatório com pontuação em escala 100–1000 (corte: 700) — na interface da plataforma de aplicação de exames.
- **Prática por domínio** e estatísticas de cobertura/precisão.
- Progresso salvo em `localStorage` (por navegador). Erros do simulado podem ser adicionados à fila de revisão.

## Como publicar no GitHub Pages

1. No repositório, vá em **Settings → Pages**.
2. Em **Build and deployment → Source**, escolha **GitHub Actions** (o workflow em `.github/workflows/deploy-pages.yml` publica automaticamente a cada push).
   - Alternativa sem Actions: escolha **Deploy from a branch** e selecione esta branch com a pasta `/ (root)`.
3. Acesse `https://<seu-usuario>.github.io/aws-ai-practitioner-test/`.

## Rodar localmente

Basta abrir o `index.html` no navegador, ou:

```bash
python3 -m http.server 8000
# http://localhost:8000
```

## Estrutura

```
index.html          # entrada da SPA
css/style.css       # visual estilo plataforma de exame AWS
js/app.js           # dashboard, modo estudo, exame simulado, resultados
js/srs.js           # motor de repetição espaçada (SM-2)
js/data/domainN.js  # banco de questões por domínio
```

> Conteúdo de estudo não oficial, criado para preparação. AWS e AWS Certified AI Practitioner são marcas da Amazon Web Services, Inc.
