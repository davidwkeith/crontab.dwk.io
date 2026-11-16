interface Env {
  ASSETS: { fetch(request: Request | URL): Promise<Response> };
}

// Missing paths get the custom 404 page with a real 404 status. That is done
// by `not_found_handling = "404-page"` in wrangler.toml, so no fallback logic
// is needed here.
export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    return env.ASSETS.fetch(request);
  },
};
