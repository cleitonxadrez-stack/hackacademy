/* ==========================================================================
   HACK ACADEMY — Página de detalhe do artigo do blog
   ========================================================================== */

function getPostIdFromUrl() {
  return new URLSearchParams(window.location.search).get('id');
}

function showPostNotFound() {
  document.getElementById('post-loading').classList.add('hidden');
  document.getElementById('post-not-found').classList.remove('hidden');
}

function renderPost(post) {
  document.getElementById('post-loading').classList.add('hidden');
  document.getElementById('post-content').classList.remove('hidden');

  document.title = `${post.title} — HACK ACADEMY`;
  document.getElementById('page-title').textContent = `${post.title} — HACK ACADEMY`;
  document.getElementById('post-image').src = post.image_url;
  document.getElementById('post-image').alt = post.title;
  document.getElementById('post-category').textContent = post.category;
  document.getElementById('post-title').textContent = post.title;
  document.getElementById('post-author').textContent = post.author;
  document.getElementById('post-date').textContent = new Date(post.published_at).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
  document.getElementById('post-body').innerHTML = post.content || '';
}

async function loadPost() {
  const id = getPostIdFromUrl();
  if (!id) return showPostNotFound();
  try {
    const res = await fetch(`tables/blog_posts/${id}`);
    if (!res.ok) return showPostNotFound();
    const post = await res.json();
    renderPost(post);
  } catch (err) {
    console.error('Erro ao carregar artigo', err);
    showPostNotFound();
  }
}

document.addEventListener('DOMContentLoaded', loadPost);
