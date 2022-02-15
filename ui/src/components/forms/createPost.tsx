import React, { useEffect, useState } from 'react'
import '../../styling/createPost.scss';
import Select from 'react-select'
import makeAnimated from 'react-select/animated';
import { tagsKey } from '../../utils/helperFunctions';
const animatedComponents = makeAnimated();

export default function CreatePost() {

  let profileImage = '/assets/avatarIcon.png';

  const formData = {
    content: '0',
    tags: [],
    media: [],
  }

  const [formState, setFormState] = useState <any> (formData); 

  let tagOptions:any = [ ];
  useEffect(() => {
    for (const tag in tagsKey) {
      if (Object.prototype.hasOwnProperty.call(tagsKey, tag)) {
        tagOptions.push({ value: `${tag}`, label: `${tag}` },)
      }
    }
	}, []);

  const style = {
    control: (base: any) => ({
      ...base,
      // This line disable the blue border
      boxShadow: "none"
    })
  };

  const formSubmitHandler = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    let stateCopy : any = {...formState};
    console.log('What is result ', formState);
    // let offerToSend:any = {
    //   owner_name:state.user.user.username,
    //   owner: state.user.user.id,
    //   pokeName: pokeName.label,
    //   CP: stateCopy.CP,
    //   catchLocation: country.label,
    //   fastMove: fastMove.label,
    //   mainMove: mainMove.label,
    //   shiny: isShiny.label,
    //   price: stateCopy.price,
    //   listingType:tradeType.label,
    // }
    // const tradeSubmissionResult= await createTrade(offerToSend);
    // //check to make sure this is valid before continuing
    // if(tradeSubmissionResult.id) {
    //   console.log('RESULT  ',tradeSubmissionResult);
    //   history.push(`/trade/${tradeSubmissionResult.id}`);
    // } else {
    //   //display error message to the user in this block
    // }
    // setFormState(formData);
  }

  const handleFormChange = (event: React.FormEvent<HTMLFormElement>) => {
    const target = event.target as HTMLInputElement;
    const name = target.name;
    const value = target.value;
    let stateCopy : any = {...formState};
    switch(name) {
      case 'content':
        stateCopy.content = +value;     //Because it's a number...
        break;
      case 'tags':
        stateCopy.tags = +value;
        break;
      default:
        return
    }
    setFormState(stateCopy);
  }
  return (
    <div>
      <div className="form-container">
        <form 
          className="form"
          onSubmit={formSubmitHandler} 
          onChange={handleFormChange} spellCheck="false"
        >
          <div className="form-bar">
            <img
              className="nav-overlay-img"
              onClick={() => {}}
              src={profileImage}
              alt="avatar Icon"
            />
            <input name="content" type="text" placeholder="Hello World! What's on your mind..." className="content-input"></input>
          </div>
          <div className="form-attachments-bar">
            <Select 
              components={animatedComponents} 
              options={tagOptions} 
              isMulti 
              className='react-select-container' 
              classNamePrefix="react-select"
              placeholder="tags"
              isClearable={false}
              isSearchable={false}
              styles={style}
            />
            <button className="alt-button">
              media {formData.media.length ? formData.media.length : '' }
            </button>
            <button className='post-button'>
              post
            </button>
          </div>
        </form>
       
        <div className="form-divider"></div>
      </div>
    </div>
  )
}
