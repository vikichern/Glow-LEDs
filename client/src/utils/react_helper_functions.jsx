import React from "react";

import { setCurrentUser, logout, check_refresh_token } from "../actions/userActions";
import jwt_decode from "jwt-decode";
import setAuthToken from "../utils/setAuthToken";
import { API_Users } from ".";
import store from "../store";
import { GLButton } from "../shared/GlowLEDsComponents";

const delay = 2000; // anti-rebound for 500ms
let lastExecution = 0;

const refresh_login = async (access_token, refresh_token) => {
  const data = await API_Users.refresh_login(access_token, refresh_token);
  return data;
};

export const check_authentication = () => {
  if (localStorage.accessToken) {
    // Set auth token header auth
    const access_token = localStorage.accessToken;
    // const refresh_token = localStorage.refreshToken;
    setAuthToken(access_token);
    // Decode access_token and get user info and exp
    const decoded_access_token = jwt_decode(access_token);

    // userInfo = decoded_access_token.userInfo;
    // Set user and isAuthenticated
    store.dispatch(setCurrentUser(decoded_access_token));
    // Check for expired access_token
    const currentTime = Date.now() / 1000; // to get in milliseconds
    if (decoded_access_token.exp < currentTime) {
      if (decoded_access_token.refresh_token) {
        if (lastExecution + delay < Date.now()) {
          // execute my lines
          refresh_login(access_token, decoded_access_token.refresh_token)
            .then(res => {
              let token = res.data.access_token;

              localStorage.setItem("accessToken", token);
              setAuthToken(token);
              // Decode token and get user info and exp
              const decoded = jwt_decode(token);

              store.dispatch(setCurrentUser(decoded));
            })
            .catch(error => {
              // Logout user
              store.dispatch(logout(decoded_access_token.refresh_token));
              // Redirect to login
              window.location.href = "/account/login?redirect=" + window.location.pathname;
            });
          lastExecution = Date.now();
        }
      } else {
        // Logout user
        store.dispatch(logout(decoded_access_token.refresh_token));
        // Redirect to login
        window.location.href = "/account/login?redirect=" + window.location.pathname;
      }
    }
  }
};

export const mobile_check = () => {
  let check = false;
  (a => {
    if (
      /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(
        a
      ) ||
      /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
        a.substr(0, 4)
      )
    )
      check = true;
  })(navigator.userAgent || navigator.vendor || window.opera);
  return check;
};

export const browser_check = () => {
  var userAgent = navigator.userAgent.toLowerCase();
  if (userAgent.includes("chrome")) {
    //
    return "chrome";
  } else if (userAgent.includes("safari")) {
    //
    return "safari";
  }
};

export const product_page_sale_price_switch = (
  price = 0,
  sale_price = 0,
  previous_price = 0,
  sale_start_date,
  sale_end_date,
  cartItem,
  background
) => {
  // const color = cartItem ? { color: '#7e7e7e' } : { color: '#bf4444' };
  const color = cartItem ? { color: "#7e7e7e" } : { color: "#c5c5c5" };
  // const color = cartItem
  // 	? { color: '#7e7e7e' }

  // 	: background === 'light' ? { color: '#283166' } : { color: '#757b99' };
  if (previous_price) {
    return (
      <label className="fs-18px">
        <label>${price ? price.toFixed(2) : price}</label>
        <label> ({(100 * (1 - price / previous_price)).toFixed(2)}% Off) </label>
        <label>
          <del style={color}>
            <label className="" style={color}>
              ${previous_price ? previous_price.toFixed(2) : previous_price}
            </label>
          </del>{" "}
        </label>
      </label>
    );
  } else {
    if (sale_price !== 0 && today >= new Date(sale_start_date) && today <= new Date(sale_end_date)) {
      return (
        <label className="fs-18px">
          <label>${sale_price ? sale_price.toFixed(2) : sale_price}</label>
          <label> ({100 * (1 - sale_price / price).toFixed(2)}% Off) </label>
          <label>
            <del style={color}>
              <label className="" style={color}>
                ${price ? price.toFixed(2) : price}
              </label>
            </del>{" "}
          </label>
        </label>
      );
    } else {
      return <label className="fs-18px">${price ? price.toFixed(2) : price}</label>;
    }
  }
};
const determine_preorder = product => {
  if (product.preorder) {
    return true;
  } else {
    return false;
  }
};
export const sale_price_switch = (product, cartItem, background) => {
  const color = cartItem ? { color: "#7e7e7e" } : { color: "#c5c5c5" };
  if (product) {
    if (product.sale_price !== 0 && today >= new Date(product.sale_start_date) && today <= new Date(product.sale_end_date)) {
      return (
        <label className="fs-18px">
          {determine_preorder(product) ? "Preorder " : ""}
          <label>${product.sale_price ? product.sale_price.toFixed(2) : product.sale_price}</label>
          <label> ({(100 * (1 - product.sale_price / product.price)).toFixed(2)}% Off) </label>
          <label>
            <del style={color}>
              <label className="" style={color}>
                ${product.price ? product.price.toFixed(2) : product.price}
              </label>
            </del>{" "}
          </label>
        </label>
      );
    } else if (product.hasOwnProperty("previous_price") && product.previous_price) {
      return (
        <label className="fs-18px">
          {determine_preorder(product) ? "Preorder " : ""}
          <label>${product.price ? product.price.toFixed(2) : product.price}</label>
          <label> ({(100 * (1 - product.price / product.previous_price)).toFixed(2)}% Off) </label>
          <label>
            <del style={color}>
              <label className="" style={color}>
                ${product.previous_price ? product.previous_price.toFixed(2) : product.previous_price}
              </label>
            </del>{" "}
          </label>
        </label>
      );
    } else {
      return (
        <label className="fs-18px">
          {determine_preorder(product) ? "Preorder " : ""} ${product.price ? product.price.toFixed(2) : product.price}
        </label>
      );
    }
  }
};

export const email_sale_price_switch = (item, color) => {
  if (item.sale_price !== 0) {
    return (
      <label>
        {determine_preorder(item) ? "Preorder " : ""}
        {/* <label style={{ marginRight: '3px' }}>On Sale!</label> */}
        <del style={{ color: "#a03131" }}>
          <label style={{ color: color }}>${item.price && (item.price * item.qty).toFixed(2)}</label>
        </del>{" "}
        {"-->"} ${item.sale_price && (item.sale_price * item.qty).toFixed(2)}
      </label>
    );
  } else if (item.quantity === 0) {
    return (
      <label>
        {determine_preorder(item) ? "Preorder " : ""}
        <del style={{ color: "#a03131" }}>
          <label style={{ color: color, marginLeft: "7px" }}>${item.price && (item.price * item.qty).toFixed(2)}</label>
        </del>{" "}
        {"-->"} <label style={{ color: color, marginLeft: "7px" }}>Sold Out</label>
      </label>
    );
  } else {
    return (
      <label>
        {determine_preorder(item) ? "Preorder " : ""} ${item.price && (item.price * item.qty).toFixed(2)}
      </label>
    );
  }
};

export const cart_item_name = item => {
  return (
    <div className="">
      {item.secondary_product && (
        <div className="ai-c mb-20px jc-b w-100per">
          <label className="mv-0px mr-5px">{item.secondary_group_name ? item.secondary_group_name : "Cap Design"}: </label>
          <label className=" mv-0px">{determine_secondary_product_name(item.secondary_product_name, item)}</label>
        </div>
      )}
      {item.size !== "1 Sled" && item.color && (
        <div className="ai-c mb-20px jc-b w-100per">
          <label className="mv-0px mr-5px">{item.color_group_name ? item.color_group_name : "Color"}: </label>
          <div className="ai-c">
            <label className=" mv-0px">{item.color}</label>
            {item.color_code && <canvas className=" ml-5px w-60px h-20px br-7px" style={{ backgroundColor: item.color_code }} />}
          </div>
        </div>
      )}
      {item.size !== "1 Skin" && item.secondary_color && (
        <div className="ai-c mb-20px jc-b w-100per">
          <label className="mv-0px mr-5px">{item.secondary_color_group_name ? item.secondary_color_group_name : "Secondary Color"}: </label>
          <div className="ai-c">
            <label className=" mv-0px">{item.secondary_color}</label>
            {item.secondary_color_code && (
              <canvas className=" ml-5px w-60px h-20px br-7px" style={{ backgroundColor: item.secondary_color_code }} />
            )}
          </div>
        </div>
      )}
      {item.size && (
        <div className="ai-c mb-20px jc-b w-100per">
          <label className="mv-0px mr-5px">{item.option_group_name ? item.option_group_name : "Size"}: </label>
          <label className=" mv-0px">{item.size}</label>
        </div>
      )}
    </div>
  );
};
const included_for_option_name = ["diffusers"];
const determine_option_show_modifier = item => {
  return included_for_option_name.includes(item.category);
};

const qty = (item, show_qty) => {
  return show_qty && item.qty > 1 ? item.qty + "x" : "";
};
const color = item => {
  return item.color ? item.color + " " : "";
};

const size = (item, modifier) => {
  const option_name = item.option_group_name ? item.option_group_name.split(" ")[0] : "";
  return `${item.size && item.size !== 0 ? ` ${first_dash(item)} ${item.size}` : ""}
    ${determine_option_show_modifier(item) && option_name ? option_name : ""}`;
};

const secondary_color = item => {
  return `${item.secondary_color && item.secondary_color_product ? `${second_dash(item)} ${item.secondary_color}` : ""}`;
};
const secondary_color_name = item => {
  const secondary_color_name = item.secondary_color_group_name ? item.secondary_color_group_name.split(" ")[0] + "s" : "";
  if (item.category === "gloves") {
    return secondary_color_name;
  }
  if (item.category === "glowskinz") {
    if (!item.name.includes("Omniskinz")) {
      return secondary_color_name;
    }
  }
  if (item.category === "exo_diffusers") {
    return secondary_color_name;
  }
  if (item.category === "diffuser_caps") {
    return secondary_color_name;
  }
};
const secondary_product_name = item => {
  const secondary_color_name = item.secondary_group_name ? item.secondary_group_name : "";
  if (item.name === "Diffuser Caps + Adapters Starter Kit V4") {
    return secondary_color_name;
  }
};

const secondary_product = item => {
  return item.secondary_product && item.secondary_product_name && item.secondary_product_name.length > 0
    ? ` ${third_dash(item)} ${determine_secondary_product_name(item.secondary_product_name, item)}`
    : "";
};

const first_dash = item => {
  if (item.category === "gloves") {
    return "-";
  }
  if (item.category === "glowskinz") {
    return "-";
  }
  if (item.category === "diffusers") {
    return "-";
  }
  if (item.category === "exo_diffusers") {
    return "-";
  }
  if (item.category === "diffuser_caps") {
    return "-";
  }
  if (item.category === "glowframez") {
    return "-";
  }
  if (item.category === "batteries") {
    return "-";
  }
  return "";
};

const second_dash = item => {
  if (
    item.name === "Refresh Pack V1 (6 Pairs Supreme Gloves V1 + 120 Batteries)" ||
    item.name === "Refresh Pack V2 (6 Pairs Supreme Gloves V2 + 120 Batteries)"
  ) {
    return "-";
  }
  if (item.category === "glowskinz") {
    return "-";
  }
  if (item.category === "exo_diffusers") {
    return "-";
  }
  if (item.name === "Diffuser Caps + Adapters Starter Kit V4") {
    return "-";
  }

  return "";
};

const third_dash = item => {
  if (item.name.includes("Refresh")) {
    return "-";
  }
  if (item.name.includes("Sampler")) {
    return "-";
  }
  if (item.name.includes("Nanoskinz")) {
    return "-";
  }
  if (item.name.includes("Clip")) {
    return "-";
  }
  if (item.category === "exo_diffusers") {
    return "-";
  }

  if (item.category === "decals") {
    return "-";
  }
  if (item.name === "Diffuser Caps + Adapters Starter Kit V4") {
    return "-";
  }
  if (item.category === "glowskinz") {
    if (!item.name.includes("Omniskinz")) {
      return "-";
    }
  }

  return "";
};

const today = new Date();

export const determine_product_name = (item, show_qty) => {
  return (
    <div>
      {qty(item, show_qty)} {color(item)} {item.name}
      {size(item)}
      {secondary_color(item)} {secondary_color_name(item)}
      {secondary_product(item)} {secondary_product_name(item)}
    </div>
  );
};

export const determine_product_name_string = (item, show_qty) => {
  return `${qty(item, show_qty) || ""} ${color(item) || ""} ${item.name}
      ${size(item) || ""}
      ${secondary_color(item) || ""} ${secondary_color_name(item) || ""}
      ${secondary_product(item) || ""} ${secondary_product_name(item) || ""}`;
};

export const determine_secondary_product_name = (name, item) => {
  const { category, subcategory } = item;
  if (category === "diffuser_caps") {
    return name.split(" ")[0];
  } else if (category === "decals" && name.split(" ")[name.split(" ").length - 4] === "Outline") {
    return name.replace(" Outline + Batman Decals", "");
  } else if (category === "decals" && name.split(" ")[name.split(" ").length - 2] === "Batman") {
    return name.replace(" Batman Decals", "");
  } else if (subcategory === "refresh" && name.includes("Bulk")) {
    return name.split(" ")[1].trim();
  } else if (name.includes("Capez")) {
    return name.replace(" Capez", "");
  } else {
    return name.includes("-") ? name.split("-")[1].trim() : name;
  }
};

export const determine_option_product_name = (name, category, subcategory) => {
  //
  try {
    if (name) {
      if (name.split("-")[0].trim() === "Supreme Gloves") {
        return name.split("-")[1].trim();
      } else if (name.split("-")[0].trim() === "Diffuser") {
        return name.split("-")[1].trim();
      } else {
        return name;
      }
    }
  } catch (error) {
    return name;
  }
};

export const determine_product_name_title = (item, show_qty) => {
  //
  //
  return (
    <div>
      {!item.secondary_product_name && item.color && item.color + " "} {item.name} {size(item)}
      {item.secondary_product_name && " - " + item.color + " " + item.secondary_product_name.slice(0, -14)}
      {show_qty && item.qty > 1 && item.qty + "x"}
    </div>
  );
};

export const determine_product_name_display = product => {
  //
  //
  const option = product.option_products.find(option => option.default_option === true);
  //
  if (product.category === "diffusers" || product.category === "exo_diffusers" || product.category === "diffuser_caps") {
    return <div>{product.name} - 10</div>;
  } else if (product.category === "decals") {
    return <div>{product.name} - 11</div>;
  } else if (product.name === "Nova Clip") {
    return <div>{product.name} - 1</div>;
  } else {
    return (
      <div>
        {product.name}{" "}
        {(product.category === "batteries" || product.category === "glowskinz" || product.category === "glowframez") &&
          option &&
          option.size &&
          `- ${option.size}`}
      </div>
    );
  }
};

export const list_display = (list_items, set_items) => {
  return (
    <div>
      <div className="jc-b">
        <div>
          {list_items &&
            list_items.map((item, index) => {
              return (
                <div className="promo_code mv-1rem row jc-b max-w-55rem w-100per" key={index}>
                  <div>
                    <GLButton variant="icon" onClick={e => remove_list_item(index, e, set_items)} aria-label="Delete">
                      <i className="fas fa-times mr-5px" />
                    </GLButton>
                    {item.name}
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export const option_list = (item_list, list_items, set_items, list_name) => {
  return (
    <div className="jc-b">
      <li>
        <label htmlFor={list_name.toLowerCase()}>{list_name}</label>
        <div className="ai-c h-25px mv-15px jc-c">
          <div className="custom-select">
            <select className="qty_select_dropdown" onChange={e => add_item(e, set_items, list_items)}>
              <option key={1} defaultValue="">
                ---Choose {list_name}---
              </option>
              {item_list.map((item, index) => (
                <option key={index} value={JSON.stringify(item)}>
                  {item.name}
                </option>
              ))}
            </select>
            <span className="custom-arrow" />
          </div>
        </div>
        {list_display(list_items, set_items)}
      </li>
    </div>
  );
};

export const remove_list_item = (item_index, e, set_items) => {
  e.preventDefault();
  set_items(items =>
    items.filter((item, index) => {
      return item_index !== index;
    })
  );
};

export const add_item = (e, set_items, list_items) => {
  e.preventDefault();
  const item_object = JSON.parse(e.target.value);
  if (list_items) {
    //
    set_items(items => [...items, item_object]);
  } else {
    //
    set_items([item_object]);
  }
};

export const order_status_steps = (order, status) => {
  status = status.toLowerCase();
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        maxWidth: "58rem",
        width: "100%",
        margin: "1rem auto"
      }}
    >
      <div
        style={
          order
            ? {
                borderTop: ".3rem white solid",
                color: "$font_color",
                flex: "1 1",
                paddingTop: "1rem",
                textAlign: "center"
              }
            : {
                borderTop: ".3rem #c0c0c0 solid",
                color: "$font_color",
                flex: "1 1",
                paddingTop: "1rem",
                textAlign: "center"
              }
        }
      >
        <div style={{ fontSize: "16px" }}>Ordered</div>
      </div>
      <div
        style={
          order.isPaid
            ? {
                borderTop: ".3rem white solid",
                color: "$font_color",
                flex: "1 1",
                paddingTop: "1rem",
                textAlign: "center"
              }
            : {
                borderTop: ".3rem #c0c0c0 solid",
                color: "$font_color",
                flex: "1 1",
                paddingTop: "1rem",
                textAlign: "center"
              }
        }
      >
        <div style={{ fontSize: "16px" }}>Paid </div>
      </div>
      <div
        style={
          status === "manufactured" || status === "packaged" || status === "shipped"
            ? {
                borderTop: ".3rem white solid",
                color: "$font_color",
                flex: "1 1",
                paddingTop: "1rem",
                textAlign: "center"
              }
            : {
                borderTop: ".3rem #c0c0c0 solid",
                color: "$font_color",
                flex: "1 1",
                paddingTop: "1rem",
                textAlign: "center"
              }
        }
      >
        <div style={{ fontSize: "16px" }}>Manufactured </div>
      </div>
      <div
        style={
          status === "packaged" || status === "shipped"
            ? {
                borderTop: ".3rem white solid",
                color: "$font_color",
                flex: "1 1",
                paddingTop: "1rem",
                textAlign: "center"
              }
            : {
                borderTop: ".3rem #c0c0c0 solid",
                color: "$font_color",
                flex: "1 1",
                paddingTop: "1rem",
                textAlign: "center"
              }
        }
      >
        <div style={{ fontSize: "16px" }}>Packaged </div>
      </div>
      <div
        style={
          status === "shipped"
            ? {
                borderTop: ".3rem white solid",
                color: "$font_color",
                flex: "1 1",
                paddingTop: "1rem",
                textAlign: "center"
              }
            : {
                borderTop: ".3rem #c0c0c0 solid",
                color: "$font_color",
                flex: "1 1",
                paddingTop: "1rem",
                textAlign: "center"
              }
        }
      >
        <div style={{ fontSize: "16px" }}>Shipped</div>
      </div>
      {/* <div
        style={
          status === 'delivered' ? (
            {
              borderTop: '.3rem white solid',
              color: '$font_color',
              flex: '1 1',
              paddingTop: '1rem',
              textAlign: 'center'
            }
          ) : (
            {
              borderTop: '.3rem #c0c0c0 solid',
              color: '$font_color',
              flex: '1 1',
              paddingTop: '1rem',
              textAlign: 'center'
            }
          )
        }
      >
        <div>Delivered</div>
      </div> */}
    </div>
  );
};
