import React from "react";
import "antd/dist/antd.css";
import {Alert, Button, Checkbox, Drawer, Form, Input, Row, Select, Space, InputNumber} from "antd";
import {MinusCircleOutlined, PlusOutlined} from "@ant-design/icons";
import CreateWizard from "../services/wizard.service"
import AuthService from "../services/auth.service"
const {Option} = Select;


export default class DrawerForm extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            name:"",
            pages:[],
            creator:""
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
            creator:{id:AuthService.getCurrentUser().id},
            pages: value.pages.map(page =>({
                name: page.name,
                content: page.content,
                number: page.number,
                buttons: page.buttons.map(button =>({
                    name:button.name,
                    toPage:button.toPage
                }))
            }))
        })
        console.log(this.state)
        CreateWizard.createWizard(this.state.name, this.state.pages, this.state.creator)
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
                                            label="Name"
                                            name={[page.name, 'name']}
                                            fieldKey={[page.fieldKey, 'page']}

                                        >
                                            <Input/>

                                        </Form.Item>

                                        <Form.Item
                                            label="Content"
                                            name={[page.name, 'content']}
                                            fieldKey={[page.fieldKey, 'page']}

                                        >
                                            <Input/>

                                        </Form.Item>

                                        <Form.Item
                                            label="Number"
                                            name={[page.name, 'number']}
                                            fieldKey={[page.fieldKey, 'page']}

                                        >
                                            <InputNumber min={1}/>

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

                                                                <Form.Item
                                                                    label="To Page"
                                                                    name={[button.name, 'toPage']}
                                                                    fieldKey={[button.fieldKey, 'button']}
                                                                >
                                                                    <InputNumber min={1} />
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