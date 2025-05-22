import { debounce } from "./utils/debounce.js";
import { throttle } from "./utils/throttle.js";

const taskInput = document.getElementById("task-input");
const addBtn = document.getElementById("add-btn");
const taskList = document.getElementById("task-list");
const searchInput = document.getElementById("search-input");
const clearAllBtn = document.getElementById("clear-all");
const backToTopBtn = document.getElementById("back-to-top");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function renderTasks(filteredTasks = tasks) {
  taskList.innerHTML = "";
  filteredTasks.forEach((task, index) => {
    const li = document.createElement("li");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;
    checkbox.addEventListener("change", () => toggleComplete(index));

    const span = document.createElement("span");
    span.textContent = task.text;
    if (task.completed) span.classList.add("completed");

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.addEventListener("click", () => deleteTask(index));

    li.append(checkbox, span, deleteBtn);
    taskList.appendChild(li);
  });
}

function addTask() {
  const text = taskInput.value.trim();
  if (text) {
    tasks.push({ text, completed: false });
    taskInput.value = "";
    saveTasks();
    renderTasks();
  }
}

function toggleComplete(index) {
  tasks[index].completed = !tasks[index].completed;
  saveTasks();
  renderTasks();
}

function deleteTask(index) {
  tasks.splice(index, 1);
  saveTasks();
  renderTasks();
}

function clearAllTasks() {
  if (confirm("Are you sure you want to clear all tasks?")) {
    tasks = [];
    saveTasks();
    renderTasks();
  }
}

function handleSearch(e) {
  const query = e.target.value.toLowerCase();
  const filtered = tasks.filter(task =>
    task.text.toLowerCase().includes(query)
  );
  renderTasks(filtered);
}

function handleScroll() {
  if (window.scrollY > 300) {
    backToTopBtn.style.display = "block";
  } else {
    backToTopBtn.style.display = "none";
  }
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

addBtn.addEventListener("click", addTask);
clearAllBtn.addEventListener("click", clearAllTasks);
backToTopBtn.addEventListener("click", scrollToTop);
searchInput.addEventListener("input", debounce(handleSearch, 300));
window.addEventListener("scroll", throttle(handleScroll, 200));

renderTasks();
