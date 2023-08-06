const wppconnect = require('@wppconnect-team/wppconnect');
const firebasedb = require('./firebase.js');

var userStages = [];

wppconnect.create({
    session: 'whatsbot',
    autoClose: false,
    pupperteerOptions: { args: ['--no-sandbox'] }
})
    .then((client) =>
        client.onMessage((message) => {
            if (message.isGroupMsg === false) {
                console.log('Mensagem digitada pelo USUARIO: ', + message.body);
                queryUserByPhone(client, message);
            }
        }))
    .catch((error) =>
        console.log(error));

// busca por usuario já cadastrado no BD
async function queryUserByPhone(client, message) {
    let phone = (message.from).replace(/[^\d]+/g, '');
    let userdata = await firebasedb.queryByPhone(phone);
    if (userdata == null) {
        userdata = await saveUser(message); 
    }
    console.log('Usuario Corrente: ' + userdata['id']);
    stages(client, message, userdata);
}

//  gerencia fluxo de mensagens
async function stages(client, message, userdata) {    
    if (message.body == 'start')
        sendWppMessage(client, message.from, 'Olá, sou seu assistente pessoal, comigo você poderá guardar sua lista de atividades a fazer! Escolha uma das opções abaixo: \n 1. Criar uma lista de atividades \n 2. Recuperar lista cadastrada');
    else if (message.body == '1') {
        sendWppMessage(client, message.from, 'Beleza! Manda pra mim sua lista em apenas uma mensagem.');
        client.onMessage((message) => {
            console.log('Teste 03: '  + userdata['whatsapp']);
            if (message.isGroupMsg === false && userdata['whatsapp'] == (message.from).replace(/[^\d]+/g, '')) {
                console.log('Messagem Mandada: ' + message.body);
                userdata['activity'] = message.body;
                firebasedb.update(userdata)
                    .then((result) => {
                        sendWppMessage(client, message.from, 'Show, adicionei sua lista.');
                        console.log(result);
                    })
                    .catch((error) => {
                        console.error('ERRO: ', error)
                    })
            }   
        })
    }
    else if (message.body == '2')
        sendWppMessage(client, message.from, userdata['activity']);
}

//funcao de envio de mensagem
function sendWppMessage(client, sendTo, text) {
    client.sendText(sendTo, text)
        .then((result) => {
            console.log('Mensagens enviadas e recebidas com SUCESSO: ', result);
        })
        .catch((error) => {
            console.error('ERRO: ', error)
        })
}

//salvando usuarios no BD
async function saveUser(message) {
    let user = {
        'pushname': (message['sender']['pushname'] != undefined) ? message['sender']['pushname'] : '',
        'whatsapp': (message.from).replace(/[^\d]+/g, '')
    }
    let newUser = firebasedb.save(user);
    return newUser;
}