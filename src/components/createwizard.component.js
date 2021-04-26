import React from "react";
import "antd/dist/antd.css";
import {Alert, Button, Col, Divider, Form, Input, Row, Select} from "antd";
import {MinusCircleOutlined, PlusOutlined} from "@ant-design/icons";
import WizardService from "../services/wizard.service"
import AuthService from "../services/auth.service"

const {Option} = Select;
export default class WizardForm extends React.Component {
    formRef = React.createRef();

    constructor(props) {
        super(props);
        this.changeState = this.changeState.bind(this);
        this.state = {
            id: this.props.match.params.id,
            name: "",
            pages: [],
            creator: "",
            successful: false,
            message: "",
        }
    }

    changeState(value, allvalues) {
        //console.log(allvalues, "!!!!!!!!!!!!!!!!!!!!!!!!!!!")
        this.setState({
            pages: allvalues.pages
        })
        /*pages: value.pages.map(page => ({
            name: page.name,
            content: page.content,
            buttons: page.buttons.map(button => ({
                name: button.name,
                toPage: {name: button.toPage}
            }))
        }))*/
    }


    onReset = () => {
        this.formRef.current.resetFields();
    };

    onFill = () => {
        this.formRef.current.setFieldsValue({
            name: this.state.name,
            pages: this.state.pages
        });
    };


    setValues() {
        if (this.state.id) {
            // console.log("!!!!!!!!!!!!!!!")
            WizardService.getWizardGraphQL(this.state.id).then(
                response => {
                    //console.log(response.data, "!!!!!!!!!!!!!!!!!")
                    const name = response.data.getWizard.name
                    const creator = response.data.getWizard.creator
                    const pages = response.data.getWizard.pages.map(page => ({
                        key: page.id, // I added this line
                        id: page.id,
                        name: page.name,
                        content: page.content,
                        type: page.type,
                        buttons: page.buttons.map(button => ({
                            key: button.id,
                            id: button.id,
                            name: button.name,
                            toPage: button.toPage.name,
                            toPageId: button.toPage.id
                        }))
                    }))
                    this.setState({
                        name: name,
                        creator: creator,
                        pages: pages,
                    });
                    //console.log(this.state)
                    this.onFill()

                },
                error => {
                    // console.warn(error)
                }
            );
        } else {
            this.setState({
                name: "",
                creator: "",
                pages: "",
            });
            this.onFill()
        }
    }

    componentDidMount() {
        this.setValues()
    }

    create(value) {
        const name = value.name
        const creator = {id: AuthService.getCurrentUser().id}
        const pages = value.pages.map(page => ({
            name: page.name,
            type: page.type,
            content: page.content,
            buttons: page.buttons && page.buttons.map(button => ({
                name: button.name,
                toPage: {
                    name: button.toPage,
                }
            }))
        }))
        this.setState({
            name: name,
            creator: creator,
            pages: pages
        })
        WizardService.createWizardGraphQl(this.state.name, this.state.pages, this.state.creator).then(
            response => {
                this.setState({
                    message: response.data.createWizard,
                    successful: true,
                });
                this.props.history.push("/wizard")
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

    update(value) {
        const name = value.name
        const creator = {id: AuthService.getCurrentUser().id}
        const pages = value.pages.map(page => ({
            name: page.name,
            content: page.content,
            type: page.type,
            buttons: page.buttons && page.buttons.map(button => ({
                name: button.name,
                toPage: {
                    name: button.toPage,
                }
            }))
        }))

        this.setState({
            name: name,
            creator: creator,
            pages: pages
        })
        console.log(this.state)
        WizardService.updateWizardGraphQl(this.state.id, this.state.name, this.state.pages, this.state.creator).then(
            response => {
                this.setState({
                    message: response.data.updateWizard,
                    successful: true,
                });
                this.props.history.push("/wizard")
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


    onFinish = (value) => {
        console.warn(value, "!!!!!!!!!!!!!!!!!!!!!!!!!")
        this.setState({
            message: "",
            successful: false
        })
        if (this.state.id) {
            this.update(value)
        } else {
            this.create(value)
        }
    }

    test = (value) => {
        console.warn(value)
    }

    validPage(value, field) {
        var count = 0
        value.fields.pages.forEach(page => {
            if (page.name === field) {
                count++
            }
        })

        if (count >= 2) {
            return Promise.reject("This page name is already taken");
        } else {
            return Promise.resolve();
        }
    }

    validButton(value, field) {
        var count = 0
        value.fields.buttons.forEach(button => {
            if (button.name === field) {
                count++
            }
        })
        if (count >= 2) {
            return Promise.reject("This button name is already taken on this page");
        } else {
            return Promise.resolve();
        }
    }

    validType(value, field) {
        var count = 0
        value.fields.pages.forEach(page => {
            if (page.type === "START") {
                count++
            }
        })
        if (count > 1) {
            return Promise.reject("There can be only one START page");
        } else {
            return Promise.resolve();
        }
    }


    render() {
        return (
            <>
                <Form ref={this.formRef} name="dynamic_form_nest_item" onFinish={this.onFinish}
                      onFinishFailed={this.test}
                      onValuesChange={this.changeState}
                      initialValues={this.state.id && {
                          pages: this.state.pages,
                          name: this.state.name
                      }}>

                    {this.state.message && (
                        <Alert message={this.state.message} type={
                            this.state.successful
                                ? "success"
                                : "warning"
                        } showIcon/>
                    )

                    }



                    <Row>
                        <Form.Item
                            key="code"
                            name="name"
                            label="Wizard"
                            rules={[{
                                required: true,
                                message: "Wizard name is required"
                            }]}
                        >
                            <Input/>
                        </Form.Item>
                        <Form.Item>
                            <Button style={{marginLeft: 10}} type={"primary"} onClick={this.onReset}>
                                Reset fields
                            </Button>
                        </Form.Item>
                    </Row>


                    <Form.List name="pages">
                        {(pages, {add, remove}) => (
                            <>
                                {pages.map(page => (
                                    <>
                                        <Divider orientation="center">Page {page.name}</Divider>
                                        <Row gutter={[8, 8]}>


                                            {/*<Space key={page.key} size={10} align="start">*/}
                                            <Col flex={1}>
                                                <MinusCircleOutlined className="dynamic-delete-button"
                                                                     onClick={() => remove(page.name)}/>
                                            </Col>
                                            <Col flex={1}>
                                                <Form.Item
                                                    label="Name"
                                                    name={[page.name, 'name']}
                                                    fieldKey={[page.fieldKey, 'page']}
                                                    rules={[{
                                                        required: true,
                                                        message: "Page name is required"
                                                    }, {
                                                        fields: this.state,
                                                        validator: this.validPage
                                                    }]}
                                                >
                                                    <Input/>

                                                </Form.Item>
                                            </Col>
                                            <Col flex={1}>
                                                <Form.Item name={[page.name, 'type']}
                                                           fieldKey={[page.fieldKey, 'page']}
                                                           label="Type:"
                                                           rules={[{
                                                               required: true,
                                                               message: "Type is required"
                                                           }, {
                                                               fields: this.state,
                                                               validator: this.validType
                                                           }]}>
                                                    {/*{console.log(pages)}*/}
                                                    <Select
                                                        placeholder="Select a type"
                                                        allowClear
                                                    >
                                                        <Option value="START">START</Option>
                                                        <Option value="REGULAR">REGULAR</Option>
                                                        <Option value="FINISH">FINISH</Option>
                                                    </Select>
                                                </Form.Item>
                                            </Col>

                                            <Col flex={1}>
                                                <Form.Item
                                                    label="Content"
                                                    name={[page.name, 'content']}
                                                    fieldKey={[page.fieldKey, 'page']}
                                                    rules={[{
                                                        required: true,
                                                        message: "Page content is required"
                                                    }]}

                                                >
                                                    <Input/>

                                                </Form.Item>
                                            </Col>

                                            <Col flex={2}>
                                                <Form.Item
                                                    fieldKey={[page.fieldKey, page.key]}>
                                                    <Form.List name={[page.name, 'buttons']}>
                                                        {(buttons, {add, remove}) => (
                                                            <>
                                                                {buttons.map(button => (

                                                                    /*<Space key={button.key} size={10} align="start">*/
                                                                    <>
                                                                        <MinusCircleOutlined
                                                                            className="dynamic-delete-button"
                                                                            onClick={() => remove(button.name)}/>

                                                                        <Form.Item
                                                                            label="Button"
                                                                            name={[button.name, 'name']}
                                                                            fieldKey={[button.fieldKey, 'button']}
                                                                            rules={[{
                                                                                required: true,
                                                                                message: "Button name is required"
                                                                            }, {
                                                                                fields: this.state.pages[page.key],
                                                                                validator: this.validButton
                                                                            }]}
                                                                        >
                                                                            <Input/>
                                                                        </Form.Item>


                                                                        <Form.Item name={[button.name, 'toPage']}
                                                                                   fieldKey={[button.fieldKey, 'button']}
                                                                                   label="Link to:"
                                                                                   rules={[{
                                                                                       required: true,
                                                                                       message: "Button link is required"
                                                                                   }]}>
                                                                            {/*{console.log(pages)}*/}
                                                                            <Select
                                                                                placeholder="Select a option and change input text above"
                                                                                allowClear
                                                                            >
                                                                                {this.state.pages.map(selectpage => (
                                                                                    <Option
                                                                                        value={selectpage && selectpage.name}>{selectpage && selectpage.name}</Option>
                                                                                ))}
                                                                            </Select>
                                                                        </Form.Item>
                                                                    </>

                                                                    /*</Space>*/
                                                                ))}

                                                                <Form.Item>
                                                                    <Button type="dashed" onClick={() => add()} block
                                                                            icon={<PlusOutlined/>}>
                                                                        Add button
                                                                    </Button>
                                                                </Form.Item>
                                                            </>
                                                        )}
                                                    </Form.List>
                                                </Form.Item>
                                            </Col>

                                            {/*</Space>*/}


                                        </Row>
                                    </>
                                ))}

                                <Form.Item>
                                    <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined/>}>
                                        Add page
                                    </Button>
                                </Form.Item>
                            </>
                        )}
                    </Form.List>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Submit
                        </Button>
                    </Form.Item>



                </Form>
            </>

        );
    }
}

