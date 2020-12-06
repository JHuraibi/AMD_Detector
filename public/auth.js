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

  //error handling
  try {
    if (registerForm['firstname'].value == "") {
      throw "Error: Enter a First Name";
    }
    if (registerForm['lastname'].value == "") {
      throw "Error: Enter a Last Name";
    }
    if (registerForm['birthdate'].value == "") {
      throw "Error: Enter a Birthdate";
    }
    if (registerForm['email'].value == "") {
      throw "Error: Enter an email";
    }
  } catch (error) {
    registerForm.querySelector('.error').textContent = error;
    return;
  }

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
      type: "user"
    });
  }).then(() => {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        id = user.uid;
        console.log(id);
        db.collection("TestResults").doc(id).set({
          exists: true
        }).then(() => { sendemail(); });
      }
    });
    //window.location = 'index.html';
  }).catch(error => {
    registerForm.querySelector('.error').textContent = error.message;
  });

  // sign up the user & add firestore data
  firebase.auth().createUserWithEmailAndPassword(email, password).then(cred => {
    return db.collection('users').doc(cred.user.uid).set({
      email: registerForm['email'].value,
      firstname: registerForm['firstname'].value,
      lastname: registerForm['lastname'].value,
      birthday: registerForm['birthdate'].value,
      gender: registerForm['gender'].value,
      testSpeeds: 1,
      type: "user"
    });
  }).then(() => {
    /* var user = firebase.auth().currentUser;
    user.sendEmailVerification() */;
    //console.log(user.uid);
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        id = user.uid;
        console.log(id);
        db.collection("TestResults").doc(id).set({
          exists: true,
          firstTest: true
        }).then(() => { sendemail(); });
      }
    });
    //window.location = 'index.html';
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
      if (!(user.emailVerified)) {
        alert("Email not verified");
        loginForm.reset();
        return;
      } else
        getType();
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
          if (usertype == 'physician') {
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

async function sendemail() {
  var user = firebase.auth().currentUser;
  await user.sendEmailVerification().then(
    function () {
      alert("verification email sent");
      window.location.replace("./index.html");
    }).catch(function (error) {
      alert("verification email sent");
      console.log("Error sending verification email: " + error);
    });
}

