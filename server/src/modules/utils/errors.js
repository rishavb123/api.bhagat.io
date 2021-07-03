export async function wrapWithErrorHandling(func, errorCallback=null) {
    try {
        return await func();
    } catch (e) {
        console.log(`Error in ${func.name}:`, e);
        if (errorCallback) {
            errorCallback(e);
        }
    }
}