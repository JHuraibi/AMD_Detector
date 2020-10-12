const signOut = document.querySelector('.sign-out');

// sign out
signOut.addEventListener('click', () => {
  firebase.auth().signOut()
    .then(() => console.log('signed out'));
  window.location = 'index.html';
});

// auth listener
firebase.auth().onAuthStateChanged(user => {
  if (!(user.emailVerified)) {
    alert("Email is not verified");
    authWrapper.classList.add('open');
    authModals[0].classList.add('active');
  } else {

  }
});