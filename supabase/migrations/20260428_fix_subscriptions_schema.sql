-- Add foreign key constraint on user_id
alter table public.subscriptions
  add constraint fk_subscriptions_user_id
  foreign key (user_id)
  references auth.users(id)
  on delete cascade;

-- Create ENUM type for subscription status
create type subscription_status as enum (
  'active',
  'trialing',
  'past_due',
  'canceled',
  'unpaid'
);

-- Alter table to use enum
alter table public.subscriptions
  alter column status type subscription_status
  using status::subscription_status;

-- Add composite index for common query pattern (partial index for active subscriptions only)
create index idx_subscriptions_active_lookup
  on public.subscriptions(user_id, environment, status)
  where status in ('active', 'trialing', 'past_due');

-- Create function to update timestamp
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Attach trigger to subscriptions table
create trigger update_subscriptions_updated_at
  before update on public.subscriptions
  for each row
  execute function update_updated_at_column();
