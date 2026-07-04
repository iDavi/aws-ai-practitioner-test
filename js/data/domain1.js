/* Domínio 1 — Fundamentos de IA e ML (20% do exame AIF-C01) */
window.DOMAIN1 = [
  {
    id: "d1-01", domain: 1, type: "single",
    stem: "Uma empresa quer entender a diferença entre inteligência artificial (IA), machine learning (ML) e deep learning antes de iniciar um projeto.\n\nQual afirmação descreve corretamente a relação entre esses termos?",
    options: [
      "Deep learning é um subconjunto de ML que usa redes neurais com muitas camadas, e ML é um subconjunto de IA no qual os sistemas aprendem padrões a partir de dados.",
      "IA é um subconjunto de ML, e deep learning é uma técnica independente que não usa dados de treinamento.",
      "ML e deep learning são termos equivalentes, e ambos exigem regras programadas manualmente por especialistas.",
      "Deep learning é um subconjunto de IA que não se relaciona com ML, pois usa apenas lógica simbólica."
    ],
    correct: [0],
    explanation: "IA é o campo mais amplo (sistemas que simulam comportamento inteligente). ML é um subconjunto da IA em que os modelos aprendem padrões a partir de dados, sem regras explícitas. Deep learning é um subconjunto de ML baseado em redes neurais profundas (muitas camadas). As demais alternativas invertem a hierarquia ou afirmam incorretamente que ML/deep learning dispensam dados ou usam apenas regras manuais."
  },
  {
    id: "d1-02", domain: 1, type: "single",
    stem: "Uma empresa de e-commerce tem um conjunto de dados histórico com transações rotuladas como \"fraude\" ou \"legítima\". A empresa quer treinar um modelo para classificar transações futuras.\n\nQual tipo de aprendizado de máquina atende a esse requisito?",
    options: [
      "Aprendizado supervisionado",
      "Aprendizado não supervisionado",
      "Aprendizado por reforço",
      "Aprendizado autossupervisionado"
    ],
    correct: [0],
    explanation: "Quando existem dados históricos com rótulos conhecidos (fraude/legítima) e o objetivo é prever esse rótulo para novos exemplos, trata-se de aprendizado supervisionado (classificação binária). O aprendizado não supervisionado é usado quando NÃO há rótulos (ex.: clustering). O aprendizado por reforço aprende por tentativa e erro com recompensas. O autossupervisionado gera rótulos a partir dos próprios dados e é típico do pré-treinamento de modelos de fundação."
  },
  {
    id: "d1-03", domain: 1, type: "single",
    stem: "Uma rede varejista quer segmentar seus clientes em grupos com comportamentos de compra semelhantes. A empresa não possui categorias predefinidas nem dados rotulados.\n\nQual técnica de ML a empresa deve usar?",
    options: [
      "Clustering (agrupamento)",
      "Classificação binária",
      "Regressão linear",
      "Classificação multiclasse"
    ],
    correct: [0],
    explanation: "Clustering é uma técnica de aprendizado não supervisionado que agrupa registros semelhantes sem necessidade de rótulos — exatamente o cenário de segmentação de clientes sem categorias predefinidas. Classificação (binária ou multiclasse) exige rótulos conhecidos, e regressão prevê valores numéricos contínuos."
  },
  {
    id: "d1-04", domain: 1, type: "single",
    stem: "Uma imobiliária quer prever o preço de venda de imóveis com base em características como área, localização e número de quartos.\n\nQual técnica de ML é a MAIS adequada?",
    options: [
      "Regressão",
      "Classificação",
      "Clustering",
      "Detecção de anomalias"
    ],
    correct: [0],
    explanation: "Prever um valor numérico contínuo (preço) é um problema de regressão. Classificação prevê categorias discretas, clustering agrupa dados sem rótulos, e detecção de anomalias identifica pontos fora do padrão — nenhum deles produz diretamente um valor contínuo como saída principal."
  },
  {
    id: "d1-05", domain: 1, type: "single",
    stem: "Uma empresa de logística quer treinar um agente para decidir rotas de entrega. O agente deve aprender por tentativa e erro, recebendo recompensas quando reduz o tempo de entrega e penalidades quando o aumenta.\n\nQual tipo de aprendizado descreve esse cenário?",
    options: [
      "Aprendizado por reforço",
      "Aprendizado supervisionado",
      "Aprendizado não supervisionado",
      "Aprendizado por transferência (transfer learning)"
    ],
    correct: [0],
    explanation: "Aprendizado por reforço treina um agente que interage com um ambiente e aprende uma política de ações maximizando recompensas cumulativas — o cenário clássico de decisões sequenciais como otimização de rotas. Supervisionado exige exemplos rotulados; não supervisionado encontra padrões sem rótulos; transfer learning reaproveita conhecimento de um modelo já treinado em outra tarefa."
  },
  {
    id: "d1-06", domain: 1, type: "single",
    stem: "Um cientista de dados precisa escolher entre inferência em lote (batch) e inferência em tempo real para um caso de uso.\n\nQual cenário é o MAIS adequado para inferência em lote?",
    options: [
      "Gerar, uma vez por noite, a pontuação de propensão de compra de todos os 10 milhões de clientes da base.",
      "Aprovar ou negar uma transação de cartão de crédito no momento do pagamento.",
      "Responder a perguntas de usuários em um chatbot de atendimento.",
      "Detectar defeitos em produtos em uma esteira de produção enquanto eles passam pela câmera."
    ],
    correct: [0],
    explanation: "Inferência em lote processa grandes volumes de dados de uma vez, quando a latência não é crítica — como pontuar toda a base de clientes durante a madrugada. É geralmente mais barata que manter um endpoint ativo. Os outros três cenários exigem resposta imediata (baixa latência) e, portanto, inferência em tempo real."
  },
  {
    id: "d1-07", domain: 1, type: "single",
    stem: "Uma equipe de dados está catalogando as fontes de dados disponíveis para um projeto de ML: tabelas relacionais de vendas, avaliações de clientes em texto livre e fotos de produtos.\n\nQual opção classifica corretamente esses dados?",
    options: [
      "As tabelas são dados estruturados; as avaliações em texto e as fotos são dados não estruturados.",
      "As tabelas e as avaliações são dados estruturados; apenas as fotos são não estruturadas.",
      "Todos os três tipos são dados semiestruturados, pois podem ser armazenados no Amazon S3.",
      "As fotos são dados estruturados porque possuem dimensões fixas de pixels."
    ],
    correct: [0],
    explanation: "Dados estruturados seguem um esquema tabular (linhas e colunas), como tabelas relacionais. Texto livre e imagens não seguem esquema predefinido e são dados não estruturados. O local de armazenamento (S3) não define a estrutura do dado, e ter dimensões de pixels não torna uma imagem um dado estruturado."
  },
  {
    id: "d1-08", domain: 1, type: "single",
    stem: "Um modelo de classificação apresenta acurácia de 99% nos dados de treinamento, mas apenas 62% nos dados de teste.\n\nQual é a causa MAIS provável desse comportamento?",
    options: [
      "Overfitting: o modelo memorizou os dados de treinamento e não generaliza para dados novos.",
      "Underfitting: o modelo é simples demais para capturar os padrões dos dados.",
      "Vazamento de dados no conjunto de teste, que ficou fácil demais.",
      "Alta taxa de aprendizado, que impede a convergência no treinamento."
    ],
    correct: [0],
    explanation: "A combinação de desempenho quase perfeito no treinamento com desempenho muito inferior no teste é o sintoma clássico de overfitting (alta variância): o modelo se ajustou demais aos exemplos vistos. Underfitting apresentaria desempenho ruim em AMBOS os conjuntos. Mitigações comuns: mais dados, regularização, modelos mais simples e validação cruzada."
  },
  {
    id: "d1-09", domain: 1, type: "single",
    stem: "Um modelo de regressão apresenta erro alto tanto no conjunto de treinamento quanto no conjunto de validação.\n\nO que esse comportamento indica e qual ação pode ajudar?",
    options: [
      "Underfitting; usar um modelo mais complexo ou adicionar atributos (features) mais informativos.",
      "Overfitting; remover atributos e aumentar a regularização.",
      "Viés de amostragem; reduzir o tamanho do conjunto de treinamento.",
      "Desvio de dados (data drift); reverter o modelo para uma versão anterior."
    ],
    correct: [0],
    explanation: "Erro alto em treino E validação indica underfitting (alto viés): o modelo não consegue capturar os padrões. As soluções incluem aumentar a complexidade do modelo, criar melhores features ou treinar por mais tempo. Overfitting teria erro baixo no treino e alto na validação. Data drift ocorre em produção, quando a distribuição dos dados muda ao longo do tempo."
  },
  {
    id: "d1-10", domain: 1, type: "single",
    stem: "Uma empresa de mídia quer detectar automaticamente rostos e objetos em milhares de imagens e vídeos enviados por usuários, sem treinar modelos próprios.\n\nQual serviço da AWS atende a esse requisito com o MENOR esforço operacional?",
    options: [
      "Amazon Rekognition",
      "Amazon SageMaker",
      "Amazon Textract",
      "Amazon Comprehend"
    ],
    correct: [0],
    explanation: "O Amazon Rekognition é o serviço gerenciado de análise de imagens e vídeos (detecção de rostos, objetos, celebridades, conteúdo impróprio) que dispensa treinamento de modelos. O SageMaker exigiria construir e treinar um modelo próprio (mais esforço). O Textract extrai texto de documentos e o Comprehend analisa texto em linguagem natural."
  },
  {
    id: "d1-11", domain: 1, type: "single",
    stem: "Uma central de atendimento quer converter as gravações de chamadas telefônicas em texto para análise posterior.\n\nQual serviço da AWS a empresa deve usar?",
    options: [
      "Amazon Transcribe",
      "Amazon Polly",
      "Amazon Translate",
      "Amazon Lex"
    ],
    correct: [0],
    explanation: "O Amazon Transcribe faz conversão de fala em texto (speech-to-text), ideal para transcrever gravações de chamadas. O Amazon Polly faz o caminho inverso (texto em fala), o Translate traduz textos entre idiomas e o Lex constrói interfaces de conversação (chatbots)."
  },
  {
    id: "d1-12", domain: 1, type: "single",
    stem: "Uma empresa quer criar um audiolivro a partir de artigos escritos, gerando narração com voz natural em português.\n\nQual serviço da AWS atende a esse requisito?",
    options: [
      "Amazon Polly",
      "Amazon Transcribe",
      "Amazon Comprehend",
      "Amazon Kendra"
    ],
    correct: [0],
    explanation: "O Amazon Polly converte texto em fala (text-to-speech) com vozes naturais em vários idiomas, incluindo português. Transcribe faz o inverso (fala para texto), Comprehend analisa texto (sentimento, entidades) e Kendra é um serviço de busca inteligente em documentos corporativos."
  },
  {
    id: "d1-13", domain: 1, type: "single",
    stem: "Uma empresa recebe milhares de avaliações de produtos por dia e quer identificar automaticamente o sentimento (positivo, negativo, neutro) e as entidades mencionadas em cada avaliação, usando um serviço gerenciado.\n\nQual serviço da AWS atende a esses requisitos?",
    options: [
      "Amazon Comprehend",
      "Amazon Textract",
      "Amazon Translate",
      "Amazon Rekognition"
    ],
    correct: [0],
    explanation: "O Amazon Comprehend é o serviço de processamento de linguagem natural (NLP) gerenciado que realiza análise de sentimento, extração de entidades, detecção de frases-chave, de idioma e de PII em textos. Textract extrai texto e dados de documentos digitalizados, Translate traduz idiomas e Rekognition analisa imagens/vídeos."
  },
  {
    id: "d1-14", domain: 1, type: "single",
    stem: "Um banco precisa extrair automaticamente campos e tabelas de formulários digitalizados em PDF, como valores, datas e assinaturas de contratos, para alimentar um sistema interno.\n\nQual serviço da AWS é o MAIS adequado?",
    options: [
      "Amazon Textract",
      "Amazon Comprehend",
      "Amazon Rekognition",
      "Amazon Transcribe"
    ],
    correct: [0],
    explanation: "O Amazon Textract usa OCR com ML para extrair texto, formulários (pares chave-valor) e tabelas de documentos digitalizados — indo além do OCR simples. O Comprehend analisa texto já extraído; o Rekognition detecta texto em cenas/imagens, mas não estrutura formulários e tabelas; o Transcribe trabalha com áudio."
  },
  {
    id: "d1-15", domain: 1, type: "single",
    stem: "Uma empresa quer adicionar ao seu site um chatbot que entenda a intenção do usuário em linguagem natural e execute fluxos como \"consultar pedido\" e \"agendar entrega\", integrando-se com funções do AWS Lambda.\n\nQual serviço da AWS atende a esses requisitos?",
    options: [
      "Amazon Lex",
      "Amazon Polly",
      "Amazon Q Developer",
      "Amazon Comprehend"
    ],
    correct: [0],
    explanation: "O Amazon Lex é o serviço para construir interfaces conversacionais (chatbots e IVRs) com reconhecimento de intenções (intents), slots e integração nativa com AWS Lambda para executar a lógica de negócio. Polly só sintetiza voz, Amazon Q Developer é um assistente para desenvolvedores e Comprehend analisa texto, mas não gerencia diálogos."
  },
  {
    id: "d1-16", domain: 1, type: "single",
    stem: "Um serviço de streaming quer exibir recomendações de filmes personalizadas em tempo real para cada usuário, com base no histórico de visualização, usando um serviço gerenciado que dispense expertise em ML.\n\nQual serviço da AWS atende a esses requisitos?",
    options: [
      "Amazon Personalize",
      "Amazon Kendra",
      "Amazon SageMaker Autopilot",
      "Amazon Comprehend"
    ],
    correct: [0],
    explanation: "O Amazon Personalize é o serviço gerenciado de recomendações personalizadas em tempo real (mesma tecnologia usada na Amazon.com), que dispensa expertise em ML. Kendra é busca inteligente em documentos; SageMaker Autopilot automatiza AutoML, mas ainda exige mais envolvimento técnico; Comprehend é NLP."
  },
  {
    id: "d1-17", domain: 1, type: "single",
    stem: "Os funcionários de uma empresa perdem tempo procurando informações espalhadas em wikis internas, SharePoint e repositórios de documentos. A empresa quer uma busca corporativa inteligente que responda a perguntas em linguagem natural indicando os documentos-fonte.\n\nQual serviço da AWS atende a esse requisito?",
    options: [
      "Amazon Kendra",
      "Amazon Personalize",
      "Amazon OpenSearch Service sem plugins",
      "Amazon Comprehend"
    ],
    correct: [0],
    explanation: "O Amazon Kendra é o serviço de busca corporativa inteligente baseado em ML, com conectores para fontes como SharePoint e S3, que entende perguntas em linguagem natural e retorna respostas com os documentos-fonte. OpenSearch puro faz busca por palavras-chave/vetores, mas exige mais configuração; Personalize é recomendação; Comprehend é análise de texto."
  },
  {
    id: "d1-18", domain: 1, type: "single",
    stem: "Uma fintech quer identificar em tempo real atividades potencialmente fraudulentas, como criação de contas falsas e pagamentos suspeitos, usando um serviço gerenciado da AWS criado especificamente para esse fim.\n\nQual serviço atende a esse requisito?",
    options: [
      "Amazon Fraud Detector",
      "Amazon Macie",
      "Amazon GuardDuty",
      "Amazon Inspector"
    ],
    correct: [0],
    explanation: "O Amazon Fraud Detector é o serviço gerenciado para detectar fraudes online (contas falsas, fraude de pagamento) com modelos de ML personalizados a partir dos dados da empresa. Macie descobre dados sensíveis (PII) no S3, GuardDuty detecta ameaças de segurança em contas/workloads AWS e Inspector encontra vulnerabilidades de software."
  },
  {
    id: "d1-19", domain: 1, type: "single",
    stem: "Uma rede de supermercados quer prever a demanda semanal de cada produto em cada loja com base em dados históricos de vendas, sazonalidade e promoções.\n\nQual tipo de problema de ML descreve esse cenário?",
    options: [
      "Previsão de séries temporais",
      "Classificação multiclasse",
      "Clustering",
      "Detecção de anomalias"
    ],
    correct: [0],
    explanation: "Prever valores futuros (demanda) a partir de dados históricos ordenados no tempo, considerando sazonalidade e eventos, é previsão de séries temporais (forecasting) — um tipo de regressão sobre dados temporais. Na AWS, isso pode ser feito com o Amazon SageMaker Canvas (previsão de séries temporais) ou modelos próprios no SageMaker."
  },
  {
    id: "d1-20", domain: 1, type: "single",
    stem: "Uma empresa precisa calcular o imposto devido em cada nota fiscal aplicando as alíquotas oficiais definidas em lei.\n\nPor que uma solução de IA/ML NÃO é adequada para esse caso de uso?",
    options: [
      "O cálculo é determinístico e definido por regras conhecidas; um sistema baseado em regras é mais simples, auditável e sempre exato.",
      "Modelos de ML não conseguem processar valores numéricos.",
      "O volume de notas fiscais é grande demais para qualquer modelo de ML.",
      "A IA só pode ser usada com dados não estruturados, como texto e imagem."
    ],
    correct: [0],
    explanation: "Quando o problema tem regras exatas, conhecidas e estáveis (como alíquotas definidas em lei), ML acrescenta custo, complexidade e risco de erro sem benefício: um sistema determinístico baseado em regras é mais simples, 100% exato e auditável. ML é indicado quando os padrões são complexos demais para regras explícitas, quando há necessidade de generalizar a partir de exemplos ou de se adaptar a dados em escala."
  },
  {
    id: "d1-21", domain: 1, type: "single",
    stem: "Um cientista de dados está descrevendo o pipeline de ML para novos membros da equipe.\n\nQual sequência representa a ordem correta das etapas do ciclo de vida de ML?",
    options: [
      "Coleta de dados → preparação/EDA → engenharia de features → treinamento → avaliação → implantação → monitoramento",
      "Treinamento → coleta de dados → implantação → engenharia de features → avaliação → monitoramento",
      "Engenharia de features → coleta de dados → monitoramento → treinamento → avaliação → implantação",
      "Implantação → treinamento → avaliação → coleta de dados → engenharia de features → monitoramento"
    ],
    correct: [0],
    explanation: "O ciclo de vida de ML começa com a definição do problema de negócio e a coleta de dados; segue com preparação e análise exploratória (EDA), engenharia de features, treinamento e ajuste de hiperparâmetros, avaliação do modelo, implantação (deploy) e, por fim, monitoramento contínuo em produção — que pode realimentar novas iterações (retreinamento)."
  },
  {
    id: "d1-22", domain: 1, type: "single",
    stem: "Durante a preparação de dados, um engenheiro transforma a coluna \"data de nascimento\" em \"idade\" e combina \"peso\" e \"altura\" em \"IMC\", pois essas representações ajudam o modelo a aprender melhor.\n\nComo se chama essa etapa do ciclo de vida de ML?",
    options: [
      "Engenharia de features (feature engineering)",
      "Ajuste de hiperparâmetros",
      "Aumento de dados (data augmentation)",
      "Avaliação do modelo"
    ],
    correct: [0],
    explanation: "Engenharia de features é a criação, transformação e seleção de atributos derivados dos dados brutos para melhorar o desempenho do modelo (ex.: derivar idade de uma data ou combinar variáveis). Ajuste de hiperparâmetros otimiza configurações do algoritmo; data augmentation gera exemplos sintéticos (comum em imagens); avaliação mede o desempenho."
  },
  {
    id: "d1-23", domain: 1, type: "single",
    stem: "Uma equipe dividiu seu conjunto de dados em três partes: uma para treinar o modelo, uma para ajustar hiperparâmetros durante o desenvolvimento e uma para medir o desempenho final antes da implantação.\n\nQual é o nome e o papel do terceiro conjunto?",
    options: [
      "Conjunto de teste: usado uma única vez, ao final, para estimar o desempenho do modelo em dados nunca vistos.",
      "Conjunto de validação: usado a cada época para atualizar os pesos do modelo.",
      "Conjunto de treinamento: usado para calcular o gradiente durante o treinamento.",
      "Conjunto de produção: usado para monitorar drift após a implantação."
    ],
    correct: [0],
    explanation: "A divisão clássica é treinamento (ajustar os pesos), validação (comparar modelos e ajustar hiperparâmetros) e teste (avaliação final e imparcial em dados nunca usados no desenvolvimento). Usar o conjunto de teste repetidamente durante o desenvolvimento contaminaria a estimativa de generalização."
  },
  {
    id: "d1-24", domain: 1, type: "single",
    stem: "Um cientista de dados menciona que vai ajustar a \"taxa de aprendizado\" e o \"número de épocas\" antes de retreinar um modelo.\n\nO que esses valores representam?",
    options: [
      "Hiperparâmetros: configurações definidas antes do treinamento que controlam como o modelo aprende.",
      "Parâmetros do modelo: valores aprendidos automaticamente durante o treinamento.",
      "Métricas de avaliação: valores que medem a qualidade das previsões.",
      "Features: atributos de entrada usados pelo modelo para fazer previsões."
    ],
    correct: [0],
    explanation: "Hiperparâmetros (taxa de aprendizado, número de épocas, profundidade da árvore, tamanho do lote) são definidos ANTES do treinamento e controlam o processo de aprendizagem. Já os parâmetros do modelo (pesos) são aprendidos DURANTE o treinamento. O ajuste de hiperparâmetros pode ser automatizado (ex.: SageMaker Automatic Model Tuning)."
  },
  {
    id: "d1-25", domain: 1, type: "single",
    stem: "Um hospital usa um modelo para detectar uma doença grave. O custo de deixar de identificar um paciente doente (falso negativo) é muito maior do que o custo de encaminhar um paciente saudável para exames adicionais (falso positivo).\n\nQual métrica o hospital deve priorizar ao avaliar o modelo?",
    options: [
      "Recall (sensibilidade)",
      "Precisão (precision)",
      "Acurácia",
      "RMSE"
    ],
    correct: [0],
    explanation: "Recall mede a proporção de casos positivos reais que o modelo identifica corretamente — priorizá-lo minimiza falsos negativos, que neste cenário são os erros mais custosos. Precision seria prioritária se falsos positivos fossem o problema maior (ex.: marcar e-mails legítimos como spam). Acurácia engana em classes desbalanceadas, e RMSE é métrica de regressão."
  },
  {
    id: "d1-26", domain: 1, type: "single",
    stem: "Um provedor de e-mail quer filtrar spam, mas considera inaceitável que mensagens legítimas sejam enviadas para a pasta de spam.\n\nQual métrica de avaliação deve ser priorizada?",
    options: [
      "Precisão (precision)",
      "Recall (sensibilidade)",
      "MAPE",
      "Perplexidade"
    ],
    correct: [0],
    explanation: "Precision mede, entre tudo que o modelo classificou como positivo (spam), quanto era realmente positivo. Priorizar precision minimiza falsos positivos — e-mails legítimos marcados como spam, o erro inaceitável neste cenário. Recall minimizaria spams não detectados; MAPE é métrica de regressão/previsão e perplexidade avalia modelos de linguagem."
  },
  {
    id: "d1-27", domain: 1, type: "single",
    stem: "Um conjunto de dados de detecção de fraude contém 99% de transações legítimas e 1% de fraudes. Um modelo que classifica tudo como \"legítima\" alcança 99% de acurácia.\n\nQual métrica daria uma visão MAIS realista do desempenho do modelo nesse cenário desbalanceado?",
    options: [
      "F1-score, que combina precision e recall em uma única métrica.",
      "Acurácia, calculada em um conjunto de teste maior.",
      "RMSE, calculado sobre as probabilidades previstas.",
      "Tempo de inferência por transação."
    ],
    correct: [0],
    explanation: "Em classes desbalanceadas, a acurácia é enganosa (o modelo trivial atinge 99% sem detectar nenhuma fraude). O F1-score é a média harmônica de precision e recall e cai drasticamente quando o modelo ignora a classe minoritária — refletindo o desempenho real. AUC-ROC também é uma boa opção nesses casos. RMSE é para regressão e tempo de inferência não mede qualidade preditiva."
  },
  {
    id: "d1-28", domain: 1, type: "single",
    stem: "Uma equipe quer comparar a capacidade de vários modelos de classificação binária de distinguir entre as classes, independentemente do limiar (threshold) de decisão escolhido.\n\nQual métrica atende a esse requisito?",
    options: [
      "AUC-ROC (área sob a curva ROC)",
      "Acurácia com limiar de 0,5",
      "MAPE",
      "ROUGE"
    ],
    correct: [0],
    explanation: "A AUC-ROC resume a capacidade discriminativa do modelo em TODOS os limiares possíveis (1,0 = separação perfeita; 0,5 = aleatório), permitindo comparar modelos sem fixar um threshold. Acurácia depende de um limiar específico. MAPE avalia previsões numéricas e ROUGE avalia resumos de texto gerados por modelos de linguagem."
  },
  {
    id: "d1-29", domain: 1, type: "single",
    stem: "Uma equipe treinou um modelo de regressão para prever o consumo de energia de edifícios e quer medir, na mesma unidade da variável prevista (kWh), o quanto as previsões se desviam dos valores reais.\n\nQual métrica atende a esse requisito?",
    options: [
      "RMSE (raiz do erro quadrático médio)",
      "F1-score",
      "AUC-ROC",
      "BLEU"
    ],
    correct: [0],
    explanation: "O RMSE mede o erro médio das previsões de regressão na mesma unidade da variável-alvo (kWh, reais, unidades vendidas), penalizando mais os erros grandes. F1 e AUC-ROC são métricas de classificação, e BLEU avalia qualidade de tradução automática de texto."
  },
  {
    id: "d1-30", domain: 1, type: "multiple",
    stem: "Uma empresa quer avaliar não apenas as métricas técnicas de um modelo de recomendação, mas também seu valor para o negócio após a implantação.\n\nQuais métricas são exemplos de métricas de NEGÓCIO para avaliar o modelo? (Selecione DUAS.)",
    options: [
      "Aumento da receita média por usuário após a implantação",
      "Taxa de conversão dos itens recomendados",
      "F1-score no conjunto de teste",
      "AUC-ROC no conjunto de validação",
      "Tempo de treinamento do modelo"
    ],
    correct: [0, 1],
    explanation: "Métricas de negócio medem o impacto real da solução nos objetivos da empresa: receita média por usuário, taxa de conversão, custo por decisão, retenção de clientes, ROI. F1-score e AUC-ROC são métricas técnicas de qualidade do modelo, e tempo de treinamento é uma métrica operacional — nenhuma delas mede diretamente valor de negócio."
  },
  {
    id: "d1-31", domain: 1, type: "single",
    stem: "Uma equipe precisa rotular manualmente 100.000 imagens para treinar um modelo de classificação. A empresa quer combinar anotadores humanos com rotulagem automática assistida por ML para reduzir custo e tempo.\n\nQual serviço da AWS atende a esse requisito?",
    options: [
      "Amazon SageMaker Ground Truth",
      "Amazon SageMaker Model Monitor",
      "Amazon SageMaker Clarify",
      "Amazon SageMaker Feature Store"
    ],
    correct: [0],
    explanation: "O SageMaker Ground Truth gerencia fluxos de rotulagem de dados combinando anotadores humanos (equipe própria, fornecedores ou Amazon Mechanical Turk) com rotulagem automática por ML (active learning), reduzindo custo e tempo. Model Monitor detecta drift em produção, Clarify analisa viés e explicabilidade, e Feature Store armazena e compartilha features."
  },
  {
    id: "d1-32", domain: 1, type: "single",
    stem: "Após implantar um modelo em produção, uma empresa percebeu que a distribuição dos dados de entrada mudou ao longo dos meses e a qualidade das previsões caiu. A empresa quer detectar automaticamente esse tipo de desvio.\n\nQual serviço da AWS atende a esse requisito?",
    options: [
      "Amazon SageMaker Model Monitor",
      "Amazon SageMaker Ground Truth",
      "AWS CloudTrail",
      "Amazon SageMaker JumpStart"
    ],
    correct: [0],
    explanation: "O SageMaker Model Monitor monitora modelos em produção e detecta automaticamente desvios de qualidade dos dados (data drift), desvio de qualidade do modelo, desvio de viés e desvio de atribuição de features, emitindo alertas para acionar retreinamento. CloudTrail audita chamadas de API, Ground Truth rotula dados e JumpStart oferece modelos pré-treinados."
  },
  {
    id: "d1-33", domain: 1, type: "single",
    stem: "Analistas de negócio sem experiência em programação querem criar modelos de previsão de churn usando uma interface visual, sem escrever código.\n\nQual serviço da AWS atende a esse requisito?",
    options: [
      "Amazon SageMaker Canvas",
      "Amazon SageMaker Studio (notebooks)",
      "AWS Glue",
      "Amazon Athena"
    ],
    correct: [0],
    explanation: "O SageMaker Canvas oferece uma interface visual no-code para que analistas de negócio construam modelos de ML (classificação, regressão, previsão de séries temporais) sem escrever código. SageMaker Studio com notebooks exige programação; Glue é integração/ETL de dados; Athena é consulta SQL em dados no S3."
  },
  {
    id: "d1-34", domain: 1, type: "multiple",
    stem: "Uma empresa está adotando práticas de MLOps para levar modelos à produção de forma confiável e repetível.\n\nQuais são benefícios diretos da adoção de MLOps? (Selecione DUAS.)",
    options: [
      "Automação e repetibilidade dos fluxos de treinamento e implantação de modelos",
      "Versionamento de modelos e dados, permitindo auditoria e reversão (rollback)",
      "Eliminação da necessidade de monitorar os modelos em produção",
      "Garantia de que os modelos nunca apresentarão viés",
      "Dispensa do uso de conjuntos de teste na avaliação"
    ],
    correct: [0, 1],
    explanation: "MLOps aplica princípios de DevOps ao ciclo de vida de ML: pipelines automatizados e repetíveis (ex.: SageMaker Pipelines), versionamento de modelos e dados (ex.: SageMaker Model Registry), CI/CD e monitoramento contínuo. MLOps REFORÇA (não elimina) o monitoramento e a avaliação, e não garante ausência de viés — apenas ajuda a detectá-lo e gerenciá-lo."
  },
  {
    id: "d1-35", domain: 1, type: "single",
    stem: "Uma equipe de ML quer centralizar o armazenamento de features processadas para que possam ser reutilizadas de forma consistente no treinamento e na inferência por várias equipes.\n\nQual recurso do Amazon SageMaker atende a esse requisito?",
    options: [
      "SageMaker Feature Store",
      "SageMaker Model Registry",
      "SageMaker Data Wrangler",
      "SageMaker Model Cards"
    ],
    correct: [0],
    explanation: "O SageMaker Feature Store é o repositório central e gerenciado de features, com armazenamento online (inferência em tempo real) e offline (treinamento), garantindo consistência e reúso entre equipes. O Model Registry versiona e cataloga MODELOS; o Data Wrangler prepara e transforma dados visualmente; Model Cards documentam modelos para governança."
  },
  {
    id: "d1-36", domain: 1, type: "single",
    stem: "Uma empresa avalia se deve usar um serviço de IA pré-treinado da AWS (como o Amazon Rekognition) ou treinar um modelo personalizado no Amazon SageMaker.\n\nQual fator justificaria treinar um modelo personalizado no SageMaker?",
    options: [
      "A tarefa exige reconhecer categorias específicas do negócio que os serviços pré-treinados não cobrem com a precisão necessária.",
      "A empresa quer o menor esforço operacional possível.",
      "A empresa não possui dados rotulados nem equipe de ciência de dados.",
      "A tarefa é genérica e bem atendida pelas APIs prontas."
    ],
    correct: [0],
    explanation: "Modelos personalizados fazem sentido quando o caso de uso é específico do domínio e os serviços pré-treinados não atingem a qualidade necessária — e quando há dados e equipe para treinar. Se o objetivo é menor esforço operacional, a tarefa é genérica ou faltam dados/expertise, os serviços de IA gerenciados (Rekognition, Comprehend, Transcribe etc.) são a escolha certa."
  }
];
