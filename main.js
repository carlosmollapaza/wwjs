const { Client, RemoteAuth } = require('whatsapp-web.js');
const mongoose = require('mongoose');
const { MongoStore } = require('wwebjs-mongo');
const qrcode = require('qrcode-terminal');

mongoose.connect('mongodb://localhost:27017/tienda', {}).then(async () => {
    console.log('Mongo Connected');
    const store = new MongoStore({ mongoose: mongoose });
    const client = new Client({
        authStrategy: new RemoteAuth({
            clientId: "Carlos",
            store: store,
            backupSyncIntervalMs: 60000
        })
    });

    client.on('qr', qr => {
        console.log('Escanea el código QR con tu teléfono:');
        qrcode.generate(qr, { small: true });
    });

    client.on('ready', () => {
        console.log('Cliente listo');
        console.log('Hora de conexión:', new Date().toLocaleString());
    });
	
    client.on('message', message => {
        console.log('Mensaje recibido:', message.body);
    });

    client.on('remote_session_saved', () => {
        console.log('-----------------------------------')
        console.log('Session Guardada')
    })
    client.on('disconnected', (reason) => {
        console.log('Client was logged out-----', reason);
    })
    client.initialize();

}).catch(error => {
    console.log('Error Mongo Connected:', error);
});