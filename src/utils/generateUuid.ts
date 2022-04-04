export const generateUUID = () =>
    window?.crypto.randomUUID?.() ??
    window.URL.createObjectURL(new Blob([])).substring(31);
