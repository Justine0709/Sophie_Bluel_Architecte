let url = "http://localhost:5678/api/works";

//requête Get pour recupérer la galerie photo
async function getworks() {

  try {
    let rep = await fetch("http://localhost:5678/api/works", { method: 'GET' });
    let reponse = await rep.json();

    let answer = await fetch("http://localhost:5678/api/categories", { method: 'GET' });
    let answers = await answer.json();
    
    //vider la galerie html
    let divgallery = document.querySelector('.gallery');
    divgallery.innerHTML = "";

    let gallerymodal = document.querySelector('.gallery-modal');

    //Vider la galerie Jscript
    while (gallerymodal.firstChild) {
      gallerymodal.firstChild.remove();
    }

    // Boucle créer la galerie Jscript
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
     
      //cloner la galerie pour la modale 1
      let figuresmodale = figures.cloneNode(true);
      figuresmodale.removeChild(figuresmodale.querySelector("figcaption"));

      //Ajout de l'icone corbeille sur chaque image
      figuresmodale.querySelectorAll("img").forEach((img) => {
        let deleteIcon = document.createElement("i");
        deleteIcon.classList.add("fa-solid", "fa-trash");
        img.parentNode.appendChild(deleteIcon);

        // Ecouteur d'évenement sur la corbeille pour supprimer image
        deleteIcon.addEventListener('click', function () {
          let imageId = image.id;
          console.log('ID de l\'image:', imageId);
          deleteImage(imageId);
        });
      });
      
      // ajouter des balises figures dans la galerie modale
      gallerymodal.appendChild(figuresmodale);

      //Ajout texte éditer sous chaque image
      let editLink = document.createElement("a");
      editLink.href = "#";
      editLink.innerText = "éditer";
      figuresmodale.appendChild(editLink);
      editLink.classList.add("edit-link");
    }
    

    /***ajouter la div des boutons filtres ***/
    let existingDiv = document.querySelector('.gallery');
    let contenairButtons = document.querySelector('.contenairbuttons');
    
    if (contenairButtons) {
      contenairButtons.innerHTML = '';
    } else {
      contenairButtons = document.createElement('div');
      existingDiv.insertAdjacentElement('beforebegin', contenairButtons);
      contenairButtons.classList.add('contenairbuttons');
    }
    
   //creation du text du premier bouton 
    let Tous = document.createElement('div');
    contenairButtons.prepend(Tous);
  
    Tous.innerText = "Tous";
    Tous.classList.add('button');

   //creation des boutons selon les catégories des photos
    for (let i = 0; i < answers.length; i++) {
      let button = document.createElement('div');
      contenairButtons.appendChild(button);
      button.innerHTML = answers[i].name;
      button.classList.add('button');
    
      let children = contenairButtons.querySelectorAll(':nth-child(3), :nth-child(4)');
      for (let j = 0; j < children.length; j++) {  
        children[j].classList.add('large-button');
      }
    }
    // Ajout d'un ecouteur d'évenement pour filter les boutons
    let buttons = document.querySelectorAll('.contenairbuttons .button');
   
    for (let i = 0; i < buttons.length; i++) {
      buttons[i].addEventListener('click', function () {
        let filtre = this.innerText;
        let figures = document.querySelectorAll('.gallery figure');

        //Ajout de la fonction filter
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
  /***modale2*/
  
    let  selectElement = document.getElementById("category");
    selectElement.innerHTML = ""; 
    
  // Parcours du tableau des réponses
  for (let i = 0; i < answers.length; i++) {
 
  // Création d'une option pour chaque catégorie et association de l'id
  let option = document.createElement("option");
  option.text = answers[i].name;
  option.setAttribute("data-id", answers[i].id);
  


  // Ajout de l'option à l'élément select
  selectElement.add(option);
  
}
  } catch (error) {
    console.error('Une erreur s\'est produite lors de la récupération des images:', error);
  }
}

getworks();

//requête Fetch Delete 
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
        getworks();
        
      } else {
        // Une erreur s'est produite lors de la suppression de l'image
        console.log('Une erreur s\'est produite lors de la suppression de l\'image.');
      }
    }
  } catch (error) {
    console.error('Erreur:', error);
  }
}


//Admin
let banneradmin = document.querySelector('.banner-admin');
let modified = document.querySelector('.modified');
let modified2= document.querySelector('.modified2');
let modified3= document.querySelector('.modified3');
let token = localStorage.getItem("token");
let logout = document.querySelector(".lien-login");

banneradmin.style.visibility = "hidden";
modified.style.visibility = "hidden";
modified2.style.visibility="hidden";
modified3.style.visibility="hidden";

if (token) {
  banneradmin.style.visibility = "visible";
  modified.style.visibility = "visible";
  modified2.style.visibility = "visible";
  modified3.style.visibility="visible";
  logout.innerText = "Logout";
} else {
  banneradmin.style.visibility = "hidden";
  modified.style.visibility = "hidden";
}

logout.addEventListener('click', function () {
  localStorage.removeItem("token");
});

//Modale
let backgroundModal = document.querySelector('aside');
let modal1 = document.querySelector('.modal1');
let modalClose = document.querySelector('.modale-close');



// Ouvrir la modale1
function openModal() {
  modal1.style.display = 'block';
  modal1.setAttribute('aria-modal', 'true');
  backgroundModal.classList.add('modal');
}

// Fermer la Modale1
function closeModal() {
  modal1.style.display = 'none';
  modal1.setAttribute('aria-modal', 'false');
  backgroundModal.classList.remove('modal');
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
  if (modal1.style.display === 'block'  && !event.target.classList.contains('modified'))
    closeModal();

});

modal1.addEventListener('click', function (event) {
  event.stopPropagation();
});

//Modale2
//Ouvrir la Modale2
let Addpicture=document.querySelector('.modal-submit');
let Modal2=document.querySelector('.modal2');
let Modaleclose2=document.querySelector('.modale-close2')

Addpicture.addEventListener('click',function(){
Modal2.style.display='block';
closeModal();
backgroundModal.classList.add('modal');
});
//Fermer la modale2
Modaleclose2.addEventListener('click', function () {
  Modal2.style.display='none';
  backgroundModal.classList.remove('modal');

});

window.addEventListener('click', function (event) {
  if (Modal2.style.display === 'block' && event.target !== Modal2)
  Modal2.style.display='none';
  backgroundModal.classList.remove('modal');

});

Modal2.addEventListener('click', function (event) {
  event.stopPropagation();
});

// Sélection de l'input file et de l'élément img
let inputFile = document.getElementById("image");
const ajoutImage = document.querySelector(".ajoutimage");
const trash=document.querySelector('.deleteimage')

// Écouteur d'événement sur le changement de valeur de l'input file
inputFile.addEventListener("change", function() {
  // Vérifier s'il y a un fichier sélectionné
  if (inputFile.files && inputFile.files[0]) {
    // Créer un objet URL pour l'image sélectionnée
    let imageURL = URL.createObjectURL(inputFile.files[0]);

    // Mettre à jour l'attribut src de l'élément img avec l'image sélectionnée
    ajoutImage.src = imageURL;
    
    // Afficher l'image
    ajoutImage.style.display = "block";
    trash.style.display='block'

  }

});


// Écouteur d'événement sur le clic de l'élément trash
trash.addEventListener('click', function() {
  // Réinitialiser l'image
  ajoutImage.src = "";

  // Cacher l'élément ajoutImage
  ajoutImage.style.display = "none";
  trash.style.display = 'none';

  // Supprimer l'élément inputFile
  inputFile.remove();
});


// Requête Fetch POst
async function sendpictureAPI() {
  let imageInput = document.getElementById('image').files[0];
  console.log('image',imageInput);
  let titleInput = document.getElementById('title').value;
  console.log('title',titleInput);
  let selectElement = document.getElementById("category");
  let selectedOption = selectElement.options[selectElement.selectedIndex];
  let categoryId = selectedOption.dataset.id;
  console.log('categorie',categoryId);

  let formData = new FormData();
  formData.append('image', imageInput);
  formData.append('title', titleInput);
  formData.append('category', categoryId);

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

//Ecouteur d'évènement sur le bouton valider (appelle la requête POST)
const validbutton = document.querySelector('.modale2-button');

validbutton.addEventListener('click', async function(event) {
  let imageInput = document.getElementById('image');
  let titleInput = document.getElementById('title');
  let categoryInput = document.getElementById('category');
  let modale2Button= document.querySelector('.modale2-button');
  
  if (imageInput.files.length === 0 || titleInput.value.trim() === '' || categoryInput.value.trim() === '') {
    event.preventDefault();
    alert('Veuillez remplir tous les champs obligatoires.');
  } else {

   await sendpictureAPI();
   getworks();
   modale2Button.classList.add('green');
   Modal2.style.display='none';
   backgroundModal.classList.remove('modal');
  }
});

