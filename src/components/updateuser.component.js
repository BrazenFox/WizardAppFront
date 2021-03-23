import React from "react";
import "antd/dist/antd.css";
import {Alert, Button, Checkbox, Drawer, Form, Input, Row} from "antd";
import UserService from "../services/user.service";
export default class UpdateUserForm extends React.Component {
    constructor(props) {
        super(props);
        this.handleRegister = this.handleRegister.bind(this);
        this.onChangeUsername = this.onChangeUsername.bind(this);
        this.onChangePassword = this.onChangePassword.bind(this);
        this.onChangeRole = this.onChangeRole.bind(this);

        this.state = {
            id: this.props.id,
            username: "",
            password: "",
            roles: [],
            successful: false,
            message: "",
            visible: false
        };
        console.warn(this.state)
    }


    onChangeUsername(e) {
        this.setState({
            username: e.target.value
        });
    }

    onChangePassword(e) {
        this.setState({
            password: e.target.value
        });
    }

    onChangeRole(e) {
        console.warn(e)
        this.setState({
            roles: e
        });
    }



    handleRegister(e) {
        e.preventDefault();

        this.setState({
            message: "",
            successful: false
        });
        console.log(this.state.roles)


        UserService.updateUser(
            this.state.id,
            this.state.username,
            this.state.password,
            this.state.roles
        ).then(
            response => {
                this.setState({
                    message: response.data.message,
                    successful: true,
                    visible: false

                });

                //window.location.reload();
                //this.props.history.push('/user')
            },
            error => {
                const resMessage =
                    (error.response &&
                        error.response.data &&
                        error.response.data.message) ||
                    error.message ||
                    error.toString();

                this.setState({
                    successful: false,
                    message: resMessage
                });
            }
        );
        //this.props.history.push('/user')

    }
    componentDidMount() {
        UserService.getUser(this.state.id).then(
            response => {
                this.setState({
                    username: response.data.username,
                    password: response.data.password,
                    roles: response.data.roles.map((role) => role.name) //{if (role.name === 'USER' ){role.name = "user"} }

                });
                //console.warn(this.state.users)
            },
            error => {
                console.warn(error)

            }
        );

    }

    showDrawer = () => {
        console.log(this.state)
        this.setState({
            visible: true

        });
    };

    onClose = () => {
        this.setState({
            visible: false
        });
    };

    onFinish = () => {


    }

    render() {
        return (
            <>
                <Button type="primary" onClick={this.showDrawer}>
                    Update
                </Button>
                <Drawer
                    title="Update account"
                    width={240}
                    onClose={this.onClose}
                    visible={this.state.visible}
                    bodyStyle={{paddingBottom: 80}}
                    footer={
                        <div
                            style={{
                                textAlign: "right"
                            }}
                        >
                            <Button onClick={this.onClose} style={{marginRight: 8}}>
                                Cancel
                            </Button>
                            <Button onClick={this.handleRegister} type="primary">
                                Submit
                            </Button>
                        </div>
                    }
                >
                    <Form layout="vertical"
                          name="basic"
                          initialValues={{
                              remember: true,
                          }}
                    >
                        <Row>
                            <Form.Item
                                name="username"
                                label="Username"
                                rules={[{
                                    validator(rule, value = "") {
                                        if (value.length === 0) {
                                            return Promise.reject("Username field is required");
                                        } else if (value.length > 0 && value.length < 4) {
                                            return Promise.reject("Minimum 4 characters");
                                        } else {
                                            return Promise.resolve();
                                        }
                                    }, required: true
                                }
                                ]}
                            >
                                <Input placeholder="Please enter user name"
                                       type="text"
                                       name="username"
                                       defaultValue={this.state.username}
                                       value={this.state.username}
                                       onChange={this.onChangeUsername}/>
                            </Form.Item>

                        </Row>
                        <Row>
                            <Form.Item
                                name="password"
                                label="Password"
                                rules={[{
                                    validator(rule, value = "") {
                                        if (value.length === 0) {
                                            return Promise.reject("Password field is required");
                                        } else if (value.length > 0 && value.length < 4) {
                                            return Promise.reject("Minimum 4 characters");
                                        } else {
                                            return Promise.resolve();
                                        }
                                    }, required: true
                                }]}
                            >
                                <Input.Password
                                    placeholder="Please enter password"
                                    type="password"
                                    name="password"
                                    defaultValue={this.state.password}
                                    value={this.state.password}
                                    onChange={this.onChangePassword}
                                />
                            </Form.Item>
                        </Row>

                        <Row>
                            <Form.Item name="roles" label="Roles">
                                {console.warn(this.state.roles,"!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")}
                                <Checkbox.Group name='roles' defaultValue={this.state.roles} onChange={this.onChangeRole}>
                                    <Row>
                                        <Checkbox value="ADMIN"  style={{lineHeight: '32px'}}>
                                            ADMIN
                                        </Checkbox>
                                    </Row>

                                    <Row>
                                        <Checkbox value="MODERATOR"  style={{lineHeight: '32px'}}>
                                            MODERATOR
                                        </Checkbox>
                                    </Row>
                                    <Row>
                                        <Checkbox value="USER"  style={{lineHeight: '32px'}}>
                                            USER
                                        </Checkbox>
                                    </Row>

                                </Checkbox.Group>
                            </Form.Item>

                        </Row>
                        {this.state.message && (
                            <Alert message={this.state.message} type={
                                this.state.successful
                                    ? "success"
                                    : "warning"
                            } showIcon/>
                        )

                        }
                    </Form>

                </Drawer>
            </>

        );
    }
}