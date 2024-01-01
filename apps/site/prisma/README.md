# Prisma

1. migrate

```bash
# gen migrate and apply to database
pnpm exec prisma migrate dev --name why-change

# gen ts type
pnpm exec prisma generate

# deploy to new db
pnpm exec prisma migrate deploy
```
