import { email_services } from "../services";
const nodemailer = require("nodemailer");
import App from "../email_templates/App";
import {
  account_created,
  password_reset,
  reset_password,
  contact,
  contact_confirmation,
  order_status,
  order,
  review,
  affiliate,
  feature,
  announcement,
  custom_contact,
} from "../email_templates/pages/index";
import email_subscription from "../email_templates/pages/email_subscription";
import { affiliate_db, content_db, email_db, order_db, user_db } from "../db";
import { format_date, toCapitalize } from "../util";
const cron = require("node-cron");
const schedule = require("node-schedule");
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;

// const verify_token = async () => {
//   const oauth2Client = new OAuth2(
//     process.env.GOOGLE_OAUTH_PUBLIC, // ClientID
//     process.env.GOOGLE_OAUTH_SECRET, // Client Secret
//     "https://developers.google.com/oauthplayground" // Redirect URL
//   );

//   oauth2Client.setCredentials({
//     refresh_token: process.env.GOOGLE_OAUTH_REFRESH_TOKEN,
//   });
//   // const accessToken = oauth2Client.getAccessToken();

//   const accessToken = await new Promise((resolve: any, reject: any) => {
//     oauth2Client.getAccessToken((err: any, token: any) => {
//       if (err) {
//         reject("Failed to create access token :(");
//       }
//       resolve(token);
//     });
//   });
//   // const transporter = nodemailer.createTransport({
//   //   service: "gmail",
//   //   auth: {
//   //     type: "OAuth2",
//   //     user: process.env.EMAIL,
//   //     clientId: process.env.GOOGLE_OAUTH_PUBLIC,
//   //     clientSecret: process.env.GOOGLE_OAUTH_SECRET,
//   //     refreshToken: process.env.GOOGLE_OAUTH_REFRESH_TOKEN,
//   //     accessToken: accessToken,
//   //   },
//   //   tls: {
//   //     rejectUnauthorized: false,
//   //   },
//   // });
// };

const createTransporter = async (type: string) => {
  const oauth2Client = new OAuth2(
    process.env.GOOGLE_OAUTH_PUBLIC,
    process.env.GOOGLE_OAUTH_SECRET,
    "https://developers.google.com/oauthplayground"
  );
  console.log({ oauth2Client });
  oauth2Client.setCredentials({
    refresh_token: process.env.GOOGLE_OAUTH_REFRESH_TOKEN,
  });

  const accessToken = await new Promise((resolve, reject) => {
    oauth2Client.getAccessToken((err: any, token: any) => {
      if (err) {
        reject();
      }
      resolve(token);
    });
  });
  console.log({ accessToken });

  const transporter = nodemailer.createTransport({
    service: "gmail",
    pool: true,
    auth: {
      type: "OAuth2",
      user: type === "contact" ? process.env.CONTACT_EMAIL : process.env.EMAIL,
      accessToken,
      clientId: process.env.GOOGLE_OAUTH_PUBLIC,
      clientSecret: process.env.GOOGLE_OAUTH_SECRET,
      refreshToken: process.env.GOOGLE_OAUTH_REFRESH_TOKEN,
    },
  });
  console.log({ transporter });

  return transporter;
};

const sendEmail = async (
  emailOptions: any,
  res: any,
  type: string,
  name: string
) => {
  const emailTransporter = await createTransporter(type);
  console.log({ emailTransporter });
  await emailTransporter.sendMail(emailOptions, (err: any, data: any) => {
    if (err) {
      console.log("Error Occurs", err);
      res.status(500).send({ error: err, message: "Error Sending Email" });
    } else {
      console.log("Email Sent to " + name);
      res.status(200).send({ message: "Email Successfully Sent" });
    }
  });
};

// const transporter_contact = nodemailer.createTransport({
//   service: "gmail",
//   pool: true,
//   auth: {
//     user: process.env.CONTACT_EMAIL,
//     pass: process.env.CONTACT_PASSWORD,
//   },
// });
const transporter = nodemailer.createTransport({
  service: "gmail",
  pool: true,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});

export default {
  findAll_emails_c: async (req: any, res: any) => {
    const { query } = req;
    try {
      const emails = await email_services.findAll_emails_s(query);
      if (emails) {
        return res.status(200).send(emails);
      }
      return res.status(404).send({ message: "Emails Not Found" });
    } catch (error) {
      console.log({ findAll_emails_c_error: error });
      res.status(500).send({ error, message: "Error Finding Emails" });
    }
  },
  findById_emails_c: async (req: any, res: any) => {
    const { params } = req;
    try {
      const email = await email_services.findById_emails_s(params);
      console.log({ email });
      if (email) {
        return res.status(200).send(email);
      }
      return res.status(404).send({ message: "Email Not Found" });
    } catch (error) {
      console.log({ findById_emails_c_error: error });
      res.status(500).send({ error, message: "Error Finding Email" });
    }
  },
  create_emails_c: async (req: any, res: any) => {
    const { body } = req;
    try {
      const email = await email_services.create_emails_s(body);
      if (email) {
        return res.status(201).send(email);
      }
      return res.status(500).send({ message: "Error Creating Email" });
    } catch (error) {
      console.log({ create_emails_c_error: error });
      res.status(500).send({ error, message: "Error Creating Email" });
    }
  },
  update_emails_c: async (req: any, res: any) => {
    const { params, body } = req;
    try {
      const email = await email_services.update_emails_s(params, body);
      if (email) {
        return res.status(200).send(email);
      }
      return res.status(500).send({ message: "Error Updating Email" });
    } catch (error) {
      console.log({ update_emails_c_error: error });
      res.status(500).send({ error, message: "Error Updating Email" });
    }
  },
  send_emails_c: async (req: any, res: any) => {
    const { body } = req;
    try {
      const email = await email_services.send_emails_s(body);
      transporter.sendMail(email, (error: any, data: any) => {
        if (error) {
          return res
            .status(500)
            .send({ error, message: "Error Updating Email" });
        } else {
          return res.status(200).send(data);
        }
      });
    } catch (error) {
      console.log({ update_emails_c_error: error });
      res.status(500).send({ error, message: "Error Updating Email" });
    }
  },
  send_all_emails_c: async (req: any, res: any) => {
    const { body } = req;
    try {
      console.log({ body });
      const email = await email_services.send_all_emails_s(body);
      transporter.sendMail(email, (error: any, data: any) => {
        if (error) {
          return res
            .status(500)
            .send({ error, message: "Error Updating Email" });
        } else {
          return res.status(200).send(data);
        }
      });
    } catch (error) {
      console.log({ update_emails_c_error: error });
      res.status(500).send({ error, message: "Error Updating Email" });
    }
  },
  remove_emails_c: async (req: any, res: any) => {
    const { params } = req;
    try {
      const email = await email_services.remove_emails_s(params);
      if (email) {
        return res.status(204).send({ message: "Email Deleted" });
      }
      return res.status(500).send({ message: "Error Deleting Email" });
    } catch (error) {
      console.log({ remove_emails_c_error: error });
      res.status(500).send({ error, message: "Error Deleting Email" });
    }
  },

  get_invoice_emails_c: async (req: any, res: any) => {
    const body = {
      email: {
        h1: "Thank you for your Order!",
        h2:
          "We are starting production on your order! We will notify your as your order progresses.",
      },
      title: "Thank you for your purchase!",
      order: req.body.order,
    };
    const mailOptions = {
      from: process.env.DISPLAY_EMAIL,
      to: req.body.email,
      subject: req.body.subject,
      html: App({ body: order(body), unsubscribe: false }),
    };
    transporter.sendMail(mailOptions, (err: any, data: any) => {
      if (err) {
        console.log("Error Occurs", err);
        res.status(500).send({ error: err, message: "Error Sending Email" });
      } else {
        console.log("Email Sent to " + req.body.email);
        res.status(200).send({ message: "Email Successfully Sent" });
      }
    });
  },
  send_order_emails_c: async (req: any, res: any) => {
    const body = {
      email: {
        h1: "YOUR ORDER HAS BEEN PLACED! 🎉",
        h2:
          "We are starting production on your order! We will notify your as your order progresses.",
      },
      title: "Thank you for your purchase!",
      order: req.body.order,
    };
    const mailOptions = {
      from: process.env.DISPLAY_EMAIL,
      to: req.body.email,
      subject: req.body.subject,
      html: App({ body: order(body), unsubscribe: false }),
    };
    transporter.sendMail(mailOptions, (err: any, data: any) => {
      if (err) {
        console.log("Error Occurs", err);
        res.status(500).send({ error: err, message: "Error Sending Email" });
      } else {
        console.log("Email Sent to " + req.body.email);
        res.status(200).send({ message: "Email Successfully Sent" });
      }
    });

    // transporter.sendMail(mailOptions, (err: any, data: any) => {
    //   if (err) {
    //     console.log("Error Occurs", err);
    //     res.status(500).send({ error: err, message: "Error Sending Email" });
    //   } else {
    //     console.log("Email Sent to " + req.body.email);
    //     res.status(200).send({ message: "Email Successfully Sent" });
    //   }
    // });
  },
  send_refund_emails_c: async (req: any, res: any) => {
    console.log({ send_refund_emails_c: req.body });
    const { order: order_data, email } = req.body;
    console.log({ order_data });
    console.log({ payment: order_data.payment });
    console.log({ refund: order_data.payment.refund });
    const body = {
      email: {
        h1: `${order_data.payment.refund.reduce(
          (a: any, c: any) => a + c.amount,
          0
        ) /
          100 <
        order_data.itemsPrice
          ? "Partial"
          : "Full"} Refund Successful`,
        h2: `Your Order has been refunded for ${" "}
          ${order_data.payment.refund_reason[
            order_data.payment.refund_reason.length - 1
          ]} on ${format_date(
          order_data.refundedAt
        )}. You're payment will show up in your bank account between 5-10 business days. Please let us know if you have any questions about this process.`,
      },
      title: "Thank you for your purchase!",
      order: order_data,
    };
    const mailOptions = {
      from: process.env.DISPLAY_EMAIL,
      to: email,
      subject: "Your Glow LEDs Refund",
      html: App({ body: order(body), unsubscribe: false }),
    };
    transporter.sendMail(mailOptions, (err: any, data: any) => {
      if (err) {
        console.log("Error Occurs", err);
        res.status(500).send({ error: err, message: "Error Sending Email" });
      } else {
        console.log("Email Sent to " + email);
        res.status(200).send({ message: "Email Successfully Sent" });
      }
    });
  },
  send_order_status_emails_c: async (req: any, res: any) => {
    const body = {
      email: {
        h1: "Thank you for your Order!",
        h2:
          "We are starting production on your order! We will notify your as your order progresses.",
      },
      title: "Your Order has been " + toCapitalize(req.body.status),
      order: req.body.order,
      status: req.body.status,
      message_to_user: req.body.message_to_user,
    };
    console.log({ body });
    const mailOptions = {
      from: process.env.DISPLAY_EMAIL,
      to: req.body.email,
      subject:
        req.body.status === "reassured"
          ? "Thank you for your patience"
          : req.body.subject,
      html: App({
        body: order_status(body),
        unsubscribe: false,
      }),
    };

    transporter.sendMail(mailOptions, (err: any, data: any) => {
      if (err) {
        console.log("Error Occurs", err);
        res.status(500).send({ error: err, message: "Error Sending Email" });
      } else {
        console.log("Email Sent to " + req.body.email);
        res.status(200).send({ message: "Email Successfully Sent" });
      }
    });
  },
  send_affiliate_emails_c: async (req: any, res: any) => {
    const body = {
      affiliate: req.body.affiliate,
      title: "Thank you for signing up!",
    };
    const mailOptions = {
      from: process.env.DISPLAY_EMAIL,
      to: req.body.email,
      subject: req.body.subject,
      html: App({ body: affiliate(body), unsubscribe: false }),
    };

    transporter.sendMail(mailOptions, (err: any, data: any) => {
      if (err) {
        console.log("Error Occurs", err);
        res.status(500).send({ error: err, message: "Error Sending Email" });
      } else {
        console.log("Email Sent to " + req.body.email);
        res.status(200).send({ message: "Email Successfully Sent" });
      }
    });
  },
  send_feature_emails_c: async (req: any, res: any) => {
    const body = {
      feature: req.body.feature,
      title: "Thank you for sending us your art!",
    };
    const mailOptions = {
      from: process.env.DISPLAY_EMAIL,
      to: req.body.email,
      subject: req.body.subject,
      html: App({
        body: feature(body),
        unsubscribe: false,
      }),
    };

    transporter.sendMail(mailOptions, (err: any, data: any) => {
      if (err) {
        console.log("Error Occurs", err);
        res.status(500).send({ error: err, message: "Error Sending Email" });
      } else {
        console.log("Email Sent to " + req.body.email);
        res.status(200).send({ message: "Email Successfully Sent" });
      }
    });
  },
  send_external_contact_emails_c: async (req: any, res: any) => {
    const mailOptions = {
      to: process.env.PERSONAL_EMAIL,
      from: req.body.email,
      subject: `${req.body.subject} - ${req.body.name}`,
      html: req.body.message,
    };
    transporter.sendMail(mailOptions, (err: any, data: any) => {
      if (err) {
        console.log("Error Occurs", err);
        res.status(500).send({ error: err, message: "Error Sending Email" });
      } else {
        console.log("Contact Email Sent to " + req.body.first_name);
        res.status(200).send({ message: "Email Successfully Sent" });
      }
    });
  },
  send_user_contact_emails_c: async (req: any, res: any) => {
    const mailOptions = {
      to: process.env.DISPLAY_CONTACT_EMAIL,
      from: req.body.email,
      subject: `New message from ${req.body.first_name} - ${req.body
        .reason_for_contact}`,
      html: contact(req.body),
    };
    sendEmail(
      mailOptions,
      res,
      "contact",
      "User Contact Email Sent to " + req.body.first_name
    );
  },
  send_admin_contact_emails_c: async (req: any, res: any) => {
    const mailOptions = {
      from: process.env.DISPLAY_CONTACT_EMAIL,
      to: req.body.email,
      subject: `Thank you for Contacting Glow LEDs Support`,
      html: contact_confirmation(req.body),
    };
    sendEmail(
      mailOptions,
      res,
      "contact",
      "Admin Contact Email Sent to " + req.body.first_name
    );
  },
  send_custom_contact_emails_c: async (req: any, res: any) => {
    console.log({ send_custom_contact_emails_c: req.body });
    const { order, email } = req.body;
    const mailOptions = {
      from: process.env.DISPLAY_CONTACT_EMAIL,
      to: email,
      subject: `Thank you for ordering a custom Glow LEDs Product!`,
      html: custom_contact({ order }),
    };
    sendEmail(
      mailOptions,
      res,
      "contact",
      "Custom Contact Email Sent to " + order.shipping.first_name
    );
  },
  send_password_reset_emails_c: async (req: any, res: any) => {
    console.log({ passwordreset: req.body });

    const mailOptions = {
      from: process.env.DISPLAY_EMAIL,
      to: req.body.data.email,
      subject: "Glow LEDs Password Reset",
      html: App({
        body: password_reset({
          ...req.body,
          title: "Glow LEDs Password Reset",
        }),
        unsubscribe: false,
      }),
    };

    transporter.sendMail(mailOptions, (err: any, data: any) => {
      if (err) {
        console.log("Error Occurs", err);
        res.status(500).send({ error: err, message: "Error Sending Email" });
      } else {
        console.log("Password Reset Email Sent to " + req.body.data.first_name);
        res.status(200).send({ message: "Email Successfully Sent" });
      }
    });
  },
  send_review_emails_c: async (req: any, res: any) => {
    console.log({ send_order_status_emails_c: req.body });
    const contents = await content_db.findAll_contents_db(
      { deleted: false },
      { _id: -1 },
      0
    );

    const mailOptions = {
      from: process.env.DISPLAY_EMAIL,
      to: req.body.email,
      subject: "Enjoy 10% off your next purchase!",
      html: App({
        body: review({
          ...req.body,
          categories: contents && contents[0].home_page.slideshow,
          title: "Enjoy 10% off your next purchase!",
        }),

        unsubscribe: false,
      }),
    };

    transporter.sendMail(mailOptions, (err: any, data: any) => {
      if (err) {
        console.log("Error Occurs", err);
        res.status(500).send({ error: err, message: "Error Sending Email" });
      } else {
        console.log("Email Sent to " + req.body.email);
        res.status(200).send({ message: "Email Successfully Sent" });
      }
    });
  },

  send_announcement_emails_c: async (req: any, res: any) => {
    console.log({ send_announcement_emails_c: req.body });
    const { template, subject, test, time } = req.body;
    const users = await user_db.findAll_users_db(
      { deleted: false, email_subscription: true },
      {}
    );
    const email = await email_db.findById_emails_db(template._id);
    const all_emails = users
      .filter((user: any) => user.deleted === false)
      .filter((user: any) => user.email_subscription === true)
      .map((user: any) => user.email);
    console.log({ all_emails });
    const test_emails = [
      "lavacquek@icloud.com",
      "lavacquek@gmail.com",
      "destanyesalinas@gmail.com",
    ];
    const emails: any = test ? test_emails : all_emails;
    console.log({ emails });

    const mailOptions = {
      to: process.env.EMAIL,
      from: process.env.DISPLAY_EMAIL,
      subject: subject,
      html: App({
        body: announcement(template),
        unsubscribe: true,
        header_footer_color: template.header_footer_color,
      }),
      bcc: emails,
    };
    console.log({ time });
    const date = new Date(time);
    email.subject = subject;
    if (time.length > 0) {
      email.status = "scheduled";
      email.scheduled_at = time;
      email.save();
      cron.schedule(
        `${date.getSeconds()} ${date.getMinutes()} ${date.getHours()} ${date.getDate()} ${date.getMonth() +
          1} *`,
        () => {
          console.log("Email Scheduled for " + time);
          transporter.sendMail(mailOptions, (err: any, data: any) => {
            if (err) {
              console.log("Error Occurs", err);
              res
                .status(500)
                .send({ error: err, message: "Error Sending Email" });
            } else {
              email.status = "sent";
              email.save();
              console.log("Email " + subject + " to everyone");
              res.status(200).send({ message: "Email Successfully Sent" });
            }
          });
        },
        {
          scheduled: true,
          timezone: "America/Rainy_River",
        }
      );
    } else {
      console.log("Email not scheduled");
      transporter.sendMail(mailOptions, (err: any, data: any) => {
        if (err) {
          console.log("Error Occurs", err);
          res.status(500).send({ error: err, message: "Error Sending Email" });
        } else {
          console.log("Email " + subject + " to everyone");
          res.status(200).send({ message: "Email Successfully Sent" });
        }
      });
    }
  },
  view_announcement_emails_c: async (req: any, res: any) => {
    const { template } = req.body;
    console.log({ template });
    if (Object.keys(template).length > 2) {
      res.status(200).send(
        App({
          body: announcement(template),
          unsubscribe: true,
          background_color: template.background_color,
        })
      );
    }
  },
  send_email_subscription_emails_c: async (req: any, res: any) => {
    console.log({ send_email_subscription_emails_c: req.body });
    const contents = await content_db.findAll_contents_db(
      { deleted: false },
      { _id: -1 },
      0
    );

    const mailOptions = {
      from: process.env.DISPLAY_EMAIL,
      to: req.body.email,
      subject: "Enjoy 10% off your next purchase!",
      html: App({
        body: email_subscription({
          ...req.body,
          categories: contents && contents[0].home_page.slideshow,
          title: "Enjoy 10% off your next purchase!",
        }),
        unsubscribe: true,
      }),
    };

    transporter.sendMail(mailOptions, (err: any, data: any) => {
      if (err) {
        console.log("Error Occurs", err);
        res.status(500).send({ error: err, message: "Error Sending Email" });
      } else {
        console.log("Email Sent to " + req.body.email);
        res.status(200).send({ message: "Email Successfully Sent" });
      }
    });
  },
  send_reset_password_emails_c: async (req: any, res: any) => {
    console.log({ reset_password: req.body });

    const mailOptions = {
      from: process.env.DISPLAY_EMAIL,
      to: req.body.email,
      subject: "Glow LEDs Reset Password",
      html: App({
        body: reset_password({
          ...req.body,
          title: "Glow LEDs Reset Password",
        }),
        unsubscribe: false,
      }),
    };

    transporter.sendMail(mailOptions, (err: any, data: any) => {
      if (err) {
        console.log("Error Occurs", err);
        res.status(500).send({ error: err, message: "Error Sending Email" });
      } else {
        console.log("Reset Password Email Sent to " + req.body.first_name);
        res.status(200).send({ message: "Email Successfully Sent" });
      }
    });
  },
  send_account_created_emails_c: async (req: any, res: any) => {
    console.log({ send_email_subscription_emails_c: req.body });
    const contents = await content_db.findAll_contents_db(
      { deleted: false },
      { _id: -1 },
      0
    );

    const mailOptions = {
      from: process.env.DISPLAY_EMAIL,
      to: req.body.email,
      subject: "Glow LEDs Account Created",
      html: App({
        body: account_created({
          user: req.body,
          categories: contents && contents[0].home_page.slideshow,
          title: "Glow LEDs Account Created",
        }),

        unsubscribe: false,
      }),
    };

    transporter.sendMail(mailOptions, (err: any, data: any) => {
      if (err) {
        console.log("Error Occurs", err);
        res.status(500).send({ error: err, message: "Error Sending Email" });
      } else {
        console.log("Registration Email Sent to " + req.body.first_name);
        res.status(200).send({ message: "Email Successfully Sent" });
      }
    });
  },
  send_verified_emails_c: async (req: any, res: any) => {
    console.log({ register: req.body });

    const mailOptions = {
      from: process.env.DISPLAY_EMAIL,
      to: req.body.email,
      subject: "Glow LEDs Account Created",
      html: App({
        body: account_created({
          ...req.body,
          title: "Glow LEDs Account Created",
        }),

        unsubscribe: false,
      }),
    };

    transporter.sendMail(mailOptions, (err: any, data: any) => {
      if (err) {
        console.log("Error Occurs", err);
        res.status(500).send({ error: err, message: "Error Sending Email" });
      } else {
        console.log("Registration Email Sent to " + req.body.first_name);
        res.status(200).send({ message: "Email Successfully Sent" });
      }
    });
  },
};
