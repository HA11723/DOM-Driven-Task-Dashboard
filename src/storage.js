const STORAGE_KEY = "dom_task_dashboard_tasks";
export function getTasks() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
}
export function saveTasks(tasks) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}
export function addTask(task) {
  const tasks = getTasks();
  tasks.push(task);
  saveTasks(tasks);
}
export function updateTask(updated) {
  const tasks = getTasks().map((t) => (t.id === updated.id ? updated : t));
  saveTasks(tasks);
}
export function deleteTask(id) {
  const tasks = getTasks().filter((t) => t.id !== id);
  saveTasks(tasks);
}
