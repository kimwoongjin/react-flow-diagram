import React, { SetStateAction } from 'react';

interface UpdateFormProps {
  label: string;
  setLabel: React.Dispatch<SetStateAction<string>>;
  content: string;
  setContent: React.Dispatch<SetStateAction<string>>;
  isVisible: boolean;
}

const UpdateForm = ({ label, setLabel, content, setContent, isVisible }: UpdateFormProps) => {
  return (
    <>
      {isVisible && (
        <div className="update-node__controls">
          <p>Update</p>
          <input defaultValue={label} onChange={(e) => setLabel(e.target.value)} />
          <input type="textarea" defaultValue={content} onChange={(e) => setContent(e.target.value)} />
        </div>
      )}
    </>
  );
};

export default UpdateForm;
