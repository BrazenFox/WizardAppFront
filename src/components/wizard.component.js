import React, {Component, Suspense} from "react";
import {Button, Space, Popconfirm, Table, Tag} from 'antd';
import WizardService from "../services/wizard.service";
import AuthService from "../services/auth.service";
const CreateWizardForm = React.lazy(() => import('./createwizard.component'))

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
                this.setState({
                    wizards: response.data

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
                                <Tag key={page}>
                                    {page.name}

                                    {page.buttons.map(button => {
                                        return (
                                            <Tag key={button}>
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

                render: (text) =>

                    (<Space size="middle">
                       {/* <Suspense fallback={<h1>downloading...</h1>}>
                            <UpdateUserForm id={text}/>
                        </Suspense>*/}
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
                <Suspense fallback={<h1>downloading...</h1>}>
                    <CreateWizardForm/>
                </Suspense>
                <Table columns={columns} dataSource={this.state.wizards}/>


            </div>
        );
    }
}
