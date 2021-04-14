import React, {useState, useEffect} from 'react';
import {useParams,useHistory, Link} from 'react-router-dom';
import {deletePost} from "../Queries";


const PostPage = () => {

    const { postId: id } = useParams();
    const history = useHistory();
    const [post, setPost] = useState(null);

    const fetchData = async () => {
        const result = await fetch(`http://localhost:3001/posts?id=${id}`);
        const posts = await result.json();

        if(!posts.length){
            return;
        }
        setPost(posts[0])
    };
    useEffect(() => {
        fetchData();
    }, []);

    if(!post){
        return null;
    }
    return (
        <div className="container">
            <h1 className="text-center">{post.title}</h1>
            <div className="row">
                <div className="col-sm-4"></div>
                <div className="col-sm-4">
                    <div>
                        <img className="" src={post.imageUrl} style={{width: 34 + 'rem'}}/></div>
                </div>
                <div className="col-sm-4"></div>
            </div>
            <br/>
            <div className="row">
                <div>{post.content}</div>
                <br/>
                <div>
                {(post.tags || []).map(tag => (
                    <span>#{tag} </span>
                ))}
                </div>
            </div>
            <br/>

            <div className="row">

            <Link to={`/posts/${id}/edit`}>Edit</Link>
            <button onClick={() => {
                deletePost(id);
                history.push('/posts');
            }}>Delete</button>
            </div>
        </div>
    )
};

export default PostPage;