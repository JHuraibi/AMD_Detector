const authSwitchLinks = document.querySelectorAll('.switch');
const authModals = document.querySelectorAll('.auth .modal');
const authWrapper = document.querySelector('.auth');
const loginForm = document.querySelector('.login');
const registerForm = document.querySelector('.register');
var usertype;

authSwitchLinks.forEach(link => {
  link.addEventListener('click', () => {
    authModals.forEach(modal => modal.classList.toggle('active'));
  });
});

registerForm.addEventListener('submit', (e) => {
  e.preventDefault();

  

  // get user info
  const email = registerForm.email.value;
  const password = registerForm.password.value;

  // sign up the user & add firestore data
  firebase.auth().createUserWithEmailAndPassword(email, password).then(cred => {
    return db.collection('users').doc(cred.user.uid).set({
      email: registerForm['email'].value,
      firstname: registerForm['firstname'].value,
      lastname: registerForm['lastname'].value,
      birthday: registerForm['birthdate'].value,
      gender: registerForm['gender'].value,
      testSpeeds: 1,
      type: user
    });
  }).then(() => {
    var user = firebase.auth().currentUser;
    user.sendEmailVerification();
    console.log(user.uid);
    db.collection("TestResults")
      .doc(user.uid).set({
        exists: true
      });
    alert("verification email sent");
    console.log('Email verification sent', user);
    window.location = 'index.html';
  }).catch(error => {
    registerForm.querySelector('.error').textContent = error.message;
  });



});

// login form
loginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const email = loginForm.email.value;
  const password = loginForm.password.value;

  firebase.auth().signInWithEmailAndPassword(email, password)
    .then(user => {
      var user = firebase.auth().currentUser;
      getType();
      if (!(user.emailVerified)) {
        alert("Email not verified");
        loginForm.reset();
      }
    })
    .catch(error => {
      loginForm.querySelector('.error').textContent = error.message;
    });
});

async function getType() {
  //let user = await firebase.auth().currentUser;
  await firebase.auth().onAuthStateChanged(user => {
      if (user) {
          id = user.uid;
          console.log(id);
          db.collection("users").doc(user.uid)
              .get()
              .then(doc => {

                  let type = (doc.data().type);
                  usertype = type;
                  console.log(usertype);
                  if(usertype == 'physician'){
                    loginForm.reset();
                    console.log("true")
                    window.location = 'physicians/physiciansHome.html';
                  }
                  else {
                    console.log('logged in', user);
                    loginForm.reset();
                    window.location = 'home.html'; 
                  } 
              });
      }
  });
}


