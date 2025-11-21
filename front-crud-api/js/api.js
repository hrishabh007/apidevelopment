async function apiFetch(path, options = {}) {
    const token = localStorage.getItem('token');

    const headers = {
        ...(options.headers || {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };

    const finalUrl = path.startsWith('http')
        ? path
        : window.location.origin + path;

    const response = await fetch(finalUrl, {
        ...options,
        headers,
    });

    // 👇 Handle EXPIRED or INVALID token
    if (response.status === 401 || response.status === 403) {
        localStorage.removeItem('token');  // 🔥 remove token immediately

        let msg = "Session expired. Please login again.";

        try {
            const body = await response.json();
            if (body.message) msg = body.message;
        } catch (_) {}

        alert(msg);
        window.location.href = "/"; // 🔁 redirect to login page
        throw new Error(msg);
    }

    if (!response.ok) {
        let err = "Request failed";
        try {
            const body = await response.json();
            if (body.message) err = body.message;
        } catch (_) {}

        throw new Error(err);
    }

    return response.json();
}
