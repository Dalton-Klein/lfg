import React, { useEffect, useState } from "react";
import HeaderComponent from "../nav/headerComponent";
import LoungePost from "../tiles/loungePost";
import CreatePost from "../forms/createPost";
import { getPosts } from "../../utils/rest";
import "./loungePage.scss";

export default function LoungePage() {
  let postsFeed: React.ReactNode = <li></li>;
  const [postsFromDataBase, setPostsFromDataBase] = useState([]);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setPostsFromDataBase(await getPosts(1, "blank"));
  };

  postsFeed = postsFromDataBase.map((post: any) => (
    <li style={{ listStyleType: "none" }} key={post.id}>
      <LoungePost {...post}></LoungePost>
    </li>
  ));

  return (
    <div>
      <HeaderComponent></HeaderComponent>
      <CreatePost fetchPosts={fetchPosts}></CreatePost>
      <div className="feed">{postsFeed}</div>
    </div>
  );
}
