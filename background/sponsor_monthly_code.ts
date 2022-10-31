const axios = require("axios");
const dotenv = require("dotenv");
dotenv.config();
const google_sheets_json = require("./glow-leds-0e697a43198d.json");

const domain = () => {
  if (process.env.NODE_ENV === "development") {
    return "http://localhost:3000";
  } else {
    return "https://www.glow-leds.com";
  }
};
const determine_promoter_sheet = () => {
  if (process.env.NODE_ENV === "development") {
    return "1Nv9zaqdX-BDVoZv3zO2MdTQmJaMAdeLFzNiDQH7Zqmw";
  } else {
    return "1vy1OKH0P96cDkjuq-_yBT56CA1yQRMY3XZ2kgN95Spg";
  }
};
const determine_sponsors_sheet = () => {
  if (process.env.NODE_ENV === "development") {
    return "1IKIftDEHuH_tg3eNJC9ztXbSPnSMFfCgH84bJ8DzioM";
  } else {
    return "1nxYhdgGqme0tSvOrYeb6oU9RIOLeA2aik3-K4H1dRpA";
  }
};
const determine_teams_sheet = () => {
  if (process.env.NODE_ENV === "development") {
    return "1Horj9JStmfH5Ue2gjg6szoGtZwVpkABJpEvCoTJBF1g";
  } else {
    return "1OmtRqSVEBCZCamz1qPceXW8CPfuwvWwGxIiu1YzMtMI";
  }
};
const determine_top_earners_sheet = () => {
  if (process.env.NODE_ENV === "development") {
    return "1HMi3HF1f_5mJZqievCYOfrOuDjQkZeNLD88DoCw7kl0";
  } else {
    return "1JWqXo384wAmv6Q6wnOugVSh8vaQQYi1P6Ek17pZz9m4";
  }
};
const determine_top_uses_sheet = () => {
  if (process.env.NODE_ENV === "development") {
    return "1iGUFKugqgZs6kwbgz_FgQzqa7ivFA7BZmvjTJvvyHyI";
  } else {
    return "1SiuwzNYiMQpREpvf2x_0ktyKs--bDNQG0cMwbeJy2Tc";
  }
};

const removeDuplicates = (originalArray: any, prop: any) => {
  const newArray = [];
  const lookupObject: any = {};

  for (const i in originalArray) {
    lookupObject[originalArray[i][prop]] = originalArray[i];
  }

  for (const i in lookupObject) {
    newArray.push(lookupObject[i]);
  }
  return newArray;
};

const toCapitalize = (string: string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

export const top_code_usage_upload = async (year: string, month: string, google_sheet: string) => {
  google_sheets_json.private_key = process.env.GOOGLE_SHEETS_PRIVATE;

  try {
    const { GoogleSpreadsheet } = require("google-spreadsheet");

    // spreadsheet key is the long id in the sheets URL
    // const doc = new GoogleSpreadsheet('1qf9xryR0EPOCD0YkFQXqYioAxJRfWg6QFpdFwFTpErg');
    const doc = new GoogleSpreadsheet(google_sheet);

    // use service account creds
    // await doc.useServiceAccountAuth({
    //   client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    //   private_key: process.env.GOOGLE_PRIVATE_KEY,
    // });
    // OR load directly from json file if not in secure environment
    await doc.useServiceAccountAuth(google_sheets_json);
    // OR use service account to impersonate a user (see https://developers.google.com/identity/protocols/oauth2/service-account#delegatingauthority)
    // await doc.useServiceAccountAuth(require('./creds-from-google.json'), 'some-user@my-domain.com');
    // OR use API key -- only for read-only access to public sheets
    // doc.useApiKey('YOUR-API-KEY');

    await doc.loadInfo(); // loads document properties and worksheets
    // console.log(doc.title);
    // await doc.updateProperties({ title: 'KYEO FB Product Sheet' });

    const { data: last_months_rows } = await axios.get(`${domain()}/api/orders/affiliate_code_usage/${year}/${month}`);
    const { data: total_rows } = await axios.get(`${domain()}/api/orders/affiliate_code_usage`);
    console.log({ last_months_rows });
    console.log({ total_rows });

    const sorted_total_rows = total_rows.affiliates.sort((a: any, b: any) => (parseFloat(a.Uses) > parseFloat(b.Uses) ? -1 : 1));

    const formated_total = removeDuplicates(sorted_total_rows, "Promo Code").map((affiliate: any) => {
      return { ...affiliate, Revenue: `$${affiliate.Revenue}` };
    });

    const sorted_last_months_rows = last_months_rows.affiliates.sort((a: any, b: any) =>
      parseFloat(a.Uses) > parseFloat(b.Uses) ? -1 : 1
    );
    const formated_last_month = removeDuplicates(sorted_last_months_rows, "Promo Code").map((affiliate: any) => {
      return { ...affiliate, Revenue: `$${affiliate.Revenue}` };
    });

    const sheet = doc.sheetsByIndex[0]; // or use doc.sheetsById[id] or doc.sheetsByTitle[title]

    await sheet.clear();
    await sheet.setHeaderRow(["Promo Code", "Uses"]);

    await sheet.addRows(formated_total);
    await sheet.saveUpdatedCells();
    // adding / removing sheets

    const newSheet = await doc.addSheet({
      title: `${toCapitalize(month)} ${year} Affiliate Revenue`
    });
    await newSheet.setHeaderRow(["Promo Code", "Uses", "Revenue"]);

    await newSheet.addRows(formated_last_month);
    await newSheet.saveUpdatedCells();
    // // await newSheet.delete();
  } catch (error) {
    console.log({ error });
  }
};

export const top_earner_upload = async (year: string, month: string, google_sheet: string) => {
  google_sheets_json.private_key = process.env.GOOGLE_SHEETS_PRIVATE;

  try {
    const { GoogleSpreadsheet } = require("google-spreadsheet");

    // spreadsheet key is the long id in the sheets URL
    // const doc = new GoogleSpreadsheet('1qf9xryR0EPOCD0YkFQXqYioAxJRfWg6QFpdFwFTpErg');
    const doc = new GoogleSpreadsheet(google_sheet);

    // use service account creds
    // await doc.useServiceAccountAuth({
    //   client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    //   private_key: process.env.GOOGLE_PRIVATE_KEY,
    // });
    // OR load directly from json file if not in secure environment
    await doc.useServiceAccountAuth(google_sheets_json);
    // OR use service account to impersonate a user (see https://developers.google.com/identity/protocols/oauth2/service-account#delegatingauthority)
    // await doc.useServiceAccountAuth(require('./creds-from-google.json'), 'some-user@my-domain.com');
    // OR use API key -- only for read-only access to public sheets
    // doc.useApiKey('YOUR-API-KEY');

    await doc.loadInfo(); // loads document properties and worksheets
    // console.log(doc.title);
    // await doc.updateProperties({ title: 'KYEO FB Product Sheet' });

    const { data: last_months_rows } = await axios.get(`${domain()}/api/orders/affiliate_code_usage/${year}/${month}`);
    const { data: total_rows } = await axios.get(`${domain()}/api/orders/affiliate_code_usage`);
    console.log({ last_months_rows });
    console.log({ total_rows });

    const sorted_last_months_rows = last_months_rows.affiliates.sort((a: any, b: any) =>
      parseFloat(a.Revenue) > parseFloat(b.Revenue) ? -1 : 1
    );
    const formated_last_month = removeDuplicates(sorted_last_months_rows, "Promo Code").map((affiliate: any) => {
      return { ...affiliate, Revenue: `$${affiliate.Revenue}` };
    });

    const sorted_total_rows = total_rows.affiliates.sort((a: any, b: any) => (parseFloat(a.Revenue) > parseFloat(b.Revenue) ? -1 : 1));

    const formated_total = removeDuplicates(sorted_total_rows, "Promo Code").map((affiliate: any) => {
      return { ...affiliate, Revenue: `$${affiliate.Revenue}` };
    });

    const sheet = doc.sheetsByIndex[0]; // or use doc.sheetsById[id] or doc.sheetsByTitle[title]

    await sheet.clear();
    await sheet.setHeaderRow(["Promo Code", "Revenue", "Uses"]);

    await sheet.addRows(formated_total);
    await sheet.saveUpdatedCells();
    // adding / removing sheets

    const newSheet = await doc.addSheet({
      title: `${toCapitalize(month)} ${year} Affiliate Revenue`
    });
    await newSheet.setHeaderRow(["Promo Code", "Revenue", "Uses"]);

    await newSheet.addRows(formated_last_month);
    await newSheet.saveUpdatedCells();
    // await newSheet.delete();
  } catch (error) {
    console.log({ error });
  }
};

export const affiliate_revenue_upload = async (position: any, year: string, month: string, google_sheet: string) => {
  google_sheets_json.private_key = process.env.GOOGLE_SHEETS_PRIVATE;
  console.log({ google_sheets_json });
  try {
    const { GoogleSpreadsheet } = require("google-spreadsheet");

    // spreadsheet key is the long id in the sheets URL
    // const doc = new GoogleSpreadsheet('1qf9xryR0EPOCD0YkFQXqYioAxJRfWg6QFpdFwFTpErg');
    const doc = new GoogleSpreadsheet(google_sheet);

    // use service account creds
    // await doc.useServiceAccountAuth({
    //   client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    //   private_key: process.env.GOOGLE_PRIVATE_KEY,
    // });
    // OR load directly from json file if not in secure environment
    await doc.useServiceAccountAuth(google_sheets_json);
    // OR use service account to impersonate a user (see https://developers.google.com/identity/protocols/oauth2/service-account#delegatingauthority)
    // await doc.useServiceAccountAuth(require('./creds-from-google.json'), 'some-user@my-domain.com');
    // OR use API key -- only for read-only access to public sheets
    // doc.useApiKey('YOUR-API-KEY');

    await doc.loadInfo(); // loads document properties and worksheets
    // console.log(doc.title);
    // await doc.updateProperties({ title: 'KYEO FB Product Sheet' });

    // const { data: last_months_rows } = await API_Orders.affiliate_code_usage_orders_a({
    //   year,
    //   month,
    //   position
    // });
    // const { data: total_rows } = await API_Orders.affiliate_code_usage_orders_a({
    //   year: "",
    //   month: "",
    //   position
    // });
    const { data: last_months_rows } = await axios.get(
      `${domain()}/api/orders/affiliate_code_usage/${year}${month ? "/" + month : ""}${position ? `?position=${position}` : ""}`
    );
    const { data: total_rows } = await axios.get(`${domain()}/api/orders/affiliate_code_usage/?position=${position}`);

    console.log({ last_months_rows });
    console.log({ total_rows });

    const sorted_total_rows = total_rows.affiliates.sort((a: any, b: any) => (parseFloat(a.Revenue) > parseFloat(b.Revenue) ? -1 : 1));
    const sorted_last_months_rows = last_months_rows.affiliates.sort((a: any, b: any) =>
      parseFloat(a.Revenue) > parseFloat(b.Revenue) ? -1 : 1
    );
    const formated_total = removeDuplicates(sorted_total_rows, "Promo Code").map((affiliate: any) => {
      return { ...affiliate, Revenue: `$${affiliate.Revenue}` };
    });
    const formated_last_month = removeDuplicates(sorted_last_months_rows, "Promo Code").map((affiliate: any) => {
      return { ...affiliate, Revenue: `$${affiliate.Revenue}` };
    });

    const sheet = doc.sheetsByIndex[0]; // or use doc.sheetsById[id] or doc.sheetsByTitle[title]

    await sheet.clear();
    await sheet.setHeaderRow(["Promo Code", "Uses", "Revenue"]);

    await sheet.addRows(formated_total);
    await sheet.saveUpdatedCells();
    // adding / removing sheets

    const newSheet = await doc.addSheet({
      title: `${toCapitalize(month)} ${year} ${position ? toCapitalize(position) : "Affiliate"} Revenue`
    });
    await newSheet.setHeaderRow(["Promo Code", "Uses", "Revenue", "Percentage Off"]);

    await newSheet.addRows(formated_last_month);
    await newSheet.saveUpdatedCells();

    // // // await newSheet.delete();
  } catch (error) {
    console.log({ error });
  }
};
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const sponsor_monthly_code = async () => {
  try {
    const date = new Date();
    const last_date = new Date(date.setMonth(date.getMonth() - 1));
    console.log(last_date.getMonth());
    const today = new Date().toISOString().slice(0, 10);
    const year = today.split("-")[0];
    const day = today.split("-")[2];
    const last_month = last_date.getMonth();
    if (day === "01") {
      console.log("Run");
      // await axios.get(`${domain()}/api/paychecks/pay/promoter/${year}/${months[last_month].toLowerCase()}`);
      // await axios.get(`${domain()}/api/paychecks/pay/sponsor/${year}/${months[last_month].toLowerCase()}`);
      // await axios.get(`${domain()}/api/paychecks/pay/team/${year}/${months[last_month].toLowerCase()}`);
      // await affiliate_revenue_upload("promoter", year, months[last_month].toLowerCase(), determine_promoter_sheet());
      // await affiliate_revenue_upload("sponsor", year, months[last_month].toLowerCase(), determine_sponsors_sheet());
      // await affiliate_revenue_upload("team", year, months[last_month].toLowerCase(), determine_teams_sheet());
      // await top_earner_upload(year, months[last_month].toLowerCase(), determine_top_earners_sheet());
      // await top_code_usage_upload(year, months[last_month].toLowerCase(), determine_top_uses_sheet());
      // await axios.put(
      //   `${domain()}/api/promos/update_discount/${year}${months[last_month].toLowerCase() ? "/" + months[last_month].toLowerCase() : ""}`
      // );
      await axios.put(`${domain()}/api/promos/create_sponsor_codes`);
    } else {
      console.log("Don't Run");
    }
  } catch (error) {
    console.log({ error });
  }
};

sponsor_monthly_code();
