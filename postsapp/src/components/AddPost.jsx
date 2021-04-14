import React, {useEffect, useState} from 'react';
import { Link, useHistory } from 'react-router-dom';
import {getPhotos} from "../Queries.js";
import MultiSelect from "react-multi-select-component";

const AddPost = () => {
    const history = useHistory();

    const createNew = async ({title, content, tagsNw,tagInput, addToTags, imageInput,addToBank,imageFromBank,createdAt,changedAt}) => {
        let tagsArr = [];

        const imageFr = await fetch(`http://localhost:3001/images?id=${imageFromBank}`);
        const images = await imageFr.json();

        (tagsNw || []).map(t => (
            tagsArr.push(t.value)
        ));
        if(tagInput !== ""){
            tagsArr.push(tagInput);
        }

        if(addToTags && tagInput !== ""){
            let id= tags.length+1;
             await fetch('http://localhost:3001/tags', {
                method: 'POST',
                body: JSON.stringify({
                    id,
                    name:tagInput
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
        }

        if(addToBank && imageInput !== ""){
            let id= imgs.length+1;
             await fetch('http://localhost:3001/images', {
                method: 'POST',
                body: JSON.stringify({
                    id,
                    url:imageInput
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
        }

        let imagRs;
        if(imageInput !== ""){
            imagRs=imageInput;
        }else if(images.length  === 0){
            imagRs="https://images.unsplash.com/photo-1613092869277-6e02af5564aa?auto=format&fit=crop&w=1500&q=80";
        }else {
            imagRs=images[0].url;
        }
             let s = await fetch('http://localhost:3001/posts', {
                 method: 'POST',
                 body: JSON.stringify({
                     title,
                     content,
                     tags: tagsArr,
                     imageUrl: imagRs,
                     createdAt,
                     changedAt
                 }),
                 headers: {
                     'Content-Type': 'application/json'
                 }
             });

        let m = await fetch('http://localhost:3001/posts');
        let mf = await m.json();

        history.push(`/posts/${mf[mf.length-1].id}`);
    };

    const [options, setOptions] = useState([]);
    const [selected, setSelected] = useState([]);
    const [imgs, setImgs] = useState([]);
    const [tags, setTags] = useState([]);
    const [image, setImage] = useState('');
    const [imageview, setImageview] = useState([]);

    const fetchData = async () => {
       const m = await getPhotos(image);
       setImageview(m);

        const tagsRsult = await fetch(`http://localhost:3001/tags`);
        const tags = await tagsRsult.json();
        if(!tags.length){
            return;
        }

        setTags(tags);

        const options = [];
        tags.map(t => (
            options.push(
                { label: t.name, value: t.name }
            )
        ));

        const imgRsult = await fetch(`http://localhost:3001/images`);

       const imgs = await imgRsult.json();
         if(!imgs.length){
             return;
         }

        setImgs(imgs);
        setOptions(options);
    };


    useEffect(() => {
        fetchData();
    }, [image]);


    return (
        <div className="container">
            <div className="row">
                <div className="col-sm-1"></div>
                <div className="col-sm-10" >
                    <br/>
                    <br/>
                    <h1 className="text-center"> ADD NEW POST!</h1>
                    <form onSubmit={async (e) => {
                        e.persist();
                        e.preventDefault();
                        const {target: {elements: {title, content, imageUrl,addToBank,tag,addToTags}}} = e;
                        await createNew({
                            title: title.value,
                            content: content.value, 
                            tagsNw: selected,
                            tagInput: tag.value,
                            addToTags: addToTags.checked,
                            imageInput: imageUrl.value,
                            addToBank: addToBank.checked,
                            imageFromBank:image,
                            createdAt: Date.now(),
                            changedAt: Date.now()
                        });
                    }}>
                        <div className="form-group">
                            <input type="text" name="title" placeholder="title" className="form-control"/>
                        </div>
                        <div className="form-group">
                        <textarea type="text" name="content" placeholder="content" className="form-control"/>
                        </div>
                        <div className="form-group" style={{width:900+"px",display: "inline-block", marginRight:32 +"px"}}>
                        <input name="imageUrl" placeholder="imageUrl" className="form-control"/>
                        </div>
                        <div className="form-check" style={{display: "inline-block"}}>
                            <input name="addToBank" className="form-check-input" type="checkbox" value="" id="flexCheckDefault"/>
                        </div>
                        <br/>

                        <div style={{marginLeft:20+"px"}}>
                        <select style={{marginBottom:20+"px"}} name="url" id="url" onChange={e => setImage(e.target.value)}>
                            {(imgs || []).map(img => (
                                <option value={img.id} key={img.id}>
                                    {img.url}
                                </option>
                            ))}
                        </select>
<br/>
                        {(imageview || []).map(im => (
                            <img width={185+"px"} src={im.url} style={{paddingRight:10+"px", paddingBottom:10+"px"}}/>

                        ))}
                        </div>


                        <div className="form-group" style={{paddingLeft: 20 +"px"}}>
                        <MultiSelect
                            options={options}
                            value={selected}
                            onChange={setSelected}
                            labelledBy="Select"
                        />
                            <h4>You could also add your own tag!</h4>
                        </div>

                        <div className="form-group" style={{width:900+"px",display: "inline-block", marginRight:32 +"px"}}>
                            <input name="tag" type="text" placeholder="Name of your tag..." className="form-control"/>
                        </div>
                        <div className="form-check" style={{display: "inline-block"}}>
                            <input name="addToTags" className="form-check-input" type="checkbox" value="" id="flexCheckDefault"/>
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


export default AddPost;