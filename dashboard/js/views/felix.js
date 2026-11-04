// Félix's persona view (8yo): shared kid-view chrome (chores/holiday/mot-du-jour/outfit) plus
// this week's real spelling-test word list ("Liste de mots"), from his class's weekly lists —
// see FAMILY.felixListForDate() in family-data.js. The actual listen-and-type quiz is the
// "Commencer les devoirs" button (homework.js's quiz mode), not this panel — this is just the
// browsable/listenable word list.
(function () {
  'use strict';

  function readingSection() {
    var list = window.FAMILY.felixListForDate();
    var test = window.FAMILY.felixTestDate();
    var DOW_FR = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
    return '<section class="kd-card kd-reading">' +
      '<header class="ch-head"><div><b>Liste ' + list.n + '</b><span class="ch-sub">Test ' + DOW_FR[test.getDay()] + ' ' + test.getDate() + '</span></div></header>' +
      '<div class="kd-phonics">' +
      '<div class="kd-phonics-group kd-phonics-group--stack">' +
      '<span class="kd-theme-label">' + App.esc(list.rule) + '</span>' +
      '<span class="kd-phonics-words">' + list.words.map(function (w) {
        return '<button class="kd-word" data-say="' + App.esc(w) + '">' + App.icon('play', 16) + App.esc(w) + '</button>';
      }).join('') + '</span></div>' +
      '</div></section>';
  }

  App.register('felix', window.makeKidView('felix', readingSection, 'quiz'));
})();
