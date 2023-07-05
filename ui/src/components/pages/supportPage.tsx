import FooterComponent from "../nav/footerComponent";
import "./supportPage.scss";
import BannerTitle from "../nav/banner-title";
import React, { useState } from "react";
import BlogTile from "./blog/blogTile";
import { SelectButton } from "primereact/selectbutton";

export default function SupportPage() {
  const navOptions: string[] = ["my tickets", "open ticket"];
  const [value, setValue] = useState<string>(navOptions[0]);

  const toggleNav = (e: any) => {
    setValue(e.value);
  };

  return (
    <div className="support-master">
      <div className="support-master-container">
        <BannerTitle
          title={"support"}
          imageLink={"https://res.cloudinary.com/kultured-dev/image/upload/v1663566897/rust-tile-image_uaygce.png"}
        ></BannerTitle>
        {/* Welcome */}
        <div className="support-content-container">
          <SelectButton value={value} onChange={(e) => toggleNav(e)} options={navOptions} />
          {value === "my tickets" ? (
            <BlogTile
              routerLink="/ticket/1"
              title="bug when adding friend"
              updated_on="07/04/2023"
              preview="We are giving out $20 bundles of in game items of your choosing..."
            ></BlogTile>
          ) : (
            <div>open ticket</div>
          )}
        </div>
      </div>
      <FooterComponent></FooterComponent>
    </div>
  );
}
