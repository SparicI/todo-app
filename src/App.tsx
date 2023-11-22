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
  showTasks: string,
  draggingItem: TodoItem | null
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
    draggingItem: null,
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

  // Drag and drop

  // The dragstart event is fired when the user starts dragging an element or text selection.
  const handleDragStart = (e: DragEvent, item: TodoItem) => {
    setState("draggingItem", item);
    // console.log(state.draggingItem)
    e?.dataTransfer?.setData('text/plain', '');
  };

  // The dragend event is fired when a drag operation is being ended
  // (by releasing a mouse button or hitting the escape key).
  const handleDragEnd = () => {
    setState("draggingItem", null);
    // console.log(state.draggingItem)
  };

  // The dragover event is fired when an element or text selection is
  // being dragged over a valid drop target (every few hundred milliseconds).
  const handleDragOver = (e: DragEvent) => {
    // prevent default to allow drop
    e.preventDefault();
  };

  // The drop event is fired when an element or text selection is dropped on a valid drop target
  const handleDrop = (e: DragEvent, targetItem: TodoItem) => {
    console.log(e)
    const draggingItem = state.draggingItem
    const items = [...state.todos]
    if (!draggingItem) return;

    const currentIndex = items.indexOf(draggingItem);
    const targetIndex = items.indexOf(targetItem);

    if (currentIndex !== -1 && targetIndex !== -1) {
      items.splice(currentIndex, 1);
      items.splice(targetIndex, 0, draggingItem);
      setState("todos", items)
    }
  };

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
          <ul class="todo__list"><Show
            when={filterList(state.todos).length > 0}
            fallback={<p class="todo__notasks">There are no tasks in {(state.showTasks).toUpperCase()} list.</p>}
          >
            <For each={filterList(state.todos)}>{(todo) =>
              <TodoItem todo={todo} onRemove={removeTodo} onToggle={toggleTodo} handleDragStart={handleDragStart} handleDragEnd={handleDragEnd} handleDragOver={handleDragOver} handleDrop={handleDrop} />
            }
            </For>

          </Show>


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
          <p class="todo__dnd">Drag and drop to reorder list</p>
        </div>
      </div>

    </>
  )
}


export default App
