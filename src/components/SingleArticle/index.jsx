import React from 'react';
import { css } from '@emotion/core';
import { ClipLoader } from 'react-spinners';
import Disqus from 'disqus-react';
import PropTypes from 'prop-types';

import Article from './Article';
import Banner from '../Banner';

const override = css`
    display: block;
    margin: 0 auto;
    border-color: red;
`;

class SingleArticleContainer extends React.Component {
  constructor() {
    super();

    this.state = {
      article: null,
      loading: true,
    };
  }

  async componentWillMount() {
    let article = this.props.articles.find(
      newArticle => newArticle.slug === this.props.match.params.slug,
    );

    if (article) {
      this.setState({
        article,
        loading: false,
      });
    } else {
      try {
        article = await this.props.getArticle(this.props.match.params.slug);
        this.setState({
          article,
          loading: false,
        });
      } catch (errors) {
        this.props.history.push('/404');
        this.setState({
          loading: false,
        });
      }
    }
  }

  getComments = () => {
    const disqusShortname = 'Gooberblog';
    const disqusConfig = {
      url: `https://gooberblog.herokuapp.com/article/${this.state.article.id}`,
      identifier: this.state.article.id,
      title: this.state.article.title,
    };

    return (
      <Disqus.DiscussionEmbed shortname={disqusShortname} config={disqusConfig} />
    );
  }

  render() {
    return (
      <div>
        {
          !this.state.loading && (
            <Article
              article={this.state.article}
              getComments={this.getComments}
              disqusShortname="bahdblog"
              disqusConfig={{
                url: `https://gooberblog.herokuapp.com/article/${this.state.article.slug}`,
                identifier: this.state.article.id,
                title: this.state.article.title,
              }}
            />
          )
        }
        {
          this.state.loading && (
            <div className="sweet-loading text-center">
              <Banner
                backgroundImage={`url(${process.env.PUBLIC_URL}/assets/img/bg-laptop.jpg)`}
              />
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

SingleArticleContainer.propTypes = {
  getArticle: PropTypes.func.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      slug: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  articles: PropTypes.arrayOf(PropTypes.shape({
    title: PropTypes.string.isRequired,
    imageUrl: PropTypes.string.isRequired,
    category: PropTypes.shape({
      name: PropTypes.string.isRequired,
    }).isRequired,
    created_at: PropTypes.string.isRequired,
  })).isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};

export default SingleArticleContainer;
