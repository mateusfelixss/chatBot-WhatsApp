const wppconnect = require('@wppconnect-team/wppconnect');


wppconnect.create({
    session: 'session',
    pupperteerOptions: {args: ['--no-sandbox']}
})
    .then((client) => start(client))
    .catch((error) => console.log(error));


function start(client) {
    client.onMessage((message) => {
        console.log('Mensagem enviada pelo usuario ' + message.body);
        client.sendText(message.from, 'Essa mensagem foi enviada por chatBot, é um teste do Mateus')
            .then((result) => {
                console.log('SUCESSO: ', result);
            })
            .catch((error) => {
                console.error('ERRO: ', error)
            })
    });
}