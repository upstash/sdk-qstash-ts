import type { PublishRequest } from "../client";

/**
 * Appends necessary LLM (Language Model) options such as the required token and authorization header to the request.
 *
 * This function checks the `provider` property in the request to determine which provider
 * to use and appends the appropriate options.
 *
 * @param request - The request object which may contain `provider` that holds `token` and `baseUrl`.
 * @param headers - The Headers object to which the authorization token will be appended.
 *
 * @template TBody - The type of the request body.
 * @template TRequest - The type of the publish request extending `PublishRequest`.
 */
export function appendLLMOptions<
  TBody = unknown,
  TRequest extends PublishRequest<TBody> = PublishRequest<TBody>,
>(request: TRequest, headers: Headers) {
  // If the provider owner is "upstash", switch request API to "llm" and exit the function.
  if (request.provider?.owner === "upstash") {
    request.api = "llm";
    return;
  }

  // Append mandatory fields for calling 3rd party providers
  if ("provider" in request) {
    const provider = request.provider;

    if (!provider?.baseUrl) throw new Error("baseUrl cannot be empty or undefined!");
    if (!provider.token) throw new Error("token cannot be empty or undefined!");

    request.url = `${provider.baseUrl}/v1/chat/completion`;
    headers.set("Authorization", `Bearer ${provider.token}`);
  }
}
