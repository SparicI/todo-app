
import iconCross from '../assets/images/icon-cross.svg'
import '../assets/css/App.css'
import '../assets/css/variables.css'
import '../assets/css/fonts.css'
import '../assets/css/reset.css'
import '../assets/css/utilities.css'


type TodoItem = { title: string; index: number; done: boolean };

interface TodoItemProps {
    todo: TodoItem;
    onRemove: (id: number) => void;
    onToggle: (id: number) => void;
}

export default function TodoItem(props: TodoItemProps) {

    return (
        <>
            <li class="todo__item">
                <div class="checkbox-wrapper">
                    <input
                        type="checkbox"
                        id={props.todo.title}
                        checked={props.todo.done}
                        onChange={[props.onToggle, props.todo.index]}
                    />
                    <label for={props.todo.title}>
                        {props.todo.title}
                    </label>
                </div>
                <button aria-label={`Delete item ${props.todo.title}`} onClick={() => props.onRemove(props.todo.index)} class="todo__delete" >
                    <img src={iconCross} alt="" />
                </button>
            </li>
        </>
    )

}

