export const BASE_URL = 'https://trang-weldable-semiacademically.ngrok-free.dev';

export const fetchHostels = async (params = {}) => {
    const response = await fetch(`${BASE_URL}/core/hostle-list`, {
        method: 'POST',
        headers: {
            'accept': '*/*',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            page: params.page || 0,
            limit: params.limit || 0,
            sort: params.sort || {},
            filters: params.filters || {},
            search: params.search || {},
            is_dropdown: params.is_dropdown || "string"
        })
    });

    if (!response.ok) {
        throw new Error('Failed to fetch hostels');
    }

    return await response.json();
};
