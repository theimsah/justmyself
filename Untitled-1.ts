<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Daily Activity Tracker</title>
    <link rel= icon type= image/x-icon href="favicon-16x16.png">
    <script src="https://kit.fontawesome.com/7a37db3ea8.js" crossorigin="anonymous"></script>

    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 20px;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background: #fff;
            padding: 20px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            border-radius: 10px;
        }
        h1 {
            text-align: center;
            margin-bottom: 20px;
        }
        .form-group {
            margin-bottom: 15px;
        }
        label {
            display: block;
            margin-bottom: 5px;
        }
        input[type="number"], input[type="checkbox"] {
            width: 100%;
            padding: 8px;
            box-sizing: border-box;
        }
        input[type="checkbox"] {
            width: auto;
        }
        button {
            width: 100%;
            padding: 10px;
            background: #28a745;
            color: #fff;
            border: none;
            cursor: pointer;
            border-radius: 5px;
            font-size: 16px;
            margin-bottom: 10px;
        }
        button:hover {
            background: #218838;
        }
        .undo-button {
            width: auto;
            padding: 5px;
            background: #6c6f72;
            color: #fff;
            border: none;
            cursor: pointer;
            border-radius: 5px;
            font-size: 16px;
            margin-bottom: 10px;
            display: inline-block;
            text-align: center;
        }
        .undo-button:hover {
            background: #44474b;
        }
        .result, .points-earned, .jour {
            text-align: center;
            margin-top: 20px;
            font-size: 18px;
        }
        .result {
            font-size: 24px;
        }
        .points-earned {
            font-size: 20px;
        }
        .jour {
            font-size: 20px;
        }

        .button-container {
    display: flex; /* Utilise Flexbox pour l'alignement */
    justify-content: center; /* Centre les boutons horizontalement */
    gap: 2px; /* Espace entre les boutons */
}


.logout{background-color: rgb(143, 30, 30); margin-top:0px;width:33px;}
.logout:hover{background-color: rgba(143, 30, 30, 0.822);}

        #chart-container {
            margin-top: 20px;
            text-align: center;
        }
        #chart {
            max-width: 100%;
            height: 400px;
        }
        #user-selection, #tracker-container, #add-user-container {
            display: none;
        }
        #user-selection {
            display: block;
        }
        .user-list button {
            display: block;
            margin: 5px 0;
        }
        #user-name-display {
            text-align: center;
            font-size: 24px;
            margin-bottom: 20px;
        }

.compterendu{margin:0px; padding:0px; margin-top:50px;}
textarea{width:100%;height:100px;margin-bottom:20px;
 resize : none;
}
    </style>

  <script type="module">
    import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
    import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";
    import { getFirestore, collection, addDoc, getDocs, query, where, doc, updateDoc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

    // Configuration Firebase
    const firebaseConfig = {
      apiKey: "AIzaSyAJapQ7Y2iwW49alBkG3UsKl8Lq4D8mWwU",
      authDomain: "last-9aee8.firebaseapp.com",
      projectId: "last-9aee8",
      storageBucket: "last-9aee8.appspot.com",
      messagingSenderId: "543978749666",
      appId: "1:543978749666:web:0587a84de496dd7073a8bb",
      measurementId: "G-SCY61WX3QH"
    };

    // Initialiser Firebase
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    const firestore = getFirestore(app);

    // Vérifier l'état de connexion
    function checkAuthState() {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          document.getElementById('auth-section').style.display = 'none';
          document.getElementById('profile-section').style.display = 'block';
          document.getElementById('username').innerText = `Bonjour, ${user.email}`;
          loadActivities(user.uid);
        } else {
          document.getElementById('auth-section').style.display = 'block';
          document.getElementById('profile-section').style.display = 'none';
        }
      });
    }

    // Ajouter une activité
    async function addActivity(userId, name, points, type) {
      try {
        await addDoc(collection(firestore, 'activities'), {
          userId,
          name,
          points,
          type,
          createdAt: new Date()
        });
        alert('Activité ajoutée !');
        loadActivities(userId);
      } catch (error) {
        console.error('Erreur d\'ajout d\'activité:', error);
        alert('Erreur d\'ajout d\'activité : ' + error.message);
      }
    }

    // Charger les activités
    async function loadActivities(userId) {
      const activitiesContainer = document.getElementById('activities');
      activitiesContainer.innerHTML = '';
      const q = query(collection(firestore, 'activities'), where('userId', '==', userId));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const activityElement = document.createElement('div');
        activityElement.className = 'activity-item';
        activityElement.innerHTML = `
          <div class="activity-form" data-id="${doc.id}">
            <strong>${data.name}</strong><br>
            <div class="hours-only">
              <input type="number" class="hours-input" placeholder="Nombre d'heures" min="0" step="0.1">
            </div>
            <div class="checkbox-only">
              <label>
                <input type="checkbox" class="checkbox-input">
                Points par case cochée
              </label>
            </div>
          </div>
        `;
        // Afficher ou cacher les champs selon le type d'activité
        const type = data.type;
        const hoursOnly = activityElement.querySelector('.hours-only');
        const checkboxOnly = activityElement.querySelector('.checkbox-only');
        if (type === 'hours') {
          hoursOnly.style.display = 'block';
          checkboxOnly.style.display = 'none';
        } else {
          hoursOnly.style.display = 'none';
          checkboxOnly.style.display = 'block';
        }
        activitiesContainer.appendChild(activityElement);
      });
    }

    document.addEventListener('DOMContentLoaded', () => {
      checkAuthState();

      document.getElementById('signupForm').addEventListener('submit', async (event) => {
        event.preventDefault();
        const email = document.getElementById('signupEmail').value;
        const password = document.getElementById('signupPassword').value;
        try {
          await createUserWithEmailAndPassword(auth, email, password);
          alert('Inscription réussie !');
        } catch (error) {
          console.error('Erreur d\'inscription:', error);
          alert('Erreur d\'inscription : ' + error.message);
        }
      });

      document.getElementById('signinForm').addEventListener('submit', async (event) => {
        event.preventDefault();
        const email = document.getElementById('signinEmail').value;
        const password = document.getElementById('signinPassword').value;
        try {
          await signInWithEmailAndPassword(auth, email, password);
          alert('Connexion réussie !');
        } catch (error) {
          console.error('Erreur de connexion:', error);
          alert('Erreur de connexion : ' + error.message);
        }
      });

      document.getElementById('signOutBtn').addEventListener('click', async () => {
        try {
          await signOut(auth);
          alert('Déconnexion réussie !');
        } catch (error) {
          console.error('Erreur de déconnexion:', error);
        }
      });

      document.getElementById('addActivityForm').addEventListener('submit', async (event) => {
        event.preventDefault();
        const user = auth.currentUser;
        if (user) {
          const name = document.getElementById('activityName').value;
          const points = document.getElementById('activityPoints').value;
          const type = document.getElementById('activityType').value;
          await addActivity(user.uid, name, points, type);
        } else {
          alert('Vous devez être connecté pour ajouter une activité.');
        }
      });

      // Gérer la soumission du formulaire des activités
      document.getElementById('submitActivitiesBtn').addEventListener('click', async () => {
        const user = auth.currentUser;
        if (user) {
          let totalPoints = 0;
          const activityForms = document.querySelectorAll('.activity-form');
          activityForms.forEach(async (form) => {
            const activityId = form.getAttribute('data-id');
            const activitySnapshot = await getDoc(doc(firestore, 'activities', activityId));
            const activityData = activitySnapshot.data();
            const type = activityData.type;

            if (type === 'hours') {
              const hours = parseFloat(form.querySelector('.hours-input').value) || 0;
              totalPoints += hours * activityData.points;
            } else {
              const checkboxChecked = form.querySelector('.checkbox-input').checked;
              totalPoints += checkboxChecked ? activityData.points : 0;
            }
          });

          // Attendre que toutes les mises à jour soient terminées
          await new Promise(resolve => setTimeout(resolve, 500));

          document.getElementById('totalPoints').innerText = `Total Points: ${totalPoints}`;

          // Mettre à jour les points totaux de l'utilisateur pour la journée
          const dailyPointsRef = doc(firestore, 'dailyPoints', `${user.uid}_${new Date().toISOString().split('T')[0]}`);
          await setDoc(dailyPointsRef, { points: totalPoints }, { merge: true });
        } else {
          alert('Vous devez être connecté pour soumettre les activités.');
        }
      });

      // Afficher le formulaire d'ajout d'activité au clic sur le bouton "+"
      document.getElementById('addActivityBtn').addEventListener('click', () => {
        const form = document.getElementById('addActivityForm');
        form.style.display = form.style.display === 'none' ? 'block' : 'none';
      });
    });
  </script>

</head>


<body>

    <!-- User Selection -->
    <div id="user-selection">
        <h1>Select User</h1>
        <div class="user-list" id="userList"></div>
        <button onclick="document.getElementById('add-user-container').style.display = 'block';">Add User</button>
    </div>

    <!-- Add User -->
    <div id="add-user-container">
        <h1>Add User</h1>
        <div class="form-group">
            <label for="userName">User Name:</label>
            <input type="text" id="userName">
        </div>
        <button onclick="addUser()">Add</button>
        <button onclick="document.getElementById('add-user-container').style.display = 'none';">Cancel</button>
    </div>

    <!-- Tracker Container -->
    <div id="tracker-container" class="container">

        <button onclick="logout()" class="logout"><i class="fa-solid fa-right-from-bracket"></i></button>
        
        <h1 id="user-name-display"></h1> <!-- Ajouté -->
        <h1>Daily Activity Tracker</h1>
        <div class="result" id="result">Total Points: 0</div>
        <div class="form-group">
            <label for="sportHours">Sport (hours):</label>
            <input type="number" id="sportHours" min="0" step="1">
        </div>
        <div class="form-group">
            <label for="revisionHours">Revision (hours):</label>
            <input type="number" id="revisionHours" min="0" step="1">
        </div>
        <div class="form-group">
            <label for="travailHours">Travail (hours):</label>
            <input type="number" id="travailHours" min="0" step="1">
        </div>
        <div class="form-group">
            <label for="pratiqueReligieuse">Pratique religieuse:</label>
            <input type="checkbox" id="pratiqueReligieuse">
        </div>
        <div class="form-group">
            <label for="lectureHours">Lecture (hours):</label>
            <input type="number" id="lectureHours" min="0" step="1">
        </div>
        <div class="form-group">
            <label for="alimentationSaine">Alimentation saine:</label>
            <input type="checkbox" id="alimentationSaine">
        </div>

        <p class="compterendu">Compte rendue (facultatif) :</p>
        <form id="contact-form">
            <br>
            <label for="message"></label>
            <textarea id="message" name="message" required placeholder="Un compte rendu ? Une réclamation de point supplémentaire ?"></textarea>
            <br>
            <!-- <button type="submit">Envoyer</button>-->
        </form>

        <form id="contacts-form">
        <div class="button-container">
        <button onclick="submitDailyData()" type="submit">Submit</button>
        <button class="undo-button" onclick="undoLastSubmission()"><i class="fa-solid fa-backward"></i></button>
        </div>
        </form>

        <button onclick="showChart()">Show Chart</button>
        <div class="points-earned" id="points-earned">0 points</div>
        <div class="jour" id="jour">Jour: 0</div>
        <div id="chart-container" style="display:none;">
            <canvas id="chart"></canvas>
        </div>

    </div>

    <script>
        let currentUser = null;
        let totalPoints = 0;
        let dailyPointsHistory = [];
        let submitCount = 0;
        let undoClickCount = 0;
        let chart = null;

        
        function loadUserData() {
            const storedUsers = localStorage.getItem('users');
            if (!storedUsers) {
                localStorage.setItem('users', JSON.stringify({}));
            }
            updateUserList();
        }

        function updateUserList() {
            const users = JSON.parse(localStorage.getItem('users'));
            const userList = document.getElementById('userList');
            userList.innerHTML = '';
            for (const user in users) {
                const userButton = document.createElement('button');
                userButton.textContent = user;
                userButton.onclick = () => selectUser(user);
                userList.appendChild(userButton);
            }
        }

        function addUser() {
            const userName = document.getElementById('userName').value.trim();
            if (!userName) {
                alert('Please enter a user name.');
                return;
            }

            const users = JSON.parse(localStorage.getItem('users'));
            if (users[userName]) {
                alert('User already exists.');
                return;
            }

            users[userName] = { totalPoints: 0, dailyPointsHistory: [], submitCount: 0, undoClickCount: 0 };
            localStorage.setItem('users', JSON.stringify(users));
            updateUserList();
            document.getElementById('userName').value = '';
            document.getElementById('add-user-container').style.display = 'none';
        }

        function selectUser(user) {
            currentUser = user;
            document.getElementById('user-selection').style.display = 'none';
            document.getElementById('tracker-container').style.display = 'block';
            document.getElementById('user-name-display').textContent = `Bonjour, ${user}`; // Ajouté
            loadUserSpecificData();
        }

        function loadUserSpecificData() {
            const users = JSON.parse(localStorage.getItem('users'));
            const userData = users[currentUser];
            totalPoints = userData.totalPoints;
            dailyPointsHistory = userData.dailyPointsHistory;
            submitCount = userData.submitCount;
            undoClickCount = userData.undoClickCount;
            updateDisplay();
            destroyChart(); // Assurez-vous de détruire le graphique précédent
            createOrUpdateChart(); // Créez un nouveau graphique
        }

        function updateUserSpecificData() {
            const users = JSON.parse(localStorage.getItem('users'));
            users[currentUser] = { totalPoints, dailyPointsHistory, submitCount, undoClickCount };
            localStorage.setItem('users', JSON.stringify(users));
        }

//------------------------------------------------------------------------------------------------------------------------------------------------
        document.getElementById('contacts-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Empêche le rechargement de la page

    // Récupération des données du formulaire
    var templateParams = {
        totalPoints: totalPoints,
        user: currentUser,
        points: dailyPointsHistory,
        message: document.getElementById('message').value,
    };

    // Envoi de l'email
    emailjs.send('service_7iuucrp', 'template_ae3w2ni', templateParams)
        .then(function(response) {
           console.log('SUCCESS!', response.status, response.text);
           alert('À bientot, et que le meilleur gagne');
        }, function(error) {
           console.log('FAILED...', error);
           alert('Erreur lors de l\'envoi. Code d\'erreur: ' + error.status + ', Message: ' + error.text);
        });
});
//-----------------------------------------------------------------------------------------------------------------------------------------------

        function updateDisplay() {
            document.getElementById('result').textContent = `Total Points: ${totalPoints}`;
            document.getElementById('points-earned').textContent = `${dailyPointsHistory[dailyPointsHistory.length - 1] || 0} points`;
            document.getElementById('jour').textContent = `Jour: ${submitCount}`;
        }
        
        function submitDailyData() {
            submitCount += 1;
            undoClickCount = 0;
            const sportHours = parseInt(document.getElementById('sportHours').value) || 0;
            const revisionHours = parseInt(document.getElementById('revisionHours').value) || 0;
            const travailHours = parseInt(document.getElementById('travailHours').value) || 0;
            const pratiqueReligieuse = document.getElementById('pratiqueReligieuse').checked;
            const lectureHours = parseInt(document.getElementById('lectureHours').value) || 0;
            const alimentationSaine = document.getElementById('alimentationSaine').checked;

            let points = 0;
            points += sportHours * 20;
            points += revisionHours * 10;
            points += travailHours * 10;
            if (pratiqueReligieuse) points += 5;
            if (!pratiqueReligieuse) {
        points = 0; 
        alert("Vous n'avez pas effectué la pratique religieuse. Le total de points est zéro.");
    }

            points += lectureHours * 8;
            if (alimentationSaine) points += 4;

            totalPoints += points;
            dailyPointsHistory.push(points);

            document.getElementById('sportHours').value = '';
            document.getElementById('revisionHours').value = '';
            document.getElementById('travailHours').value = '';
            document.getElementById('pratiqueReligieuse').checked = false;
            document.getElementById('lectureHours').value = '';
            document.getElementById('alimentationSaine').checked = false;

            updateUserSpecificData();
            updateDisplay();
            destroyChart(); // Assurez-vous de détruire le graphique précédent
            createOrUpdateChart(); // Créez un nouveau graphique
        }

        function undoLastSubmission() {
            if (dailyPointsHistory.length === 0) return;
            dailyPointsHistory.pop();
            totalPoints = dailyPointsHistory.reduce((a, b) => a + b, 0);
            submitCount -= 1;
            undoClickCount += 1;
            updateUserSpecificData();
            updateDisplay();
            destroyChart(); // Assurez-vous de détruire le graphique précédent
            createOrUpdateChart(); // Créez un nouveau graphique
        }

        function createOrUpdateChart() {
            const ctx = document.getElementById('chart').getContext('2d');
            if (chart) {
                chart.data.labels = dailyPointsHistory.map((_, index) => `Jour ${index + 1}`);
                chart.data.datasets[0].data = dailyPointsHistory;
                chart.update();
            } else {
                chart = new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels: dailyPointsHistory.map((_, index) => `Jour ${index + 1}`),
                        datasets: [{
                            label: 'Points Earned',
                            data: dailyPointsHistory,
                            borderColor: 'rgba(75, 192, 192, 1)',
                            borderWidth: 1,
                            fill: false
                        }]
                    },
                    options: {
                        scales: {
                            x: {
                                title: {
                                    display: true,
                                    text: 'Days'
                                }
                            },
                            y: {
                                title: {
                                    display: true,
                                    text: 'Points'
                                }
                            }
                        }
                    }
                });
            }
        }

        function destroyChart() {
            if (chart) {
                chart.destroy();
                chart = null;
            }
        }

        function showChart() {
            const chartContainer = document.getElementById('chart-container');
            if (chartContainer.style.display === 'block') {
                chartContainer.style.display = 'none';
                destroyChart();
            } else {
                chartContainer.style.display = 'block';
                createOrUpdateChart();
            }
        }

        function logout() {
            currentUser = null;
            totalPoints = 0;
            dailyPointsHistory = [];
            submitCount = 0;
            undoClickCount = 0;
            document.getElementById('tracker-container').style.display = 'none';
            document.getElementById('user-selection').style.display = 'block';
            destroyChart(); // Assurez-vous de détruire le graphique précédent
        }

        document.addEventListener('DOMContentLoaded', loadUserData);
    </script>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>

    <!-- Inclusion de l'API EmailJS -->
    <script src="https://cdn.emailjs.com/dist/email.min.js"></script>

    <script type="text/javascript" src="https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js"></script>
    <script type="text/javascript">
        (function(){
            emailjs.init({
                publicKey: "u9p3XfEiS_v9SudHp",
            });
        })();
    </script>
</body>
</html>