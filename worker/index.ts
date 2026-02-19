interface Env {
  ASSETS: { fetch(request: Request | URL): Promise<Response> };
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const response = await env.ASSETS.fetch(request);
    if (response.status !== 404) {
      return response;
    }

    const url = new URL(request.url);
    const notFoundUrl = new URL('/404.html', url);
    const notFoundRequest = new Request(notFoundUrl, request);
    return env.ASSETS.fetch(notFoundRequest);
  },
};
