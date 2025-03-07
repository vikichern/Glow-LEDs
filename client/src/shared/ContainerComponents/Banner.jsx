import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useWindowDimensions from "../Hooks/windowDimensions";
import { API_Content } from "../../utils";
import { GLButton } from "../GlowLEDsComponents";

const Banner = props => {
  const { height, width } = useWindowDimensions();
  const [content, set_content] = useState([]);

  useEffect(() => {
    let clean = true;
    if (clean) {
      get_display_content();
    }
    return () => (clean = false);
  }, []);

  const get_display_content = async () => {
    const { data } = await API_Content.get_display_content();

    if (data) {
      set_content(data[0]);
    }
  };

  return (
    <div className="banner">
      <div className="max-w-1500px m-auto jc-b">
        {content && content.banner && (
          <div className={`row ${width < 600 ? "m-auto" : "ml-10px"}`}>
            {content.banner.button && content.banner.link && (
              <Link to={content.banner.link && content.banner.link}>
                <GLButton className="banner-button">{content.banner.label}</GLButton>
              </Link>
            )}
          </div>
        )}
        {/* </div> */}
        {width > 600 && (
          <div className="row mt-3px social_media_banner">
            <div className="ml-10px">
              <a
                href="https://www.facebook.com/Glow-LEDscom-100365571740684"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
              >
                <i className="fab fa-facebook zoom" />
              </a>
            </div>
            <div className="ml-10px">
              <a href="https://www.instagram.com/glow_leds/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <i className="fab fa-instagram zoom" />
              </a>
            </div>
            <div className="ml-10px">
              <a href="https://www.tiktok.com/@glow_leds?lang=en" target="_blank" rel="noopener noreferrer" aria-label="TikTok">
                <i className="fab fa-tiktok zoom" />
              </a>
            </div>
            <div className="mh-10px">
              <a
                href="https://www.youtube.com/channel/UCm_gDyTIy7d0oR9LeowPkYw?sub_confirmation=1"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Youtube"
              >
                <i className="fab fa-youtube zoom" />
              </a>
            </div>
            <div className="">
              <a href="https://soundcloud.com/ntre/tracks" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                <i className="fab fa-soundcloud" />
              </a>
            </div>
            <div className="mh-10px mr-10px">
              <a href="https://twitter.com/glow_leds" target="_blank" rel="noopener noreferrer" aria-label="Soundcloud">
                <i className="fab fa-twitter zoom" />
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Banner;
