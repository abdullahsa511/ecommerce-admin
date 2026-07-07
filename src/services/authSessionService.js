import axios from 'axios';

const LOGIN_CODE_QUERY_KEY = 'code';
const LOGIN_STATE_QUERY_KEY = 'state';
const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/+$/, '');
const VALIDATE_TOKEN_URL = `${API_BASE_URL}/admin/validate-token`;
const EXCHANGE_CODE_URL = `${API_BASE_URL}/admin/exchange-code`;

let sessionAuthRegistered = false;

function getAdminBaseUrl() {
    const fromEnv = (import.meta.env.VITE_STATIC_BASE_URL || '').replace(/\/+$/, '');
    if (fromEnv) {
        return fromEnv;
    }

    if (typeof window !== 'undefined') {
        return window.location.origin.replace(/\/+$/, '');
    }

    return '';
}

function getLoginBaseUrl() {
    const fromEnv = (import.meta.env.VITE_WEB_BASE_URL || '').replace(/\/+$/, '');
    if (fromEnv) {
        return fromEnv;
    }

    const adminBase = getAdminBaseUrl();
    if (adminBase) {
        return adminBase;
    }

    if (typeof window !== 'undefined') {
        return window.location.origin.replace(/\/+$/, '');
    }

    return '';
}

function buildAdminPageUrl(route) {
    const base = getAdminBaseUrl();
    const path = route?.fullPath || route?.path || '/';
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;

    return `${base}${normalizedPath}`;
}

function normalizeRedirectToAdminBase(redirectUrl) {
    if (!redirectUrl || typeof redirectUrl !== 'string') {
        return '';
    }

    const trimmed = redirectUrl.trim();
    if (!trimmed) {
        return '';
    }

    const adminBase = getAdminBaseUrl();
    if (!adminBase) {
        return trimmed;
    }

    try {
        const parsed = new URL(trimmed);
        return `${adminBase}${parsed.pathname}${parsed.search}${parsed.hash}`;
    } catch (_error) {
        const normalizedPath = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
        return `${adminBase}${normalizedPath}`;
    }
}

function buildAdminLoginUrl(redirectUrl) {
    const loginBase = `${getLoginBaseUrl()}/admin/login`;
    const normalizedRedirect = normalizeRedirectToAdminBase(redirectUrl);

    if (!normalizedRedirect) {
        return loginBase;
    }

    const params = new URLSearchParams({ redirect: normalizedRedirect });
    return `${loginBase}?${params.toString()}`;
}

function buildUnauthorized401Redirect(route) {
    return {
        name: 'unauthorized-401',
        query: {
            redirect: buildAdminPageUrl(route)
        }
    };
}

function registerAxiosSessionAuth() {
    if (sessionAuthRegistered) {
        return;
    }

    axios.defaults.withCredentials = true;
    axios.defaults.xsrfCookieName = 'XSRF-TOKEN';
    axios.defaults.xsrfHeaderName = 'X-CSRF-TOKEN';
    sessionAuthRegistered = true;
}

function removeAuthCallbackQueryParams(route) {
    const nextQuery = { ...route.query };
    delete nextQuery[LOGIN_CODE_QUERY_KEY];
    delete nextQuery[LOGIN_STATE_QUERY_KEY];

    return {
        path: route.path,
        query: nextQuery,
        hash: route.hash,
        replace: true
    };
}

async function consumeCodeFromRouteQuery(route) {
    const rawCode = route.query?.[LOGIN_CODE_QUERY_KEY];
    const rawState = route.query?.[LOGIN_STATE_QUERY_KEY];
    const code = Array.isArray(rawCode) ? rawCode[0] : rawCode;
    const state = Array.isArray(rawState) ? rawState[0] : rawState;

    if (!code || typeof code !== 'string' || !code.trim()) {
        return { handled: false, success: false, redirect: null };
    }

    try {
        const payload = { code: code.trim() };
        if (typeof state === 'string' && state.trim()) {
            payload.state = state.trim();
        }

        await axios.post(EXCHANGE_CODE_URL, payload, {
            withCredentials: true
        });

        return {
            handled: true,
            success: true,
            redirect: removeAuthCallbackQueryParams(route)
        };
    } catch (_error) {
        return {
            handled: true,
            success: false,
            redirect: buildUnauthorized401Redirect(route)
        };
    }
}

async function validateSession() {
    try {
        await axios.get(VALIDATE_TOKEN_URL, {
            withCredentials: true
        });
        return true;
    } catch (_error) {
        return false;
    }
}

export {
    buildAdminLoginUrl,
    buildAdminPageUrl,
    buildUnauthorized401Redirect,
    consumeCodeFromRouteQuery,
    registerAxiosSessionAuth,
    validateSession
};
