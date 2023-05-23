let url ="http://localhost:5678/api/works";


/***fetch (url).then(reponse =>reponse.json()).then(data =>console.log(data));

const datatab = data[0];

console.log(datatab);
***/


    
async function getworks(){
    let rep = await fetch("http://localhost:5678/api/works", { method: 'GET' });
    let reponse = await rep.json();

    let answer = await fetch("http://localhost:5678/api/categories", { method: 'GET' });
    let answers = await answer.json();

    let divgallery =document.querySelector('.gallery');
    divgallery.innerHTML="";
  
    
    for (let i = 0; i < reponse.length; i++) {
        let divgallery =document.querySelector('.gallery');
        let figures = document.createElement("figure");
        divgallery.appendChild(figures);
        let image =document.createElement("img");
        let figcaption =document.createElement("figcaption");
        figures.appendChild(image);
        figures.appendChild(figcaption);
        image.src= reponse[i].imageUrl;
        image.alt=reponse[i].category.name;
        image.dataset.categorie=reponse[i].category.name
        figcaption.innerText=reponse[i].title;
       
       
    }    

    /***ajouter la div des boutons filtres ***/
    let existingDiv = document.querySelector('.gallery');
    let Divbuttons = document.createElement('div');
    existingDiv.insertAdjacentElement('beforebegin', Divbuttons);

    let Tous = document.createElement('div');
    Divbuttons.prepend(Tous);
    Divbuttons.classList.add('contenairbuttons');
    Tous.innerText="Tous";
    Tous.classList.add('button');

    for (let i=0 ; i<answers.length; i++){
        let button =document.createElement('div');
        Divbuttons.appendChild(button);
        button.innerHTML=answers[i].name;
        button.classList.add('button');
       
        
       
        let children = Divbuttons.querySelectorAll(':nth-child(3), :nth-child(4)');
        for (let i = 0; i < children.length; i++) {
          children[i].classList.add('large-button');
        }
    
    
    let buttons = document.querySelectorAll('.contenairbuttons .button');
  

    for (let i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener('click', function() {
      let filtre=this.innerText;
      let figures =document.querySelectorAll('.gallery figure');
    
      let figuresFiltre = Array.from(figures).filter(function(figure) {
        let image = figure.querySelector('img');
        let data =image.dataset.categorie;
      

        if (filtre === 'Tous') {
          return true; 
        } else {
          return data === filtre
        }
      });
      console.log(figuresFiltre)
      for (let j = 0; j < figures.length; j++) {
        if (figuresFiltre.includes(figures[j])) {
          figures[j].style.display = 'block';
        } else {
          figures[j].style.display = 'none';
        }
      }
  
    for (var j = 0; j < buttons.length; j++) {
      buttons[j].classList.remove('clicked');
    }
  
    buttons[i].classList.add('clicked');
    });

    }
}
      
}

 getworks();


