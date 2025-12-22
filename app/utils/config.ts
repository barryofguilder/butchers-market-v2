export const USE_MIRAGE = import.meta.env.VITE_USE_MIRAGE === 'true';

export const API_URL = USE_MIRAGE ? '' : import.meta.env.VITE_API_URL;
export const API_NAMESPACE = import.meta.env.VITE_API_NAMESPACE;
export const ORDER_ONLINE_URL = import.meta.env.VITE_ORDER_ONLINE_URL;
export const SHOW_ORDER_ONLINE = import.meta.env.VITE_SHOW_ORDER_ONLINE === 'true';
export const UPLOADS_DIR = USE_MIRAGE ? '' : `${import.meta.env.VITE_S3_BUCKET_UPLOADS}/uploads/`;
