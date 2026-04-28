-- User profiles table
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  country text,
  plan text not null default 'free',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Add RLS policies
alter table public.profiles enable row level security;

create policy "Users can view own profile"
  on public.profiles
  for select
  to authenticated
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles
  for update
  to authenticated
  using (auth.uid() = id);

-- Trigger for updated_at
create trigger update_profiles_updated_at
  before update on public.profiles
  for each row
  execute function update_updated_at_column();

-- Search history table (for rate limiting)
create table if not exists public.search_history (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  session_id text,  -- For anonymous users
  query text not null,
  country text,
  searched_at timestamptz default now()
);

-- Add index for daily rate limit queries
create index idx_search_history_daily_limit
  on public.search_history(user_id, searched_at)
  where searched_at > current_date;

create index idx_search_history_session_daily
  on public.search_history(session_id, searched_at)
  where session_id is not null and searched_at > current_date;

-- Add RLS policies
alter table public.search_history enable row level security;

create policy "Users can view own search history"
  on public.search_history
  for select
  to authenticated
  using (auth.uid() = user_id);

-- Saved results table (Pro feature)
create table if not exists public.saved_results (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  query text not null,
  result jsonb not null,
  saved_at timestamptz default now()
);

create index idx_saved_results_user on public.saved_results(user_id);
create index idx_saved_results_saved_at on public.saved_results(saved_at desc);

-- Add RLS policies
alter table public.saved_results enable row level security;

create policy "Users can manage own saved results"
  on public.saved_results
  for all
  to authenticated
  using (auth.uid() = user_id);

-- Feedback table
create table if not exists public.feedback (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  query text not null,
  rating text not null check (rating in ('up', 'down')),
  comment text,
  result_snapshot jsonb,
  created_at timestamptz default now()
);

create index idx_feedback_created_at on public.feedback(created_at desc);
create index idx_feedback_rating on public.feedback(rating);

-- Add RLS policies
alter table public.feedback enable row level security;

create policy "Anyone can create feedback"
  on public.feedback
  for insert
  to authenticated, anon
  with check (true);

-- Subscription audit log table
create table if not exists public.subscription_audit_log (
  id uuid primary key default gen_random_uuid(),
  subscription_id uuid not null references public.subscriptions(id),
  old_status text,
  new_status text,
  changed_by uuid references auth.users(id),
  changed_at timestamptz default now(),
  metadata jsonb
);

create index idx_subscription_audit_subscription_id on public.subscription_audit_log(subscription_id);
create index idx_subscription_audit_changed_at on public.subscription_audit_log(changed_at desc);

-- Add RLS policies
alter table public.subscription_audit_log enable row level security;

create policy "Users can view own subscription audit log"
  on public.subscription_audit_log
  for select
  to authenticated
  using (
    subscription_id in (
      select id from public.subscriptions where user_id = auth.uid()
    )
  );

-- Add trigger to log subscription changes
create or replace function log_subscription_changes()
returns trigger as $$
begin
  if old.status is distinct from new.status then
    insert into public.subscription_audit_log (
      subscription_id,
      old_status,
      new_status,
      changed_by,
      metadata
    ) values (
      new.id,
      old.status,
      new.status,
      current_setting('request.jwt.claim.sub', true)::uuid,
      jsonb_build_object(
        'old_period_end', old.current_period_end,
        'new_period_end', new.current_period_end
      )
    );
  end if;
  return new;
end;
$$ language plpgsql;

create trigger subscription_audit_trigger
  after update on public.subscriptions
  for each row
  execute function log_subscription_changes();
