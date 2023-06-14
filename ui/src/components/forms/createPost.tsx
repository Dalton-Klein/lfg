import React, { useEffect, useRef, useState } from "react";
import ReactTooltip from "react-tooltip";
import "./createPost.scss";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import { getCategoriesAndTopics, createPost } from "../../utils/rest";
import useOutsideClick from "../../utils/clickOutside";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { postErrorAnim } from "../../utils/animations";
const animatedComponents = makeAnimated();
//
export default function CreatePost({ fetchPosts }: any) {
  const state = useSelector((state: RootState) => state);
  const impactRef: any = useRef();
  let profileImage = "https://res.cloudinary.com/kultured-dev/image/upload/v1625617920/defaultAvatar_aeibqq.png";

  const defaultFormData: any = {
    content: "",
    category: 0,
    topics: [],
    media: [],
  };
  const [formError, setFormError] = useState(true);
  const [errorMessage, setErrorMessage] = useState("must have category");
  const [categoryOptions, setCategoryOptions] = useState([{ value: "", label: "" }]);
  const [topicOptions, setTopicOptions] = useState([{ value: "", label: "" }]);
  const [isPosting, setIsPosting] = useState(false);
  const [formContent, setFormContent] = useState(defaultFormData.content);
  const [formCategory, setFormCategory] = useState(defaultFormData.category);
  const [formTopics, setFormTopics] = useState<[{ id: number }]>(defaultFormData.topics);
  const [formMedia, setFormMedia] = useState(defaultFormData.media);
  let isPerformingAnim = false;

  useEffect(() => {
    setCategoriesAndTopics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    ReactTooltip.rebuild();
  }, [isPosting]);

  const performingAnim = async (legthOfAnim: number) => {
    isPerformingAnim = true;
    setTimeout(function () {
      isPerformingAnim = false;
    }, legthOfAnim);
  };

  const clearFormError = () => {
    setFormError(false);
    setErrorMessage("");
  };

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
  };

  const style = {
    control: (base: any) => ({
      ...base,
      // This line disables the default blue border in react-select
      boxShadow: "none",
    }),
  };

  const contentChange = (event: any) => {
    const target = event.target as HTMLInputElement;
    setFormContent(target.value);
    validateForm();
  };

  const categoryChange = (option: any) => {
    setFormCategory(option.id);
    validateForm();
  };

  const topicChange = (options: any) => {
    const formattedTopics: any = options.map((option: { id: number }) => option.id);
    setFormTopics(formattedTopics);
    validateForm();
  };

  const validateForm = () => {
    if (formCategory === 0) {
      setFormError(true);
      setErrorMessage("must select category");
    } else if (formContent === "") {
      setFormError(true);
      setErrorMessage("post must have content");
    }
    clearFormError();
  };

  const formSubmitHandler = async (event: any) => {
    event.preventDefault();
    console.log("What is result ");
    if (formError) {
      if (!isPerformingAnim) {
        performingAnim(1000);
        postErrorAnim();
        return;
      }
    }
    let postToPublish: any = {
      owner: state.user.user.id,
      content: formContent,
      category: formCategory,
      topics: formTopics,
      // media: stateCopy.media,
    };
    console.log("about to publish: ", postToPublish);
    const postSubmissionResult: any = await createPost(postToPublish);
    //check to make sure this is valid before continuing
    console.log("RESULT  ", postSubmissionResult);
    if (postSubmissionResult[1] == 1) {
      fetchPosts();
    } else {
      //display error message to the user in this block
    }
  };

  useOutsideClick(impactRef, () => {
    setIsPosting(false);
  });

  return (
    <div ref={impactRef}>
      <div className="form-container">
        <form className="form" onSubmit={formSubmitHandler} spellCheck="false">
          <div className="form-bar">
            <img className="nav-overlay-img" onClick={() => {}} src={profileImage} alt="my avatar" />
            <input
              name="content"
              type="text"
              placeholder="Hello World! What's on your mind..."
              className="content-input"
              autoComplete="off"
              onFocus={() => {
                setIsPosting(true);
              }}
              value={formContent}
              onChange={contentChange}
            ></input>
          </div>
          {isPosting ? (
            <div className="form-attachments-bar">
              {/* <Select
                name="category"
                components={animatedComponents}
                options={categoryOptions}
                className="react-select-container"
                classNamePrefix="react-select"
                placeholder="category"
                isClearable={false}
                isSearchable={false}
                styles={style}
                onChange={categoryChange}
              /> */}
              <button className="alt-button" type="button">
                photo {formMedia.length ? formMedia.length : ""}
              </button>
              {formError ? (
                <button className="disabled-button" type="submit" data-tip data-for="post-button-tooltip">
                  post
                </button>
              ) : (
                <button className="post-button" type="submit">
                  post
                </button>
              )}
            </div>
          ) : (
            <div></div>
          )}
        </form>

        <div className="form-divider"></div>
      </div>

      <ReactTooltip id="post-button-tooltip" place="top" effect="float">
        <span>{errorMessage}</span>
      </ReactTooltip>
    </div>
  );
}
