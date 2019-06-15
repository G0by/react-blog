import React from 'react';
import PropTypes from 'prop-types';
import { css } from '@emotion/core';
import { ClipLoader } from 'react-spinners';
import config from '../../config';

import Banner from '../Banner';
import Articles from './Articles';

const override = css`
    display: block;
    margin: 0 auto;
    border-color: red;
`;

class Welcome extends React.Component {
  constructor() {
    super();

    this.state = {
      articles: {},
      loading: true,
    };
  }

  async componentWillMount() {
    if (this.props.match.params.slug) {
      const categories = await this.props.getArticleCategories();
      const category = categories.find(
        categoryInArray => categoryInArray.slug === this.props.match.params.slug,
      );
      const categoryArticles = await this.props.getArticles(`${config.apiUrl}/articles/category/${category.id}`);
      const { articles } = categoryArticles;

      this.setState({ articles });
      this.props.setArticles(articles.data);
    } else {
      const articles = await this.props.getArticles();
      this.setState({ articles });
      this.props.setArticles(articles.data);
    }
  }

  async componentDidMount() {
    this.setState({ loading: false });
  }

  handlePagination = async (url) => {
    const articles = await this.props.getArticles(url);

    this.setState({ articles });
    this.props.setArticles(articles.data);
  }

  render() {
    return (
      <div>
        {
          !this.state.loading && (
            <Articles
              articles={this.state.articles.data}
              nextUrl={this.state.articles.next_page_url}
              prevUrl={this.state.articles.prev_page_url}
              handlePagination={this.handlePagination}
            />
          )
        }
        {
          this.state.loading && (
            <div className="sweet-loading text-center">
              <Banner
                backgroundImage={`url(${process.env.PUBLIC_URL}/assets/img/bg-laptop.jpg)`}
              />
              <h2 className="text-center">Loading Page...</h2>
              <ClipLoader
                css={override}
                sizeUnit="px"
                size={150}
                color="#123abc"
                loading={this.state.loading}
              />
            </div>
          )
        }
      </div>
    );
  }
}

Welcome.propTypes = {
  getArticles: PropTypes.func.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      slug: PropTypes.string,
    }).isRequired,
  }).isRequired,
  setArticles: PropTypes.func.isRequired,
  getArticleCategories: PropTypes.func,
};

Welcome.defaultProps = {
  getArticleCategories: null,
};

export default Welcome;
