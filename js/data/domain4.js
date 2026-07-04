/* Domínio 4 — Diretrizes para IA Responsável (14% do exame AIF-C01) */
window.DOMAIN4 = [
  {
    id: "d4-01", domain: 4, type: "multiple",
    stem: "Uma empresa está definindo os princípios de IA responsável para orientar seus projetos.\n\nQuais características fazem parte das dimensões de IA responsável? (Selecione DUAS.)",
    options: [
      "Justiça (fairness): o sistema trata diferentes grupos de forma equitativa",
      "Explicabilidade: é possível entender e justificar as saídas do sistema",
      "Máxima receita por usuário em todas as decisões",
      "Uso do maior modelo disponível no mercado",
      "Ocultação dos limites do sistema para os usuários"
    ],
    correct: [0, 1],
    explanation: "Dimensões centrais de IA responsável incluem: justiça, explicabilidade, transparência, privacidade e segurança, robustez, veracidade, controlabilidade/governança e segurança contra uso indevido. Receita, tamanho de modelo e ocultar limitações não são princípios de IA responsável — transparência exige justamente comunicar capacidades e limitações."
  },
  {
    id: "d4-02", domain: 4, type: "single",
    stem: "Um modelo de aprovação de crédito foi treinado com dados históricos nos quais determinados bairros tinham poucas aprovações. Em produção, o modelo nega crédito de forma desproporcional a moradores desses bairros com perfis financeiros equivalentes aos de outros aprovados.\n\nQual problema esse cenário descreve?",
    options: [
      "Viés (bias) herdado dos dados de treinamento, gerando disparidade entre grupos.",
      "Overfitting no conjunto de validação.",
      "Alucinação do modelo.",
      "Latência excessiva de inferência."
    ],
    correct: [0],
    explanation: "Modelos aprendem os padrões dos dados — incluindo discriminações históricas. O resultado é viés algorítmico com disparidade demográfica entre grupos. Mitigações: datasets balanceados e representativos, medição de fairness por subgrupo (ex.: SageMaker Clarify), features cuidadosamente selecionadas e revisão humana em decisões de alto impacto."
  },
  {
    id: "d4-03", domain: 4, type: "single",
    stem: "Antes de treinar um modelo de RH para triagem de currículos, a equipe quer verificar se o conjunto de dados apresenta desequilíbrios entre grupos demográficos, e depois medir se as previsões do modelo favorecem algum grupo.\n\nQual serviço da AWS atende a esses DOIS requisitos?",
    options: [
      "Amazon SageMaker Clarify",
      "Amazon SageMaker Ground Truth",
      "AWS CloudTrail",
      "Amazon Inspector"
    ],
    correct: [0],
    explanation: "O SageMaker Clarify detecta viés nos DADOS (pré-treinamento, ex.: desequilíbrio de classes entre grupos) e nas PREVISÕES do modelo (pós-treinamento), além de fornecer explicabilidade via atribuição de features (valores SHAP). Ground Truth rotula dados, CloudTrail audita APIs e Inspector encontra vulnerabilidades de software."
  },
  {
    id: "d4-04", domain: 4, type: "single",
    stem: "Um cliente de um banco teve o financiamento negado por um modelo de ML e exige, com respaldo regulatório, saber quais fatores mais influenciaram a decisão.\n\nQual capacidade do Amazon SageMaker Clarify atende a esse requisito?",
    options: [
      "Explicabilidade por atribuição de features (por exemplo, valores SHAP), mostrando a contribuição de cada atributo para a previsão.",
      "Rotulagem automática dos dados de entrada.",
      "Redução automática da latência do endpoint.",
      "Criptografia dos dados de treinamento."
    ],
    correct: [0],
    explanation: "O Clarify gera explicações por atribuição de features (SHAP), quantificando o peso de cada atributo (renda, histórico, endividamento) em uma previsão específica ou no modelo como um todo — essencial para atender exigências regulatórias de explicabilidade. As demais opções não são funções do Clarify."
  },
  {
    id: "d4-05", domain: 4, type: "single",
    stem: "Uma seguradora usa ML para precificar apólices e precisa monitorar continuamente se o modelo em produção começa a apresentar desvio de viés (bias drift) com o passar do tempo.\n\nQual serviço da AWS atende a esse requisito?",
    options: [
      "Amazon SageMaker Model Monitor (integrado ao SageMaker Clarify)",
      "AWS Artifact",
      "Amazon Polly",
      "AWS Cost Explorer"
    ],
    correct: [0],
    explanation: "O SageMaker Model Monitor monitora modelos em produção e, integrado ao Clarify, detecta desvio de viés e de atribuição de features ao longo do tempo, além de drift de dados e de qualidade, com alertas via CloudWatch. Artifact fornece relatórios de compliance, Polly é texto-para-fala e Cost Explorer analisa custos."
  },
  {
    id: "d4-06", domain: 4, type: "single",
    stem: "Um sistema de ML processa reembolsos automaticamente, mas a empresa quer que reembolsos acima de determinado valor ou com baixa confiança do modelo sejam revisados por uma pessoa antes da decisão final.\n\nQual serviço da AWS implementa esse fluxo com o MENOR esforço de desenvolvimento?",
    options: [
      "Amazon Augmented AI (Amazon A2I)",
      "Amazon SageMaker JumpStart",
      "AWS Step Functions sem intervenção humana",
      "Amazon EventBridge"
    ],
    correct: [0],
    explanation: "O Amazon A2I adiciona fluxos de revisão humana (human-in-the-loop) a previsões de ML: define condições de acionamento (ex.: baixa confiança, alto valor) e encaminha os casos para revisores humanos. É a implementação gerenciada do princípio de supervisão humana em decisões de alto impacto. As demais opções não fornecem revisão humana gerenciada."
  },
  {
    id: "d4-07", domain: 4, type: "single",
    stem: "Uma empresa quer aplicar políticas de segurança de conteúdo consistentes em vários assistentes de IA generativa: bloquear temas proibidos, filtrar conteúdo de ódio e mascarar dados pessoais nas respostas.\n\nQual recurso da AWS atende a esses requisitos de forma centralizada?",
    options: [
      "Amazon Bedrock Guardrails",
      "Amazon Bedrock Knowledge Bases",
      "AWS IAM Access Analyzer",
      "Amazon CloudFront"
    ],
    correct: [0],
    explanation: "O Bedrock Guardrails define políticas reutilizáveis de IA responsável — filtros de conteúdo nocivo (ódio, insultos, violência, conteúdo sexual), tópicos negados, filtros de palavras, mascaramento/bloqueio de PII e verificação de fundamentação — aplicáveis a diferentes modelos e agentes. Knowledge Bases é RAG; IAM Access Analyzer e CloudFront não filtram conteúdo gerado."
  },
  {
    id: "d4-08", domain: 4, type: "single",
    stem: "Um modelo de visão computacional para controle de qualidade foi treinado apenas com fotos tiradas em uma fábrica bem iluminada. Em fábricas com iluminação diferente, o desempenho despenca.\n\nQual prática de IA responsável teria evitado esse problema?",
    options: [
      "Treinar com um conjunto de dados diversificado e representativo das condições reais de uso.",
      "Aumentar a temperatura do modelo.",
      "Reduzir o número de épocas de treinamento.",
      "Usar um modelo com mais parâmetros, mantendo os mesmos dados."
    ],
    correct: [0],
    explanation: "Robustez e justiça começam nos dados: o conjunto de treinamento deve refletir a diversidade do ambiente real (iluminação, ângulos, populações, dialetos etc.). Sem representatividade, nenhum aumento de modelo ou ajuste de hiperparâmetros corrige a lacuna. Temperatura nem se aplica a modelos de visão discriminativos."
  },
  {
    id: "d4-09", domain: 4, type: "single",
    stem: "Qual é a relação entre o equilíbrio viés-variância (bias-variance trade-off) e os efeitos indesejados de modelos de ML?",
    options: [
      "Alto viés leva a underfitting (o modelo erra sistematicamente); alta variância leva a overfitting (o modelo não generaliza) — ambos degradam a qualidade e a equidade das decisões.",
      "Alto viés melhora a generalização e deve ser maximizado.",
      "Alta variância garante previsões justas entre grupos demográficos.",
      "Viés e variância não têm relação com o desempenho do modelo."
    ],
    correct: [0],
    explanation: "Alto viés (modelo simples demais) causa underfitting — erros sistemáticos que podem prejudicar grupos inteiros. Alta variância (modelo complexo demais) causa overfitting — decisões instáveis e não generalizáveis. O objetivo é equilibrar os dois, com dados adequados, regularização e validação, para decisões confiáveis e equitativas."
  },
  {
    id: "d4-10", domain: 4, type: "multiple",
    stem: "O jurídico de uma empresa levantou riscos de adotar IA generativa em conteúdo publicado aos clientes.\n\nQuais são riscos LEGAIS relevantes desse uso? (Selecione DUAS.)",
    options: [
      "Violação de propriedade intelectual, se o modelo reproduzir conteúdo protegido por direitos autorais",
      "Danos a clientes causados por informações incorretas geradas com aparência de fato (alucinações)",
      "Aumento do tempo de treinamento dos modelos",
      "Elevação do custo de armazenamento em disco",
      "Necessidade de mais memória RAM nos servidores"
    ],
    correct: [0, 1],
    explanation: "Riscos legais típicos de IA generativa: propriedade intelectual (saídas que reproduzem obras protegidas), responsabilidade por informações incorretas fornecidas a clientes, privacidade/vazamento de dados pessoais e vieses discriminatórios com consequência regulatória. Tempo de treinamento, disco e RAM são questões técnicas/custo, não riscos legais."
  },
  {
    id: "d4-11", domain: 4, type: "single",
    stem: "Uma equipe precisa escolher entre um modelo de deep learning com desempenho um pouco melhor e um modelo de árvore de decisão simples para um caso de uso regulado que exige justificar cada decisão a auditores.\n\nQual consideração está correta?",
    options: [
      "Existe um trade-off entre desempenho e interpretabilidade: o modelo mais simples e interpretável pode ser preferível quando a explicabilidade é requisito regulatório.",
      "O modelo de deep learning deve sempre ser escolhido, pois desempenho é o único critério.",
      "Modelos simples não podem ser usados em produção.",
      "Interpretabilidade e desempenho sempre crescem juntos."
    ],
    correct: [0],
    explanation: "Modelos complexos (deep learning) tendem a maior desempenho e menor interpretabilidade; modelos simples (árvores, regressões lineares) são transparentes e fáceis de justificar. Em contextos regulados, a interpretabilidade pode valer mais que um ganho marginal de acurácia — ou exigir técnicas de explicabilidade (SHAP/Clarify) sobre o modelo complexo."
  },
  {
    id: "d4-12", domain: 4, type: "single",
    stem: "Uma empresa quer documentar de forma padronizada as informações de cada modelo: finalidade prevista, dados de treinamento, métricas de avaliação, limitações e considerações éticas — para governança e auditoria.\n\nQual recurso da AWS atende a esse requisito?",
    options: [
      "Amazon SageMaker Model Cards",
      "Amazon SageMaker Feature Store",
      "AWS Secrets Manager",
      "Amazon ECR"
    ],
    correct: [0],
    explanation: "O SageMaker Model Cards cria fichas padronizadas de modelos com uso pretendido, dados, métricas, limitações e considerações de risco — apoiando transparência, governança e auditoria. Feature Store armazena features, Secrets Manager guarda credenciais e ECR armazena imagens de contêiner."
  },
  {
    id: "d4-13", domain: 4, type: "single",
    stem: "Antes de usar um serviço de IA da AWS, uma equipe quer consultar a documentação oficial da AWS que descreve os casos de uso previstos, as limitações e as práticas recomendadas de IA responsável daquele serviço.\n\nOnde encontrar essas informações?",
    options: [
      "Nos AWS AI Service Cards publicados pela AWS.",
      "No AWS Pricing Calculator.",
      "No console do Amazon EC2.",
      "Nos logs do AWS CloudTrail."
    ],
    correct: [0],
    explanation: "Os AWS AI Service Cards são a documentação de transparência da própria AWS sobre seus serviços de IA (ex.: Rekognition, Textract, Titan): casos de uso previstos, limitações, design responsável e boas práticas de implantação. Calculadora de preços, console EC2 e CloudTrail não trazem essas orientações."
  },
  {
    id: "d4-14", domain: 4, type: "single",
    stem: "Ao escolher entre um modelo proprietário fechado e um modelo open source (de pesos abertos), qual vantagem de TRANSPARÊNCIA o modelo aberto pode oferecer?",
    options: [
      "Maior visibilidade sobre a arquitetura e os pesos, permitindo inspeção, auditoria e customização mais profundas pela comunidade e pela empresa.",
      "Garantia de que o modelo nunca produzirá conteúdo enviesado.",
      "Ausência de qualquer licença ou termo de uso.",
      "Desempenho sempre superior aos modelos proprietários."
    ],
    correct: [0],
    explanation: "Modelos abertos permitem inspecionar arquitetura e pesos, auditar comportamentos, hospedar no próprio ambiente e customizar profundamente — ganho de transparência e controle. Mas continuam sujeitos a licenças (ex.: licenças da comunidade), podem ter vieses como qualquer modelo e não são automaticamente melhores em desempenho."
  },
  {
    id: "d4-15", domain: 4, type: "single",
    stem: "Qual prática exemplifica \"design centrado no ser humano\" (human-centered design) em IA explicável?",
    options: [
      "Projetar o sistema para amplificar a capacidade de decisão do usuário: mostrar o grau de confiança, as principais razões da recomendação e permitir contestar ou corrigir a decisão.",
      "Ocultar do usuário que ele está interagindo com um sistema de IA.",
      "Automatizar todas as decisões sem possibilidade de intervenção humana.",
      "Exibir apenas a decisão final, sem contexto, para simplificar a interface."
    ],
    correct: [0],
    explanation: "Design centrado no humano coloca o usuário no controle: comunica que há IA envolvida, expõe confiança e justificativas, oferece caminhos de contestação/correção e mantém supervisão humana em decisões de alto impacto (ex.: com Amazon A2I). Ocultar a IA e remover a intervenção humana contrariam o princípio."
  },
  {
    id: "d4-16", domain: 4, type: "single",
    stem: "Uma empresa vai lançar um chatbot público e quer reduzir o risco de que ele produza respostas tóxicas ou inadequadas aos usuários.\n\nQual combinação de práticas é a MAIS eficaz?",
    options: [
      "Aplicar guardrails com filtros de conteúdo na entrada e na saída, testar o sistema com red teaming antes do lançamento e monitorar as interações em produção.",
      "Confiar apenas no alinhamento nativo do modelo, sem camadas adicionais.",
      "Liberar o chatbot e corrigir problemas apenas se houver reclamações públicas.",
      "Restringir o chatbot a responder somente \"sim\" e \"não\"."
    ],
    correct: [0],
    explanation: "Segurança de conteúdo em camadas: guardrails de entrada/saída (ex.: Bedrock Guardrails), testes adversariais (red teaming) pré-lançamento e monitoramento contínuo com feedback. Confiar só no alinhamento do modelo é insuficiente; esperar reclamações é reativo e arriscado; limitar a \"sim/não\" destrói a utilidade sem tratar o risco."
  },
  {
    id: "d4-17", domain: 4, type: "single",
    stem: "Qual característica de um conjunto de dados contribui DIRETAMENTE para um modelo mais justo (fair)?",
    options: [
      "Representatividade balanceada dos diferentes grupos e cenários sobre os quais o modelo tomará decisões.",
      "Conter apenas os exemplos mais recentes, descartando o restante.",
      "Ser o maior possível, mesmo que todos os dados venham de um único grupo.",
      "Ter sido coletado sem nenhuma documentação de origem."
    ],
    correct: [0],
    explanation: "Justiça exige dados balanceados, inclusivos e representativos dos grupos afetados — quantidade não substitui diversidade (um dataset gigante de um único grupo continua enviesado). A documentação de origem (proveniência) também é parte da curadoria responsável; descartá-la prejudica auditoria e qualidade."
  },
  {
    id: "d4-18", domain: 4, type: "single",
    stem: "Um sistema de reconhecimento facial apresenta taxa de erro muito maior para determinados tons de pele. A equipe quer MEDIR essa disparidade de forma objetiva antes de corrigi-la.\n\nQual abordagem atende a esse requisito?",
    options: [
      "Avaliar as métricas de desempenho do modelo separadamente por subgrupo demográfico e comparar as taxas de erro entre eles.",
      "Calcular apenas a acurácia média global do modelo.",
      "Aumentar o limiar de confiança para todos os usuários igualmente.",
      "Reduzir o tamanho do conjunto de teste."
    ],
    correct: [0],
    explanation: "Disparidades só aparecem quando as métricas são desagregadas por subgrupo (taxas de falso positivo/negativo por grupo) — a acurácia média global mascara o problema. Ferramentas como o SageMaker Clarify calculam métricas de disparidade demográfica. Ajustar limiares globais ou encolher o teste não mede nem corrige a desigualdade."
  },
  {
    id: "d4-19", domain: 4, type: "single",
    stem: "Por que a \"veracidade\" (veracity) é uma preocupação específica de IA responsável em aplicações de IA generativa voltadas ao público?",
    options: [
      "Porque modelos generativos podem produzir conteúdo falso com aparência confiável, exigindo mecanismos de fundamentação, verificação e comunicação de limitações aos usuários.",
      "Porque modelos generativos nunca erram, dispensando verificação.",
      "Porque a veracidade só se aplica a modelos de visão computacional.",
      "Porque respostas verdadeiras aumentam a latência do sistema."
    ],
    correct: [0],
    explanation: "LLMs geram texto plausível sem garantia de verdade (alucinações). Em aplicações públicas, isso exige: fundamentação em fontes (RAG + verificação de grounding), avisos sobre limitações, revisão humana quando o impacto é alto e monitoramento. As demais alternativas são falsas ou sem sentido."
  },
  {
    id: "d4-20", domain: 4, type: "single",
    stem: "Uma empresa de mídia quer indicar aos consumidores quando uma imagem foi gerada por IA, para combater desinformação.\n\nQual mecanismo apoia esse objetivo?",
    options: [
      "Marca-d'água (watermarking) e metadados de proveniência embutidos nas imagens geradas, como faz o Amazon Titan Image Generator.",
      "Aumentar a resolução das imagens geradas.",
      "Excluir as imagens após 24 horas.",
      "Usar temperatura baixa na geração."
    ],
    correct: [0],
    explanation: "Watermarking invisível e metadados de proveniência identificam conteúdo gerado por IA — o Amazon Titan Image Generator aplica marca-d'água invisível por padrão, e a API de detecção permite verificá-la. Resolução, prazo de retenção e temperatura não indicam a origem do conteúdo."
  },
  {
    id: "d4-21", domain: 4, type: "single",
    stem: "Durante a seleção de um modelo de fundação, quais fatores estão relacionados à sustentabilidade ambiental da solução?",
    options: [
      "O consumo computacional do modelo: modelos menores e mais eficientes consomem menos energia no treinamento e na inferência.",
      "A cor do logotipo do provedor do modelo.",
      "O número de idiomas suportados pelo modelo.",
      "O nome da região da AWS utilizada."
    ],
    correct: [0],
    explanation: "O impacto ambiental de IA vem principalmente da computação: preferir modelos do tamanho adequado à tarefa, técnicas eficientes de customização e hardware otimizado (ex.: AWS Inferentia/Trainium) reduz consumo de energia e custo. Idiomas suportados são critério funcional, e as demais opções são irrelevantes."
  },
  {
    id: "d4-22", domain: 4, type: "single",
    stem: "Uma equipe quer detectar toxicidade e viés nas SAÍDAS de um modelo de fundação durante a fase de escolha do modelo, usando avaliações padronizadas.\n\nQual recurso da AWS apoia essa análise?",
    options: [
      "Amazon Bedrock Model Evaluation (ou SageMaker Clarify FM evaluation), que inclui métricas como toxicidade e robustez.",
      "AWS Cost Explorer.",
      "Amazon Route 53.",
      "AWS Direct Connect."
    ],
    correct: [0],
    explanation: "O Bedrock Model Evaluation e a avaliação de FMs do SageMaker Clarify avaliam modelos com métricas de qualidade E de responsabilidade (toxicidade, robustez a variações, estereótipos), com datasets integrados ou próprios e opção de avaliadores humanos. Cost Explorer é custo, Route 53 é DNS e Direct Connect é rede dedicada."
  },
  {
    id: "d4-23", domain: 4, type: "single",
    stem: "Qual cenário exige com MAIS urgência a inclusão de supervisão humana (human-in-the-loop) no fluxo de decisão de um sistema de IA?",
    options: [
      "Um sistema que recomenda diagnósticos médicos que orientarão tratamentos de pacientes.",
      "Um sistema que sugere a próxima música em um aplicativo de streaming.",
      "Um sistema que ordena fotos por data no álbum do usuário.",
      "Um sistema que sugere hashtags para posts em redes sociais."
    ],
    correct: [0],
    explanation: "Quanto maior o impacto potencial da decisão sobre pessoas (saúde, crédito, justiça, emprego), maior a necessidade de revisão humana, explicabilidade e trilhas de auditoria — diagnóstico médico é o caso crítico. Recomendações de música, ordenação de fotos e hashtags têm baixo impacto e toleram automação completa."
  }
];
