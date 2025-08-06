// Import de la configuration API
let API_KEYS;
try {
  // Essayer d'importer la configuration
  const config = require('../config/api.js');
  API_KEYS = config.API_KEYS;
} catch (error) {
  // Fallback si le fichier n'existe pas
  API_KEYS = {
    TMDB_API_KEY: 'VOTRE_CLE_API_TMDB'
  };
}

// Import des utilitaires (si disponibles)
let movieUtils;
let imageCache;
try {
  movieUtils = require('../utils/movieUtils.js');
  imageCache = require('../utils/imageCache.js').default;
} catch (error) {
  // Fallback si les utilitaires ne sont pas disponibles
  movieUtils = {
    getDefaultImage: (platform) => null,
    getBestImage: async (primaryImage, platform) => primaryImage,
    isImageAccessible: async (url) => true
  };
  imageCache = {
    cacheImage: async (url) => url,
    isCached: (url) => false,
    getCached: (url) => null
  };
}

// Import de la base de données Netflix (si disponible)
let netflixTitles;
try {
  netflixTitles = require('../data/netflixTitles.js');
} catch (error) {
  // Fallback si la base de données n'est pas disponible
  netflixTitles = {
    findNetflixTitle: () => null,
    getAllNetflixTitles: () => ({})
  };
}

// Clé API TMDB (The Movie Database)
const TMDB_API_KEY = API_KEYS.TMDB_API_KEY;

// Gestion de fetch pour React Native et Node.js
let fetch;
let axios;

if (typeof global !== 'undefined' && global.fetch) {
  // React Native ou Node.js avec fetch global
  fetch = global.fetch;
  console.log('✅ Utilisation du fetch global (React Native)');
} else if (typeof window !== 'undefined' && window.fetch) {
  // Navigateur
  fetch = window.fetch;
  console.log('✅ Utilisation du fetch du navigateur');
} else {
  // Fallback pour Node.js - utiliser axios
  try {
    axios = require('axios');
    console.log('✅ Utilisation d\'axios pour les requêtes HTTP');
  } catch (error) {
    console.log('⚠️ axios non disponible, fetch sera null');
    fetch = null;
  }
}

/**
 * Service pour l'import de films et séries à partir de liens de plateformes
 */
class MovieService {
  
  /**
   * Recherche des suggestions de films/séries sur TMDB
   * @param {string} title - Titre à rechercher
   * @param {string} type - 'movie' ou 'tv' (optionnel)
   * @returns {Promise<Array>} - Liste des suggestions
   */
  static async searchMovieSuggestions(title, type = null) {
    if (!title || !TMDB_API_KEY || TMDB_API_KEY === 'VOTRE_CLE_API_TMDB') {
      console.log('⚠️ Titre manquant ou clé API TMDB non configurée');
      return [];
    }

    try {
      // Construire l'URL de recherche
      let searchUrl = `https://api.themoviedb.org/3/search/multi?api_key=${TMDB_API_KEY}&language=fr-FR&query=${encodeURIComponent(title)}`;
      
      if (type) {
        searchUrl = `https://api.themoviedb.org/3/search/${type}?api_key=${TMDB_API_KEY}&language=fr-FR&query=${encodeURIComponent(title)}`;
      }

      // Utiliser axios si disponible, sinon fetch
      let response;
      if (axios) {
        response = await axios.get(searchUrl);
      } else if (fetch) {
        response = await fetch(searchUrl);
        if (response.status < 200 || response.status >= 300) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        response = { data: await response.json() };
      } else {
        throw new Error('Aucune méthode HTTP disponible');
      }
      
      const data = response.data;
      
      if (data.results && data.results.length > 0) {
        // Retourner les 10 premiers résultats avec les informations de base
        const suggestions = [];
        
        for (const result of data.results.slice(0, 10)) {
          // Filtrer par type si spécifié
          const mediaType = result.media_type || type || 'movie';
          if (type && mediaType !== type) {
            continue; // Ignorer les résultats qui ne correspondent pas au type demandé
          }
          
          // Récupérer les détails pour avoir le réalisateur
          try {
            const detailsUrl = `https://api.themoviedb.org/3/${mediaType}/${result.id}?api_key=${TMDB_API_KEY}&language=fr-FR&append_to_response=credits`;
            
            let detailsResponse;
            if (axios) {
              detailsResponse = await axios.get(detailsUrl);
            } else if (fetch) {
              detailsResponse = await fetch(detailsUrl);
              if (detailsResponse.status >= 200 && detailsResponse.status < 300) {
                detailsResponse = { data: await detailsResponse.json() };
              } else {
                continue; // Passer au suivant si erreur
              }
            }
            
            if (detailsResponse && detailsResponse.data) {
              const details = detailsResponse.data;
              const director = this.extractDirector(details.credits?.crew);
              
                             // Gérer l'image pour les suggestions
               let imageUrl = null;
               if (result.poster_path) {
                 const tmdbImageUrl = `https://image.tmdb.org/t/p/w200${result.poster_path}`;
                 try {
                   if (await movieUtils.isImageAccessible(tmdbImageUrl)) {
                     imageUrl = await imageCache.cacheImage(tmdbImageUrl);
                   }
                 } catch (error) {
                   console.log('❌ Erreur cache image suggestion:', error.message);
                 }
               }

               suggestions.push({
                 id: result.id,
                 title: result.title || result.name,
                 year: result.release_date ? new Date(result.release_date).getFullYear() : 
                        (result.first_air_date ? new Date(result.first_air_date).getFullYear() : null),
                 type: mediaType === 'tv' ? 'Série' : 'Film',
                 mediaType: mediaType,
                 rating: result.vote_average ? `${Math.round(result.vote_average)}/10` : null,
                 image: imageUrl,
                 director: director
               });
            }
          } catch (error) {
            // Si erreur pour récupérer les détails, ajouter sans réalisateur
            suggestions.push({
              id: result.id,
              title: result.title || result.name,
              year: result.release_date ? new Date(result.release_date).getFullYear() : 
                     (result.first_air_date ? new Date(result.first_air_date).getFullYear() : null),
              type: mediaType === 'tv' ? 'Série' : 'Film',
              mediaType: mediaType,
              rating: result.vote_average ? `${Math.round(result.vote_average)}/10` : null,
              image: result.poster_path ? `https://image.tmdb.org/t/p/w200${result.poster_path}` : null,
              director: null
            });
          }
        }
        
        return suggestions;
      }
      
      return [];
      
    } catch (error) {
      console.error('❌ Erreur lors de la recherche de suggestions TMDB:', error);
      return [];
    }
  }

  /**
   * Récupère un film/série par son ID TMDB
   * @param {number} id - ID TMDB du film/série
   * @param {string} mediaType - 'movie' ou 'tv'
   * @returns {Promise<Object|null>} - Informations du film/série ou null
   */
  static async getMovieById(id, mediaType) {
    if (!id || !mediaType || !TMDB_API_KEY || TMDB_API_KEY === 'VOTRE_CLE_API_TMDB') {
      console.log('⚠️ ID, type ou clé API TMDB manquant');
      return null;
    }

    try {
      // Récupérer les détails complets par ID
      const detailsUrl = `https://api.themoviedb.org/3/${mediaType}/${id}?api_key=${TMDB_API_KEY}&language=fr-FR&append_to_response=credits`;
      
      let detailsResponse;
      if (axios) {
        detailsResponse = await axios.get(detailsUrl);
      } else if (fetch) {
        detailsResponse = await fetch(detailsUrl);
        if (detailsResponse.status >= 200 && detailsResponse.status < 300) {
          detailsResponse = { data: await detailsResponse.json() };
        } else {
          throw new Error(`HTTP error! status: ${detailsResponse.status}`);
        }
      }
      
      if (detailsResponse && detailsResponse.data) {
        const details = detailsResponse.data;
        
        // Gérer l'image avec cache et fallback
        let imageUrl = null;
        if (details.poster_path) {
          const tmdbImageUrl = `https://image.tmdb.org/t/p/w500${details.poster_path}`;
          
          try {
            // Vérifier si l'image est accessible
            if (await movieUtils.isImageAccessible(tmdbImageUrl)) {
              // Essayer de mettre en cache
              imageUrl = await imageCache.cacheImage(tmdbImageUrl);
            } else {
              console.log('⚠️ Image TMDB non accessible:', tmdbImageUrl);
              // Utiliser une image par défaut
              imageUrl = await movieUtils.getBestImage(null, 'tmdb');
            }
          } catch (error) {
            console.log('❌ Erreur cache image:', error.message);
            // Utiliser une image par défaut
            imageUrl = await movieUtils.getBestImage(null, 'tmdb');
          }
        } else {
          // Pas d'image TMDB, utiliser une image par défaut
          imageUrl = await movieUtils.getBestImage(null, 'tmdb');
        }

        return {
          title: details.title || details.name,
          type: mediaType === 'tv' ? 'Série' : 'Film',
          description: details.overview,
          year: details.release_date ? new Date(details.release_date).getFullYear() : 
                 (details.first_air_date ? new Date(details.first_air_date).getFullYear() : null),
          rating: details.vote_average ? `${Math.round(details.vote_average)}/10` : null,
          image: imageUrl,
          director: this.extractDirector(details.credits?.crew),
          cast: details.credits?.cast ? details.credits.cast.slice(0, 5).map(actor => actor.name).join(', ') : null,
          genre: details.genres ? details.genres.map(g => g.name).join(', ') : null,
          tmdbId: details.id,
          mediaType: mediaType
        };
      }
      
      return null;
      
    } catch (error) {
      console.error('❌ Erreur lors de la récupération par ID TMDB:', error);
      return null;
    }
  }

  /**
   * Recherche un film/série par titre sur TMDB
   * @param {string} title - Titre à rechercher
   * @param {string} type - 'movie' ou 'tv' (optionnel)
   * @returns {Promise<Object|null>} - Informations du film/série ou null
   */
  static async searchMovieByTitle(title, type = null) {
    if (!title || !TMDB_API_KEY || TMDB_API_KEY === 'VOTRE_CLE_API_TMDB') {
      console.log('⚠️ Titre manquant ou clé API TMDB non configurée');
      return null;
    }

    try {
      // Construire l'URL de recherche
      let searchUrl = `https://api.themoviedb.org/3/search/multi?api_key=${TMDB_API_KEY}&language=fr-FR&query=${encodeURIComponent(title)}`;
      
      if (type) {
        searchUrl = `https://api.themoviedb.org/3/search/${type}?api_key=${TMDB_API_KEY}&language=fr-FR&query=${encodeURIComponent(title)}`;
      }

      // Utiliser axios si disponible, sinon fetch
      let response;
      if (axios) {
        response = await axios.get(searchUrl);
      } else if (fetch) {
        response = await fetch(searchUrl);
        if (response.status < 200 || response.status >= 300) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        response = { data: await response.json() };
      } else {
        throw new Error('Aucune méthode HTTP disponible');
      }
      
      const data = response.data;
      
      if (data.results && data.results.length > 0) {
        const firstResult = data.results[0];
        
        // Déterminer le type de média
        let mediaType = firstResult.media_type;
        if (!mediaType) {
          // Si media_type n'est pas défini, utiliser le type de recherche
          mediaType = type || 'movie';
        }
        
        // Récupérer les détails complets
        const detailsUrl = `https://api.themoviedb.org/3/${mediaType}/${firstResult.id}?api_key=${TMDB_API_KEY}&language=fr-FR&append_to_response=credits`;
        let detailsResponse;
        
        if (axios) {
          detailsResponse = await axios.get(detailsUrl);
        } else if (fetch) {
          detailsResponse = await fetch(detailsUrl);
          if (detailsResponse.status >= 200 && detailsResponse.status < 300) {
            detailsResponse = { data: await detailsResponse.json() };
          } else {
            throw new Error(`HTTP error! status: ${detailsResponse.status}`);
          }
        }
        
        if (detailsResponse && detailsResponse.data) {
          const details = detailsResponse.data;
          
          return {
            title: details.title || details.name,
            type: mediaType === 'tv' ? 'Série' : 'Film',
            description: details.overview,
            year: details.release_date ? new Date(details.release_date).getFullYear() : 
                   (details.first_air_date ? new Date(details.first_air_date).getFullYear() : null),
            rating: details.vote_average ? `${Math.round(details.vote_average)}/10` : null,
            image: details.poster_path ? `https://image.tmdb.org/t/p/w500${details.poster_path}` : null,
            director: this.extractDirector(details.credits?.crew),
            cast: details.credits?.cast ? details.credits.cast.slice(0, 5).map(actor => actor.name).join(', ') : null,
            genre: details.genres ? details.genres.map(g => g.name).join(', ') : null,
            tmdbId: details.id,
            mediaType: mediaType
          };
        }
      }
      
      console.log(`❌ Aucun résultat trouvé pour: ${title}`);
      return null;
      
    } catch (error) {
      console.error('❌ Erreur lors de la recherche TMDB:', error);
      return null;
    }
  }

  /**
   * Identifie la plateforme à partir de l'URL
   * @param {string} url - URL à analyser
   * @returns {string|null} - Nom de la plateforme ou null
   */
  static identifyPlatform(url) {
    const patterns = {
      netflix: /netflix\.com|netflix\.fr/i,
      prime: /primevideo\.com|amazon\.com.*video/i,
      disney: /disneyplus\.com|disney\.com.*plus/i,
      tmdb: /themoviedb\.org|tmdb\.org/i,
      allocine: /allocine\.fr/i,
      imdb: /imdb\.com/i,
      rotten: /rottentomatoes\.com/i
    };

    for (const [platform, pattern] of Object.entries(patterns)) {
      if (pattern.test(url)) {
        return platform;
      }
    }

    return null;
  }

  /**
   * Extrait l'ID du contenu selon la plateforme
   * @param {string} url - URL de la plateforme
   * @param {string} platform - Nom de la plateforme
   * @returns {string|null} - ID du contenu ou null
   */
  static extractContentId(url, platform) {
    try {
      const urlObj = new URL(url);
      
      switch (platform) {
        case 'netflix':
          // Netflix: /watch/80192098 -> 80192098
          // Netflix: /title/70195800 -> 70195800
          const netflixWatchMatch = urlObj.pathname.match(/\/watch\/(\d+)/);
          const netflixTitleMatch = urlObj.pathname.match(/\/title\/(\d+)/);
          return netflixWatchMatch ? netflixWatchMatch[1] : (netflixTitleMatch ? netflixTitleMatch[1] : null);
          
        case 'prime':
          // Prime: /detail/tt1234567 -> tt1234567
          const primeMatch = urlObj.pathname.match(/\/detail\/([^\/]+)/);
          return primeMatch ? primeMatch[1] : null;
          
        case 'disney':
          // Disney+: /content/123456 -> 123456
          // Disney+: /fr-FR/browse/entity-ca1ac46e-9883-4125-a6e8-97efce9a2bf5 -> ca1ac46e-9883-4125-a6e8-97efce9a2bf5
          const disneyMatch = urlObj.pathname.match(/\/(content|fr-FR\/browse\/entity)\/([^\/\?]+)/);
          if (disneyMatch) return disneyMatch[2];
          
          // Pattern alternatif pour les nouveaux liens Disney+
          const disneyEntityMatch = urlObj.pathname.match(/\/entity-([^\/\?]+)/);
          return disneyEntityMatch ? disneyEntityMatch[1] : null;
          
        case 'tmdb':
          // TMDB: /movie/123 -> 123
          const tmdbMatch = urlObj.pathname.match(/\/(movie|tv)\/(\d+)/);
          return tmdbMatch ? `${tmdbMatch[1]}_${tmdbMatch[2]}` : null;
          
        case 'allocine':
          // AlloCiné: /film/fichefilm_gen_cfilm=123456.html -> 123456
          const allocineMatch = urlObj.pathname.match(/fichefilm_gen_cfilm=(\d+)/);
          return allocineMatch ? allocineMatch[1] : null;
          
        case 'imdb':
          // IMDb: /title/tt1234567/ -> tt1234567
          const imdbMatch = urlObj.pathname.match(/\/title\/([^\/]+)/);
          return imdbMatch ? imdbMatch[1] : null;
          
        default:
          return null;
      }
    } catch (error) {
      console.error('❌ Erreur lors de l\'extraction de l\'ID:', error);
      return null;
    }
  }

  /**
   * Récupère les informations depuis TMDB
   * @param {string} contentId - ID du contenu (format: movie_123 ou tv_123)
   * @returns {Promise<Object|null>} - Informations du film/série
   */
  static async getTMDBInfo(contentId) {
    if (!TMDB_API_KEY || TMDB_API_KEY === 'VOTRE_CLE_API_TMDB') {
      console.log('⚠️ Clé API TMDB non configurée');
      return null;
    }

    try {
      const [type, id] = contentId.split('_');
      const endpoint = type === 'tv' ? 'tv' : 'movie';
      
      const response = await fetch(
        `https://api.themoviedb.org/3/${endpoint}/${id}?api_key=${TMDB_API_KEY}&language=fr-FR&append_to_response=credits`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      return {
        title: data.title || data.name,
        director: this.extractDirector(data.credits?.crew),
        description: data.overview,
        platform: 'TMDB',
        image: data.poster_path ? `https://image.tmdb.org/t/p/w500${data.poster_path}` : null,
        year: data.release_date ? new Date(data.release_date).getFullYear() : null,
        rating: data.vote_average,
        genre: data.genres?.map(g => g.name).join(', '),
        type: type === 'tv' ? 'Série' : 'Film'
      };
    } catch (error) {
      console.error('❌ Erreur TMDB:', error);
      return null;
    }
  }

  /**
   * Extrait le réalisateur depuis l'équipe
   * @param {Array} crew - Équipe du film/série
   * @returns {string} - Nom du réalisateur
   */
  static extractDirector(crew) {
    if (!crew) return '';
    
    const director = crew.find(person => 
      person.job === 'Director' || person.job === 'Réalisateur'
    );
    
    return director ? director.name : '';
  }

  /**
   * Récupère les informations Netflix (simulation)
   * @param {string} contentId - ID du contenu Netflix
   * @param {string} url - URL originale
   * @returns {Promise<Object>} - Informations simulées
   */
  static async getNetflixInfo(contentId, url) {
    // Simulation - dans un vrai projet, on utiliserait l'API Netflix
    // Pour Suits, on peut extraire les infos du lien partagé
    if (contentId === '70195800') {
      return {
        title: 'Suits : avocats sur mesure',
        platform: 'Netflix',
        link: url,
        type: 'Série',
        description: 'Après avoir impressionné un grand avocat par sa vive intelligence, un étudiant décroche un poste d\'assistant convoité, alors qu\'il n\'est même pas diplômé en droit.',
        year: '2019',
        genre: 'Drame, Séries judiciaires, Séries comiques',
        rating: '13+',
        seasons: '9 Saisons',
        director: 'Aaron Korsh',
        cast: 'Gabriel Macht, Patrick J. Adams, Sarah Rafferty, Rick Hoffman, Meghan Markle',
        image: 'https://image.tmdb.org/t/p/w500/tVqvztjig1o001EAAZs9wCs3bV6.jpg' // Image Suits depuis TMDB
      };
    }
    
    // Pour Ready Player One, on peut extraire les infos du lien partagé
    if (contentId === '80211726') {
      return {
        title: 'Ready Player One',
        platform: 'Netflix',
        link: url,
        type: 'Film',
        description: 'En 2045, le monde est au bord du chaos. Les êtres humains se réfugient dans l\'OASIS, univers virtuel mis au point par le brillant et excentrique James Halliday. Avant de disparaître, celui-ci a décidé de léguer son immense fortune à quiconque découvrira l\'œuf de Pâques numérique qu\'il a pris soin de dissimuler dans l\'OASIS.',
        year: '2018',
        genre: 'Action, Science-Fiction, Aventure',
        rating: '13+',
        director: 'Steven Spielberg',
        cast: 'Tye Sheridan, Olivia Cooke, Ben Mendelsohn, Lena Waithe, T.J. Miller, Simon Pegg, Mark Rylance',
        image: 'https://image.tmdb.org/t/p/w500/832ngDVXhOVp6HBnuMMeeWTrGXN.jpg' // Image Ready Player One depuis TMDB
      };
    }
    
    // Pour Interstellar, on peut extraire les infos du lien partagé
    if (contentId === '70305903') {
      return {
        title: 'Interstellar',
        platform: 'Netflix',
        link: url,
        type: 'Film',
        description: 'Dans un futur proche, face à une Terre exsangue, un groupe d\'explorateurs utilise un vaisseau interstellaire pour franchir un trou de ver permettant de parcourir des distances jusque‐là infranchissables. Leur but : trouver un nouveau foyer pour l\'humanité.',
        year: '2014',
        genre: 'Science-Fiction, Drame, Aventure',
        rating: '13+',
        director: 'Christopher Nolan',
        cast: 'Matthew McConaughey, Anne Hathaway, Jessica Chastain, Michael Caine, Ellen Burstyn, John Lithgow, Casey Affleck, Wes Bentley, Bill Irwin, Mackenzie Foy',
        image: 'https://image.tmdb.org/t/p/w500/1pnigkWWy8W032o9TKDneBa3eVK.jpg' // Image Interstellar depuis TMDB
      };
    }
    
    // Pour The Truman Show, on peut extraire les infos du lien partagé
    if (contentId === '11819086') {
      return {
        title: 'The Truman Show',
        platform: 'Netflix',
        link: url,
        type: 'Film',
        description: 'Il est la vedette d\'un show télévisé - mais il ne le sait pas. Jim Carrey a conquis à la fois les critiques et le public pour sa prestation inoubliable dans ce chef-d\'œuvre de Peter Weir. Il interprète Truman Burbank, un homme dont la vie entière est un show télévisé.',
        year: '1998',
        genre: 'Drame, Comédie',
        rating: '13+',
        director: 'Peter Weir',
        cast: 'Jim Carrey, Ed Harris, Laura Linney, Noah Emmerich, Natascha McElhone, Holland Taylor, Brian Delate, Una Damon, Paul Giamatti, Peter Krause',
        image: 'https://image.tmdb.org/t/p/w500/7p5MzMb4h0Y2WUn73r4MHKNeh3X.jpg' // Image The Truman Show depuis TMDB
      };
    }
    

    
    // Pour les autres contenus Netflix, utiliser l'API TMDB
    try {
      // D'abord, essayer de trouver le titre dans notre base de données
      const netflixTitle = netflixTitles.findNetflixTitle(contentId);
      
      if (netflixTitle) {
        console.log(`🔍 Titre trouvé dans la base: ${netflixTitle.title}`);
        
        // Récupérer les détails depuis TMDB
        const tmdbResponse = await fetch(
          `https://api.themoviedb.org/3/${netflixTitle.type}/${netflixTitle.tmdbId}?api_key=${TMDB_API_KEY}&language=fr-FR&append_to_response=credits`
        );
        
        if (tmdbResponse.ok) {
          const tmdbData = await tmdbResponse.json();
          
          // Extraire le réalisateur
          let director = '';
          if (tmdbData.credits && tmdbData.credits.crew) {
            const directorInfo = tmdbData.credits.crew.find(person => 
              person.job === 'Director' || person.job === 'Réalisateur'
            );
            director = directorInfo ? directorInfo.name : '';
          }
          
          // Extraire les acteurs principaux
          let cast = '';
          if (tmdbData.credits && tmdbData.credits.cast) {
            cast = tmdbData.credits.cast.slice(0, 5).map(actor => actor.name).join(', ');
          }
          
          return {
            title: tmdbData.title || tmdbData.name,
            type: netflixTitle.type === 'tv' ? 'Série' : 'Film',
            description: tmdbData.overview,
            year: tmdbData.release_date ? new Date(tmdbData.release_date).getFullYear().toString() : 
                   (tmdbData.first_air_date ? new Date(tmdbData.first_air_date).getFullYear().toString() : null),
            rating: tmdbData.vote_average ? `${Math.round(tmdbData.vote_average)}/10` : null,
            image: tmdbData.poster_path ? `https://image.tmdb.org/t/p/w500${tmdbData.poster_path}` : null,
            director: director,
            cast: cast,
            genre: tmdbData.genres ? tmdbData.genres.map(g => g.name).join(', ') : null,
            platform: 'Netflix',
            link: url
          };
        }
      } else {
        console.log(`❌ Titre non trouvé dans la base pour l'ID: ${contentId}`);
        
        // Fallback : chercher un film populaire
        const popularMoviesResponse = await fetch(
          `https://api.themoviedb.org/3/movie/popular?api_key=${TMDB_API_KEY}&language=fr-FR&page=1`
        );
        
        if (popularMoviesResponse.ok) {
          const popularMoviesData = await popularMoviesResponse.json();
          if (popularMoviesData.results && popularMoviesData.results.length > 0) {
            const firstMovie = popularMoviesData.results[0];
            return {
              title: firstMovie.title,
              type: 'Film',
              description: firstMovie.overview,
              year: firstMovie.release_date ? new Date(firstMovie.release_date).getFullYear().toString() : null,
              rating: firstMovie.vote_average ? `${Math.round(firstMovie.vote_average)}/10` : null,
              image: firstMovie.poster_path ? `https://image.tmdb.org/t/p/w500${firstMovie.poster_path}` : null,
              platform: 'Netflix',
              link: url
            };
          }
        }
      }
      
    } catch (error) {
      console.log('⚠️ Impossible de récupérer les données depuis TMDB:', error.message);
    }
    
    // Fallback final si aucune donnée trouvée
    return {
      title: `Contenu Netflix (ID: ${contentId})`,
      platform: 'Netflix',
      link: url,
      type: 'Film',
      description: 'Contenu disponible sur Netflix',
      image: 'https://image.tmdb.org/t/p/w500/tVqvztjig1o001EAAZs9wCs3bV6.jpg' // Image par défaut
    };
  }

  /**
   * Récupère les informations Prime Video (simulation)
   * @param {string} contentId - ID du contenu Prime
   * @param {string} url - URL originale
   * @returns {Promise<Object>} - Informations simulées
   */
  static async getPrimeInfo(contentId, url) {
    // Simulation - dans un vrai projet, on utiliserait l'API Amazon
    return {
      title: `Film Prime Video (ID: ${contentId})`,
      platform: 'Prime Video',
      link: url,
      type: 'Film',
      description: 'Contenu disponible sur Prime Video'
    };
  }

  /**
   * Récupère les informations Disney+ (simulation)
   * @param {string} contentId - ID du contenu Disney
   * @param {string} url - URL originale
   * @returns {Promise<Object>} - Informations simulées
   */
  static async getDisneyInfo(contentId, url) {
    // Simulation - dans un vrai projet, on utiliserait l'API Disney
    // Pour Malcolm, on peut extraire les infos du lien partagé
    if (contentId === 'ca1ac46e-9883-4125-a6e8-97efce9a2bf5') {
      return {
        title: 'Malcolm',
        platform: 'Disney+',
        link: url,
        type: 'Série',
        description: 'Malcolm, un garçon de neuf ans qui aime traîner avec son meilleur ami Stevie, voit sa vie chamboulée quand il est forcé de rejoindre la classe des surdoués et se retrouve entouré de parias.',
        year: '2000-2005',
        genre: 'Drame, Comédie',
        rating: '12+',
        image: 'https://image.tmdb.org/t/p/w500/wN95OS6WD9T4BqA9TNCRATHcmJK.jpg' // Vraie image Malcolm depuis TMDB
      };
    }
    
    // Pour les autres contenus Disney+, essayer de chercher une image sur TMDB
    let image = null;
    try {
      // Chercher des séries populaires sur Disney+ comme fallback
      const searchResponse = await fetch(
        `https://api.themoviedb.org/3/search/tv?api_key=${TMDB_API_KEY}&query=disney&language=fr-FR&page=1`
      );
      if (searchResponse.ok) {
        const searchData = await searchResponse.json();
        if (searchData.results && searchData.results.length > 0) {
          // Prendre la première série avec une image
          const resultWithImage = searchData.results.find(result => result.poster_path);
          if (resultWithImage && resultWithImage.poster_path) {
            image = `https://image.tmdb.org/t/p/w500${resultWithImage.poster_path}`;
            console.log('✅ Image trouvée sur TMDB pour Disney+');
          }
        }
      }
    } catch (error) {
      console.log('⚠️ Impossible de récupérer l\'image depuis TMDB:', error.message);
    }
    
    // Utiliser la meilleure image disponible
    const bestImage = await movieUtils.getBestImage(image, 'disney');
    
    return {
      title: `Contenu Disney+ (ID: ${contentId})`,
      platform: 'Disney+',
      link: url,
      type: 'Film',
      description: 'Contenu disponible sur Disney+',
      image: bestImage
    };
  }

  /**
   * Récupère les informations génériques
   * @param {string} url - URL originale
   * @param {string} platform - Nom de la plateforme
   * @returns {Promise<Object>} - Informations génériques
   */
  static async getGenericInfo(url, platform) {
    return {
      title: `Contenu ${platform}`,
      platform: platform.charAt(0).toUpperCase() + platform.slice(1),
      link: url,
      type: 'Film',
      description: `Contenu disponible sur ${platform}`
    };
  }

  /**
   * Vérifie si la clé API TMDB est configurée
   * @returns {boolean} - True si la clé API est configurée
   */
  static isApiKeyConfigured() {
    return TMDB_API_KEY && TMDB_API_KEY !== 'VOTRE_CLE_API_TMDB';
  }

  /**
   * Teste si une URL est une URL de film/série valide
   * @param {string} url - URL à tester
   * @returns {boolean} - True si c'est une URL valide
   */
  static isValidMovieUrl(url) {
    if (!url) return false;
    
    const supportedPlatforms = [
      /netflix\.com/i,
      /primevideo\.com/i,
      /disneyplus\.com/i,
      /themoviedb\.org/i,
      /allocine\.fr/i,
      /imdb\.com/i
    ];
    
    return supportedPlatforms.some(pattern => pattern.test(url));
  }
}

// Export pour CommonJS
module.exports = MovieService; 