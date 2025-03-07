import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { saveUser } from "../../../actions/userActions";
import { API_Emails, API_Promos } from "../../../utils";
import { validate_email } from "../../../utils/validations";
import { GLButton } from "../../../shared/GlowLEDsComponents";
import useWindowDimensions from "../../../shared/Hooks/windowDimensions";

const EmailModal = props => {
  const [email, set_email] = useState("");
  const [complete, set_complete] = useState(false);
  const dispatch = useDispatch();
  const [email_validations, setEmailValidations] = useState("");

  const date = new Date();

  const today = date.toISOString();

  const submitHandler = async e => {
    e.preventDefault();
    const data = { email };
    const request = await validate_email(data);

    setEmailValidations(request.errors.email);
    if (request.isValid) {
      dispatch(
        saveUser({
          _id: null,
          first_name: "",
          last_name: "",
          email,
          affiliate: null,
          is_affiliated: false,
          isVerified: true,
          isAdmin: false,
          email_subscription: true,
          shipping: {}
        })
      );
      const { data: promo } = await API_Promos.create_one_time_use_code();
      const { data } = await API_Emails.send_email_subscription(email, promo.promo_code);
      localStorage.setItem("popup", JSON.stringify({ date: today, email: true }));
      set_complete(true);

      setTimeout(() => {
        props.set_show_modal(false);
      }, 5000);
    }
  };

  const { width, height } = useWindowDimensions();
  return (
    <div
      id="myModal"
      style={{
        display: props.show_modal ? "block" : "none"
      }}
      className={`modal-floating ${complete ? "max-h-325px" : "max-h-300px"} max-w-500px fade_in ${width < 535 && "mh-auto-20px"}`}
    >
      <span
        className="pos-abs right-15px top-10px close"
        onClick={() => {
          props.set_show_modal(false);
          // localStorage.setItem('popup', today);
          localStorage.setItem("popup", JSON.stringify({ date: today, email: false }));
        }}
      >
        &times;
      </span>
      {complete ? (
        <ul className="column jc-b ai-c p-20px">
          <li className="mb-2rem">
            <label className={`title_font ${width < 535 ? "fs-20px lh-30px" : "fs-28px lh-40px"} ta-c jc-c `}>
              Thank you for Signing Up!
            </label>
          </li>

          <li>
            {/* <p className={`title_font ${width < 535 ? 'fs-16px lh-30px' : 'fs-20px lh-40px'} ta-c jc-c `}>
							Shine Brighter than ever
						</p> */}
            <img src="https://thumbs2.imgbox.com/b1/08/2Dnle6TI_t.jpeg" alt="" className="w-100per h-auto br-20px max-w-250px" />
          </li>
          <li>
            <p className="p_descriptions fs-16px ta-c jc-c">Check your email for your 10% off Promo Code!</p>
          </li>
        </ul>
      ) : (
        <form onSubmit={submitHandler} className="modal-content-floating ">
          <div className="h-100per jc-b column">
            <label className="p_descriptions fs-16px ta-c jc-c">Come Into the Light</label>
            <label className={`title_font ${width < 535 ? "fs-20px lh-30px" : "fs-30px lh-40px"} ta-c jc-c `}>
              Get 10% Off Your Next Order
            </label>
            <label className="p_descriptions fs-16px ta-c jc-c">It's Brighter Over Here</label>
            <ul>
              <li>
                <input
                  type="email"
                  name="email"
                  id="email"
                  placeholder="Email"
                  className="w-100per"
                  onChange={e => set_email(e.target.value)}
                />
              </li>
              <li className="mt-10px">
                <label className="validation_text" style={{ textAlign: "center" }}>
                  {email_validations}
                </label>
              </li>
              <li>
                <GLButton type="submit" variant="inherit" className="w-100per mt-2rem bg-white ft-primary title_font bob">
                  Join Us
                </GLButton>
              </li>
            </ul>
          </div>
        </form>
      )}
    </div>
  );
};

export default EmailModal;
