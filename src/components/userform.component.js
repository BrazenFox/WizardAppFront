import React from "react";
import "antd/dist/antd.css";
import {Alert, Button, Checkbox, Drawer, Form, Input, Row} from "antd";
import {PlusOutlined} from "@ant-design/icons";
import UserService from "../services/user.service";


export default class UpdateUserForm extends React.Component {
    formRef = React.createRef();

    constructor(props) {
        super(props);
        this.handleAction = this.handleAction.bind(this);
        this.onChangeUsername = this.onChangeUsername.bind(this);
        this.onChangePassword = this.onChangePassword.bind(this);
        this.onChangeRole = this.onChangeRole.bind(this);
        this.create = this.create.bind(this)
        this.update = this.update.bind(this)

        this.state = {
            id: this.props.id,
            username: "",
            password: "",
            roles: [],
            successful: false,
            message: "",
            visible: false
        };
        //console.warn(this.props)
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

    create() {
        UserService.createUser(
            this.state.username,
            this.state.password,
            this.state.roles
        ).then(
            response => {
                this.setState({
                    message: response.data.message,
                    successful: true,
                    visible: false,
                });
                this.props.set()

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
            },
        );
    }


    update() {
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
                this.props.set()

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
    }


    handleAction(e) {
        //e.preventDefault();

        this.setState({
            message: "",
            successful: false
        });

        if (this.state.id) {
            this.update()
        } else {
            this.create()
        }
        this.setValues()
        this.onReset()


    }

    onReset = () => {
        this.formRef.current.resetFields();
    };

    setValues() {
        if (this.state.id) {
            UserService.getUser(this.state.id).then(
                response => {
                    this.setState({
                        username: response.data.username,
                        password: "",
                        roles: response.data.roles.map((role) => role.name),

                    });

                },
                error => {
                    console.warn(error)
                }
            );
        } else {
            this.setState({
                username: "",
                password: "",
                roles: [],

            });
        }
    }

    componentDidMount() {
        this.setValues()
    }

    showDrawer = () => {
        this.setState({
            visible: true,
            successful: false,
            message: "",
        });
    };

    onClose = () => {
        this.setState({
            visible: false,
            successful: false,
            message: "",
        });
        this.setValues()
        this.onReset()
        //this.forceUpdate();
    };


    render() {
        return (

            <>
                <Button type="primary" onClick={this.showDrawer}>
                    {this.props.id ? <>Update {console.warn(this.state)}</> : <><PlusOutlined/> New account</>}

                </Button>
                <Drawer
                    title={this.state.id ? "Update account" : "Create new account"}
                    width={240}
                    onClose={this.onClose}
                    bodyStyle={{paddingBottom: 80}}
                    visible={this.state.visible}
                    /*footer={
                        <div style={{textAlign: "right"}}>
                            <Button /!*ref={this.buttonRef}*!/ onClick={this.onClose} style={{marginRight: 8}}>
                                Cancel
                            </Button>
                            <Button onClick={this.formRef.current} /!*onClick={this.handleAction} *!/ type="primary" htmlType="submit">
                                Submit
                            </Button>

                            form="myForm" key="submit" htmlType="submit"
                        </div>
                        }*/
                >

                    <Form layout="vertical"
                          name="basic"
                          ref={this.formRef}
                          initialValues={this.state.id && {
                              username: this.state.username,
                              password: this.state.password,
                              roles: this.state.roles,
                              remember: true,
                          }}
                          onFinish={this.handleAction}
                    >

                        <Row>
                            <Form.Item
                                name="username"
                                label="Username"
                                rules={[{
                                    required: true,
                                    validator(rule, value = "") {
                                        if (value.length === 0) {
                                            return Promise.reject("Username field is required");
                                        } else if (value.length > 0 && value.length < 4) {
                                            return Promise.reject("Minimum 4 characters");
                                        } else {
                                            return Promise.resolve();
                                        }
                                    }
                                }
                                ]}
                            >
                                <Input
                                    placeholder="Please enter user name"
                                    type="text"
                                    name="username"
                                    value={this.state.username}
                                    onChange={this.onChangeUsername}/>
                            </Form.Item>

                        </Row>
                        <Row>
                            <Form.Item
                                name="password"
                                label="Password"
                                rules={[{
                                    required: true,
                                    validator(rule, value = "") {
                                        if (value.length === 0) {
                                            return Promise.reject("Password field is required");
                                        } else if (value.length > 0 && value.length < 4) {
                                            return Promise.reject("Minimum 4 characters");
                                        } else {
                                            return Promise.resolve();
                                        }
                                    }
                                }]}
                            >
                                <Input.Password
                                    placeholder="Please enter password"
                                    type="password"
                                    name="password"
                                    value={this.state.password}
                                    onChange={this.onChangePassword}
                                />
                            </Form.Item>
                        </Row>

                        <Row>
                            <Form.Item
                                name="roles"
                                label="Roles"
                            >
                                <Checkbox.Group name='roles' defaultValue={this.state.roles}
                                                onChange={this.onChangeRole}>
                                    <Row>
                                        <Checkbox value="ADMIN" style={{lineHeight: '32px'}}>
                                            ADMIN
                                        </Checkbox>
                                    </Row>

                                    <Row>
                                        <Checkbox value="MODERATOR" style={{lineHeight: '32px'}}>
                                            MODERATOR
                                        </Checkbox>
                                    </Row>
                                    <Row>
                                        <Checkbox value="USER" style={{lineHeight: '32px'}}>
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

                        <div style={{textAlign: "right"}}>
                            <Button onClick={this.onClose} style={{marginRight: 8}}>
                                Cancel
                            </Button>
                            <Button type="primary" htmlType="submit">
                                Submit
                            </Button>
                        </div>

                    </Form>

                </Drawer>
            </>

        );
    }
}