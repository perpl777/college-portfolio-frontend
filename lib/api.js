export async function fetcher(url, options = {}) {
    let response;
    if (!options) {
        response = await fetch(url);
    } else {
        response = await fetch(url, options);
    }
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
}