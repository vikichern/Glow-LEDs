import { combineReducers } from "redux";
import {
  productListReducer,
  productDetailsReducer,
  productSaveReducer,
  productDeleteReducer,
  productImagesReducer,
  productReviewSaveReducer,
  productReviewDeleteReducer
} from "./reducers/productReducers";
import { expenseListReducer, expenseDetailsReducer, expenseSaveReducer, expenseDeleteReducer } from "./reducers/expenseReducers";
import { featureListReducer, featureDetailsReducer, featureSaveReducer, featureDeleteReducer } from "./reducers/featureReducers";

import { cartDeleteReducer, cartDetailsReducer, cartListReducer, cartReducer, cartSaveReducer } from "./reducers/cartReducers";
import {
  userLoginReducer,
  userRegisterReducer,
  userUpdateReducer,
  userContactReducer,
  userPasswordResetReducer,
  userResetPasswordReducer,
  userVerifyReducer,
  userDeleteReducer,
  userListReducer,
  userDetailsReducer,
  userUpdateUserReducer
  // errorReducer
} from "./reducers/userReducers";
import {
  orderCreateReducer,
  orderDetailsReducer,
  orderPayReducer,
  myOrderListReducer,
  orderListReducer,
  orderDeleteReducer,
  orderRefundReducer,
  orderUpdateReducer
} from "./reducers/orderReducers";
import { promoDeleteReducer, promoDetailsReducer, promoListReducer, promoSaveReducer } from "./reducers/promoReducers";
import { affiliateDeleteReducer, affiliateDetailsReducer, affiliateListReducer, affiliateSaveReducer } from "./reducers/affiliateReducers";
import { teamDeleteReducer, teamDetailsReducer, teamListReducer, teamSaveReducer } from "./reducers/teamReducers";
import { chipDeleteReducer, chipDetailsReducer, chipListReducer, chipSaveReducer } from "./reducers/chipReducers";
import { contentDeleteReducer, contentDetailsReducer, contentListReducer, contentSaveReducer } from "./reducers/contentReducers";
import { emailDeleteReducer, emailDetailsReducer, emailListReducer, emailSaveReducer } from "./reducers/emailReducers";

import {
  paycheckDeleteReducer,
  paycheckDetailsReducer,
  paycheckListReducer,
  paycheckSaveReducer,
  myPaycheckListReducer
} from "./reducers/paycheckReducers";
import {
  settingDeleteReducer,
  settingDetailsReducer,
  settingListReducer,
  settingSaveReducer,
  showHideSearchBarReducer
} from "./reducers/settingReducers";
import { categoryDeleteReducer, categoryDetailsReducer, categoryListReducer, categorySaveReducer } from "./reducers/categoryReducers";
import { parcelDeleteReducer, parcelDetailsReducer, parcelListReducer, parcelSaveReducer } from "./reducers/parcelReducers";
import { paletteDeleteReducer, paletteDetailsReducer, paletteListReducer, paletteSaveReducer } from "./reducers/paletteReducers";
import { filamentDeleteReducer, filamentDetailsReducer, filamentListReducer, filamentSaveReducer } from "./reducers/filamentReducers";
import { surveyDeleteReducer, surveyDetailsReducer, surveyListReducer, surveySaveReducer } from "./reducers/surveyReducers";
import affiliateSlice from "./slices/affiliateSlice";
import cartSlice from "./slices/cartSlice";
import categorySlice from "./slices/categorySlice";
import chipSlice from "./slices/chipSlice";
import contentSlice from "./slices/contentSlice";
import emailSlice from "./slices/emailSlice";
import expenseSlice from "./slices/expenseSlice";
import featureSlice from "./slices/featureSlice";
import filamentSlice from "./slices/filamentSlice";
import orderSlice from "./slices/orderSlice";
import paletteSlice from "./slices/paletteSlice";
import parcelSlice from "./slices/parcelSlice";
import paycheckSlice from "./slices/paycheckSlice";
import productSlice from "./slices/productSlice";
import promoSlice from "./slices/promoSlice";
import settingSlice from "./slices/settingSlice";
import surveySlice from "./slices/surveySlice";
import teamSlice from "./slices/teamSlice";
import userSlice from "./slices/userSlice";
import { dashboardApi } from "./pages/DashboardPage/dashboardApi";
import dashboardSlice from "./pages/DashboardPage/dashboardSlice";

export default combineReducers({
  affiliateSlice: affiliateSlice,
  cartSlice: cartSlice,
  categorySlice: categorySlice,
  chipSlice: chipSlice,
  contentSlice: contentSlice,
  emailSlice: emailSlice,
  expenseSlice: expenseSlice,
  featureSlice: featureSlice,
  filamentSlice: filamentSlice,
  orderSlice: orderSlice,
  paletteSlice: paletteSlice,
  parcelSlice: parcelSlice,
  paycheckSlice: paycheckSlice,
  productSlice: productSlice,
  promoSlice: promoSlice,
  settingSlice: settingSlice,
  surveySlice: surveySlice,
  teamSlice: teamSlice,
  userSlice: userSlice,
  [dashboardApi.reducerPath]: dashboardApi.reducer,
  dashboardSlice: dashboardSlice,

  productList: productListReducer,
  productDetails: productDetailsReducer,
  cart: cartReducer,
  cartList: cartListReducer,
  cartDetails: cartDetailsReducer,
  cartSave: cartSaveReducer,
  cartDelete: cartDeleteReducer,
  userLogin: userLoginReducer,
  userRegister: userRegisterReducer,
  // errors: errorReducer,
  productSave: productSaveReducer,
  productImages: productImagesReducer,
  productDelete: productDeleteReducer,
  productReviewSave: productReviewSaveReducer,
  orderCreate: orderCreateReducer,
  orderDetails: orderDetailsReducer,
  orderPay: orderPayReducer,
  userUpdate: userUpdateReducer,
  myOrderList: myOrderListReducer,
  orderList: orderListReducer,
  orderDelete: orderDeleteReducer,
  orderRefund: orderRefundReducer,
  orderUpdate: orderUpdateReducer,
  userContact: userContactReducer,
  userPasswordReset: userPasswordResetReducer,
  userResetPassword: userResetPasswordReducer,
  userVerify: userVerifyReducer,
  productReviewDelete: productReviewDeleteReducer,
  userDelete: userDeleteReducer,
  userList: userListReducer,
  userDetails: userDetailsReducer,
  userUpdateUser: userUpdateUserReducer,
  expenseList: expenseListReducer,
  expenseDetails: expenseDetailsReducer,
  expenseSave: expenseSaveReducer,
  expenseDelete: expenseDeleteReducer,
  featureList: featureListReducer,
  featureDetails: featureDetailsReducer,
  featureSave: featureSaveReducer,
  featureDelete: featureDeleteReducer,
  promoList: promoListReducer,
  promoDetails: promoDetailsReducer,
  promoSave: promoSaveReducer,
  promoDelete: promoDeleteReducer,
  affiliateList: affiliateListReducer,
  affiliateDetails: affiliateDetailsReducer,
  affiliateSave: affiliateSaveReducer,
  affiliateDelete: affiliateDeleteReducer,
  teamList: teamListReducer,
  teamDetails: teamDetailsReducer,
  teamSave: teamSaveReducer,
  teamDelete: teamDeleteReducer,
  chipList: chipListReducer,
  chipDetails: chipDetailsReducer,
  chipSave: chipSaveReducer,
  chipDelete: chipDeleteReducer,
  contentList: contentListReducer,
  contentDetails: contentDetailsReducer,
  contentSave: contentSaveReducer,
  contentDelete: contentDeleteReducer,
  emailList: emailListReducer,
  emailDetails: emailDetailsReducer,
  emailSave: emailSaveReducer,
  emailDelete: emailDeleteReducer,
  paycheckList: paycheckListReducer,
  paycheckDetails: paycheckDetailsReducer,
  myPaycheckList: myPaycheckListReducer,
  paycheckSave: paycheckSaveReducer,
  paycheckDelete: paycheckDeleteReducer,
  settingList: settingListReducer,
  settingDetails: settingDetailsReducer,
  settingSave: settingSaveReducer,
  settingDelete: settingDeleteReducer,
  showHideSearchBar: showHideSearchBarReducer,
  categoryList: categoryListReducer,
  categoryDetails: categoryDetailsReducer,
  categorySave: categorySaveReducer,
  categoryDelete: categoryDeleteReducer,
  surveyList: surveyListReducer,
  surveyDetails: surveyDetailsReducer,
  surveySave: surveySaveReducer,
  surveyDelete: surveyDeleteReducer,
  parcelList: parcelListReducer,
  parcelDetails: parcelDetailsReducer,
  parcelSave: parcelSaveReducer,
  parcelDelete: parcelDeleteReducer,
  paletteList: paletteListReducer,
  paletteDetails: paletteDetailsReducer,
  paletteSave: paletteSaveReducer,
  paletteDelete: paletteDeleteReducer,
  filamentList: filamentListReducer,
  filamentDetails: filamentDetailsReducer,
  filamentSave: filamentSaveReducer,
  filamentDelete: filamentDeleteReducer
});
