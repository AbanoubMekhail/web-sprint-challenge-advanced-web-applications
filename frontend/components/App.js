import React, { useState } from 'react'
import { NavLink, Routes, Route, useNavigate } from 'react-router-dom'
import Articles from './Articles'
import LoginForm from './LoginForm'
import Message from './Message'
import ArticleForm from './ArticleForm'
import Spinner from './Spinner'
import axios from 'axios'
import AxiosWithAuth from '../axios'

const articlesUrl = 'http://localhost:9000/api/articles'
const loginUrl = 'http://localhost:9000/api/login'

export default function App() {
  // ✨ MVP can be achieved with these states
  const [message, setMessage] = useState('')
  const [articles, setArticles] = useState([])
  const [currentArticleId, setCurrentArticleId] = useState()
  const [spinnerOn, setSpinnerOn] = useState(false)
  const [postMessage, setPostMessage] = useState('');

  // ✨ Research `useNavigate` in React Router v.6
  const navigate = useNavigate()
  const redirectToLogin = () => { navigate('/') }
  const redirectToArticles = () => { navigate('/articles') }

  const logout = () => {
    // ✨ implement
    // If a token is in local storage it should be removed,
    // and a message saying "Goodbye!" should be set in its proper state.
    // In any case, we should redirect the browser back to the login screen,
    // using the helper above.
    localStorage.removeItem('token');
    setMessage('Goodbye!');
    redirectToLogin();
  }

  const login = async ({ username, password }) => {
    // ✨ implement
    // We should flush the message state, turn on the spinner
    // and launch a request to the proper endpoint.
    // On success, we should set the token to local storage in a 'token' key,
    // put the server success message in its proper state, and redirect
    // to the Articles screen. Don't forget to turn off the spinner!
    setMessage('');
    setSpinnerOn(true);


    axios.post(loginUrl, { username, password })
      .then(res => {
        // console.log(res)
        localStorage.setItem('token', res.data.token);
        setSpinnerOn(false);
        redirectToArticles();
      })
      .catch(err => console.log(err));
  }

  const getArticles = (setmessage) => {
    // ✨ implement
    // We should flush the message state, turn on the spinner
    // and launch an authenticated request to the proper endpoint.
    // On success, we should set the articles in their proper state and
    // put the server success message in its proper state.
    // If something goes wrong, check the status of the response:
    // if it's a 401 the token might have gone bad, and we should redirect to login.
    // Don't forget to turn off the spinner!
    setMessage('');
    setSpinnerOn(true);

    AxiosWithAuth()
      .get(articlesUrl)
      .then(res => {
        if (res.status === 401) {
          redirectToLogin();
        }
        setArticles(res.data.articles);
        if (!setmessage) {
          setMessage(res.data.message);
        }
        // console.log(res);


        setSpinnerOn(false);

      })
      .catch(err => console.error(err));
  }

  const postArticle = article => {
    // ✨ implement
    // The flow is very similar to the `getArticles` function.
    // You'll know what to do! Use log statements or breakpoints
    // to inspect the response from the server.
    const { title, text, topic } = article;
    setMessage('');
    setSpinnerOn(true);
    AxiosWithAuth()
      .post(articlesUrl, article)
      .then((res) => {
        setMessage(res.data.message);

        setArticles((prevArticles) => [...prevArticles, res.data.article]);
        setSpinnerOn(false);
      })
      .catch(err => console.error(err));
  };


  const updateArticle = ({ article_id, article }) => {
    // ✨ implement
    // You got this!
    
    setMessage('');
    setSpinnerOn(true);

    AxiosWithAuth()
      .put(`${articlesUrl}/${article_id}`, article)
      .then((res) => {
        // if (res.status === 200) {
        //   setMessage(res.data.message);

        //   setArticles((prevArticles) => {
        //     const updatedArticles = prevArticles.map((prevArticle) => {
        //       if (prevArticle.article_id === article_id) {
        //         return { ...prevArticle, ...article };
        //       }
        //       return prevArticle;
        //     });
        //     return updatedArticles;
        //   });
        // } 
        getArticles(true);
        setMessage(res.data.message);
        setCurrentArticleId(null);
        setSpinnerOn(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };


  const deleteArticle = article_id => {
    // ✨ implement
    // setMessage('');
    setSpinnerOn(true);

    AxiosWithAuth()
      .delete(`${articlesUrl}/${article_id}`)
      .then((res) => {
        // if (res.status === 204) {
          // console.log(res);
          // setMessage(res.data.message);
          // getArticles(true);
        // }
        setArticles(articles.filter(art => article_id !== art.article_id))
        setMessage(res.data.message);

        setSpinnerOn(false);
      })
      .catch((err) => {
        console.log(err);
      });

  }

  return (
    // ✨ fix the JSX: `Spinner`, `Message`, `LoginForm`, `ArticleForm` and `Articles` expect props ❗
    <>
      <Spinner on={spinnerOn} />
      <Message message={message} />
      <button id="logout" onClick={logout}>Logout from app</button>
      <div id="wrapper" style={{ opacity: spinnerOn ? "0.25" : "1" }}> {/* <-- do not change this line */}
        <h1>Advanced Web Applications</h1>
        <nav>
          <NavLink id="loginScreen" to="/">Login</NavLink>
          <NavLink id="articlesScreen" to="/articles">Articles</NavLink>
        </nav>
        <Routes>
          <Route path="/" element={<LoginForm login={login} />} />
          <Route path="articles" element={
            <>
              <ArticleForm
                setCurrentArticleId={setCurrentArticleId}
                currentArticleId={currentArticleId}
                postArticle={postArticle}
                updateArticle={updateArticle}
                deleteArticle={deleteArticle}
                articles={articles}
              />
              <Articles
                articles={articles}
                getArticles={getArticles}
                deleteArticle={deleteArticle}
                setCurrentArticleId={setCurrentArticleId}
                currentArticleId={currentArticleId}
              />
            </>
          } />
        </Routes>
        <footer>Bloom Institute of Technology 2022</footer>
      </div>
    </>
  )
}
