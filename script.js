// UPDATED function to get 10 recent, unique sites
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
        return;
    }
        chrome.tabGroups.query({}, (groups) => {

        if (chrome.runtime.lastError) {
            console.error('Error querying tab groups:', chrome.runtime.lastError);
            list.innerHTML = '<li>Error loading tab groups.</li>';
            return;
        }
        
        if (!groups || groups.length === 0) {
            list.innerHTML = '<li>No tab groups found.</li>';
            return;
        }
        
        list.innerHTML = ''; // Clear the list before adding items
        
        groups.forEach(group => {
            const listItem = document.createElement('li');
            
            // Create a colored dot to represent the group's color
            const colorDot = document.createElement('span');
            colorDot.className = 'group-color-dot';
            colorDot.style.backgroundColor = group.color;

            // Create a link (though it's not clickable, it represents the group)
            const text = document.createElement('span');
            text.textContent = group.title || 'Untitled Group';
            
            // Add a badge to show if the group is collapsed
            if (group.collapsed) {
                const collapsedBadge = document.createElement('span');
                collapsedBadge.className = 'collapsed-badge';
                collapsedBadge.textContent = ' (collapsed)';
                collapsedBadge.style.fontSize = '0.85em';
                collapsedBadge.style.opacity = '0.7';
                text.appendChild(collapsedBadge);
            }

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

function loadHistory() {
    const list = document.getElementById('history-list');
    if (!list) return;
    list.innerHTML = ''; // Clear old items

    chrome.history.search({ text: '', maxResults: 100 }, (historyItems) => {
        if (historyItems.length === 0) {
            list.innerHTML = '<li>No recent history.</li>';
            return;
        }

        const filteredHistory = [];
        const seenHostnames = new Set();

        for (const item of historyItems) {
            if (item.url) {
                try {
                    const hostname = new URL(item.url).hostname;

                    if (!seenHostnames.has(hostname)) {
                        seenHostnames.add(hostname);
                        filteredHistory.push(item);
                    }
                } catch (e) {
                    console.warn("Could not parse URL from history:", item.url);
                }
            }
            if (filteredHistory.length >= 10) {
                break;
            }
        }
                filteredHistory.forEach(item => {
            const listItem = document.createElement('li');

            const icon = document.createElement('img');
            icon.src = `https://www.google.com/s2/favicons?domain=${item.url}&sz=32`;
            icon.style.width = '16px';
            icon.style.height = '16px';
            icon.style.marginRight = '1rem';

            const link = document.createElement('a');
            link.href = item.url;
            link.textContent = item.title || item.url;
            link.title = item.url;

            listItem.appendChild(icon);

            listItem.appendChild(link);
            list.appendChild(listItem);
        });
    });
}