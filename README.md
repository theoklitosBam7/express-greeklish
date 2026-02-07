# express-greeklish

Express API that converts Greeklish text to Greek and applies token-level spell checking.

## Requirements

- Node.js `>=22`
- pnpm `>=10`

## Quick Start (pnpm)

```bash
git clone https://github.com/theoklitosBam7/express-greeklish.git
cd express-greeklish
pnpm install
pnpm dev
```

Server default URL: `http://localhost:7070`

## API Endpoints

### Health

- `GET /healthz`
- `GET /readyz`

### Legacy Compatibility Endpoint

- `GET /api/greeklish?text=...`

Response:

```json
{
  "greek": "Εύηχο: αυτό που ακούγεται ωραία."
}
```

### Canonical v1 Endpoint

- `POST /api/v1/convert`
- Body:

```json
{
  "text": "Euhxo: autw pou akougetai wrea."
}
```

Response:

```json
{
  "input": "Euhxo: autw pou akougetai wrea.",
  "output": "Εύηχο: αυτό που ακούγεται ωραία.",
  "corrected": true,
  "tokens": [{ "index": 0, "input": "Εύηχο:", "output": "Εύηχο:", "corrected": false }],
  "warnings": [],
  "meta": {
    "elapsedMs": 4.11,
    "requestId": "5f53d95f-7e1f-4204-8539-31fa9b7442f0"
  }
}
```

### Error Schema

```json
{
  "error": {
    "code": "BAD_REQUEST",
    "message": "\"text\" is required.",
    "requestId": "5f53d95f-7e1f-4204-8539-31fa9b7442f0"
  }
}
```

## Usage Examples

### curl

```bash
curl -sS \
  -X POST "http://localhost:7070/api/v1/convert" \
  -H "content-type: application/json" \
  -d '{"text":"Euhxo: autw pou akougetai wrea."}'
```

### JavaScript fetch

```js
const response = await fetch('http://localhost:7070/api/v1/convert', {
  method: 'POST',
  headers: { 'content-type': 'application/json' },
  body: JSON.stringify({ text: 'Euhxo: autw pou akougetai wrea.' }),
});

const data = await response.json();
console.log(data.output);
```

### Axios

```js
import axios from 'axios';

const { data } = await axios.post('http://localhost:7070/api/v1/convert', {
  text: 'Euhxo: autw pou akougetai wrea.',
});

console.log(data.output);
```

## Scripts

- `pnpm dev`: run server once via TypeScript runtime.
- `pnpm dev:watch`: run server in watch mode.
- `pnpm build`: compile TypeScript to `dist/`.
- `pnpm start`: run compiled build.
- `pnpm test`: run unit + integration tests.
- `pnpm typecheck`: run strict type checking.
- `pnpm benchmark`: run local benchmark on `POST /api/v1/convert`.
  - Optional env vars: `BENCH_ITERATIONS`, `BENCH_CONCURRENCY`, `BENCH_TEXT`

## Releases and Changelog

The full release/changelog process (Changesets, summary standard, and workflow)
is documented in `CONTRIBUTING.md`.

## Documentation

- Quality notes: `docs/quality-notes.md`

## CI

GitHub Actions workflow runs:

1. `pnpm install --frozen-lockfile`
2. `pnpm typecheck`
3. `pnpm build`
4. `pnpm test`

## Contributing

- Contribution guide: `CONTRIBUTING.md`
- Issue templates: `.github/ISSUE_TEMPLATE/`
