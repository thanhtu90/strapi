import React from 'react';
import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import auth from 'strapi-helper-plugin/lib/src/utils/auth';
import CustomUploadAdapter from './CustomUploadAdapter';

class App extends React.Component {
  onChange = (event, editor) => {
    const data = editor.getData();
    this.props.onChange({
      target: {
        name: this.props.name,
        type: this.props.type,
        value: data,
      },
    });
  };

  render() {
    const token = auth.getToken();
    return (
      <div className="App">
        <CKEditor
          editor={ClassicEditor}
          onInit={editor => {
            editor.plugins.get('FileRepository').createUploadAdapter = function(
              loader
            ) {
              return new CustomUploadAdapter(loader);
            };
          }}
          onChange={this.onChange}
          //   ref={this.props.setRef}
          //   {...this.props}
          data={this.props.value}
          config={{
            ckfinder: {
              // Upload the images to the server using the CKFinder QuickUpload command.
              uploadUrl: `${strapi.backendURL}/upload`,
              headers: {
                'Content-Type': 'application/json',
                'X-Forwarded-Host': 'strapi',
                Authorization: `Bearer ${token}`,
              },
            },
          }}
        />
      </div>
    );
  }
}

App.defaultProps = {
  setRef: () => {},
  onChange: () => {},
  name: '',
  type: '',
  value: '',
};

export default App;
