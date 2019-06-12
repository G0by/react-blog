import React from 'react';
import PropTypes from 'prop-types';
import draftToHtml from 'draftjs-to-html';
import { EditorState, convertToRaw } from 'draft-js';

import CreateArticleForm from './CreateArticleForm';

class CreateArticle extends React.Component {
  constructor() {
    super();

    this.state = {
      title: '',
      image: null,
      content: EditorState.createEmpty(),
      category: null,
      errors: [],
      categories: [],
      editing: false,
      article: null,
    };
  }

  async componentWillMount() {
    const categories = await this.props.getArticleCategories();

    if (this.props.match.params.slug) {
      const article = this.props.articles.find(
        articleInArray => articleInArray.slug === this.props.match.params.slug,
      );
      if (!article) {
        this.props.history.push('/user/articles');
        return;
      }
      this.setState({
        editing: true,
        article,
        categories,
        title: article.title,
        category: article.category_id,
        //content: article.content,
      });
    } else {
      this.setState({
        categories,
      });
    }
  }

  handleEditorState = (editorState) => {
    this.setState({
      content: editorState,
    });
  }

  handleSubmit = async (event) => {
    event.preventDefault();

    try {
      await this.props.createArticle({
        title: this.state.title,
        content: draftToHtml(convertToRaw(this.state.content.getCurrentContent())),
        category: this.state.category,
        image: this.state.image,
      }, this.props.token);
      this.props.notyService.success('Article created.');
      this.props.history.push('/');
    } catch (errors) {
      this.props.notyService.error('Something went wrong.');
      this.setState({ errors });
    }
  }

  updateArticle = async (event) => {
    event.preventDefault();

    try {
      await this.props.updateArticle({
        title: this.state.title,
        image: this.state.image,
        content: draftToHtml(convertToRaw(this.state.content.getCurrentContent())),
        category: this.state.category,
      }, this.state.article, this.props.token);
      this.props.notyService.success('Article updated.');
      this.props.history.push('/');
    } catch (errors) {
      this.props.notyService.error('Something went wrong.');
      this.setState({ errors });
    }
  }

  handleInputChange = (event) => {
    this.setState({
      [event.target.name]: event.target.type === 'file' ? event.target.files[0] : event.target.value,
    });
  }


  render() {
    return (
      <CreateArticleForm
        handleInputChange={this.handleInputChange}
        categories={this.state.categories}
        handleSubmit={this.handleSubmit}
        errors={this.state.errors}
        editing={this.state.editing}
        article={this.state.article}
        title={this.state.title}
        category={this.state.category}
        content={this.state.content}
        updateArticle={this.updateArticle}
        handleEditorState={this.handleEditorState}
      />
    );
  }
}

CreateArticle.propTypes = {
  getArticleCategories: PropTypes.func.isRequired,
  createArticle: PropTypes.func.isRequired,
  updateArticle: PropTypes.func,
  token: PropTypes.string.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      slug: PropTypes.string,
    }).isRequired,
  }).isRequired,

  articles: PropTypes.arrayOf(PropTypes.shape({
    title: PropTypes.string.isRequired,
    imageUrl: PropTypes.string.isRequired,
    category: PropTypes.shape({
      name: PropTypes.string.isRequired,
    }).isRequired,
    created_at: PropTypes.string.isRequired,
  })),

};

CreateArticle.defaultProps = {
  updateArticle: () => { },
  articles: [],
};

export default CreateArticle;
