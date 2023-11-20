import { createSignal, createEffect, Show, For, batch } from 'solid-js'
import iconSun from './assets/images/icon-sun.svg'
import iconMoon from './assets/images/icon-moon.svg'
import iconCross from './assets/images/icon-cross.svg'
import './assets/css/App.css'
import './assets/css/variables.css'
import './assets/css/fonts.css'
import './assets/css/reset.css'
import './assets/css/utilities.css'

function App() {

  type TodoItem = { title: string; index: number; done: boolean };

  // signals
  const [lightTheme, setLightTheme] = createSignal(true);
  const [newTitle, setNewTitle] = createSignal('')
  const [todos, setTodos] = createSignal<TodoItem[]>([])

  // derived signals
  const numberOfUncompletedTasks = () => {
    const uncompletedTasks = todos().filter(item => item.done === false)
    return uncompletedTasks.length
  }

  // Toggle theme
  const changeToDarkTheme = () => setLightTheme(false)
  const changeToLightTheme = () => setLightTheme(true)

  createEffect(() => {
    if (lightTheme() === false) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  });

  //Add todo
  const addTodo = (e: Event) => {
    e.preventDefault()
    // batch helper allows to queue up multiple changes and then apply them all
    // at the same time before notifying their observers.
    batch(() => {
      setTodos([...todos(), { title: newTitle(), index: Math.floor(Date.now() + Math.random() * 100), done: false }])
      setNewTitle('')
    })
  }

  //Remove todo
  const removeTodo = (index: number) => {
    const filteredTodos = todos().filter(item => item.index !== index)
    setTodos(filteredTodos)
  }

  //Check todo

  const checkTodo = (event: Event, index: number) => {
    const target = event.currentTarget as HTMLInputElement;
    if (target) {
      const checkedTodos = todos().map(item => {
        if (item.index === index) {
          item.done = target.checked
        }
        return item
      })
      setTodos(checkedTodos)
    }

  }

  // TODO: add theme preferences and tasks to local storage


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
        <form onSubmit={addTodo} class="todo__form checkbox-wrapper" >
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
            <For each={todos()}>{(todo) =>
              <li class="todo__item">
                <div class="checkbox-wrapper">
                  <input
                    type="checkbox"
                    id={todo.title}
                    onChange={(e) => checkTodo(e, todo.index)}
                  />
                  <label for={todo.title}>
                    {todo.title}
                  </label>
                </div>
                <button aria-label={`Delete item ${todo.title}`} onClick={() => removeTodo(todo.index)} >
                  <img src={iconCross} alt="" />
                </button>
              </li>
            }
            </For>
          </ul>
          <footer class="footer">
            <p>{numberOfUncompletedTasks()} item left</p>
            <div class="footer__controls">
              <button>All</button>
              <button>Active</button>
              <button>Completed</button>
            </div>
            <div>
              <button>
                Clear Completed
              </button>
            </div>
          </footer>
        </div>
      </div>

    </>
  )
}

export default App
