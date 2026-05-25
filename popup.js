const todoInput = document.getElementById("todoInput");
const addTodo = document.getElementById("addTodo");
const todoList = document.getElementById("todoList");

const noteInput = document.getElementById("noteInput");
const saveNote = document.getElementById("saveNote");
const noteList = document.getElementById("noteList");

const saveTab = document.getElementById("saveTab");
const tabList = document.getElementById("tabList");

// Load data
function loadData() {
  chrome.storage.local.get(["todos", "notes", "savedTabs"], (data) => {
    renderList(todoList, data.todos || [], "todos");
    renderList(noteList, data.notes || [], "notes");
    renderTabs(data.savedTabs || []);
  });
}

function renderList(container, items, key) {
  container.innerHTML = "";
  items.forEach((item, index) => {
    const li = document.createElement("li");
    li.textContent = item;

    const del = document.createElement("button");
    del.textContent = "X";
    del.onclick = () => {
      items.splice(index, 1);
      chrome.storage.local.set({ [key]: items }, loadData);
    };

    li.appendChild(del);
    container.appendChild(li);
  });
}

function renderTabs(tabs) {
  tabList.innerHTML = "";
  tabs.forEach((tab, index) => {
    const li = document.createElement("li");
    li.innerHTML = `<a href="${tab.url}" target="_blank">${tab.title}</a>`;

    const del = document.createElement("button");
    del.textContent = "X";
    del.onclick = () => {
      tabs.splice(index, 1);
      chrome.storage.local.set({ savedTabs: tabs }, loadData);
    };

    li.appendChild(del);
    tabList.appendChild(li);
  });
}

// Todo
addTodo.onclick = () => {
  const value = todoInput.value.trim();
  if (!value) return;

  chrome.storage.local.get("todos", (data) => {
    const todos = data.todos || [];
    todos.push(value);
    chrome.storage.local.set({ todos }, () => {
      todoInput.value = "";
      loadData();
    });
  });
};

// Notes
saveNote.onclick = () => {
  const value = noteInput.value.trim();
  if (!value) return;

  chrome.storage.local.get("notes", (data) => {
    const notes = data.notes || [];
    notes.push(value);
    chrome.storage.local.set({ notes }, () => {
      noteInput.value = "";
      loadData();
    });
  });
};

// Save tab
saveTab.onclick = () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const tab = tabs[0];

    chrome.storage.local.get("savedTabs", (data) => {
      const savedTabs = data.savedTabs || [];
      savedTabs.push({ title: tab.title, url: tab.url });

      chrome.storage.local.set({ savedTabs }, loadData);
    });
  });
};

loadData();
