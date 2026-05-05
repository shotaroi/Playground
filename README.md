# Todo app

A small full-stack todo list: a **React** single-page app talks to a **Spring Boot** REST API backed by an **H2** in-memory database.

## Repository layout

| Directory   | Description                                              |
| ----------- | -------------------------------------------------------- |
| `todo-api/` | Spring Boot 3.4 REST API (Java 17, JPA, H2)              |
| `todo-web/` | React 19 + TypeScript frontend (Vite 8)                 |

## Prerequisites

- **Java 17** and **Maven** (for the API)
- **Node.js** (current LTS recommended) and **npm** (for the web app)

## Run the API

From `todo-api/`:

```bash
mvn spring-boot:run
```

The server listens on **http://localhost:8080** by default.

The app uses an **in-memory H2** database; stopping the process clears stored todos.

## Run the web app

From `todo-web/`:

```bash
npm install
npm run dev
```

The dev server proxies requests under `/api` to `http://localhost:8080`, so start the API first (or you will see failed requests when loading or mutating todos).

- **Production build:** `npm run build`
- **Preview production build:** `npm run preview`
- **Lint:** `npm run lint`

## API reference

Base path: **`/api/todos`**

| Method   | Path            | Description                    |
| -------- | --------------- | ------------------------------ |
| `GET`    | `/api/todos`    | List all todos                 |
| `GET`    | `/api/todos/{id}` | Get one todo by id          |
| `POST`   | `/api/todos`    | Create a todo                  |
| `PATCH`  | `/api/todos/{id}` | Partial update (title, `completed`) |
| `DELETE` | `/api/todos/{id}` | Delete a todo              |

### Request and response shapes

**Create** (`POST /api/todos`, JSON body):

```json
{ "title": "string (required, max 500 characters)" }
```

**Update** (`PATCH /api/todos/{id}`, JSON body; fields optional):

```json
{ "title": "string (optional, max 500)", "completed": true }
```

**Todo** (response):

```json
{
  "id": 1,
  "title": "string",
  "completed": false,
  "createdAt": "2026-05-06T12:00:00Z",
  "updatedAt": "2026-05-06T12:00:00Z"
}
```

Typical HTTP status codes: `201` for create, `204` for successful delete, `404` when the id does not exist.

## Tests (API)

From `todo-api/`:

```bash
mvn test
```
