-- Cria o usuário e o banco do Baggins Coffee. Roda como superusuário (postgres).
-- Use "npm run db:setup", que passa as variáveis app_user, app_pass e app_db a partir do .env.

SELECT format('CREATE ROLE %I LOGIN PASSWORD %L', :'app_user', :'app_pass')
WHERE NOT EXISTS (SELECT FROM pg_roles WHERE rolname = :'app_user') \gexec

SELECT format('ALTER ROLE %I LOGIN PASSWORD %L', :'app_user', :'app_pass') \gexec

SELECT format('CREATE DATABASE %I OWNER %I ENCODING ''UTF8''', :'app_db', :'app_user')
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = :'app_db') \gexec
