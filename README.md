# Baggins Coffee

Guia de moagem, calculadora de proporção, 15 métodos de preparo e uma despensa de cafés, casas e receitas com login e PostgreSQL.

## Estrutura

```
public/          o site (HTML) e os scripts de cada página em public/js/
server/          API em Express (/api) e sessão com cookie
db/              esquema do banco, dados iniciais e scripts de criação
```

## Rodar pela primeira vez

Precisa de Node.js 20.6+ e PostgreSQL. No PowerShell use `npm.cmd` no lugar de `npm` se a execução de scripts estiver bloqueada.

1. `npm install`
2. Copie `.env.example` para `.env` e troque a senha do banco e o `JWT_SECRET`.
3. `npm run db:setup` cria o usuário e o banco (pede a senha do usuário `postgres`).
4. `npm run db:migrate` cria as tabelas e insere as casas e os cafés iniciais. Pode rodar de novo sem duplicar nada.
5. `npm start` e abra http://localhost:3000

## Usuários

O **primeiro cadastro do site vira admin**. Os seguintes entram como usuário.

| Papel | Pode |
|---|---|
| Admin | Tudo, inclusive mudar o papel e remover contas em `/admin.html` |
| Superuser | Remover cafés, casas e receitas de qualquer pessoa |
| Usuário | Cadastrar cafés, casas e receitas, e remover só os seus |

## Banco

Um banco `baggins` com as tabelas `usuarios`, `empresas`, `cafes` e `receitas` (veja `db/schema.sql`). As senhas são guardadas com bcrypt.
