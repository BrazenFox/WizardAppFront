import React, {Component, Suspense} from "react";
import {Button, Space, Popconfirm, Table, Tag} from 'antd';
import WizardService from "../services/wizard.service";
import AuthService from "../services/auth.service";
import {Link} from "react-router-dom";


export default class BoardUser extends Component {
    constructor(props) {
        super(props);
        this.state = {
            wizards: []
        };
    }


    deleteWizard(id) {
        WizardService.deleteWizard(id).then(() => this.componentDidMount());

        //window.location.reload();
        //this.props.history.push('/user')
    }

    componentDidMount() {
        WizardService.getWizards().then(
            response => {
                debugger;
                const wizards = response.data.map(wizard => ({
                    key: wizard.id, // I added this line
                    id: wizard.id,
                    name: wizard.name,
                    pages: wizard.pages.map(page =>({
                        key: page.id,
                        id: page.id,
                        name: page.name,
                        buttons: page.buttons.map(button =>({
                            key:button.id,
                            id:button.id,
                            name:button.name
                        }))
                    }))

                }))
                this.setState({
                    wizards: wizards

                });
                console.warn(this.state.wizards)
            },
            error => {
                //console.warn(error)
                this.setState({
                    users:
                        (error.response &&
                            error.response.data &&
                            error.response.data.message) ||
                        error.message ||
                        error.toString()
                });
            }
        );
    }


    render() {
        const columns = [
            {
                title: 'Wizard',
                dataIndex: 'name',
                key: 'name',
                //render: text => <a>{text}</a>,
            },
            {
                title: 'Data',
                dataIndex: 'pages',
                key: 'pages',
                render: pages => (
                    <>
                        {pages.map(page => {
                            return (
                                <Tag key={page.key}>
                                    {page.name}

                                    {page.buttons.map(button => {
                                        return (
                                            <Tag key={button.key}>
                                                {button.name}
                                            </Tag>
                                        );
                                    })}

                                </Tag>
                            );
                        })}
                    </>
                ),
            },
            {
                title: 'Action',
                dataIndex: 'id',
                key: 'id',

                render: (text, id) =>

                    (<Space size="middle">
                        <Link to={"/runwizard/"+text}>
                            run
                        </Link>
                        <Link to={"/updatewizard/"+text}>
                            update
                        </Link>
                        <Popconfirm title="Sure to delete?" onConfirm={() => this.deleteWizard(text)}>
                            <Button type="primary" danger>
                                Delete
                            </Button>
                        </Popconfirm>
                    </Space>)
                /*render: (text, dataSource) =>
                    this.state.users.length >= 1 ? (
                        <Popconfirm title="Sure to delete?" onConfirm={() => this.deleteUser(text)}>
                            <a>Delete</a>
                        </Popconfirm>
                    ) : null,*/

            },
        ];
        return (
            <div>
                <Link to={"/createwizard"}>
                    Create wizard
                </Link>
                <Table columns={columns} dataSource={this.state.wizards}/>


            </div>
        );
    }
}
