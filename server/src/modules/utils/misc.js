export const delay = (time) => new Promise((res)=>setTimeout(res, time));
export function toTitleCase(str) {
    return str.replace(
        /\w\S*/g,
        function(txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        },
    );
}
