import Noty from 'noty';

export default class NotficationsService {
  success(message) {
    (new Noty({
      text: message,
      type: 'success',
    })).show();
  }

  error(message) {
    (new Noty({
      text: message,
      type: 'error',
    })).show();
  }
}
