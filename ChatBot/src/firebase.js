const firebaseAdmin = require('firebase-admin');

//conexao com o Banco de Dados Firebase
const firebaseServiceAccount = require('../botwhatsapp-2defa-firebase-adminsdk-auq4q-7ed33833a6.json');
firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert(firebaseServiceAccount)
});
const db = firebaseAdmin.firestore();

//export da funçao de salvamento
exports.save = async function (user){
    user['date'] = firebaseAdmin.firestore.Timestamp.fromDate(new Date());
    let newRegister = await db.collection('usuarios').add(user);
    user['id'] = newRegister.id;
    return user;
}

exports.queryByPhone = async function (phone) {
    let userdata = null;
    try{
        const queryRef = await db.collection('usuarios')
            .where('whatsapp', '==', phone)
            .get();
        if(!queryRef.empty){
            queryRef.forEach((user) => {
                userdata = user.data();
                userdata['id'] = user.id;
            });
        }
    } catch(_error){
        console.log(_error);
    }
    return userdata;
}

exports.update = async function (userdata) {
    const userRegister = await db.collection('usuarios').doc(userdata['id']).set(userdata);
    return userRegister;
}