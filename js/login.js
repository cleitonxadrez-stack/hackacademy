/* ==========================================================================
   HACK ACADEMY — Login simulado (front-end apenas, sem autenticação real)
   ========================================================================== */

let SELECTED_ROLE = 'aluno';

function setupRoleTabs() {
  const tabAluno = document.getElementById('tab-aluno');
  const tabProfessor = document.getElementById('tab-professor');
  if (!tabAluno || !tabProfessor) return;

  tabAluno.addEventListener('click', () => {
    SELECTED_ROLE = 'aluno';
    tabAluno.classList.add('active');
    tabProfessor.classList.remove('active');
  });
  tabProfessor.addEventListener('click', () => {
    SELECTED_ROLE = 'professor';
    tabProfessor.classList.add('active');
    tabAluno.classList.remove('active');
  });
}

function setupLoginForm() {
  const form = document.getElementById('login-form');
  if (!form) return;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('login-name').value.trim();
    const email = document.getElementById('login-email').value.trim();
    if (!name) return;
    HackAuth.login(name, SELECTED_ROLE, email);

    const redirect = new URLSearchParams(window.location.search).get('redirect');
    if (redirect) {
      window.location.href = redirect;
    } else {
      window.location.href = SELECTED_ROLE === 'professor' ? 'professor.html' : 'aluno.html';
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  setupRoleTabs();
  setupLoginForm();
});
