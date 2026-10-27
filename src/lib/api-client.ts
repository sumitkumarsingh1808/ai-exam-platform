/**
 * Safe JSON response parser for API calls.
 * Protects against HTML error pages (e.g. Vercel 413 Request Entity Too Large, 504 Gateway Timeout)
 * from crashing client-side code with `SyntaxError: Unexpected token 'R'... is not valid JSON`.
 */
export async function safeParseJson<T = any>(
  res: Response
): Promise<{ ok: boolean; status: number; data?: T; error?: string }> {
  const text = await res.text();
  let json: any = null;

  try {
    json = JSON.parse(text);
  } catch {
    // Non-JSON response (usually from Vercel edge/proxy or Cloudflare)
    if (res.status === 413 || text.toLowerCase().includes("entity too large")) {
      return {
        ok: false,
        status: 413,
        error:
          "The uploaded file is too large for cloud serverless (Vercel max 4.5MB). Please upload a file under 4.2MB, or copy-paste the text/questions directly into the study notes field.",
      };
    }
    if (res.status === 504 || res.status === 408 || text.toLowerCase().includes("timeout")) {
      return {
        ok: false,
        status: res.status,
        error:
          "The AI generation request timed out. Please try generating fewer questions or use a more concise document.",
      };
    }
    if (res.status === 401 || res.status === 403) {
      return {
        ok: false,
        status: res.status,
        error: "Your session has expired. Please log in again to continue.",
      };
    }

    return {
      ok: false,
      status: res.status,
      error: `Server error (${res.status}): ${text.slice(0, 150) || "Invalid server response"}`,
    };
  }

  if (!res.ok) {
    return {
      ok: false,
      status: res.status,
      data: json,
      error: json?.error || `Request failed with status ${res.status}`,
    };
  }

  return {
    ok: true,
    status: res.status,
    data: json,
  };
}
