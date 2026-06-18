import {useSelector} from "react-redux"
const LatestPost = () => {

    const posts = useSelector((state) => state.posts.items)
    const latestPost = posts[posts.length-1]

    if(!latestPost) return <p>No hay publicaciones aun</p>

    return(
        <>
        <h3>Última publicación</h3>
        <h4>{latestPost.title}</h4>
        <p>{latestPost.body}</p>
        </>
    )
}

export default LatestPost