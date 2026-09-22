# Task API - alvo da Trilha D (Pipeline de CI)

API REST simples de lista de tarefas (To-Do List), usada como aplicacao-alvo para
demonstrar um pipeline de integracao continua na atividade da disciplina N698 -
Teste e Validacao de Sistemas.

## Stack

- Node.js 18 + Express
- Jest + Supertest para os testes automatizados
- GitHub Actions para o pipeline de CI

## Endpoints

| Metodo | Rota                  | Descricao                          |
|--------|------------------------|-------------------------------------|
| GET    | /tasks                 | Lista todas as tarefas              |
| POST   | /tasks                 | Cria uma tarefa (`{ "title": "..." }`) |
| PATCH  | /tasks/:id/complete    | Marca uma tarefa como concluida     |
| DELETE | /tasks/:id             | Remove uma tarefa                   |

## Como rodar localmente

```bash
npm install
npm start        # sobe a API em http://localhost:3000
npm test         # roda a suite de testes com relatorio de cobertura
```

## Pipeline de CI

O workflow em `.github/workflows/ci.yml` roda a cada push/PR na branch `main`:

1. **Job `test`**: instala as dependencias, executa a suite de testes (`npm test`)
   com cobertura e publica o relatorio de cobertura como artefato do workflow.
2. **Job `deploy`**: so executa se o job `test` for bem-sucedido (`needs: test` +
   `if: success()`), simulando a etapa de deploy apos o gate de qualidade.
