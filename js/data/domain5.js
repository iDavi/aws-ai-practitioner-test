/* Domínio 5 — Segurança, Conformidade e Governança para Soluções de IA (14% do exame AIF-C01) */
window.DOMAIN5 = [
  {
    id: "d5-01", domain: 5, type: "single",
    stem: "Uma aplicação em execução no AWS Lambda precisa invocar modelos no Amazon Bedrock.\n\nQual é a forma MAIS segura de conceder esse acesso?",
    options: [
      "Atribuir à função Lambda uma role do IAM com uma política que permita apenas as ações necessárias do Bedrock (privilégio mínimo).",
      "Armazenar chaves de acesso de um usuário administrador no código da função.",
      "Usar as credenciais root da conta nas variáveis de ambiente.",
      "Tornar a API do Bedrock pública, sem autenticação."
    ],
    correct: [0],
    explanation: "A prática correta é usar roles do IAM com privilégio mínimo: credenciais temporárias, sem segredos no código, permitindo apenas as ações necessárias (ex.: bedrock:InvokeModel em modelos específicos). Chaves fixas no código e credenciais root são graves violações de segurança, e APIs da AWS sempre exigem autenticação."
  },
  {
    id: "d5-02", domain: 5, type: "single",
    stem: "Uma empresa quer garantir que os dados de treinamento armazenados no Amazon S3 estejam criptografados em repouso com chaves gerenciadas pela própria empresa, com controle de rotação e de acesso às chaves.\n\nQual serviço da AWS atende a esse requisito?",
    options: [
      "AWS KMS (Key Management Service) com chaves gerenciadas pelo cliente",
      "Amazon CloudFront",
      "AWS Auto Scaling",
      "Amazon SNS"
    ],
    correct: [0],
    explanation: "O AWS KMS gerencia chaves criptográficas; usando chaves gerenciadas pelo cliente (CMK), a empresa controla políticas de acesso, rotação e auditoria do uso das chaves (via CloudTrail) para criptografia em repouso no S3, SageMaker, Bedrock etc. CloudFront é CDN, Auto Scaling é elasticidade e SNS é mensageria."
  },
  {
    id: "d5-03", domain: 5, type: "single",
    stem: "Por requisito de segurança, o tráfego entre a VPC de uma empresa e o Amazon Bedrock não pode atravessar a internet pública.\n\nQual solução atende a esse requisito?",
    options: [
      "Criar um VPC endpoint de interface com AWS PrivateLink para o Amazon Bedrock.",
      "Usar um NAT Gateway para acessar o endpoint público do Bedrock.",
      "Publicar as credenciais em um bucket S3 público.",
      "Configurar o Bedrock em modo de acesso anônimo."
    ],
    correct: [0],
    explanation: "VPC endpoints de interface (AWS PrivateLink) permitem que recursos na VPC acessem serviços da AWS, como o Bedrock, pela rede privada da AWS, sem tráfego pela internet pública. NAT Gateway ainda envia o tráfego pela internet; as outras duas opções são inseguras/inexistentes."
  },
  {
    id: "d5-04", domain: 5, type: "single",
    stem: "Antes de usar dados de clientes armazenados no Amazon S3 para treinar um modelo, a empresa precisa descobrir automaticamente, em escala, se há dados sensíveis como CPFs, e-mails e números de cartão nesses buckets.\n\nQual serviço da AWS atende a esse requisito?",
    options: [
      "Amazon Macie",
      "Amazon GuardDuty",
      "AWS Shield",
      "AWS WAF"
    ],
    correct: [0],
    explanation: "O Amazon Macie usa ML e correspondência de padrões para descobrir e classificar dados sensíveis (PII, dados financeiros) em buckets do S3 — passo essencial de governança antes de usar dados em treinamento. GuardDuty detecta ameaças na conta, Shield protege contra DDoS e WAF filtra tráfego web."
  },
  {
    id: "d5-05", domain: 5, type: "single",
    stem: "De acordo com o modelo de responsabilidade compartilhada da AWS, ao usar um serviço gerenciado como o Amazon Bedrock, qual item é responsabilidade do CLIENTE?",
    options: [
      "Configurar corretamente as permissões do IAM, proteger seus dados e controlar o que os usuários enviam à aplicação.",
      "A segurança física dos data centers da AWS.",
      "A manutenção do hardware dos servidores que hospedam o serviço.",
      "A atualização do software de infraestrutura subjacente do serviço gerenciado."
    ],
    correct: [0],
    explanation: "A AWS é responsável pela segurança DA nuvem (instalações físicas, hardware, software de infraestrutura dos serviços gerenciados); o cliente é responsável pela segurança NA nuvem: identidades e permissões (IAM), proteção e classificação dos dados, configuração dos recursos e uso responsável da aplicação."
  },
  {
    id: "d5-06", domain: 5, type: "single",
    stem: "O time de auditoria precisa saber quem invocou modelos no Amazon Bedrock, quando e a partir de qual identidade IAM, registrando todas as chamadas de API da conta.\n\nQual serviço da AWS fornece essa trilha de auditoria?",
    options: [
      "AWS CloudTrail",
      "Amazon CloudWatch",
      "AWS X-Ray",
      "AWS Systems Manager"
    ],
    correct: [0],
    explanation: "O AWS CloudTrail registra as chamadas de API na conta (quem, quando, de onde, qual ação) — a trilha de auditoria de gerenciamento. Para registrar o CONTEÚDO de prompts e respostas, ativa-se adicionalmente o model invocation logging do Bedrock. CloudWatch coleta métricas/logs de aplicações, X-Ray rastreia requisições distribuídas e Systems Manager administra recursos."
  },
  {
    id: "d5-07", domain: 5, type: "single",
    stem: "Uma empresa precisa armazenar o conteúdo completo dos prompts e das respostas das invocações de modelos no Amazon Bedrock para fins de conformidade e análise.\n\nQual recurso atende a esse requisito?",
    options: [
      "Ativar o model invocation logging do Bedrock, enviando os registros para o Amazon S3 ou CloudWatch Logs.",
      "O CloudTrail, que grava automaticamente o texto de todos os prompts.",
      "O AWS Config, que armazena o conteúdo das respostas dos modelos.",
      "Os playgrounds do console, que salvam todas as conversas por padrão."
    ],
    correct: [0],
    explanation: "O model invocation logging é o recurso do Bedrock que registra o conteúdo de entrada e saída das invocações (para S3 e/ou CloudWatch Logs) — deve ser habilitado explicitamente. O CloudTrail registra METADADOS das chamadas de API, não o texto completo dos prompts; Config rastreia configuração de recursos; os playgrounds não são mecanismo de conformidade."
  },
  {
    id: "d5-08", domain: 5, type: "single",
    stem: "Uma empresa precisa comprovar continuamente que seus recursos da AWS seguem as configurações exigidas — por exemplo, que todos os buckets S3 com dados de treinamento estão criptografados e sem acesso público.\n\nQual serviço da AWS avalia continuamente a conformidade das configurações dos recursos?",
    options: [
      "AWS Config",
      "AWS Batch",
      "Amazon Kinesis",
      "AWS Glue"
    ],
    correct: [0],
    explanation: "O AWS Config monitora e avalia continuamente as configurações dos recursos contra regras definidas (ex.: criptografia habilitada, acesso público bloqueado), registrando o histórico e sinalizando não conformidades. Batch é processamento em lote, Kinesis é streaming de dados e Glue é ETL."
  },
  {
    id: "d5-09", domain: 5, type: "single",
    stem: "Uma equipe de compliance quer automatizar a coleta de evidências do uso da AWS para auditorias, usando frameworks pré-construídos alinhados a padrões do setor.\n\nQual serviço da AWS atende a esse requisito?",
    options: [
      "AWS Audit Manager",
      "AWS Cost Explorer",
      "Amazon EventBridge",
      "AWS CodePipeline"
    ],
    correct: [0],
    explanation: "O AWS Audit Manager coleta evidências automaticamente e as organiza em frameworks de auditoria pré-construídos (e customizáveis) alinhados a padrões e regulamentos, simplificando a preparação para auditorias. Cost Explorer analisa custos, EventBridge roteia eventos e CodePipeline é CI/CD."
  },
  {
    id: "d5-10", domain: 5, type: "single",
    stem: "Um cliente corporativo pediu à empresa os relatórios de conformidade da AWS, como SOC 2 e certificações ISO, para aprovar o uso da nuvem no projeto de IA.\n\nOnde a empresa pode baixar esses relatórios oficiais?",
    options: [
      "No AWS Artifact",
      "No AWS Marketplace",
      "No Amazon S3 público da AWS",
      "No AWS Health Dashboard"
    ],
    correct: [0],
    explanation: "O AWS Artifact é o portal de autoatendimento para baixar relatórios de conformidade e certificações da AWS (SOC, ISO, PCI etc.) e gerenciar acordos. Marketplace vende software de terceiros, e as demais opções não distribuem relatórios de compliance."
  },
  {
    id: "d5-11", domain: 5, type: "single",
    stem: "Uma equipe de segurança quer verificar automaticamente vulnerabilidades de software e exposição de rede nas instâncias EC2 e funções Lambda que compõem sua aplicação de IA.\n\nQual serviço da AWS atende a esse requisito?",
    options: [
      "Amazon Inspector",
      "Amazon Macie",
      "AWS Artifact",
      "AWS IAM"
    ],
    correct: [0],
    explanation: "O Amazon Inspector faz avaliação contínua e automatizada de vulnerabilidades (CVEs) e exposição de rede em EC2, imagens de contêiner no ECR e funções Lambda. Macie descobre dados sensíveis no S3, Artifact fornece relatórios de conformidade e IAM gerencia identidades e permissões."
  },
  {
    id: "d5-12", domain: 5, type: "single",
    stem: "Uma empresa quer detectar comportamento anômalo e potencialmente malicioso em suas contas AWS, como acesso incomum a APIs e atividade suspeita de credenciais comprometidas.\n\nQual serviço da AWS fornece essa detecção inteligente de ameaças?",
    options: [
      "Amazon GuardDuty",
      "AWS Config",
      "Amazon Textract",
      "AWS Glue"
    ],
    correct: [0],
    explanation: "O Amazon GuardDuty usa ML e inteligência de ameaças para detectar atividades maliciosas ou não autorizadas na conta (credenciais comprometidas, comunicação com hosts maliciosos, atividade anômala de API). Config avalia conformidade de configuração; Textract e Glue não são serviços de segurança."
  },
  {
    id: "d5-13", domain: 5, type: "single",
    stem: "Por regulamentação, os dados de clientes de uma empresa devem permanecer armazenados e processados dentro do país. A empresa vai usar serviços de IA generativa da AWS.\n\nQual prática atende a esse requisito de residência de dados?",
    options: [
      "Usar apenas regiões da AWS localizadas no país exigido e restringir por política o uso de outras regiões.",
      "Usar qualquer região, pois a localização dos dados não importa na nuvem.",
      "Armazenar os dados criptografados em qualquer região, o que dispensa requisitos de residência.",
      "Transferir os dados diariamente entre regiões para redundância global."
    ],
    correct: [0],
    explanation: "Residência de dados se resolve escolhendo regiões da AWS no território exigido — os dados dos clientes não saem da região sem ação do cliente — e aplicando políticas (SCPs/IAM) que bloqueiem o uso de outras regiões. Criptografia protege confidencialidade, mas NÃO substitui o requisito legal de localização."
  },
  {
    id: "d5-14", domain: 5, type: "single",
    stem: "Uma aplicação de IA generativa precisa usar uma chave de API de um serviço externo. A equipe quer armazenar essa credencial com segurança, com rotação automática e acesso controlado por IAM.\n\nQual serviço da AWS atende a esses requisitos?",
    options: [
      "AWS Secrets Manager",
      "Um arquivo de configuração no repositório Git",
      "Uma variável fixa no código-fonte",
      "Um bucket S3 público"
    ],
    correct: [0],
    explanation: "O AWS Secrets Manager armazena segredos (chaves de API, senhas) com criptografia via KMS, rotação automática e acesso auditável controlado pelo IAM. Credenciais em repositórios, código-fonte ou buckets públicos são vetores clássicos de vazamento."
  },
  {
    id: "d5-15", domain: 5, type: "single",
    stem: "Qual conceito de governança de dados descreve documentar a origem dos dados, as transformações aplicadas e o caminho que eles percorreram até serem usados no treinamento de um modelo?",
    options: [
      "Linhagem de dados (data lineage)",
      "Chunking",
      "Inferência em lote",
      "Amostragem top-k"
    ],
    correct: [0],
    explanation: "Linhagem de dados rastreia origem, transformações e movimentação dos dados ao longo do ciclo de vida — essencial para auditoria, reprodutibilidade, investigação de vieses e comprovação de direitos de uso (procedência) dos dados de treinamento. Os demais termos pertencem a outros contextos (RAG, inferência, amostragem)."
  },
  {
    id: "d5-16", domain: 5, type: "multiple",
    stem: "Uma empresa está estabelecendo a governança do ciclo de vida dos dados usados em seus projetos de IA.\n\nQuais práticas fazem parte dessa governança? (Selecione DUAS.)",
    options: [
      "Definir políticas de retenção e descarte dos dados conforme requisitos legais e de negócio",
      "Registrar e monitorar o acesso e o uso dos dados (logging e auditoria)",
      "Conceder acesso irrestrito a todos os funcionários para agilizar os projetos",
      "Manter todos os dados para sempre, independentemente da lei",
      "Eliminar qualquer documentação sobre as fontes dos dados"
    ],
    correct: [0, 1],
    explanation: "Governança do ciclo de vida dos dados inclui: classificação, políticas de retenção/descarte, controle de acesso com privilégio mínimo, logging/monitoramento do uso, qualidade e documentação de proveniência. Acesso irrestrito, retenção infinita contra a lei e destruição da documentação de origem violam princípios básicos de governança."
  },
  {
    id: "d5-17", domain: 5, type: "single",
    stem: "Uma equipe de segurança está classificando o risco de três iniciativas de IA generativa: (1) usar um chatbot público de terceiros, (2) construir uma aplicação com RAG no Amazon Bedrock, (3) pré-treinar um modelo próprio do zero.\n\nQual ferramenta da AWS ajuda a determinar o escopo de segurança adequado a cada caso?",
    options: [
      "A Generative AI Security Scoping Matrix da AWS, que classifica as iniciativas em escopos conforme o nível de propriedade e customização.",
      "O AWS Pricing Calculator.",
      "O Amazon CloudFront.",
      "O AWS Trusted Advisor na categoria de custos."
    ],
    correct: [0],
    explanation: "A Generative AI Security Scoping Matrix da AWS define 5 escopos — de consumir apps públicos (escopo 1) até treinar modelos próprios (escopo 5) — e mapeia, para cada escopo, as disciplinas de segurança a considerar (governança, conformidade, legal, privacidade, controles). As demais opções tratam de custo e distribuição de conteúdo."
  },
  {
    id: "d5-18", domain: 5, type: "single",
    stem: "Qual prática reduz o risco de exposição pública acidental dos dados de treinamento armazenados no Amazon S3?",
    options: [
      "Habilitar o S3 Block Public Access e usar políticas de bucket restritivas com privilégio mínimo.",
      "Compartilhar o bucket com URLs públicas para facilitar o acesso da equipe.",
      "Desabilitar a criptografia para simplificar o acesso.",
      "Usar o mesmo bucket público para dados de treinamento e site institucional."
    ],
    correct: [0],
    explanation: "O S3 Block Public Access bloqueia acesso público no nível da conta/bucket, e políticas de bucket com privilégio mínimo garantem que apenas identidades autorizadas acessem os dados — complementados por criptografia (KMS) e monitoramento (Macie, CloudTrail). As demais opções criam exposição direta dos dados."
  },
  {
    id: "d5-19", domain: 5, type: "single",
    stem: "Uma organização precisa aplicar o princípio de \"accountability algorítmica\" em seus sistemas de IA para atender a padrões e regulamentações emergentes.\n\nQual conjunto de práticas sustenta esse princípio?",
    options: [
      "Documentar modelos (model cards), manter trilhas de auditoria das decisões, definir responsáveis pelo sistema e permitir contestação das decisões automatizadas.",
      "Manter o funcionamento dos modelos em segredo absoluto, inclusive para auditores.",
      "Transferir toda a responsabilidade pelas decisões para o modelo.",
      "Evitar qualquer registro de logs para reduzir custos de armazenamento."
    ],
    correct: [0],
    explanation: "Accountability algorítmica exige que a organização responda pelas decisões dos seus sistemas: documentação padronizada (ex.: SageMaker Model Cards), trilhas de auditoria (CloudTrail, invocation logs), responsáveis definidos, avaliação de riscos e canais de contestação. Sigilo total, \"culpar o modelo\" e ausência de logs inviabilizam a prestação de contas."
  },
  {
    id: "d5-20", domain: 5, type: "single",
    stem: "Uma empresa quer receber verificações automáticas de boas práticas na conta AWS, como exposição de portas, buckets S3 públicos e limites de serviço, com recomendações de correção.\n\nQual serviço da AWS fornece essas verificações?",
    options: [
      "AWS Trusted Advisor",
      "Amazon Personalize",
      "AWS Snowball",
      "Amazon MQ"
    ],
    correct: [0],
    explanation: "O AWS Trusted Advisor verifica a conta contra boas práticas em custo, desempenho, segurança (ex.: buckets públicos, MFA na root), tolerância a falhas e limites de serviço, com recomendações. Personalize é recomendação para usuários finais, Snowball é transferência física de dados e MQ é mensageria."
  },
  {
    id: "d5-21", domain: 5, type: "multiple",
    stem: "Uma empresa vai customizar um modelo no Amazon Bedrock com dados proprietários e quer proteger esses dados durante todo o processo.\n\nQuais práticas de segurança se aplicam? (Selecione DUAS.)",
    options: [
      "Criptografar os dados em repouso com AWS KMS e em trânsito com TLS",
      "Restringir com políticas do IAM quem pode iniciar jobs de customização e invocar o modelo customizado",
      "Publicar os dados de treinamento em um bucket público para acelerar a ingestão",
      "Compartilhar o modelo customizado com todas as contas AWS automaticamente",
      "Desativar todos os logs para não registrar informações"
    ],
    correct: [0, 1],
    explanation: "Proteção de dados de customização: criptografia em repouso (KMS, incluindo chaves do cliente) e em trânsito (TLS), IAM com privilégio mínimo para jobs e invocação, isolamento de rede (PrivateLink) e auditoria (CloudTrail). O modelo customizado permanece privado da conta. Buckets públicos e ausência de logs são anti-práticas."
  },
  {
    id: "d5-22", domain: 5, type: "single",
    stem: "Qual padrão internacional trata especificamente de sistemas de gestão de inteligência artificial, ajudando organizações a governar o desenvolvimento e o uso responsável de IA?",
    options: [
      "ISO/IEC 42001",
      "ISO 9660",
      "HTML5",
      "IEEE 802.11"
    ],
    correct: [0],
    explanation: "A ISO/IEC 42001 é a norma de sistema de gestão de IA (AIMS), definindo requisitos para governar o ciclo de vida de IA de forma responsável — análoga ao que a ISO 27001 é para segurança da informação. ISO 9660 é sistema de arquivos de CD-ROM, HTML5 é padrão web e IEEE 802.11 é Wi-Fi. Outros padrões relevantes ao exame: SOC 2 e ISO 27001 (segurança), e frameworks como o NIST AI RMF."
  }
];
