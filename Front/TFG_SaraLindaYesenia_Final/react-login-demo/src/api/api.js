

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:9001';

export async function apiGet(path) {
  try {
    const res = await fetch(`${BASE_URL}${path}`, {
      method: 'GET',
      credentials: 'include', // 🔹 importante
      headers: { 'Content-Type': 'application/json' },
    });
    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(errorText || `Error GET ${path}`);
    }
    return await res.json();
  } catch (error) {
    console.error('GET request failed:', error);
    throw error;
  }
}

export async function apiPost(path, body) {
  try {
    const res = await fetch(`${BASE_URL}${path}`, {
      method: 'POST',
      credentials: 'include', // 🔹 importante
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(errorText || `Error POST ${path}`);
    }
    return await res.json();
  } catch (error) {
    console.error('POST request failed:', error);
    throw error;
  }
}

export async function apiPut(path, body) {
  try {
    const res = await fetch(`${BASE_URL}${path}`, {
      method: 'PUT',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(errorText || `Error PUT ${path}`);
    }
    return await res.json();
  } catch (error) {
    console.error('PUT request failed:', error);
    throw error;
  }
}

export async function apiDelete(path) {
  try {
    const res = await fetch(`${BASE_URL}${path}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(errorText || `Error DELETE ${path}`);
    }
    return true;
  } catch (error) {
    console.error('DELETE request failed:', error);
    throw error;
  }
}
