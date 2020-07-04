import React from 'react';
import { Route, BrowserRouter as Router, Switch } from 'react-router-dom';
import './App.css';
import {
	HomePage,
	AllProductsPage,
	ProductPage,
	CartPage,
	LoginPage,
	RegisterPage,
	ProductsPage,
	ShippingPage,
	PaymentPage,
	PlaceOrderPage,
	OrderPage,
	ProfilePage,
	OrdersPage,
	ContactPage,
	UserOrdersPage,
	Four04Page,
	EditProfilePage,
	EditProductPage,
	PasswordResetPage,
	ResetPasswordPage,
	VerifiedPage,
	CheckEmailPage,
	ChangePasswordPage
} from './pages/index';
import { Header, Container, Content, Footer, Sidebar } from './components/ContainerComponents/index';
import { useSelector } from 'react-redux';
import PrivateRoute from './components/PrivateRoute';

const App = () => {
	const userLogin = useSelector((state) => state.userLogin);

	let { userInfo } = userLogin;

	return (
		<Router>
			<Container>
				<Header userInfo={userInfo} />
				<Sidebar userInfo={userInfo} />
				<Content>
					<Switch>
						{/* Public Routes */}
						<Route path="/login" component={LoginPage} />
						<Route path="/verified/:id" component={VerifiedPage} />
						<Route path="/checkemail" component={CheckEmailPage} />
						<Route path="/changepassword" component={ChangePasswordPage} />
						<Route path="/register" component={RegisterPage} />
						<Route path="/product/:id" component={ProductPage} />
						<Route path="/passwordreset" component={PasswordResetPage} />
						<Route path="/resetpassword/:id" component={ResetPasswordPage} />
						<Route path="/cart/:id?" component={CartPage} />
						<Route path="/category/:id?" component={AllProductsPage} />
						<Route path="/allproducts/:id?" exact={true} component={AllProductsPage} />
						<Route path="/" exact={true} component={HomePage} />
						<Route path="/contact" exact={true} component={ContactPage} />
						<Route component={Four04Page} />
						{/* Private Routes */}
						<PrivateRoute path="/orders" component={OrdersPage} />
						<PrivateRoute path="/profile" component={ProfilePage} />
						<PrivateRoute path="/editprofile" component={EditProfilePage} />
						<PrivateRoute path="/userorders" component={UserOrdersPage} />
						<PrivateRoute
							path="/order/:id"
							component={(props) => <OrderPage userInfo={userInfo} {...props} />}
						/>
						<PrivateRoute path="/products" component={ProductsPage} />
						<PrivateRoute path="/shipping" component={ShippingPage} />
						<PrivateRoute path="/payment" component={PaymentPage} />
						<PrivateRoute
							path="/placeorder"
							component={(props) => <PlaceOrderPage userInfo={userInfo} {...props} />}
						/>
						<PrivateRoute path="/editproduct/:id?" component={EditProductPage} />
					</Switch>
				</Content>
				<Footer />
			</Container>
		</Router>
	);
};

export default App;
