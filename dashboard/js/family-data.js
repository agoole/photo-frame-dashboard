// Family configuration for Famille HQ: Papa/Maman/Clara/Félix, chores/routine state, holidays,
// and French reading-practice word banks. Distinct from js/data.js, which owns the calendar.
window.FAMILY = (function () {
  'use strict';

  var people = {
    papa: { id: 'papa', name: 'Papa', color: '#2D5BFF', rgb: '45 91 255', ink: '#FFFFFF' },
    maman: { id: 'maman', name: 'Maman', color: '#E4007C', rgb: '228 0 124', ink: '#FFFFFF' },
    clara: { id: 'clara', name: 'Clara', age: 6, color: '#00A36C', rgb: '0 163 108', ink: '#FFFFFF' },
    felix: { id: 'felix', name: 'Félix', age: 8, color: '#FFB000', rgb: '255 176 0', ink: '#111111' }
  };

  var bathNights = [2, 4, 0]; // Tue, Thu, Sun

  var taskMenu = [
    { id: 'recycling', title: 'Trier le recyclage', emoji: '♻️', price: 1 },
    { id: 'table', title: 'Mettre la table', emoji: '🍴', price: 1 },
    { id: 'dishwasher', title: 'Vider le lave-vaisselle', emoji: '🍽️', price: 1 },
    { id: 'plants', title: 'Arroser les plantes', emoji: '🪴', price: 1 },
    { id: 'vacuum', title: 'Passer l’aspirateur', emoji: '🧹', price: 1 },
    { id: 'garbage', title: 'Sortir les poubelles', emoji: '🗑️', price: 1 }
  ];

  var routine = {
    clara: { room: false, bath: false, earned: 0, picked: [] },
    felix: { room: false, bath: false, earned: 0, picked: [] }
  };

  var holidays = [
    { name: 'Halloween', emoji: '🎃', month: 10, day: 31 },
    { name: 'Fête de l’Action de grâce', emoji: '🦃', month: 10, day: 12 },
    { name: 'Noël', emoji: '🎄', month: 12, day: 25 },
    { name: 'Jour de l’An', emoji: '🎆', month: 1, day: 1 },
    { name: 'Saint-Valentin', emoji: '💝', month: 2, day: 14 },
    { name: 'Cabane à sucre', emoji: '🍁', month: 3, day: 15 },
    { name: 'Pâques', emoji: '🐣', month: 4, day: 5 },
    { name: 'Fête des Mères', emoji: '💐', month: 5, day: 11 },
    { name: 'Fête des Pères', emoji: '🎁', month: 6, day: 15 },
    { name: 'Fête du Canada', emoji: '🇨🇦', month: 7, day: 1 },
    { name: 'Rentrée scolaire', emoji: '🎒', month: 9, day: 2 }
  ];

  // ---------------------------------------------------------------- Félix: real school spelling
  // lists (transcribed from his class's "Mes listes de mots" worksheets — Créations Carotine).
  // One list per week, each with a Friday spelling test. Lists 1-30 complete.
  var felixWordLists = [
    { n: 1, rule: 'Des mots utiles et fréquents', words: ['assez', 'bienvenu', 'rien', 'aujourd\'hui', 'dès', 'tant', 'aussitôt', 'maintenant', 'tantôt', 'bien', 'parce que', 'tôt', 'bientôt', 'plutôt'] },
    { n: 2, rule: 'Des mots utiles', words: ['bonhomme', 'cour', 'papier', 'bureau', 'femme', 'plan', 'cause', 'homme', 'prix', 'chacun', 'jumeau', 'tour', 'choix', 'métier'] },
    { n: 3, rule: 'Des mots dont le -e permet de faire sonner la consonne', words: ['article', 'manche', 'pile', 'diurne', 'mine', 'rapide', 'fleuve', 'monstre', 'timide', 'groupe', 'moule', 'machine', 'nocturne'] },
    { n: 4, rule: 'Des mots dont le -e final suivi d\'une consonne fait le son è', words: ['avant-hier', 'naturel', 'sec', 'cercle', 'perdre', 'service', 'fier', 'perte', 'ver', 'hier', 'personne', 'verre', 'lecteur', 'presque'] },
    { n: 5, rule: 'Des mots dont le son /s/ en début de mot s\'écrit s-', words: ['sang', 'soin', 'spectacle', 'sauter', 'soulier', 'sujet', 'sauver', 'sourire', 'suivre', 'sentier', 'sourcil', 'surface', 'servir', 'spécial'] },
    { n: 6, rule: 'Des mots contenant la lettre s faisant le son /z/', words: ['brise', 'église', 'raison', 'case', 'museau', 'télévision', 'chemise', 'pause', 'trésor', 'chose', 'plusieurs', 'vase', 'crise', 'pose', 'cuisinier', 'poser'] },
    { n: 7, rule: 'Des mots contenant la lettre g faisant le son /j/ ou /gu/', words: ['âgé', 'gauche', 'glacé', 'bague', 'gens', 'gueule', 'changer', 'genre', 'langue', 'figure', 'genou', 'ongle', 'gant', 'gentil', 'regarder'] },
    { n: 8, rule: 'Des mots contenant la lettre c faisant le son /s/', words: ['cinéma', 'glacier', 'musicien', 'demi-cercle', 'glaçon', 'océan', 'face', 'indice', 'pièce', 'facile', 'leçon', 'pouce', 'glace', 'morceau'] },
    { n: 9, rule: 'Des mots contenant la lettre c faisant le son /k/', words: ['balcon', 'coin', 'écolier', 'boucle', 'costume', 'écorce', 'calme', 'costumer', 'rencontre', 'car', 'contre', 'vacances', 'clé', 'course', 'clou', 'cri'] },
    { n: 10, rule: 'Des mots dont le son /t/ final s\'écrit -te', words: ['artiste', 'faute', 'perte', 'bête', 'injuste', 'plante', 'boîte', 'journaliste', 'sorte', 'côte', 'juste', 'suite', 'dentiste', 'liste', 'tarte'] },
    { n: 11, rule: 'Des mots dont le son /j/ final s\'écrit -ge', words: ['âge', 'gorge', 'personnage', 'bagage', 'horloge', 'plage', 'beige', 'langage', 'sage', 'courage', 'ménage', 'voyage', 'garage', 'orage'] },
    { n: 12, rule: 'Des mots se terminant par la lettre muette t', words: ['achat', 'bruit', 'enseignant', 'argent', 'but', 'point', 'art', 'chant', 'quart', 'autant', 'début', 'restaurant', 'bout', 'doigt', 'sport'] },
    { n: 13, rule: 'Des mots se terminant par la lettre muette s', words: ['corps', 'dos', 'sans', 'cours', 'épais', 'tapis', 'dehors', 'mauvais', 'vers', 'débris', 'paradis', 'dedans', 'relais'] },
    { n: 14, rule: 'Des mots se terminant par la lettre muette d', words: ['bavard', 'léopard', 'rond', 'blond', 'milliard', 'second', 'bord', 'regard', 'tard', 'd\'abord', 'renard', 'homard', 'retard'] },
    { n: 15, rule: 'Des mots dont les lettres b et p sont précédées de la lettre m', words: ['ampoule', 'impossible', 'sembler', 'champ', 'important', 'sombre', 'compote', 'longtemps', 'temps', 'ensemble', 'nombre', 'tomber', 'exemple', 'ombre'] },
    { n: 16, rule: 'Des adjectifs masculins dont plusieurs ont une lettre muette', words: ['brutal', 'frais', 'ouvert', 'court', 'lent', 'roux', 'droit', 'méchant', 'sportif', 'fou', 'mort', 'vivant'] },
    { n: 17, rule: 'Les doubles lettres s entre deux voyelles qui font le son /s/', words: ['cassé', 'dépasser', 'poussin', 'casser', 'délaisser', 'réussir', 'casse-tête', 'glisser', 'ruisseau', 'chasse', 'laisser', 'chasser', 'possible'] },
    { n: 18, rule: 'Des mots contenant le son /in/', words: ['après-demain', 'féminin', 'prochain', 'coquin', 'fin', 'vilain', 'demain', 'lendemain', 'voisin', 'divin', 'malin', 'faim', 'masculin'] },
    { n: 19, rule: 'Des verbes infinitifs terminant en -er', words: ['avaler', 'marcher', 'terminer', 'crier', 'mener', 'toucher', 'écouter', 'monter', 'tirer', 'jeter', 'montrer', 'tuer', 'manquer', 'rencontrer'] },
    { n: 20, rule: 'Des mots contenant une double consonne', words: ['appeler', 'frapper', 'mettre', 'battre', 'gomme', 'nourrir', 'débattre', 'goutte', 'nourriture', 'chiffre', 'guerre', 'tranquille', 'difficile', 'horrible'] },
    { n: 21, rule: 'Des mots se terminant en -eur', words: ['acheteur', 'meilleur', 'spectateur', 'chasseur', 'patineur', 'visiteur', 'coureur', 'saveur', 'voleur', 'docteur', 'serveur', 'voyageur', 'horreur', 'skieur'] },
    { n: 22, rule: 'Des verbes infinitifs terminant en -er', words: ['acheter', 'porter', 'soigner', 'cacher', 'préparer', 'trouver', 'continuer', 'présenter', 'visiter', 'coucher', 'sécher', 'voyager', 'gagner', 'secouer'] },
    { n: 23, rule: 'Des noms se terminant en -eu et des adjectifs se terminant en -eux', words: ['adieu', 'enjeu', 'nombreux', 'amoureux', 'furieux', 'orageux', 'aveu', 'lieu', 'peureux', 'courageux', 'milieu', 'précieux'] },
    { n: 24, rule: 'Des verbes infinitifs terminant en -ir', words: ['choisir', 'offrir', 'sentir', 'courir', 'ouvrir', 'servir', 'dormir', 'partir', 'sortir', 'finir', 'remplir', 'tenir', 'mourir', 'ressentir', 'venir'] },
    { n: 25, rule: 'Des noms féminins et masculins se terminant par -e, -é ou -ée', words: ['batterie', 'côté', 'poignée', 'bouchée', 'dictée', 'sortie', 'bougie', 'idée', 'vie', 'congé', 'marché', 'moitié', 'copie'] },
    { n: 26, rule: 'Des mots se terminant par une consonne finale et sonore', words: ['bol', 'journal', 'recevoir', 'clair', 'lac', 'savoir', 'devoir', 'métal', 'valoir', 'film', 'pleuvoir', 'voir', 'hôpital', 'pouvoir', 'vouloir'] },
    { n: 27, rule: 'Des verbes à l\'infinitif se terminant en -re', words: ['apprendre', 'entendre', 'rendre', 'attendre', 'joindre', 'répondre', 'comprendre', 'paraître', 'tendre', 'connaître', 'pondre', 'vivre', 'croire', 'prendre', 'décrire', 'rejoindre'] },
    { n: 28, rule: 'Des adverbes se terminant en -ment', words: ['amoureusement', 'fortement', 'possiblement', 'calmement', 'justement', 'sagement', 'courageusement', 'lentement', 'timidement', 'follement', 'ouvertement'] },
    { n: 29, rule: 'Des mots en lien avec les mathématiques', words: ['angle', 'droite', 'question', 'bande', 'environ', 'réponse', 'cent', 'ligne', 'cinquante', 'centaine', 'mille', 'soixante', 'combien', 'milliard', 'trente', 'demi', 'quarante', 'troisième'] },
    { n: 30, rule: 'Des mots en lien avec le temps et la mesure', words: ['automne', 'heure', 'minute', 'centimètre', 'hiver', 'printemps', 'cycle', 'kilomètre', 'saison', 'décimètre', 'mètre', 'seconde', 'été', 'millimètre'] }
  ];

  // List 8's week starts Monday 2026-11-02 (test Friday 2026-11-06); list 9 the following
  // Monday, etc. — one list per week, in order. Weeks before/after the transcribed range clamp
  // to the nearest end rather than going out of bounds.
  var FELIX_LIST8_MONDAY = new Date(2026, 10, 2);
  function felixListForDate(now) {
    now = now || new Date();
    var monday = new Date(now);
    var dow = monday.getDay();
    monday.setHours(0, 0, 0, 0);
    monday.setDate(monday.getDate() - ((dow + 6) % 7)); // back up to this week's Monday
    var weeksSinceList8 = Math.round((monday - FELIX_LIST8_MONDAY) / (7 * 864e5));
    var n = 8 + weeksSinceList8;
    var available = felixWordLists.filter(function (l) { return l.n === n; })[0];
    if (available) return available;
    // n is out of the transcribed range (before list 1, in the 22-24 gap, or after list 30) —
    // clamp to the nearest list we actually have rather than showing nothing.
    var sorted = felixWordLists.slice().sort(function (a, b) { return a.n - b.n; });
    if (n < sorted[0].n) return sorted[0];
    for (var i = sorted.length - 1; i >= 0; i--) if (sorted[i].n <= n) return sorted[i];
    return sorted[sorted.length - 1];
  }
  // This week's Friday test date (for display — "test ce vendredi").
  function felixTestDate(now) {
    now = now || new Date();
    var d = new Date(now);
    var dow = d.getDay();
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + ((5 - dow + 7) % 7)); // forward to this week's Friday
    return d;
  }

  // ---------------------------------------------------------------- Clara: phonics by sound
  var claraPhonics = [
    { sound: 'a', words: ['papa', 'avion', 'ami'] },
    { sound: 'i', words: ['ici', 'lit', 'tapis'] },
    { sound: 'o', words: ['moto', 'vélo', 'zéro'] },
    { sound: 'u', words: ['tutu', 'lune', 'rue'] },
    { sound: 'é', words: ['été', 'vélo', 'école'] },
    { sound: 'è', words: ['mère', 'père', 'fève'] },
    { sound: 'ou', words: ['loup', 'roue', 'bijou'] },
    { sound: 'oi', words: ['roi', 'moi', 'toit'] },
    { sound: 'eu', words: ['feu', 'jeu', 'bleu'] },
    { sound: 'on', words: ['maison', 'ballon', 'savon'] }
  ];

  // ---------------------------------------------------------------- common-word bank ("mot du jour")
  // A broad, kid-safe slice of frequent French words. Not exhaustive — grown over time as needed.
  var wordBank = [
    'de', 'la', 'le', 'et', 'les', 'des', 'un', 'une', 'être', 'avoir', 'je', 'tu', 'il', 'elle', 'nous', 'vous',
    'ils', 'elles', 'ce', 'qui', 'que', 'dans', 'pour', 'pas', 'sur', 'avec', 'mais', 'ou', 'où', 'si', 'par',
    'plus', 'dire', 'tout', 'faire', 'bien', 'aller', 'voir', 'savoir', 'pouvoir', 'falloir', 'vouloir', 'venir',
    'devoir', 'prendre', 'donner', 'trouver', 'parler', 'aimer', 'passer', 'mettre', 'demander', 'tenir',
    'sembler', 'laisser', 'rester', 'penser', 'entendre', 'regarder', 'répondre', 'rendre', 'connaître',
    'paraître', 'sentir', 'arriver', 'jour', 'temps', 'an', 'fois', 'moment', 'main', 'homme', 'femme', 'enfant',
    'monde', 'vie', 'yeux', 'tête', 'maison', 'eau', 'pays', 'ami', 'chose', 'histoire', 'nuit', 'matin',
    'soir', 'mot', 'voix', 'porte', 'ville', 'air', 'coeur', 'esprit', 'travail', 'mer', 'ciel', 'terre',
    'soleil', 'lune', 'jardin', 'arbre', 'fleur', 'oiseau', 'chien', 'chat', 'cheval', 'lapin', 'poisson',
    'papa', 'maman', 'frère', 'soeur', 'bébé', 'école', 'classe', 'livre', 'crayon', 'table', 'chaise', 'lit',
    'fenêtre', 'rouge', 'bleu', 'vert', 'jaune', 'noir', 'blanc', 'gris', 'rose', 'orange', 'violet', 'grand',
    'petit', 'beau', 'joli', 'gentil', 'content', 'heureux', 'triste', 'fâché', 'fatigué', 'malade', 'froid',
    'chaud', 'doux', 'dur', 'facile', 'difficile', 'nouveau', 'vieux', 'jeune', 'premier', 'dernier', 'seul',
    'même', 'autre', 'chaque', 'quelque', 'plusieurs', 'beaucoup', 'peu', 'trop', 'assez', 'encore', 'déjà',
    'toujours', 'jamais', 'souvent', 'parfois', 'maintenant', 'après', 'avant', 'ensuite', 'enfin', 'ici',
    'là', 'partout', 'dehors', 'dedans', 'dessus', 'dessous', 'devant', 'derrière', 'loin', 'près', 'un',
    'deux', 'trois', 'quatre', 'cinq', 'six', 'sept', 'huit', 'neuf', 'dix', 'cent', 'mille', 'lundi', 'mardi',
    'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche', 'janvier', 'février', 'mars', 'avril', 'mai', 'juin',
    'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre', 'printemps', 'été', 'automne', 'hiver',
    'manger', 'boire', 'dormir', 'jouer', 'courir', 'marcher', 'sauter', 'nager', 'chanter', 'danser', 'rire',
    'pleurer', 'crier', 'chuchoter', 'écouter', 'lire', 'écrire', 'dessiner', 'peindre', 'construire', 'casser',
    'ouvrir', 'fermer', 'allumer', 'éteindre', 'monter', 'descendre', 'entrer', 'sortir', 'partir', 'revenir',
    'commencer', 'finir', 'continuer', 'arrêter', 'attendre', 'chercher', 'trouver', 'perdre', 'gagner',
    'aider', 'partager', 'choisir', 'décider', 'essayer', 'réussir', 'apprendre', 'enseigner', 'comprendre',
    'expliquer', 'raconter', 'inviter', 'visiter', 'voyager', 'rêver', 'imaginer', 'oublier', 'rappeler',
    'famille', 'cousin', 'cousine', 'oncle', 'tante', 'grand-père', 'grand-mère', 'voisin', 'copain', 'copine',
    'camarade', 'maître', 'maîtresse', 'directeur', 'docteur', 'infirmière', 'pompier', 'policier', 'facteur',
    'boulanger', 'fermier', 'pêcheur', 'cuisinier', 'musicien', 'peintre', 'écrivain', 'chanteur', 'danseur',
    'sportif', 'nageur', 'coureur', 'cuisine', 'salon', 'chambre', 'salle', 'bain', 'jardin', 'garage', 'cour',
    'toit', 'mur', 'sol', 'escalier', 'couloir', 'placard', 'tiroir', 'miroir', 'lampe', 'horloge', 'tapis',
    'rideau', 'coussin', 'couverture', 'oreiller', 'serviette', 'savon', 'brosse', 'dentifrice', 'peigne',
    'vêtement', 'chemise', 'pantalon', 'robe', 'jupe', 'chaussette', 'chaussure', 'botte', 'manteau', 'chapeau',
    'écharpe', 'gant', 'ceinture', 'pyjama', 'maillot', 'sac', 'cartable', 'trousse', 'gomme', 'règle', 'ciseau',
    'colle', 'feuille', 'page', 'image', 'photo', 'carte', 'lettre', 'journal', 'magazine', 'dictionnaire',
    'histoire', 'conte', 'poème', 'chanson', 'musique', 'instrument', 'piano', 'guitare', 'tambour', 'flûte',
    'ballon', 'jeu', 'jouet', 'poupée', 'robot', 'puzzle', 'cube', 'corde', 'vélo', 'trottinette', 'patin',
    'piscine', 'plage', 'sable', 'vague', 'bateau', 'avion', 'train', 'voiture', 'camion', 'autobus', 'route',
    'pont', 'magasin', 'marché', 'boutique', 'caisse', 'argent', 'prix', 'cadeau', 'fête', 'anniversaire',
    'gâteau', 'bougie', 'ballon', 'invité', 'musique', 'danse', 'repas', 'déjeuner', 'dîner', 'souper', 'goûter',
    'pain', 'beurre', 'confiture', 'fromage', 'lait', 'jus', 'eau', 'soupe', 'salade', 'viande', 'poisson',
    'poulet', 'oeuf', 'riz', 'pâtes', 'pomme', 'poire', 'banane', 'orange', 'fraise', 'raisin', 'cerise',
    'citron', 'carotte', 'tomate', 'pomme-de-terre', 'haricot', 'petit-pois', 'salade', 'chocolat', 'bonbon',
    'glace', 'biscuit', 'tarte', 'miel', 'sucre', 'sel', 'poivre', 'huile', 'farine', 'oeuf', 'nuage', 'pluie',
    'neige', 'vent', 'orage', 'tonnerre', 'éclair', 'arc-en-ciel', 'brouillard', 'glace', 'gel', 'chaleur',
    'tempête', 'forêt', 'montagne', 'rivière', 'lac', 'océan', 'île', 'désert', 'vallée', 'colline', 'pierre',
    'roche', 'sable', 'herbe', 'feuille', 'branche', 'racine', 'graine', 'fruit', 'légume', 'jardin', 'ferme',
    'animal', 'vache', 'cochon', 'mouton', 'chèvre', 'poule', 'coq', 'canard', 'cheval', 'âne', 'souris', 'rat',
    'écureuil', 'renard', 'loup', 'ours', 'lion', 'tigre', 'éléphant', 'girafe', 'singe', 'serpent', 'tortue',
    'grenouille', 'papillon', 'abeille', 'fourmi', 'araignée', 'mouche', 'moustique', 'coccinelle',

    // --- extended coverage: body, health, emotions, time, school, town, sport, more verbs/adj ---
    'corps', 'bras', 'jambe', 'pied', 'doigt', 'orteil', 'genou', 'coude', 'épaule', 'dos', 'ventre',
    'poitrine', 'cou', 'menton', 'joue', 'front', 'sourcil', 'cil', 'paupière', 'narine', 'lèvre',
    'langue', 'dent', 'gorge', 'cheveux', 'oreille', 'nez', 'bouche', 'oeil', 'peau', 'os', 'muscle',
    'sang', 'coeur', 'poumon', 'cerveau', 'squelette', 'santé', 'maladie', 'fièvre', 'rhume', 'toux',
    'blessure', 'bleu', 'bosse', 'pansement', 'médicament', 'piqûre', 'vaccin', 'hôpital', 'clinique',
    'ambulance', 'urgence', 'guérir', 'soigner', 'respirer', 'tousser', 'éternuer', 'vomir',
    'content', 'joyeux', 'ravi', 'excité', 'calme', 'paisible', 'inquiet', 'nerveux', 'anxieux',
    'effrayé', 'terrifié', 'surpris', 'étonné', 'choqué', 'dégoûté', 'jaloux', 'fier', 'honteux',
    'gêné', 'timide', 'courageux', 'peureux', 'curieux', 'confus', 'perplexe', 'ennuyé', 'déçu',
    'frustré', 'énervé', 'furieux', 'calme', 'détendu', 'stressé', 'épuisé', 'reposé', 'motivé',
    'découragé', 'confiant', 'inquiet', 'amoureux', 'reconnaissant', 'généreux', 'égoïste',
    'patient', 'impatient', 'poli', 'impoli', 'honnête', 'menteur', 'juste', 'injuste', 'sage',
    'minute', 'seconde', 'heure', 'journée', 'semaine', 'mois', 'année', 'siècle', 'saison',
    'aujourd’hui', 'demain', 'hier', 'bientôt', 'tard', 'tôt', 'rapide', 'lent', 'vite', 'doucement',
    'rapidement', 'lentement', 'soudain', 'brusquement', 'calendrier', 'horaire', 'rendez-vous',
    'réveil', 'minuit', 'midi', 'aube', 'crépuscule', 'lever', 'coucher', 'pendule', 'chronomètre',
    'mathématiques', 'français', 'sciences', 'histoire', 'géographie', 'musique', 'art', 'sport',
    'éducation', 'physique', 'informatique', 'anglais', 'récréation', 'devoirs', 'examen', 'test',
    'note', 'résultat', 'réussite', 'échec', 'diplôme', 'rentrée', 'vacances', 'congé', 'pupitre',
    'tableau', 'craie', 'marqueur', 'surligneur', 'agrafeuse', 'perforatrice', 'classeur', 'reliure',
    'bibliothèque', 'bibliothécaire', 'cour', 'gymnase', 'cafétéria', 'autobus', 'scolaire',
    'directrice', 'principal', 'concierge', 'secrétaire', 'infirmier', 'conseiller', 'élève',
    'étudiant', 'groupe', 'équipe', 'projet', 'présentation', 'exposé', 'recherche', 'question',
    'réponse', 'problème', 'solution', 'idée', 'exemple', 'résumé', 'conclusion', 'introduction',
    'ville', 'village', 'quartier', 'rue', 'avenue', 'boulevard', 'trottoir', 'parc', 'place',
    'fontaine', 'statue', 'monument', 'musée', 'théâtre', 'cinéma', 'restaurant', 'café', 'hôtel',
    'banque', 'poste', 'pharmacie', 'épicerie', 'boulangerie', 'boucherie', 'librairie', 'station',
    'aéroport', 'gare', 'port', 'usine', 'bureau', 'commerce', 'entreprise', 'mairie', 'église',
    'temple', 'synagogue', 'mosquée', 'cimetière', 'pont', 'tunnel', 'autoroute', 'carrefour',
    'feu', 'signal', 'panneau', 'piéton', 'trottoir', 'circulation', 'embouteillage', 'klaxon',
    'football', 'hockey', 'basketball', 'baseball', 'tennis', 'volleyball', 'golf', 'ski',
    'patinage', 'natation', 'course', 'vélo', 'gymnastique', 'karaté', 'judo', 'escrime', 'boxe',
    'aviron', 'voile', 'pêche', 'chasse', 'randonnée', 'camping', 'escalade', 'équitation',
    'entraîneur', 'arbitre', 'joueur', 'équipe', 'match', 'tournoi', 'championnat', 'médaille',
    'trophée', 'record', 'victoire', 'défaite', 'but', 'point', 'score', 'terrain', 'stade',
    'arène', 'patinoire', 'vestiaire', 'casque', 'protège-dents', 'short', 'maillot', 'crampon',
    'raquette', 'bâton', 'rondelle', 'filet', 'panier', 'arbitrage', 'mi-temps', 'prolongation',
    'avocat', 'ingénieur', 'architecte', 'scientifique', 'journaliste', 'photographe', 'acteur',
    'actrice', 'réalisateur', 'auteur', 'traducteur', 'vétérinaire', 'dentiste', 'pharmacien',
    'électricien', 'plombier', 'mécanicien', 'menuisier', 'charpentier', 'peintre', 'couturier',
    'coiffeur', 'esthéticienne', 'comptable', 'banquier', 'vendeur', 'caissier', 'serveur',
    'chef', 'pâtissier', 'agriculteur', 'bûcheron', 'mineur', 'marin', 'capitaine', 'pilote',
    'astronaute', 'soldat', 'général', 'président', 'maire', 'gouverneur', 'roi', 'reine',
    'prince', 'princesse', 'chevalier', 'magicien', 'sorcière', 'fée', 'dragon', 'géant',
    'monstre', 'fantôme', 'vampire', 'zombie', 'extraterrestre', 'robot', 'super-héros',
    'planète', 'étoile', 'galaxie', 'univers', 'fusée', 'satellite', 'comète', 'astéroïde',
    'système', 'solaire', 'télescope', 'observatoire', 'gravité', 'orbite', 'atmosphère',
    'ordinateur', 'tablette', 'téléphone', 'écran', 'clavier', 'souris', 'imprimante', 'caméra',
    'appareil', 'batterie', 'chargeur', 'câble', 'internet', 'courriel', 'message', 'application',
    'logiciel', 'jeu-vidéo', 'manette', 'casque', 'télévision', 'radio', 'haut-parleur',
    'triangle', 'carré', 'cercle', 'rectangle', 'losange', 'ovale', 'cube', 'sphère', 'cylindre',
    'pyramide', 'ligne', 'point', 'angle', 'longueur', 'largeur', 'hauteur', 'poids', 'mesure',
    'centimètre', 'mètre', 'kilomètre', 'litre', 'kilogramme', 'gramme', 'addition', 'soustraction',
    'multiplication', 'division', 'fraction', 'nombre', 'chiffre', 'calcul', 'pair', 'impair',
    'oncle', 'neveu', 'nièce', 'beau-père', 'belle-mère', 'demi-frère', 'demi-soeur', 'jumeau',
    'jumelle', 'adulte', 'personne', 'gens', 'humain', 'voisinage', 'communauté', 'société',
    'culture', 'tradition', 'coutume', 'religion', 'langue', 'pays', 'nation', 'drapeau', 'carte',
    'continent', 'frontière', 'capitale', 'province', 'région', 'climat', 'température', 'saison',
    'douche', 'baignoire', 'robinet', 'toilette', 'évier', 'four', 'cuisinière', 'réfrigérateur',
    'congélateur', 'micro-ondes', 'grille-pain', 'bouilloire', 'casserole', 'poêle', 'assiette',
    'bol', 'tasse', 'verre', 'fourchette', 'couteau', 'cuillère', 'nappe', 'serviette',
    'aspirateur', 'balai', 'vadrouille', 'seau', 'poubelle', 'recyclage', 'compost', 'lessive',
    'sèche-linge', 'fer', 'planche', 'coffre', 'étagère', 'bibliothèque', 'canapé', 'fauteuil',
    'tabouret', 'bureau', 'imprimante', 'climatiseur', 'chauffage', 'thermostat', 'interrupteur',
    'prise', 'ampoule', 'bougie', 'allumette', 'briquet', 'extincteur', 'alarme', 'détecteur',
    'courageusement', 'gentiment', 'rapidement', 'soigneusement', 'attentivement', 'calmement',
    'tranquillement', 'joyeusement', 'tristement', 'fortement', 'doucement', 'silencieusement',
    'ensemble', 'séparément', 'longtemps', 'brièvement', 'exactement', 'presque', 'environ',
    'certainement', 'peut-être', 'probablement', 'évidemment', 'finalement', 'heureusement',
    'malheureusement', 'particulièrement', 'spécialement', 'simplement', 'facilement',
    'bateau', 'canot', 'kayak', 'voilier', 'sous-marin', 'traversier', 'hélicoptère', 'fusée',
    'montgolfière', 'planeur', 'tracteur', 'excavatrice', 'grue', 'bulldozer', 'ambulance',
    'pompier', 'police', 'taxi', 'métro', 'tramway', 'funiculaire', 'télécabine', 'luge',
    'traîneau', 'skateboard', 'patinette', 'tricycle', 'poussette', 'fauteuil', 'béquille'
  ];

  function dayNumber(date) {
    var start = new Date(date.getFullYear(), 0, 0);
    return Math.floor((date - start) / 864e5);
  }

  // Simple deterministic PRNG so "today's words" are stable all day but differ by kid/date.
  function pick(seed, n, pool) {
    var s = seed >>> 0;
    function next() { s = (s * 1103515245 + 12345) & 0x7fffffff; return s; }
    var used = {}, out = [];
    while (out.length < n && out.length < pool.length) {
      var idx = next() % pool.length;
      if (used[idx]) continue;
      used[idx] = true;
      out.push(pool[idx]);
    }
    return out;
  }

  function wordOfDay(personId, count, now) {
    now = now || new Date();
    var seed = dayNumber(now) * 1000 + (personId === 'clara' ? 1 : 2);
    return pick(seed, count || 5, wordBank);
  }

  return {
    people: people,
    bathNights: bathNights,
    taskMenu: taskMenu,
    routine: routine,
    holidays: holidays,
    felixWordLists: felixWordLists,
    felixListForDate: felixListForDate,
    felixTestDate: felixTestDate,
    claraPhonics: claraPhonics,
    wordBank: wordBank,
    dayNumber: dayNumber,
    wordOfDay: wordOfDay
  };
})();
