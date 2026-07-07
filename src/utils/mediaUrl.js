/**
 * Resolves media asset paths for dev (Vite /media proxy) and production builds.
 * In production, prefixes with VITE_MEDIA_BASE_URL or VITE_WEB_BASE_URL where media is hosted.
 */
export function mediaUrl(path) {
    if (!path) {
        return '';
    }

    if ((path.startsWith('blob:') || path.startsWith('data:'))) {
        return path;
    }

    if (/^(https?:)?\/\//.test(path)) {
        return path;
    }

    const normalized = path.startsWith('/') ? path : `/${path}`;

    if (import.meta.env.DEV) {
        return normalized;
    }

    const base = (import.meta.env.VITE_MEDIA_BASE_URL || import.meta.env.VITE_WEB_BASE_URL || '').replace(
        /\/$/,
        ''
    );

    return base ? `${base}${normalized}` : normalized;
}

/**
 * Resolves image URLs from list/API data: string path, file array, or file-like object.
 */
export function resolveMediaImage(imageData) {
    if (!imageData) {
        return '';
    }

    if (typeof imageData === 'string') {
        return mediaUrl(imageData);
    }

    if (Array.isArray(imageData)) {
        const file = imageData.length > 0 ? imageData[0] : null;
        const rawUrl = file?.objectURL || file?.image;
        return rawUrl ? mediaUrl(rawUrl) : '';
    }

    if (typeof imageData === 'object') {
        const rawUrl = imageData.objectURL || imageData.image;
        return rawUrl ? mediaUrl(rawUrl) : '';
    }

    return '';
}

export function hasMediaImage(imageData) {
    return !!resolveMediaImage(imageData);
}

/**
 * Resolves image paths from import preview data (JSON strings or file objects).
 */
export function resolveImportImageData(imageData) {
    if (!imageData) {
        return '';
    }

    if (typeof imageData === 'string') {
        const trimmed = imageData.trim();
        if (trimmed.startsWith('[') || trimmed.startsWith('{')) {
            try {
                const parsed = JSON.parse(trimmed);
                const resolved = resolveMediaImage(parsed);
                if (resolved) {
                    return resolved;
                }
            } catch {
                // fall through — treat as a plain media path
            }
        }
        return resolveMediaImage(imageData);
    }

    return resolveMediaImage(imageData);
}

/** For import tables: returns a URL or a short fallback label. */
export function formatImportImageData(imageData) {
    const url = resolveImportImageData(imageData);
    if (url) {
        return url;
    }
    if (!imageData) {
        return 'No image';
    }
    return 'Invalid image data';
}
