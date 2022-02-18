import React, { useEffect, useRef, useState } from "react";
import "../../styling/createPost.scss";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import { tagsKey } from "../../utils/helperFunctions";
import { getCategoriesAndTopics } from "../../utils/rest";
import useOutsideClick from "../../utils/clickOutside";
const animatedComponents = makeAnimated();
//
export default function CreatePost() {
  const impactRef: any = useRef();
  let profileImage = "/assets/avatarIcon.png";

  const defaultFormData = {
    content: "0",
    tags: [],
    media: [],
  };
  const [tagOptions, setTagOptions] = useState([{ value: "", label: "" }]);
  const [isPosting, setIsPosting] = useState(false);
  const [formState, setFormState] = useState<any>(defaultFormData);

  useEffect(() => {
    setCategoriesAndTopics();
  }, []);

  const setCategoriesAndTopics = async () => {
    // let tagsFormatted = [];
    // const tags:any = await getCategoriesAndTopics();
    // console.log("tags?? ", tags);
    // tags.categories.forEach((category: PropertyKey) => {
    //   if (Object.prototype.hasOwnProperty.call(tagsKey, category)) {
    //     tagsFormatted.push({ value: `${category}`, label: `${category}` });
    //   }
    // }
    // setTagOptions(tagsFormatted);
    // console.log("looping? ", tagOptions);
  };

  const style = {
    control: (base: any) => ({
      ...base,
      // This line disable the blue border
      boxShadow: "none",
    }),
  };

  const handleFormChange = (event: React.FormEvent<HTMLFormElement>) => {
    const target = event.target as HTMLInputElement;
    const name = target.name;
    const value = target.value;
    let formCopy: any = { ...formState };
    switch (name) {
      case "content":
        formCopy.content = +value; //Because it's a number...
        break;
      case "tags":
        formCopy.tags = +value;
        break;
      default:
        return;
    }
    console.log("form state ", formCopy);
    setFormState(formCopy);
  };

  const formSubmitHandler = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    let stateCopy: any = { ...formState };
    console.log("What is result ", formState);
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
  };

  useOutsideClick(impactRef, () => {
    setIsPosting(false);
  });

  return (
    <div ref={impactRef}>
      <div className="form-container">
        <form className="form" onSubmit={formSubmitHandler} onChange={handleFormChange} spellCheck="false">
          <div className="form-bar">
            <img className="nav-overlay-img" onClick={() => {}} src={profileImage} alt="avatar Icon" />
            <input
              name="content"
              type="text"
              placeholder="Hello World! What's on your mind..."
              className="content-input"
              autoComplete="off"
              onFocus={() => {
                setIsPosting(true);
              }}
            ></input>
          </div>
          {isPosting ? (
            <div className="form-attachments-bar">
              <Select
                components={animatedComponents}
                options={tagOptions}
                isMulti
                className="react-select-container"
                classNamePrefix="react-select"
                placeholder="tags"
                isClearable={false}
                isSearchable={false}
                styles={style}
              />
              <button className="alt-button" type="button">
                photo {formState.media.length ? formState.media.length : ""}
              </button>
              <button className="post-button" type="submit">
                post
              </button>
            </div>
          ) : (
            <div></div>
          )}
        </form>

        <div className="form-divider"></div>
      </div>
    </div>
  );
}
