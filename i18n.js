/* ============================================================
   B.a.f — 다국어 (KOR / ENG)
   - 한국어 원문이 HTML 에 그대로 있고, ENG 일 때만 EN 사전으로 바꿔 끼운다.
   - 사전의 키는 한국어 원문(줄바꿈·연속 공백은 공백 하나로)이다.
     원문을 고치면 키도 같이 고쳐야 하며, 못 찾은 문구는 한국어로 남는다.
   - <요소 data-i18n>              → 요소 안쪽(innerHTML)을 번역
     <요소 data-i18n="키">          → 원문 대신 지정한 키로 번역 (같은 원문을 다르게 옮길 때)
     <요소 data-i18n-attr="alt,…"> → 나열한 속성 값을 번역
   - script.js 가 그리는 문구는 t('한국어') 로 번역한다.
   - 이 파일은 script.js 보다 먼저 로드해야 한다. 바깥에는 window.I18N 만 내보내며,
     이 파일을 못 불러와도 script.js 는 한국어로 동작한다.
   ============================================================ */

(() => {

const LANG = (() => {
  try { return localStorage.getItem('baf-lang') === 'eng' ? 'eng' : 'kor'; }
  catch (e) { return 'kor'; }
})();
const IS_EN = LANG === 'eng';

const EN = {
  /* ---------- 페이지 제목 ---------- */
  '비어플 B.a.f | 동국대학교 빅데이터 학회': 'B.a.f | Big Data Society at Dongguk University',
  '학회소개 | 비어플 B.a.f': 'About | B.a.f',
  '자료실 | 비어플 B.a.f': 'Archive | B.a.f',
  '전체공지 | 비어플 B.a.f': 'Notice | B.a.f',
  '문의하기 | 비어플 B.a.f': 'Contact | B.a.f',

  /* ---------- 네비 · 푸터 (공통) ---------- */
  '본문으로 건너뛰기': 'Skip to content',
  'B.a.f · 동국대학교 빅데이터 분석 학회': 'B.a.f · Big Data Analysis Society at Dongguk University',
  '메뉴 열기': 'Open menu',
  '메뉴 닫기': 'Close menu',
  '주요 메뉴': 'Main menu',
  '언어 선택': 'Select language',
  '학회소개': 'About Us',
  '인사말': 'Welcome Message',
  '임원진': 'Executives',
  '수상 내역': 'Awards',
  '설립 및 연혁': 'Founding & History',
  '주요활동': 'Activities',
  '자료실': 'Archive',
  '전체공지': 'Notice',
  '공지사항': 'Notices',
  '지원 안내': 'Apply',
  '문의하기': 'Contact',
  'B.a.f 로고': 'B.a.f logo',
  '동국대학교 유일의 빅데이터 학회. 데이터에 대한 실제적 접근을 통해 사회가 요구하는 데이터 사이언티스트를 양성합니다.':
    'The only big data society at Dongguk University. Through hands-on work with real data, we develop the data scientists society needs.',
  '바로가기': 'Quick Links',
  '홈': 'Home',
  '서울특별시 중구 필동로1길 30<br>동국대학교 과학관 1층 AH 실':
    'Room AH, 1F Science Hall, Dongguk University<br>30 Pildong-ro 1-gil, Jung-gu, Seoul',

  /* ---------- 홈 ---------- */
  '데이터로': 'With data, we',
  '세상을 읽습니다': 'read the world',
  '패턴을 찾아냅니다': 'uncover patterns',
  '내일을 예측합니다': 'predict tomorrow',
  '동국대학교 유일 빅데이터 학회로서, Data에 대한 실제적인 접근을 통해 <br>사회가 요구하는 데이터 사이언티스트를 양성하고 있습니다.':
    'As the only big data society at Dongguk University, we take a hands-on approach to data to develop the data scientists society needs.',
  '학회 소개 보기': 'Learn About Us',
  '주요 활동': 'What We Do',
  '합격 이후': 'After Acceptance',
  '3 – 6월': 'Mar – Jun',
  '7 – 8월': 'Jul – Aug',
  '9 – 12월': 'Sep – Dec',
  '1 – 2월': 'Jan – Feb',
  '신입 교육': 'Onboarding',
  '상반기 프로젝트': 'Spring Project',
  '공모전': 'Competition',
  '하반기 프로젝트': 'Fall Project',
  '스터디': 'Winter Study',
  '학회원 지원': 'Member Benefits',
  '데이터 분석 실무 경험과 학습 자산을 쌓습니다.': 'Build hands-on analytics experience and learning resources.',
  '기수별 팀 프로젝트': 'Team projects by cohort',
  '대외 공모전 참여': 'External data competitions',
  '교육 자료 · 역대 프로젝트 자료': 'Study materials · past project archives',
  '협업 환경 지원': 'Collaboration tools and workspace',
  '선후배가 이어지는 네트워크를 만들어갑니다.': 'A network that connects current members and alumni.',
  '비어플의 밤': 'B.a.f Night',
  '졸업 기수와의 교류': 'Meetups with alumni',
  '학회원 간 네트워킹': 'Networking among members',
  '진로 탐색부터 취업 준비까지 이어집니다.': 'From exploring careers to landing a job.',
  '취업 특강': 'Career talks',
  '공모전 · 채용박람회 등 대외활동 공지': 'Announcements on competitions, job fairs and more',
  '기업 연계 특별추천 채용': 'Company referral hiring programs',
  '인턴 모집 공고': 'Internship openings',
  'home.awards': 'Our Achievements',
  '역대 수상 내역 전체 보기': 'View All Awards',
  '지원 절차': 'How to Apply',
  '서류 지원 접수': 'Submit Application',
  '매년 6월 · 12월': 'Every June · December',
  '서류 결과 발표': 'Screening Results',
  '면접': 'Interview',
  '최종 결과 발표': 'Final Results',
  '신입 교육 이수': 'Complete Onboarding',

  /* ---------- 학회소개 ---------- */
  '담당교수': 'Faculty Advisor',
  '주용성': 'Yongsung Joo',
  '주용성 담당교수': 'Faculty Advisor Yongsung Joo',
  '비어플에 오신 것을 환영합니다. 비어플은 동국대 유일 빅데이터 학회로, 빅데이터에 관심이 많은 통계학과 학부생들이 모여 데이터를 실제로 다루고 학습하며 교류하는 학회입니다.':
    'Welcome to B.a.f. As the only big data society at Dongguk University, B.a.f brings together undergraduate statistics students who are passionate about big data to work with real data, learn, and grow together.',
  '12인으로 시작하여 지금은 100여 명의 학회원들을 보유하고 있으며, 지속적인 도전으로 빅데이터 분야에서 크고 작은 성과를 이루고 있습니다.':
    'Founded by 12 students, the society now has about 100 members and, through constant challenges, has achieved many results in the field of big data.',
  '빅데이터에 관심이 많다면 비어플의 일원으로 함께 성장하길 추천드립니다.':
    'If you are interested in big data, we encourage you to join B.a.f and grow with us.',
  '학력': 'Education',
  'Cornell 대학교 통계학과 통계학 박사': 'Ph.D. in Statistics, Cornell University',
  'Cornell 대학교 통계학과 통계학 석사': 'M.S. in Statistics, Cornell University',
  '고려대학교 지질학과 지질학 학사': 'B.S. in Geology, Korea University',
  '세부 연구 분야': 'Research Interests',
  '대표 논문': 'Selected Publications',
  '역대 임원진': 'Executive Boards',
  '기수 선택': 'Select a term',
  '역대 수상 내역': 'Award History',
  '연간 일정': 'Annual Schedule',
  '프로젝트 경험이 부족한 신입 기수를 대상으로 기본적인 분석 지식과 스킬을 교육합니다.':
    'New members with little project experience learn the core analytics knowledge and skills.',
  '3월 – 6월': 'Mar – Jun',
  '기수별 팀을 이뤄 실제 데이터로 EDA부터 모델링까지 진행합니다.':
    'Teams formed by cohort take real data from EDA all the way to modeling.',
  '7월 – 8월': 'Jul – Aug',
  '본인이 원하는 대외 공모전에 참여해 프로젝트를 대체합니다.':
    'Members join an external competition of their choice in place of the project.',
  '9월 – 12월': 'Sep – Dec',
  '새 기수와 팀을 구성해 한 학기 프로젝트를 진행합니다.':
    'Teams formed with the new cohort carry out a semester-long project.',
  '1월 – 2월': 'Jan – Feb',
  '심화된 주제를 정해 팀 단위로 스터디합니다.': 'Teams pick an advanced topic and study it together.',
  '프로젝트 기간': 'During Projects',
  '상반기·하반기 프로젝트 세션 기간에 사이드 프로젝트로 병행합니다.':
    'Runs as a side project alongside the spring and fall project sessions.',
  '그 외 활동': 'Other Activities',
  '졸업하신 선배님들의 취업 후기와 취업 정보를 공유받는 특강입니다.':
    'Alumni share their job-hunting experiences and career insights.',
  '비어플의 가장 큰 행사로, 여러 직무에 대한 선배님들의 취업 특강이 진행됩니다. 특강 이후 회식에서 졸업기수와 학회원이 자유롭게 질문과 조언을 나눕니다.':
    'Our biggest event of the year, featuring career talks from alumni across many roles. Afterwards, alumni and members freely exchange questions and advice over dinner.',
  '한마디 준비 중입니다.': 'Message coming soon.',

  /* 임원 직책 */
  '회장': 'President',
  '부회장': 'Vice President',
  '총무': 'Treasurer',
  '인사부장': 'Head of HR',
  '교육부장': 'Head of Education',
  '홍보부장': 'Head of PR',

  /* 임원진 한마디 */
  '데이터는 혼자 공부할 수 있지만, 프로젝트는 혼자 못 합니다. 서로의 부족한 부분을 채워가며 끝까지 완성해내는 비어플을 만들겠습니다.':
    'You can study data on your own, but you can’t do a project alone. I’ll build a B.a.f where we fill in each other’s gaps and see every project through to the end.',
  '결측치는 줄이고, 인사이트는 더하면서 함께 성장하는 학회를 만들어가겠습니다.':
    'Fewer missing values, more insights — I’ll help build a society where we all grow together.',
  '결과만큼이나 함께하는 과정도 즐거울 수 있도록 노력하겠습니다.':
    'I’ll work to make the journey we share as rewarding as the results.',
  '비어플의 다양한 활동과 이야기를 많은 사람들에게 전할 수 있도록 노력하겠습니다.':
    'I’ll work to share B.a.f’s activities and stories with as many people as possible.',
  '학회원 모두가 함께 성장하고, 많은 것을 배워갈 수 있는 비어플이 되도록 노력하겠습니다.':
    'I’ll work to make B.a.f a place where every member grows together and learns a lot.',
  '모두 함께 성장할 수 있도록 최선을 다하겠습니다.':
    'I’ll do my best so that we can all grow together.',

  /* 수상 · 연혁 */
  '제 16회 SAS 분석 챔피언십 대상': '16th SAS Analytics Championship — Grand Prize',
  '제 17회 SAS 분석 챔피언십 대상': '17th SAS Analytics Championship — Grand Prize',
  '제 17회 SAS 분석 챔피언십 금상': '17th SAS Analytics Championship — Gold Prize',
  '2020년 빅콘테스트 최우수상': '2020 Big Contest — Top Excellence Award',
  '2020년 Samsung Card Data Competition 2위': '2020 Samsung Card Data Competition — 2nd Place',
  'kt 통신망 안정성 확보 AI 해커톤 최우수상': 'KT Network Stability AI Hackathon — Top Excellence Award',
  'AI Hub 인공지능 학습용 데이터 활용 공모전 입상': 'AI Hub Training Data Utilization Contest — Award Winner',
  '2021 스마트농업 인공지능 경진대회 우수상': '2021 Smart Farming AI Competition — Excellence Award',
  '상추 생육환경 생성 AI 공모전 2위': 'Lettuce Growth Environment Generative AI Contest — 2nd Place',
  '제주도 교통량 예측 공모전 3위': 'Jeju Traffic Volume Prediction Contest — 3rd Place',
  '2021 민원 데이터분석 경진대회 장려상': '2021 Civil Complaint Data Analysis Competition — Honorable Mention',
  '2021 민원 데이터 분석 경진대회 장려상': '2021 Civil Complaint Data Analysis Competition — Honorable Mention',
  '2023 미래에셋증권 x 네이버클라우드 빅데이터 페스티벌 최우수상':
    '2023 Mirae Asset Securities × NAVER Cloud Big Data Festival — Top Excellence Award',
  '날씨 빅데이터 콘테스트 입선': 'Weather Big Data Contest — Selected Entry',
  'KSDC DB 양적자료 활용대회 최우수상': 'KSDC DB Quantitative Data Utilization Contest — Top Excellence Award',
  '휴대용 피부진단 데이터를 활용한 피부정밀진단 예측 AI 경진대회 최우수상':
    'AI Competition on Precision Skin Diagnosis with Portable Device Data — Top Excellence Award',
  '통계 데이터 분석활용 대회 보고서부문 장려상': 'Statistical Data Analysis Contest, Report Division — Honorable Mention',
  '제5회 서울교육 데이터 활용 아이디어 공모전 장려상': '5th Seoul Education Data Idea Contest — Honorable Mention',
  '제18회 이과대학 재학생 연구프로젝트 경진대회 최우수상':
    '18th College of Natural Science Student Research Competition — Top Excellence Award',
  '동국대 X 네이버 부스트코스 데이터사이언스 2기 우수상':
    'Dongguk Univ. × NAVER boostcourse Data Science, 2nd Cohort — Excellence Award',
  '동국대 x 네이버 부스트코스 데이터사이언스 2기 우수상':
    'Dongguk Univ. × NAVER boostcourse Data Science, 2nd Cohort — Excellence Award',
  '2024 NH투자증권 빅데이터 경진대회 대상': '2024 NH Investment & Securities Big Data Competition — Grand Prize',
  '2024 관세청 공공데이터 활용·분석 경진대회 최우수상':
    '2024 Korea Customs Service Public Data Analysis Competition — Top Excellence Award',
  '제 12회 빅콘테스트 데이터활용부문-부동산 최우수상':
    '12th Big Contest, Data Utilization Division (Real Estate) — Top Excellence Award',
  '2024 NH투자증권 빅데이터 경진대회 입선': '2024 NH Investment & Securities Big Data Competition — Selected Entry',
  '제19회 이과대학 재학생 연구프로젝트 경진대회 최우수상':
    '19th College of Natural Science Student Research Competition — Top Excellence Award',
  '한국문화관광연구원 관광데이터 분석 공모전 대상':
    'Korea Culture & Tourism Institute Tourism Data Analysis Contest — Grand Prize',
  '한국토지주택공사 국토도시 아이디어 공모전 최우수상':
    'Korea Land & Housing Corporation (LH) Land and Urban Idea Contest — Top Excellence Award',
  '제23회 통계청 논문공모전 장려상': '23rd Statistics Korea Paper Contest — Honorable Mention',
  '운수종사자 인지적 특성 데이터를 활용한 교통사고 위험 예측 AI 경진대회 대상':
    'AI Competition on Traffic Accident Risk Prediction with Driver Cognitive Data — Grand Prize',
  '스마트 해운물류 x AI 미션 챌린지 대상': 'Smart Maritime Logistics × AI Mission Challenge — Grand Prize',
  '2025 날씨 빅데이터 콘테스트 최우수상': '2025 Weather Big Data Contest — Top Excellence Award',
  '2025 대한디지털헬스학회 춘계학술대회 우수상':
    '2025 Korean Society of Digital Health Spring Conference — Excellence Award',
  '서울시 빅데이터 활용 경진대회 시각화부문 최우수상':
    'Seoul Big Data Competition, Visualization Division — Top Excellence Award',
  '제21회 이과대학 재학생 연구프로젝트 경진대회 대상':
    '21st College of Natural Science Student Research Competition — Grand Prize',
  '제 1회 비어플의 밤': '1st B.a.f Night',
  '제 2회 비어플의 밤': '2nd B.a.f Night',
  '제 3회 비어플의 밤': '3rd B.a.f Night',
  '제 4회 비어플의 밤': '4th B.a.f Night',
  '비어플 창립 — 동국대학교 통계학과 학부생 12인':
    'B.a.f founded by 12 undergraduates in the Department of Statistics, Dongguk University',

  /* ---------- 자료실 ---------- */
  'archive.title': 'Resources & Projects',
  'B.a.f의 <strong>교육자료</strong>와 <strong>프로젝트 결과물</strong>을 기록하고 축적합니다.<br> 역대 교육자료와 프로젝트를 확인할 수 있습니다.':
    'We record and build up B.a.f’s <strong>study materials</strong> and <strong>project outputs</strong>.<br> Materials are written in Korean.',
  '전체': 'All',
  '교육자료': 'Study Materials',
  '프로젝트': 'Projects',
  '자료 받기': 'Download',
  '해당 분류의 자료가 없습니다.': 'No materials in this category.',

  /* ---------- 전체공지 ---------- */
  'notice.title': 'News & Notices',
  '공지 검색': 'Search notices',
  '공지 페이지': 'Notice pages',
  '검색 결과가 없습니다.': 'No results found.',
  '자주 묻는 질문': 'Frequently Asked Questions',
  '원하시는 답변이 없다면 <a href="contact.html" style="color:var(--blue);text-decoration:underline">1:1 문의하기</a>를 이용해 보세요.':
    'Notices and FAQs are written in Korean. Can’t find what you need? <a href="contact.html" style="color:var(--blue);text-decoration:underline">Contact us</a> directly.',

  /* ---------- 문의하기 ---------- */
  'contact.title': 'Get in Touch',
  '연락 및 오시는 길': 'Contact & Directions',
  '찾아오시는 곳': 'Location',
  '서울특별시 중구 필동로1길 30<br>동국대학교 과학관 1층 AH실':
    'Room AH, 1F Science Hall, Dongguk University<br>30 Pildong-ro 1-gil, Jung-gu, Seoul',
  '문의': 'Inquiries',
  '이메일 <a href="mailto:dgstatbaf@gmail.com">dgstatbaf@gmail.com</a><br> 인스타그램 DM <a href="https://www.instagram.com/bafdgu/" target="_blank" rel="noopener">@bafdgu</a>':
    'Email <a href="mailto:dgstatbaf@gmail.com">dgstatbaf@gmail.com</a><br> Instagram DM <a href="https://www.instagram.com/bafdgu/" target="_blank" rel="noopener">@bafdgu</a>',
  '비어플 위치 — 동국대학교 과학관': 'B.a.f location — Science Hall, Dongguk University',
  'https://www.google.com/maps?q=%EB%8F%99%EA%B5%AD%EB%8C%80%ED%95%99%EA%B5%90%20%EA%B3%BC%ED%95%99%EA%B4%80&hl=ko&z=16&output=embed':
    'https://www.google.com/maps?q=%EB%8F%99%EA%B5%AD%EB%8C%80%ED%95%99%EA%B5%90%20%EA%B3%BC%ED%95%99%EA%B4%80&hl=en&z=16&output=embed'
};

const i18nKey = (s) => String(s).replace(/\s+/g, ' ').trim();

/* ENG 이고 사전에 있으면 영어, 아니면 원문 그대로 */
function t(ko) {
  if (!IS_EN) return ko;
  const v = EN[i18nKey(ko)];
  return v === undefined ? ko : v;
}

function applyI18n() {
  if (!IS_EN) return;
  /* <head> 의 스니펫이 숨겨둔 본문은 번역을 마친 뒤 다시 보인다 */
  try { applyAll(); } finally { document.documentElement.classList.remove('i18n-wait'); }
}

function applyAll() {
  document.documentElement.lang = 'en';
  document.title = t(document.title);

  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const v = EN[el.dataset.i18n || i18nKey(el.innerHTML)];
    if (v !== undefined) el.innerHTML = v;
  });
  document.querySelectorAll('[data-i18n-attr]').forEach((el) => {
    el.dataset.i18nAttr.split(',').forEach((name) => {
      const attr = name.trim();
      if (el.hasAttribute(attr)) el.setAttribute(attr, t(el.getAttribute(attr)));
    });
  });
}

window.I18N = { lang: LANG, isEn: IS_EN, t };

/* 문서 끝에서 로드되므로 이 시점엔 본문이 다 파싱돼 있다. 최대한 일찍 바꿔 깜빡임을 줄인다. */
applyI18n();

})();
