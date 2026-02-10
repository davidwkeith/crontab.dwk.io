# crontab clock

[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)

A simple web app to show the current time in crontab format.

## Development

```sh
npm install
npm test
```

## Cloudflare Workers

This project deploys as a Worker that serves the Eleventy build output from `/_site`.

```sh
npm run build
npx wrangler deploy
```

## Notes

- CSP is strict and uses a build-time nonce for inline scripts/styles.
- Favicons are generated from `img/favicon.svg`; `favicon.ico` is built via `png-to-ico`.
- ActivityPub/WebFinger endpoints are intentionally disabled.

## License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.
