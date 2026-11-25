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
    /* 운영진 명단(admins)에 없는 계정(공용 학회원 계정 등)은 들이지 않는다. 실제 쓰기 권한은 DB 정책이 막는다 */
    const { data: isAdmin, error } = await sb.rpc('is_admin');
    if (error || !isAdmin) {
      /* 확인 요청만 실패했고 이미 대시보드를 쓰는 중이면 그대로 둔다 (토큰 갱신 때 네트워크가 잠깐 끊긴 경우 등) */
      if (error && !dashView.hidden) { console.error('운영진 확인 실패', error); return; }
      dashView.hidden = true;
      loginView.hidden = false;
      if (error) { fail($('#loginError'), '운영진 확인 실패', error); return; }
      await sb.auth.signOut({ scope: 'local' });   /* 이 브라우저만: 공용 계정의 다른 기기 로그인은 그대로 둔다 */
      setError($('#loginError'), '운영진 계정이 아닙니다. 운영진 계정으로 로그인해 주세요.');
      return;
    }
    /* 페이지를 열 때는 로그인 신호가 겹쳐 와서 이 함수가 두세 번 불린다.
       이미 같은 계정으로 대시보드를 보여 주는 중이면 목록·설정을 다시 불러오지 않는다 */
    const shown = !dashView.hidden && $('#userEmail').textContent === session.user.email;
    loginView.hidden = true;
    dashView.hidden = false;
    $('#userEmail').textContent = session.user.email;
    if (shown) return;
    loadNotices();
    loadMaterials();
    loadFaqs();
    loadSettings();
  } else {
    dashView.hidden = true;
    loginView.hidden = false;
  }
}

/* 콜백 안에서 바로 Supabase 를 부르면 인증 잠금이 겹쳐 멈출 수 있어 한 박자 늦춘다.
   탭으로 돌아올 때·토큰을 갱신할 때도 신호가 오는데, 같은 계정으로 대시보드를 쓰는 중이면 다시 그리지 않는다
   (다시 그리면 지원 버튼 설정처럼 쓰던 입력이 지워진다) */
sb.auth.onAuthStateChange((event, session) => {
  if ((event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') && session
      && !$('#dashView').hidden && $('#userEmail').textContent === session.user.email) return;
  setTimeout(refreshAuthUI, 0);
});

/* 미리보기(?preview=1)에서는 DB 에 쓰지 않는다 (같은 브라우저에 운영진 로그인이 남아 있어도) */
function blockPreview(errEl) {
  if (!PREVIEW) return false;
  setError(errEl, '미리보기에서는 저장·삭제되지 않습니다.');
  return true;
}

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
    .order('sort_order', { ascending: false })
    .order('created_at', { ascending: false });
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
  if (blockPreview(noticeError)) return;
  setError(noticeError, '');
  const btn = noticeForm.querySelector('button[type=submit]');
  btn.disabled = true;   /* 두 번 눌러 같은 공지가 두 개 생기지 않게 */
  const id = $('#noticeId').value;
  const payload = {
    tag: $('#noticeTag').value.trim() || null,
    title: $('#noticeTitle').value.trim(),
    pinned: $('#noticePinned').checked,
    body: $('#noticeBody').value
  };

  try {
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
  } finally {
    btn.disabled = false;
  }
});

async function deleteNotice(n) {
  if (blockPreview(noticeError)) return;
  if (!confirm(`"${n.title}" 공지를 삭제할까요?`)) return;
  const { error } = await sb.from('notices').delete().eq('id', n.id);
  if (error) { fail(noticeError, '삭제 실패', error); return; }
  if ($('#noticeId').value === n.id) resetNoticeForm();   /* 고치던 공지를 지웠으면 폼도 비운다 */
  loadNotices();
}

/* ============================================================
   자료실 CRUD
   ============================================================ */
const materialForm = $('#materialForm');
const materialError = $('#materialError');
const LABEL = { project: '정규 프로젝트', competition: '공모전', study: '스터디', edu: '교육자료' };

async function loadMaterials() {
  const list = $('#materialList');
  /* 날짜 없는 자료는 맨 위로 — 날짜 없이 새로 올린 자료가 맨 아래로 가서 저장이 안 된 것처럼 보이지 않게 */
  const { data, error } = await sb.from('materials').select('*')
    .order('mat_date', { ascending: false, nullsFirst: true })
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
  const bits = [m.term, m.domain, m.author, m.mat_date, m.file_name].filter(Boolean);
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
  $('#materialTerm').value = m.term || '';
  $('#materialDomain').value = m.domain || '';
  $('#materialTitle').value = m.title;
  $('#materialDesc').value = m.description || '';
  $('#materialAuthor').value = m.author || '';
  $('#materialProblem').value = m.problem || '';
  $('#materialApproach').value = m.approach || '';
  $('#materialResult').value = m.result || '';
  $('#materialOutputUrl').value = m.output_url || '';
  $('#materialOutputCaption').value = m.output_caption || '';
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
  if (blockPreview(materialError)) return;
  setError(materialError, '');
  const btn = $('#materialSubmit');
  btn.disabled = true;

  /* 폼 값은 업로드를 기다리기 전에 모두 읽어 둔다
     (업로드 중에 다른 자료의 '수정'을 눌러 폼이 바뀌어도 그 내용이 섞여 저장되지 않게) */
  const id = $('#materialId').value;
  const oldUrl = $('#materialFileUrl').value || null;
  const file = $('#materialFile').files[0];
  const tags = $('#materialTags').value
    .split(',').map((t) => t.trim()).filter(Boolean);
  const payload = {
    type: $('#materialType').value,
    term: $('#materialTerm').value.trim() || null,
    domain: $('#materialDomain').value.trim() || null,
    title: $('#materialTitle').value.trim(),
    description: $('#materialDesc').value.trim() || null,
    author: $('#materialAuthor').value.trim() || null,
    problem: $('#materialProblem').value.trim() || null,
    approach: $('#materialApproach').value.trim() || null,
    result: $('#materialResult').value.trim() || null,
    output_url: $('#materialOutputUrl').value.trim() || null,
    output_caption: $('#materialOutputCaption').value.trim() || null,
    mat_date: $('#materialDate').value.replace(/-/g, '.') || null,  /* 2017-09-29 → 2017.09.29 (표기 통일) */
    tags,
    file_url: oldUrl,
    file_name: $('#materialFileName').value || null
  };
  let uploaded = null;   /* 이번에 올린 파일 경로 — 저장에 실패하면 지운다 */

  try {
    /* 새 파일이 선택됐으면 Storage 업로드 */
    if (file) {
      if (file.type !== 'application/pdf' && !/\.pdf$/i.test(file.name)) {
        throw new Error('PDF 파일만 올릴 수 있습니다.');
      }
      /* Storage 는 한글·공백이 든 경로를 거부하므로 저장 이름은 숫자로 하고, 원래 이름은 file_name 에 남긴다 */
      const path = `${Date.now()}.pdf`;
      const { error: upErr } = await sb.storage.from('materials')
        .upload(path, file, { contentType: 'application/pdf' });
      if (upErr) throw upErr;
      uploaded = path;
      payload.file_url = sb.storage.from('materials').getPublicUrl(path).data.publicUrl;
      payload.file_name = file.name;
    }

    let error;
    if (id) {
      ({ error } = await sb.from('materials').update(payload).eq('id', id));
    } else {
      payload.sort_order = await nextSortOrder('materials');
      ({ error } = await sb.from('materials').insert(payload));
    }
    if (error) throw error;

    /* 파일을 바꿨으면 예전 파일은 지운다 (남겨 두면 학회원이 예전 파일을 계속 열 수 있다) */
    const oldPath = uploaded && oldUrl ? storagePathFromUrl(oldUrl) : null;
    uploaded = null;
    if (oldPath) {
      const { error: rmErr } = await sb.storage.from('materials').remove([oldPath]);
      if (rmErr) console.error('예전 파일 삭제 실패', rmErr);
    }
    /* 저장하는 동안 다른 자료를 열었으면 그 폼은 건드리지 않는다 */
    if ($('#materialId').value === id) resetMaterialForm();
    loadMaterials();
  } catch (err) {
    if (uploaded) await sb.storage.from('materials').remove([uploaded]);   /* 저장 실패 → 방금 올린 파일 정리 */
    fail(materialError, '저장 실패', err);
  } finally {
    btn.disabled = false;
  }
});

async function deleteMaterial(m) {
  if (blockPreview(materialError)) return;
  if (!confirm(`"${m.title}" 자료를 삭제할까요?`)) return;
  const { error } = await sb.from('materials').delete().eq('id', m.id);
  if (error) { fail(materialError, '삭제 실패', error); return; }
  if ($('#materialId').value === m.id) resetMaterialForm();   /* 고치던 자료를 지웠으면 폼도 비운다 */
  /* 스토리지 파일은 자료를 지운 뒤에 지운다 (반대 순서면 자료 삭제가 실패했을 때 파일만 사라진다) */
  const path = m.file_url ? storagePathFromUrl(m.file_url) : null;
  if (path) {
    const { error: rmErr } = await sb.storage.from('materials').remove([path]);
    if (rmErr) fail(materialError, '자료는 지웠지만 파일 삭제 실패', rmErr);
  }
  loadMaterials();
}

/* public URL 에서 버킷 내 경로만 추출 (script.js storagePath 와 같은 규칙) */
function storagePathFromUrl(url) {
  const marker = '/materials/';
  const i = url.indexOf(marker);
  if (i === -1) return null;
  const path = url.slice(i + marker.length);
  try { return decodeURIComponent(path); } catch (e) { return path; }
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
  if (blockPreview(faqError)) return;
  setError(faqError, '');
  const btn = faqForm.querySelector('button[type=submit]');
  btn.disabled = true;   /* 두 번 눌러 같은 FAQ 가 두 개 생기지 않게 */
  const id = $('#faqId').value;
  const payload = {
    question: $('#faqQuestion').value.trim(),
    answer: $('#faqAnswer').value.trim()
  };
  try {
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
  } finally {
    btn.disabled = false;
  }
});

async function deleteFaq(f) {
  if (blockPreview(faqError)) return;
  if (!confirm(`"${f.question}" FAQ를 삭제할까요?`)) return;
  const { error } = await sb.from('faqs').delete().eq('id', f.id);
  if (error) { fail(faqError, '삭제 실패', error); return; }
  if ($('#faqId').value === f.id) resetFaqForm();   /* 고치던 FAQ 를 지웠으면 폼도 비운다 */
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


/* ============================================================
   지원 버튼 설정
   ============================================================ */
const settingsForm = $('#settingsForm');
const settingsError = $('#settingsError');
const settingsOk = $('#settingsOk');


function paintApplyPreview() {
  const btn = $('#applyPreview');
  if (!btn) return;
  btn.textContent = $('#applyLabel').value.trim() || '지원하기';
  const live = !!$('#applyUrl').value.trim();
  btn.classList.toggle('btn--primary', live);
  btn.classList.toggle('btn--off', !live);
  btn.disabled = !live;
}

async function loadSettings() {
  if (!settingsForm) return;
  const { data, error } = await sb.from('settings').select('key,value');
  if (error) { setError(settingsError, '설정을 불러오지 못했습니다: ' + error.message); return; }
  const map = Object.fromEntries((data || []).map((r) => [r.key, r.value || '']));
  $('#applyLabel').value = map.apply_label ?? '';
  $('#applyUrl').value = map.apply_url ?? '';
  paintApplyPreview();
}

if (settingsForm) {
  $('#applyLabel').addEventListener('input', paintApplyPreview);
  $('#applyUrl').addEventListener('input', paintApplyPreview);

  settingsForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (blockPreview(settingsError)) return;
    setError(settingsError, '');
    settingsOk.hidden = true;

    const url = $('#applyUrl').value.trim();
    if (url && !/^https?:\/\//i.test(url)) {
      setError(settingsError, '폼 주소는 http:// 또는 https:// 로 시작해야 합니다.');
      return;
    }

    const rows = [
      { key: 'apply_label', value: $('#applyLabel').value.trim() },
      { key: 'apply_url',   value: url }
    ];

    const btn = $('#settingsSubmit');
    btn.disabled = true;
    const { error } = await sb.from('settings').upsert(rows, { onConflict: 'key' });
    btn.disabled = false;

    if (error) { setError(settingsError, '저장 실패: ' + error.message); return; }
    settingsOk.hidden = false;
    setTimeout(() => { settingsOk.hidden = true; }, 2500);
  });
}
