const API_URL = process.env.NEXT_PUBLIC_BACKEND_API!;

// Global API Request
export async function apiFetch<T> (
    path: string,
    options?: RequestInit
): Promise<T> {
    const response = await fetch(`${API_URL}${path}`, {
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            ...options?.headers,
        },
        ...options
    });
    if (!response.ok) {
        if (response.status === 401) {
            if (typeof window !== "undefined" && !window.location.pathname.includes("/login")) {
                window.location.href = "/login";
            }
        }

        const errorData = await response.json().catch(() => ({ message: "Unknown error" }));
        throw new Error(errorData.message || `API request failed: ${response.status}`);
    }
    return response.json();

}