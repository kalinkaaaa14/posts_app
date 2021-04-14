import React, {useEffect, useState} from 'react';
import { Link, useParams ,useHistory} from 'react-router-dom';
import MultiSelect from "react-multi-select-component";


const EditPost = () => {
   const history = useHistory();

    const { postId: id } = useParams();
    const putData = async ({title, content, tagsNw, imageUrl, createdAt, changedAt}) => {
        let tags = [];

        tagsNw.map(t => (
            tags.push(t.value)
        ));

        let m = await fetch(`http://localhost:3001/posts/${id}`, {
            method: 'PUT',
            body: JSON.stringify({
                title,
                content,
                tags,
                imageUrl,
                createdAt,
                changedAt
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        history.push("/posts");
    };

    const [post, setPost] = useState(null);
    //const [tags, setTags] = useState([]);
     const [options, setOptions] = useState([]);
    const [selected, setSelected] = useState([]);

    const fetchData = async () => {
        const result = await fetch(`http://localhost:3001/posts?id=${id}`);
        const posts = await result.json();
        if(!posts.length){
            return;
        }
        setPost(posts[0])

        const tagsRsult = await fetch(`http://localhost:3001/tags`);
        const tags = await tagsRsult.json();
        if(!tags.length){
            return;
        }

      //  setTags(tags);

        const options = [];
        tags.map(t => (
            options.push(
                { label: t.name, value: t.name }
            )
        ));

        const selected = [];
        posts[0].tags.map(t => (
            selected.push(
                { label: t, value: t }
            )
        ));

        setSelected(selected)
        setOptions(options);
    };
    useEffect(() => {
        fetchData();
    }, []);
    if(!post){
        return null;
    }

    return (
        <div className="container">
            <div className="row">
                <div className="col-sm-1"></div>
                <div className="col-sm-10" >
                    <br/>
                    <br/>
                    <h1 className="text-center"> EDIT POST</h1>
            <form onSubmit={(e) => {
                e.persist();
                e.preventDefault();
                const {target: {elements: {title, content, imageUrl}}} = e;

                putData({
                    title: title.value,
                    content: content.value,
                    tagsNw: selected,
                    imageUrl: imageUrl.value,
                    createdAt: post.createdAt,
                    changedAt: Date.now()
                });

            }}>
                <div className="form-group" style={{display: "none"}}>
                    <input  type="text" name="createdAt" defaultValue={post.createdAt} className="form-control"/>
                </div>
                <div className="form-group">
                    <input type="text" name="title" defaultValue={post.title} className="form-control"/>
                </div>
                <div className="form-group">
                    <input type="text" name="imageUrl" defaultValue={post.imageUrl} className="form-control"/>
                </div>
                <div className="form-group">
                    <textarea type="text" name="content" defaultValue={post.content} className="form-control"/>
                </div>
                <div className="form-group" style={{paddingLeft: 20 +"px"}}>
                <MultiSelect
                    options={options}
                    value={selected}
                    onChange={setSelected}
                    labelledBy="Select"
                />
                </div>
                <div className="text-center">
                    <input type="submit" value="submit" className="btn btn-lg btn-primary" style={{marginRight: 20+"px"}}/>
                    <Link className="btn btn-danger btn-lg" to="/" >Back</Link>
                </div>
            </form>
                </div>
                <div className="col-sm-1"></div>
            </div>
        </div>
    )
};

export default EditPost;