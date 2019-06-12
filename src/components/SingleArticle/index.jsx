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
            <p className="text-center">LOADING...</p>
          )
        }
      </div>
    );
  }
}

export default SingleArticleContainer;
