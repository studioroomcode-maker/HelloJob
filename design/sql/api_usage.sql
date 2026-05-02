-- Supabase SQL Editor에서 1회 실행
-- 사용자별 API 호출 기록 테이블

create table if not exists public.api_usage (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid references auth.users(id) on delete cascade,
  provider      text not null,           -- 'claude' | 'gemini'
  model         text,
  input_tokens  int  not null default 0,
  output_tokens int  not null default 0,
  cost_usd      numeric(12,6) not null default 0,
  web_search    boolean not null default false,
  source        text,                    -- 'server' | 'browser'
  created_at    timestamptz not null default now()
);

create index if not exists api_usage_user_id_idx    on public.api_usage(user_id);
create index if not exists api_usage_created_at_idx on public.api_usage(created_at desc);
create index if not exists api_usage_provider_idx   on public.api_usage(provider);

-- RLS: service_role(백엔드)만 INSERT/SELECT, 일반 사용자는 자기 행 읽기 허용
alter table public.api_usage enable row level security;

drop policy if exists "api_usage_self_read" on public.api_usage;
create policy "api_usage_self_read" on public.api_usage
  for select using (auth.uid() = user_id);
