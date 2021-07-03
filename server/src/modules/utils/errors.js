export function wrapWithErrorHandling(func, errorCallback = null) {
    return async (...args) => {
        try {
            return await func(...args);
        } catch (e) {
            console.log(`Error in ${func.name}:`, e);
            if (errorCallback) {
                errorCallback(e);
            }
        }
    };
}