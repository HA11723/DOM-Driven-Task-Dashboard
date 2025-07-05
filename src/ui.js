import { qs } from "./dom.js";
const template = qs("#task-template");
export function renderTasks(tasks) {
  const list = qs("#task-list");
  list.innerHTML = "";
  tasks.forEach((task) => {
    const clone = template.content.cloneNode(true);
    const card = clone.querySelector(".task-card");
    card.dataset.id = task.id;
    const checkbox = clone.querySelector(".task-complete");
    const content = clone.querySelector(".task-content");
    const timeElem = clone.querySelector(".task-date");
    checkbox.checked = task.completed;
    if (task.completed) card.classList.add("completed");
    content.textContent = task.content;
    timeElem.textContent = task.date;
    list.appendChild(clone);
  });
}
