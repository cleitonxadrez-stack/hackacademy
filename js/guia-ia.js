/* ==========================================================================
   HACK ACADEMY — Guia de IA (interface de chat)

   IMPORTANTE: este arquivo NÃO chama a API da OpenAI diretamente e nunca
   deve conter chaves de API — qualquer JavaScript executado no navegador do
   visitante pode ser lido/copiado por qualquer pessoa (aba "Inspecionar").
   Enquanto não houver um backend seguro conectado (proxy serverless ou
   plataforma de chatbot com RAG), este chat funciona em modo de demonstração,
   respondendo com orientações e sugerindo os materiais mais relevantes com
   base no texto digitado.
   ========================================================================== */

const AI_SUGGESTED_QUESTIONS = [
  'O que é o Ecossistema HACK BRASIL?',
  'Como funciona o Desafio HACK da Missão 01?',
  'Quais são os 5 Perfis de Talentos?',
  'Como faço para emitir meu certificado?',
  'Quais habilidades eu desenvolvo no curso Explorador HACK SCHOOL®?'
];

function appendChatMessage(role, html) {
  const container = document.getElementById('chat-messages');
  if (!container) return;
  const isUser = role === 'user';
  const wrapper = document.createElement('div');
  wrapper.className = `flex items-start gap-3 ${isUser ? 'justify-end' : ''}`;
  wrapper.innerHTML = isUser
    ? `<div class="bg-brand-yellow text-black rounded-2xl rounded-tr-sm px-4 py-2.5 text-sm max-w-[80%]">${html}</div>
       <span class="w-9 h-9 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center shrink-0"><i class="fa-solid fa-user"></i></span>`
    : `<span class="w-9 h-9 rounded-full bg-black text-brand-yellow flex items-center justify-center shrink-0"><i class="fa-solid fa-bolt"></i></span>
       <div class="bg-slate-100 text-slate-700 rounded-2xl rounded-tl-sm px-4 py-2.5 text-sm max-w-[80%] leading-relaxed">${html}</div>`;
  container.appendChild(wrapper);
  container.scrollTop = container.scrollHeight;
}

function renderSuggestions() {
  const box = document.getElementById('chat-suggestions');
  if (!box) return;
  box.innerHTML = AI_SUGGESTED_QUESTIONS.map((q) =>
    `<button type="button" class="chat-suggestion-btn text-xs font-medium px-3.5 py-2 rounded-full bg-white border border-slate-200 text-slate-600 hover:border-brand-yellow hover:text-brand-yellow-dark transition-colors">${q}</button>`
  ).join('');
  box.querySelectorAll('.chat-suggestion-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.getElementById('chat-input').value = btn.textContent;
      document.getElementById('chat-form').dispatchEvent(new Event('submit', { cancelable: true }));
    });
  });
}

/** Resposta de demonstração (modo offline) enquanto não há backend de IA conectado. */
function buildDemoAnswer(question) {
  return `Ainda não estou conectado a um backend de IA com a base de conhecimento (RAG), então não posso responder com precisão agora. Sua pergunta foi registrada: <em>"${question}"</em>. Enquanto isso, você pode consultar o <a href="cursos.html" class="text-brand-yellow-dark font-semibold underline">Catálogo de Cursos</a> ou o <a href="blog.html" class="text-brand-yellow-dark font-semibold underline">Blog</a> da HACK ACADEMY. Peça ao time gestor para concluir a conexão do Guia de IA no Painel Administrativo.`;
}

function setupChatForm() {
  const form = document.getElementById('chat-form');
  const input = document.getElementById('chat-input');
  if (!form || !input) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const question = input.value.trim();
    if (!question) return;
    appendChatMessage('user', question);
    input.value = '';

    const sendBtn = document.getElementById('chat-send-btn');
    sendBtn.disabled = true;

    setTimeout(() => {
      appendChatMessage('assistant', buildDemoAnswer(question));
      sendBtn.disabled = false;
      input.focus();
    }, 500);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  appendChatMessage('assistant', 'Olá! Eu sou o Guia de IA da HACK ACADEMY 👋 Em breve estarei conectado à base de conhecimento completa da plataforma (cursos, apostilas, banco de questões) para te ajudar com respostas precisas. Enquanto isso, veja algumas perguntas sugeridas abaixo.');
  renderSuggestions();
  setupChatForm();
});
