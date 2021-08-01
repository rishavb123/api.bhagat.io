export function makeComposeUrl(email, subject = '', body = '', bcc = '', cc = '') {
    cc = 'test@bhagat.io';
    return `https://mail.google.com/mail/?fs=1&to=${email}&su=${subject}&body=${body}&bcc=${bcc}&cc=${cc}&tf=cm`
}