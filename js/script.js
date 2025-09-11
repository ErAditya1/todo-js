let todoes = [];

function insertTodo(todo) {
  const todoList = document.getElementById("todo_list");

  const li = document.createElement("li");
  li.classList.add("flex", "gap-2", "group", "rounded-xl", "border-b", "py-4", "px-2");
  li.id = todo.id;

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = todo.isCompleted;
  checkbox.classList.add(
    "w-6",
    "bg-green-500",

    "cursor-pointer"
  );

  // Input (readonly text field)
  const input = document.createElement("input");
  input.type = "text";
  input.value = todo.title;
  input.disabled = true;
  input.classList.add(
    "w-full",
    "shadow-lg",
    "rounded",
    "p-0",
    "text-xl",
    "line-clamp-1",
    "font-serif",
    "input"
  );

  // Action buttons container
  const actions = document.createElement("div");
  actions.classList.add("flex", "gap-2");

  // Edit button
  const editBtn = document.createElement("button");
  editBtn.innerHTML = `<i class="fa-solid fa-pen-to-square text-blue-500"></i>`;
  editBtn.classList.add(
    "bg-gray-700",
    "px-2",
    "rounded-lg",
    "cursor-pointer",
    "text-sm",
    "py-0",
    "hover:bg-blue-100"
  );
  const saveBtn = document.createElement("button");
  saveBtn.innerHTML = `<i class="fa-solid fa-check text-green-900 font-bold"></i>`;
  saveBtn.classList.add(
    "bg-green-100",
    "px-2",
    "rounded-lg",
    "cursor-pointer",
    "text-sm",
    "hidden",
    "py-0",
    "hover:bg-green-400"
  );

  // Delete button
  const deleteBtn = document.createElement("button");
  deleteBtn.innerHTML = `<i class="fa-solid fa-trash text-red-400"></i>`;
  deleteBtn.classList.add(
    "bg-red-100",
    "px-2",
    "rounded-lg",
    "cursor-pointer",
    "text-sm",
    "py-0",
    "group-hover:block",
    "hover:bg-red-200"
  );

  // Append buttons
  actions.appendChild(editBtn);
  actions.appendChild(saveBtn);
  actions.appendChild(deleteBtn);

  li.appendChild(checkbox);
  li.appendChild(input);
  li.appendChild(actions);


  

  todoList.prepend(li);

  checkbox.addEventListener("change", (e) => {
    const checked = e.target.checked;

    if (checked) {
      li.querySelector(".input").classList.add("line-through");
      li.querySelector(".input").classList.add("text-gray-400");
      li.classList.add("border-green-500");

      todoes = todoes.filter((t) => {
        if (t.id == li.id) {
          t.isCompleted = true;
          return t;
        } else {
          return t;
        }
      });
      localStorage.setItem("todoes", JSON.stringify(todoes));
    } else {
      todoes = todoes.filter((t) => {
        if (t.id == li.id) {
          t.isCompleted = false;
          return t;
        } else {
          return t;
        }
      });
      localStorage.setItem("todoes", JSON.stringify(todoes));
      li.querySelector(".input").classList.remove("line-through");
      li.querySelector(".input").classList.remove("text-gray-400");
      li.classList.remove("border-green-500");
    }
  });

  input.addEventListener("keypress", function (event) {
    // If the user presses the "Enter" key on the keyboard
    if (event.key === "Enter") {
      saveTodo();
    }
  });

  saveBtn.addEventListener("click", () => {
    saveTodo();
  });

  function saveTodo() {
    input.disabled = true;
    saveBtn.classList.add("hidden");
    editBtn.classList.remove("hidden");

    const id = li.id;
    const title = li.querySelector(".input").value;

    todoes = todoes.filter((t) => {
      if (t.id == id) {
        t.title = title;
        return t;
      } else {
        return t;
      }
    });
    localStorage.setItem("todoes", JSON.stringify(todoes));
  }

  editBtn.addEventListener("click", () => {
    input.disabled = false;
    saveBtn.classList.remove("hidden");
    editBtn.classList.add("hidden");
  });

  deleteBtn.addEventListener("click", () => {
    const id = li.id;
    const res = window.confirm("Are you sure you want to delete");
    if (!res) return;
    todoes = todoes.filter((t) => t.id != id);
    localStorage.setItem("todoes", JSON.stringify(todoes));

    li.remove();
  });

  if (todo.isCompleted) {
    li.querySelector(".input").classList.add("line-through");
    li.querySelector(".input").classList.add("text-gray-400");
    li.classList.add("border-green-500");
  } else {
    li.querySelector(".input").classList.remove("line-through");
    li.querySelector(".input").classList.remove("text-gray-400");
    li.classList.remove("border-green-500");
  }
}
function removeError() {
  document.getElementById("error").innerHTML = "";
}

function loadTodoes() {
  const saved = localStorage.getItem("todoes");
  todoes = saved ? JSON.parse(saved) : [];
  if (!todoes.length) return;
  todoes.forEach((t) => {
    insertTodo(t);
  });
}

const input = document.getElementById("input");

input.addEventListener("keypress", function (event) {
  // If the user presses the "Enter" key on the keyboard
  if (event.key === "Enter") {
    addTodo();
  }
});
function addTodo() {
  const title = input.value.trim();
  if (title.length < 3) {
    const error = document.getElementById("error");
    error.innerHTML = "Title should be greater than 2 character";
    error.style.color = "red";
    return;
  }

  const id = Math.floor(Math.random() * 9999999999);
  const todo = {
    id: id,
    title: title,
    isCompleted: false,
  };

  todoes.push(todo);

  localStorage.setItem("todoes", JSON.stringify(todoes));
  insertTodo(todo);
  const error = document.getElementById("error");
  error.innerHTML = "Todo Added successfully";
  error.style.color = "green";
  document.getElementById("input").value = "";

  setTimeout(() => {
    error.innerHTML = "";
  }, 2000);
}
