-- ============================================================
-- B.a.f 관리자 페이지 — 스키마 + RLS + Storage
-- Supabase SQL Editor 에서 이 파일을 먼저 실행하세요.
-- ============================================================

-- ----- 공지사항 테이블 -----
create table if not exists public.notices (
  id          uuid primary key default gen_random_uuid(),
  tag         text,                          -- 배지 라벨 (예: 필독, New)
  title       text not null,
  pinned      boolean default false,         -- 상단 고정 여부
  body        text not null,                 -- 본문 (줄바꿈 \n 포함)
  sort_order  int default 0,                 -- 노출 순서 (내림차순)
  created_at  timestamptz default now()
);

-- ----- 자료실 테이블 -----
create table if not exists public.materials (
  id           uuid primary key default gen_random_uuid(),
  type         text not null check (type in ('project','competition','study','edu')),  -- 학기 프로젝트 / 공모전 / 스터디 / 교육자료
  title        text not null,
  description  text,
  author       text,
  mat_date     text,                         -- 기존 '2017.09.29' 형식 유지
  tags         text[] default '{}',
  file_url     text,                         -- Storage 주소 (사이트는 여기서 버킷 안 경로를 뽑아 임시 주소를 만든다)
  file_name    text,                         -- 원본 파일명
  sort_order   int default 0,
  created_at   timestamptz default now()
);

-- ----- FAQ 테이블 -----
create table if not exists public.faqs (
  id          uuid primary key default gen_random_uuid(),
  question    text not null,
  answer      text not null,
  sort_order  int default 0,
  created_at  timestamptz default now()
);

-- ============================================================
-- RLS (Row Level Security)
-- 공개 SELECT, 쓰기는 운영진 명단(admins)에 있는 계정만 허용
-- ============================================================
alter table public.notices   enable row level security;
-- 프로젝트 상세(드롭다운) 필드 — 기존 테이블에도 안전하게 추가됩니다
alter table public.materials add column if not exists problem        text;  -- 어떤 문제에 주목했는지
alter table public.materials add column if not exists approach       text;  -- 어떤 데이터·방법을 썼는지
alter table public.materials add column if not exists result         text;  -- 어떤 결과·인사이트를 얻었는지
alter table public.materials add column if not exists output_url     text;  -- 대표 그래프·시각화 이미지 URL
alter table public.materials add column if not exists output_caption text;  -- 결과물 설명
-- 학기 (예: 2025-1, 2025-여름, 2025-2, 2025-겨울) — 프로젝트 페이지에서 날짜 대신 보이고 정렬 기준이 된다
alter table public.materials add column if not exists term text;
-- 도메인 (예: 금융, 마케팅, 사회) — 정규 프로젝트의 도메인 필터에 쓰인다
alter table public.materials add column if not exists domain text;
-- 분류 확장: 학기 프로젝트 / 공모전 / 스터디 / 교육자료 (기존 테이블의 제약도 바꾼다)
alter table public.materials drop constraint if exists materials_type_check;
alter table public.materials add constraint materials_type_check
  check (type in ('project','competition','study','edu'));

-- ============================================================
-- 운영진 명단과 권한 확인 함수
-- - admins 에 있는 이메일만 공지·자료·FAQ·설정·파일을 쓸 수 있다
-- - 공용 학회원 계정(member@dgubaf.com)은 프로젝트 PDF 를 읽기만 한다.
--   비밀번호는 대시보드 Authentication → Users 에서 직접 정한다 (이 파일·코드에 넣지 않는다)
-- - 운영진 추가: 대시보드에서 계정을 만든 뒤
--   insert into public.admins (email) values ('새 운영진 이메일(소문자)');
-- ============================================================
create table if not exists public.admins (
  email      text primary key,
  created_at timestamptz not null default now()
);
alter table public.admins enable row level security;   -- 정책 없음: API 로는 아무도 읽거나 쓰지 못한다
revoke all on public.admins from anon, authenticated;

create or replace function public.is_admin() returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.admins a where a.email = lower(auth.jwt() ->> 'email'))
$$;
create or replace function public.can_view_materials() returns boolean
language sql stable security definer set search_path = '' as $$
  select public.is_admin() or lower(auth.jwt() ->> 'email') = 'member@dgubaf.com'
$$;
revoke execute on function public.is_admin(), public.can_view_materials() from public, anon;
grant execute on function public.is_admin(), public.can_view_materials() to authenticated;

-- ============================================================
-- settings — 사이트 설정 (지원 버튼 문구·폼 주소 등)
-- ============================================================
create table if not exists public.settings (
  key        text primary key,
  value      text,
  updated_at timestamptz default now()
);
alter table public.settings enable row level security;

create policy "settings 공개 조회" on public.settings
  for select using (true);
create policy "settings 운영진 등록" on public.settings
  for insert to authenticated with check (public.is_admin());
create policy "settings 운영진 수정" on public.settings
  for update to authenticated using (public.is_admin()) with check (public.is_admin());

grant select on public.settings to anon, authenticated;
grant insert, update on public.settings to authenticated;

insert into public.settings (key, value) values
  ('apply_label', '19기 모집마감'),
  ('apply_url',   '')
on conflict (key) do nothing;

alter table public.materials enable row level security;
alter table public.faqs      enable row level security;

-- ----- faqs 정책 -----
create policy "faqs 공개 조회" on public.faqs for select using (true);
create policy "faqs 운영진 등록" on public.faqs for insert to authenticated with check (public.is_admin());
create policy "faqs 운영진 수정" on public.faqs for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "faqs 운영진 삭제" on public.faqs for delete to authenticated using (public.is_admin());

-- ----- notices 정책 -----
create policy "notices 공개 조회" on public.notices
  for select using (true);
create policy "notices 운영진 등록" on public.notices
  for insert to authenticated with check (public.is_admin());
create policy "notices 운영진 수정" on public.notices
  for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "notices 운영진 삭제" on public.notices
  for delete to authenticated using (public.is_admin());

-- ----- materials 정책 -----
create policy "materials 공개 조회" on public.materials
  for select using (true);
create policy "materials 운영진 등록" on public.materials
  for insert to authenticated with check (public.is_admin());
create policy "materials 운영진 수정" on public.materials
  for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "materials 운영진 삭제" on public.materials
  for delete to authenticated using (public.is_admin());

-- ============================================================
-- 권한 (GRANT) — anon: 읽기, authenticated: 읽기+쓰기 (실제 쓰기는 위 정책이 운영진만 허용)
-- RLS 정책과 별개로 테이블 접근 권한이 필요함
-- ============================================================
grant usage on schema public to anon, authenticated;
grant select on public.notices, public.materials, public.faqs to anon, authenticated;
grant insert, update, delete on public.notices, public.materials, public.faqs to authenticated;

-- ============================================================
-- Storage — materials 버킷 (비공개: 학회원·운영진만 임시 주소로 연다)
-- 공용 학회원 비밀번호 바꾸기 (밖으로 퍼졌을 때):
--   대시보드 Authentication → Users 에서 member@dgubaf.com 을 지우고, 같은 이메일로 다시 만든다
--   (새 비밀번호, Auto Confirm User 체크). 정책이 이메일 기준이라 그대로 동작하고 기존 로그인은 끊긴다.
--   이미 연 브라우저는 로그인 토큰이 끝날 때까지 최대 1시간 더 열 수 있다.
--   이미 만들어진 임시 주소는 계정을 다시 만들어도 만료 때까지 열린다 (사이트는 1시간짜리를 만들지만,
--   비밀번호를 아는 사람은 더 긴 주소를 만들 수 있다). 그것까지 막으려면 파일을 새 경로로 옮기고
--   materials.file_url 을 새 경로로 고친다.
-- ============================================================
-- 버킷 생성 (이미 있으면 비공개로 맞춘다)
insert into storage.buckets (id, name, public)
values ('materials', 'materials', false)
on conflict (id) do update set public = false;

-- 버킷 객체 정책: 학회원·운영진 조회 + 운영진 쓰기
create policy "materials 파일 학회원 조회" on storage.objects
  for select to authenticated using (bucket_id = 'materials' and public.can_view_materials());
create policy "materials 파일 운영진 업로드" on storage.objects
  for insert to authenticated with check (bucket_id = 'materials' and public.is_admin());
create policy "materials 파일 운영진 수정" on storage.objects
  for update to authenticated using (bucket_id = 'materials' and public.is_admin())
  with check (bucket_id = 'materials' and public.is_admin());
create policy "materials 파일 운영진 삭제" on storage.objects
  for delete to authenticated using (bucket_id = 'materials' and public.is_admin());
