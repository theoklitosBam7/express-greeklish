# Quality Notes

## What the API guarantees

- Greeklish input is transliterated to Greek using `greek-utils`.
- Each token is spell-checked with Hunspell dictionary data (`el_GR.aff` + `el_GR.dic`).
- Token-level output includes correction metadata for the canonical v1 endpoint.
- Punctuation is preserved around corrected words.
- Input whitespace is normalized to single spaces in output.

## Known limitations

- Transliteration is heuristic and may alter words from other Latin-script languages.
- Suggestion quality depends on dictionary coverage and may not fit domain-specific terms.
- The spell-check stage works token-by-token and does not model sentence-level grammar.
- Input that is already Greek may still be transformed by transliteration edge behavior.

## Error behavior

- Validation errors return:
  - `BAD_REQUEST` for missing/invalid `text`.
  - `UNPROCESSABLE` for payloads above max supported length.
- Unexpected runtime failures return `INTERNAL`.
- Every error includes `requestId` for traceability.

## Performance model

- Dictionary files are loaded once at startup and reused for all requests.
- Request logs include `requestId`, status code, and elapsed time in milliseconds.
- Use `pnpm benchmark` to establish local throughput and latency baselines.
