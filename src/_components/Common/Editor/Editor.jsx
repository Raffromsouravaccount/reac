import React, { Component } from 'react';
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { removeTags } from './../CommonFunction/CommonFuntion'

const modules = {
  toolbar: [
    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
    [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
    ['link']
  ],
  clipboard: {
    matchVisual: false,
  }
}
const Bold = Quill.import("formats/bold");
Bold.tagName = 'b';
Quill.register(Bold, true);

const Italic = Quill.import("formats/italic");
Italic.tagName = 'i';
Quill.register(Italic, true);

const underline = Quill.import("formats/underline");
underline.tagName = 'u';
Quill.register(underline, true);



const formats = [
  'bold', 'italic', 'underline', 'strike', 'blockquote',
  'list', 'bullet', 'indent',
  'link'
]
class Editor extends Component {

  render() {
    let { className, id, placeholder, value, ref, moduleOptions, onBlur = () => { }, formatOptions, onEditorValueChange,
      disabled, error, errorMsg, charCountLimit, maxLength } = this.props;

    // remove tags from value
    const charCount = removeTags(value).length;

    return (
      <div className={`${className} ${(charCountLimit && maxLength)? `pos-rel char-count-limit char-editor ${error?
        'char-limit-error': (charCount > charCountLimit) ? 'char-limit-warning': ''}`: ''}`} onBlur={onBlur}>
        <ReactQuill
          id={id}
          ref={ref || ""}
          modules={moduleOptions || modules}
          formats={formatOptions || formats}
          placeholder={placeholder || ""}
          className={error ? 'error-border' : ''}
          value={value}
          readOnly={disabled}
          onChange={(html, data, source) => {
            if (source == 'user')
              onEditorValueChange(removeTags(html)== ""? "": html);
          }}
        />
        {error &&
          <span className="error-msg">{errorMsg}</span>
        }
        {charCountLimit && maxLength &&
          <div className={`char-count ${charCount > maxLength ? 'num-error' : (charCount > charCountLimit) ?
            'num-warning' : ''}`} >
            <span>{charCount}</span>/<span>{maxLength}</span>
          </div>
        }
      </div>
    )
  }
}

export default React.memo(Editor);
