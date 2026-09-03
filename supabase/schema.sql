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
  type         text not null check (type in ('edu','project')),  -- 교육자료 / 프로젝트
  title        text not null,
  description  text,
  author       text,
  mat_date     text,                         -- 기존 '2017.09.29' 형식 유지
  tags         text[] default '{}',
  file_url     text,                         -- Storage public URL
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
-- 공개 SELECT, 쓰기는 로그인(authenticated) 롤만 허용
-- ============================================================
alter table public.notices   enable row level security;
-- 프로젝트 상세(드롭다운) 필드 — 기존 테이블에도 안전하게 추가됩니다
alter table public.materials add column if not exists problem        text;  -- 어떤 문제에 주목했는지
alter table public.materials add column if not exists approach       text;  -- 어떤 데이터·방법을 썼는지
alter table public.materials add column if not exists result         text;  -- 어떤 결과·인사이트를 얻었는지
alter table public.materials add column if not exists output_url     text;  -- 대표 그래프·시각화 이미지 URL
alter table public.materials add column if not exists output_caption text;  -- 결과물 설명

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
create policy "settings 로그인 등록" on public.settings
  for insert with check (auth.role() = 'authenticated');
create policy "settings 로그인 수정" on public.settings
  for update using (auth.role() = 'authenticated');

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
create policy "faqs 로그인 등록" on public.faqs for insert with check (auth.role() = 'authenticated');
create policy "faqs 로그인 수정" on public.faqs for update using (auth.role() = 'authenticated');
create policy "faqs 로그인 삭제" on public.faqs for delete using (auth.role() = 'authenticated');

-- ----- notices 정책 -----
create policy "notices 공개 조회" on public.notices
  for select using (true);
create policy "notices 로그인 등록" on public.notices
  for insert with check (auth.role() = 'authenticated');
create policy "notices 로그인 수정" on public.notices
  for update using (auth.role() = 'authenticated');
create policy "notices 로그인 삭제" on public.notices
  for delete using (auth.role() = 'authenticated');

-- ----- materials 정책 -----
create policy "materials 공개 조회" on public.materials
  for select using (true);
create policy "materials 로그인 등록" on public.materials
  for insert with check (auth.role() = 'authenticated');
create policy "materials 로그인 수정" on public.materials
  for update using (auth.role() = 'authenticated');
create policy "materials 로그인 삭제" on public.materials
  for delete using (auth.role() = 'authenticated');

-- ============================================================
-- 권한 (GRANT) — anon: 읽기, authenticated: 읽기+쓰기
-- RLS 정책과 별개로 테이블 접근 권한이 필요함
-- ============================================================
grant usage on schema public to anon, authenticated;
grant select on public.notices, public.materials, public.faqs to anon, authenticated;
grant insert, update, delete on public.notices, public.materials, public.faqs to authenticated;

-- ============================================================
-- Storage — materials 버킷 (public read)
-- ============================================================
-- 버킷 생성 (이미 있으면 무시)
insert into storage.buckets (id, name, public)
values ('materials', 'materials', true)
on conflict (id) do nothing;

-- 버킷 객체 정책: 공개 조회 + 로그인 쓰기
create policy "materials 파일 공개 조회" on storage.objects
  for select using (bucket_id = 'materials');
create policy "materials 파일 로그인 업로드" on storage.objects
  for insert with check (bucket_id = 'materials' and auth.role() = 'authenticated');
create policy "materials 파일 로그인 수정" on storage.objects
  for update using (bucket_id = 'materials' and auth.role() = 'authenticated');
create policy "materials 파일 로그인 삭제" on storage.objects
  for delete using (bucket_id = 'materials' and auth.role() = 'authenticated');
