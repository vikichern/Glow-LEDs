import React, { useEffect, useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { listPaychecks, deletePaycheck, savePaycheck } from "../../../actions/paycheckActions";
import { Link } from "react-router-dom";
import { Loading, Notification } from "../../../components/UtilityComponents";
import { Helmet } from "react-helmet";
import { Search, Sort } from "../../../components/SpecialtyComponents";
import { dates_in_year, format_date, removeDuplicates, toCapitalize } from "../../../utils/helper_functions";
import { listAffiliates } from "../../../actions/affiliateActions";
import { API_Orders, API_Paychecks, API_Promos } from "../../../utils";
import {
  affiliate_revenue_upload,
  promoter_revenue_upload,
  sponsor_revenue_upload,
  team_revenue_upload,
  top_code_usage_upload,
  top_earner_upload
} from "../../../utils/google_sheets_upload";
import { listTeams } from "../../../actions/teamActions";
import { listOrders } from "../../../actions/orderActions";
import { GLButton } from "../../../components/GlowLEDsComponents";

const PaychecksPage = props => {
  const [search, set_search] = useState("");
  const [sort, setSortOrder] = useState("");
  const [message_note, set_message_note] = useState([]);
  const [loading_paychecks, set_loading_paychecks] = useState(false);
  const [loading_checkboxes, set_loading_checkboxes] = useState(false);
  const [create_paychecks, set_create_paychecks] = useState(false);
  const [update_google_sheets, set_update_google_sheets] = useState(false);

  const category = props.match.params.category ? props.match.params.category : "";
  const paycheckList = useSelector(state => state.paycheckList);
  const { loading, paychecks, message, error } = paycheckList;

  const paycheckSave = useSelector(state => state.paycheckSave);
  const { success: successSave } = paycheckSave;

  const paycheckDelete = useSelector(state => state.paycheckDelete);
  const { success: successDelete } = paycheckDelete;
  const dispatch = useDispatch();

  const affiliateList = useSelector(state => state.affiliateList);
  const { affiliates } = affiliateList;

  const teamList = useSelector(state => state.teamList);
  const { teams } = teamList;
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const date = new Date();
  const previous_month_number = date.getMonth() - 1 === -1 ? 11 : date.getMonth();
  const [month, set_month] = useState(months[date.getMonth()]);
  // const [previous_month, set_previous_month] = useState(months[previous_month_number]);
  const [year, set_year] = useState(date.getFullYear());

  setTimeout(() => {
    set_loading_checkboxes(false);
  }, 500);

  // useEffect(() => {
  // 	let clean = true;
  // 	if (clean) {
  // 		const month = months[date.getMonth()];
  // 		const year = months[date.getFullYear()];
  // 		set_month(month);
  // 		set_month(year);
  // 	}
  // 	return () => {};
  // }, []);

  useEffect(() => {
    let clean = true;
    if (clean) {
      dispatch(listPaychecks({}));
      dispatch(listAffiliates({}));
      dispatch(listTeams({}));
      dispatch(listOrders({}));
    }
    return () => (clean = false);
  }, [successSave, successDelete, dispatch]);

  useEffect(() => {
    let clean = true;
    if (clean) {
      if (paychecks) {
        set_message_note(message);
      }
    }
    return () => {};
  }, [paychecks]);

  const submitHandler = e => {
    e.preventDefault();
    dispatch(listPaychecks({ category, search, sort }));
  };

  const sortHandler = e => {
    setSortOrder(e.target.value);
    dispatch(listPaychecks({ category, search, sort: e.target.value }));
  };

  useEffect(() => {
    let clean = true;
    if (clean) {
      dispatch(listPaychecks({ category, search, sort }));
    }
    return () => (clean = false);
  }, [dispatch, category, search, sort]);
  const deleteHandler = paycheck => {
    dispatch(deletePaycheck(paycheck._id));
  };

  const today = date.toISOString();

  const mark_paid = paycheck => {
    dispatch(
      savePaycheck({
        ...paycheck,
        paid: true,
        paid_at: format_date(today)
      })
    );
    dispatch(listPaychecks({}));
  };
  const duplicate_paycheck = paycheck => {
    dispatch(
      savePaycheck({
        amount: paycheck.amount,
        affiliate: paycheck.affiliate,
        team: paycheck.team,
        venmo: paycheck.venmo,
        receipt: paycheck.receipt,
        paid: true,
        paid_at: format_date(today)
      })
    );
    dispatch(listPaychecks({}));
  };

  const sort_options = ["Newest", "Artist Name", "Facebook Name", "Instagram Handle", "Sponsor", "Promoter"];

  const colors = [
    { name: "Paid", color: "#3e4c6d" },
    { name: "Not Paid", color: "#6f3c3c" }
  ];

  const determine_color = paycheck => {
    let result = "";
    if (paycheck.paid) {
      result = colors[0].color;
    }
    if (!paycheck.paid) {
      result = colors[1].color;
    }
    return result;
  };

  const create_affiliate_paychecks = async () => {
    set_loading_paychecks(true);

    if (create_paychecks) {
      await API_Paychecks.create_affiliate_paychecks_a("promoter", year, month.toLowerCase());
      await API_Paychecks.create_affiliate_paychecks_a("sponsor", year, month.toLowerCase());
      await API_Paychecks.create_affiliate_paychecks_a("team", year, month.toLowerCase());
    }
    if (update_google_sheets) {
      get_affiliate_data();
      // set_message_note("paychecks");
      // await affiliate_revenue_upload("promoter", year, month.toLowerCase(), "1vy1OKH0P96cDkjuq-_yBT56CA1yQRMY3XZ2kgN95Spg");
      // set_message_note("promoter");
      // await affiliate_revenue_upload("sponsor", year, month.toLowerCase(), "1nxYhdgGqme0tSvOrYeb6oU9RIOLeA2aik3-K4H1dRpA");
      // set_message_note("sponsor");
      // await affiliate_revenue_upload("team", year, month.toLowerCase(), "1OmtRqSVEBCZCamz1qPceXW8CPfuwvWwGxIiu1YzMtMI");
      // set_message_note("team");
      // await top_earner_upload(year, month.toLowerCase());
      // set_message_note("top_earner_upload");
      // await top_code_usage_upload(year, month.toLowerCase());
      // set_message_note("top_code_usage_upload");
    }

    // await API_Promos.update_discount(year, month.toLowerCase());
    // set_message_note("update_discount");
    // dispatch(listPaychecks({}));
  };

  const get_affiliate_data = async () => {
    set_loading_paychecks(true);
    const { data: last_months_rows } = await API_Orders.all_affiliate_code_usage_orders_a({
      year,
      month: month.toLowerCase(),
      position: ""
    });
    // const { data: total_rows } = await API_Orders.all_affiliate_code_usage_orders_a({
    //   year: "",
    //   month: month.toLowerCase(),
    //   position: ""
    // });

    // const sorted_total_rows = total_rows.affiliates.sort((a, b) => (parseFloat(a.Uses) > parseFloat(b.Uses) ? -1 : 1));

    // const formated_total = removeDuplicates(sorted_total_rows, "Promo Code").map(affiliate => {
    //   return { ...affiliate, Revenue: `$${affiliate.Revenue}` };
    // });

    const sorted_last_months_rows = last_months_rows.affiliates.sort((a, b) => (parseFloat(a.Uses) > parseFloat(b.Uses) ? -1 : 1));
    const formated_last_month = removeDuplicates(sorted_last_months_rows, "Promo Code").map(affiliate => {
      return { ...affiliate, Revenue: `$${affiliate.Revenue}` };
    });
    set_loading_paychecks(false);
  };

  // const pay_employee = async () => {
  //   await API_Paychecks.pay_employee({ employee_id, amount });
  // };

  const years = ["2025", "2024", "2023", "2022", "2021", "2020"];

  return (
    <div className="main_container p-20px">
      <Helmet>
        <title>Admin Paychecks | Glow LEDs</title>
      </Helmet>
      <Notification message={message_note} />
      <Loading loading={loading_paychecks} error={error} />
      <div className="wrap jc-b">
        <div className="wrap jc-b">
          {colors.map((color, index) => {
            return (
              <div className="wrap jc-b  m-1rem" key={index}>
                <label style={{ marginRight: "1rem" }}>{color.name}</label>
                <div
                  style={{
                    backgroundColor: color.color,
                    height: "20px",
                    width: "60px",
                    borderRadius: "5px"
                  }}
                />
              </div>
            );
          })}
        </div>
        <Link to="/secure/glow/editpaycheck">
          <GLButton variant="primary">Create Paycheck</GLButton>
        </Link>
      </div>
      <p className="fs-20px title_font">Choose Paycheck Month</p>
      {loading_checkboxes ? (
        <div>Loading...</div>
      ) : (
        <div>
          <label htmlFor="create_paychecks">Create Paychecks</label>
          <input
            type="checkbox"
            name="create_paychecks"
            defaultChecked={create_paychecks}
            id="create_paychecks"
            onChange={e => {
              set_create_paychecks(e.target.checked);
            }}
          />
        </div>
      )}

      {loading_checkboxes ? (
        <div>Loading...</div>
      ) : (
        <div>
          <label htmlFor="update_google_sheets">Create Google Sheets</label>
          <input
            type="checkbox"
            name="update_google_sheets"
            defaultChecked={update_google_sheets}
            id="update_google_sheets"
            onChange={e => {
              set_update_google_sheets(e.target.checked);
            }}
          />
        </div>
      )}
      <div className="ai-c jc-b w-100per max-w-600px">
        <div className="mv-2rem mr-2rem">
          <div className="row">
            <div className="custom-select ">
              <select
                defaultValue={date.getFullYear()}
                className="qty_select_dropdown"
                onChange={e => {
                  set_year(e.target.value);
                }}
              >
                {years.map(year => (
                  <option value={year}>{year}</option>
                ))}
              </select>
              <span className="custom-arrow" />
            </div>
          </div>
        </div>

        <div className="mv-2rem">
          <div className="row">
            <div className="custom-select ">
              <select
                // defaultValue={previous_month && previous_month.toLowerCase()}
                defaultValue={month && month.toLowerCase()}
                className="qty_select_dropdown"
                onChange={e => {
                  set_month(e.target.value);
                }}
              >
                {dates_in_year(year).map(month => (
                  <option value={month.month.toLowerCase()}>{toCapitalize(month.month)}</option>
                ))}
              </select>
              <span className="custom-arrow" />
            </div>
          </div>
        </div>
        <GLButton variant="primary" className="h-40px" onClick={create_affiliate_paychecks}>
          Create Affiliate Paychecks
        </GLButton>
      </div>

      <div className="jc-c">
        <h1 style={{ textAlign: "center" }}>Paychecks</h1>
      </div>
      <div className="search_and_sort row jc-c ai-c" style={{ overflowX: "scroll" }}>
        <Search search={search} set_search={set_search} submitHandler={submitHandler} category={category} />
        <Sort sortHandler={sortHandler} sort_options={sort_options} />
      </div>
      <div>Total Payout ${paychecks && paychecks.reduce((a, paycheck) => a + paycheck.amount, 0).toFixed(2)}</div>
      <Loading loading={loading} error={error}>
        {paychecks && (
          <div className="paycheck-list responsive_table">
            <table className="table">
              <thead>
                <tr>
                  <th>Date Paid</th>
                  <th>Affiliate</th>
                  <th>Amount</th>
                  <th>Venmo</th>
                  <th>Receipt</th>
                  <th>Paid</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paychecks.map((paycheck, index) => (
                  <tr
                    key={index}
                    style={{
                      backgroundColor: determine_color(paycheck),
                      fontSize: "16px"
                    }}
                  >
                    <td className="p-10px" style={{ minWidth: "15rem" }}>
                      {paycheck.paid_at && format_date(paycheck.paid_at)}
                    </td>
                    <td className="p-10px">
                      {paycheck.affiliate ? paycheck.affiliate.artist_name : paycheck.team && paycheck.team.team_name}
                    </td>
                    <td className="p-10px">${paycheck.amount}</td>
                    <td className="p-10px">{paycheck.venmo}</td>
                    <td className="p-10px">{paycheck.receipt}</td>
                    <td className="p-10px">
                      {paycheck.paid ? <i className="fas fa-check-circle" /> : <i className="fas fa-times-circle" />}
                    </td>
                    <td className="p-10px">
                      <div className="jc-b">
                        <Link to={"/secure/glow/editpaycheck/" + paycheck._id}>
                          <GLButton variant="icon" aria-label="Edit">
                            <i className="fas fa-edit" />
                          </GLButton>
                        </Link>
                        <GLButton variant="icon" onClick={() => duplicate_paycheck(paycheck)} aria-label="duplicate">
                          <i className="fas fa-clone" />
                        </GLButton>
                        <GLButton variant="icon" onClick={() => mark_paid(paycheck)} aria-label="mark paid">
                          <i className="fas fa-check-circle" />
                        </GLButton>
                        <GLButton variant="icon" onClick={() => deleteHandler(paycheck)} aria-label="Delete">
                          <i className="fas fa-trash-alt" />
                        </GLButton>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Loading>
    </div>
  );
};
export default PaychecksPage;
