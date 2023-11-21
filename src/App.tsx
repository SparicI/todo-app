import { createSignal, createEffect, Show, For, batch } from 'solid-js'
import { createStore } from "solid-js/store";

// components
import TodoItem from './components/TodoItem';
import TodoFilterButton from './components/TodoFilterButton'

// images
import iconSun from './assets/images/icon-sun.svg'
import iconMoon from './assets/images/icon-moon.svg'

// css
import './assets/css/App.css'
import './assets/css/variables.css'
import './assets/css/fonts.css'
import './assets/css/reset.css'
import './assets/css/utilities.css'

type TodoItem = { title: string; index: number; done: boolean };
type TodoStore = {
  todos: TodoItem[],
  showTasks: string
}


const initializeTheme = () => {
  let lightTheme;
  if (typeof localStorage !== "undefined" && localStorage.getItem("lightTheme")) {
    lightTheme = localStorage.getItem("theme");
  } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
    lightTheme = "false";
  } else {
    lightTheme = "true";
  }
  return Boolean(lightTheme);
};

const initializeState = (): TodoItem[] => {
  let todos;
  if (typeof localStorage !== "undefined" && localStorage.getItem("todos")) {
    todos = JSON.parse(localStorage.getItem("todos") || '[]');
  } else {
    todos = [];
  }
  return todos
};


function App() {

  const [state, setState] = createStore<TodoStore>({
    todos: initializeState(),
    showTasks: "all",
  })

  const [lightTheme, setLightTheme] = createSignal(initializeTheme());
  const [newTitle, setNewTitle] = createSignal('')

  let showTasks = (type: string) => {
    setState("showTasks", type)
  }

  // Filter todo list - all, active, completed
  const filterList = (todos: TodoItem[]) => {
    if (state.showTasks === "active") return todos.filter((todo) => !todo.done);
    else if (state.showTasks === "completed") return todos.filter((todo) => todo.done);
    else return todos;
  }

  // Number of uncompleted tasks
  const numberOfUncompletedTasks = () => {
    const uncompletedTasks = state.todos.filter(item => item.done === false)
    return uncompletedTasks.length
  }

  // THEME toggle

  const changeToDarkTheme = () => setLightTheme(false)
  const changeToLightTheme = () => setLightTheme(true)

  createEffect(() => {
    if (lightTheme() === false) {
      document.documentElement.classList.add('dark');
      localStorage.setItem("lightTheme", 'false');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem("lightTheme", 'true');
    }
  });

  //Add todo
  const addTodo = (e: Event) => {
    e.preventDefault()
    // batch helper allows to queue up multiple changes and then apply them all
    // at the same time before notifying their observers.
    batch(() => {
      setState("todos", [...state.todos, { title: newTitle(), index: Math.floor(Date.now() + Math.random() * 100), done: false }])
      setNewTitle('')
    })
    localStorage.setItem("todos", JSON.stringify(state.todos))
  }

  //Remove todo
  const removeTodo = (index: number) => {
    setState("todos", state.todos.filter(item => item.index !== index))
    localStorage.setItem("todos", JSON.stringify(state.todos))
  }

  //Toggle todo checked
  const toggleTodo = (index: number) => {
    setState("todos",
      state.todos.map((todo) => {
        return todo.index !== index ? todo : { ...todo, done: !todo.done };
      })
    )
    localStorage.setItem("todos", JSON.stringify(state.todos))
  }

  // Clear completed
  const clearCompleted = () => {
    setState("todos", state.todos.filter(item => item.done === false))
    localStorage.setItem("todos", JSON.stringify(state.todos))
  }

  // TODO: add tasks to local storage

  return (
    <>
      <div class="hero-image"></div>
      <div class="container">
        <header class="header margin-block-end-800">
          <h1>TODO</h1>
          <Show
            when={lightTheme()}
            fallback={
              <button aria-label='Change to light theme' onClick={changeToLightTheme}>
                <img src={iconSun} alt="Choose light theme" />
              </button>}
          >
            <button aria-label='Change to dark theme' onClick={changeToDarkTheme}>
              <img src={iconMoon} alt="Choose dark theme" />
            </button>
          </Show>
        </header>
        <form onSubmit={addTodo} class="form checkbox-wrapper" >
          <input
            type="checkbox"
            disabled
          />
          <input
            type="text"
            placeholder="Create a new todo..."
            required
            value={newTitle()}
            onInput={(e) => setNewTitle(e.currentTarget.value)}
          />
        </form>
        <div class="todo">
          <ul class="todo__list">
            <For each={filterList(state.todos)}>{(todo) =>
              <TodoItem todo={todo} onRemove={removeTodo} onToggle={toggleTodo} />
            }
            </For>
          </ul>
          <footer class="footer">
            <p class="footer__uncompleted">{numberOfUncompletedTasks()} item left</p>
            <div class="footer__controls">
              <TodoFilterButton title="All" type="all" onShow={showTasks} checked={true} />
              <TodoFilterButton title="Active" type="active" onShow={showTasks} />
              <TodoFilterButton title="Completed" type="completed" onShow={showTasks} />
            </div>

            <button class="footer__clear" onClick={clearCompleted}>
              Clear Completed
            </button>

          </footer>
        </div>
      </div>

    </>
  )
}


export default App
