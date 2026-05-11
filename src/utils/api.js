export const BASE_URL = 'http://localhost:3009';

// ─── Auth Helpers ─────────────────────────────────────────────────────────────

export const getToken = () => {
    if (typeof window !== 'undefined') return localStorage.getItem('token');
    return null;
};

export const getUserData = () => {
    if (typeof window !== 'undefined') {
        const raw = localStorage.getItem('user_data');
        if (raw) try { return JSON.parse(raw); } catch { return null; }
    }
    return null;
};

export const clearAuth = () => {
    if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user_data');
    }
};

export const isAuthenticated = () => !!getToken();

export const getHeaders = (isFormData = false) => {
    const headers = { 'Accept': '*/*' };
    if (!isFormData) headers['Content-Type'] = 'application/json';
    const token = getToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;
    return headers;
};

// Generic error handler
const handleResponse = async (res) => {
    const data = await res.json();
    if (!res.ok) throw new Error(data?.settings?.message || `HTTP ${res.status}`);
    return data;
};

// ─── Auth ─────────────────────────────────────────────────────────────────────

export const login = async (email, password) => {
    const res = await fetch(`${BASE_URL}/users/users-login`, {
        method: 'POST',
        headers: { 'Accept': '*/*', 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok || data?.settings?.success === 0)
        throw new Error(data?.settings?.message || 'Login failed');
    if (typeof window !== 'undefined') {
        localStorage.setItem('token', data.data.token);
        localStorage.setItem('user_data', JSON.stringify(data.data.user_data));
    }
    return data;
};

// ─── Hostels / Properties ─────────────────────────────────────────────────────

export const fetchHostels = async (params = {}) => {
    const qs = new URLSearchParams({
        page: params.page || 1,
        limit: params.limit || 50,
    }).toString();
    const res = await fetch(`${BASE_URL}/core/hostle-list?${qs}`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({
            page: params.page || 1,
            limit: params.limit || 50,
            sort: params.sort || {},
            filters: params.filters || {},
            search: params.search || {},
            is_dropdown: params.is_dropdown || 'string',
        }),
    });
    return handleResponse(res);
};

// ─── Students ─────────────────────────────────────────────────────────────────

export const fetchStudents = async (params = {}) => {
    const qs = new URLSearchParams({
        page: params.page || 1,
        limit: params.limit || 50,
    }).toString();
    const res = await fetch(`${BASE_URL}/users/students-list?${qs}`, {
        method: 'GET',
        headers: getHeaders(),
    });
    return handleResponse(res);
};

export const fetchStudentDetails = async (id) => {
    const res = await fetch(`${BASE_URL}/users/students-details/${id}`, {
        method: 'GET',
        headers: getHeaders(),
    });
    return handleResponse(res);
};

export const addStudent = async (body) => {
    const res = await fetch(`${BASE_URL}/users/students-add`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(body),
    });
    return handleResponse(res);
};

// ─── Property Managers ────────────────────────────────────────────────────────

export const fetchPropertyManagers = async (params = {}) => {
    const qs = new URLSearchParams({
        page: params.page || 1,
        limit: params.limit || 50,
    }).toString();
    const res = await fetch(`${BASE_URL}/users/property-managers-list?${qs}`, {
        method: 'GET',
        headers: getHeaders(),
    });
    return handleResponse(res);
};

export const fetchPropertyManagerDetails = async (id) => {
    const res = await fetch(`${BASE_URL}/users/property-managers-details/${id}`, {
        method: 'GET',
        headers: getHeaders(),
    });
    return handleResponse(res);
};

export const addPropertyManager = async (body, isFormData = false) => {
    const headers = getHeaders(isFormData);
    const res = await fetch(`${BASE_URL}/users/property-managers-add`, {
        method: 'POST',
        headers,
        body: isFormData ? body : JSON.stringify(body),
    });
    return handleResponse(res);
};

export const updatePropertyManager = async (id, body, isFormData = false) => {
    const headers = getHeaders(isFormData);
    const res = await fetch(`${BASE_URL}/users/property-managers-update/${id}`, {
        method: 'PATCH',
        headers,
        body: isFormData ? body : JSON.stringify(body),
    });
    return handleResponse(res);
};

export const deletePropertyManager = async (id) => {
    const res = await fetch(`${BASE_URL}/users/property-managers-delete/${id}`, {
        method: 'DELETE',
        headers: getHeaders(),
    });
    return handleResponse(res);
};

export const updateStudent = async (id, body) => {
    const res = await fetch(`${BASE_URL}/users/students-update/${id}`, {
        method: 'PATCH',
        headers: getHeaders(),
        body: JSON.stringify(body),
    });
    return handleResponse(res);
};

// ─── Stays / Bookings ─────────────────────────────────────────────────────────

export const fetchStays = async (params = {}) => {
    const qs = new URLSearchParams({
        page: params.page || 1,
        limit: params.limit || 50,
    }).toString();
    const res = await fetch(`${BASE_URL}/users/stays-list?${qs}`, {
        method: 'GET',
        headers: getHeaders(),
    });
    return handleResponse(res);
};

export const fetchStayDetails = async (id) => {
    const res = await fetch(`${BASE_URL}/users/stays-details/${id}`, {
        method: 'GET',
        headers: getHeaders(),
    });
    return handleResponse(res);
};

export const addStay = async (body) => {
    const res = await fetch(`${BASE_URL}/users/stays-add`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(body),
    });
    return handleResponse(res);
};

export const updateStay = async (id, body) => {
    const res = await fetch(`${BASE_URL}/users/stays-update/${id}`, {
        method: 'PATCH',
        headers: getHeaders(),
        body: JSON.stringify(body),
    });
    return handleResponse(res);
};

// ─── Rooms ────────────────────────────────────────────────────────────────────

export const fetchRooms = async (params = {}) => {
    const qs = new URLSearchParams({
        page: params.page || 1,
        limit: params.limit || 50,
    }).toString();
    const res = await fetch(`${BASE_URL}/core/rooms-list?${qs}`, {
        method: 'GET',
        headers: getHeaders(),
    });
    return handleResponse(res);
};

export const addRoom = async (body) => {
    const res = await fetch(`${BASE_URL}/core/rooms-add`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(body),
    });
    return handleResponse(res);
};

export const updateRoom = async (id, body) => {
    const res = await fetch(`${BASE_URL}/core/rooms-update/${id}`, {
        method: 'PATCH',
        headers: getHeaders(),
        body: JSON.stringify(body),
    });
    return handleResponse(res);
};

export const deleteRoom = async (id) => {
    const res = await fetch(`${BASE_URL}/core/rooms-delete/${id}`, {
        method: 'DELETE',
        headers: getHeaders(),
    });
    return handleResponse(res);
};

// ─── Beds ─────────────────────────────────────────────────────────────────────

export const fetchBeds = async (params = {}) => {
    const qs = new URLSearchParams({
        page: params.page || 1,
        limit: params.limit || 100,
    }).toString();
    const res = await fetch(`${BASE_URL}/core/beds-list?${qs}`, {
        method: 'GET',
        headers: getHeaders(),
    });
    return handleResponse(res);
};

// ─── Payments ─────────────────────────────────────────────────────────────────

export const fetchPayments = async (params = {}) => {
    const qs = new URLSearchParams({
        page: params.page || 1,
        limit: params.limit || 50,
    }).toString();
    const res = await fetch(`${BASE_URL}/finance/payments-list?${qs}`, {
        method: 'GET',
        headers: getHeaders(),
    });
    return handleResponse(res);
};

export const addPayment = async (body) => {
    const res = await fetch(`${BASE_URL}/finance/payments-add`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(body),
    });
    return handleResponse(res);
};

export const updatePayment = async (id, body) => {
    const res = await fetch(`${BASE_URL}/finance/payments-update/${id}`, {
        method: 'PATCH',
        headers: getHeaders(),
        body: JSON.stringify(body),
    });
    return handleResponse(res);
};

// ─── Complaints ───────────────────────────────────────────────────────────────

export const fetchComplaints = async (params = {}) => {
    const qs = new URLSearchParams({
        page: params.page || 1,
        limit: params.limit || 50,
    }).toString();
    const res = await fetch(`${BASE_URL}/operations/complaints-list?${qs}`, {
        method: 'GET',
        headers: getHeaders(),
    });
    return handleResponse(res);
};

export const addComplaint = async (body) => {
    const res = await fetch(`${BASE_URL}/operations/complaints-add`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(body),
    });
    return handleResponse(res);
};

export const updateComplaint = async (id, body) => {
    const res = await fetch(`${BASE_URL}/operations/complaints-update/${id}`, {
        method: 'PATCH',
        headers: getHeaders(),
        body: JSON.stringify(body),
    });
    return handleResponse(res);
};

// ─── Visitor Logs ─────────────────────────────────────────────────────────────

export const fetchVisitors = async (params = {}) => {
    const qs = new URLSearchParams({
        page: params.page || 1,
        limit: params.limit || 50,
    }).toString();
    const res = await fetch(`${BASE_URL}/operations/visitor-logs-list?${qs}`, {
        method: 'GET',
        headers: getHeaders(),
    });
    return handleResponse(res);
};

export const addVisitor = async (body) => {
    const res = await fetch(`${BASE_URL}/operations/visitor-logs-add`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(body),
    });
    return handleResponse(res);
};

// ─── Food Plans ───────────────────────────────────────────────────────────────

export const fetchFoodPlans = async (params = {}) => {
    const qs = new URLSearchParams({
        page: params.page || 1,
        limit: params.limit || 50,
    }).toString();
    const res = await fetch(`${BASE_URL}/core/food-plan-list?${qs}`, {
        method: 'GET',
        headers: getHeaders(),
    });
    return handleResponse(res);
};

export const fetchFoodPlanDetails = async (id) => {
    const res = await fetch(`${BASE_URL}/core/food-plan-details/${id}`, {
        method: 'GET',
        headers: getHeaders(),
    });
    return handleResponse(res);
};

export const addFoodPlan = async (body) => {
    const res = await fetch(`${BASE_URL}/core/food-plan-add`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(body),
    });
    return handleResponse(res);
};

export const updateFoodPlan = async (id, body) => {
    const res = await fetch(`${BASE_URL}/core/food-plan-update/${id}`, {
        method: 'PATCH',
        headers: getHeaders(),
        body: JSON.stringify(body),
    });
    return handleResponse(res);
};

export const deleteFoodPlan = async (id) => {
    const res = await fetch(`${BASE_URL}/core/food-plan-delete/${id}`, {
        method: 'DELETE',
        headers: getHeaders(),
    });
    return handleResponse(res);
};

// ─── Student Food Plans ───────────────────────────────────────────────────────

export const fetchStudentFoodPlans = async (params = {}) => {
    const qs = new URLSearchParams({
        page: params.page || 1,
        limit: params.limit || 50,
        ...(params.stay_id ? { stay_id: params.stay_id } : {}),
    }).toString();
    const res = await fetch(`${BASE_URL}/core/student-food-plan-list?${qs}`, {
        method: 'GET',
        headers: getHeaders(),
    });
    return handleResponse(res);
};

export const fetchStudentFoodPlanDetails = async (id) => {
    const res = await fetch(`${BASE_URL}/core/student-food-plan-details/${id}`, {
        method: 'GET',
        headers: getHeaders(),
    });
    return handleResponse(res);
};

export const addStudentFoodPlan = async (body) => {
    const res = await fetch(`${BASE_URL}/core/student-food-plan-add`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(body),
    });
    return handleResponse(res);
};

export const updateStudentFoodPlan = async (id, body) => {
    const res = await fetch(`${BASE_URL}/core/student-food-plan-update/${id}`, {
        method: 'PATCH',
        headers: getHeaders(),
        body: JSON.stringify(body),
    });
    return handleResponse(res);
};

export const deleteStudentFoodPlan = async (id) => {
    const res = await fetch(`${BASE_URL}/core/student-food-plan-delete/${id}`, {
        method: 'DELETE',
        headers: getHeaders(),
    });
    return handleResponse(res);
};
