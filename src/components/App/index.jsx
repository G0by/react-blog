import React from 'react';
import PropTypes from 'prop-types';
import { Route, Switch } from 'react-router-dom';

import Auth from '../Auth';
import RedirectIfAuth from '../RedirectIfAuth';
import Navbar from '../Navbar';
import Footer from '../Footer';
import Welcome from '../Welcome';
import SingleArticle from '../SingleArticle';
import CreateArticle from '../CreateArticle';
import Login from '../Login';
import Signup from '../Signup';
import UserArticles from '../UserArticles';
import Banner from '../Banner';

const Page404 = () => ((
  <div>
    <Banner
      backgroundImage={`url(${process.env.PUBLIC_URL}/assets/img/bg-laptop.jpg)`}
    />
    <div className="text-center mb-40">
      <h2>
        Sorry, nothing here!
      </h2>
    </div>
  </div>
));


class App extends React.Component {
  constructor() {
    super();

    this.state = {
      authUser: null,
      articles: [],
    };
  }

  componentWillMount() {
    const user = localStorage.getItem('user');

    if (user) {
      this.setState({
        authUser: JSON.parse(user),
      });
    }
  }

  setArticles = (articles) => {
    this.setState({
      articles,
    });
  }

  setAuthUser = (authUser) => {
    this.setState({
      authUser,
    }, () => {
      localStorage.setItem('user', JSON.stringify(authUser));
      this.props.notyService.success('Successfully logged in');
      this.props.history.push('/');
    });
  }

  removeAuthUser = () => {
    localStorage.removeItem('user');
    this.props.notyService.success('Bye!');
    this.setState({ authUser: null });
  }

  render() {
    const { location } = this.props;
    return (
      <div>
        {
          location.pathname !== '/login'
          && location.pathname !== '/signup'
          && <Navbar authUser={this.state.authUser} removeAuthUser={this.removeAuthUser} />
        }
        <Switch>
          <Route
            exact
            path="/"
            render={
              props => (
                <Welcome
                  {...props}
                  getArticles={this.props.articlesService.getArticles}
                  setArticles={this.setArticles}
                />
              )
            }
          />
          <Route
            exact
            path="/category/:slug"
            render={
              props => (
                <Welcome
                  {...props}
                  getArticles={this.props.articlesService.getArticles}
                  setArticles={this.setArticles}
                  getArticleCategories={this.props.articlesService.getArticleCategories}
                />
              )
            }
          />
          <RedirectIfAuth
            path="/login"
            component={Login}
            props={{
              loginUser: this.props.authService.loginUser,
              setAuthUser: this.setAuthUser,
            }}
            isNotAuthenticated={this.state.authUser === null}
          />
          <RedirectIfAuth
            path="/signup"
            component={Signup}
            props={{
              registerUser: this.props.authService.registerUser,
              setAuthUser: this.setAuthUser,
            }}
            isNotAuthenticated={this.state.authUser === null}
          />
          <Route
            path="/article/:slug"
            exact
            render={
              props => (
                <SingleArticle
                  {...props}
                  getArticle={this.props.articlesService.getArticle}
                  articles={this.state.articles}
                />
              )
            }
          />
          <Auth
            path="/articles/create"
            component={CreateArticle}
            props={{
              getArticleCategories: this.props.articlesService.getArticleCategories,
              createArticle: this.props.articlesService.createArticle,
              token: this.state.authUser ? this.state.authUser.token : null,
              notyService: this.props.notyService,
            }}
            isAuthenticated={this.state.authUser !== null}
          />
          <Auth
            path="/user/articles"
            component={UserArticles}
            props={{
              getUserArticles: this.props.articlesService.getUserArticles,
              setArticles: this.setArticles,
              deleteArticle: this.props.articlesService.deleteArticle,
              token: this.state.authUser ? this.state.authUser.token : null,
            }}
            isAuthenticated={this.state.authUser !== null}
          />
          <Auth
            path="/article/edit/:slug"
            component={CreateArticle}
            props={{
              getArticleCategories: this.props.articlesService.getArticleCategories,
              createArticle: this.props.articlesService.createArticle,
              token: this.state.authUser ? this.state.authUser.token : null,
              articles: this.state.articles,
              updateArticle: this.props.articlesService.updateArticle,
              notyService: this.props.notyService,
            }}
            isAuthenticated={this.state.authUser !== null}
          />
          <Route component={Page404} />
        </Switch>
        {
          location.pathname !== '/login'
          && location.pathname !== '/signup'
          && <Footer />
        }
      </div>
    );
  }
}

App.propTypes = {
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired,
  }).isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  authService: PropTypes.objectOf(PropTypes.func).isRequired,
  articlesService: PropTypes.objectOf(PropTypes.func).isRequired,
  notyService: PropTypes.shape({
    success: PropTypes.func.isRequired,
  }).isRequired,
};

export default App;
