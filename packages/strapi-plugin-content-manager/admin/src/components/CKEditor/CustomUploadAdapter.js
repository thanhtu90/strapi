import auth from 'strapi-helper-plugin/lib/src/utils/auth';
import axios from 'axios';

export default class CustomUploadAdapter {
  constructor(loader) {
    // Save Loader instance to update upload progress.
    this.loader = loader;

    // this.url = url;
  }

  upload() {
    return this.loader.file.then(file => {
      return new Promise((resolve, reject) => {
        const data = new FormData();
        const token = auth.getToken();
        data.append('files', file);

        for (var value of data.entries()) {
          console.log(value);
        }

        axios({
          url: `${strapi.backendURL}/upload`,
          method: 'post',
          data,
          headers: {
            'X-Forwarded-Host': 'strapi',
            'content-type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
          // withCredentials: true,
        })
          .then(res => {
            var resData = res.data[0];
            resData.default = resData.url;
            resolve(resData);
          })
          .catch(error => {
            reject(error);
          });
      });
    });
  }

  abort() {
    // Reject promise returned from upload() method.
  }
}
