document.addEventListener("DOMContentLoaded", () => {
    const noteInput = document.getElementById("noteInput");
    const saveBtn = document.getElementById("saveBtn");
    const pageTitle = document.getElementById("pageTitle");
    const pageURL = document.getElementById("pageURL");
    const showBtn = document.getElementById("showBtn");
    const allNotesContainer = document.getElementById("allNotesContainer");


    // Get current tab
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const tab = tabs[0];
        const url = tab.url;
        const title = tab.title;

        pageTitle.textContent = `Title: ${title}`;
        pageURL.textContent = `URL: ${url}`;

        // Load existing note for this URL
        chrome.storage.local.get([url], (result) => {
            if (result[url]) {
                noteInput.value = result[url];
            }
        });

        // Save button logic
        saveBtn.addEventListener("click", () => {
            const note = noteInput.value;
            chrome.storage.local.set({ [url]: note }, () => {
                alert("Note saved!");
            });
        });

        //show all saved url with notes
        showBtn.addEventListener("click", () => {
            chrome.storage.local.get(null, (result) => {
                allNotesContainer.innerHTML = ""; // Clear previous list

                const keys = Object.keys(result);
                if (keys.length === 0) {
                    allNotesContainer.innerHTML = "<p>No saved notes.</p>";
                    return;
                }

                keys.forEach((url) => {
                    const note = result[url];

                    const noteDiv = document.createElement("div");
                    noteDiv.style.border = "1px solid #ccc";
                    noteDiv.style.padding = "8px";
                    noteDiv.style.marginTop = "10px";
                    noteDiv.style.backgroundColor = "#1e1e1e";
                    noteDiv.style.borderRadius = "10px";

                    // const urlEl = document.createElement("h3");
                    // urlEl.textContent = url;
                    // urlEl.style.color = "aqua";

                    const deleteBtn = document.createElement("button");
                    deleteBtn.textContent = "Delete";
                    deleteBtn.style.backgroundColor = 'crimson';
                    deleteBtn.style.color = 'white';
                    deleteBtn.style.border = 'none';
                    deleteBtn.style.marginTop = '8px';
                    deleteBtn.style.padding = '5px 10px';
                    deleteBtn.style.borderRadius = '6px';
                    deleteBtn.style.cursor = 'pointer';

                    // Add delete logic
                    deleteBtn.addEventListener("click", () => {
                        chrome.storage.local.remove(url, () => {
                            // Optionally re-render notes or remove this note card
                            noteDiv.remove(); // This removes the visual note block
                        });
                    });



                    const urlEl = document.createElement("a");
                    urlEl.href = url;
                    urlEl.textContent = url;
                    urlEl.target = "_blank"; // opens in new tab
                    urlEl.style.color = "aqua"; // optional styling
                    urlEl.style.display = "block";
                    urlEl.style.marginBottom = "5px";

                    const noteEl = document.createElement("p");
                    noteEl.textContent = note;
                    noteEl.style.color = "white";

                    noteDiv.appendChild(urlEl);
                    noteDiv.appendChild(noteEl);
                    noteDiv.appendChild(deleteBtn);
                    allNotesContainer.appendChild(noteDiv);
                });
            });
        });

    });
});
