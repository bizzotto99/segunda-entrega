import { useState } from "react"
import { useDispatch } from "react-redux"
import { updatePost } from "../Redux/postSlice"

const EditPostForm = ({id, currentBody, currentTitle, onClose})=>{
    const [title, setTitle] = useState(currentTitle)
    const [body, setBody] = useState(currentBody)
    const dispatch = useDispatch()

    const handleSubmit = (e) => {
        e.preventDefault()
        dispatch(updatePost({id, title, body}))
        onClose()
    }

    return(
        <form onSubmit={handleSubmit}>
            <h2>Editar Post</h2>
            <div>
                <label>Titulo:</label>
                <input type="text"
                value={title} 
                onChange={(e) => setTitle(e.target.value)}
                required/>
            </div>
            <div>
                <label>Contenido:</label>
                <textarea 
                value={body}
                onChange={(e) => setBody(e.target.value)}
                required/>
            </div>
            <button type="submit">Guardar cambios</button>
            <button type="button" onClick={onClose}>Cancelar</button>

        </form>
    )
}

export default EditPostForm