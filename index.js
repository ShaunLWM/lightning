const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapter = new FileSync(__dirname + '/db.json');
const db = low(adapter);
const shortid = require('shortid');
const fastify = require('fastify')({
    logger: true
});

db.defaults({ urls: [] }).write();

fastify.get('/', (request, reply) => {
    return reply.status(200).send({
        '/s': '/s/<url> - set new long url to short url',
        '/g': '/g/<id> - redirect to long url if id exist',
        '/i': '/i/<id> - get info about id'
    });
});

fastify.get('/s/*', (request, reply) => {
    let url = request.params['*'].trim();
    if (url.length < 1) {
        return reply.status(400).send({
            success: false,
            message: 'No URL in params'
        });
    }

    if (!validateUrl(url)) {
        return reply.status(400).send({
            success: false,
            message: 'Given parameter is not a valid url'
        });
    }

    let id = shortid.generate();
    db.get('urls').push({ s: id, l: url, c: 0 }).write(); // short, long, count
    return reply.send({ id });
});

fastify.get('/g/*', (request, reply) => {
    let id = request.params['*'].trim();
    if (id.length < 1) {
        return reply.status(400).send({
            success: false,
            message: 'No id in params'
        });
    }

    const post = db.get('urls').find({ s: id }).value();
    if (typeof post === 'undefined') {
        return reply.status(400).send({
            success: false,
            message: 'id doesnt exist'
        });
    }

    db.get('urls').find({ s: id }).assign({ c: post.c + 1 }).write();
    return reply.redirect(post.l);
});

fastify.get('/i/*', (request, reply) => { // info
    let id = request.params['*'].trim();
    if (id.length < 1) {
        return reply.status(400).send({
            success: false,
            message: 'no id in params'
        });
    }

    const post = db.get('urls').find({ s: id }).value();
    if (typeof post === 'undefined') {
        return reply.status(400).send({
            success: false,
            message: 'id doesnt exist'
        });
    }
    
    return reply.status(200).send(post);
});

fastify.listen(8081, '0.0.0.0', (err, address) => {
    if (err) {
        fastify.log.error(err);
        return process.exit(1);
    }

    return fastify.log.info(`server listening on ${address}`);
});


function validateUrl(value) {
    return /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})).?)(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(value);
}