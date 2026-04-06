-- 1) Tabela de conteudo do site
create table if not exists public.site_content (
  id text primary key,
  content jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default timezone('utc', now())
);

-- 2) Trigger para atualizar timestamp
create or replace function public.touch_site_content_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

drop trigger if exists trg_site_content_updated_at on public.site_content;
create trigger trg_site_content_updated_at
before update on public.site_content
for each row
execute function public.touch_site_content_updated_at();

-- 3) Ativar RLS
alter table public.site_content enable row level security;

-- 4) Politicas
drop policy if exists "Public read site content" on public.site_content;
create policy "Public read site content"
on public.site_content
for select
using (true);

drop policy if exists "Authenticated write site content" on public.site_content;
create policy "Authenticated write site content"
on public.site_content
for all
using (auth.role() = 'authenticated')
with check (auth.role() = 'authenticated');

-- 5) Registro padrao
insert into public.site_content (id, content)
values ('main-site', '{}'::jsonb)
on conflict (id) do nothing;
