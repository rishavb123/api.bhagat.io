export function wrapWithErrorHandling(func, name, errorCallback = null) {
    return async (...args) => {
        try {
            return await func(...args);
        } catch (e) {
            console.log(`Error in ${name}:`, e);
            if (errorCallback) {
                errorCallback(e, ...args);
            }
        }
    };
}