const wppconnect = require('@wppconnect-team/wppconnect');
const firebasedb = require('./firebase.js');

var userStages = [];

wppconnect.create({
    session: 'whatsbot',
    autoClose: false,
    // onStateChange: false,
    // onInterfaceChange: false,
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
        userdata = await saveUser(message);   // saveUser so pode receber um parametro
    }
    console.log('Usuario Corrente: ' + userdata['id']);
    stages(client, message, userdata);
}


//  Stages = Boas vindas  >>  Nome  >>  Seu telefone  >> Fim
async function stages(client, message, userdata) {
    if (userStages[message.from] == undefined) {
        sendWppMessage(client, message.from, 'Bem vindo ao Robô de Whatsapp do Mateus! Essas mensagens automaticas');
    }
    if (userdata['nome'] == undefined) {
        if (userStages[message.from] == undefined) {
            sendWppMessage(client, message.from, 'Digite seu *NOME*:');
            userStages[message.from] = 'nome';
        } else {
            userdata['nome'] = message.body;
            firebasedb.update(userdata);
            sendWppMessage(client, message.from, 'Obrigado, ' + message.body);
            sendWppMessage(client, message.from, 'Digite seu *TELEFONE*:');
            userStages[message.from] = 'telefone';
        }

    } else if (userdata['telefone'] == undefined) {
        if (userStages[message.from] == undefined) {
            sendWppMessage(client, message.from, 'Digite seu *TELEFONE*:');
            userStages[message.from] = 'telefone';
        } else {
            userdata['telefone'] = (message.body).replace(/[^\d]+/g, '');
            firebasedb.update(userdata);
            sendWppMessage(client, message.from, 'Obrigada por informar seu telefone: ' + message.body);
            sendWppMessage(client, message.from, 'Digite o recado que você tem para o Mateus: ');
            userStages[message.from] = 'recado';
        }

    } else if (userdata['recado'] == undefined) {
        if (userStages[message.from] == undefined) {
            sendWppMessage(client, message.from, 'Oii, ' +  userdata['nome'] + '. Digite seu *RECADO*:');
            userStages[message.from] = 'recado';
        } else {
            firebasedb.update(userdata);
            sendWppMessage(client, message.from, 'Obrigada por informar seu recado: ' + message.body);
            sendWppMessage(client, message.from, 'Em breve entro em contato. Tchau');
            userStages[message.from] = 'fim';
        }

    } else {
        if (userStages[message.from] == undefined) {
            userStages[message.from] = 'fim';
        }
        sendWppMessage(client, message.from, 'Fim');
    }
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