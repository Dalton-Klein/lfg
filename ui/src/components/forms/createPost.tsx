import React, { useEffect, useRef, useState } from "react";
import "../../styling/createPost.scss";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import { getCategoriesAndTopics } from "../../utils/rest";
import useOutsideClick from "../../utils/clickOutside";
const animatedComponents = makeAnimated();
//
export default function CreatePost() {
  const impactRef: any = useRef();
  let profileImage = "/assets/avatarIcon.png";

  const defaultFormData = {
    content: "",
    category: 0,
    topics: [],
    media: [],
  };
  const [categoryOptions, setCategoryOptions] = useState([{ value: "", label: "" }]);
  const [topicOptions, setTopicOptions] = useState([{ value: "", label: "" }]);
  const [isPosting, setIsPosting] = useState(false);
  const [formState, setFormState] = useState<any>(defaultFormData);

  useEffect(() => {
    setCategoriesAndTopics();
  }, []);

  const setCategoriesAndTopics = async () => {
    let categoriesFormatted: any = [];
    let topicsFormatted: any = [];
    const categoriesAndTopics: any = await getCategoriesAndTopics();
    const categories = categoriesAndTopics.categories;
    categories.forEach((category: { id: number; name: any }) => {
      categoriesFormatted.push({ id: category.id, value: `${category.name}`, label: `${category.name}` });
    });
    const topics = categoriesAndTopics.topics;
    topics.forEach((topic: { id: number; name: any }) => {
      topicsFormatted.push({ id: topic.id, value: `${topic.name}`, label: `${topic.name}` });
    });
    setCategoryOptions(categoriesFormatted);
    setTopicOptions(topicsFormatted);
    console.log("looping? ", categoryOptions);
  };

  const style = {
    control: (base: any) => ({
      ...base,
      // This line disables the default blue border
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
      case "categories":
        formCopy.categories = +value;
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
                options={categoryOptions}
                className="react-select-container"
                classNamePrefix="react-select"
                placeholder="category"
                isClearable={false}
                isSearchable={false}
                styles={style}
              />
              <Select
                components={animatedComponents}
                options={topicOptions}
                isMulti
                className="react-select-container"
                classNamePrefix="react-select"
                placeholder="topics"
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
