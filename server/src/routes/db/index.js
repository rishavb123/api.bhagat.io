export default function (app) {
    app.get('/db', (req, res) => {
        res.json({ a: 1 });
    });
}