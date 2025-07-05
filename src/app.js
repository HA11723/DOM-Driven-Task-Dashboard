import { qs, delegate } from "./dom.js";
import * as storage from "./storage.js";
import { renderTasks } from "./ui.js";
import { initTheme } from "./theme.js";

function loadAndRender() {
  let tasks = storage.getTasks();
  const filter = qs("#filter-status").value;
  if (filter === "active") tasks = tasks.filter((t) => !t.completed);
  if (filter === "completed") tasks = tasks.filter((t) => t.completed);
  const sort = qs("#sort-order").value;
  tasks.sort((a, b) => {
    const diff = new Date(a.date) - new Date(b.date);
    return sort === "date-asc" ? diff : -diff;
  });
  renderTasks(tasks);
}

document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  loadAndRender();

  qs("#new-task-btn").addEventListener("click", () => {
    const content = prompt("Task description:");
    if (!content) return;
    const date = prompt(
      "Due date (YYYY-MM-DD):",
      new Date().toISOString().split("T")[0]
    );
    if (!date) return;
    const task = { id: Date.now().toString(), content, date, completed: false };
    storage.addTask(task);
    loadAndRender();
  });

  delegate("#task-list", ".delete-btn", "click", (e) => {
    const id = e.target.closest(".task-card").dataset.id;
    storage.deleteTask(id);
    loadAndRender();
  });

  delegate("#task-list", ".task-complete", "change", (e) => {
    const card = e.target.closest(".task-card");
    const id = card.dataset.id;
    const tasks = storage.getTasks();
    const task = tasks.find((t) => t.id === id);
    task.completed = e.target.checked;
    storage.updateTask(task);
    loadAndRender();
  });

  delegate("#task-list", ".task-content", "blur", (e) => {
    const card = e.target.closest(".task-card");
    const id = card.dataset.id;
    const tasks = storage.getTasks();
    const task = tasks.find((t) => t.id === id);
    task.content = e.target.textContent.trim();
    storage.updateTask(task);
  });

  qs("#filter-status").addEventListener("change", loadAndRender);
  qs("#sort-order").addEventListener("change", loadAndRender);

  // Drag-and-drop reordering
  let draggedId = null;
  delegate("#task-list", ".task-card", "dragstart", (e) => {
    draggedId = e.target.dataset.id;
  });
  qs("#task-list").addEventListener("dragover", (e) => e.preventDefault());
  qs("#task-list").addEventListener("drop", (e) => {
    e.preventDefault();
    const target = e.target.closest(".task-card");
    if (!target || target.dataset.id === draggedId) return;
    let tasks = storage.getTasks();
    const from = tasks.findIndex((t) => t.id === draggedId);
    const to = tasks.findIndex((t) => t.id === target.dataset.id);
    tasks.splice(to, 0, tasks.splice(from, 1)[0]);
    storage.saveTasks(tasks);
    loadAndRender();
  });

  // Theme toggle
  qs("#theme-toggle").addEventListener("click", () => {
    const current = document.documentElement.getAttribute("data-theme");
    const next = current === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
  });
});
