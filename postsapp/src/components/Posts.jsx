import React, {useState, useEffect} from 'react';
import {Link} from 'react-router-dom';
import {deletePost, getPosts} from "../Queries.js";
import './style/postsStyl.css';
import MultiSelect from "react-multi-select-component";


const Posts = () => {
    const [posts, setPosts] = useState([]);
    const [options, setOptions] = useState([]);
    const [selected, setSelected] = useState([]);
    const [sort, setSort] = useState([]);
    const [name, setName] = useState('');


    const fetchData = async () => {
        const rsult =await getPosts(name);
        let finalRsult=[];

        if(selected.length != 0){
        for(let i=0;i<rsult.length;i++){
            let b=true;
            for(let j=0;j<selected.length;j++){
                if(rsult[i].tags.indexOf(selected[j].value) == -1){
                    b=false;
                }
                if(j==selected.length-1 && b){
                    finalRsult.push(rsult[i]);
                }
            }
        }
        }else {
            finalRsult = rsult;
        }

        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul","Aug", "Sep", "Oct","Nov","Dec"];
        for(let i=0; i<finalRsult.length; i++){
            let d = new Date(finalRsult[i].createdAt);
            let date = `${months[d.getMonth()]} ${(d.getDate() < 10)?("0" +d.getDate()):(d.getDate())}, ${d.getFullYear()}`;
            finalRsult[i].date = date;
            let time = `${(d.getHours() < 10) ? ("0"+d.getHours()):(d.getHours())}:${(d.getMinutes() < 10)?("0"+d.getMinutes()):(d.getMinutes())}`;
            finalRsult[i].time = time;
        }

        setPosts(finalRsult);

        let tags= [];
        for(let i=0; i<rsult.length; i++){
            for(let j=0; j<rsult[i].tags.length;j++){
                if(!tags.includes(rsult[i].tags[j])){
                    tags.push(rsult[i].tags[j]);
                }
            }
        }
         const options = [];
         tags.map(t => (
             options.push(
                 { label: t, value: t }
             )
         ));
         setOptions(options);

        const sort= [
            {value: 'desc', label: 'Date desc'},
            {value: 'asc', label: 'Date asc'},
            {value: 'descT', label: 'Title desc'},
            {value: 'ascT', label: 'Title asc'},
        ];

        setSort(sort);

    };
    const deleteData = id => async () => {
        await deletePost(id);
        fetchData();
    };
    useEffect(() => {
        fetchData();
    }, [name,selected]);

    return (
        <div>
            <div className="header">
                <div className="logo">
                    <span className="second-word"> PostsApp</span>
                </div>
                <div>
                    <label  className="header-labels">TAGS</label>
                    <MultiSelect
                        options={options}
                        value={selected}
                        onChange={setSelected}
                        labelledBy="Select"
                    />
                </div>
                <div>
                    <label htmlFor="sort" className="header-labels">Sortings</label>
                    <select className="form-select" name="sort" id="sort" onChange={e => {
                        localStorage.setItem('sort', e.target.value);
                        fetchData();
                    }}
                            defaultValue={localStorage.getItem('sort')}>
                        {sort.map(t => (
                            <option value={t.value} key={t.value}>
                                {t.label}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label htmlFor="name" className="header-labels">Title</label>
                    <input type="text" name="name" onChange={e => setName(e.target.value)}/>
                </div>


                <div className="div-add-button">
                    <button className="btn btn-dark btn-lg">
                        <Link to="add">Add</Link>
                    </button>
                </div>
            </div>
            <div className="posts-table">
                {(posts || []).map(post => (
                    <div key={post.id} className="card border" style={{width: 30 + 'rem', display: "inline-block", marginRight:40 +'px'}}>
                        <img className="card-img-top" src={post.imageUrl} style={{width: 30 + 'rem'}}/>

                            <ul className="list-group list-group-flush">

                                <li className="list-group-item">{post.title}</li>
                                <li className="list-group-item">{post.content.substr(0, post.content.indexOf('.'))}.</li>
                                <li className="list-group-item">Created: {post.date}, {post.time}</li>
                                <li className="list-group-item">
                                    {(post.tags || []).map(tag => (
                                        <span>#{tag} </span>
                                    ))}
                                    </li>
                                <li className="list-group-item">
                                <button className="btn btn-block">
                                    <Link to={`posts/${post.id.toString()}`}>View</Link>
                                </button>
                                </li>
                                <li className="list-group-item">
                                    <button className="btn btn-block">
                                        <Link to={`posts/${post.id.toString()}/edit`}>Edit</Link>
                                    </button>
                                </li>
                                <li className="list-group-item">
                                    <button className="btn btn-block" onClick={deleteData(post.id)}>Delete</button>
                                </li>
                            </ul>
                    </div>
                ))}
            </div>
        </div>
    )
};

export default Posts;