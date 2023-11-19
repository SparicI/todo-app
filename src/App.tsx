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

  const [lightTheme, setLightTheme] = createSignal(true);
  const [newTitle, setNewTitle] = createSignal('')
  const [todos, setTodos] = createSignal<TodoItem[]>([])

  const changeToDarkTheme = () => setLightTheme(false)
  const changeToLightTheme = () => setLightTheme(true)
  const addTodo = (e: Event) => {
    e.preventDefault()
    // batch helper allows to queue up multiple changes and then apply them all
    // at the same time before notifying their observers.
    batch(() => {
      setTodos([...todos(), { title: newTitle(), index: Math.floor(Date.now() + Math.random() * 100), done: false }])
      setNewTitle('')
    })
  }

  const removeTodo = (index: number) => {
    const filteredTodos = todos().filter(item => item.index !== index)
    setTodos(filteredTodos)
  }

  // TODO: add theme preferences and tasks to local storage

  createEffect(() => {
    if (lightTheme() === false) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  });



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
          />
          <input
            type="text"
            placeholder="Create a new todo..."
            required
            value={newTitle()}
            onInput={(e) => setNewTitle(e.currentTarget.value)}
          />
        </form>
        <ul class="todo__list">
          <For each={todos()}>{(todo) =>
            <li class="todo__item">
              <div class="checkbox-wrapper">
                <input
                  type="checkbox"
                  id={todo.title}
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

      </div>
      {/* <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} class="logo" alt="Vite logo" />
        </a>
        <a href="https://solidjs.com" target="_blank">
          <img src={solidLogo} class="logo solid" alt="Solid logo" />
        </a>
      </div>
      <h1>Vite + Solid</h1>
      <div class="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count()}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p class="read-the-docs">
        Click on the Vite and Solid logos to learn more
      </p> */}
    </>
  )
}

export default App
