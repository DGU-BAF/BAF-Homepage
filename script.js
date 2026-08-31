/* ============================================================
   B.a.f — 공통 스크립트
   외부 의존성 없음 (Vanilla JS)
   ============================================================ */

/* ------------------------------------------------------------
   DATA — 내용 수정은 이 블록만 고치면 됩니다.
   ------------------------------------------------------------ */

/* 지원 안내
   — 구글 폼이 준비되면 url 을 채우고 open 을 true 로 바꾸면 버튼이 폼으로 연결됩니다. */
const APPLY = {
  open: false,
  url: '',
  message: '현재 지원 기간이 아닙니다.'
};

/* 역대 임원진 (about.html #members) */
const EXECUTIVES = [
  { gen: 1,  years: '2017',      members: [
    { role: '회장', name: '김현중' }, { role: '총무', name: '오현지' },
    { role: '인사부장', name: '김준섭' }, { role: '교육부장', name: '양준혁' },
    { role: '홍보부장', name: '정아현' } ] },
  { gen: 2,  years: '2018',      members: [
    { role: '회장', name: '이동현' }, { role: '부회장', name: '윤현석' },
    { role: '부회장', name: '송주원' }, { role: '총무', name: '윤훈식' },
    { role: '인사부장', name: '유예은' } ] },
  { gen: 3,  years: '2019',      members: [
    { role: '회장', name: '양준혁' }, { role: '부회장', name: '황인욱' },
    { role: '총무', name: '양원직' }, { role: '인사부장', name: '박수진' },
    { role: '홍보부장', name: '김희수' } ] },
  { gen: 4,  years: '2020',      members: [
    { role: '회장', name: '박태렬' }, { role: '부회장', name: '김영석' } ] },
  { gen: 5,  years: '2020',      members: [
    { role: '회장', name: '김태현' }, { role: '부회장', name: '유혜림' },
    { role: '총무', name: '주현정' }, { role: '홍보부장', name: '김나형' },
    { role: '인사부장', name: '이채원' } ] },
  { gen: 6,  years: '2021',      members: [
    { role: '회장', name: '김이안' }, { role: '부회장', name: '신보람' },
    { role: '총무', name: '정유정' }, { role: '인사부장', name: '안수빈' } ] },
  { gen: 7,  years: '2022',      members: [
    { role: '회장', name: '조지환' }, { role: '부회장', name: '이승준' },
    { role: '총무', name: '김평진' }, { role: '인사부장', name: '정성훈' } ] },
  { gen: 8,  years: '2023',      members: [
    { role: '회장', name: '문성원' }, { role: '부회장', name: '이예슬' },
    { role: '총무', name: '이가린' }, { role: '홍보부장', name: '김동완' },
    { role: '교육부장', name: '류수민' }, { role: '교육부장', name: '조유솔' } ] },
  { gen: 9,  years: '2024',      members: [
    { role: '회장', name: '이선재' }, { role: '부회장', name: '양윤규' },
    { role: '총무', name: '김승원' }, { role: '홍보부장', name: '김민지' },
    { role: '교육부장', name: '성지수' } ] },
  { gen: 10, years: '2025', members: [
    { role: '회장',     name: '한지은', photo: 'assets/exec-president.jpg' },
    { role: '부회장',   name: '안재혁', photo: 'assets/exec-vice.jpg' },
    { role: '총무',     name: '육심호', photo: 'assets/exec-treasurer.jpg' },
    { role: '홍보부장', name: '신원철', photo: 'assets/exec-pr.jpg' },
    { role: '교육부장', name: '유영우', photo: 'assets/exec-edu.jpg' } ] },
  /* 사진과 한마디는 받는 대로 photo / quote 에 채우면 인사말 카드에 바로 반영됩니다. */
  { gen: 11, years: '2026', current: true, members: [
    { role: '회장',     name: '전동현', photo: '',
      quote: '데이터는 혼자 공부할 수 있지만, 프로젝트는 혼자 못 합니다. 서로의 부족한 부분을 채워가며 끝까지 완성해내는 비어플을 만들겠습니다.' },
    { role: '부회장',   name: '유민서', photo: '', quote: '' },
    { role: '총무',     name: '박현준', photo: 'assets/exec11-treasurer.jpg',
      quote: '결과만큼이나 함께하는 과정도 즐거울 수 있도록 노력하겠습니다.' },
    { role: '홍보부장', name: '김규빈', photo: 'assets/exec11-pr.jpg',
      quote: '비어플의 다양한 활동과 이야기를 많은 사람들에게 전할 수 있도록 노력하겠습니다.' },
    { role: '교육부장', name: '강지호', photo: '',
      quote: '학회원 모두가 함께 성장하고, 많은 것을 배워갈 수 있는 비어플이 되도록 노력하겠습니다.' },
    { role: '교육부장', name: '김태형', photo: 'assets/exec11-edu2.jpg',
      quote: '모두 함께 성장할 수 있도록 최선을 다하겠습니다.' } ] }
];

/* 자료실 (archive.html) */
const MATERIALS = [
  { type: 'edu', title: '크롤링 강의안',
    desc: '페이스북, 트위터에서 토큰을 부여받아 크롤링하는 방법부터 웹데이터 페이지 소스 활용까지 다룹니다.',
    author: '13 이동현', date: '2017.09.29', tags: ['Facebook', 'Twitter', '웹데이터'] },
  { type: 'edu', title: 'Textmining 문자열 정제 추가강의안',
    desc: 'R을 활용한 텍스트마이닝 문자열 정제 심화 내용을 다룹니다.',
    author: '13 이동현', date: '2017.09.29', tags: ['R', 'Textmining', '전처리'] },
  { type: 'edu', title: '기본적인 Textmining 입문강의안',
    desc: 'R 프로그램으로 시작하는 텍스트마이닝 입문 강의안입니다.',
    author: '13 이동현', date: '2017.09.15', tags: ['R', 'Textmining', '입문'] },
  { type: 'project', title: '인적자원분석 — 이직여부 예측',
    desc: 'EDA를 바탕으로 이직 가능성에 영향을 주는 요인을 분석하고 예측 모형을 구축했습니다.',
    author: '김현중, 이정, 박권수, 정아현', date: '2017.11.26',
    tags: ['EDA', '로지스틱 회귀분석', '랜덤 포레스트'] },
  { type: 'project', title: 'League of Legends 승패예측 및 연관성분석',
    desc: '경기 로그 텍스트를 마이닝해 승패에 기여하는 변수와 아이템 간 연관 규칙을 도출했습니다.',
    author: '이동현, 김준섭, 양준혁, 양동찬', date: '2017.11.26',
    tags: ['텍스트마이닝', '로지스틱 회귀분석', '연관성분석'] },
  { type: 'project', title: '유방암세포 진단결과 예측모형 구축',
    desc: '세포 형태 지표를 활용해 양성·악성을 분류하는 진단 예측모형을 설계했습니다.',
    author: '오현지, 황인욱, 황다연, 윤인선', date: '2017.11.26',
    tags: ['EDA', '로지스틱 회귀분석', '의사결정나무'] }
];

/* 전체공지 (notice.html) */
const NOTICES = [
  {
    tag: "필독",
    title: "비어플 출석 규칙",
    pinned: true,
    body:
      "학회 운영 시간은 매주 토요일 10:00 - 12:00입니다.\n\n10시 30분까지는 지각 처리, 그 이후는 결석으로 처리됩니다. (지각 시 벌금 3000원, 결석 시 벌금 10000원)\n\n허용되는 불참 사유 이외의 3번 결석 시 '삼진아웃'으로 비어플 퇴출이 진행됩니다. (허용되는 불참 사유 : 인턴, 자격증, 국가고시, 유고결석 사유)\n\n프리패스 기회를 1번 쓸 수 있습니다. 프리패스 기회란 유고결석 사유에 해당되지 않는 개인적인 사유일 때, 아무 조건 없이 사용할 수 있는 결석 면제권입니다. 사용하기 위해서는 해당 세션 3일 전까지 네이버 카페에 글을 등록해주세요."
  },
  {
    tag: "25-2학기",
    title: "B.a.f 프로젝트 공지",
    body:
      "투표 대상: 16, 17기(15기는 선택적으로 참여)\n\n투표 기한: 2024/08/29(금) 23:59\n\n투표 방법: 해당 글이 카카오톡 공지로 등록되면 댓글에 1지망과 2지망의 도메인을 작성해주시면 됩니다.\n\nex. 1지망-마케팅, 2지망-기타(의료)\n\n📌도메인:\n\n1. 금융 - 은행 채무불이행 예측, 카드거래 이상탐지 등\n\n2. 사회 - 자전거도로 입지선정, 지하철 유동인구 분석 등\n\n3. 마케팅 - 고객 세분화, 상품 추천 등\n\n4. 스포츠 - 프로야구 / e-스포츠 승률 예측 등\n\n5. 기타(의료, 환경, 공정"
  },
  {
    tag: "25-2학기",
    title: "비어플 17기 모집 공고",
    body:
      "안녕하세요. 통계학과 빅데이터 학회 '비어플(B.a.f)'의 9대 회장 이선재입니다☺️\n\n🔥앞으로 다가올 2025년 2학기부터 비어플의 일원으로서 열심히 활동하실 17기 학회원을 모집하려고 합니다!🔥\n\n비어플은 동국대 유일의 빅데이터 학회로, 순수한 학문적 열망을 가진 통계학과 학생들이 자발적으로 모여 설립한 학회입니다. 저희 학회의 정기 세션은 매주 토요일 오전 10시~12시이고, 주요 활동으로는 다음과 같이 <신입교육 세션>, <프로젝트>, <특강>, <비어플의 밤>이 있습니다.\n\n✔️신입교육 세션(여름/겨울방학)\n\n프로젝트 경험이 부족한 신입 기수를 대상으로, 기본적인 프로젝트 지식과 스킬을 학습하는 세션\n\n✔️프로젝트\n\n학기 프로젝트: 1학기(3월), 2학기(9월)에 도메인별로 팀을 꾸려 데이터 수집과 주제선정부터 인사이트 도출까지 전 과정을 직접 설계하는 팀 프로젝트\n\n공모전(여름방학): 학회원끼리 팀을 꾸려 데이터 분석 관련 공모전에 참가\n\n스터디(겨울방학): 심화적인 통계 이론 및 기술을 팀원들과 함께 공부해보는 활동\n\n✔️특강\n\n졸업하신 선배님들을 초청하여 취업 후기, 현직 관련 정보 등을 공유받을 수 있는 멘토링 강연\n\n✔️비어플의 밤\n\n비어플의 연례 행사로, 졸업하신 선배님들의 취업 특강과 더불어 회식을 통해 학회원들과 졸업 기수들의 대화의 장을 마련하는 시간\n\n비어플에 대해 더 자세한 정보를 얻고 싶다면, 홈페이지와 인스타를 참고해주시기 바랍니다!\n\n📌홈페이지: https://www.dgubaf.com/\n\n📌인스타: https://www.instagram.com/bafdgu/\n\n지원서는 dgstatbaf@gmail.com으로, \"이름_비어플_17기_지원서\" 로 제출해주시면 됩니다. 제출 기한은 6/22(일) 23:59 까지 입니다. 모집 일정은 다음과 같습니다.\n\n- 서류 합격자 발표 : 6/24(화) 개별 합/불 문자 전송\n\n- 대면 면접 : 6/30(월) 10분 내외 간단한 면접\n\n- 최종합격자 발표 : 7/1(화) 개별 합/불 문자 전송\n\n- 신입교육세션 오리엔테이션 : 7/5(토) 10:00 (선발된 신입 기수분들은 ❗️필수로 참여❗️해 주셔야 합니다.)\n\n* 선발 기준은 최소 2학기 재학한 통계학과 학생 중 '데이터 분석에 대한 관심 및 열정', 그리고 '문제 해결 능력'을 가진 모든 분들입니다. 활동 기간은 기본 3학기이나, 최소 2학기 이상 중단 없이 활동 가능한 인원 중입니다. (직전학기 지원자는 가산점을 받습니다)\n\n* 기타 문의사항은 회장 이선재, 부회장 양윤규에게로 연락 바랍니다."
  },
  {
    tag: "New",
    title: "수상 내역 수집 공지",
    body:
      "안녕하세요. 모든 학회원분들께 말씀드립니다. 저희 비어플은 회원님들의 업적을 기리고, 소속 회원들의 도전 의욕을 불태우기 위해 2024년도 수상 내역을 수집하고자 합니다. 아직 수상 경험이 없으신 분들도 향후 대회에서 입상하시게 되면, 저희에게 알려주시면 감사하겠습니다. 수집된 수상 내역은 비어플 홈페이지와 향후 개설될 카페에도 올라갈 예정입니다.\n\n아래는 수집에 대한 세부 사항입니다.\n\n* 대상: 비어플의 모든 기수\n\n* 제출 방법: https://forms.gle/V3dLgHmGFpxmcExn7 \n\n* 제출 기한 : 12/31(화) 23:59\n\n* 제출 내용: 수상자, 수상 대회(예: SAS 분석 챔피언십 등), 수상 종류(예: 대상, 최우수상 등), 수상 관련 사진 또는 기록(선택), 수상에 사용된 자료(선택)\n\n수집된 정보는 비어플 홍보 및 회원들의 도전 의지 고취에 활용될 예정입니다. 많은 참여 부탁드립니다. 감사합니다.🙇\n\n* 수상자의 경우 비어플 학회원이 한 명이라도 포함되면 됩니다. 홈페이지에 올라가다 보니 다른 수상자분들의 동의하에 제공해주시면 감사하겠습니다.\n\n* 세부적인 사항은 링크에 자세히 적혀있으니 확인해주시면 감사하겠습니다.\n\n* 추가적인 문의 사항은 임원진에게 연락 바랍니다."
  },
  {
    tag: "25-1학기",
    title: "비어플 16기 모집 공고",
    body:
      "안녕하세요. 통계학과 빅데이터 학회 '비어플(B.a.f)'의 9대 회장 이선재입니다☺️\n\n🔥앞으로 다가올 2025년 1학기부터 비어플의 일원으로서 열심히 활동하실 16기 학회원을 모집하려고 합니다!🔥\n\n비어플은 동국대 유일의 빅데이터 학회로, 순수한 학문적 열망을 가진 통계학과 학생들이 자발적으로 모여 설립한 학회입니다. 저희 학회의 정기 세션은 매주 토요일 오전 10시~12시이고, 주요 활동으로는 다음과 같이 <세션>, <프로젝트>, <특강>, <비어플의 밤>이 있습니다.\n\n✔️세션\n\n- 신입교육 세션: 프로젝트 경험이 부족한 신입 기수를 대상으로, 기본적인 프로젝트 지식과 스킬을 학습하는 세션\n\n- 피드백 세션: 프로젝트, 공모전, 스터디가 끝난 후, 부족한 부분을 보충하는 세션\n\n✔️프로젝트\n\n- 학기 프로젝트: 1학기(3월), 2학기(9월)에 특정 분석 주제를 가지고 데이터 분석을 해보는 팀 프로젝트\n\n- 공모전: 학회원이 참가를 희망하는 공모전이 개최될 시, 팀을 꾸려 대회에 참가\n\n- 스터디: 심화적인 통계 이론 및 기술을 팀원들과 함께 공부해보는 활동\n\n✔️특강\n\n- 졸업하신 선배님들을 초청하여 취업 후기, 현직 관련 정보 등을 공유받을 수 있는 멘토링 강연\n\n✔️비어플의 밤\n\n- 비어플의 연례 행사로, 졸업하신 선배님들의 취업 특강과 더불어 회식을 통해 학회원들과 졸업 기수들의 대화의 장을 마련하는 시간\n\n비어플에 대해 더 자세한 정보를 얻고 싶다면, 홈페이지와 인스타를 참고해주시기 바랍니다!\n\n📌홈페이지: https://www.dgubaf.com/\n\n📌인스타: https://www.instagram.com/bafdgu/\n\n지원서는 dgstatbaf@gmail.com으로, \"이름_비어플_16기_지원서\" 로 제출해주시면 됩니다. 제출 기한은 12/16(월) 23:59 까지 입니다. 서류 심사이며, 선발자는 12/23(월)에 개별 공지 예정입니다. 많은 관심과 지원 바랍니다!🤗\n\n선발 기준은 최소 2학기 재학한 통계학과 학생 중 '데이터 분석에 대한 관심 및 열정', 그리고 '문제 해결 능력'을 가진 모든 분들입니다. 활동 기간은 기본 3학기이나, 최소 2학기 이상 중단 없이 활동 가능한 인원 중입니다. (직전학기 지원자는 가산점을 받습니다)\n\n신입 OT는 01/11(토) 16:00입니다. 선발된 신입 기수분들은 ❗️필수로 참여❗️해 주셔야 합니다.\n\n** 기타 문의사항은 회장 이선재, 부회장 양윤규에게로 연락 바랍니다."
  },
  {
    tag: "24-2학기",
    title: "B.a.f 프로젝트 공지",
    body:
      "이번 프로젝트에서는 24-1학기 프로젝트와 마찬가지로, 학회원들의 보다 자유롭고 창의적인 진행을 위해 데이터 및 주제는 제공되지 않습니다. 세부 주제는 조원 확정 후 정하시면 됩니다. 이번 주 금요일 팀 확정 공지가 있을 예정입니다.\n\n투표 대상: 14, 15기(13기는 선택적으로 참여)\n\n투표 기한: 2024/09/04(수) 23:59\n\n투표 방법: 해당 글이 공지로 등록되면 댓글에 1지망과 2지망의 도메인을 작성해주시면 됩니다.\n\nex. 1지망-마케팅, 2지망-기타(환경)\n\n📌도메인:\n\n1. 금융 - 은행 채무불이행 예측, 카드거래 이상탐지 등 \n\n2. 사회 - 자전거도로 입지선정, 지하철 유동인구 분석 등 \n\n3. 마케팅 - 고객 세분화, 상품 추천 등\n\n4. 스포츠  - 프로야구 / e-스포츠  승률 예측 등 \n\n5. 기타(의료, 환경, 공정 등) - 위의 도메인이 아닌 경우\n\n* 원활한 조원 배치를 위해 도메인별 인원 제한이 있을 예정입니다. 특정 도메인에 인원이 많을 시 선착순으로 조원이 배정될 수 있습니다."
  },
  {
    tag: "24-1학기",
    title: "B.a.f 프로젝트 공지",
    body:
      "이번 프로젝트에서는 학회원들의 보다 자유롭고 창의적인 진행을 위해 데이터는 제공되지 않습니다. 세부 주제는 조원 확정 후 정하면 됩니다.\n\n투표 대상: 13, 14기(12기는 선택적으로 참여)\n\n투표 기한: 2024/03/03(일) 23:59:59 \n\n투표 방법: 해당 글이 공지로 등록되면 댓글에 1지망과 2지망의 주제를 작성해주시면 됩니다.\n\n📌주제:\n\n1. 게임 - 다양한 게임 데이터\n\n2. 금융 - 주식, 카드 소비, 보험 등 금융 데이터\n\n3. 의료 - 질병, 생존, 의약품 등 의료 데이터\n\n4. 쇼핑 - 상품 구매 등  쇼핑 데이터\n\n5. 환경 - 에너지, 기상 예측, 환경 오염 등 환경 데이터\n\n6. 사회 - 행복주택 입지선정, 지하철 등 사회 데이터\n\n7. 기타 - 위의 주제들이 아닌 데이터\n\n*  원활한 조원 배치를 위해 도메인별 인원 제한이 있을 예정입니다. 특정 도메인에 인원이 많을 시 선착순으로 조원이 배정될 수 있습니다."
  },
  {
    tag: "23-2학기",
    title: "❄️ 겨울방학 스터디 공지",
    body:
      "여러분 얼마 안 남은 2023년 연말 잘 보내시고 계신가요? 모두들 새해 복 많이 받으시길 바랍니다!!🙇\n\n이번주부터 겨울방학 스터디를 진행하려고 합니다.\n\n다음 노션 링크를 통해, 본인이 원하는 주제란에 '이름'과 '선택한 이유'를 적어주시면 됩니다. 최종 팀은 1/3(수)에 공지됩니다. \n\n📌노션 링크: https://www.notion.so/baf-dongguk/2023-021065c5853543b28d011b5aeeead04d?pvs=4  \n\n📌대상: 활동기수 (신입기수 14기 제외)\n\n📌마감 기한: 1/3(수) 오후 6시까지 \n\n각 팀별로 임원진이 한 명씩 배정되고, 팀 내에서 세부 주제와 커리큘럼을 직접 설정할 예정입니다. 자세한 사항은 1/6(토)에 안내드리겠습니다. \n\n* 각 주제의 투표 수에 따라 팀 구성은 바뀔 수 있습니다.\n\n** 궁금한 점이나 문의사항 있으신 분들은 임원진들에게 연락주시길 바랍니다."
  },
  {
    tag: "New",
    title: "비어플 14기 모집 공고",
    body:
      "안녕하세요. 통계학과 빅데이터 학회 '비어플(B.a.f)'의 8대 회장 문성원입니다☺️\n\n🔥앞으로 다가올 2024년부터 비어플의 일원으로서 열심히 활동하실 14기 학회원을 모집하려고 합니다!🔥\n\n 비어플은 동국대 유일의 빅데이터 학회로, 순수한 학문적 열망을 가진 통계학과 학생들이 자발적으로 모여 설립한 학회입니다. 저희 학회의 정기 세션은 매주 토요일 오전 10시~12시이고, 주요 활동으로는 다음과 같이 <세션>, <프로젝트>, <특강>, <비어플의 밤>이 있습니다.\n\n✔️세션\n\n- 신입교육 세션: 프로젝트 경험이 부족한 신입 기수를 대상으로, 기본적인 프로젝트 지식과 스킬을 학습하는 세션\n\n- 피드백 세션: 프로젝트, 공모전, 스터디가 끝난 후, 부족한 부분을 보충하는 세션\n\n✔️프로젝트\n\n- 학기 프로젝트: 1학기(3월), 2학기(9월)에 특정 분석 주제를 가지고 데이터 분석을 해보는 팀 프로젝트\n\n- 공모전: 학회원이 참가를 희망하는 공모전이 개최될 시, 팀을 꾸려 대회에 참가\n\n- 스터디: 심화적인 통계 이론 및 기술을 팀원들과 함께 공부해보는 활동\n\n✔️특강\n\n- 졸업하신 선배님들을 초청하여 취업 후기, 현직 관련 정보 등을 공유받을 수 있는 멘토링 강연\n\n✔️비어플의 밤\n\n- 비어플의 연례 행사로, 졸업하신 선배님들의 취업 특강과 더불어 회식을 통해 학회원들과 졸업 기수들의 대화의 장을 마련하는 시간\n\n 비어플에 대해 더 자세한 정보를 얻고 싶다면, 홈페이지와 인스타를 참고해주시기 바랍니다!\n\n📌홈페이지: https://www.dgubaf.com/ \n\n📌인스타: https://www.instagram.com/dgubaf/ \n\n 지원서는 dgstatbaf@gmail.com으로, \"이름_비어플_14기_지원서\" 로 제출해주시면 됩니다. 제출 기한은 12/22(금) 자정까지 입니다. 서류 심사이며, 선발자는 12/26(화)에 개별 공지 예정입니다.\n\n많은 관심과 지원 바랍니다!🤗\n\n* 선발 기준은 '데이터 분석에 대한 관심 및 열정', '문제 해결 능력', '남은 학기 수', 그리고 '참여 기회'입니다. 활동 기간은 기본 3학기이나, 최소 2학기 이상, 도중 중단 없이 활동 가능한 인원 중에서, 직전학기 지원자 이거나 기회가 적은 인원은 가산점을 받습니다.\n\n** 신입 OT는 12/29(금) 16:00입니다. 선발된 신입 기수분들은 ❗️필수로 참여❗️해 주셔야 합니다.\n\n*** 기타 문의사항은 회장 문성원, 부회장 이예슬에게로 연락 바랍니다."
  },
  {
    tag: "공지",
    title: "🏆 역대 수상 내역 수집 공지",
    body:
      "안녕하세요. 모든 학회원분들께 말씀드립니다. 저희 비어플은 회원님들의 업적을 기리고, 소속 회원들의 도전 의욕을 불태우기 위해 역대 수상 내역을 수집하고자 합니다. 아직 수상 경험이 없으신 분들도 향후 대회에서 입상하시게 되면, 저희에게 알려주시면 감사하겠습니다. 수집된 수상 내역은 비어플 홈페이지와 향후 개설될 카페에도 올라갈 예정입니다.\n\n아래는 수집에 대한 세부 사항입니다.\n\n* 대상: 비어플의 모든 기수\n\n* 제출 방법: https://forms.gle/oRmTLc5wSHGu3EJu9 \n\n* 제출 내용: 수상자, 수상 대회(예: SAS 분석 챔피언십 등), 수상 종류(예: 대상, 최우수상 등), 수상 관련 사진 또는 기록(선택), 수상에 사용된 자료(선택)\n\n수집된 정보는 비어플 홍보 및 회원들의 도전 의지 고취에 활용될 예정입니다. 많은 참여 부탁드립니다. 감사합니다.🙇\n\n* 수상자의 경우 비어플 학회원이 한 명이라도 포함되면 됩니다. 홈페이지에 올라가다 보니 다른 수상자분들의 동의하에 제공해주시면 감사하겠습니다.\n\n* 세부적인 사항은 링크에 자세히 적혀있으니 확인해주시면 감사하겠습니다.\n\n* 추가적인 문의 사항은 임원진에게 연락 바랍니다."
  },
  {
    tag: "23-2학기",
    title: "피드백 스터디 발표 공지",
    body:
      "안녕하세요. 이번 주 활동 공지입니다.\n\n피드백 스터디 발표는 10분~15분이고 모든 팀원이 내용을 숙지해야 합니다. 제출 방법은 아래의 링크를 통해 노션에 제출해주시면 됩니다.\n\n아래는 세부 사항입니다.\n\n일시: 12/2(토) 오전 10시\n\n장소: 과학관 AH실\n\n대상: 12, 13기\n\n제출 기한: ~ 12월 1일(금) 오후 11시\n\n공유링크: https://baf-dongguk.notion.site/15920d5b69e74149a6c68a125ac7893a?pvs=4 \n\n* 참석이 어려우신 분은 미리 연락 바랍니다."
  },
  {
    tag: "23-2학기",
    title: "프로젝트 일정변경 공지",
    body:
      "안녕하세요. 길었던 명절 연휴가 지나갔습니다. 모두 즐거운 연휴 되셨기를 바라고 일상 복귀에 잘 적응하시기를 바랍니다.\n\n최종 자료 제출 일정에 변경이 있어 안내드립니다. NH조의 공모전 마감이 17일이고, 연휴도 있었기 때문에 시간적 여유를 드리기 위해 프로젝트 최종 마감일을 조금 늦추려 합니다.\n\n기존 제출 일시 : ~2023.10.14.(토) 자정\n\n📌변경 후 제출 일시 : ~2023.10.18.(수) 자정\n\n제출 유형 : ppt를 pdf로 변환하여 제출\n\n제출 기한 : 2023.10.18.(수) 자정\n\n제출 링크 : https://plain-cosmonaut-e71.notion.site/9f7f571a7d764c259024ac5874176b2c?pvs=4  \n\n* ppt 이외의 양식은 허용되지 않으며 반드시 쪽수가 포함되어야 합니다.\n\n* 최종 발표 자료에는 코드가 포함되지 않아야 합니다.\n\n* 따로 문의하실 사항은 임원진에게 연락 바랍니다."
  }
];

/* 자주 묻는 질문 (notice.html #faq) */
const FAQS = [
  { q: '새로운 기수는 언제 모집하나요?',
    a: '1년에 두 번 기수 모집을 시행합니다. 6월 중순, 12월 중순에 통계학과 학년별 단톡에 모집공고가 올라가니 참고해 주세요.' },
  { q: '학년 제한이 있나요?',
    a: '비어플 지원은 2학년 1학기까지를 수료하신 후 할 수 있습니다.' },
  { q: '세션은 어디서 진행되나요?',
    a: '세션은 대면으로 진행되며, 과학관 AH 실습실에서 10:00 – 12:00까지 진행합니다.' }
];

/* 설립 및 연혁 (about.html #history) */
const HISTORY = [
  { year: '2024', items: [
    '2024 관세청 공공데이터 활용·분석 경진대회 최우수상',
    '제 12회 빅콘테스트 데이터활용부문-부동산 최우수상',
    '2024 NH투자증권 빅데이터 경진대회 대상',
    '2024 NH투자증권 빅데이터 경진대회 입선',
    '제19회 이과대학 재학생 연구프로젝트 경진대회 최우수상',
    { text: '제 4회 비어플의 밤', badge: 'EVENT' } ] },
  { year: '2023', items: [
    '2023 미래에셋증권 x 네이버클라우드 빅데이터 페스티벌 최우수상',
    '날씨 빅데이터 콘테스트 입선',
    '동국대 x 네이버 부스트코스 데이터사이언스 2기 우수상',
    '통계 데이터 분석활용 대회 보고서부문 장려상',
    'KSDC DB 양적자료 활용대회 최우수상',
    '제5회 서울교육 데이터 활용 아이디어 공모전 장려상',
    '제18회 이과대학 재학생 연구프로젝트 경진대회 최우수상',
    { text: '제 3회 비어플의 밤', badge: 'EVENT' } ] },
  { year: '2022', items: [
    'AI Hub 인공지능 학습용 데이터 활용 공모전 입상',
    { text: '제 2회 비어플의 밤', badge: 'EVENT' } ] },
  { year: '2021', items: [
    'kt 통신망 안정성 확보 AI 해커톤 최우수상',
    '2021 민원 데이터 분석 경진대회 장려상',
    '2021 스마트농업 인공지능 경진대회 우수상',
    '제주도 교통량 예측 공모전 3위',
    '상추 생육환경 생성 AI 공모전 2위' ] },
  { year: '2020', items: [
    '2020년 빅콘테스트 최우수상',
    '2020년 Samsung Card Data Competition 2위' ] },
  { year: '2019', items: [
    '제 17회 SAS 분석 챔피언십 대상',
    '제 17회 SAS 분석 챔피언십 금상',
    { text: '제 1회 비어플의 밤', badge: 'EVENT' } ] },
  { year: '2018', items: [
    '제 16회 SAS 분석 챔피언십 대상' ] },
  { year: '2017', items: [
    { text: '비어플 창립 — 동국대학교 통계학과 학부생 12인', badge: 'FOUNDED' } ] }
];

/* 역대 수상 내역 (notice.html 하단) */
const AWARDS = [
  { period: '2018 – 2019', items: [
    '제 16회 SAS 분석 챔피언십 대상',
    '제 17회 SAS 분석 챔피언십 대상',
    '제 17회 SAS 분석 챔피언십 금상' ] },
  { period: '2020', items: [
    '2020년 빅콘테스트 최우수상',
    '2020년 Samsung Card Data Competition 2위' ] },
  { period: '2021 – 2022', items: [
    'kt 통신망 안정성 확보 AI 해커톤 최우수상',
    '2021 민원 데이터분석 경진대회 장려상',
    '2021 스마트농업 인공지능 경진대회 3위',
    '제주도 교통량 예측 공모전 3위',
    '상추 생육환경 생성 AI 공모전 2위',
    'AI Hub 인공지능 학습용 데이터 활용 공모전 입상' ] },
  { period: '2023', items: [
    '날씨 빅데이터 콘테스트 입선',
    '제18회 이과대학 재학생 연구프로젝트 경진대회 최우수상',
    '동국대 X 네이버 부스트코스 데이터사이언스 2기 우수상',
    'KSDC DB 양적자료 활용대회 최우수상',
    '제5회 서울교육 데이터 활용 아이디어 공모전 장려상',
    '2023 미래에셋증권 x 네이버클라우드 빅데이터 페스티벌 최우수상' ] },
  { period: '2024', items: [
    '2024 NH투자증권 빅데이터 경진대회 대상',
    '2024 관세청 공공데이터 활용·분석 경진대회 최우수상',
    '제 12회 빅콘테스트 데이터활용부문-부동산 최우수상',
    '2024 NH투자증권 빅데이터 경진대회 입선',
    '제19회 이과대학 재학생 연구프로젝트 경진대회 최우수상' ] }
];

/* ------------------------------------------------------------
   Helpers
   ------------------------------------------------------------ */
const $  = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
const reduceMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => (
  { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
));

/* ------------------------------------------------------------
   NAV — 플로팅 반투명 네비게이션
   ------------------------------------------------------------ */
function initNav() {
  const shell  = $('.nav-shell');
  const toggle = $('.nav-toggle');
  if (!shell) return;

  /* 현재 페이지 활성 표시 */
  const page = document.body.dataset.page;
  const active = $(`[data-page="${page}"]`, shell);
  if (active) active.classList.add('is-active');

  /* 스크롤 상태 */
  const onScroll = () => {
    document.documentElement.classList.toggle('is-scrolled', window.scrollY > 12);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* 모바일 토글 */
  if (toggle) {
    toggle.addEventListener('click', () => {
      const open = document.documentElement.classList.toggle('nav-open');
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? '메뉴 닫기' : '메뉴 열기');
      document.body.style.overflow = open ? 'hidden' : '';
    });
  }

  /* 모바일에서 드롭다운은 탭으로 펼침 */
  $$('.nav-item.has-sub > .nav-link').forEach((link) => {
    link.addEventListener('click', (e) => {
      if (window.innerWidth > 860) return;
      e.preventDefault();
      link.parentElement.classList.toggle('is-open');
    });
  });

  /* 메뉴 내 링크 클릭 시 닫기 */
  $$('.nav-sub a, .nav-item:not(.has-sub) > .nav-link').forEach((a) => {
    a.addEventListener('click', () => {
      if (!document.documentElement.classList.contains('nav-open')) return;
      document.documentElement.classList.remove('nav-open');
      document.body.style.overflow = '';
      if (toggle) toggle.setAttribute('aria-expanded', 'false');
    });
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && document.documentElement.classList.contains('nav-open')) {
      document.documentElement.classList.remove('nav-open');
      document.body.style.overflow = '';
      if (toggle) toggle.setAttribute('aria-expanded', 'false');
    }
  });
}

/* ------------------------------------------------------------
   APPLY — 지원하기 버튼
   ------------------------------------------------------------ */
function initApply() {
  /* 지원 기간이면 버튼을 구글 폼 링크로 바꾼다 */
  const btn = $('#applyBtn');
  const note = $('#applyNote');

  if (!btn) return;

  if (APPLY.open && APPLY.url) {
    const link = document.createElement('a');
    link.className = btn.className;
    link.href = APPLY.url;
    link.target = '_blank';
    link.rel = 'noopener';
    link.textContent = btn.textContent;
    btn.replaceWith(link);
    if (note) note.remove();
    return;
  }

  if (!note) return;
  note.textContent = APPLY.message;

  const close = () => { note.hidden = true; btn.setAttribute('aria-expanded', 'false'); };
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    const open = note.hidden;
    note.hidden = !open;
    btn.setAttribute('aria-expanded', String(open));
  });
  document.addEventListener('click', (e) => {
    if (!note.hidden && !note.contains(e.target)) close();
  });
  window.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
}

/* ------------------------------------------------------------
   REVEAL — 스크롤 등장 애니메이션
   ------------------------------------------------------------ */
function initReveal() {
  const targets = $$('.reveal');
  if (!targets.length) return;
  if (reduceMotion() || !('IntersectionObserver' in window)) {
    targets.forEach((el) => el.classList.add('is-in'));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const idx = Number(entry.target.dataset.revealIndex || 0);
      setTimeout(() => entry.target.classList.add('is-in'), idx * 70);
      io.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

  targets.forEach((el) => io.observe(el));
}

/* ------------------------------------------------------------
   HERO — 파티클 네트워크 (index.html)
   ------------------------------------------------------------ */
function initHero() {
  const canvas = $('#heroCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let w = 0, h = 0, dpr = 1;
  let nodes = [];
  let rafId = null;
  let running = false;
  const pointer = { x: -9999, y: -9999, active: false };

  const LINK_DIST = () => Math.min(160, Math.max(110, w * 0.11));

  function densityCount() {
    const area = w * h;
    const base = Math.round(area / 13000);
    return Math.max(28, Math.min(w < 640 ? 42 : 110, base));
  }

  function seed() {
    const count = densityCount();
    nodes = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.28,
      vy: (Math.random() - 0.5) * 0.28,
      r: 1.1 + Math.random() * 2.1
    }));
  }

  function resize() {
    const rect = canvas.getBoundingClientRect();
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = rect.width;
    h = rect.height;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    seed();
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);
    const maxDist = LINK_DIST();

    /* 연결선 */
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i], b = nodes[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const dist = Math.hypot(dx, dy);
        if (dist > maxDist) continue;
        const alpha = (1 - dist / maxDist) * 0.34;
        ctx.strokeStyle = `rgba(13, 94, 186, ${alpha.toFixed(3)})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }
    }

    /* 포인터 연결선 */
    if (pointer.active) {
      const reach = maxDist * 1.35;
      nodes.forEach((n) => {
        const dist = Math.hypot(n.x - pointer.x, n.y - pointer.y);
        if (dist > reach) return;
        ctx.strokeStyle = `rgba(77, 163, 255, ${((1 - dist / reach) * 0.5).toFixed(3)})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(n.x, n.y);
        ctx.lineTo(pointer.x, pointer.y);
        ctx.stroke();
      });
    }

    /* 노드 */
    nodes.forEach((n) => {
      ctx.fillStyle = 'rgba(13, 94, 186, 0.55)';
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = 'rgba(77, 163, 255, 0.12)';
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r * 3.4, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  function step() {
    nodes.forEach((n) => {
      n.x += n.vx;
      n.y += n.vy;
      if (n.x < -20) n.x = w + 20;
      if (n.x > w + 20) n.x = -20;
      if (n.y < -20) n.y = h + 20;
      if (n.y > h + 20) n.y = -20;

      if (pointer.active) {
        const dx = n.x - pointer.x, dy = n.y - pointer.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 110 && dist > 0.01) {
          const push = (1 - dist / 110) * 0.35;
          n.x += (dx / dist) * push;
          n.y += (dy / dist) * push;
        }
      }
    });
    draw();
    rafId = requestAnimationFrame(step);
  }

  function start() {
    if (running || reduceMotion()) return;
    running = true;
    rafId = requestAnimationFrame(step);
  }
  function stop() {
    running = false;
    if (rafId) cancelAnimationFrame(rafId);
    rafId = null;
  }

  resize();
  draw();

  if (reduceMotion()) return;   /* 정적 프레임 1장만 그리고 종료 */

  /* 리사이즈 디바운스 */
  let resizeTimer = null;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => { resize(); draw(); }, 180);
  });

  /* 포인터 */
  const hero = canvas.parentElement;
  hero.addEventListener('pointermove', (e) => {
    if (e.pointerType === 'touch') return;
    const rect = canvas.getBoundingClientRect();
    pointer.x = e.clientX - rect.left;
    pointer.y = e.clientY - rect.top;
    pointer.active = true;
  });
  hero.addEventListener('pointerleave', () => { pointer.active = false; });

  /* 화면 밖이면 루프 중단 */
  if ('IntersectionObserver' in window) {
    new IntersectionObserver((entries) => {
      entries[0].isIntersecting ? start() : stop();
    }, { threshold: 0 }).observe(canvas);
  } else {
    start();
  }
  document.addEventListener('visibilitychange', () => {
    document.hidden ? stop() : start();
  });
}

/* ------------------------------------------------------------
   HERO TAGLINE — 타이핑/삭제 반복 (index.html)
   ------------------------------------------------------------ */
function initHeroType() {
  const el = $('#heroType');
  if (!el) return;

  const PHRASES = ['세상을 읽습니다', '패턴을 찾아냅니다', '내일을 예측합니다'];
  const TYPE = 100;      /* 한 글자 입력 */
  const ERASE = 45;      /* 한 글자 삭제 */
  const HOLD = 1700;     /* 완성 후 멈춤 */
  const GAP = 320;       /* 다음 문구로 넘어가기 전 */

  /* 동작 줄이기 설정이면 첫 문구를 그대로 두고 끝낸다 */
  if (reduceMotion()) { el.textContent = PHRASES[0]; return; }

  let wi = 0, ci = 0, erasing = false, timer = null;

  const tick = () => {
    const word = PHRASES[wi];
    el.textContent = word.slice(0, ci);

    let wait;
    if (!erasing && ci < word.length) { ci++; wait = TYPE; }
    else if (!erasing)                { erasing = true; wait = HOLD; }
    else if (ci > 0)                  { ci--; wait = ERASE; }
    else { erasing = false; wi = (wi + 1) % PHRASES.length; wait = GAP; }

    timer = setTimeout(tick, wait);
  };

  const stop = () => { clearTimeout(timer); timer = null; };
  const play = () => { if (!timer) tick(); };

  /* 탭이 가려져 있거나 히어로가 화면 밖이면 멈춘다 */
  document.addEventListener('visibilitychange', () => (document.hidden ? stop() : play()));
  if ('IntersectionObserver' in window) {
    new IntersectionObserver((en) => (en[0].isIntersecting ? play() : stop()),
      { threshold: 0 }).observe(el);
  } else {
    play();
  }
}

/* ------------------------------------------------------------
   QUOTES — 인사말의 현 임원진 한마디 (about.html)
   ------------------------------------------------------------ */
function initQuotes() {
  const grid = $('#quoteGrid');
  if (!grid) return;

  const gen = EXECUTIVES.find((g) => g.current) || EXECUTIVES[EXECUTIVES.length - 1];
  const title = $('#quoteTitle');
  if (title) title.textContent = `${gen.gen}대 임원진의 한마디`;

  grid.innerHTML = gen.members.map((m) => {
    /* 사진이 아직 없으면 이름 첫 글자로 대신한다 */
    const face = m.photo
      ? `<img src="${esc(m.photo)}" alt="${esc(m.role)} ${esc(m.name)}" width="180" height="180" loading="lazy">`
      : `<span class="qrow-blank" aria-hidden="true">${esc(m.name.slice(0, 1))}</span>`;
    const quote = m.quote
      ? `<p>${esc(m.quote)}</p>`
      : '<p class="qrow-todo">한마디 준비 중입니다.</p>';
    return `
      <figure class="qrow">
        ${face}
        <figcaption>
          <span class="qrow-role">${esc(m.role)}</span>
          <b class="qrow-name">${esc(m.name)}</b>
          ${quote}
        </figcaption>
      </figure>`;
  }).join('');
}

/* ------------------------------------------------------------
   MEMBERS (about.html)
   ------------------------------------------------------------ */
function initMembers() {
  const tabsBox = $('#genTabs');
  const grid = $('#memberGrid');
  const caption = $('#genCaption');
  if (!tabsBox || !grid) return;

  const ordered = [...EXECUTIVES].sort((a, b) => b.gen - a.gen);

  tabsBox.innerHTML = ordered.map((g) => `
    <button type="button" class="gen-tab" data-gen="${g.gen}" aria-pressed="false">
      ${g.gen}대${g.current ? ' · 현' : ''}
    </button>`).join('');

  function render(gen) {
    const g = ordered.find((x) => x.gen === gen);
    if (!g) return;
    grid.innerHTML = g.members.map((m) => {
      /* 사진이 있으면 사진을, 없으면 이름 첫 글자 아바타를 쓴다 */
      const face = m.photo
        ? `<img class="face" src="${esc(m.photo)}" alt="${esc(m.role)} ${esc(m.name)}" width="48" height="48" loading="lazy">`
        : `<div class="avatar" aria-hidden="true">${esc(m.name.slice(0, 1))}</div>`;
      return `
      <div class="member">
        ${face}
        <div>
          <div class="member-role">${esc(m.role)}</div>
          <div class="member-name">${esc(m.name)}</div>
        </div>
      </div>`;
    }).join('');
    if (caption) {
      caption.textContent = `${g.gen}대 임원진 · ${g.years}${g.current ? ' (현 임원진)' : ''}`;
    }
    $$('.gen-tab', tabsBox).forEach((btn) => {
      const on = Number(btn.dataset.gen) === gen;
      btn.classList.toggle('is-active', on);
      btn.setAttribute('aria-pressed', String(on));
    });
  }

  tabsBox.addEventListener('click', (e) => {
    const btn = e.target.closest('.gen-tab');
    if (btn) render(Number(btn.dataset.gen));
  });

  render(ordered[0].gen);
}

/* ------------------------------------------------------------
   HISTORY (about.html)
   ------------------------------------------------------------ */
function initHistory() {
  const box = $('#timeline');
  if (!box) return;
  box.innerHTML = HISTORY.map((h) => `
    <div class="tl-item">
      <div class="tl-year">${esc(h.year)}</div>
      <ul class="tl-body">
        ${h.items.map((it) => {
          const text = typeof it === 'string' ? it : it.text;
          const badge = typeof it === 'string' ? '' : `<span class="tl-badge">${esc(it.badge)}</span>`;
          return `<li>${esc(text)}${badge}</li>`;
        }).join('')}
      </ul>
    </div>`).join('');
}

/* ------------------------------------------------------------
   AWARDS MARQUEE — 홈, 3줄 흐르는 수상 내역
   ------------------------------------------------------------ */
function initAwardsMarquee() {
  const box = $('#awardsMarquee');
  if (!box) return;

  /* 연도별 묶음을 하나의 목록으로 편다 */
  const flat = [];
  AWARDS.forEach((g) => g.items.forEach((title) => flat.push({ period: g.period, title })));

  /* 줄마다 다른 연도가 섞이도록 번갈아 나눈다 */
  const ROWS = 3;
  const rows = Array.from({ length: ROWS }, () => []);
  flat.forEach((a, i) => rows[i % ROWS].push(a));

  const TOP = /대상|최우수상/;                 /* 상위 수상은 강조 */
  const SPEED = [64, 52, 74];                   /* 줄마다 다른 속도(초) */
  const OFFSET = [0, -18, -37];                 /* 시작 위치를 어긋나게 */

  const pill = (a) => `
    <span class="mq-item${TOP.test(a.title) ? ' mq-item--top' : ''}">
      <b>${esc(a.period)}</b>${esc(a.title)}
    </span>`;

  box.innerHTML = rows.map((items, r) => {
    /* 끊김 없이 이어지려면 같은 목록이 두 벌 필요하다 */
    const inner = items.map(pill).join('') + items.map(pill).join('');
    return `
      <div class="mq-row">
        <div class="mq-track" style="animation-duration:${SPEED[r]}s;animation-delay:${OFFSET[r]}s">${inner}</div>
      </div>`;
  }).join('');
}

/* ------------------------------------------------------------
   SCROLL PROGRESS — 서브탭 위 진행 바
   ------------------------------------------------------------ */
function initScrollProgress() {
  const bars = $$('[data-scroll-progress]');
  if (!bars.length) return;

  let ticking = false;
  const paint = () => {
    const doc = document.documentElement;
    const max = doc.scrollHeight - window.innerHeight;
    const p = max > 0 ? Math.min(Math.max(window.scrollY / max, 0), 1) : 0;
    bars.forEach((b) => { b.style.width = (p * 100).toFixed(2) + '%'; });
    ticking = false;
  };
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(paint);
  };

  paint();
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
}

/* ------------------------------------------------------------
   SUB TABS — about.html 섹션 스크롤 스파이
   ------------------------------------------------------------ */
function initSubTabs() {
  const bar = $('.subtabs');
  if (!bar) return;
  const links = $$('a', bar);
  const sections = links
    .map((a) => document.getElementById(a.getAttribute('href').slice(1)))
    .filter(Boolean);
  if (!sections.length || !('IntersectionObserver' in window)) return;

  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      links.forEach((a) => {
        a.classList.toggle('is-active', a.getAttribute('href') === `#${entry.target.id}`);
      });
    });
  }, { rootMargin: '-30% 0px -60% 0px', threshold: 0 });

  sections.forEach((s) => io.observe(s));
}

/* ------------------------------------------------------------
   ARCHIVE (archive.html)
   ------------------------------------------------------------ */
function initArchive() {
  const list = $('#materialList');
  const chips = $('#materialFilters');
  if (!list || !chips) return;

  const LABEL = { edu: '교육자료', project: '프로젝트' };

  function render(type) {
    const items = type === 'all' ? MATERIALS : MATERIALS.filter((m) => m.type === type);
    list.innerHTML = items.length ? items.map((m) => `
      <article class="row">
        <span class="row-badge">${esc(LABEL[m.type])}</span>
        <div class="row-main">
          <h3 class="row-title">${esc(m.title)}</h3>
          <p class="row-desc">${esc(m.desc)}</p>
          <div class="tags">${m.tags.map((t) => `<span class="tag">${esc(t)}</span>`).join('')}</div>
          <div class="row-meta"><span>${esc(m.author)}</span><span>${esc(m.date)}</span></div>
        </div>
      </article>`).join('') : '<p class="empty">해당 분류의 자료가 없습니다.</p>';

    $$('.chip', chips).forEach((c) => {
      c.classList.toggle('is-active', c.dataset.filter === type);
    });
  }

  chips.addEventListener('click', (e) => {
    const chip = e.target.closest('.chip');
    if (chip) render(chip.dataset.filter);
  });

  render('all');
}

/* ------------------------------------------------------------
   NOTICE (notice.html)
   ------------------------------------------------------------ */
function initNotice() {
  const list = $('#noticeList');
  const input = $('#noticeSearch');
  const count = $('#noticeCount');
  const pager = $('#noticePager');
  if (!list) return;

  const PER_PAGE = 10;
  let page = 1;
  let query = '';

  /* 본문 속 링크는 눌러서 열 수 있게 한다 */
  const linkify = (t) => esc(t).replace(
    /https?:\/\/[^\s<]+[^\s<.,)]/g,
    (u) => `<a href="${u}" target="_blank" rel="noopener">${u}</a>`
  );

  const filtered = () => {
    const key = query.trim().toLowerCase();
    return NOTICES.filter((n) =>
      !key || (n.title + n.tag + n.body).toLowerCase().includes(key));
  };

  function drawPager(total) {
    if (!pager) return;
    const pages = Math.ceil(total / PER_PAGE);
    if (pages <= 1) { pager.innerHTML = ''; return; }
    const btn = (p, label, cls, disabled) =>
      `<button type="button" class="${cls}" data-goto="${p}"${disabled ? ' disabled' : ''}>${label}</button>`;
    let html = btn(page - 1, '‹', 'pager-btn', page === 1);
    for (let i = 1; i <= pages; i++) {
      html += btn(i, i, 'pager-num' + (i === page ? ' is-active' : ''), false);
    }
    html += btn(page + 1, '›', 'pager-btn', page === pages);
    pager.innerHTML = html;
  }

  function render() {
    const items = filtered();
    const pages = Math.max(1, Math.ceil(items.length / PER_PAGE));
    if (page > pages) page = pages;

    if (count) count.textContent = `${items.length}건`;

    const slice = items.slice((page - 1) * PER_PAGE, page * PER_PAGE);
    list.innerHTML = slice.length ? slice.map((n) => `
      <details class="notice-item">
        <summary>
          <span class="row-badge${n.pinned ? ' row-badge--hot' : ''}">${esc(n.tag)}</span>
          <span class="notice-title">${esc(n.title)}</span>
        </summary>
        <div class="notice-body">${linkify(n.body)}</div>
      </details>`).join('') : '<p class="empty">검색 결과가 없습니다.</p>';

    drawPager(items.length);
  }

  if (input) {
    input.addEventListener('input', () => { query = input.value; page = 1; render(); });
  }
  if (pager) {
    pager.addEventListener('click', (e) => {
      const b = e.target.closest('[data-goto]');
      if (!b || b.disabled) return;
      page = Number(b.dataset.goto);
      render();
      /* 페이지를 넘기면 목록 맨 위가 보이도록 */
      const top = $('#notice');
      if (top) top.scrollIntoView({ behavior: reduceMotion() ? 'auto' : 'smooth', block: 'start' });
    });
  }

  render();
}

/* ------------------------------------------------------------
   FAQ (notice.html)
   ------------------------------------------------------------ */
function initFaq() {
  const box = $('#faqList');
  if (!box) return;
  box.innerHTML = FAQS.map((f) => `
    <details class="faq-item">
      <summary>${esc(f.q)}</summary>
      <p>${esc(f.a)}</p>
    </details>`).join('');
}

/* ------------------------------------------------------------
   AWARDS (notice.html)
   ------------------------------------------------------------ */
function initAwards() {
  const box = $('#awardsGrid');
  if (!box) return;
  box.innerHTML = AWARDS.map((a) => `
    <div class="award-group">
      <h3>${esc(a.period)}</h3>
      <ul>${a.items.map((i) => `<li>${esc(i)}</li>`).join('')}</ul>
    </div>`).join('');
}

/* ------------------------------------------------------------
   BOOT
   ------------------------------------------------------------ */
document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initApply();
  initHero();
  initHeroType();
  initMembers();
  initQuotes();
  initHistory();
  initArchive();
  initNotice();
  initFaq();
  initAwards();
  initAwardsMarquee();
  initSubTabs();
  initScrollProgress();
  initReveal();          /* 동적 렌더 이후에 관찰해야 하므로 마지막 */

  const year = $('#year');
  if (year) year.textContent = new Date().getFullYear();
});
