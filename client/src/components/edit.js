import React, {useState} from 'react';
import TemplateCreateEdit from './templateCreateEdit';

export default function Edit() {
  const [pageType, setPageType] = useState('Edit');

  // This following section will display the form that takes the input from the user.
  return (
    <div>
      <TemplateCreateEdit pageType={pageType}/>
    </div>
  );
}
