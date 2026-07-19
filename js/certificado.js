/* ==========================================================================
   HACK ACADEMY — Certificado Digital (gerado 100% programaticamente em PDF)
   Estratégia: em vez de capturar HTML/CSS (o que causava layouts
   desconfigurados), o certificado é DESENHADO diretamente no PDF com jsPDF
   (texto, linhas, formas vetoriais). A pré-visualização em tela é o próprio
   PDF gerado, exibido em um <iframe>, garantindo fidelidade total entre tela
   e download.

   Página 1 (frente): informações do curso/aluno + assinatura digital do CEO
   (imagem) centralizada + selo de aprovação em formato de raio, na lateral.
   Página 2 (verso): conteúdo programático + habilidades desenvolvidas
   (puxadas do curso), sem ícones.
   ========================================================================== */

const CERT_MESES = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
  'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];

function formatCertDateExtenso(timestamp) {
  const d = timestamp ? new Date(timestamp) : new Date();
  return `${d.getDate()} de ${CERT_MESES[d.getMonth()]} de ${d.getFullYear()}`;
}

/** Remove emojis/pictogramas do texto, mantendo letras (com acentos), números e pontuação padrão. */
function stripEmojis(text) {
  return (text || '')
    .replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{2190}-\u{21FF}\u{2B00}-\u{2BFF}]/gu, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Extrai os itens de uma lista rich_text (<li>...</li>) como array de strings simples, sem emojis. */
function extractSyllabusItems(syllabusHTML) {
  if (!syllabusHTML) return [];
  const temp = document.createElement('div');
  temp.innerHTML = syllabusHTML;
  const items = Array.from(temp.querySelectorAll('li')).map((li) => stripEmojis(li.textContent)).filter(Boolean);
  if (items.length > 0) return items;
  const plain = stripEmojis(temp.textContent);
  return plain ? [plain] : [];
}

/** Extrai as habilidades desenvolvidas do curso (campo texto separado por vírgula), sem ícones. */
function extractSkillsItems(skillsText) {
  if (!skillsText) return [];
  return String(skillsText)
    .split(',')
    .map((s) => stripEmojis(s))
    .filter(Boolean);
}

/** Gera o QR Code de validação como dataURL PNG (para inserir direto no PDF). */
function generateCertQrDataUrl(code) {
  return new Promise((resolve) => {
    if (!window.QRCode) return resolve(null);
    QRCode.toDataURL(
      `https://hackacademy.com.br/validar/${code}`,
      { width: 240, margin: 1, color: { dark: '#101010', light: '#FFFFFF' } },
      (err, url) => resolve(err ? null : url)
    );
  });
}

/** Pré-carrega a imagem da assinatura digital do CEO (uma única vez, reaproveitada em todos os certificados). */
let CERT_SIGNATURE_IMG = null;
let CERT_SIGNATURE_IMG_PROMISE = null;
function loadCertSignatureImage() {
  if (CERT_SIGNATURE_IMG_PROMISE) return CERT_SIGNATURE_IMG_PROMISE;
  CERT_SIGNATURE_IMG_PROMISE = new Promise((resolve) => {
    const img = new Image();
    img.onload = () => { CERT_SIGNATURE_IMG = img; resolve(img); };
    img.onerror = () => resolve(null);
    img.src = 'images/assinatura-cleiton-marino-santana.jpg';
  });
  return CERT_SIGNATURE_IMG_PROMISE;
}

/* ---------- Desenho da moldura (preta + amarela), igual nas duas páginas ---------- */
function drawCertFrame(pdf, w, h) {
  pdf.setFillColor(16, 16, 16);
  pdf.rect(0, 0, w, h, 'F');
  pdf.setFillColor(255, 255, 255);
  pdf.rect(5, 5, w - 10, h - 10, 'F');
  pdf.setDrawColor(255, 200, 0);
  pdf.setLineWidth(1.1);
  pdf.rect(8.5, 8.5, w - 17, h - 17);
}

/* ---------- Cabeçalho comum (logotipo textual + coluna direita) ---------- */
function drawCertHeader(pdf, marginX, w, rightLabel, rightValue, rightSub) {
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(17);
  pdf.setTextColor(16, 16, 16);
  pdf.text('HACK ACADEMY', marginX, 23);

  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(8.5);
  pdf.setTextColor(120, 130, 145);
  pdf.text('Formação em inovação educacional', marginX, 29);

  pdf.setFontSize(8.5);
  pdf.setTextColor(150, 160, 175);
  pdf.text(rightLabel, w - marginX, 19, { align: 'right' });
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(11);
  pdf.setTextColor(55, 65, 80);
  pdf.text(rightValue, w - marginX, 25, { align: 'right' });
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(8.5);
  pdf.setTextColor(150, 160, 175);
  pdf.text(rightSub, w - marginX, 30, { align: 'right' });

  pdf.setDrawColor(230, 232, 238);
  pdf.setLineWidth(0.25);
  pdf.line(marginX, 35, w - marginX, 35);
}

/* ---------- Selo de aprovação em formato de raio, posicionado na lateral do certificado ---------- */
function drawApprovalBolt(pdf, cx, cy, scale) {
  const r = 15 * scale;

  // círculo preto com contorno amarelo
  pdf.setFillColor(16, 16, 16);
  pdf.circle(cx, cy, r, 'F');
  pdf.setDrawColor(255, 200, 0);
  pdf.setLineWidth(0.9);
  pdf.circle(cx, cy, r);

  // raio (relâmpago) amarelo, desenhado vetorialmente dentro do círculo
  const boxW = 10 * scale;
  const boxH = 16 * scale;
  const originX = cx - boxW / 2;
  const originY = cy - boxH / 2;
  const localPts = [
    [6.2, 0], [2.0, 8.5], [4.5, 8.5], [3.0, 16], [8.5, 6.5], [5.5, 6.5], [7.0, 0]
  ].map(([x, y]) => [originX + (x / 10) * boxW, originY + (y / 16) * boxH]);

  const segments = [];
  for (let i = 1; i < localPts.length; i++) {
    segments.push([localPts[i][0] - localPts[i - 1][0], localPts[i][1] - localPts[i - 1][1]]);
  }
  pdf.setFillColor(255, 200, 0);
  pdf.lines(segments, localPts[0][0], localPts[0][1], [1, 1], 'F', true);

  // texto "APROVADO" abaixo do selo
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(8);
  pdf.setTextColor(16, 16, 16);
  pdf.text('APROVADO', cx, cy + r + 6, { align: 'center' });
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(6.5);
  pdf.setTextColor(150, 160, 175);
  pdf.text('HACK ACADEMY', cx, cy + r + 10.5, { align: 'center' });
}

/* ---------- PÁGINA 1 — FRENTE (informações do curso/aluno) ---------- */
function drawCertFrontPage(pdf, course, user, code, dateStr, qrDataUrl, signatureImg, w, h) {
  const marginX = 24;
  drawCertHeader(pdf, marginX, w, 'Certificado Nº', code, `Emitido em ${dateStr}`);

  // Selo de aprovação em formato de raio, na lateral direita do certificado
  drawApprovalBolt(pdf, w - marginX - 22, 76, 0.85);

  // Selo "Certificado de Conclusão"
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(9.5);
  const badgeText = 'CERTIFICADO DE CONCLUSÃO';
  const badgeWidth = pdf.getTextWidth(badgeText) + 16;
  pdf.setFillColor(255, 200, 0);
  pdf.roundedRect(w / 2 - badgeWidth / 2, 44, badgeWidth, 9, 4.5, 4.5, 'F');
  pdf.setTextColor(16, 16, 16);
  pdf.text(badgeText, w / 2, 50, { align: 'center' });

  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(11);
  pdf.setTextColor(110, 120, 135);
  pdf.text('A HACK Academy certifica com orgulho que', w / 2, 65, { align: 'center' });

  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(25);
  pdf.setTextColor(16, 16, 16);
  pdf.text(stripEmojis(user.name) || 'Aluno(a)', w / 2, 79, { align: 'center' });

  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(11);
  pdf.setTextColor(110, 120, 135);
  pdf.text('concluiu, com aproveitamento satisfatório, o curso de', w / 2, 88, { align: 'center' });

  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(16);
  pdf.setTextColor(224, 168, 0);
  const courseTitleClean = stripEmojis(course.title).replace(/®/g, '');
  pdf.text(courseTitleClean, w / 2, 98, { align: 'center' });

  // Info: Carga horária | Nível | Categoria
  const infoY = 116;
  const col1X = w / 2 - 72, col2X = w / 2, col3X = w / 2 + 72;
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(8);
  pdf.setTextColor(150, 160, 175);
  pdf.text('CARGA HORÁRIA', col1X, infoY, { align: 'center' });
  pdf.text('NÍVEL', col2X, infoY, { align: 'center' });
  pdf.text('CATEGORIA', col3X, infoY, { align: 'center' });

  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(12.5);
  pdf.setTextColor(16, 16, 16);
  pdf.text(`${course.duration_hours}h`, col1X, infoY + 8, { align: 'center' });
  pdf.text(stripEmojis(course.level), col2X, infoY + 8, { align: 'center' });
  pdf.text(stripEmojis(course.category), col3X, infoY + 8, { align: 'center' });

  // divisória
  pdf.setDrawColor(230, 232, 238);
  pdf.setLineWidth(0.25);
  pdf.line(marginX, h - 44, w - marginX, h - 44);

  // Assinatura digital, centralizada
  const sigLineY = h - 35;
  const sigLineHalfWidth = 27;

  if (signatureImg) {
    const maxW = 34, maxH = 13;
    let sw = maxW;
    let sh = sw * (signatureImg.naturalHeight / signatureImg.naturalWidth);
    if (sh > maxH) {
      sh = maxH;
      sw = sh * (signatureImg.naturalWidth / signatureImg.naturalHeight);
    }
    const sx = w / 2 - sw / 2;
    const sy = sigLineY - 2 - sh;
    pdf.addImage(signatureImg, 'JPEG', sx, sy, sw, sh);
  }

  pdf.setDrawColor(16, 16, 16);
  pdf.setLineWidth(0.3);
  pdf.line(w / 2 - sigLineHalfWidth, sigLineY, w / 2 + sigLineHalfWidth, sigLineY);

  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(11);
  pdf.setTextColor(16, 16, 16);
  pdf.text('Cleiton Marino Santana', w / 2, sigLineY + 5, { align: 'center' });
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(8.5);
  pdf.setTextColor(150, 160, 175);
  pdf.text('CEO - HACK Academy', w / 2, sigLineY + 9.5, { align: 'center' });

  // QR Code de validação, à direita
  if (qrDataUrl) {
    const qrSize = 22;
    const qrX = w - marginX - qrSize;
    const qrY = h - 33 - qrSize / 2;
    pdf.addImage(qrDataUrl, 'PNG', qrX, qrY, qrSize, qrSize);
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(6.5);
    pdf.setTextColor(150, 160, 175);
    pdf.text('Código de validação', qrX + qrSize / 2, qrY - 2, { align: 'center' });
  }
}

/* ---------- PÁGINA 2 — VERSO (conteúdo programático + habilidades desenvolvidas, sem ícones) ---------- */
function drawCertBackPage(pdf, course, code, w, h) {
  const marginX = 24;
  drawCertHeader(pdf, marginX, w, 'Referente ao certificado', code, 'Verso - Página 2');

  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(15);
  pdf.setTextColor(16, 16, 16);
  pdf.text('CONTEÚDO PROGRAMÁTICO', w / 2, 47, { align: 'center' });

  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(10);
  pdf.setTextColor(110, 120, 135);
  const courseTitleClean = stripEmojis(course.title).replace(/®/g, '');
  pdf.text(`Referente ao curso ${courseTitleClean}`, w / 2, 55, { align: 'center' });
  pdf.setFontSize(8.5);
  pdf.setTextColor(150, 160, 175);
  pdf.text(`${course.duration_hours}h  .  ${stripEmojis(course.level)}  .  ${stripEmojis(course.category)}`, w / 2, 61, { align: 'center' });

  pdf.setDrawColor(230, 232, 238);
  pdf.setLineWidth(0.25);
  pdf.line(marginX, 67, w - marginX, 67);

  // Lista numerada em 2 colunas (sem ícones)
  const items = extractSyllabusItems(course.syllabus);
  const contentTop = 76;
  const contentBottom = h - 68;
  const gutter = 12;
  const colWidth = (w - marginX * 2 - gutter) / 2;
  const col1X = marginX, col2X = marginX + colWidth + gutter;
  const textOffsetX = 8.5;
  const maxTextWidth = colWidth - textOffsetX;
  const lineHeight = 4.1;
  const rowGap = 3;

  let colYPositions = [contentTop, contentTop];

  if (items.length === 0) {
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(9.5);
    pdf.setTextColor(150, 160, 175);
    pdf.text('Conteúdo programático detalhado disponível na página do curso.', w / 2, contentTop, { align: 'center' });
  } else {
    items.forEach((text, i) => {
      const colIndex = i % 2;
      const x = colIndex === 0 ? col1X : col2X;
      let y = colYPositions[colIndex];

      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(8.5);
      const lines = pdf.splitTextToSize(text, maxTextWidth);
      const blockHeight = Math.max(lines.length * lineHeight, 5.6);

      if (y + blockHeight > contentBottom) {
        y = contentTop;
      }

      // número (quadradinho preto + número amarelo)
      pdf.setFillColor(16, 16, 16);
      pdf.roundedRect(x, y - 3.4, 5.6, 5.6, 1, 1, 'F');
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(6.2);
      pdf.setTextColor(255, 200, 0);
      pdf.text(String(i + 1).padStart(2, '0'), x + 2.8, y + 0.6, { align: 'center' });

      // texto
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(8.5);
      pdf.setTextColor(70, 82, 100);
      pdf.text(lines, x + textOffsetX, y);

      colYPositions[colIndex] = y + blockHeight + rowGap;
    });
  }

  // Habilidades desenvolvidas, puxadas do curso (sem ícones)
  const skills = extractSkillsItems(course.skills);
  const skillsDividerY = contentBottom + 6;
  pdf.setDrawColor(230, 232, 238);
  pdf.setLineWidth(0.25);
  pdf.line(marginX, skillsDividerY, w - marginX, skillsDividerY);

  const skillsTitleY = skillsDividerY + 9;
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(11.5);
  pdf.setTextColor(16, 16, 16);
  pdf.text('HABILIDADES DESENVOLVIDAS', w / 2, skillsTitleY, { align: 'center' });

  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(9);
  pdf.setTextColor(70, 82, 100);
  const skillsText = skills.length > 0
    ? skills.join('   •   ')
    : 'Competências práticas aplicadas ao longo da formação, alinhadas ao Ecossistema HACK BRASIL.';
  const skillsLines = pdf.splitTextToSize(skillsText, w - marginX * 2 - 16);
  pdf.text(skillsLines, w / 2, skillsTitleY + 6.5, { align: 'center' });

  pdf.setDrawColor(230, 232, 238);
  pdf.setLineWidth(0.25);
  pdf.line(marginX, h - 20, w - marginX, h - 20);
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(7.5);
  pdf.setTextColor(150, 160, 175);
  pdf.text(`Este certificado é parte integrante da formação ${courseTitleClean} do Ecossistema HACK BRASIL.`, w / 2, h - 15, { align: 'center' });
}

/**
 * Monta o documento jsPDF completo (2 páginas: frente + verso), desenhado
 * inteiramente com comandos vetoriais — sem captura de HTML/CSS.
 * @param {Object} course  registro da tabela courses
 * @param {Object} user    { name, role } de HackAuth.getUser()
 * @param {Object} progress objeto retornado por HackProgress.get(course.id)
 */
async function buildCertificateDoc(course, user, progress) {
  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
  const w = pdf.internal.pageSize.getWidth();
  const h = pdf.internal.pageSize.getHeight();

  const code = progress.certificateCode || generateCertificateCode(course.id, (user.name || '').toLowerCase());
  const dateStr = formatCertDateExtenso(progress.approvedAt);
  const [qrDataUrl, signatureImg] = await Promise.all([
    generateCertQrDataUrl(code),
    loadCertSignatureImage()
  ]);

  drawCertFrame(pdf, w, h);
  drawCertFrontPage(pdf, course, user, code, dateStr, qrDataUrl, signatureImg, w, h);

  pdf.addPage('a4', 'landscape');
  drawCertFrame(pdf, w, h);
  drawCertBackPage(pdf, course, code, w, h);

  return { pdf, code };
}

/**
 * Monta o card do certificado (cabeçalho + botão de download + área de
 * pré-visualização, que será preenchida por mountCertificatePreview).
 */
function renderCertificateCard(course, user, progress) {
  const code = progress.certificateCode || generateCertificateCode(course.id, (user.name || '').toLowerCase());
  return `
    <div class="bg-white rounded-2xl shadow-sm p-5 sm:p-6" id="certificate-card-${course.id}">
      <div class="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div>
          <h3 class="font-semibold text-slate-900">${course.title}</h3>
          <p class="text-xs text-slate-500 mt-0.5"><i class="fa-solid fa-shield-halved mr-1"></i>Código de validação: ${code}</p>
        </div>
        <button data-course-id="${course.id}" data-course-title="${course.title}" class="download-cert-btn btn-accent px-5 py-2.5 rounded-lg text-sm font-semibold whitespace-nowrap">
          <i class="fa-solid fa-download mr-1.5"></i>Baixar Certificado (PDF)
        </button>
      </div>
      <div id="cert-preview-${course.id}" class="cert-preview-wrap">
        <p class="text-slate-400 text-sm text-center py-16"><i class="fa-solid fa-spinner fa-spin mr-2"></i>Gerando certificado...</p>
      </div>
    </div>
  `;
}

/**
 * Gera o PDF do certificado e o exibe embutido (iframe) dentro do card —
 * a pré-visualização é exatamente o arquivo que será baixado.
 */
async function mountCertificatePreview(course, user, progress) {
  const container = document.getElementById(`cert-preview-${course.id}`);
  if (!container) return;
  try {
    const { pdf } = await buildCertificateDoc(course, user, progress);
    const blobUrl = pdf.output('bloburl');
    container.innerHTML = `<iframe src="${blobUrl}" class="cert-pdf-preview" title="Pré-visualização do certificado — ${course.title}"></iframe>`;
  } catch (err) {
    console.error('Erro ao gerar pré-visualização do certificado', err);
    container.innerHTML = '<p class="text-red-500 text-sm text-center py-10">Não foi possível gerar a pré-visualização do certificado.</p>';
  }
}

/** Liga o botão de download do certificado à geração real do PDF (2 páginas, desenhado vetorialmente). */
function bindCertificateDownloadButtons() {
  document.querySelectorAll('.download-cert-btn').forEach((btn) => {
    if (btn.dataset.bound) return;
    btn.dataset.bound = 'true';
    btn.addEventListener('click', async () => {
      const courseId = btn.getAttribute('data-course-id');
      const user = HackAuth.getUser();
      if (!user) return;
      const progress = HackProgress.get(courseId);

      const originalHTML = btn.innerHTML;
      btn.disabled = true;
      btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin mr-1.5"></i>Gerando PDF...';

      try {
        const res = await fetch(`tables/courses/${courseId}`);
        const course = await res.json();
        const { pdf, code } = await buildCertificateDoc(course, user, progress);
        const fileSafeName = (course.title || 'curso').replace(/[^a-zA-Z0-9]+/g, '_');
        pdf.save(`Certificado_HACK_ACADEMY_${fileSafeName}_${code}.pdf`);
      } catch (err) {
        console.error('Erro ao gerar PDF do certificado', err);
        alert('Ocorreu um erro ao gerar o PDF do certificado. Tente novamente.');
      } finally {
        btn.disabled = false;
        btn.innerHTML = originalHTML;
      }
    });
  });
}
