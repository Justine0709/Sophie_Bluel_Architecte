let url = "http://localhost:5678/api/works";

async function getworks() {

  try {
    let rep = await fetch("http://localhost:5678/api/works", { method: 'GET' });
    let reponse = await rep.json();

    let answer = await fetch("http://localhost:5678/api/categories", { method: 'GET' });
    let answers = await answer.json();

    let divgallery = document.querySelector('.gallery');
    divgallery.innerHTML = "";

    let gallerymodal = document.querySelector('.gallery-modal');

    for (let i = 0; i < reponse.length; i++) {
      let figures = document.createElement("figure");
      divgallery.appendChild(figures);

      let image = document.createElement("img");
      let figcaption = document.createElement("figcaption");
      figures.appendChild(image);
      figures.appendChild(figcaption);

      image.src = reponse[i].imageUrl;
      image.alt = reponse[i].category.name;
      image.id = reponse[i].id;
      image.dataset.categorie = reponse[i].category.name;
      figcaption.innerText = reponse[i].title;

      let figuresmodale = figures.cloneNode(true);
      figuresmodale.removeChild(figuresmodale.querySelector("figcaption"));

      figuresmodale.querySelectorAll("img").forEach((img) => {
        let deleteIcon = document.createElement("i");
        deleteIcon.classList.add("fa-solid", "fa-trash");
        img.parentNode.appendChild(deleteIcon);

        deleteIcon.addEventListener('click', function () {
          let imageId = image.id;
          console.log('ID de l\'image:', imageId);
          deleteImage(imageId);
        });
      });
      

      gallerymodal.appendChild(figuresmodale);

      let editLink = document.createElement("a");
      editLink.href = "#";
      editLink.innerText = "éditer";
      figuresmodale.appendChild(editLink);

      gallerymodal.appendChild(figuresmodale);
      editLink.classList.add("edit-link");
    }
    

    /***ajouter la div des boutons filtres ***/
    let existingDiv = document.querySelector('.gallery');
    let Divbuttons = document.createElement('div');
    existingDiv.insertAdjacentElement('beforebegin', Divbuttons);

    let Tous = document.createElement('div');
    Divbuttons.prepend(Tous);
    Divbuttons.classList.add('contenairbuttons');
    Tous.innerText = "Tous";
    Tous.classList.add('button');
  

    for (let i = 0; i < answers.length; i++) {
      let button = document.createElement('div');
      Divbuttons.appendChild(button);
      button.innerHTML = answers[i].name;
      button.classList.add('button');

      let children = Divbuttons.querySelectorAll(':nth-child(3), :nth-child(4)');
      for (let i = 0; i < children.length; i++) {
        children[i].classList.add('large-button');
      }
    }

    let buttons = document.querySelectorAll('.contenairbuttons .button');
   
    for (let i = 0; i < buttons.length; i++) {
      buttons[i].addEventListener('click', function () {
        let filtre = this.innerText;
        let figures = document.querySelectorAll('.gallery figure');

        let figuresFiltre = Array.from(figures).filter(function (figure) {
          let image = figure.querySelector('img');
          let data = image.dataset.categorie;

          if (filtre === 'Tous') {
            return true;
          } else {
            return data === filtre;
          }
        });

        for (let j = 0; j < figures.length; j++) {
          if (figuresFiltre.includes(figures[j])) {
            figures[j].style.display = 'block';
          } else {
            figures[j].style.display = 'none';
          }
        }

        for (let j = 0; j < buttons.length; j++) {
          buttons[j].classList.remove('clicked');
        }

        buttons[i].classList.add('clicked');
      });
      
    }
  /***modal2*/
    let  selectElement = document.getElementById("category");
    
// Parcours du tableau des réponses
for (let i = 0; i < answers.length; i++) {
 
  // Création d'une option pour chaque catégorie
  let option = document.createElement("option");
  option.text = answers[i].name;


  // Ajout de l'option à l'élément select
  selectElement.add(option);
}
  } catch (error) {
    console.error('Une erreur s\'est produite lors de la récupération des images:', error);
  }
}

getworks();

async function deleteImage(imageId) {
  try {
    let token = localStorage.getItem("token");
    console.log(token);
    
    // Afficher la boîte de dialogue de confirmation
    const confirmed = confirm("Êtes-vous sûr de vouloir supprimer cette image ?");
    
    if (confirmed) {
      const response = await fetch(`http://localhost:5678/api/works/${imageId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        // L'image a été supprimée avec succès
        console.log('L\'image a été supprimée avec succès.');
        
      } else {
        // Une erreur s'est produite lors de la suppression de l'image
        console.log('Une erreur s\'est produite lors de la suppression de l\'image.');
      }
    }
  } catch (error) {
    console.error('Erreur:', error);
  }
}


/***admin***/
let banneradmin = document.querySelector('.banner-admin');
let modified = document.querySelector('.modified');
let token = localStorage.getItem("token");
let logout = document.querySelector(".lien-login");

banneradmin.style.visibility = "hidden";
modified.style.visibility = "hidden";

if (token) {
  banneradmin.style.visibility = "visible";
  modified.style.visibility = "visible";
  logout.innerText = "Logout";
} else {
  banneradmin.style.visibility = "hidden";
  modified.style.visibility = "hidden";
}

logout.addEventListener('click', function () {
  localStorage.removeItem("token");
});

/**modale***/
let modal = document.querySelector('.modal');
let modal1 = document.querySelector('.modal1');
let modalClose = document.querySelector('.modale-close');

// Ouvrir la modale
function openModal() {
  modal1.style.display = 'block';
  modal1.setAttribute('aria-modal', 'true');
}

// Fermer la modale
function closeModal() {
  modal1.style.display = 'none';
  modal1.setAttribute('aria-modal', 'false');
}

// Événement de clic sur le bouton pour ouvrir la modale
document.querySelector('.modified').addEventListener('click', function () {
  openModal();
});

// Événement de clic sur le bouton de fermeture de la modale
modalClose.addEventListener('click', function () {
  closeModal();
});

window.addEventListener('click', function (event) {
  if (modal1.style.display === 'block' && event.target !== modal && !event.target.classList.contains('modified'))
    closeModal();
});

modal1.addEventListener('click', function (event) {
  event.stopPropagation();
});

/***modale2***/
/// Sélection de l'input file et de l'élément img
const inputFile = document.getElementById("image");
const ajoutImage = document.querySelector(".ajoutimage");

// Écouteur d'événement sur le changement de valeur de l'input file
inputFile.addEventListener("change", function() {
  // Vérifier s'il y a un fichier sélectionné
  if (inputFile.files && inputFile.files[0]) {
    // Créer un objet URL pour l'image sélectionnée
    const imageURL = URL.createObjectURL(inputFile.files[0]);
    
    // Mettre à jour l'attribut src de l'élément img avec l'image sélectionnée
    ajoutImage.src = imageURL;
    
    // Afficher l'image
    ajoutImage.style.display = "block";
  }
});



async function sendpictureAPI() {
  console.log('fonctionok')
  let imageInput = document.getElementById('image').files[0];
  console.log('essai',imageInput)
  let titleInput = document.getElementById('title').value;
  let categoryInput = document.getElementById('category').value;


  let formData = new FormData();
  formData.append('image', imageInput);
  formData.append('title', titleInput);
  formData.append('category', categoryInput);

  console.log(formData)


  

  let token = localStorage.getItem('token');
 

 
  try {
    const response = await fetch('http://localhost:5678/api/works', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: formData,
      
    });

    if (response.ok) {
      console.log('Image envoyée avec succès à l\'API.');
    } else {
      throw new Error('Erreur lors de l\'envoi de l\'image à l\'API.');
    }
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'image à l\'API:', error);
  }
}


const validbutton = document.querySelector('.modale2-button');

validbutton.addEventListener('click', async function(event) {
  console.log('essai2')
  
  var imageInput = document.getElementById('image');
  var titleInput = document.getElementById('title');
  var categoryInput = document.getElementById('category');
  
  if (imageInput.files.length === 0 || titleInput.value.trim() === '' || categoryInput.value.trim() === '') {
    event.preventDefault(); 
    alert('Veuillez remplir tous les champs obligatoires.');
  } else {
    await sendpictureAPI();
  }
});
