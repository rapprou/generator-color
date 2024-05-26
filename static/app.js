// Sélectionner le formulaire avec l'ID 'form'
const form = document.querySelector('#form');

// Ajouter un écouteur d'événement pour le soumission du formulaire
form.addEventListener('submit', function (e) {
    e.preventDefault(); // Empêcher le comportement par défaut de la soumission du formulaire
    console.log('Form submitted'); // Log pour débogage
    getColors(); // Appeler la fonction getColors pour traiter la soumission du formulaire
});

// Fonction pour obtenir les couleurs à partir de l'API
function getColors() {
    // Récupérer la valeur de la requête à partir de l'élément de formulaire
    const query = form.elements.query.value;
    console.log('Query:', query); // Log pour débogage

    // Faire une requête POST à l'URL spécifiée (assurez-vous que l'URL pointe vers le bon port)
    fetch('http://127.0.0.1:5000/palette', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        // Envoyer la requête sous forme d'URL encodée
        body: new URLSearchParams({
            query
        })
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error('Network response was not ok'); // Gérer les erreurs de réseau
            }
            return response.json(); // Extraire les données JSON de la réponse
        })
        .then((data) => {
            console.log('Response data:', data); // Log pour débogage
            if (data.colors && data.colors.length > 0) {
                // Si des couleurs sont retournées, les traiter
                const colors = data.colors;
                const container = document.querySelector('.container'); // Sélectionner le conteneur pour afficher les couleurs
                createColorBoxes(colors, container); // Créer les boîtes de couleur
            } else {
                console.error('No colors returned by the API'); // Gérer l'absence de couleurs dans la réponse
            }
        })
        .catch((error) => {
            console.error('Fetch error:', error); // Gérer les erreurs de la requête
        });
}

// Fonction pour créer des boîtes de couleur
function createColorBoxes(colors, container) {
    console.log('Creating color boxes:', colors); // Log pour débogage
    container.innerHTML = ''; // Vider le conteneur

    // Parcourir chaque couleur et créer une boîte correspondante
    colors.forEach((color) => {
        const box = document.createElement('div'); // Créer un nouvel élément div pour la boîte de couleur
        box.classList.add('color'); // Ajouter la classe 'color' à la boîte
        box.style.backgroundColor = color; // Définir la couleur de fond de la boîte
        box.style.width = `calc(100% / ${colors.length})`; // Définir la largeur de la boîte en fonction du nombre de couleurs

        // Ajouter un écouteur d'événement pour copier la couleur dans le presse-papier lorsqu'on clique sur la boîte
        box.addEventListener('click', async () => {
            await navigator.clipboard.writeText(color); // Copier la couleur dans le presse-papier
            console.log(`Copied ${color} to clipboard`); // Log pour débogage
        });

        // Créer un élément span pour afficher la valeur de la couleur
        const label = document.createElement('span');
        label.innerText = color; // Définir le texte du span à la valeur de la couleur
        box.appendChild(label); // Ajouter le span à la boîte de couleur

        container.appendChild(box); // Ajouter la boîte de couleur au conteneur
    });
}


// load bouton (envoyer)

document.getElementById('form').addEventListener('submit', function (e) {
    e.preventDefault();

    // Ajoutez la classe 'loading' au bouton
    const button = e.target.querySelector('.btn');
    button.classList.add('loading');

    // Simulez une requête asynchrone (comme un appel d'API)
    setTimeout(() => {
        // Retirez la classe 'loading' après la requête (simulée)
        button.classList.remove('loading');
        // Vous pouvez également soumettre le formulaire ici si nécessaire
        // e.target.submit();
    }, 2000); // Simule un délai de 3 secondes
});

