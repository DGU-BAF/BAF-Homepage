/* ============================================================
   B.a.f 관리자 페이지 로직
   - window.sb (supabase-config.js) 사용
   ============================================================ */

const sb = window.sb;
const $ = (s) => document.querySelector(s);

/* 미리보기 모드: ?preview=1 이면 로그인 없이 샘플 데이터로 대시보드 표시 (배포엔 영향 없음) */
const PREVIEW = new URLSearchParams(location.search).get('preview') === '1';

/* ---------- 헬퍼 ---------- */
function setError(el, msg) {
  if (!msg) { el.hidden = true; el.textContent = ''; return; }
  el.hidden = false;
  el.textContent = msg;
}
function fail(el, prefix, err) {
  console.error(prefix, err);
  setError(el, `${prefix}: ${err?.message || err}`);
}

/* ---------- 인증 / UI 토글 ---------- */
async function refreshAuthUI() {
  if (PREVIEW) return;
  const { data } = await sb.auth.getSession();
  const session = data.session;
  const loginView = $('#loginView');
  const dashView = $('#dashView');

  if (session) {
    loginView.hidden = true;
    dashView.hidden = false;
    $('#userEmail').textContent = session.user.email;
    loadNotices();
    loadMaterials();
    loadFaqs();
  } else {
    dashView.hidden = true;
    loginView.hidden = false;
  }
}

sb.auth.onAuthStateChange(() => refreshAuthUI());

$('#loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const err = $('#loginError');
  setError(err, '');
  const btn = $('#loginBtn');
  btn.disabled = true;
  const { error } = await sb.auth.signInWithPassword({
    email: $('#loginEmail').value.trim(),
    password: $('#loginPassword').value
  });
  btn.disabled = false;
  if (error) fail(err, '로그인 실패', error);
});

$('#logoutBtn').addEventListener('click', async () => {
  const { error } = await sb.auth.signOut();
  if (error) console.error('로그아웃 실패', error);
});

/* ---------- 탭 전환 ---------- */
document.querySelectorAll('.admin-tab').forEach((tab) => {
  tab.addEventListener('click', () => {
    const name = tab.dataset.tab;
    document.querySelectorAll('.admin-tab').forEach((t) =>
      t.classList.toggle('is-active', t === tab));
    document.querySelectorAll('.tab-panel').forEach((p) => {
      p.hidden = p.id !== `tab-${name}`;
    });
  });
});

/* ============================================================
   공지사항 CRUD
   ============================================================ */
const noticeForm = $('#noticeForm');
const noticeError = $('#noticeError');

async function loadNotices() {
  const list = $('#noticeList');
  const { data, error } = await sb.from('notices').select('*')
    .order('pinned', { ascending: false })
    .order('sort_order', { ascending: false });
  if (error) { fail(noticeError, '공지 불러오기 실패', error); return; }

  $('#noticeCount').textContent = data.length;
  list.textContent = '';
  data.forEach((n) => list.appendChild(noticeRow(n)));
}

function noticeRow(n) {
  const row = document.createElement('div');
  row.className = 'admin-row';

  const main = document.createElement('div');
  main.className = 'admin-row-main';

  const meta = document.createElement('div');
  meta.className = 'admin-row-meta';
  if (n.tag) {
    const tag = document.createElement('span');
    tag.className = 'admin-badge';
    tag.textContent = n.tag;
    meta.appendChild(tag);
  }
  if (n.pinned) {
    const pin = document.createElement('span');
    pin.className = 'admin-badge admin-badge--pin';
    pin.textContent = '고정';
    meta.appendChild(pin);
  }
  const title = document.createElement('span');
  title.className = 'admin-row-title';
  title.textContent = n.title;
  meta.appendChild(title);
  main.appendChild(meta);

  const actions = document.createElement('div');
  actions.className = 'admin-row-actions';
  const edit = document.createElement('button');
  edit.type = 'button';
  edit.className = 'btn btn--ghost btn--sm';
  edit.textContent = '수정';
  edit.addEventListener('click', () => fillNoticeForm(n));
  const del = document.createElement('button');
  del.type = 'button';
  del.className = 'btn btn--ghost btn--sm danger';
  del.textContent = '삭제';
  del.addEventListener('click', () => deleteNotice(n));
  actions.append(edit, del);

  row.append(main, actions);
  return row;
}

function fillNoticeForm(n) {
  $('#noticeId').value = n.id;
  $('#noticeTag').value = n.tag || '';
  $('#noticeTitle').value = n.title;
  $('#noticePinned').checked = !!n.pinned;
  $('#noticeBody').value = n.body;
  $('#noticeFormTitle').textContent = '공지 수정';
  setError(noticeError, '');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function resetNoticeForm() {
  noticeForm.reset();
  $('#noticeId').value = '';
  $('#noticeFormTitle').textContent = '새 공지';
  setError(noticeError, '');
}
$('#noticeReset').addEventListener('click', resetNoticeForm);

noticeForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  setError(noticeError, '');
  const id = $('#noticeId').value;
  const payload = {
    tag: $('#noticeTag').value.trim() || null,
    title: $('#noticeTitle').value.trim(),
    pinned: $('#noticePinned').checked,
    body: $('#noticeBody').value
  };

  let error;
  if (id) {
    ({ error } = await sb.from('notices').update(payload).eq('id', id));
  } else {
    /* 새 항목은 맨 위로 오도록 현재 최대 sort_order + 10 */
    payload.sort_order = await nextSortOrder('notices');
    ({ error } = await sb.from('notices').insert(payload));
  }
  if (error) { fail(noticeError, '저장 실패', error); return; }
  resetNoticeForm();
  loadNotices();
});

async function deleteNotice(n) {
  if (!confirm(`"${n.title}" 공지를 삭제할까요?`)) return;
  const { error } = await sb.from('notices').delete().eq('id', n.id);
  if (error) { fail(noticeError, '삭제 실패', error); return; }
  loadNotices();
}

/* ============================================================
   자료실 CRUD
   ============================================================ */
const materialForm = $('#materialForm');
const materialError = $('#materialError');
const LABEL = { edu: '교육자료', project: '프로젝트' };

async function loadMaterials() {
  const list = $('#materialList');
  const { data, error } = await sb.from('materials').select('*')
    .order('sort_order', { ascending: false });
  if (error) { fail(materialError, '자료 불러오기 실패', error); return; }

  $('#materialCount').textContent = data.length;
  list.textContent = '';
  data.forEach((m) => list.appendChild(materialRow(m)));
}

function materialRow(m) {
  const row = document.createElement('div');
  row.className = 'admin-row';

  const main = document.createElement('div');
  main.className = 'admin-row-main';

  const meta = document.createElement('div');
  meta.className = 'admin-row-meta';
  const type = document.createElement('span');
  type.className = 'admin-badge';
  type.textContent = LABEL[m.type] || m.type;
  meta.appendChild(type);
  const title = document.createElement('span');
  title.className = 'admin-row-title';
  title.textContent = m.title;
  meta.appendChild(title);
  main.appendChild(meta);

  const sub = document.createElement('div');
  sub.className = 'admin-row-sub';
  const bits = [m.author, m.mat_date, m.file_name].filter(Boolean);
  sub.textContent = bits.join(' · ');
  main.appendChild(sub);

  const actions = document.createElement('div');
  actions.className = 'admin-row-actions';
  const edit = document.createElement('button');
  edit.type = 'button';
  edit.className = 'btn btn--ghost btn--sm';
  edit.textContent = '수정';
  edit.addEventListener('click', () => fillMaterialForm(m));
  const del = document.createElement('button');
  del.type = 'button';
  del.className = 'btn btn--ghost btn--sm danger';
  del.textContent = '삭제';
  del.addEventListener('click', () => deleteMaterial(m));
  actions.append(edit, del);

  row.append(main, actions);
  return row;
}

function fillMaterialForm(m) {
  $('#materialId').value = m.id;
  $('#materialType').value = m.type;
  $('#materialTitle').value = m.title;
  $('#materialDesc').value = m.description || '';
  $('#materialAuthor').value = m.author || '';
  $('#materialDate').value = (m.mat_date || '').replace(/\./g, '-');  /* 2017.09.29 → 2017-09-29 (달력 표시용) */
  $('#materialTags').value = (m.tags || []).join(', ');
  $('#materialFileUrl').value = m.file_url || '';
  $('#materialFileName').value = m.file_name || '';
  $('#materialFile').value = '';
  $('#materialFileCurrent').textContent = m.file_name ? `현재 파일: ${m.file_name}` : '';
  $('#materialFormTitle').textContent = '자료 수정';
  setError(materialError, '');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function resetMaterialForm() {
  materialForm.reset();
  $('#materialId').value = '';
  $('#materialFileUrl').value = '';
  $('#materialFileName').value = '';
  $('#materialFileCurrent').textContent = '';
  $('#materialFormTitle').textContent = '새 자료';
  setError(materialError, '');
}
$('#materialReset').addEventListener('click', resetMaterialForm);

materialForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  setError(materialError, '');
  const btn = $('#materialSubmit');
  btn.disabled = true;

  try {
    const id = $('#materialId').value;
    let fileUrl = $('#materialFileUrl').value || null;
    let fileName = $('#materialFileName').value || null;

    /* 새 파일이 선택됐으면 Storage 업로드 */
    const file = $('#materialFile').files[0];
    if (file) {
      const path = `${Date.now()}_${file.name}`;
      const { error: upErr } = await sb.storage.from('materials').upload(path, file);
      if (upErr) throw upErr;
      const { data: pub } = sb.storage.from('materials').getPublicUrl(path);
      fileUrl = pub.publicUrl;
      fileName = file.name;
    }

    const tags = $('#materialTags').value
      .split(',').map((t) => t.trim()).filter(Boolean);

    const payload = {
      type: $('#materialType').value,
      title: $('#materialTitle').value.trim(),
      description: $('#materialDesc').value.trim() || null,
      author: $('#materialAuthor').value.trim() || null,
      mat_date: $('#materialDate').value.replace(/-/g, '.') || null,  /* 2017-09-29 → 2017.09.29 (표기 통일) */
      tags,
      file_url: fileUrl,
      file_name: fileName
    };

    let error;
    if (id) {
      ({ error } = await sb.from('materials').update(payload).eq('id', id));
    } else {
      payload.sort_order = await nextSortOrder('materials');
      ({ error } = await sb.from('materials').insert(payload));
    }
    if (error) throw error;
    resetMaterialForm();
    loadMaterials();
  } catch (err) {
    fail(materialError, '저장 실패', err);
  } finally {
    btn.disabled = false;
  }
});

async function deleteMaterial(m) {
  if (!confirm(`"${m.title}" 자료를 삭제할까요?`)) return;
  /* 스토리지 파일도 함께 제거 */
  if (m.file_url) {
    const path = storagePathFromUrl(m.file_url);
    if (path) {
      const { error: rmErr } = await sb.storage.from('materials').remove([path]);
      if (rmErr) console.error('파일 삭제 실패', rmErr);
    }
  }
  const { error } = await sb.from('materials').delete().eq('id', m.id);
  if (error) { fail(materialError, '삭제 실패', error); return; }
  loadMaterials();
}

/* public URL 에서 버킷 내 경로만 추출 */
function storagePathFromUrl(url) {
  const marker = '/materials/';
  const i = url.indexOf(marker);
  return i === -1 ? null : decodeURIComponent(url.slice(i + marker.length));
}

/* ============================================================
   FAQ CRUD
   ============================================================ */
const faqForm = $('#faqForm');
const faqError = $('#faqError');

async function loadFaqs() {
  const list = $('#faqList');
  if (!list) return;
  const { data, error } = await sb.from('faqs').select('*')
    .order('sort_order', { ascending: false });
  if (error) { fail(faqError, 'FAQ 불러오기 실패', error); return; }

  $('#faqCount').textContent = data.length;
  list.textContent = '';
  data.forEach((f) => list.appendChild(faqRow(f)));
}

function faqRow(f) {
  const row = document.createElement('div');
  row.className = 'admin-row';

  const main = document.createElement('div');
  main.className = 'admin-row-main';
  const title = document.createElement('div');
  title.className = 'admin-row-title';
  title.textContent = f.question;
  const sub = document.createElement('div');
  sub.className = 'admin-row-sub';
  sub.textContent = f.answer;
  main.append(title, sub);

  const actions = document.createElement('div');
  actions.className = 'admin-row-actions';
  const edit = document.createElement('button');
  edit.type = 'button';
  edit.className = 'btn btn--ghost btn--sm';
  edit.textContent = '수정';
  edit.addEventListener('click', () => fillFaqForm(f));
  const del = document.createElement('button');
  del.type = 'button';
  del.className = 'btn btn--ghost btn--sm danger';
  del.textContent = '삭제';
  del.addEventListener('click', () => deleteFaq(f));
  actions.append(edit, del);

  row.append(main, actions);
  return row;
}

function fillFaqForm(f) {
  $('#faqId').value = f.id;
  $('#faqQuestion').value = f.question;
  $('#faqAnswer').value = f.answer;
  $('#faqFormTitle').textContent = 'FAQ 수정';
  setError(faqError, '');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function resetFaqForm() {
  faqForm.reset();
  $('#faqId').value = '';
  $('#faqFormTitle').textContent = '새 FAQ';
  setError(faqError, '');
}
if (faqForm) $('#faqReset').addEventListener('click', resetFaqForm);

if (faqForm) faqForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  setError(faqError, '');
  const id = $('#faqId').value;
  const payload = {
    question: $('#faqQuestion').value.trim(),
    answer: $('#faqAnswer').value.trim()
  };
  let error;
  if (id) {
    ({ error } = await sb.from('faqs').update(payload).eq('id', id));
  } else {
    payload.sort_order = await nextSortOrder('faqs');
    ({ error } = await sb.from('faqs').insert(payload));
  }
  if (error) { fail(faqError, '저장 실패', error); return; }
  resetFaqForm();
  loadFaqs();
});

async function deleteFaq(f) {
  if (!confirm(`"${f.question}" FAQ를 삭제할까요?`)) return;
  const { error } = await sb.from('faqs').delete().eq('id', f.id);
  if (error) { fail(faqError, '삭제 실패', error); return; }
  loadFaqs();
}

/* ---------- 공통: 새 항목 sort_order ---------- */
async function nextSortOrder(table) {
  const { data } = await sb.from(table).select('sort_order')
    .order('sort_order', { ascending: false }).limit(1);
  const max = data && data.length ? (data[0].sort_order || 0) : 0;
  return max + 10;
}

/* ---------- 미리보기 렌더 ---------- */
function renderPreview() {
  $('#loginView').style.display = 'none';
  $('#dashView').style.display = 'block';
  $('#userEmail').textContent = '미리보기 (로그인 안 됨)';

  const notices = [
    { id: 'p1', tag: '필독', title: '비어플 출석 규칙', pinned: true, body: '학회 운영 시간은 매주 토요일 10:00 - 12:00입니다...' },
    { id: 'p2', tag: '25-2학기', title: '비어플 17기 모집 공고', pinned: false, body: '통계학과 빅데이터 학회 비어플의 9대 회장 이선재입니다...' },
    { id: 'p3', tag: '25-2학기', title: 'B.a.f 프로젝트 공지', pinned: false, body: '투표 대상: 16, 17기(15기는 선택적으로 참여)...' },
    { id: 'p4', tag: 'New', title: '수상 내역 수집 공지', pinned: false, body: '2024년도 수상 내역을 수집하고자 합니다...' }
  ];
  const nl = $('#noticeList');
  nl.textContent = '';
  notices.forEach((n) => nl.appendChild(noticeRow(n)));
  $('#noticeCount').textContent = notices.length;

  const materials = [
    { id: 'm1', type: 'edu', title: '크롤링 강의안', author: '13 이동현', mat_date: '2017.09.29', tags: ['Facebook', 'Twitter'], file_name: '크롤링_강의안.pdf', description: '' },
    { id: 'm2', type: 'project', title: '인적자원분석 — 이직여부 예측', author: '김현중, 이정, 박권수, 정아현', mat_date: '2017.11.26', tags: [], file_name: '', description: '' },
    { id: 'm3', type: 'edu', title: '기본적인 Textmining 입문강의안', author: '13 이동현', mat_date: '2017.09.15', tags: ['R', '입문'], file_name: '', description: '' }
  ];
  const ml = $('#materialList');
  ml.textContent = '';
  materials.forEach((m) => ml.appendChild(materialRow(m)));
  $('#materialCount').textContent = materials.length;

  const faqs = [
    { id: 'f1', question: '새로운 기수는 언제 모집하나요?', answer: '신입 기수 모집은 매년 6월과 12월 중순에 진행됩니다. 모집 공고는 통계학과 학년별 단체 채팅방을 통해 안내되니 참고 바랍니다.' },
    { id: 'f2', question: '학년 제한이 있나요?', answer: '비어플 지원은 2학년 1학기까지를 수료하신 후 할 수 있습니다.' },
    { id: 'f3', question: '세션은 어디서 진행되나요?', answer: '세션은 대면으로 진행되며, 과학관 AH 실습실에서 10:00 - 12:00까지 진행합니다.' }
  ];
  const fl = $('#faqList');
  fl.textContent = '';
  faqs.forEach((f) => fl.appendChild(faqRow(f)));
  $('#faqCount').textContent = faqs.length;
}

/* ---------- 시작 ---------- */
if (PREVIEW) renderPreview();
else refreshAuthUI();
