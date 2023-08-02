const wppconnect = require('@wppconnect-team/wppconnect');

var userStages = [];

wppconnect.create({
    session: 'session',
    pupperteerOptions: { args: ['--no-sandbox'] }
})
    .then((client) =>
        client.onMessage((message) => {
            console.log('Mensagem digitada pelo USUARIO: ', + message.body);
            stages(client, message);
        }))
    .catch((error) =>
        console.log(error));

//  Stages = Boas vindas  >>  Nome  >>  Seu telefone  >> Fim
function stages(client, message) {
    stage = userStages[message.from];
    switch (stage) {
        case 'Nome':
            const nome = message.body;
            sendWppMessage(client, message.from, 'Obrigado, ' + nome);
            sendWppMessage(client, message.from, 'Digite seu *TELEFONE* para eu entrar em contato:');
            userStages[message.from] = 'telefone';
            break;
        case 'telefone':
            const telefone = message.body;
            sendWppMessage(client, message.from, 'Obrigado por informar seu telefone: ' + telefone + 'Entrarei em contato assim que possivel');
            sendWppMessage(client, message.from, 'Agora, poderia informar sua data de nascimento: ');
            userStages[message.from] = 'nascimento';
            break;

        case 'nascimento':
            const dataNascimento = message.body;
            sendWppMessage(client, message.from, 'Obrigado por informar sua data de nascimento: ' + dataNascimento + '. Entrarei em contato assim que possivel. Até logo.');
            sendWppMessage(client, message.from, 'Fim');
            userStages[message.from] = 'Fim';
            break;
        case 'Fim':
            sendWppMessage(client, message.from, 'Fim');
            break;
        default: // Olá 
            console.log('*Usuário atual* from:' + message.from);
            sendWppMessage(client, message.from, 'Bem vindo ao Robô do Mateus. Essa mensagem é automatica.');
            sendWppMessage(client, message.from, 'Digite seu *NOME*:');
            userStages[message.from] = 'Nome';
    }
}

function sendWppMessage(client, sendTo, text) {
    client.sendText(sendTo, text)
        .then((result) => {
            console.log('Mensagens enviadas e recebidas com SUCESSO: ', result);
        })
        .catch((error) => {
            console.error('ERRO: ', error)
        })
}