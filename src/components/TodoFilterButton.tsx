// css
import '../assets/css/App.css'
import '../assets/css/variables.css'
import '../assets/css/fonts.css'
import '../assets/css/reset.css'
import '../assets/css/utilities.css'

interface FilterProps {
    type: string,
    title: string,
    checked?: boolean,
    onShow: (type: string) => void;
}

export default function TodoFilterButton(props: FilterProps) {

    return (
        <div class="footer__control">
            <input type="radio" name="tasks" id={props.type} checked={props.checked} onChange={() => props.onShow(props.type)} /><label for={props.type}>{props.title}</label>
        </div>

    )

}