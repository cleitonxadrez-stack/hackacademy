# HACK ACADEMY

**Aprenda. Crie. Inove. Transforme.**

A HACK ACADEMY é a plataforma oficial de aprendizagem do Ecossistema HACK BRASIL, criada para desenvolver as competências que formarão os profissionais, empreendedores e líderes do futuro. Mais do que oferecer cursos, a plataforma entrega uma jornada prática de aprendizagem baseada em projetos, conectada aos desafios reais do **HACK SCHOOL** e ao portfólio de competências do **HACK HUB**.

> **Conceito central:** Aprenda. Pratique. Transforme. Toda formação da Academy termina com uma aplicação prática real — o aluno não apenas assiste aulas, ele desenvolve um projeto e aplica o conhecimento no Ecossistema HACK BRASIL.

> **Rebrand:** a identidade visual foi atualizada de azul/verde para **preto + amarelo + branco**, alinhada à marca oficial do Ecossistema HACK BRASIL, com fotografia real da marca substituindo imagens genéricas em todo o site.

---

## ✅ Funcionalidades implementadas (Versão 1.0)

- **Home (`index.html`)** — Hero com slogan, contadores animados, seção de diferencial "Aprenda. Pratique. Transforme.", resumo institucional, áreas de formação, cursos em destaque (dinâmico via API), trilhas de aprendizagem, integração com o Ecossistema, diferenciais e CTA final.
- **Sobre (`sobre.html`)** — Quem somos, missão, visão, como funciona (ciclo de aprendizagem), públicos-alvo e valores.
- **Catálogo de Cursos (`cursos.html`)** — Grade de cursos carregada dinamicamente da tabela `courses`, com busca por texto e filtros por categoria/trilha (via querystring `?categoria=` ou `?trilha=`). A partir desta atualização, o catálogo contém **apenas os 5 cursos oficiais da Trilha de Certificação HACK BRASIL** (ver seção dedicada abaixo).
- **Página do Curso (`curso.html?id=...`)** — Capa, descrição, professor, objetivos, competências, conteúdo programático, carga horária, aplicação prática no Ecossistema e botão "Começar Curso" (exige login simulado).
- **Login (`login.html`)** — Formulário de entrada simulada (aluno ou professor), com `localStorage` para persistir sessão no navegador.
- **Área do Aluno (`aluno.html`)** — Cursos em andamento (com progresso), cursos concluídos, histórico de atividades e atalho para certificados. Requer login.
- **Área do Professor (`professor.html`)** — Painel com estatísticas de cursos publicados, alunos, certificados emitidos e carga horária; lista de cursos do professor com ações de visualizar/editar (placeholders). Requer login.
- **Certificados (`certificados.html`)** — Certificados digitais gerados dinamicamente por curso concluído, com nome do aluno, carga horária, QR Code (biblioteca `qrcode.js`) e código de validação único. Requer login.
- **Professores (`professores.html`)** — Grade com foto, mini currículo, área de atuação e quantidade de cursos publicados por instrutor (tabela `instructors`).
- **Blog (`blog.html` + `post.html?id=...`)** — Listagem de artigos com filtro por categoria e página de leitura completa (tabela `blog_posts`).
- **Contato (`contato.html`)** — Formulário que grava mensagens na tabela `contact_messages`, além de atalhos para WhatsApp, Instagram, LinkedIn e Email.
- **Institucional** — Política de Privacidade (`privacidade.html`) e Termos de Uso (`termos.html`).
- **Header/Footer compartilhados** (`includes/header.html`, `includes/footer.html`) carregados dinamicamente via `js/common.js`, com menu mobile responsivo e área de autenticação reativa.
- **Ícones das Trilhas de Aprendizagem (Home)** — Os 8 emojis genéricos usados na seção "Trilhas de Aprendizagem" foram substituídos por ícones exclusivos, desenhados sob medida e inspirados no raio (⚡) do logotipo HACK ACADEMY. Cada ícone é um badge preto (`#101010`) com ilustração em linha amarela (`#FFC800`), integrando o elemento do raio ao desenho:
  - `images/icons/icon-jovem-inovador.png` — foguete com chama de exaustão em formato de raio (Jovem Inovador)
  - `images/icons/icon-inteligencia-artificial.png` — cabeça de robô com circuito em formato de raio (Inteligência Artificial)
  - `images/icons/icon-empreendedorismo.png` — pasta executiva com raio em relevo (Empreendedorismo)
  - `images/icons/icon-startup.png` — lâmpada com filamento em formato de raio (Startup)
  - `images/icons/icon-pitch.png` — megafone com onda sonora em formato de raio (Pitch)
  - `images/icons/icon-professor-mentor.png` — professor(a) ao lado de quadro branco com raio desenhado (Professor Mentor)
  - `images/icons/icon-escola-inovadora.png` — prédio escolar com bandeira em formato de raio (Escola Inovadora)
  - `images/icons/icon-gestao-escolar.png` — pessoa de terno com gráfico de barras, uma barra em formato de raio (Gestão Escolar)
- **Fotos de topo (hero) substituídas em 4 páginas** — as imagens de banner de `cursos.html`, `professores.html`, `blog.html` e `certificados.html` estavam com fotos genéricas/desconfiguradas (pessoas sem relação com a marca) e foram trocadas por 4 fotos reais enviadas pelo usuário, já no padrão visual preto/amarelo da HACK ACADEMY:
  - `images/hack-cursos-equipe-planejamento.png` — equipe colaborando em planejamento de curso (banner de `cursos.html`)
  - `images/hack-professores-mentoria-equipe.png` — especialista mentorando equipe de alunos (banner de `professores.html`)
  - `images/hack-blog-criacao-conteudo.png` — produção de conteúdo sobre IA/inovação (banner de `blog.html`)
  - `images/hack-certificados-cerimonia.png` — entrega de certificado em cerimônia (banner de `certificados.html`)
- **Sala de Aula unificada com aprovação automática e certificado liberado (`sala-de-aula.html?id=...`)** — o primeiro curso com conteúdo real publicado é o **Explorador HACK SCHOOL® — Missão 01**. Para ele (e para qualquer curso futuro com `slides_url` preenchido), a experiência de estudo foi reorganizada em **uma única página de sala de aula**, no lugar de páginas separadas:
  1. **Cabeçalho do curso** (igual ao de `curso.html`: categoria, título, professor, carga horária, nível) + selos de status ("Teoria em andamento/concluída" e "Desafio pendente/Aprovado").
  2. **Slides da aula em foco principal**, grandes e bem visíveis, renderizados página a página em um visualizador nativo (via **PDF.js**) que ocupa quase a tela inteira. **Basta clicar no slide (ou usar as setas laterais/teclado) para avançar** para o próximo, como numa apresentação — há também um contador "página atual / total" e uma barra de progresso. O botão **"Concluí os slides"** só é liberado automaticamente quando o aluno chega ao último slide. Há também um link para abrir/baixar o PDF original em uma nova aba.
  3. **Capa do material complementar em miniatura formato A4** (thumbnail estilizado com proporção A4, tarja "PDF"), como card de acesso ao PDF de leitura complementar.
  4. **Desafio HACK embutido na mesma página**, exibido logo abaixo — **bloqueado com um cadeado** até o aluno concluir os slides (garante que ele passe por 100% da teoria antes de ser avaliado). Reaproveita as 10 questões situacionais da Missão 01 (cenário + pergunta + 5 alternativas), com feedback imediato (verde/vermelho) e orientação explicativa a cada resposta.
  5. **Aprovação e certificado automáticos**: ao finalizar o Desafio HACK, se o aluno acertar **7 ou mais de 10 (≥70%)**, ele é automaticamente aprovado — a tela de resultado exibe o selo "Aprovado — certificado liberado!", uma faixa dourada é ativada no topo da sala de aula, e o **certificado digital completo** aparece automaticamente na própria página, na seção final. Se acertar menos de 7, é convidado a refazer o desafio.
  6. **Certificado em 2 páginas (frente e verso), desenhado 100% programaticamente em PDF (sem captura de HTML/CSS)**: o certificado é **desenhado diretamente no PDF com comandos vetoriais do `jsPDF`** (texto, linhas, círculos, retângulos), sem nenhuma captura de tela de HTML/CSS — eliminando problemas de layout desconfigurado. A pré-visualização exibida na tela (`certificados.html` e na Sala de Aula) é **o próprio arquivo PDF gerado**, embutido em um `<iframe>` — ou seja, o que o aluno vê é exatamente o que ele baixa, sem risco de divergência visual:
     - **Página 1 (frente):** nome do aluno, curso, número do certificado, data de emissão, carga horária, nível, categoria; **assinatura digital do CEO Cleiton Marino Santana, centralizada** (imagem `images/assinatura-cleiton-marino-santana.jpg`, aplicada automaticamente em todos os certificados emitidos); **selo de aprovação em formato de raio** (inspirado no logotipo HACK), posicionado na lateral do certificado; e QR Code de validação (gerado com `qrcode.js` como imagem PNG e inserido no PDF). Todos os textos foram revisados ortograficamente (acentuação correta: "Formação", "inovação", "satisfatório", "Carga Horária", "Nível", etc.).
     - **Página 2 (verso):** conteúdo programático do curso — extraído automaticamente do campo `syllabus`, com emojis/ícones removidos (`stripEmojis`) e listado em grade numerada de 2 colunas — **e, abaixo, a seção "Habilidades Desenvolvidas"**, puxada automaticamente do campo `skills` do curso (sem ícones). O número do certificado e o nome do curso são repetidos no cabeçalho.
     - Gerado inteiramente por `js/certificado.js` com `jsPDF` via CDN (sem dependência de `html2canvas`); o download real inicia ao clicar em "Baixar Certificado (PDF)" (`Certificado_HACK_ACADEMY_{curso}_{codigo}.pdf`).
  - `materials/HACK_SCHOOL_Curso_01_Introducao_20h.pdf` — slides da Missão 01 · Introdução ao HACK School® (20h, 30 aulas).
  - `materials/Material_Complementar_HACK_SCHOOL.pdf` — apostila de leitura complementar (protagonismo, mentoria, criatividade, inovação, empreendedorismo, tecnologia e IA).
  - `materials/HACK_Academy_Template_Certificado_Oficial.pptx` — modelo oficial de certificado (frente + verso) enviado pelo usuário, usado como referência direta de layout/conteúdo para o certificado de 2 páginas renderizado no site.
  - **Progresso e aprovação são salvos no navegador do aluno** (`localStorage`, por usuário logado) através do novo módulo `HackProgress` em `js/common.js` — sem backend: cada aluno usando o mesmo navegador mantém seu progresso e certificado entre visitas.
  - A antiga página `desafio.html` (simulado isolado) foi transformada em um **redirecionamento automático** para `sala-de-aula.html?id=...`, preservando links antigos com `?curso=` ou `?id=`.
  - A página `curso.html` foi atualizada: o card lateral **"Sala de Aula"** substitui os antigos cards separados de materiais/desafio e leva direto para `sala-de-aula.html?id=...`; quando o aluno logado já está aprovado no curso, aparecem automaticamente uma **faixa "Você foi aprovado(a)!"** no topo e um card **"Certificado Liberado"** com link direto para `certificados.html`, e o botão principal passa a dizer "Revisar na Sala de Aula".

### 🏅 Trilha Oficial de Certificações HACK BRASIL (catálogo de cursos)

O catálogo de cursos foi reestruturado para conter **exclusivamente os 6 cursos oficiais** da trilha de certificação do Ecossistema HACK BRASIL — os cursos genéricos de exemplo (IA, Tecnologia, Comunicação etc.) foram removidos da tabela `courses`. Cada curso é uma formação de 20h, com certificado incluso, folder de capa exclusivo e dados completos (descrição, objetivos, conteúdo programático, aplicação prática e competências). Conteúdo/aulas completas (vídeos, materiais) ainda serão adicionados pelo usuário; por ora, o site já publica todos os textos e metadados de cada nível. A tabela `courses` ganhou o campo `audience` (**Alunos** ou **Professores e Gestores**) para diferenciar o curso destinado aos estudantes dos demais:

| Nível | Curso | Público | Categoria (filtro) | Trilha (filtro) | Capa |
|---|---|---|---|---|---|
| 1 | Explorador HACK SCHOOL® | **Alunos** | Formação Inicial | Explorador HACK SCHOOL | `images/courses/curso-explorador-hack-school-nivel1.png` |
| 1 | Professor Mentor HACK SCHOOL® | Professores e Gestores | Formação de Professores | Professor Mentor | `images/courses/curso-professor-mentor-hack-school-nivel1.png` |
| 2 | Gestor HACK SCHOOL® | Professores e Gestores | Gestão Escolar | Gestão Escolar | `images/courses/curso-gestor-hack-school-nivel2.png` |
| 3 | Organizador HACK® | Professores e Gestores | Organização de Eventos | Organizador HACK | `images/courses/curso-organizador-hack-nivel3.png` |
| 4 | Avaliador HACK® | Professores e Gestores | Avaliação | Avaliador HACK | `images/courses/curso-avaliador-hack-nivel4.png` |
| 5 | Especialista HACK BRASIL® | Professores e Gestores | Especialização | Especialista HACK BRASIL | `images/courses/curso-especialista-hack-brasil-nivel5.png` |

O **Explorador HACK SCHOOL®** é a porta de entrada dos **estudantes** na metodologia (ensina o Ecossistema HACK BRASIL, os 5 Perfis de Talentos — Creator, Builder, Connector, Tech Maker, Leader — trabalho em equipe e culmina no primeiro desafio HACK SCHOOL). Os demais 5 cursos formam a trilha progressiva de responsabilidade para **educadores e gestores** dentro do Ecossistema (Professor Mentor → Gestor → Organizador → Avaliador → Especialista). O curso Professor Mentor inclui, na descrição, o selo textual **🏅 Certificação Oficial HACK BRASIL** com a frase de impacto sugerida pelo usuário, por ser o curso de entrada no ecossistema para educadores.

A home (`index.html`) foi atualizada: a seção "Áreas de Formação" agora exibe os 6 cursos (Explorador em destaque com card preto/amarelo + os 5 níveis oficiais, com badge de nível e link para o filtro correspondente em `cursos.html`), a seção "Trilhas de Aprendizagem" também aponta para os 6 cursos, e os contadores do Hero foram ajustados para "6 certificações oficiais" / "5 níveis de formação". A página `cursos.html` teve os botões de filtro trocados das antigas categorias genéricas para as 6 categorias oficiais (Formação Inicial + os 5 níveis).

## 🔗 Entradas / rotas funcionais

| Página | Caminho | Parâmetros |
|---|---|---|
| Home | `index.html` | — |
| Sobre | `sobre.html` | — |
| Catálogo de Cursos | `cursos.html` | `?categoria=<Categoria>` ou `?trilha=<Trilha>` (opcional) |
| Detalhe do Curso | `curso.html` | `?id=<course_id>` (obrigatório) |
| Sala de Aula (slides + material + Desafio HACK + certificado) | `sala-de-aula.html` | `?id=<course_id>` (obrigatório, requer login) |
| Desafio HACK (redirecionamento legado) | `desafio.html` | `?curso=<course_id>` ou `?id=<course_id>` — redireciona para `sala-de-aula.html?id=...` |
| Professores | `professores.html` | — |
| Blog | `blog.html` | — |
| Artigo do Blog | `post.html` | `?id=<post_id>` (obrigatório) |
| Certificados | `certificados.html` | — (requer login) |
| Contato | `contato.html` | — |
| **Cadastre-se (novo)** | `cadastro.html` | — (formulário público de solicitação de cadastro — Aluno ou Professor) |
| **Guia de IA (novo)** | `guia-ia.html` | — (chat público com o assistente de IA — modo de demonstração até o backend de RAG ser conectado) |
| Login | `login.html` | `?redirect=<pagina.html>` (opcional, usado após login) |
| Área do Aluno | `aluno.html` | — (requer login) |
| Área do Professor | `professor.html` | — (requer login como professor) |
| **Área do Gestor / Admin (novo, protegido)** | `admin.html` | — (protegido por regra de acesso de servidor — apenas e-mails autorizados; aprova/recusa cadastros e gerencia administradores) |
| Privacidade | `privacidade.html` | — |
| Termos de Uso | `termos.html` | — |

### Endpoints de dados (RESTful Table API)

- `GET/POST tables/courses` e `GET/PUT/PATCH/DELETE tables/courses/{id}`
- `GET tables/instructors`
- `GET/POST tables/blog_posts` e `GET tables/blog_posts/{id}`
- `POST tables/contact_messages`
- `GET tables/quiz_questions?limit=100` — questões do Desafio HACK, filtradas no cliente por `course_id` e ordenadas por `order_index` (usado por `sala-de-aula.html`/`js/sala-de-aula.js`)
- `POST tables/registration_requests` — envio do formulário público de cadastro (`cadastro.html`/`js/cadastro.js`); rota pública (necessária para o formulário funcionar sem login)
- `GET/PATCH tables/registration_requests` — listagem e aprovação/recusa das solicitações (usado por `admin.html`/`js/admin.js`); a página `admin.html` que consome esta rota é protegida por regra de acesso de servidor
- `GET/POST tables/admin_users` — lista/cadastra administradores; **rota `tables/admin_users` protegida por allowlist** (apenas `cleiton@hackacademy.com.br` por padrão)
- `GET/POST/PATCH/DELETE tables/ai_knowledge_sources` — fontes de conhecimento do Guia de IA (usado por `admin.html`/`js/admin-ai.js`); contém apenas conteúdo público (cursos, blog, banco de questões) ou texto colado manualmente pelo gestor
- `GET/POST tables/ai_training_logs` — histórico de atualizações incrementais da base de conhecimento da IA (usado por `admin.html`/`js/admin-ai.js`)

## 🗄️ Modelos de dados

### `courses`
id, title, slug, category (Formação Inicial | Formação de Professores | Gestão Escolar | Organização de Eventos | Avaliação | Especialização), track, instructor_name, level (Nível 1–5), duration_hours, image_url, short_description, description (rich_text), objectives (rich_text), skills (texto separado por vírgula), syllabus (rich_text), practical_project (rich_text — aplicação prática no Ecossistema/certificação), has_certificate (bool), featured (bool), audience (Alunos | Professores e Gestores), **slides_url** (text — caminho do PDF de slides/aula), **material_complementar_url** (text — caminho do PDF de material complementar), **has_quiz** (bool — se o curso tem Desafio HACK/simulado disponível).

> Atualmente contém apenas os **6 cursos oficiais** da Trilha de Certificação HACK BRASIL (ver seção acima). Apenas o **Explorador HACK SCHOOL®** (`curso-explorador-hack-school-n1`) tem `slides_url`, `material_complementar_url` e `has_quiz: true` preenchidos até o momento.

### `quiz_questions`
id, course_id (referencia `courses.id`), order_index (number — ordem de exibição), scenario_title (texto curto do cenário), scenario_text (rich_text — descrição da situação), question_text, option_a, option_b, option_c, option_d, option_e, correct_option (A | B | C | D | E), orientation (rich_text — explicação exibida ao aluno após responder, mostrando por que a alternativa correta é a certa).

> Contém as **10 questões do "Desafio HACK — Missão 01"**, todas com `course_id = curso-explorador-hack-school-n1`, exibidas dentro da Sala de Aula (`sala-de-aula.html`).

### Progresso do aluno — `HackProgress` (armazenamento local, sem tabela)
Não é uma tabela da API — é um objeto salvo em `localStorage` (chave `hackacademy_progress_v1`), por nome de usuário logado, definido em `js/common.js`. Para cada `course_id` guarda: `slidesDone` (bool), `slidesProgress` (number), `quizDone` (bool), `quizScore`/`quizTotal` (number), `approved` (bool — true quando `quizScore/quizTotal >= 0.7`), `certificateCode` (texto no padrão `HA-2026-XXXX`, gerado deterministicamente a partir do curso + usuário) e `approvedAt` (timestamp). É consultado/atualizado por `sala-de-aula.html`, `curso.html`, `certificados.html` e `aluno.html`.

### `instructors`
id, name, photo_url, area, bio (rich_text), courses_count, linkedin_url.

### `blog_posts`
id, title, slug, category, excerpt, content (rich_text), image_url, author, published_at (datetime).

### `contact_messages`
id, name, email, subject, message (rich_text).

### `registration_requests` (novo)
id, name, email, phone, requested_role (Aluno | Professor), course_interest, message (rich_text), status (Pendente | Aprovado | Recusado), reviewed_by (e-mail do administrador que revisou), reviewed_at (datetime).

> Alimentada pelo formulário público `cadastro.html`. Cada envio começa com `status: "Pendente"`. O painel `admin.html` lista, filtra e permite Aprovar/Recusar cada solicitação, gravando `reviewed_by` (e-mail do gestor logado) e `reviewed_at`.

### `admin_users` (novo)
id, name, email, level (Gestor Master | Administrador), access_granted (bool), added_by.

### `ai_knowledge_sources` (novo)
id, title, source_type (PDF | Texto | Banco de Questões | Vídeo | Link/URL | Curso da Plataforma | Artigo do Blog), source_reference (caminho/URL/chave de origem — usada para detectar duplicados e atualizações), content_text (rich_text — texto usado para gerar os embeddings), content_hash (assinatura do conteúdo, usada para pular reprocessamento quando nada mudou), status (Pendente | Processado | Erro | Ignorado (sem alteração)), chunks_generated (number), added_by, notes (rich_text).

> Alimentada automaticamente pelo botão "Importar conteúdo da plataforma" (cursos, blog, banco de questões — só dados públicos) e/ou manualmente pelo gestor (PDFs/textos/vídeos colados como texto). Não contém dados pessoais de alunos/professores.

### `ai_training_logs` (novo)
id, triggered_by (e-mail de quem disparou), run_type (Atualização Incremental | Treinamento Completo | Adição Manual de Arquivo), sources_added (number), sources_skipped (number — fontes ignoradas por já estarem em dia, sem gasto extra), chunks_generated (number), summary (rich_text — resumo do que foi enviado), status (Concluído | Falhou | Em execução).

> Cada clique em "Atualizar Conhecimento da IA" no `admin.html` cria um registro aqui, permitindo auditar exatamente o que e quando foi passado para a IA.

> Registra quem tem poderes de administração no painel. **Importante:** adicionar um novo administrador aqui (via `admin.html`) grava o registro na tabela, mas **não libera automaticamente o acesso à página `/admin.html`** — isso é controlado por uma regra de acesso separada, em nível de servidor (ver seção "🔐 Administração e controle de acesso" abaixo). Cadastrar um novo admin sempre exige, em seguida, pedir para o assistente IA adicionar o e-mail à lista de permissões e publicar novamente.

> Todas as tabelas usam os campos de sistema automáticos (`id`, `gs_project_id`, `gs_table_name`, `created_at`, `updated_at`) da RESTful Table API.

## 🎨 Identidade visual (rebrand — Ecossistema HACK BRASIL)

- **Paleta oficial:** preto (`#101010`) + amarelo (`#FFC800` / `#E0A800`) sobre fundo branco — inspirada nos sites `hackschool.app` e `hackbrasil.com.br` e na identidade visual real da marca HACK ACADEMY (moletons e materiais pretos/amarelos com ícone de raio).
- Tipografia: Poppins (Google Fonts).
- Ícones: Font Awesome 6, com destaque para o ícone de raio (`fa-bolt`) usado no lockup da logo (`.logo-icon`, fundo amarelo + ícone preto) em todas as páginas.
- Framework CSS: Tailwind CSS via CDN + `css/style.css` (variáveis `--ha-black`, `--ha-yellow`, `--ha-yellow-dark`) para componentes, badges, gradientes escuros com brilho amarelo, skeleton loading e certificado.
- **Fotografia real da marca — cada foto usada uma única vez em todo o site:** o site utiliza **12 fotos reais** fornecidas pelo usuário, mostrando a identidade oficial HACK ACADEMY (estudantes e mentores usando moletons/camisetas pretas e amarelas com o logo do raio, notebooks/squeezes com adesivo da marca, laboratório de computadores com equipamento de marca), cada uma aplicada em **um único local do site** (sem repetição):
  - `hack-festival-premiacao.png` → Home, fundo do Hero.
  - `hack-mentoria-solucoes-inovadoras.png` → Home, imagem principal do Hero.
  - `hack-mentor-whiteboard-problema.png` → Home, seção "Quem somos" (sobre-resumo).
  - `hack-alunos-laptop-mentor.png` → Home, card do ecossistema "HACK HUB".
  - `hack-desafio-equipe.png` → Home, card do ecossistema "HACK ACADEMY".
  - `hack-sala-aula-mentor.png` → Home, card do ecossistema "HACK SCHOOL".
  - `hack-lab-computadores-hub.png` → Sobre, seção "Para quem é".
  - `hack-classroom-robotica.png` → Área do Professor, banner.
  - `hack-teacher-workshop.png` → Sobre, seção "Quem somos".
  - `hack-mentoria-videochamada.png` → Sobre, seção "Como funciona".
  - `hack-brainstorm-parede.png` → Login, painel lateral.
  - `hack-aluno-home-office.png` → Área do Aluno, banner de boas-vindas.

  Complementam-se fotos CC/PD-licenciadas (Freerange Stock, PxHere, PICRYL, PickPik) — todas distintas entre si — para: capas de Cursos, Professores, Blog, Certificados, Contato e para as tabelas `courses`/`blog_posts` (evitando qualquer repetição de imagem entre páginas HTML e registros de dados).

### ⚠️ Sobre a logo oficial
As imagens fornecidas pelo usuário mostram a marca aplicada em produtos (moletons, notebooks), mas o **arquivo original da logo isolada** (ícone quadrado amarelo + raio preto + wordmark "HACK ACADEMY") não pôde ser baixado nesta sessão — os links de preview compartilhados não são o arquivo original em alta resolução. Por isso, o site usa um lockup provisório com ícone Font Awesome (`fa-bolt`) sobre fundo amarelo (`.logo-icon`) no header, footer, login e certificados. **Se você tiver o arquivo original do logo (PNG/SVG em alta resolução), envie-o novamente como anexo direto (não como link de preview) para substituirmos esse lockup pela arte oficial.**

## 🤖 Guia de IA (novo — interface pronta, backend de RAG/OpenAI ainda não conectado)

Foi criada a estrutura completa para um assistente de IA ("Guia de IA") que responderá dúvidas dos alunos usando **RAG (Retrieval-Augmented Generation)** com base no conteúdo da própria plataforma. **Por segurança, nenhuma chave de API (OpenAI ou qualquer outra) foi ou será armazenada neste site estático** — qualquer JavaScript executado no navegador do visitante pode ser lido/copiado por qualquer pessoa (aba "Inspecionar"/"Network"), entao uma chave exposta no código do site seria roubada e usada por terceiros. Por isso o que foi construído agora é a **interface e a organização da base de conhecimento**, pronta para ser conectada a um backend seguro.

- **`guia-ia.html`** (novo item de menu no header/footer) — página pública de chat com o Guia de IA, com histórico de mensagens, perguntas sugeridas e explicação de como o RAG funciona. Enquanto o backend não é conectado, funciona em **modo de demonstração** (`js/guia-ia.js`), respondendo com orientações genéricas e sugerindo páginas do site.
- **Seção "Guia de IA — Conhecimento e Treinamento"** dentro do `admin.html` (`js/admin-ai.js`), com:
  - **Botão "Importar conteúdo da plataforma"** — traz automaticamente para a base de conhecimento os dados **públicos** já existentes: cursos (`courses`), artigos do blog (`blog_posts`) e banco de questões do Desafio HACK (`quiz_questions`). **Nenhum dado pessoal de aluno/professor** (nomes, e-mails, mensagens de contato, solicitações de cadastro) entra nessa base, respeitando a **LGPD**.
  - **Botão "Adicionar arquivo/conteúdo manualmente"** — formulário para colar texto de PDFs, apostilas, transcrições de vídeo ou banco de questões extras, escolhendo o tipo de fonte.
  - **Botão "Atualizar Conhecimento da IA"** — processa **apenas as fontes novas ou alteradas** desde a última atualização (compara um hash do conteúdo); fontes sem mudança são marcadas como ignoradas, **evitando reprocessamento/gasto de créditos desnecessário** — esse é o mecanismo de atualização **incremental** pedido.
  - **Log de atualizações** (`ai_training_logs`) — registra data/hora, quem disparou, quantas fontes foram adicionadas/ignoradas e um resumo do que foi enviado para a IA em cada execução.

### ⚠️ O que falta para o Guia de IA responder de verdade
O RAG completo (extrair PDFs/vídeos, gerar embeddings reais com a API da OpenAI, buscar os trechos mais relevantes e gerar a resposta) **precisa acontecer em um backend**, nunca no navegador. Há dois caminhos possíveis, e nenhum deles envolve colocar a chave da OpenAI no código do site:

| Opção | Como funciona |
|---|---|
| **A. Backend/proxy próprio** | Uma função serverless (Cloudflare Workers, Vercel, Supabase Edge Functions) recebe as fontes de `ai_knowledge_sources`, gera embeddings com a chave da OpenAI guardada **só no servidor**, guarda em um banco vetorial e expõe um endpoint `/chat` sem expor nada. O site chama esse endpoint via `fetch()`. |
| **B. Plataforma pronta (Dify, Chatbase, Voiceflow, Botpress)** | Você faz upload dos mesmos materiais lá; a plataforma cuida de chunking, embeddings, RAG e botão de retrain nativo, e fornece um widget/iframe para embutir em `guia-ia.html`. |

> 🚨 **Alerta de segurança:** se você já compartilhou uma chave da API da OpenAI em algum lugar (chat, mensagem, etc.), considere-a **comprometida** — acesse o painel da OpenAI (platform.openai.com → API Keys), **revogue essa chave** e gere uma nova, guardando-a apenas dentro do backend escolhido (nunca aqui no projeto do site).

## 🔐 Administração e controle de acesso (novo — Cadastro/Aprovação e Painel do Gestor)

Foi implementado um fluxo real de **solicitação de cadastro + aprovação** para Alunos e Professores, além de um **Painel do Gestor (Admin)** protegido por regra de acesso de servidor (não é mais apenas uma simulação em JavaScript):

- **`cadastro.html`** — página pública onde qualquer visitante escolhe o perfil (**Aluno** ou **Professor**) e envia nome, e-mail, telefone, curso de interesse e mensagem. O envio cria um registro em `registration_requests` com `status: "Pendente"`. Não exige login.
- **`admin.html`** — Painel do Gestor, acessível apenas por e-mails autorizados (ver abaixo). Nele o gestor:
  - Vê estatísticas (pendentes, aprovados, total de administradores) e a lista de solicitações de cadastro, com filtros por status (Pendente/Aprovado/Recusado/Todos).
  - **Aprova ou Recusa** cada solicitação com um clique (grava `status`, `reviewed_by` — e-mail de quem aprovou — e `reviewed_at`).
  - **Adiciona novos administradores** (nome, e-mail, nível: Gestor Master ou Administrador) na tabela `admin_users`.
- **Certificados permanecem 100% automáticos** — por decisão explícita do usuário, a aprovação em cursos/certificados **não** passa por este fluxo de aprovação manual; continua sendo liberada automaticamente pela nota do Desafio HACK (≥70%), como já funcionava.
- **E-mail do usuário agora é salvo no login** — `js/common.js` (`HackAuth.login`) e `js/login.js` foram atualizados para capturar e guardar o e-mail informado no login simulado, usado para identificar quem aprovou/recusou cada solicitação.

### Proteção real do Painel do Gestor (nível de servidor, não JavaScript)
Diferente do "login" simulado do restante do site, o acesso a `admin.html` é controlado por uma **regra de admissão de rotas da hospedagem** (`.meta/access-control.json`), aplicada pelo Dispatcher da plataforma **antes** de qualquer código da página carregar — ou seja, é proteção real, não apenas uma verificação em JavaScript que poderia ser contornada. A regra atual:

- `/admin.html` → modo **allowlist**, liberado apenas para: `cleiton@hackacademy.com.br` (Gestor Master).
- `/tables/admin_users` → mesma allowlist, protegendo também a listagem/cadastro de administradores.
- Todo o restante do site (incluindo `/cadastro.html` e `/tables/registration_requests`, que precisam ficar públicos para o formulário funcionar) permanece com o padrão `public`.

**Como adicionar mais administradores:** cadastrar a pessoa em `admin.html` (aba "Adicionar administrador") registra o nome/e-mail na tabela `admin_users`, mas **não libera o acesso por si só**. É necessário, em seguida, pedir ao assistente IA para adicionar o e-mail da nova pessoa à allowlist de `/admin.html` (e `/tables/admin_users`) e publicar novamente (Publish) — só então o novo administrador conseguirá abrir o painel.

> ⚠️ **Publicação pendente:** as tabelas `registration_requests`/`admin_users`, as páginas `cadastro.html`/`admin.html` e a regra de acesso acima já estão salvas neste projeto, mas **só entram em vigor no site publicado depois de um novo Publish** (aba **Publish**). Até isso ser feito, o site publicado atualmente ainda não tem esse fluxo disponível.

## ⚠️ Autenticação — importante

Este é um site **estático**. O "login" implementado é uma **simulação client-side** (armazenada em `localStorage`, sem senha real, sem backend de autenticação) apenas para demonstrar os fluxos de Área do Aluno e Área do Professor. **Não deve ser usado como controle de acesso real ou seguro.** Qualquer necessidade de autenticação real, sessões seguras ou permissões de acesso a dados exigiria backend e não está no escopo de um site estático.

## 🚧 Funcionalidades ainda não implementadas (roadmap)

**Curto prazo (completar Versão 1):**
- **Publicar (Publish) todas as mudanças pendentes** para que fiquem disponíveis no site ao vivo — tabelas `registration_requests`/`admin_users`/`ai_knowledge_sources`/`ai_training_logs`, páginas `cadastro.html`/`admin.html`/`guia-ia.html` e a regra de acesso já estão prontas, aguardando publicação. **Atenção:** a última tentativa de publicar retornou erro `forbidden: project not owned by current user` — mesmo tipo de problema de permissão de conta/sessão relatado abaixo para o domínio `www`; será necessário resolver isso (relogar na plataforma ou contatar o suporte) antes de conseguir publicar.
- Resolver o erro "Unauthorized - You don't own this project" ao tentar vincular o subdomínio `www.hackacademy.com.br` no painel de Domínio Personalizado (o domínio raiz `hackacademy.com.br` já foi vinculado com sucesso) — provável limitação de permissão de conta, fora do alcance das ferramentas do assistente.
- Conectar o Guia de IA (`guia-ia.html`) a um backend seguro de RAG/OpenAI (proxy serverless próprio ou plataforma pronta como Dify/Chatbase/Voiceflow/Botpress) — a interface de chat, a base de conhecimento e o log de treinamento incremental já estão prontos no painel Admin; falta apenas o motor de embeddings/respostas, que nunca pode rodar com chave de API exposta no site.
- Formulário completo de cadastro de novo curso/aula na Área do Professor.
- Upload de vídeos/PDFs reais nas demais aulas/cursos (hoje apenas a Missão 01 do Explorador HACK SCHOOL® tem PDFs de slides e material complementar publicados; os outros 5 cursos ainda têm conteúdo apenas textual/estruturado).
- Simulados/Desafios HACK para as demais missões e para os cursos de Professores/Gestores (hoje só a Missão 01 do Explorador tem o Desafio HACK embutido na Sala de Aula).
- Progresso/aprovação/certificado hoje ficam salvos apenas no `localStorage` do navegador do aluno (sem sincronizar entre dispositivos) — persistir isso de forma real exigiria uma tabela de progresso no backend.

**Versão 2 (conforme visão estratégica do projeto):**
- Gamificação (pontos, badges, rankings).
- IA integrada à experiência de aprendizagem.
- Fórum e comentários nos cursos e artigos.
- Sistema de avaliações/reviews de cursos.
- Comunidade de aprendizagem.
- Aplicativo mobile.
- Eventos ao vivo, lives e mentorias.
- Autenticação real e persistência de progresso no backend (hoje simulado com dados fixos para demonstração).

## 🔜 Próximos passos recomendados

1. Validar com a equipe HACK BRASIL o catálogo inicial de cursos e ajustar conteúdo pedagógico definitivo.
2. Implementar autenticação real (ex.: backend próprio ou serviço de auth) antes de lançar em produção.
3. Estruturar o fluxo de emissão de certificados em PDF.
4. Conectar a Área do Aluno/Professor a dados reais de progresso (hoje simulados para fins de demonstração).
5. Avaliar a Versão 2 (gamificação, comunidade, IA integrada) após validação da V1 com usuários reais.

## 🌐 Publicação

Para publicar o site e obter uma URL pública, utilize a aba **Publish** do editor — ela cuidará de todo o processo de deploy automaticamente.
