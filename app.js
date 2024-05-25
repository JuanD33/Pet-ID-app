// Your Firebase configuration
const firebaseConfig = {
 apiKey: "AIzaSyDkUZWBzCvO6UDblJMvc5suwgd-7TWPMOM",
  authDomain: "flying-chimp-pet-tag.firebaseapp.com",
  projectId: "flying-chimp-pet-tag",
  storageBucket: "flying-chimp-pet-tag.appspot.com",
  messagingSenderId: "429165684650",
  appId: "1:429165684650:web:665422bbce694ea658edd3",
  measurementId: "G-EBCWWSBJ4G"
"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// Authentication
function signIn() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  auth.signInWithEmailAndPassword(email, password).catch(error => alert(error.message));
}

function signUp() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  auth.createUserWithEmailAndPassword(email, password).catch(error => alert(error.message));
}

auth.onAuthStateChanged(user => {
  if (user) {
    document.getElementById('auth-container').style.display = 'none';
    document.getElementById('profile-container').style.display = 'block';
    fetchProfiles(user.uid);
  } else {
    document.getElementById('auth-container').style.display = 'block';
    document.getElementById('profile-container').style.display = 'none';
  }
});

// CRUD Operations
function fetchProfiles(userId) {
  db.collection('profiles').where('userId', '==', userId).get().then(snapshot => {
    const profileList = document.getElementById('profile-list');
    profileList.innerHTML = '';
    snapshot.forEach(doc => {
      const data = doc.data();
      const profileDiv = document.createElement('div');
      profileDiv.className = 'profile';
      profileDiv.innerHTML = `
        <h3>${data.petName}</h3>
        <p>Type: ${data.petType}</p>
        <p>Breed: ${data.breed}</p>
        <p>Age: ${data.age}</p>
        <p>Description: ${data.description}</p>
        <img src="${data.photoUrl}" alt="${data.petName}">
        <button onclick="showEditForm('${doc.id}')">Edit</button>
        <button onclick="deleteProfile('${doc.id}')">Delete</button>
      `;
      profileList.appendChild(profileDiv);
    });
  });
}

function showCreateForm() {
  const formContainer = document.getElementById('form-container');
  formContainer.innerHTML = `
    <h2>Create Profile</h2>
    <form onsubmit="createProfile(event)">
      <input type="text" id="petName" placeholder="Pet Name" required>
      <input type="text" id="petType" placeholder="Pet Type" required>
      <input type="text" id="breed" placeholder="Breed" required>
      <input type="number" id="age" placeholder="Age" required>
      <textarea id="description" placeholder="Description" required></textarea>
      <input type="text" id="photoUrl" placeholder="Photo URL" required>
      <button type="submit">Create</button>
    </form>
  `;
}

function createProfile(event) {
  event.preventDefault();
  const user = auth.currentUser;
  if (user) {
    const profile = {
      userId: user.uid,
      petName: document.getElementById('petName').value,
      petType: document.getElementById('petType').value,
      breed: document.getElementById('breed').value,
      age: document.getElementById('age').value,
      description: document.getElementById('description').value,
      photoUrl: document.getElementById('photoUrl').value,
    };
    db.collection('profiles').add(profile).then(docRef => {
      const publicLink = createPublicLink(docRef.id);
      docRef.update({ publicLink }).then(() => {
        fetchProfiles(user.uid);
        document.getElementById('form-container').innerHTML = '';
      });
    });
  }
}

function deleteProfile(profileId) {
  const user = auth.currentUser;
  if (user) {
    db.collection('profiles').doc(profileId).delete().then(() => fetchProfiles(user.uid));
  }
}

function showEditForm(profileId) {
  db.collection('profiles').doc(profileId).get().then(doc => {
    const data = doc.data();
    const formContainer = document.getElementById('form-container');
    formContainer.innerHTML = `
      <h2>Edit Profile</h2>
      <form onsubmit="editProfile(event, '${profileId}')">
        <input type="text" id="petName" value="${data.petName}" required>
        <input type="text" id="petType" value="${data.petType}" required>
        <input type="text" id="breed" value="${data.breed}" required>
        <input type="number" id="age" value="${data.age}" required>
        <textarea id="description" required>${data.description}</textarea>
        <input type="text" id="photoUrl" value="${data.photoUrl}" required>
        <button type="submit">Edit</button>
      </form>
    `;
  });
}

function editProfile(event, profileId) {
  event.preventDefault();
  const user = auth.currentUser;
  if (user) {
    const profile = {
      petName: document.getElementById('petName').value,
      petType: document.getElementById('petType').value,
      breed: document.getElementById('breed').value,
      age: document.getElementById('age').value,
      description: document.getElementById('description').value,
      photoUrl: document.getElementById('photoUrl').value,
    };
    db.collection('profiles').doc(profileId).set(profile).then(() => {
      const publicLink = createPublicLink(profileId);
      db.collection('profiles').doc(profileId).update({ publicLink }).then(() => {
        fetchProfiles(user.uid);
        document.getElementById('form-container').innerHTML = '';
      });
    });
  }
}

function createPublicLink(petId) {
  return `${window.location.origin}/public.html?petId=${petId}`;
}
