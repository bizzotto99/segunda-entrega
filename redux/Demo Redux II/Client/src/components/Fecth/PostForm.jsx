import { useState } from "react"
import { useDispatch } from "react-redux"
import { createPosts } from "../Redux/postSlice"

const PostForm = ()=> {

    const [title, setTile] = useState("")
    const [body, setBody] = useState("")
    const dispatch = useDispatch()

    const handleSubmit = (e) => {
        e.preventDefault()
        dispatch(createPosts({title, body}))
        setTile("")
        setBody("")
    }

    return(
        <form onSubmit={handleSubmit}>
            <h2>Crear nuevo post</h2>
            <div>
                <label>Titulo:</label><br />
                <input 
                type="text"
                value={title}
                onChange={(e) => setTile(e.target.value)}
                required
                />
            </div> <br /><br />
            <div>
                <label>Contenido:</label><br />
                <textarea 
                value={body}
                onChange={(e) => setBody(e.target.value)}
                required
                /> 
            </div><br /><br />
            <button type="submit">Crear post</button>

        </form>
    )
}

export default PostForm