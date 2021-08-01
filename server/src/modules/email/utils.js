export function makeComposeUrl(email, subject = '', body = '', bcc = '', cc = '') {
    const url = `https://mail.google.com/mail/?fs=1&to=${email}&su=${subject}&body=${body}&bcc=${bcc}&cc=${cc}&tf=cm`;
    return url.replace(/ /g, '%20').replace(/\n/g, '%0A');
}

export function validateEmail(email) {
    return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email);
}
