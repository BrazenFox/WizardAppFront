import React from "react";
import "antd/dist/antd.css";
import {Button, Form, Input, InputNumber, Row, Select, Space} from "antd";
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
            /*pages_1: [{
                name: "",
                content: "",
                buttons: [{
                    name: "",
                    toPage: ""
                }]
            }
            ]*/
        }
        //console.log(this.state.id)


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
            WizardService.getWizard(this.state.id).then(
                response => {
                    //console.log(response.data, "!!!!!!!!!!!!!!!!!")
                    const name = response.data.name
                    const creator = response.data.creator
                    const pages = response.data.pages.map(page => ({
                        key: page.id, // I added this line
                        id: page.id,
                        name: page.name,
                        content: page.content,
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
            content: page.content,
            buttons: page.buttons && page.buttons.map(button => ({
                name: button.name,
                toPage: {
                    name: button.toPage,
                }
            }))
        }))
        /*console.log(new Set(pages.map(a => a.name)).size === pages.length)
        console.log(!pages.map(page => (page.buttons && new Set(page.buttons.map(button => button.name)).size === page.buttons.length)).some(elem => elem === false))*/
        this.setState({
            name: name,
            creator: creator,
            pages: pages
        })
        WizardService.createWizard(this.state.name, this.state.pages, this.state.creator)
    }

    update(value) {
        const name = value.name
        const creator = {id: AuthService.getCurrentUser().id}
        const pages = value.pages.map(page => ({
            name: page.name,
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
        console.log(this.state)
        WizardService.updateWizard(this.state.id, this.state.name, this.state.pages, this.state.creator)
    }


    onFinish = (value) => {
        console.warn(value, "!!!!!!!!!!!!!!!!!!!!!!!!!")
        if (this.state.id) {
            this.update(value)
        } else {
            this.create(value)
        }

    }

    test=(value)=>{
        console.warn(value)
    }

    validPage(value, field) {
        var count = 0
        value.fields.pages.forEach(page => {
            if(page.name===field){
                count++
            }
        })

        if(count>=2){
            return Promise.reject("This page name is already taken");
        }
        else {
            return Promise.resolve();
        }
    }

    validButton(value, field) {
        var count = 0
        value.fields.buttons.forEach(button => {
            if(button.name===field){
                count++
            }
        })
        if(count>=2){
            return Promise.reject("This button name is already taken on this page");
        }
        else {
            return Promise.resolve();
        }
    }


    render() {
        return (
            <>
                <Form ref={this.formRef} name="dynamic_form_nest_item" onFinish={this.onFinish} onFinishFailed={this.test}
                      onValuesChange={this.changeState}
                      initialValues={this.state.id && {
                          pages: this.state.pages,
                          name: this.state.name
                      }}>
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
                                                                    rules={[{
                                                                        required: true,
                                                                        message: "Button name is required"
                                                                    },{fields: this.state.pages[page.key],
                                                                        validator:this.validButton}]}
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

                                        {/*</Space>*/}


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

