import Axios from 'axios';
import config from '../config';

const { validateAll } = window;

export default class ArticlesService {
  async getArticles(url = `${config.apiUrl}/articles`) {
    const response = await Axios.get(url);

    return response.data.data;
  }

  async getUserArticles(token, url = `${config.apiUrl}/user/articles`) {
    const response = await Axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data.data;
  }

  async deleteArticle(id, token) {
    await Axios.delete(`${config.apiUrl}/articles/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return true;
  }

  async getArticle(slug) {
    const response = await Axios.get(`${config.apiUrl}/article/${slug}`);

    return response.data.data;
  }

  async getArticleCategories() {
    const categories = JSON.parse(localStorage.getItem('categories'));

    if (categories) {
      return categories;
    }
    const response = await Axios.get(`${config.apiUrl}/categories`);
    localStorage.setItem('categories', JSON.stringify(response.data.categories));
    return response.data.categories;
  }

  createArticle = async (data, token) => {
    if (!data.image) {
      return Promise.reject([{
        message: 'The image is required.',
      }]);
    }

    try {
      const rules = {
        title: 'required',
        content: 'required',
        category: 'required',
      };

      const messages = {
        required: 'The {{field}} is required.',
      };

      await validateAll(data, rules, messages);

      const image = await this.uploadToCloudinary(data.image);
      const response = await Axios.post(`${config.apiUrl}/articles`, {
        title: data.title,
        content: data.content,
        category_id: data.category,
        imageUrl: image.secure_url,
      },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

      console.log(response);
      return (response.data);
    } catch (errors) {
      if (errors.response) {
        return Promise.reject(errors.response.data);
      }

      return Promise.reject(errors);
    }
  }

  updateArticle = async (data, article, token) => {
    let image;
    if (data.image) {
      image = await this.uploadToCloudinary(data.image);
    }

    try {
      const rules = {
        title: 'required',
        content: 'required',
        category: 'required',
      };

      const messages = {
        required: 'The {{field}} is required.',
      };

      await validateAll(data, rules, messages);

      const response = await Axios.put(`${config.apiUrl}/articles/${article.id}`, {
        title: data.title,
        content: data.content,
        category_id: data.category,
        imageUrl: image ? image.secure_url : article.imageUrl,
        comments: ['sample1', 'sample2', 'sample3'],
      },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

      return (response.data);
    } catch (errors) {
      if (errors.response) {
        return Promise.reject(errors.response.data);
      }

      return Promise.reject(errors);
    }
  }

  async uploadToCloudinary(image) {
    const form = new FormData();
    form.append('file', image);
    form.append('upload_preset', 'ml_default');

    const response = await Axios.post('https://api.cloudinary.com/v1_1/dszmuvlqz/image/upload', form);

    return response.data;
  }
}
