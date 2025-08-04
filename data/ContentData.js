const contentData = [
  {
    type: "Film",
    title: "Interstellar",
    director: "Christopher Nolan",
    description:
      "Film de science-fiction où des astronautes voyagent à travers un trou de ver pour sauver l'humanité.",
    image: require("./../assets/interstellar.jpg"),
    backgroundColor: ["#FF6B6B", "#4ECDC4"],
    categoryColor: "#4ECDC4",
    icon: "film",
    stripColors: ["#00CFFF", "#FFEB3B", "#9C27B0"],
  },
  {
    type: "Musique",
    title: "See You Again (avec Kali Uchis)",
    album: "Flowers boy",
    artist: "Taylor, The creator",
    description:
      "C'est ce genre de morceau qui te serre un peu la poitrine sans trop savoir pourquoi. Beau, doux, bizarre. Tu veux juste que ça dure plus longtemps.",
    image: require("./../assets/seeyouagain.jpg"),
    backgroundColor: ["#FF9F43", "#EE5A24"],
    categoryColor: "#FF9F43",
    icon: "musical-notes",
    stripColors: ["#FF9F43", "#E91E63", "#FFC107"],
  },
  {
    type: "Podcast",
    title: "Le Floodcast",
    hosts: "podcast animé par Florent Bernard (FloBer) et Adrien Ménielle.",
    description:
      "Un podcast décontracté où les discussions partent dans tous les sens.",
    image: require("./../assets/floodcast.jpg"),
    backgroundColor: ["#DBF227", "#9FC131"],
    categoryColor: "#9FC131",
    icon: "radio",
    stripColors: ["#6C7B7F", "#8BC34A", "#CDDC39"],
  },
  {
    type: "Série",
    title: "One Piece (Live Action)",
    platform: "Netflix",
    description:
      "Les aventures de Monkey D. Luffy, un jeune pirate élastique rêvant de trouver le légendaire trésor « One Piece » et de devenir roi des pirates.",
    image: require("./../assets/one-piece.jpg"),
    backgroundColor: ["#FF6348", "#FF9F43"],
    categoryColor: "#FF6348",
    icon: "tv",
    stripColors: ["#F44336", "#FF9800", "#FFEB3B"],
  },

  // 👇 Nouvelles cartes
  {
    type: "Film",
    title: "The Grand Budapest Hotel",
    director: "Wes Anderson",
    description:
      "Une comédie visuellement spectaculaire sur les aventures d'un concierge excentrique et de son jeune protégé.",
    image: require("./../assets/grandbudapest.jpg"),
    backgroundColor: ["#FFC371", "#FF5F6D"],
    categoryColor: "#FF5F6D",
    icon: "film",
    stripColors: ["#FF6F61", "#FFD54F", "#8D6E63"],
  },
  {
    type: "Série",
    title: "Fleabag",
    platform: "Amazon Prime Video",
    description:
      "Une comédie dramatique mordante sur une jeune femme en lutte contre la vie moderne à Londres.",
    image: require("./../assets/fleabag.jpg"),
    backgroundColor: ["#D38312", "#A83279"],
    categoryColor: "#A83279",
    icon: "tv",
    stripColors: ["#E91E63", "#CE93D8", "#4A148C"],
  },
  {
    type: "Musique",
    title: "Doin' Time",
    album: "Norman Fucking Rockwell",
    artist: "Lana Del Rey",
    description:
      "Une reprise envoûtante et estivale du groupe Sublime, à la sauce Lana.",
    image: require("./../assets/dointime.jpg"),
    backgroundColor: ["#FFDEE9", "#B5FFFC"],
    categoryColor: "#FFDEE9",
    icon: "musical-notes",
    stripColors: ["#F8B195", "#F67280", "#C06C84"],
  },
  {
    type: "Podcast",
    title: "Transfert",
    hosts: "Slate.fr",
    description:
      "Chaque épisode raconte une histoire intime, brute et sincère, confiée par une personne ordinaire.",
    image: require("./../assets/transfert.jpg"),
    backgroundColor: ["#667eea", "#764ba2"],
    categoryColor: "#667eea",
    icon: "radio",
    stripColors: ["#512DA8", "#9575CD", "#D1C4E9"],
  },
  {
    type: "Youtube",
    title: "Everything is a Remix",
    platform: "YouTube",
    description:
      "Une série documentaire captivante sur la culture du remix, la créativité et l'inspiration.",
    image: require("./../assets/everythingisaremix.jpg"),
    backgroundColor: ["#ff6e7f", "#bfe9ff"],
    categoryColor: "#ff6e7f",
    icon: "videocam",
    stripColors: ["#F44336", "#2196F3", "#FFC107"],
  },
  {
    type: "Musique",
    title: "Bohemian Rhapsody",
    album: "A Night at the Opera",
    artist: "Queen",
    description:
      "Une œuvre épique du rock progressif, mélangeant opéra, ballade et hard rock en 6 minutes.",
    image: require("./../assets/bohemian.jpg"),
    backgroundColor: ["#4A00E0", "#8E2DE2"],
    categoryColor: "#8E2DE2",
    icon: "musical-notes",
    stripColors: ["#4A00E0", "#C471ED", "#F64F59"],
  },
  // 👇 Carte de test sans image pour voir les icônes
  {
    type: "Film",
    title: "Test Icône Film",
    director: "Réalisateur Test",
    description:
      "Cette carte n'a pas d'image pour tester l'affichage de l'icône de catégorie.",
    // Pas d'image définie pour tester les icônes
    backgroundColor: ["#E74C3C", "#C0392B"],
    categoryColor: "#E74C3C",
    icon: "film",
    stripColors: ["#E74C3C", "#C0392B", "#A93226"],
  },
  {
    type: "Série",
    title: "Test Icône Série",
    platform: "Plateforme Test",
    description:
      "Cette carte n'a pas d'image pour tester l'affichage de l'icône de catégorie.",
    // Pas d'image définie pour tester les icônes
    backgroundColor: ["#3498DB", "#2980B9"],
    categoryColor: "#3498DB",
    icon: "tv",
    stripColors: ["#3498DB", "#2980B9", "#21618C"],
  },
  {
    type: "Musique",
    title: "Test Icône Musique",
    album: "Album Test",
    artist: "Artiste Test",
    description:
      "Cette carte n'a pas d'image pour tester l'affichage de l'icône de catégorie.",
    // Pas d'image définie pour tester les icônes
    backgroundColor: ["#9B59B6", "#8E44AD"],
    categoryColor: "#9B59B6",
    icon: "musical-notes",
    stripColors: ["#9B59B6", "#8E44AD", "#7D3C98"],
  },
  {
    type: "Podcast",
    title: "Test Icône Podcast",
    hosts: "Animateurs Test",
    description:
      "Cette carte n'a pas d'image pour tester l'affichage de l'icône de catégorie.",
    // Pas d'image définie pour tester les icônes
    backgroundColor: ["#F39C12", "#E67E22"],
    categoryColor: "#F39C12",
    icon: "radio",
    stripColors: ["#F39C12", "#E67E22", "#D35400"],
  },
  {
    type: "Youtube",
    title: "Test Icône Youtube",
    platform: "YouTube",
    description:
      "Cette carte n'a pas d'image pour tester l'affichage de l'icône de catégorie.",
    // Pas d'image définie pour tester les icônes
    backgroundColor: ["#E74C3C", "#C0392B"],
    categoryColor: "#E74C3C",
    icon: "logo-youtube",
    stripColors: ["#E74C3C", "#C0392B", "#A93226"],
  },
];

export default contentData;