/* ============================================================
   Supabase 클라이언트 초기화
   - CDN UMD 로드가 선행되어야 함:
     <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
   ============================================================ */

/* Supabase Settings > API 값 */
const SUPABASE_URL = 'https://lwfzyfpkigfirqdluqmx.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_vY5Z6InAo6mGIZXIQRHkKg_gamm1OPC';

/* 전역 클라이언트 (admin.js에서 window.sb 로 사용) */
window.sb = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
