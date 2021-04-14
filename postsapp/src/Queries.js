const sortSearch = (input) => {
    if (!input) {
        return '';
    }
    return `_sort=createdAt&_order=${input}`;
};
 const sortSearchTitle = (input) => {
     input = input.replace("T","");
     console.log(input);

     if (!input) {
         return '';
     }
     return `_sort=title&_order=${input}`;
 };

const searchName = (input) => {
    if (!input) {
        return '';
    }
    return `title_like=${input}`;
};

 const searchUrl = (url,input) => {
     if (!input) {
         return '';
     }
     return `${url}=${input}`;
 };

export const getPosts = async (name) => {
    let sort;
    if(localStorage.getItem('sort') ==="ascT" || localStorage.getItem('sort') === "descT"){
        sort = sortSearchTitle(localStorage.getItem('sort'));
    }else{
        sort = sortSearch(localStorage.getItem('sort'));
    }

    const filter = searchName(name);
    const data = await fetch(`http://localhost:3001/posts?${[sort, filter].join('&')}`);
    return await data.json();
};

 export const getPhotos = async (image) => {
     let i = parseInt(image);

     const filter = searchUrl('id',i);
     const data = await fetch(`http://localhost:3001/images?${[filter].join('&')}`);
    let m = await data.json();
    return m;
 };


export const deletePost = async id => {
    return await fetch(`http://localhost:3001/posts/${id}`, { method: 'DELETE'});
};