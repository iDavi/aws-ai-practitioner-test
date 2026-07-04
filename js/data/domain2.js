/* Domínio 2 — Fundamentos de IA Generativa (24% do exame AIF-C01) */
window.DOMAIN2 = [
  {
    id: "d2-01", domain: 2, type: "single",
    stem: "Um desenvolvedor percebe que o custo de uso de um modelo de linguagem no Amazon Bedrock é cobrado por unidades de texto processadas na entrada e na saída.\n\nComo se chamam essas unidades básicas de texto que o modelo processa?",
    options: [
      "Tokens",
      "Embeddings",
      "Parâmetros",
      "Épocas"
    ],
    correct: [0],
    explanation: "Tokens são as unidades básicas de texto processadas por um LLM — palavras, partes de palavras ou caracteres. A cobrança on-demand no Bedrock é tipicamente por 1.000 tokens de entrada e de saída. Embeddings são representações vetoriais; parâmetros são os pesos do modelo; épocas são passagens completas pelos dados durante o treinamento."
  },
  {
    id: "d2-02", domain: 2, type: "single",
    stem: "Uma empresa quer implementar busca semântica: encontrar documentos com significado parecido com a consulta do usuário, mesmo quando as palavras exatas são diferentes.\n\nQual conceito de IA generativa torna isso possível?",
    options: [
      "Embeddings: representações vetoriais numéricas que capturam o significado semântico do texto.",
      "Tokenização: divisão do texto em unidades menores para processamento.",
      "Temperatura: parâmetro que controla a aleatoriedade das respostas.",
      "Janela de contexto: quantidade máxima de tokens que o modelo processa por vez."
    ],
    correct: [0],
    explanation: "Embeddings convertem texto (ou imagens) em vetores numéricos em que conteúdos semanticamente semelhantes ficam próximos no espaço vetorial. A busca semântica compara o vetor da consulta com os vetores dos documentos (similaridade de cossenos, k-NN). Tokenização, temperatura e janela de contexto são conceitos reais, mas não são o mecanismo da busca por significado."
  },
  {
    id: "d2-03", domain: 2, type: "single",
    stem: "Ao preparar documentos longos para uma solução de RAG, um engenheiro divide cada documento em trechos menores antes de gerar embeddings e armazená-los em um banco vetorial.\n\nComo se chama essa técnica?",
    options: [
      "Chunking",
      "Fine-tuning",
      "Destilação (distillation)",
      "Quantização"
    ],
    correct: [0],
    explanation: "Chunking é a divisão de documentos em trechos (chunks) de tamanho adequado antes de gerar embeddings — necessário porque modelos de embedding e janelas de contexto têm limites de tokens, e trechos menores melhoram a precisão da recuperação. Fine-tuning ajusta pesos do modelo; destilação cria modelos menores a partir de maiores; quantização reduz a precisão numérica dos pesos."
  },
  {
    id: "d2-04", domain: 2, type: "single",
    stem: "Um usuário tenta enviar um contrato de 300 páginas em um único prompt para um LLM e recebe um erro informando que o limite de tokens foi excedido.\n\nQual conceito explica esse limite?",
    options: [
      "Janela de contexto: o número máximo de tokens (entrada + saída) que o modelo consegue processar em uma interação.",
      "Temperatura: o limite de criatividade configurado para o modelo.",
      "Top-k: o número máximo de tokens candidatos considerados em cada etapa.",
      "Taxa de aprendizado: a velocidade com que o modelo processa o prompt."
    ],
    correct: [0],
    explanation: "A janela de contexto define quantos tokens o modelo pode considerar em uma única interação (prompt + histórico + resposta). Documentos maiores que a janela precisam ser divididos (chunking), resumidos ou processados via RAG. Temperatura e top-k controlam a amostragem da resposta, e taxa de aprendizado é um hiperparâmetro de treinamento, não de inferência."
  },
  {
    id: "d2-05", domain: 2, type: "single",
    stem: "Qual característica da arquitetura Transformer é a PRINCIPAL responsável pelo sucesso dos grandes modelos de linguagem (LLMs)?",
    options: [
      "O mecanismo de autoatenção (self-attention), que pondera a relevância de cada token em relação aos demais, capturando relações de longo alcance no texto.",
      "O processamento estritamente sequencial de uma palavra por vez, como nas RNNs.",
      "O uso exclusivo de regras gramaticais programadas manualmente.",
      "A eliminação da necessidade de dados de treinamento."
    ],
    correct: [0],
    explanation: "O Transformer introduziu a autoatenção, que permite ao modelo ponderar a importância de todos os tokens entre si simultaneamente, capturando dependências de longo alcance e permitindo treinamento paralelo em grande escala — a base dos LLMs modernos. RNNs processavam sequencialmente (limitação que o Transformer superou); LLMs não usam regras manuais e exigem enormes volumes de dados."
  },
  {
    id: "d2-06", domain: 2, type: "single",
    stem: "Qual opção descreve MELHOR um modelo de fundação (foundation model — FM)?",
    options: [
      "Um modelo de grande porte, pré-treinado em volumes massivos de dados não rotulados, que pode ser adaptado a muitas tarefas diferentes.",
      "Um modelo pequeno treinado do zero para uma única tarefa específica com dados rotulados.",
      "Um sistema de regras fixas escritas por especialistas de domínio.",
      "Um banco de dados vetorial otimizado para busca semântica."
    ],
    correct: [0],
    explanation: "Modelos de fundação são pré-treinados (geralmente de forma autossupervisionada) em conjuntos de dados massivos e servem de base para múltiplas tarefas — podendo ser adaptados via prompt engineering, RAG ou fine-tuning. Isso contrasta com o ML tradicional, em que cada tarefa exige um modelo treinado especificamente com dados rotulados."
  },
  {
    id: "d2-07", domain: 2, type: "single",
    stem: "Como um grande modelo de linguagem (LLM) gera texto durante a inferência?",
    options: [
      "Prevendo, de forma iterativa, o próximo token mais provável com base nos tokens anteriores, até completar a resposta.",
      "Buscando frases prontas em um banco de dados de respostas e copiando a mais parecida.",
      "Executando regras gramaticais determinísticas definidas por linguistas.",
      "Traduzindo a pergunta para código SQL e consultando a internet em tempo real."
    ],
    correct: [0],
    explanation: "LLMs são modelos autorregressivos: geram texto prevendo a distribuição de probabilidade do próximo token com base no contexto e amostrando iterativamente (influenciados por temperatura, top-k, top-p). Eles não copiam respostas de um banco de dados nem consultam a internet por padrão — por isso podem alucinar fatos."
  },
  {
    id: "d2-08", domain: 2, type: "single",
    stem: "Uma agência de marketing quer gerar imagens de produtos a partir de descrições em texto, refinando gradualmente ruído aleatório até formar uma imagem.\n\nQual tipo de modelo de IA generativa funciona dessa maneira?",
    options: [
      "Modelo de difusão",
      "Modelo de regressão logística",
      "Árvore de decisão",
      "Modelo de clustering k-means"
    ],
    correct: [0],
    explanation: "Modelos de difusão geram imagens partindo de ruído aleatório e removendo o ruído passo a passo, guiados pelo texto do prompt — é a técnica por trás de geradores de imagem como Stable Diffusion e Amazon Titan/Nova de geração de imagens. Regressão logística, árvores de decisão e k-means são técnicas de ML tradicional, não generativas."
  },
  {
    id: "d2-09", domain: 2, type: "single",
    stem: "Uma empresa precisa de um modelo capaz de receber ao mesmo tempo uma imagem e uma pergunta em texto sobre essa imagem, e responder em texto.\n\nComo se chama esse tipo de modelo?",
    options: [
      "Modelo multimodal",
      "Modelo de embedding",
      "Modelo de regressão",
      "Modelo unimodal de linguagem"
    ],
    correct: [0],
    explanation: "Modelos multimodais processam e/ou geram múltiplas modalidades de dados (texto, imagem, áudio, vídeo) — por exemplo, responder em texto a perguntas sobre uma imagem. Modelos de embedding geram vetores; modelos unimodais trabalham com uma única modalidade."
  },
  {
    id: "d2-10", domain: 2, type: "single",
    stem: "Um assistente jurídico baseado em LLM deve responder sempre da forma mais factual, consistente e determinística possível.\n\nQual configuração de parâmetro de inferência atende a esse requisito?",
    options: [
      "Diminuir a temperatura para próximo de 0.",
      "Aumentar a temperatura para próximo de 1.",
      "Aumentar o valor de top-p para 1 e a temperatura para 0,9.",
      "Aumentar o número máximo de tokens de saída."
    ],
    correct: [0],
    explanation: "Temperatura baixa (próxima de 0) concentra a amostragem nos tokens mais prováveis, tornando as respostas mais determinísticas, previsíveis e factuais. Temperatura alta achata a distribuição e aumenta criatividade e variabilidade — inadequado para respostas jurídicas. O máximo de tokens controla o comprimento da resposta, não sua aleatoriedade."
  },
  {
    id: "d2-11", domain: 2, type: "single",
    stem: "Uma equipe criativa usa um LLM para gerar slogans publicitários e quer respostas mais variadas e originais a cada execução.\n\nQual ajuste de parâmetros de inferência atende a esse requisito?",
    options: [
      "Aumentar a temperatura.",
      "Definir a temperatura como 0.",
      "Reduzir o número máximo de tokens de saída.",
      "Adicionar sequências de parada (stop sequences)."
    ],
    correct: [0],
    explanation: "Aumentar a temperatura (e/ou top-p e top-k) amplia a diversidade da amostragem, gerando saídas mais criativas e variadas — desejável para brainstorming e textos publicitários. Temperatura 0 produz respostas repetitivas e conservadoras; máximo de tokens e stop sequences controlam o comprimento/fim da resposta, não a criatividade."
  },
  {
    id: "d2-12", domain: 2, type: "single",
    stem: "Um engenheiro está ajustando o parâmetro top-p (nucleus sampling) de um modelo no Amazon Bedrock.\n\nO que esse parâmetro controla?",
    options: [
      "O modelo amostra apenas entre os tokens cuja probabilidade acumulada não ultrapassa o valor de p definido.",
      "O modelo considera exatamente os p tokens mais prováveis, em número fixo.",
      "O número máximo de tokens que a resposta pode conter.",
      "A penalidade aplicada a tokens que já apareceram na resposta."
    ],
    correct: [0],
    explanation: "Top-p (nucleus sampling) limita a amostragem ao menor conjunto de tokens cuja probabilidade acumulada atinge p (ex.: 0,9 = considerar tokens que somam 90% da probabilidade). Top-K é o parâmetro que fixa um NÚMERO de candidatos. Máximo de tokens controla o comprimento e penalidades de repetição são outro parâmetro distinto."
  },
  {
    id: "d2-13", domain: 2, type: "single",
    stem: "Um chatbot corporativo respondeu a um cliente citando uma política de reembolso que não existe, com um texto fluente e convincente.\n\nComo se chama esse comportamento de modelos de IA generativa?",
    options: [
      "Alucinação",
      "Overfitting",
      "Data drift",
      "Envenenamento de dados (data poisoning)"
    ],
    correct: [0],
    explanation: "Alucinação é quando o modelo gera informações falsas ou inventadas com aparência de fato — consequência de gerar texto por probabilidade, sem verificação de veracidade. Mitigações: RAG (fundamentar respostas em fontes), temperatura baixa, guardrails com verificação de fundamentação (contextual grounding) e revisão humana. Overfitting e drift são problemas de treinamento/produção, e poisoning é um ataque aos dados de treinamento."
  },
  {
    id: "d2-14", domain: 2, type: "single",
    stem: "Uma equipe de QA reclama que o mesmo prompt enviado duas vezes ao mesmo LLM produz respostas diferentes, dificultando testes automatizados.\n\nQual característica dos modelos generativos explica esse comportamento?",
    options: [
      "Não determinismo: a geração envolve amostragem probabilística de tokens, podendo produzir saídas diferentes para a mesma entrada.",
      "Alucinação: o modelo inventa fatos que não existem.",
      "Viés algorítmico: o modelo favorece determinados grupos.",
      "Janela de contexto: o modelo esquece o início de prompts longos."
    ],
    correct: [0],
    explanation: "A geração de texto envolve amostragem probabilística: com temperatura > 0, a mesma entrada pode gerar saídas diferentes (não determinismo). Para reduzir a variabilidade em testes, usa-se temperatura 0 e parâmetros de amostragem restritivos — ainda assim, determinismo absoluto não é garantido. As demais alternativas descrevem outros fenômenos."
  },
  {
    id: "d2-15", domain: 2, type: "multiple",
    stem: "Uma empresa de software está avaliando onde a IA generativa pode agregar valor.\n\nQuais casos de uso são adequados para IA generativa? (Selecione DUAS.)",
    options: [
      "Resumir automaticamente longos relatórios internos para os executivos",
      "Gerar rascunhos de código a partir de descrições em linguagem natural",
      "Calcular a folha de pagamento aplicando as regras trabalhistas vigentes",
      "Somar os valores exatos das notas fiscais do mês",
      "Ordenar alfabeticamente uma lista de nomes de clientes"
    ],
    correct: [0, 1],
    explanation: "Sumarização de documentos e geração de código são casos de uso clássicos de IA generativa, que trabalha bem com criação e transformação de conteúdo em linguagem natural. Cálculos exatos e determinísticos (folha de pagamento, somas, ordenação) devem usar software tradicional: LLMs podem errar aritmética e não oferecem garantia de exatidão."
  },
  {
    id: "d2-16", domain: 2, type: "multiple",
    stem: "Um diretor de tecnologia quer entender os riscos antes de adotar IA generativa em produtos voltados ao cliente.\n\nQuais são desvantagens ou limitações típicas de modelos de IA generativa? (Selecione DUAS.)",
    options: [
      "Podem gerar informações incorretas com alta confiança (alucinações)",
      "Têm baixa interpretabilidade: é difícil explicar por que produziram determinada resposta",
      "Só funcionam com dados estruturados em formato tabular",
      "Não podem ser adaptados a tarefas específicas de um domínio",
      "Exigem que toda a inferência seja feita em lote, sem tempo real"
    ],
    correct: [0, 1],
    explanation: "Alucinações e baixa interpretabilidade (modelos \"caixa-preta\" com bilhões de parâmetros) são limitações centrais da IA generativa, junto com não determinismo, custo e riscos de conteúdo tóxico ou viesado. As demais alternativas são falsas: LLMs trabalham justamente com dados não estruturados, podem ser adaptados (prompts, RAG, fine-tuning) e suportam inferência em tempo real."
  },
  {
    id: "d2-17", domain: 2, type: "single",
    stem: "Qual é uma das PRINCIPAIS vantagens dos modelos de fundação em comparação com o desenvolvimento de modelos de ML tradicionais para cada tarefa?",
    options: [
      "Um único modelo pré-treinado pode ser adaptado a muitas tarefas diferentes, reduzindo o tempo e o custo de desenvolvimento.",
      "Modelos de fundação nunca produzem respostas incorretas.",
      "Modelos de fundação dispensam qualquer forma de avaliação antes da produção.",
      "Modelos de fundação são sempre mais baratos por inferência do que modelos pequenos especializados."
    ],
    correct: [0],
    explanation: "A grande vantagem dos FMs é a adaptabilidade: o mesmo modelo atende a sumarização, perguntas e respostas, geração de conteúdo etc., via prompts, RAG ou fine-tuning — sem treinar um modelo do zero por tarefa, acelerando o time-to-market. Eles ainda erram (alucinações), exigem avaliação, e a inferência em modelos grandes costuma ser MAIS cara que em modelos pequenos especializados."
  },
  {
    id: "d2-18", domain: 2, type: "single",
    stem: "Uma startup precisa lançar rapidamente um recurso de resumo de textos. A equipe comparou construir um modelo próprio do zero com usar um modelo de fundação via API.\n\nQual é o PRINCIPAL benefício de negócio de usar o modelo de fundação via API?",
    options: [
      "Menor tempo de lançamento (time-to-market), pois elimina o ciclo de coleta de dados e treinamento do zero.",
      "Controle total sobre a arquitetura e os pesos do modelo.",
      "Custo zero de inferência.",
      "Garantia contratual de respostas sempre corretas."
    ],
    correct: [0],
    explanation: "Consumir um FM pronto via API (ex.: Amazon Bedrock) elimina coleta massiva de dados, infraestrutura de treinamento e meses de desenvolvimento — acelerando drasticamente o lançamento. Em contrapartida, há MENOS controle sobre o modelo, a inferência é paga (por tokens) e nenhum fornecedor garante respostas sempre corretas."
  },
  {
    id: "d2-19", domain: 2, type: "single",
    stem: "Uma empresa quer acessar modelos de fundação de vários provedores (Anthropic, Meta, Mistral, Amazon) por meio de uma única API gerenciada e serverless, sem administrar infraestrutura.\n\nQual serviço da AWS atende a esses requisitos?",
    options: [
      "Amazon Bedrock",
      "Amazon SageMaker",
      "Amazon EC2 com GPUs",
      "AWS Lambda"
    ],
    correct: [0],
    explanation: "O Amazon Bedrock é o serviço totalmente gerenciado e serverless que dá acesso, por uma API unificada, a FMs de diversos provedores (Amazon Titan/Nova, Anthropic Claude, Meta Llama, Mistral etc.), com recursos como Knowledge Bases, Agents e Guardrails. O SageMaker oferece mais controle, mas exige gerenciar endpoints/instâncias; EC2 e Lambda são computação genérica."
  },
  {
    id: "d2-20", domain: 2, type: "single",
    stem: "Antes de escolher um modelo no Amazon Bedrock, um desenvolvedor quer testar prompts interativamente em diferentes modelos e comparar as respostas, sem escrever código.\n\nQual recurso ele deve usar?",
    options: [
      "Os playgrounds do console do Amazon Bedrock",
      "O AWS CloudShell",
      "O Amazon SageMaker Ground Truth",
      "O AWS CloudFormation"
    ],
    correct: [0],
    explanation: "O console do Bedrock oferece playgrounds (chat/texto e imagem) para experimentar prompts, ajustar parâmetros de inferência (temperatura, top-p) e comparar modelos lado a lado sem escrever código. CloudShell é um terminal, Ground Truth é rotulagem de dados e CloudFormation é infraestrutura como código."
  },
  {
    id: "d2-21", domain: 2, type: "single",
    stem: "Um profissional sem conhecimento técnico quer prototipar rapidamente um pequeno aplicativo de IA generativa (por exemplo, um gerador de planos de treino) sem escrever código e sem sequer ter uma conta AWS.\n\nQual ferramenta atende a esse requisito?",
    options: [
      "PartyRock (um playground do Amazon Bedrock)",
      "Amazon SageMaker Studio",
      "AWS Cloud9",
      "Amazon Q Developer"
    ],
    correct: [0],
    explanation: "O PartyRock é o playground do Amazon Bedrock para criar e compartilhar pequenos apps de IA generativa sem código e sem conta AWS — ideal para aprender prompt engineering e prototipar. SageMaker Studio e Cloud9 são ambientes de desenvolvimento técnicos, e o Amazon Q Developer é um assistente de codificação."
  },
  {
    id: "d2-22", domain: 2, type: "single",
    stem: "Uma empresa quer oferecer aos funcionários um assistente de IA generativa que responda a perguntas com base nos dados e documentos internos da empresa (SharePoint, S3, Confluence), respeitando as permissões de acesso de cada usuário.\n\nQual serviço da AWS atende a esses requisitos com o MENOR esforço de desenvolvimento?",
    options: [
      "Amazon Q Business",
      "Amazon Lex",
      "Amazon Polly",
      "Amazon Translate"
    ],
    correct: [0],
    explanation: "O Amazon Q Business é o assistente de IA generativa pronto para empresas: conecta-se a mais de 40 fontes de dados corporativas, responde com base nos documentos internos citando as fontes e respeita as permissões existentes de cada usuário. Lex exige construir o bot e os fluxos; Polly e Translate são serviços de voz e tradução."
  },
  {
    id: "d2-23", domain: 2, type: "single",
    stem: "Uma equipe de desenvolvimento quer um assistente de IA que gere sugestões de código em tempo real no IDE, explique trechos de código e ajude a identificar vulnerabilidades de segurança.\n\nQual serviço da AWS atende a esses requisitos?",
    options: [
      "Amazon Q Developer",
      "Amazon Q Business",
      "Amazon Comprehend",
      "AWS CodeCommit"
    ],
    correct: [0],
    explanation: "O Amazon Q Developer (evolução do CodeWhisperer) é o assistente de IA para desenvolvedores: sugestões de código no IDE, chat sobre código, varredura de segurança e ajuda com AWS. O Amazon Q Business é voltado a conhecimento corporativo geral (não a codificação no IDE); Comprehend é NLP; CodeCommit era um serviço de repositórios Git."
  },
  {
    id: "d2-24", domain: 2, type: "single",
    stem: "Uma equipe de ML quer implantar um modelo de fundação open source em uma infraestrutura na qual tenha controle sobre o tipo de instância e possa personalizar totalmente o ambiente de hospedagem, com notebooks e fine-tuning integrados.\n\nQual opção atende a esses requisitos?",
    options: [
      "Amazon SageMaker JumpStart",
      "Amazon Bedrock em modo on-demand",
      "PartyRock",
      "Amazon Q Business"
    ],
    correct: [0],
    explanation: "O SageMaker JumpStart oferece FMs open source e proprietários para implantar em endpoints do SageMaker, com escolha de instância, personalização e fine-tuning no seu ambiente — mais controle, porém mais responsabilidade operacional. O Bedrock é serverless (menos controle da infraestrutura); PartyRock é playground; Q Business é um assistente pronto."
  },
  {
    id: "d2-25", domain: 2, type: "multiple",
    stem: "Um arquiteto compara consumir modelos pelo Amazon Bedrock (serverless) com hospedar um modelo open source em instâncias autogerenciadas no Amazon EC2.\n\nQuais são vantagens da opção com Amazon Bedrock? (Selecione DUAS.)",
    options: [
      "Não é preciso provisionar nem gerenciar infraestrutura de GPU",
      "Pagamento por uso (tokens processados), sem custo fixo de instâncias no modo on-demand",
      "Controle total sobre os pesos do modelo e o sistema operacional",
      "Possibilidade de modificar a arquitetura interna do modelo",
      "Latência garantida por contrato para qualquer modelo"
    ],
    correct: [0, 1],
    explanation: "O Bedrock é totalmente gerenciado e serverless: sem provisionar GPUs, com cobrança on-demand por tokens. Em troca, você NÃO controla os pesos/SO nem a arquitetura interna — esse é o trade-off em relação à hospedagem própria. Latência garantida por contrato para qualquer modelo não existe (o provisioned throughput garante capacidade de processamento, e apenas para modelos suportados)."
  },
  {
    id: "d2-26", domain: 2, type: "single",
    stem: "Uma aplicação de IA generativa tem tráfego de produção alto, constante e previsível. A empresa quer garantir capacidade dedicada de processamento e reduzir o custo por unidade em relação à cobrança por token.\n\nQual modelo de precificação do Amazon Bedrock atende a esses requisitos?",
    options: [
      "Provisioned Throughput (taxa de transferência provisionada)",
      "On-demand por token",
      "Instâncias spot",
      "Savings Plans de computação"
    ],
    correct: [0],
    explanation: "O Provisioned Throughput reserva unidades de capacidade de modelo por um período (compromissos de 1 ou 6 meses), garantindo vazão consistente para cargas altas e previsíveis — e é obrigatório para servir modelos customizados. On-demand (por token) é melhor para tráfego variável ou baixo. Spot e Savings Plans aplicam-se a computação (EC2 etc.), não à cobrança de modelos no Bedrock."
  },
  {
    id: "d2-27", domain: 2, type: "single",
    stem: "Uma startup está criando um protótipo de chatbot com tráfego baixo e imprevisível e quer minimizar custos com o modelo de fundação.\n\nQual opção de consumo é a MAIS econômica para esse cenário?",
    options: [
      "Amazon Bedrock com cobrança on-demand por tokens de entrada e saída",
      "Amazon Bedrock com Provisioned Throughput e compromisso de 6 meses",
      "Cluster de instâncias EC2 P5 dedicadas em execução contínua",
      "Dois endpoints do SageMaker com GPU em tempo integral para alta disponibilidade"
    ],
    correct: [0],
    explanation: "Para tráfego baixo e imprevisível, o modo on-demand do Bedrock cobra apenas pelos tokens processados, sem custo fixo — ideal para protótipos. Provisioned Throughput impõe compromisso e custo fixo alto; instâncias EC2 com GPU e endpoints SageMaker permanentes cobram por hora mesmo sem uso."
  },
  {
    id: "d2-28", domain: 2, type: "single",
    stem: "Uma equipe precisa escolher entre um modelo de fundação com centenas de bilhões de parâmetros e um modelo menor. A aplicação exige respostas com latência muito baixa e custo reduzido, para uma tarefa simples de classificação de texto.\n\nQual consideração está correta?",
    options: [
      "Um modelo menor tende a oferecer menor latência e menor custo por inferência, e pode ser suficiente para tarefas simples.",
      "O modelo maior sempre é a escolha certa, pois tem mais conhecimento.",
      "O tamanho do modelo não influencia latência nem custo.",
      "Modelos menores não podem ser usados em produção."
    ],
    correct: [0],
    explanation: "Modelos maiores geralmente têm mais capacidade, porém maior latência e custo por token. Para tarefas simples e bem definidas, modelos menores costumam entregar qualidade suficiente com respostas mais rápidas e baratas — a seleção deve equilibrar capacidade, latência, custo e modalidade conforme o caso de uso."
  },
  {
    id: "d2-29", domain: 2, type: "multiple",
    stem: "Uma diretoria quer definir como medirá o sucesso de um novo assistente de IA generativa de atendimento ao cliente após o lançamento.\n\nQuais métricas de negócio são adequadas para essa avaliação? (Selecione DUAS.)",
    options: [
      "Índice de satisfação do cliente (CSAT) nas conversas com o assistente",
      "Redução do tempo médio de resolução dos chamados",
      "Valor da perplexidade do modelo no conjunto de validação",
      "Quantidade de parâmetros do modelo escolhido",
      "Número de GPUs usadas na inferência"
    ],
    correct: [0, 1],
    explanation: "CSAT e tempo médio de resolução medem impacto real no negócio — junto com taxa de contenção/escalonamento, conversão e custo por atendimento. Perplexidade é métrica técnica de modelagem de linguagem, e número de parâmetros/GPUs são características técnicas, não indicadores de valor de negócio."
  },
  {
    id: "d2-30", domain: 2, type: "single",
    stem: "Qual das opções descreve corretamente uma etapa do ciclo de vida de um modelo de fundação?",
    options: [
      "Pré-treinamento: o modelo aprende padrões gerais de linguagem a partir de volumes massivos de dados, geralmente de forma autossupervisionada.",
      "Pré-treinamento: o modelo é ajustado com poucas centenas de exemplos rotulados de uma tarefa específica.",
      "Seleção de dados: etapa que ocorre somente após a implantação do modelo.",
      "Feedback: etapa opcional que não influencia versões futuras do modelo."
    ],
    correct: [0],
    explanation: "O ciclo de vida de um FM inclui: seleção e preparação de dados, pré-treinamento (aprendizado autossupervisionado em dados massivos não rotulados), otimização/adaptação (fine-tuning, RLHF, prompt engineering), avaliação, implantação e feedback contínuo — que realimenta melhorias. Ajuste com poucos exemplos rotulados é fine-tuning, não pré-treinamento."
  },
  {
    id: "d2-31", domain: 2, type: "single",
    stem: "Uma empresa de mídia quer gerar automaticamente descrições curtas de produtos a partir de fichas técnicas, mantendo os fatos das fichas e evitando conteúdo inventado.\n\nQual combinação de práticas reduz o risco de alucinação nesse cenário?",
    options: [
      "Incluir a ficha técnica no prompt como contexto, usar temperatura baixa e instruir o modelo a responder apenas com base no texto fornecido.",
      "Usar temperatura máxima para aumentar a fluência do texto gerado.",
      "Remover qualquer contexto do prompt para não confundir o modelo.",
      "Aumentar o número máximo de tokens para o modelo ter liberdade criativa."
    ],
    correct: [0],
    explanation: "Fornecer o conteúdo-fonte como contexto (grounding), reduzir a temperatura e instruir explicitamente o modelo a se limitar ao texto fornecido são práticas eficazes contra alucinação. Temperatura alta e ausência de contexto aumentam a chance de conteúdo inventado; o máximo de tokens apenas limita o comprimento."
  },
  {
    id: "d2-32", domain: 2, type: "single",
    stem: "Um cliente pergunta se os prompts e dados enviados ao Amazon Bedrock são usados para treinar os modelos de fundação dos provedores.\n\nQual é a resposta correta?",
    options: [
      "Não. Os dados dos clientes não são usados para treinar os modelos base nem são compartilhados com os provedores de modelos.",
      "Sim. Todos os prompts enviados são adicionados automaticamente ao conjunto de treinamento dos provedores.",
      "Sim, exceto quando a conta usa a região us-east-1.",
      "Não é possível saber; depende de cada chamada de API."
    ],
    correct: [0],
    explanation: "Um dos pilares do Bedrock é a privacidade: prompts, completions e dados de customização dos clientes NÃO são usados para treinar os modelos base nem compartilhados com os provedores. Modelos customizados (fine-tuned) ficam privados da conta. Os dados podem ser criptografados e o tráfego pode ficar na rede privada via VPC endpoints (AWS PrivateLink)."
  },
  {
    id: "d2-33", domain: 2, type: "single",
    stem: "Uma equipe usa um LLM para extrair campos específicos de e-mails e precisa que a resposta pare imediatamente após o fechamento do JSON gerado, sem texto adicional.\n\nQual parâmetro de inferência ajuda a alcançar esse comportamento?",
    options: [
      "Sequências de parada (stop sequences)",
      "Temperatura",
      "Top-k",
      "Penalidade de presença"
    ],
    correct: [0],
    explanation: "Stop sequences definem cadeias de caracteres que, quando geradas, interrompem imediatamente a resposta do modelo — úteis para delimitar saídas estruturadas. Temperatura e top-k controlam aleatoriedade da amostragem, e penalidades de presença/frequência desestimulam repetições, mas não interrompem a geração."
  },
  {
    id: "d2-34", domain: 2, type: "single",
    stem: "Qual cenário representa um caso de uso de IA generativa do tipo \"agente\" (agent)?",
    options: [
      "Um assistente que, para atender ao pedido \"reserve minha viagem\", decompõe a tarefa em etapas, consulta APIs de voos e hotéis e executa as ações necessárias.",
      "Um modelo que apenas traduz frases do inglês para o português.",
      "Um dashboard que exibe gráficos de vendas históricas.",
      "Um índice de busca por palavras-chave em documentos."
    ],
    correct: [0],
    explanation: "Agentes de IA generativa vão além de gerar texto: raciocinam sobre uma meta, decompõem tarefas em etapas e executam ações chamando APIs e fontes de dados externas (ex.: Amazon Bedrock Agents). Tradução simples, dashboards e busca por palavras-chave não envolvem orquestração autônoma de ações."
  },
  {
    id: "d2-35", domain: 2, type: "single",
    stem: "Uma empresa quer melhorar a produtividade da equipe de análise de dados permitindo consultas em linguagem natural que geram automaticamente dashboards e histórias de dados no seu serviço de BI da AWS.\n\nQual recurso atende a esse requisito?",
    options: [
      "Amazon Q in QuickSight",
      "Amazon Personalize",
      "AWS Glue DataBrew",
      "Amazon Athena"
    ],
    correct: [0],
    explanation: "O Amazon Q in QuickSight incorpora IA generativa ao BI: usuários fazem perguntas em linguagem natural e recebem visualizações, resumos executivos e histórias de dados. Personalize é recomendação, DataBrew é preparação visual de dados e Athena é consulta SQL — nenhum gera dashboards a partir de linguagem natural."
  },
  {
    id: "d2-36", domain: 2, type: "single",
    stem: "Ao estimar os custos de uma aplicação com LLM no Amazon Bedrock em modo on-demand, quais fatores influenciam DIRETAMENTE o valor pago por requisição?",
    options: [
      "O número de tokens de entrada e de saída processados e o modelo escolhido.",
      "Apenas o número de usuários cadastrados na aplicação.",
      "O número de buckets do S3 na conta.",
      "A quantidade de linhas de código da aplicação."
    ],
    correct: [0],
    explanation: "No modo on-demand, o Bedrock cobra por 1.000 tokens de entrada e por 1.000 tokens de saída, com preços que variam por modelo (modelos maiores custam mais). Prompts longos, contextos extensos (ex.: RAG com muitos trechos) e respostas longas aumentam o custo. Usuários cadastrados, buckets e linhas de código não entram nessa conta."
  },
  {
    id: "d2-37", domain: 2, type: "single",
    stem: "Uma empresa quer usar IA generativa para criar variações de imagens de um produto para campanhas, a partir de uma imagem de referência e instruções em texto.\n\nQual caso de uso de IA generativa descreve esse cenário?",
    options: [
      "Geração e edição de imagens (image-to-image e text-to-image)",
      "Sumarização de texto",
      "Reconhecimento de entidades nomeadas",
      "Previsão de séries temporais"
    ],
    correct: [0],
    explanation: "Criar variações de imagens a partir de uma referência com instruções textuais é geração/edição de imagens — tipicamente com modelos de difusão (no Bedrock: Amazon Titan Image Generator/Amazon Nova Canvas, Stability AI). Sumarização e NER são tarefas de texto; previsão de séries temporais é ML tradicional."
  },
  {
    id: "d2-38", domain: 2, type: "single",
    stem: "Por que a infraestrutura de IA generativa da AWS pode reduzir o custo total de propriedade (TCO) em comparação com montar uma infraestrutura própria de GPUs on-premises?",
    options: [
      "A empresa paga pelo uso, sem investimento inicial em hardware, e aproveita serviços gerenciados que reduzem o custo operacional de manter clusters de GPU.",
      "A AWS fornece GPUs gratuitamente para qualquer workload de IA generativa.",
      "Modelos executados na AWS não consomem recursos computacionais.",
      "A infraestrutura on-premises não consegue executar modelos de linguagem."
    ],
    correct: [0],
    explanation: "Na AWS, o custo de capital (compra de GPUs, data center) vira custo variável por uso, com elasticidade para escalar e serviços gerenciados (Bedrock, SageMaker) que eliminam grande parte da operação — além de chips otimizados (Trainium, Inferentia) para reduzir custo de treino/inferência. As demais alternativas são factualmente falsas."
  }
];
