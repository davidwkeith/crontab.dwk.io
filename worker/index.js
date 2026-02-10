export default {
  async fetch(request, env) {
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
