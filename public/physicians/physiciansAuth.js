const physicianForm = document.querySelector('.physician');
physicianForm.addEventListener('submit', (e) => {
  e.preventDefault();

  // get user info
  const email = physicianForm.email.value;
  const password = physicianForm.password.value;

  // sign up the user & add firestore data
  firebase.auth().createUserWithEmailAndPassword(email, password).then(cred => {
    return db.collection('users').doc(cred.user.uid).set({
      email: physicianForm['email'].value,
      firstname: physicianForm['firstname'].value,
      lastname: physicianForm['lastname'].value,
      title: physicianForm['title'].value,
      location: physicianForm['location'].value,
      type: 'physician'
    });
  }).then(() => {
    var user = firebase.auth().currentUser;
    user.sendEmailVerification();
    console.log(user.uid);
    alert("verification email sent");
    console.log('Email verification sent', user);
    window.location = '../index.html';
  }).catch(error => {
    physicianForm.querySelector('.error').textContent = error.message;
  });

});
