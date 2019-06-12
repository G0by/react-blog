import React from 'react';
import Disqus from 'disqus-react';

import Article from './Article';

class SingleArticleContainer extends React.Component {
  constructor() {
    super();

    this.state = {
      article: null,
      loading: true,
    };
  }

  async componentWillMount() {
    let article = this.props.articles.find(article => article.slug === this.props.match.params.slug);

    if (article) {
      this.setState({
        article,
        loading: false,
      });
    } else {
      article = await this.props.getArticle(this.props.match.params.slug);
      this.setState({
        article,
        loading: false,
      });
    }
  }

  getComments = () => {
    const disqusShortname = 'example';
    const disqusConfig = {
      url: this.props.article.url,
      identifier: this.props.article.id,
      title: this.props.article.title,
    };

    return (
      <div className="article">
        <h1>{this.props.article.title}</h1>
        <Disqus.CommentCount shortname={disqusShortname} config={disqusConfig}>
          Comments
        </Disqus.CommentCount>
        <p>{this.props.article.body}</p>
        <Disqus.DiscussionEmbed shortname={disqusShortname} config={disqusConfig} />
      </div>
    );
  }

  render() {
    return (
      <div>
        {
          !this.state.loading && (
            <Article
              article={this.state.article}
            />
          )
        }
        {
          this.state.loading && (
            <p className="text-center">LOADING...</p>
          )
        }
      </div>
    );
  }
}

export default SingleArticleContainer;
