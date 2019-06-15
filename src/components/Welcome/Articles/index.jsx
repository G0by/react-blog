import React from 'react';


import PropTypes from 'prop-types';
import Banner from '../../Banner';
import Article from '../../Article';

const Articles = ({
  articles, handlePagination, nextUrl, prevUrl,
}) => ((
  <div>

    <Banner
      backgroundImage={`url(${process.env.PUBLIC_URL}/assets/img/bg-gift.jpg)`}
      title="Latest Blog Posts"
      subTitle="Read and get updated on how we progress."
    />

    <main className="main-content bg-gray">
      <div className="row">
        <div className="col-12 col-lg-6 offset-lg-3">
          {articles && articles.map(article => (
            <div key={article.id}>
              <Article article={article} />
              <hr />
            </div>
          ))}
          <nav className="flexbox mt-50 mb-50">
            <button type="button" className={`btn btn-white ${prevUrl ? '' : 'disabled'}`} onClick={() => handlePagination(prevUrl)}>
              <i className="ti-arrow-right fs-9 ml-4" />
              Older
            </button>
            <button type="button" className={`btn btn-white ${nextUrl ? '' : 'disabled'}`} onClick={() => handlePagination(nextUrl)}>
              Newer
              <i className="ti-arrow-left fs-9 mr-4" />
            </button>
          </nav>

        </div>
      </div>
    </main>
  </div>
));

Articles.propTypes = {
  articles: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
  })),
  handlePagination: PropTypes.func.isRequired,
  nextUrl: PropTypes.string,
  prevUrl: PropTypes.string,
};

Articles.defaultProps = {
  articles: [],
  nextUrl: null,
  prevUrl: null,
};

export default Articles;
