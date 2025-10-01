document.addEventListener('DOMContentLoaded', () => {
    loadTabGroups();
    loadBookmarks();
    loadHistory();
});

// Function to load and display active tab groups
function loadTabGroups() {
    const list = document.getElementById('tab-groups-list');
    if (!list) {
        console.error('Group list element not found');
        return;}
    chrome.tabGroups.query({}, (groups) => {
        if (groups.length === 0) {
            list.innerHTML = '<li>No active groups found.</li>';
            return;
        }
        groups.forEach(group => {
            const listItem = document.createElement('li');
            
            // Create a colored dot to represent the group's color
            const colorDot = document.createElement('span');
            colorDot.className = 'group-color-dot';
            colorDot.style.backgroundColor = group.color;

            // Create a link (though it's not clickable, it represents the group)
            const text = document.createElement('span');
            text.textContent = group.title || 'Untitled Group';

            listItem.appendChild(colorDot);
            listItem.appendChild(text);
            list.appendChild(listItem);
        });
    });
}


// Function to load and display recent bookmarks
function loadBookmarks() {
    const list = document.getElementById('bookmarks-list');
    if (!list) {
        console.error('Bookmarks list element not found');
        return;
    }
    // We get the 20 most recently added bookmarks
    chrome.bookmarks.getRecent(20, (bookmarks) => {
        if (bookmarks.length === 0) {
            list.innerHTML = '<li>No recent bookmarks.</li>';
            return;
        }
        bookmarks.forEach(bookmark => {
            if (bookmark.url) { // Only show items that are actual bookmarks, not folders
                const listItem = document.createElement('li');
                const link = document.createElement('a');
                link.href = bookmark.url;
                link.textContent = bookmark.title || bookmark.url;
                link.title = bookmark.url; // Show full URL on hover
                listItem.appendChild(link);
                list.appendChild(listItem);
            }
        });
    });
}

// Function to load and display recently visited sites
function loadHistory() {
    const list = document.getElementById('history-list');
    if (!list) {
        console.error('History list element not found');
        return;
    }
    // Search history for the 15 most recent entries
    chrome.history.search({ text: '', maxResults: 15 }, (historyItems) => {
         if (historyItems.length === 0) {
            list.innerHTML = '<li>No recent history.</li>';
            return;
        }
        historyItems.forEach(item => {
            const listItem = document.createElement('li');
            const link = document.createElement('a');
            link.href = item.url;
            link.textContent = item.title || item.url;
            link.title = item.url;
            listItem.appendChild(link);
            list.appendChild(listItem);
        });
    });
}