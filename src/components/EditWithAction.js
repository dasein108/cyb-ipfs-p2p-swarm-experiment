import { useState } from "react";

const EditWithAction = ({ title, buttonTitle, callback }) => {
  const [content, setContent] = useState("");
  const onClick = async () => {
    callback(content);
    setContent("");
  };
  return (
    <>
      <div className="">
        {/* measure */}
        <label className="f6 b db mb2">{title}</label>
        <div className="button-wrap">
          <input
            className="input-reset ba b--black-20 pa2 mb2 db w-100"
            // w-70
            type="text"
            value={content}
            onChange={(event) => setContent(event.target.value)}
          />
          <button className="action" onClick={onClick}>
            {buttonTitle}
          </button>
        </div>
      </div>
    </>
  );
};

export default EditWithAction;
