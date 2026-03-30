# Security Checklist

## Managed auth
- Supabase Auth is used for sign up, log in, log out, and password reset.
- App does **not** store passwords manually in app tables.

## Data isolation
- Per-user progress/bookmarks/settings persistence uses `public.user_state`.
- Row Level Security (RLS) policies enforce `user_id = auth.uid()` ownership.
- Index on `user_id` supports RLS performance.

## Secrets
- Required env vars:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- No service-role key is used in browser code.

## Session safety
- Auth session stored client-side with token refresh path.
- User-scoped local keys prevent cross-user progress mixing on shared devices.
- Cloud state is synced down on authenticated session restore.

## MFA
- Account security page includes MFA path/scaffold and docs path.
- Next step: add full in-app TOTP/WebAuthn enrollment UI.

## Remaining improvements
- Add server-side auth guards for optional protected routes.
- Add background sync retries/telemetry for offline writes.
- Add explicit guest->account import prompt UX.
