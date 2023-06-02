const button = document.querySelector('.form-submit');

button.addEventListener('click', (event) => {
  event.preventDefault();

  // Récupérer les valeurs des champs
  const email = document.querySelector('.imput-email').value;
  const password = document.querySelector('.imput-password').value;

  // Créer l'objet de données à envoyer
  const data = {
    email: email,
    password: password
  };
  

  fetch('http://localhost:5678/api/users/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
  .then(response => {
    // Vérifier si la réponse est OK
    if (response.ok) {
      return response.json(); // Extraire les données JSON de la réponse
    } else {
      throw new Error('Erreur lors de l\'envoi des données');
    }
  })
  .then(data => {
    // Récupérer le token de la réponse
    const token = data.token;
    console.log('Token:', token);
    window.location.href = "index.html";
    localStorage.setItem('token', token);

   
  })
  .catch(error => {
     const msgerr=document.querySelector('small');
     msgerr.innerText="email et/ou mot de passe invalide";
     console.log('Erreur lors de l\'envoi des données:', error);
  });
});