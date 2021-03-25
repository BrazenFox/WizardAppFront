import React from "react";
import "antd/dist/antd.css";
import {Alert, Button, Checkbox, Drawer, Form, Input, Row, Select, Space} from "antd";
import {MinusCircleOutlined, PlusOutlined} from "@ant-design/icons";
import CreateWizard from "../services/wizard.service"
const {Option} = Select;


export default class DrawerForm extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            name:"",
            pages:[]
            /*pages: [].map(page =>({
                name:"",
                buttons: [].map(button =>({
                    name:[]
                }))
            }))*/
        }

    }



    onFinish = (value) => {
        console.warn(value)
        this.setState({
            name:value.name,
            pages: value.pages.map(page =>({
                name: page.name,
                buttons: page.buttons.map(button =>({
                    name:button.name
                }))
            }))
        })
        console.log(this.state)
        CreateWizard.createWizard(this.state.name, this.state.pages)
    }

    /*rules={[{
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
                                                    ]}*/
    render() {
        return (
            <>
                <Form name="dynamic_form_nest_item" onFinish={this.onFinish} autoComplete="off">
                    <Row>
                        <Form.Item
                            name="name"
                            label="Wizard"
                        >
                            <Input placeholder="Please enter wizard name"
                                   type="text"
                                   name="name"
                                   value="name"/>
                        </Form.Item>
                    </Row>

                    <Form.List name="pages">
                        {(pages, {add, remove}) => (
                            <>
                                {pages.map(page => (
                                    <Row>

                                        {/*<Space key={page.key} align="baseline">*/}

                                        <Form.Item
                                            label="Page"
                                            name={[page.name, 'name']}
                                            fieldKey={[page.fieldKey, 'page']}

                                        >
                                            <Input/>

                                        </Form.Item>


                                        <Form.Item
                                            fieldKey={[page.fieldKey, page.key]}>
                                            <Form.List name={[page.name, 'buttons']}>
                                                {(buttons, {add, remove}) => (
                                                    <>
                                                        {buttons.map(button => (

                                                            /*<Space key={button.key} align="baseline">*/
                                                            <>

                                                                <Form.Item
                                                                    label="Button"
                                                                    name={[button.name, 'name']}
                                                                    fieldKey={[button.fieldKey, 'button']}
                                                                >
                                                                    <Input/>
                                                                </Form.Item>

                                                                <MinusCircleOutlined
                                                                    onClick={() => remove(button.name)}/>
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
                                            <MinusCircleOutlined onClick={() => remove(page.name)}/>


                                        </Form.Item>

                                        {/* </Space>*/}


                                    </Row>
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