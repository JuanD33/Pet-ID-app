// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDkUZWBzCvO6UDblJMvc5suwgd-7TWPMOM",
  authDomain: "flying-chimp-pet-tag.firebaseapp.com",
  projectId: "flying-chimp-pet-tag",
  storageBucket: "flying-chimp-pet-tag.appspot.com",
  messagingSenderId: "429165684650",
  appId: "1:429165684650:web:665422bbce694ea658edd3",
  measurementId: "G-EBCWWSBJ4G"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

function getProfile(petId) {
  db.collection('profiles').doc(petId).get().then(doc => {
    if (doc.exists) {
      const data = doc.data();
      const profileContainer = document.getElementById('profile-container');
      profileContainer.innerHTML = `
        <h1>${data.petName}</h1>
        <p>Type: ${data.petType}</p>
        <p>Breed: ${data.breed}</p>
        <p>Age: ${data.age}</p>
        <p>Description: ${data.description}</p>
        <img src="${data.photoUrl}" alt="${data.petName}">
      `;
    } else {
      document.getElementById('profile-container').innerHTML = 'Profile not found';
    }
  });
}

const urlParams = new URLSearchParams(window.location.search);
const petId = urlParams.get('petId');
if (petId) {
  getProfile(petId);
}
