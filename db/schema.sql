-- Esquema do Baggins Coffee. Pode rodar mais de uma vez (npm run db:migrate).

DO $$ BEGIN
  CREATE TYPE papel AS ENUM ('admin', 'superuser', 'usuario');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Usuários: o primeiro cadastro do site vira admin
CREATE TABLE IF NOT EXISTS usuarios (
  id          serial PRIMARY KEY,
  nome        text NOT NULL CHECK (length(nome) BETWEEN 1 AND 80),
  email       text NOT NULL CHECK (length(email) BETWEEN 3 AND 200),
  senha_hash  text NOT NULL,
  papel       papel NOT NULL DEFAULT 'usuario',
  criado_em   timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX IF NOT EXISTS usuarios_email_unico ON usuarios (lower(email));

-- Empresas: as casas e marcas que fabricam os cafés
CREATE TABLE IF NOT EXISTS empresas (
  id          serial PRIMARY KEY,
  slug        text NOT NULL UNIQUE,
  nome        text NOT NULL CHECK (length(nome) BETWEEN 1 AND 80),
  cidade      text,
  site        text,
  sobre       text,
  criado_por  integer REFERENCES usuarios(id) ON DELETE SET NULL,
  criado_em   timestamptz NOT NULL DEFAULT now()
);

-- Cafés
CREATE TABLE IF NOT EXISTS cafes (
  id          serial PRIMARY KEY,
  slug        text NOT NULL UNIQUE,
  nome        text NOT NULL CHECK (length(nome) BETWEEN 1 AND 80),
  empresa_id  integer REFERENCES empresas(id) ON DELETE SET NULL,
  pais        char(2),
  regiao      text,
  altitude    integer CHECK (altitude BETWEEN 0 AND 5000),
  processo    text,
  torra       text,
  notas       text[] NOT NULL DEFAULT '{}',
  sobre       text,
  detalhes    jsonb NOT NULL DEFAULT '[]',   -- linhas extras da ficha: [["Variedade", "Obatã"], ...]
  observacao  text,
  preparos    jsonb NOT NULL DEFAULT '[]',   -- métodos sugeridos: [{"m": "v60", "p": "fru"}, ...]
  criado_por  integer REFERENCES usuarios(id) ON DELETE SET NULL,
  criado_em   timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS cafes_empresa ON cafes (empresa_id);

-- Receitas de cada café
CREATE TABLE IF NOT EXISTS receitas (
  id          serial PRIMARY KEY,
  cafe_id     integer NOT NULL REFERENCES cafes(id) ON DELETE CASCADE,
  titulo      text NOT NULL CHECK (length(titulo) BETWEEN 1 AND 60),
  metodo      text NOT NULL,
  cafe_g      numeric(6,1),
  agua_ml     numeric(7,1),
  temp_c      integer CHECK (temp_c BETWEEN 0 AND 100),
  moagem      text,
  tempo       text,
  passos      text[] NOT NULL DEFAULT '{}',
  criado_por  integer REFERENCES usuarios(id) ON DELETE SET NULL,
  criado_em   timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS receitas_cafe ON receitas (cafe_id);

-- Perfil do usuário (página perfil.html)
ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS usuario          text CHECK (usuario ~ '^[a-z0-9_.]{3,30}$');
ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS telefone         text CHECK (length(telefone) <= 20);
ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS cidade           text CHECK (length(cidade) <= 60);
ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS bio              text CHECK (length(bio) <= 300);
ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS metodo_favorito  text;
ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS cafe_favorito_id integer REFERENCES cafes(id) ON DELETE SET NULL;
ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS perfil_favorito  text;
ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS moedor           text CHECK (length(moedor) <= 60);
ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS xicaras_dia      integer CHECK (xicaras_dia BETWEEN 0 AND 20);
ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS nivel            text;
CREATE UNIQUE INDEX IF NOT EXISTS usuarios_usuario_unico ON usuarios (lower(usuario));
