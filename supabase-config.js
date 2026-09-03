/* ============================================================
   Supabase 클라이언트 초기화
   - CDN UMD 로드가 선행되어야 함:
     <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
   ============================================================ */

/* Supabase Settings > API 값 */
const SUPABASE_URL = 'https://lwfzyfpkigfirqdluqmx.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_vY5Z6InAo6mGIZXIQRHkKg_gamm1OPC';

/* 전역 클라이언트 (admin.js에서 window.sb 로 사용) */
window.SUPABASE_URL = SUPABASE_URL;
window.SUPABASE_ANON_KEY = SUPABASE_ANON_KEY;

/* SDK가 로드된 페이지에서만 클라이언트를 만든다 (공개 페이지는 REST 만 사용) */
if (window.supabase) {
  window.sb = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}
