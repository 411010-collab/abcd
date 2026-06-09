const wordForm = document.getElementById('wordForm');
const wordInput = document.getElementById('wordInput');
const translationInput = document.getElementById('translationInput');
const partOfSpeechInput = document.getElementById('partOfSpeechInput');
const exampleInput = document.getElementById('exampleInput');
const rootInput = document.getElementById('rootInput');
const autoFillButton = document.getElementById('autoFillButton');
const clearFormButton = document.getElementById('clearForm');
const wordList = document.getElementById('wordList');
const viewFlashcards = document.getElementById('viewFlashcards');
const viewManage = document.getElementById('viewManage');
const flashcardView = document.getElementById('flashcardView');
const manageView = document.getElementById('manageView');
const flashcard = document.getElementById('flashcard');
const frontText = document.getElementById('frontText');
const backTranslation = document.getElementById('backTranslation');
const backPartOfSpeech = document.getElementById('backPartOfSpeech');
const backExample = document.getElementById('backExample');
const backRoot = document.getElementById('backRoot');
const prevWordBtn = document.getElementById('prevWord');
const nextWordBtn = document.getElementById('nextWord');
const shuffleWordsBtn = document.getElementById('shuffleWords');

let currentIndex = 0;
let isFlipped = false;
const STORAGE_KEY = 'vocabDeckApp';

function loadWords() {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : [];
}

function saveWords(words) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(words));
}

function getCurrentWords() {
  return loadWords();
}

function renderWordList() {
  const words = getCurrentWords();
  if (words.length === 0) {
    wordList.innerHTML = '<li class="word-item"><p>目前尚未新增任何單字。</p></li>';
    return;
  }

  wordList.innerHTML = words
    .map((entry, index) => {
      return `
        <li class="word-item">
          <h3>${escapeHtml(entry.word)}</h3>
          <p><strong>翻譯：</strong>${escapeHtml(entry.translation)}</p>
          <p><strong>詞性：</strong>${escapeHtml(entry.partOfSpeech)}</p>
          <p><strong>例句：</strong>${escapeHtml(entry.example)}</p>
          <p><strong>字根分析：</strong>${escapeHtml(entry.rootAnalysis)}</p>
          <div class="word-actions">
            <button type="button" data-index="${index}" class="delete-word">刪除</button>
          </div>
        </li>
      `;
    })
    .join('');

  document.querySelectorAll('.delete-word').forEach((button) => {
    button.addEventListener('click', () => {
      const words = getCurrentWords();
      const index = Number(button.dataset.index);
      words.splice(index, 1);
      saveWords(words);
      currentIndex = Math.min(currentIndex, words.length - 1);
      renderWordList();
      refreshFlashcard();
    });
  });
}

function escapeHtml(text) {
  return String(text || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function refreshFlashcard() {
  const words = getCurrentWords();
  if (words.length === 0) {
    frontText.textContent = '無單字';
    backTranslation.textContent = '-';
    backPartOfSpeech.textContent = '-';
    backExample.textContent = '-';
    backRoot.textContent = '-';
    return;
  }

  if (currentIndex < 0) currentIndex = 0;
  if (currentIndex >= words.length) currentIndex = words.length - 1;

  const entry = words[currentIndex];
  frontText.textContent = entry.word;
  backTranslation.textContent = entry.translation || '-';
  backPartOfSpeech.textContent = entry.partOfSpeech || '-';
  backExample.textContent = entry.example || '-';
  backRoot.textContent = entry.rootAnalysis || '-';
}

function changeView(showFlashcards) {
  flashcardView.classList.toggle('active', showFlashcards);
  manageView.classList.toggle('active', !showFlashcards);
  viewFlashcards.classList.toggle('active', showFlashcards);
  viewManage.classList.toggle('active', !showFlashcards);
}

function setLoadingState(enabled) {
  autoFillButton.textContent = enabled ? '讀取中...' : '自動填入';
  autoFillButton.disabled = enabled;
}

async function autoFillWord() {
  const word = wordInput.value.trim();
  if (!word) return;

  setLoadingState(true);

  try {
    const [dictEntry, translation] = await Promise.all([
      fetchDictionaryEntry(word),
      fetchTranslation(word),
    ]);

    if (dictEntry) {
      partOfSpeechInput.value = dictEntry.partOfSpeech || '';
      exampleInput.value = dictEntry.example || '';
      rootInput.value = dictEntry.root || '';
      if (!translationInput.value) {
        translationInput.value = translation || dictEntry.translation || '';
      }
    } else if (translation) {
      translationInput.value = translation;
    }
  } catch (error) {
    console.error(error);
    alert('自動填入失敗，請稍後再試。');
  } finally {
    setLoadingState(false);
  }
}

async function fetchDictionaryEntry(word) {
  const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`);
  if (!response.ok) {
    return null;
  }

  const data = await response.json();
  const firstEntry = Array.isArray(data) && data[0];
  if (!firstEntry) return null;

  const meaning = firstEntry.meanings && firstEntry.meanings[0];
  const definition = meaning?.definitions?.[0];

  return {
    partOfSpeech: meaning?.partOfSpeech || '',
    example: definition?.example || '',
    root: firstEntry.origin || '',
    translation: definition?.definition || '',
  };
}

async function fetchTranslation(word) {
  try {
    const response = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(word)}&langpair=en|zh-TW`);
    const data = await response.json();
    return data.responseData?.translatedText || '';
  } catch (e) {
    return '';
  }
}

function clearForm() {
  wordForm.reset();
}

function handleFormSubmit(event) {
  event.preventDefault();
  const word = wordInput.value.trim();
  if (!word) return;

  const words = getCurrentWords();
  const existingIndex = words.findIndex((item) => item.word.toLowerCase() === word.toLowerCase());
  const entry = {
    word,
    translation: translationInput.value.trim(),
    partOfSpeech: partOfSpeechInput.value.trim(),
    example: exampleInput.value.trim(),
    rootAnalysis: rootInput.value.trim(),
  };

  if (existingIndex >= 0) {
    words[existingIndex] = entry;
  } else {
    words.push(entry);
  }

  saveWords(words);
  renderWordList();
  refreshFlashcard();
  wordInput.focus();
}

function selectNextWord() {
  const words = getCurrentWords();
  if (words.length === 0) return;
  currentIndex = (currentIndex + 1) % words.length;
  refreshFlashcard();
}

function selectPreviousWord() {
  const words = getCurrentWords();
  if (words.length === 0) return;
  currentIndex = (currentIndex - 1 + words.length) % words.length;
  refreshFlashcard();
}

function shuffleWords() {
  const words = getCurrentWords();
  if (words.length === 0) return;
  currentIndex = Math.floor(Math.random() * words.length);
  refreshFlashcard();
}

flashcard.addEventListener('click', () => {
  isFlipped = !isFlipped;
  flashcard.classList.toggle('flipped', isFlipped);
});

viewFlashcards.addEventListener('click', () => changeView(true));
viewManage.addEventListener('click', () => changeView(false));
wordForm.addEventListener('submit', handleFormSubmit);
autoFillButton.addEventListener('click', autoFillWord);
clearFormButton.addEventListener('click', clearForm);
prevWordBtn.addEventListener('click', selectPreviousWord);
nextWordBtn.addEventListener('click', selectNextWord);
shuffleWordsBtn.addEventListener('click', shuffleWords);

renderWordList();
refreshFlashcard();
