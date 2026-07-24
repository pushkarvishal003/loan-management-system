// Random Joke Generator
const jokeDisplay = document.getElementById('jokeDisplay');
const getJokeBtn = document.getElementById('getJokeBtn');
const copyBtn = document.getElementById('copyBtn');
const shareBtn = document.getElementById('shareBtn');
const categorySelect = document.getElementById('categorySelect');
const historyList = document.getElementById('historyList');
const jokeCount = document.getElementById('jokeCount');
const jokeInfo = document.getElementById('jokeInfo');

let currentJoke = null;
let jokeCounter = 0;
let jokesHistory = JSON.parse(localStorage.getItem('jokesHistory')) || [];

// Joke API endpoints
const jokeAPIs = {
    any: 'https://official-joke-api.appspot.com/random_joke',
    general: 'https://official-joke-api.appspot.com/jokes/general/random',
    programming: 'https://official-joke-api.appspot.com/jokes/programming/random',
    'knock-knock': 'https://official-joke-api.appspot.com/jokes/knock-knock/random'
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadJokeCount();
    displayHistory();
    getJokeBtn.addEventListener('click', fetchJoke);
    copyBtn.addEventListener('click', copyJoke);
    shareBtn.addEventListener('click', shareJoke);
    categorySelect.addEventListener('change', () => {
        if (currentJoke) {
            jokeDisplay.classList.remove('loaded');
            jokeDisplay.innerHTML = '<p class="loading">Loading new category...</p>';
        }
    });
});

// Fetch Joke from API
async function fetchJoke() {
    const category = categorySelect.value;
    const apiUrl = jokeAPIs[category];

    getJokeBtn.disabled = true;
    getJokeBtn.textContent = 'Loading...';
    jokeDisplay.classList.remove('loaded');
    jokeDisplay.innerHTML = '<p class="loading">Fetching a joke for you... 🤔</p>';
    jokeInfo.innerHTML = '';
    copyBtn.style.display = 'none';
    shareBtn.style.display = 'none';

    try {
        const response = await fetch(apiUrl);
        
        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }

        const data = await response.json();
        
        // Format the joke
        let jokeText = '';
        let type = '';
        
        if (data.setup) {
            jokeText = `${data.setup}\n\n${data.punchline}`;
            type = 'Two-part';
        } else if (data.joke) {
            jokeText = data.joke;
            type = 'Single';
        }

        currentJoke = {
            text: jokeText,
            category: data.category || category,
            type: type,
            timestamp: new Date().toLocaleTimeString()
        };

        // Display the joke
        displayJoke();
        
        // Add to history
        addToHistory(currentJoke);
        
        // Show copy and share buttons
        copyBtn.style.display = 'inline-block';
        shareBtn.style.display = 'inline-block';
        
        // Increment counter
        jokeCounter++;
        jokeCount.textContent = jokeCounter;
        localStorage.setItem('jokeCounter', jokeCounter);

    } catch (error) {
        console.error('Error fetching joke:', error);
        jokeDisplay.classList.remove('loaded');
        jokeDisplay.innerHTML = '<p style="color: #f56565; font-size: 1.1em;">❌ Failed to load joke. Please try again!</p>';
        showToast('Failed to load joke. Check your internet connection.', 'error');
    } finally {
        getJokeBtn.disabled = false;
        getJokeBtn.textContent = 'Get Joke';
    }
}

// Display Joke
function displayJoke() {
    if (!currentJoke) return;

    jokeDisplay.classList.add('loaded');
    jokeDisplay.innerHTML = `<p>${currentJoke.text.replace(/\n\n/g, '<br><br>')}</p>`;
    
    jokeInfo.innerHTML = `
        <span>📁 Category: <strong>${currentJoke.category}</strong></span>
        <span>🏷️ Type: <strong>${currentJoke.type}</strong></span>
        <span>⏰ ${currentJoke.timestamp}</span>
    `;
}

// Copy Joke to Clipboard
function copyJoke() {
    if (!currentJoke) return;

    const textToCopy = currentJoke.text.replace(/\n\n/g, ' ');
    
    navigator.clipboard.writeText(textToCopy).then(() => {
        showToast('✅ Joke copied to clipboard!');
        copyBtn.textContent = '✓ Copied';
        setTimeout(() => {
            copyBtn.textContent = 'Copy Joke';
        }, 2000);
    }).catch(() => {
        showToast('Failed to copy joke', 'error');
    });
}

// Share Joke
function shareJoke() {
    if (!currentJoke) return;

    const textToShare = `Check out this joke: ${currentJoke.text.replace(/\n\n/g, ' ')}`;
    
    if (navigator.share) {
        navigator.share({
            title: '😂 Random Joke',
            text: textToShare
        }).catch(err => console.log('Error sharing:', err));
    } else {
        // Fallback: Copy to clipboard
        navigator.clipboard.writeText(textToShare);
        showToast('✅ Joke ready to share (copied to clipboard)');
    }
}

// Add to History
function addToHistory(joke) {
    jokesHistory.unshift(joke);
    
    // Keep only last 10 jokes
    if (jokesHistory.length > 10) {
        jokesHistory.pop();
    }
    
    localStorage.setItem('jokesHistory', JSON.stringify(jokesHistory));
    displayHistory();
}

// Display History
function displayHistory() {
    if (jokesHistory.length === 0) {
        historyList.innerHTML = '<p class="no-history">No jokes yet. Start by getting your first joke!</p>';
        return;
    }

    historyList.innerHTML = '';
    
    jokesHistory.forEach((joke, index) => {
        const historyItem = document.createElement('div');
        historyItem.className = 'history-item';
        historyItem.innerHTML = `
            <div><strong>#${index + 1}</strong></div>
            <div>${joke.text.substring(0, 80)}...</div>
            <div style="font-size: 0.8em; color: #a0aec0; margin-top: 5px;">${joke.timestamp}</div>
        `;
        historyItem.onclick = () => {
            currentJoke = joke;
            displayJoke();
            copyBtn.style.display = 'inline-block';
            shareBtn.style.display = 'inline-block';
        };
        historyList.appendChild(historyItem);
    });

    // Add clear history button
    const clearBtn = document.createElement('button');
    clearBtn.className = 'clear-history-btn';
    clearBtn.textContent = '🗑️ Clear History';
    clearBtn.onclick = () => {
        if (confirm('Are you sure you want to clear all history?')) {
            jokesHistory = [];
            localStorage.setItem('jokesHistory', JSON.stringify(jokesHistory));
            displayHistory();
            showToast('✅ History cleared');
        }
    };
    historyList.appendChild(clearBtn);
}

// Load Joke Count
function loadJokeCount() {
    jokeCounter = parseInt(localStorage.getItem('jokeCounter')) || 0;
    jokeCount.textContent = jokeCounter;
}

// Show Toast Notification
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// Keyboard shortcut: Press Space to get a new joke
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space' && document.activeElement !== categorySelect) {
        e.preventDefault();
        fetchJoke();
    }
});
