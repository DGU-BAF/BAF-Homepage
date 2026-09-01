# 관리자 페이지 세팅 가이드

정적 사이트에 Supabase 기반 관리자 페이지(공지사항·자료실 CRUD)를 붙였습니다.
아래 순서대로 진행하면 됩니다.

## 1. Supabase 프로젝트 생성
1. https://supabase.com 접속 → 새 프로젝트 생성 (Region은 가까운 곳: Northeast Asia)
2. DB 비밀번호는 따로 안전하게 보관

## 2. API 값 연결
1. 좌측 메뉴 Settings > API 로 이동
2. `Project URL` 과 `anon public` 키를 복사
3. `supabase-config.js` 를 열고 상단 두 상수에 붙여넣기
   ```js
   const SUPABASE_URL = 'https://xxxx.supabase.co';
   const SUPABASE_ANON_KEY = 'eyJhbGciOi...';
   ```
   (anon key는 공개돼도 되는 키입니다. 데이터 보호는 RLS가 담당)

## 3. 스키마 + 시드 데이터 실행
1. 좌측 메뉴 SQL Editor
2. `supabase/schema.sql` 전체 복사 → 실행 (테이블 · RLS · Storage 버킷 생성)
3. `supabase/seed.sql` 전체 복사 → 실행 (기존 공지 13건, 자료 6건 입력)

## 4. Storage 버킷 확인
- schema.sql이 `materials` 버킷(public)을 자동 생성합니다.
- Storage 메뉴에서 `materials` 버킷이 보이는지 확인. 없으면 수동으로 public 버킷 생성 후 schema.sql의 정책 부분만 다시 실행.

## 5. 관리자 계정 생성
1. Authentication > Providers 에서 **Email** 활성화
2. 공개 가입은 막기: Providers 하단 또는 Settings에서
   - "Allow new users to sign up" **OFF**
   - "Confirm email" 은 끄면 즉시 로그인 가능 (관리자 소수라 꺼도 무방)
3. Authentication > Users > **Add user** 로 관리자 계정(이메일+비밀번호) 직접 생성

## 6. 로그인 테스트
1. `admin.html` 을 브라우저로 열기 (로컬은 `python -m http.server` 등으로 서빙)
2. 만든 계정으로 로그인 → 공지/자료 목록이 뜨면 성공
3. 새 공지 등록 · 자료 파일 업로드 테스트

---

## 값 꽂은 뒤 해야 할 것 (요약)
- `supabase-config.js` 의 `SUPABASE_URL` / `SUPABASE_ANON_KEY` 채우기
- SQL Editor에서 `schema.sql` → `seed.sql` 순서로 실행
- Authentication에서 Email 켜고 공개가입 OFF, 관리자 Users 1명 추가
- `admin.html` 접속해 로그인 확인

## 참고: 공개 페이지 연동
현재 공개 페이지(archive/notice)는 여전히 `script.js`의 하드코딩 데이터를 씁니다.
관리자에서 바꾼 내용을 공개 페이지에 반영하려면, 이후 단계에서 archive.html/notice.html이
Supabase에서 데이터를 읽도록 전환하는 작업이 별도로 필요합니다. (이번 범위 밖)
