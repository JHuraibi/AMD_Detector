const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

exports.newUserSignUp = functions.auth.user().onCreate(user => {

    admin.firestore().collection('users').doc(user.uid).set({
        email: user.email,
        testResults: []
    })
});

