import React from 'react';
import PropTypes from 'prop-types';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

import Banner from '../../Banner';

const CreateArticleForm = ({
  handleInputChange, categories, handleSubmit, errors, editing,
  article, content, title, category, updateArticle, handleEditorState,
  loading,
}) => ((
  <div>
    {/* Header */}

    <Banner
      backgroundImage={`url(${process.env.PUBLIC_URL}/assets/img/bg-laptop.jpg)`}
      title={editing ? `Editing Article: ${article.title}` : 'Write an article'}
    />
    {/* END Header */}
    {/* Main container */}
    <main className="main-content">
      <section className="section">
        <div className="container">
          <div className="row">
            <div className="col-12 col-lg-12">
              <ul className="list-group">
                {Array.from(errors).map(error => <li key={error.message} className="list-group-item text-danger">{error.message}</li>)}
              </ul>
              <form className="p-30 bg-gray rounded" onSubmit={editing ? updateArticle : handleSubmit}>
                <div className="row">
                  <div className="form-group col-md-12 my-5">
                    <input type="file" className="form-control" onChange={handleInputChange} name="image" />
                  </div>
                  <div className="form-group col-12 col-md-6">
                    <input
                      className="form-control form-control-lg"
                      type="text"
                      name="title"
                      placeholder="Title"
                      value={title}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="form-group col-12 col-md-6">
                    <select name="category" onChange={handleInputChange} value={category || ''} className="form-control form-control-lg">
                      <option value>Select category</option>
                      {categories.map(singleCategory => (
                        <option key={singleCategory} value={singleCategory.id}>
                          {singleCategory.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <Editor
                    editorState={content}
                    onEditorStateChange={handleEditorState}
                  />
                </div>
                <div className="text-center">
                  <button className="btn btn-lg btn-primary" type="submit" disabled={loading}>
                    {loading && <i className="fa fa-refresh fa-spin" />}
                    {editing ? 'Update Article' : 'Create Article'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </main>
    {/* END Main container */}
  </div>
));

CreateArticleForm.propTypes = {
  handleInputChange: PropTypes.func.isRequired,
  handleEditorState: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  categories: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
  })).isRequired,
  handleSubmit: PropTypes.func.isRequired,
  errors: PropTypes.arrayOf(PropTypes.shape({
    message: PropTypes.string.isRequired,
  })).isRequired,
  editing: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  content: PropTypes.objectOf(PropTypes.any).isRequired,
  category: PropTypes.number,
  updateArticle: PropTypes.func.isRequired,
  article: PropTypes.shape({
    title: PropTypes.string.isRequired,
  }),
};

CreateArticleForm.defaultProps = {
  article: null,
  category: null,
};

export default CreateArticleForm;
