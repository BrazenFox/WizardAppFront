import React, {Component} from "react";
import {Link, Route, Switch} from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import 'antd/dist/antd.css';
import './index.css';
import './App.css';
import {Avatar, Menu} from 'antd';
import {SettingOutlined, UserOutlined} from '@ant-design/icons';
import AuthService from "./services/auth.service";
import Login from "./components/login.component";
import Home from "./components/home.component";
import User from "./components/user.component";
import Wizard from "./components/wizard.component";
import { withRouter } from 'react-router'

class App extends Component {
    constructor(props) {
        super(props);
        this.logOut = this.logOut.bind(this);

        this.state = {
            showWizardRunBoard: false,
            showWizardEditBoard: false,
            showUserBoard: false,
            showWizards: false,
            currentUser: undefined,
            current: '',
        };
    }

    /*state = {
        current: 'mail',
    };*/

    componentDidMount() {
        const user = AuthService.getCurrentUser();

        if (user) {
            this.setState({
                    currentUser: user,
                    showWizards: user.roles.includes("ADMIN") || user.roles.includes("MODERATOR") || user.roles.includes("USER"),
                    showUserBoard: user.roles.includes("ADMIN")

                },
                /*console.log(user)*/
            );
        }
    }

    logOut() {
        AuthService.logout();
    }

    handleClick = e => {
        console.log('click ', e);
        //this.setState({current: e.key});
    };

    render() {
        const {current, currentUser, showWizards, showUserBoard} = this.state;
        {
            currentUser &&
            console.log(currentUser);
        }
        return (
            <div>
                <Menu onClick={this.handleClick}
                      selectedKeys={[current]}
                      mode="horizontal" theme="dark"
                >
                    <Menu.Item key="home" icon={<SettingOutlined/>}>
                        <Link to={"/"}>
                            WizardApp
                        </Link>
                    </Menu.Item>

                    {currentUser ? (
                        <Menu.Item key="login"
                                   icon={<Avatar size={40}>{this.state.currentUser.username.toUpperCase()}</Avatar>}
                                   style={{float: 'right'}}>
                            <a href="/login" onClick={this.logOut}>
                                LogOut
                            </a>
                        </Menu.Item>

                    ) : (
                        <Menu.Item key="login"
                                   icon={<Avatar icon={<UserOutlined/>}/>}
                                   style={{float: 'right'}}>
                            <Link to={"/login"}>
                                Login
                            </Link>
                        </Menu.Item>

                    )}

                    {showWizards && (
                        <Menu.Item key="1">
                            <Link to={"/wizard"}>
                                Wizards
                            </Link>
                        </Menu.Item>
                    )}
                    {showUserBoard && (
                        <Menu.Item key="2">
                            <Link to={"/user"}>
                                Users
                            </Link>
                        </Menu.Item>
                    )}


                </Menu>
                <div className="container mt-1">
                    <Switch>
                        <Route exact path={["/", "/home"]} component={Home}/>
                        <Route exact path="/login" component={Login}/>
                        <Route exact path="/user" component={User}/>
                        <Route exact path="/wizard" component={Wizard}/>

                    </Switch>
                </div>

            </div>


        );
    }

}

// export default App;
export default withRouter((App));
