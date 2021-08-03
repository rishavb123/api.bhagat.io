import { wrapWithErrorHandling } from '../modules/utils/errors';

export function addRoute(route, method, ...handlers) {
    method(route, ...handlers.map((handler) => wrapWithErrorHandling(
        handler,
        `REST ${route}`,
        (e, req, res) => {
            res.json({
                status: 1,
                error: {
                    name: e.name,
                    msg: e.message,
                    trace: e.stack,
                },
            });
        },
    )));
}
