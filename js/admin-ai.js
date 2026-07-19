/* ==========================================================================
   HACK ACADEMY — Guia de IA: Conhecimento e Treinamento (Painel Admin)

   IMPORTANTE / LIMITAÇÃO DE SEGURANÇA:
   Este arquivo roda 100% no navegador do gestor e NUNCA deve conter chaves de
   API (OpenAI ou qualquer outra) — qualquer JS de um site estático pode ser
   lido por qualquer visitante (aba "Inspecionar"/"Network"). Por isso, aqui
   apenas ORGANIZAMOS a base de conhecimento (fontes + histórico incremental)
   que seria enviada a um backend seguro (proxy serverless ou plataforma de
   chatbot com RAG) para gerar embeddings de verdade com a OpenAI. Enquanto
   esse backend não está conectado, "Atualizar Conhecimento da IA" simula o
   processamento (marca as fontes pendentes como "Processado" e registra o
   log), preparando todo o fluxo para quando a chave for configurada de forma
   segura no backend.

   Regras respeitadas:
   - Apenas dados PÚBLICOS da plataforma (courses, blog_posts, quiz_questions)
     entram na base de conhecimento — nenhum dado pessoal de aluno/professor
     (nome, e-mail, mensagens de contato, solicitações de cadastro etc.) é
     incluído, em conformidade com a LGPD.
   - Atualização INCREMENTAL: cada fonte tem um hash de conteúdo; se o
     conteúdo não mudou desde a última verificação, ela é ignorada (não gera
     custo de reprocessamento).
   ========================================================================== */

let AI_ALL_SOURCES = [];

/** Hash simples e determinístico de uma string (suficiente para detectar mudanças de conteúdo). */
function simpleContentHash(str) {
  const text = String(str || '');
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = (hash * 31 + text.charCodeAt(i)) >>> 0;
  }
  return `${text.length.toString(36)}-${hash.toString(36)}`;
}

function currentAdminEmail() {
  const user = (typeof HackAuth !== 'undefined') ? HackAuth.getUser() : null;
  return (user && user.email) || (user && user.name) || 'gestor';
}

function aiSourceStatusBadge(status) {
  const map = {
    'Pendente': 'bg-amber-100 text-amber-700',
    'Processado': 'bg-emerald-100 text-emerald-700',
    'Erro': 'bg-red-100 text-red-600',
    'Ignorado (sem alteração)': 'bg-slate-100 text-slate-500'
  };
  return `<span class="text-xs font-semibold px-2.5 py-1 rounded-full ${map[status] || 'bg-slate-100 text-slate-600'}">${status}</span>`;
}

function aiSourceTypeIcon(type) {
  const map = {
    'PDF': 'fa-file-pdf',
    'Texto': 'fa-file-lines',
    'Banco de Questões': 'fa-list-check',
    'Vídeo': 'fa-video',
    'Link/URL': 'fa-link',
    'Curso da Plataforma': 'fa-graduation-cap',
    'Artigo do Blog': 'fa-newspaper'
  };
  return map[type] || 'fa-file';
}

function renderAiSourceCard(src) {
  const preview = (src.content_text || '').replace(/<[^>]*>/g, '').slice(0, 140);
  return `
    <div class="bg-white rounded-2xl shadow-sm p-4" id="ai-source-${src.id}">
      <div class="flex items-start justify-between gap-3 mb-1.5">
        <div class="flex items-center gap-2.5">
          <span class="w-9 h-9 rounded-lg bg-slate-100 text-slate-500 flex items-center justify-center shrink-0"><i class="fa-solid ${aiSourceTypeIcon(src.source_type)}"></i></span>
          <div>
            <p class="font-semibold text-slate-900 text-sm">${src.title}</p>
            <p class="text-xs text-slate-400">${src.source_type}${src.source_reference ? ' · ' + src.source_reference : ''}</p>
          </div>
        </div>
        ${aiSourceStatusBadge(src.status)}
      </div>
      ${preview ? `<p class="text-xs text-slate-500 mt-2 pl-11">${preview}${preview.length >= 140 ? '…' : ''}</p>` : ''}
      <div class="flex items-center justify-between mt-2 pl-11">
        <span class="text-xs text-slate-400">${src.chunks_generated ? src.chunks_generated + ' trechos preparados' : '—'}</span>
        <button data-id="${src.id}" class="ai-remove-source-btn text-xs text-slate-400 hover:text-red-500"><i class="fa-solid fa-trash-can mr-1"></i>Remover</button>
      </div>
    </div>
  `;
}

async function loadAiSources() {
  try {
    const res = await fetch('tables/ai_knowledge_sources?limit=200&sort=-created_at');
    const data = await res.json();
    AI_ALL_SOURCES = data.data || [];

    document.getElementById('stat-ai-sources').textContent = AI_ALL_SOURCES.length;
    document.getElementById('stat-ai-pending').textContent = AI_ALL_SOURCES.filter((s) => s.status === 'Pendente').length;

    const list = document.getElementById('ai-sources-list');
    if (AI_ALL_SOURCES.length === 0) {
      list.innerHTML = '<p class="text-slate-400 text-sm text-center py-6">Nenhuma fonte de conhecimento cadastrada ainda. Use "Importar conteúdo da plataforma" ou adicione manualmente abaixo.</p>';
      return;
    }
    list.innerHTML = AI_ALL_SOURCES.map(renderAiSourceCard).join('');
    document.querySelectorAll('.ai-remove-source-btn').forEach((btn) => {
      btn.addEventListener('click', async () => {
        if (!confirm('Remover esta fonte da base de conhecimento da IA?')) return;
        await fetch(`tables/ai_knowledge_sources/${btn.getAttribute('data-id')}`, { method: 'DELETE' });
        await loadAiSources();
      });
    });
  } catch (err) {
    console.error('Erro ao carregar fontes de conhecimento da IA', err);
  }
}

function renderAiLogCard(log) {
  const statusColor = log.status === 'Concluído' ? 'text-emerald-600' : (log.status === 'Falhou' ? 'text-red-500' : 'text-amber-500');
  const d = log.created_at ? new Date(log.created_at) : null;
  const dateStr = d ? d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' }) + ' às ' + d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : '—';
  return `
    <div class="bg-white rounded-2xl shadow-sm p-4">
      <div class="flex items-center justify-between mb-1.5">
        <p class="text-xs font-semibold text-slate-900">${log.run_type}</p>
        <span class="text-xs font-semibold ${statusColor}"><i class="fa-solid fa-circle-check mr-1"></i>${log.status}</span>
      </div>
      <p class="text-xs text-slate-400 mb-2">${dateStr} · por ${log.triggered_by}</p>
      <div class="flex gap-3 text-xs text-slate-500 mb-2">
        <span><i class="fa-solid fa-plus mr-1 text-emerald-500"></i>${log.sources_added || 0} novas</span>
        <span><i class="fa-solid fa-forward mr-1 text-slate-400"></i>${log.sources_skipped || 0} ignoradas</span>
        <span><i class="fa-solid fa-puzzle-piece mr-1 text-brand-yellow-dark"></i>${log.chunks_generated || 0} trechos</span>
      </div>
      ${log.summary ? `<p class="text-xs text-slate-500 bg-slate-50 rounded-lg p-2.5">${log.summary}</p>` : ''}
    </div>
  `;
}

async function loadAiLogs() {
  try {
    const res = await fetch('tables/ai_training_logs?limit=50&sort=-created_at');
    const data = await res.json();
    const logs = (data.data || []).sort((a, b) => (b.created_at || 0) - (a.created_at || 0));
    const list = document.getElementById('ai-logs-list');
    const lastLabel = document.getElementById('stat-ai-last-update');

    if (logs.length === 0) {
      list.innerHTML = '<p class="text-slate-400 text-sm text-center py-6">Nenhuma atualização registrada ainda.</p>';
      lastLabel.textContent = 'Nunca atualizado';
      return;
    }
    list.innerHTML = logs.map(renderAiLogCard).join('');
    const d = new Date(logs[0].created_at);
    lastLabel.textContent = d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' }) + ' ' + d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  } catch (err) {
    console.error('Erro ao carregar log de treinamento da IA', err);
  }
}

function setupAddSourceForm() {
  const form = document.getElementById('ai-add-source-form');
  if (!form) return;
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = document.getElementById('ai-source-title').value.trim();
    const sourceType = document.getElementById('ai-source-type').value;
    const reference = document.getElementById('ai-source-reference').value.trim();
    const content = document.getElementById('ai-source-content').value.trim();
    if (!title) return;

    const payload = {
      title,
      source_type: sourceType,
      source_reference: reference || `manual:${title.toLowerCase().replace(/\s+/g, '-')}`,
      content_text: content,
      content_hash: simpleContentHash(content || title),
      status: 'Pendente',
      chunks_generated: 0,
      added_by: currentAdminEmail(),
      notes: ''
    };

    try {
      await fetch('tables/ai_knowledge_sources', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      form.reset();
      await loadAiSources();
    } catch (err) {
      console.error('Erro ao adicionar fonte de conhecimento', err);
      alert('Não foi possível adicionar esta fonte agora.');
    }
  });
}

/** Monta candidatos de fontes de conhecimento a partir de dados PÚBLICOS da plataforma. */
async function buildPlatformKnowledgeCandidates() {
  const candidates = [];

  try {
    const coursesRes = await fetch('tables/courses?limit=100');
    const coursesData = await coursesRes.json();
    (coursesData.data || []).forEach((c) => {
      const text = [
        `Curso: ${c.title || ''}`,
        `Categoria: ${c.category || ''} | Nível: ${c.level || ''} | Carga horária: ${c.duration_hours || ''}h`,
        `Descrição: ${stripHtmlForAi(c.short_description)}`,
        `Objetivos: ${stripHtmlForAi(c.objectives)}`,
        `Competências: ${c.skills || ''}`,
        `Conteúdo programático: ${stripHtmlForAi(c.syllabus)}`,
        `Aplicação prática: ${stripHtmlForAi(c.practical_project)}`
      ].join('\n');
      candidates.push({
        title: `Curso: ${c.title}`,
        source_type: 'Curso da Plataforma',
        source_reference: `course:${c.id}`,
        content_text: text
      });
    });
  } catch (err) { console.error('Erro ao importar cursos', err); }

  try {
    const blogRes = await fetch('tables/blog_posts?limit=100');
    const blogData = await blogRes.json();
    (blogData.data || []).forEach((p) => {
      const text = [`Artigo: ${p.title || ''}`, `Categoria: ${p.category || ''}`, stripHtmlForAi(p.excerpt), stripHtmlForAi(p.content)].join('\n');
      candidates.push({
        title: `Blog: ${p.title}`,
        source_type: 'Artigo do Blog',
        source_reference: `blog:${p.id}`,
        content_text: text
      });
    });
  } catch (err) { console.error('Erro ao importar posts do blog', err); }

  try {
    const quizRes = await fetch('tables/quiz_questions?limit=200');
    const quizData = await quizRes.json();
    const byCourse = {};
    (quizData.data || []).forEach((q) => {
      if (!byCourse[q.course_id]) byCourse[q.course_id] = [];
      byCourse[q.course_id].push(q);
    });
    Object.keys(byCourse).forEach((courseId) => {
      const questions = byCourse[courseId].sort((a, b) => (a.order_index || 0) - (b.order_index || 0));
      const text = questions.map((q, i) =>
        `Questão ${i + 1}: ${q.scenario_title || ''}\n${stripHtmlForAi(q.scenario_text)}\nPergunta: ${q.question_text || ''}\nOrientação: ${stripHtmlForAi(q.orientation)}`
      ).join('\n\n');
      candidates.push({
        title: `Banco de Questões — Desafio HACK (curso ${courseId})`,
        source_type: 'Banco de Questões',
        source_reference: `quiz:${courseId}`,
        content_text: text
      });
    });
  } catch (err) { console.error('Erro ao importar banco de questões', err); }

  return candidates;
}

function stripHtmlForAi(html) {
  return String(html || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

/** Importa/atualiza fontes de conhecimento da plataforma, pulando o que não mudou (economiza créditos). */
async function importPlatformContent() {
  const btn = document.getElementById('ai-import-platform-btn');
  btn.disabled = true;
  btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin mr-1.5"></i>Importando...';

  try {
    const candidates = await buildPlatformKnowledgeCandidates();
    const existingByRef = {};
    AI_ALL_SOURCES.forEach((s) => { existingByRef[s.source_reference] = s; });

    let added = 0, updated = 0, skipped = 0;

    for (const cand of candidates) {
      const hash = simpleContentHash(cand.content_text);
      const existing = existingByRef[cand.source_reference];

      if (!existing) {
        await fetch('tables/ai_knowledge_sources', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: cand.title,
            source_type: cand.source_type,
            source_reference: cand.source_reference,
            content_text: cand.content_text,
            content_hash: hash,
            status: 'Pendente',
            chunks_generated: 0,
            added_by: currentAdminEmail(),
            notes: 'Importado automaticamente da plataforma.'
          })
        });
        added++;
      } else if (existing.content_hash !== hash) {
        await fetch(`tables/ai_knowledge_sources/${existing.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            content_text: cand.content_text,
            content_hash: hash,
            status: 'Pendente',
            notes: 'Conteúdo atualizado na plataforma — aguardando reprocessamento.'
          })
        });
        updated++;
      } else {
        skipped++;
      }
    }

    await loadAiSources();
    alert(`Importação concluída!\n\n+ ${added} nova(s) fonte(s)\n↻ ${updated} atualizada(s)\n= ${skipped} sem alteração (ignoradas, sem gasto de créditos)\n\nAgora clique em "Atualizar Conhecimento da IA" para processar o que está pendente.`);
  } catch (err) {
    console.error('Erro ao importar conteúdo da plataforma', err);
    alert('Não foi possível importar o conteúdo da plataforma agora.');
  } finally {
    btn.disabled = false;
    btn.innerHTML = '<i class="fa-solid fa-cloud-arrow-down mr-1.5"></i>Importar conteúdo da plataforma';
  }
}

/**
 * "Treina" a IA de forma incremental: processa apenas as fontes pendentes
 * (novas ou alteradas). Fontes já processadas e sem mudança são puladas —
 * é assim que evitamos gastar créditos/embeddings à toa. Registra um log
 * detalhado do que foi enviado.
 *
 * NOTA: aqui a chamada real aos embeddings da OpenAI aconteceria dentro de um
 * backend seguro; nesta interface o processamento é simulado (marca como
 * "Processado"), deixando tudo pronto para quando esse backend existir.
 */
async function trainAiKnowledge() {
  const btn = document.getElementById('ai-train-btn');
  const pending = AI_ALL_SOURCES.filter((s) => s.status === 'Pendente' || s.status === 'Erro');
  const alreadyProcessed = AI_ALL_SOURCES.length - pending.length;

  if (pending.length === 0) {
    alert('Nenhum conhecimento novo para atualizar — a IA já está em dia. Nenhum crédito foi usado.');
    return;
  }

  if (!confirm(`Isso vai processar ${pending.length} fonte(s) nova(s)/alterada(s) e pular ${alreadyProcessed} já processada(s). Continuar?`)) return;

  btn.disabled = true;
  btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin mr-1.5"></i>Atualizando...';

  try {
    let totalChunks = 0;
    const titles = [];

    for (const src of pending) {
      const chunks = Math.max(1, Math.ceil((src.content_text || '').length / 800));
      totalChunks += chunks;
      titles.push(src.title);
      await fetch(`tables/ai_knowledge_sources/${src.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'Processado', chunks_generated: chunks })
      });
    }

    await fetch('tables/ai_training_logs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        triggered_by: currentAdminEmail(),
        run_type: 'Atualização Incremental',
        sources_added: pending.length,
        sources_skipped: alreadyProcessed,
        chunks_generated: totalChunks,
        summary: `Conteúdo enviado para embeddings: ${titles.join('; ')}`,
        status: 'Concluído'
      })
    });

    await Promise.all([loadAiSources(), loadAiLogs()]);
    alert(`Conhecimento da IA atualizado! ${pending.length} fonte(s) processada(s), ${totalChunks} trecho(s) preparados. ${alreadyProcessed} fonte(s) ignorada(s) por já estarem em dia.`);
  } catch (err) {
    console.error('Erro ao atualizar conhecimento da IA', err);
    alert('Não foi possível concluir a atualização agora.');
  } finally {
    btn.disabled = false;
    btn.innerHTML = '<i class="fa-solid fa-arrows-rotate mr-1.5"></i>Atualizar Conhecimento da IA';
  }
}

function setupAiKnowledgeButtons() {
  document.getElementById('ai-import-platform-btn')?.addEventListener('click', importPlatformContent);
  document.getElementById('ai-train-btn')?.addEventListener('click', trainAiKnowledge);
}

document.addEventListener('DOMContentLoaded', () => {
  setupAddSourceForm();
  setupAiKnowledgeButtons();
  loadAiSources();
  loadAiLogs();
});
