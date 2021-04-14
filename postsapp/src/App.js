import React from 'react';
import './App.css';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import Redirect from "react-router-dom/es/Redirect";

import Posts from "./components/Posts";
import PostPage from "./components/PostPage";
import AddPost from "./components/AddPost";
import EditPost from "./components/EditPost";
import NotFound from './components/NotFound';

function App() {
  return (
      <Router>
        <div className="App">
          <Switch>
            <Route path="/posts" exact component={Posts}/>
            <Route path="/posts/:postId" exact component={PostPage}/>
            <Route path="/add"  exact component={AddPost}/>
            <Route path="/posts/:postId/edit" exact component={EditPost}/>
            <Redirect exact from="/" to="/posts" />
            <Redirect exact from="/edit" to="/posts"/>
            <Route component={NotFound} />
          </Switch>
        </div>
      </Router>
  );
}


export default App;
