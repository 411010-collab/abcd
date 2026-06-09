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

const DEFAULT_WORDS = [
  {
    word: 'abandon',
    translation: '放棄',
    partOfSpeech: 'verb',
    example: 'She had to abandon her car when it broke down.',
    rootAnalysis: 'ab- (離開) + bandon (控制) = 放棄',
  },
  {
    word: 'beneficial',
    translation: '有益的',
    partOfSpeech: 'adjective',
    example: 'Regular exercise is beneficial to your health.',
    rootAnalysis: 'bene- (好) + fic (做) + -ial = 有益的',
  },
  {
    word: 'curious',
    translation: '好奇的',
    partOfSpeech: 'adjective',
    example: 'The child was curious about the strange sound.',
    rootAnalysis: 'curi- (關心) + -ous = 好奇的',
  },
  {
    word: 'dedicate',
    translation: '奉獻；致力於',
    partOfSpeech: 'verb',
    example: 'He decided to dedicate more time to studying.',
    rootAnalysis: 'de- (向下) + dicare (宣告) = 奉獻',
  },
  {
    word: 'evidence',
    translation: '證據',
    partOfSpeech: 'noun',
    example: 'The detective found strong evidence at the scene.',
    rootAnalysis: 'e- (出) + vid (看) + -ence = 證據',
  },
  {
    word: 'fortunate',
    translation: '幸運的',
    partOfSpeech: 'adjective',
    example: 'She felt fortunate to have such caring friends.',
    rootAnalysis: 'fort- (力量、運氣) + -unate = 幸運的',
  },
  {
    word: 'generous',
    translation: '大方的',
    partOfSpeech: 'adjective',
    example: 'He is generous with his time and support.',
    rootAnalysis: 'gener- (出生、產生) + -ous = 慷慨的',
  },
  {
    word: 'honest',
    translation: '誠實的',
    partOfSpeech: 'adjective',
    example: 'An honest answer is always the best answer.',
    rootAnalysis: 'honest- (誠實) = 誠實的',
  },
  {
    word: 'improve',
    translation: '改善',
    partOfSpeech: 'verb',
    example: 'Practice every day to improve your skills.',
    rootAnalysis: 'im- (使) + prove (證明、改進) = 改善',
  },
  {
    word: 'journey',
    translation: '旅程',
    partOfSpeech: 'noun',
    example: 'Their journey across the mountains took three days.',
    rootAnalysis: 'journ- (日) + -ey = 旅程',
  },
];

function loadWords() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    saveWords(DEFAULT_WORDS);
    return DEFAULT_WORDS;
  }

  try {
    return JSON.parse(raw);
  } catch (error) {
    console.warn('儲存資料無效，已重置 localStorage。', error);
    localStorage.removeItem(STORAGE_KEY);
    saveWords(DEFAULT_WORDS);
    return DEFAULT_WORDS;
  }
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
    wordList.innerHTML = '<li class="bg-dark-card border border-dark-text-secondary/20 rounded-3xl p-4.5 shadow-dark-md"><p class="text-dark-text-secondary">目前尚未新增任何單字。</p></li>';
    return;
  }

  wordList.innerHTML = words
    .map((entry, index) => {
      return `
        <li class="bg-dark-card border border-dark-text-secondary/20 rounded-3xl p-4.5 shadow-dark-md hover:shadow-dark-lg transition-shadow duration-200">
          <h3 class="m-0 mb-2.5 text-dark-text-primary font-bold text-lg">${escapeHtml(entry.word)}</h3>
          <p class="my-1.5 text-dark-text-secondary"><strong class="text-accent-cyan">翻譯：</strong>${escapeHtml(entry.translation)}</p>
          <p class="my-1.5 text-dark-text-secondary"><strong class="text-accent-cyan">詞性：</strong>${escapeHtml(entry.partOfSpeech)}</p>
          <p class="my-1.5 text-dark-text-secondary"><strong class="text-accent-cyan">例句：</strong>${escapeHtml(entry.example)}</p>
          <p class="my-1.5 text-dark-text-secondary"><strong class="text-accent-cyan">字根分析：</strong>${escapeHtml(entry.rootAnalysis)}</p>
          <div class="flex gap-2.5 flex-wrap mt-3">
            <button type="button" data-index="${index}" class="delete-word px-3 py-2 bg-accent-pink text-dark-bg rounded-xl font-semibold text-sm shadow-glow-blue transition-all duration-150 hover:-translate-y-0.5 active:scale-95">刪除</button>
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
  flashcardView.classList.toggle('hidden', !showFlashcards);
  flashcardView.classList.toggle('block', showFlashcards);
  manageView.classList.toggle('hidden', showFlashcards);
  manageView.classList.toggle('block', !showFlashcards);
  
  // 更新導航按鈕的視覺狀態
  if (showFlashcards) {
    viewFlashcards.classList.add('border-accent-blue/30', 'text-accent-blue');
    viewFlashcards.classList.remove('border-dark-text-secondary/20', 'text-dark-text-secondary');
    viewManage.classList.remove('border-accent-blue/30', 'text-accent-blue');
    viewManage.classList.add('border-dark-text-secondary/20', 'text-dark-text-secondary');
  } else {
    viewManage.classList.add('border-accent-blue/30', 'text-accent-blue');
    viewManage.classList.remove('border-dark-text-secondary/20', 'text-dark-text-secondary');
    viewFlashcards.classList.remove('border-accent-blue/30', 'text-accent-blue');
    viewFlashcards.classList.add('border-dark-text-secondary/20', 'text-dark-text-secondary');
  }
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
  const cardFront = document.getElementById('cardFront');
  const cardBack = document.getElementById('cardBack');
  
  if (isFlipped) {
    cardFront.style.transform = 'rotateY(-180deg)';
    cardBack.style.transform = 'rotateY(0deg)';
  } else {
    cardFront.style.transform = 'rotateY(0deg)';
    cardBack.style.transform = 'rotateY(180deg)';
  }
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
