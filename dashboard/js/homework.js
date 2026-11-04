// Full-screen "homework" review for the kid views, launched by the "Commencer les devoirs"
// button in kid-view.js. Three modes, picked per kid (passed in by clara.js / felix.js):
//
//   - 'letters' (Clara, 6yo, phonics stage): a slider-scrubbing word browser — one word at a
//     time with a slider under it, divided into one stop per LETTER. Dragging across a letter
//     plays that letter's phonetic sound (not its alphabet name — "beu" for B, not "bé") from
//     public/audio/fr-letters/<letter>.mp3, so dragging slowly across "chat" sounds out c-h-a-t.
//   - 'scrub': a slider-scrubbing word browser like 'letters', but scrubs the single whole-word
//     clip (window.Reading.CLIPS) by setting an <audio> element's currentTime proportionally to
//     the slider position — a real audio scrubber, not re-triggering playback. (Not currently
//     used by either kid view, kept for future use — e.g. a non-quiz browse mode.)
//   - 'quiz' (Félix, 8yo, spelling-test prep): a listen-and-type spelling quiz over his current
//     week's real word list (FAMILY.felixListForDate() in family-data.js). Plays each word's
//     audio, Félix types it on an on-screen French keyboard, an optional hint is available per
//     word (doesn't affect score, just tracked), and a score screen shows at the end.
window.Homework = (function () {
  'use strict';

  var LETTERS_BASE = '/audio/fr-letters/';
  var state = null; // browse state: { words, mode, idx, personId }
  var quiz = null; // quiz state: { words, idx, personId, typed, results, hintUsed }

  function wordList(personId) {
    if (personId === 'clara') {
      var out = [];
      window.FAMILY.claraPhonics.forEach(function (g) { out = out.concat(g.words); });
      return out;
    }
    return window.FAMILY.felixListForDate().words.slice();
  }

  function letterSlug(ch) {
    // Strip accents so e.g. "é" in a word still maps to the base letter's sound clip.
    return ch.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  }

  function playWord(word) {
    var slug = window.Reading.CLIPS[word];
    if (!slug) return;
    var a = new Audio('/audio/fr/' + slug + '.mp3');
    a.volume = (window.App && typeof App.soundVolume === 'number') ? App.soundVolume : 1;
    a.play().catch(function () {});
  }

  function playLetter(word, idx) {
    var ch = word[idx];
    if (!/[a-zA-Zàâäéèêëïîôöùûüÿçœæ]/.test(ch)) return;
    var a = new Audio(LETTERS_BASE + letterSlug(ch) + '.mp3');
    a.volume = (window.App && typeof App.soundVolume === 'number') ? App.soundVolume : 1;
    a.play().catch(function () {});
  }

  // ------------------------------------------------------------ browse modes (letters / scrub)

  function renderWord(word, mode) {
    var chars = word.split('');
    if (mode === 'letters') {
      return '<div class="hw-word">' + chars.map(function (c, i) {
        return '<span class="hw-letter" data-letter-idx="' + i + '">' + App.esc(c) + '</span>';
      }).join('') + '</div>';
    }
    return '<div class="hw-word hw-word--whole">' + App.esc(word) + '</div>';
  }

  function renderBrowse() {
    var s = state;
    var word = s.words[s.idx];
    var p = window.FAMILY.people[s.personId];
    var isLast = s.idx === s.words.length - 1;
    var html = '<div class="hw" style="' + App.pstyle(p) + '">' +
      '<div class="hw-progress">' + (s.idx + 1) + ' / ' + s.words.length + '</div>' +
      renderWord(word, s.mode) +
      '<div class="hw-slider-wrap">' +
      '<input type="range" class="hw-slider" min="0" max="1000" value="0" step="1">' +
      '</div>' +
      '<div class="hw-actions">' +
      '<button class="hw-btn hw-btn--ghost" data-hw-replay>' + App.icon('play', 22) + ' Réécouter</button>' +
      '<button class="hw-btn" data-hw-next>' + (isLast ? 'Terminer' : 'Suivant') + '</button>' +
      '</div></div>';
    document.querySelector('#homeworkSheet').innerHTML = html;
    wireSlider();
  }

  function wireSlider() {
    var s = state;
    var word = s.words[s.idx];
    var slider = document.querySelector('.hw-slider');
    var letters = document.querySelectorAll('.hw-letter');
    var wholeAudio = null;
    var lastLetterIdx = -1;

    if (s.mode === 'scrub') {
      var slug = window.Reading.CLIPS[word];
      if (slug) {
        wholeAudio = new Audio('/audio/fr/' + slug + '.mp3');
        wholeAudio.volume = (window.App && typeof App.soundVolume === 'number') ? App.soundVolume : 1;
        wholeAudio.preload = 'auto';
      }
    }

    function onInput() {
      var frac = +slider.value / 1000;
      if (s.mode === 'letters') {
        var idx = Math.min(word.length - 1, Math.floor(frac * word.length));
        if (idx !== lastLetterIdx) {
          lastLetterIdx = idx;
          playLetter(word, idx);
          letters.forEach(function (el, i) { el.classList.toggle('is-active', i === idx); });
        }
      } else if (wholeAudio && wholeAudio.duration) {
        wholeAudio.currentTime = frac * wholeAudio.duration;
        if (wholeAudio.paused) wholeAudio.play().catch(function () {});
      }
    }

    slider.addEventListener('input', onInput);
    if (wholeAudio) {
      slider.addEventListener('change', function () { if (wholeAudio) wholeAudio.pause(); });
    }
  }

  function replayBrowse() {
    var s = state, word = s.words[s.idx];
    if (s.mode === 'letters') {
      var i = 0;
      (function step() {
        if (i >= word.length) return;
        playLetter(word, i);
        document.querySelectorAll('.hw-letter').forEach(function (el, idx) { el.classList.toggle('is-active', idx === i); });
        i++;
        setTimeout(step, 550);
      })();
    } else {
      window.Reading.speak(word);
    }
  }

  function nextBrowse() {
    if (state.idx >= state.words.length - 1) { App.closeSheet(); return; }
    state.idx++;
    renderBrowse();
  }

  function startBrowse(personId, mode) {
    var words = wordList(personId);
    if (!words.length) return;
    state = { personId: personId, mode: mode, words: words, idx: 0 };
    App.sheet('<div id="homeworkSheet"></div>', {
      cls: 'sheet--homework',
      onMount: function (sheetEl) {
        renderBrowse();
        sheetEl.addEventListener('click', function (e) {
          if (e.target.closest('[data-hw-next]')) nextBrowse();
          if (e.target.closest('[data-hw-replay]')) replayBrowse();
        });
      },
      onClose: function () { state = null; }
    });
  }

  // ------------------------------------------------------------ quiz mode (Félix)

  var KEY_ROWS = [
    ['a', 'z', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
    ['q', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'm'],
    ['⇧', 'w', 'x', 'c', 'v', 'b', 'n', 'é', 'è', '⌫'],
    ['à', 'â', 'ê', 'î', 'ô', 'û', 'ç', 'œ', '-', '␣']
  ];

  function renderKeyboard() {
    return '<div class="hw-kbd">' + KEY_ROWS.map(function (row) {
      return '<div class="hw-kbd-row">' + row.map(function (k) {
        var cls = 'hw-key';
        if (k === '⌫' || k === '⇧') cls += ' hw-key--wide';
        if (k === '␣') cls += ' hw-key--space';
        return '<button class="' + cls + '" data-key="' + App.esc(k) + '">' + (k === '␣' ? 'espace' : App.esc(k)) + '</button>';
      }).join('') + '</div>';
    }).join('') + '</div>';
  }

  function renderQuiz() {
    var q = quiz;
    var word = q.words[q.idx];
    var isLast = q.idx === q.words.length - 1;
    var p = window.FAMILY.people[q.personId];
    var html = '<div class="hw hw--quiz" style="' + App.pstyle(p) + '">' +
      '<div class="hw-progress">Mot ' + (q.idx + 1) + ' / ' + q.words.length + '</div>' +
      '<button class="hw-quiz-replay" data-hw-quiz-replay>' + App.icon('play', 40) + '</button>' +
      '<div class="hw-typed" data-hw-typed>' + (q.typed || '<span class="hw-typed-ph">Écoute et écris le mot</span>') + '</div>' +
      (q.hintUsed ? '<div class="hw-hint">Indice : ' + App.esc(word[0].toUpperCase()) + '… (' + word.length + ' lettres)</div>' : '') +
      '<div class="hw-quiz-actions">' +
      '<button class="hw-btn hw-btn--ghost" data-hw-hint>' + App.icon('play', 18) + ' Indice</button>' +
      '<button class="hw-btn hw-btn--ghost" data-hw-clear>Effacer</button>' +
      '<button class="hw-btn" data-hw-check>' + (isLast ? 'Vérifier et terminer' : 'Vérifier') + '</button>' +
      '</div>' +
      renderKeyboard() +
      '</div>';
    document.querySelector('#homeworkSheet').innerHTML = html;
  }

  function normalize(s) {
    return s.trim().toLowerCase();
  }

  function renderQuizResult(ok, correctWord) {
    var q = quiz;
    var html = '<div class="hw hw--quiz" style="' + App.pstyle(window.FAMILY.people[q.personId]) + '">' +
      '<div class="hw-progress">Mot ' + (q.idx + 1) + ' / ' + q.words.length + '</div>' +
      '<div class="hw-result ' + (ok ? 'is-ok' : 'is-no') + '">' +
      (ok ? App.icon('check', 56) : App.icon('x', 56)) +
      '<div class="hw-result-word">' + App.esc(correctWord) + '</div>' +
      (ok ? '' : '<div class="hw-result-sub">Tu avais écrit : « ' + App.esc(q.typed || '') + ' »</div>') +
      '</div>' +
      '<button class="hw-btn hw-btn--big" data-hw-quiz-continue>Continuer</button>' +
      '</div>';
    document.querySelector('#homeworkSheet').innerHTML = html;
  }

  function renderQuizScore() {
    var q = quiz;
    var total = q.results.length;
    var correct = q.results.filter(function (r) { return r.ok; }).length;
    var pct = total ? Math.round(correct / total * 100) : 0;
    var missed = q.results.filter(function (r) { return !r.ok; });
    var p = window.FAMILY.people[q.personId];
    var html = '<div class="hw hw--score" style="' + App.pstyle(p) + '">' +
      '<div class="hw-score-big">' + correct + ' / ' + total + '</div>' +
      '<div class="hw-score-pct">' + pct + ' %</div>' +
      (missed.length ? '<div class="hw-score-missed"><b>À revoir :</b> ' + missed.map(function (r) { return App.esc(r.word); }).join(', ') + '</div>' : '<div class="hw-score-missed hw-score-missed--perfect">Parfait ! 🎉</div>') +
      '<button class="hw-btn hw-btn--big" data-hw-done>Terminé</button>' +
      '</div>';
    document.querySelector('#homeworkSheet').innerHTML = html;
  }

  function quizNext() {
    if (quiz.idx >= quiz.words.length - 1) { renderQuizScore(); return; }
    quiz.idx++;
    quiz.typed = '';
    quiz.hintUsed = false;
    renderQuiz();
    setTimeout(function () { playWord(quiz.words[quiz.idx]); }, 300);
  }

  function quizCheck() {
    var q = quiz, word = q.words[q.idx];
    var ok = normalize(q.typed || '') === normalize(word);
    q.results.push({ word: word, ok: ok, hint: !!q.hintUsed });
    renderQuizResult(ok, word);
  }

  function onQuizKey(key) {
    var q = quiz;
    if (key === '⌫') { q.typed = (q.typed || '').slice(0, -1); }
    else if (key === '⇧') { return; }
    else if (key === '␣') { q.typed = (q.typed || '') + ' '; }
    else { q.typed = (q.typed || '') + key; }
    var el = document.querySelector('[data-hw-typed]');
    if (el) el.innerHTML = q.typed || '<span class="hw-typed-ph">Écoute et écris le mot</span>';
  }

  function startQuiz(personId) {
    var words = wordList(personId);
    if (!words.length) return;
    quiz = { personId: personId, words: words, idx: 0, typed: '', results: [], hintUsed: false };
    App.sheet('<div id="homeworkSheet"></div>', {
      cls: 'sheet--homework sheet--homework-quiz',
      onMount: function (sheetEl) {
        renderQuiz();
        setTimeout(function () { playWord(quiz.words[0]); }, 300);
        sheetEl.addEventListener('click', function (e) {
          var t;
          if ((t = e.target.closest('[data-key]'))) { onQuizKey(t.dataset.key); return; }
          if (e.target.closest('[data-hw-quiz-replay]')) { playWord(quiz.words[quiz.idx]); return; }
          if (e.target.closest('[data-hw-clear]')) { quiz.typed = ''; renderQuiz(); return; }
          if (e.target.closest('[data-hw-hint]')) { quiz.hintUsed = true; renderQuiz(); return; }
          if (e.target.closest('[data-hw-check]')) { quizCheck(); return; }
          if (e.target.closest('[data-hw-quiz-continue]')) { quizNext(); return; }
          if (e.target.closest('[data-hw-done]')) { App.closeSheet(); return; }
        });
      },
      onClose: function () { quiz = null; }
    });
  }

  // ------------------------------------------------------------ entry point

  function start(personId, mode) {
    if (mode === 'quiz') return startQuiz(personId);
    return startBrowse(personId, mode);
  }

  return { start: start };
})();
