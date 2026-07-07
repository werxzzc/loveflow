-- LoveFlow Supabase Database Schema
-- Run this in your Supabase SQL Editor

-- 1. Clients Table
create table if not exists clients (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  telegram text,
  token text unique not null,
  credits_total int default 3,
  credits_used int default 0,
  status text default 'active',
  comment text,
  created_at timestamptz default now(),
  last_activity timestamptz default now()
);

-- 2. Invitations Table
create table if not exists invitations (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references clients(id) on delete cascade,
  token text unique not null,
  girl_name text not null,
  title text not null,
  subtitle text,
  welcome_message text,
  description text,
  final_message text,
  theme text default 'sakura',
  custom_colors jsonb default '{}'::jsonb,
  font text default 'Inter',
  questions jsonb default '[]'::jsonb,
  status text default 'pending',
  created_at timestamptz default now(),
  completed_at timestamptz
);

-- 3. Results Table
create table if not exists results (
  id uuid primary key default gen_random_uuid(),
  invitation_id uuid references invitations(id) on delete cascade,
  result_token text unique not null,
  girl_name text,
  answers jsonb default '[]'::jsonb,
  time_taken_seconds int default 0,
  completed_at timestamptz default now()
);

-- Enable Row Level Security (RLS) or disable/bypass for admin
-- Since we use the service role key on the backend to execute mutations and queries,
-- RLS can remain enabled without extra policies, or disabled for simple setups:
alter table clients disable row level security;
alter table invitations disable row level security;
alter table results disable row level security;
