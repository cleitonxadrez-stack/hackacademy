/* ==========================================================================
   HACK ACADEMY — Blog (listagem com filtro por categoria)
   ========================================================================== */

let ALL_POSTS = [];

function formatDate(dateStr) {
  try {
    return new Date(dateStr).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
  } catch (e) {
    return '';
  }
}

function postCardHTML(post) {
  return `
    <a href="post.html?id=${post.id}" class="course-card group rounded-2xl bg-white shadow-sm overflow-hidden flex flex-col fade-in-up">
      <div class="h-44 overflow-hidden">
        <img src="${post.image_url}" alt="${post.title}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300">
      </div>
      <div class="p-6 flex flex-col flex-1">
        <span class="badge badge-dark mb-3 self-start">${post.category}</span>
        <h3 class="font-semibold text-slate-900 mb-2 leading-snug">${post.title}</h3>
        <p class="text-slate-500 text-sm mb-4 line-clamp-3 flex-1">${post.excerpt || ''}</p>
        <div class="flex items-center justify-between text-xs text-slate-400 border-t border-slate-100 pt-4">
          <span><i class="fa-solid fa-user mr-1"></i>${post.author}</span>
          <span>${formatDate(post.published_at)}</span>
        </div>
      </div>
    </a>
  `;
}

function renderPosts(list) {
  const grid = document.getElementById('blog-grid');
  if (!grid) return;
  grid.innerHTML = list.length
    ? list.map(postCardHTML).join('')
    : '<p class="text-slate-500 col-span-full text-center">Nenhum artigo encontrado nesta categoria.</p>';
}

function setupBlogFilters() {
  document.querySelectorAll('#blog-filter-tabs .filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#blog-filter-tabs .filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.getAttribute('data-filter');
      const list = filter === 'Todos' ? ALL_POSTS : ALL_POSTS.filter(p => p.category === filter);
      renderPosts(list);
    });
  });
}

async function loadPosts() {
  try {
    const res = await fetch('tables/blog_posts?limit=100&sort=-published_at');
    const data = await res.json();
    ALL_POSTS = (data.data || []).sort((a, b) => new Date(b.published_at) - new Date(a.published_at));
    renderPosts(ALL_POSTS);
  } catch (err) {
    console.error('Erro ao carregar artigos do blog', err);
    document.getElementById('blog-grid').innerHTML = '<p class="text-slate-500 col-span-full text-center">Não foi possível carregar os artigos agora.</p>';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  setupBlogFilters();
  loadPosts();
});
