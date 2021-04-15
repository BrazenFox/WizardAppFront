import React, {Component, Suspense} from "react";
import {Button, Space, Popconfirm, Table, Tag} from 'antd';
import WizardService from "../services/wizard.service";
import AuthService from "../services/auth.service";
import {Link} from "react-router-dom";
import {PlusOutlined} from "@ant-design/icons";


export default class WizardTable extends Component {
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
                    creator: wizard.creator.username,
                    pages: wizard.pages.map(page => ({
                        key: page.id,
                        id: page.id,
                        name: page.name,
                        buttons: page.buttons.map(button => ({
                            key: button.id,
                            id: button.id,
                            name: button.name
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
                title: 'Creator',
                dataIndex: 'creator',
                key: 'creator',
                /* render: pages => (
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
                 ),*/
            },
            {
                title: 'Action',
                dataIndex: 'id',
                key: 'id',

                render: (text, id) =>

                    (<Space size="middle">
                        <Button type="primary" style={{background: "#73d13d", borderColor: "#73d13d"}}>
                            <Link to={"/runwizard/" + text}>
                                run
                            </Link>
                        </Button>
                        <Button type="primary">
                            <Link to={"/updatewizard/" + text}>
                                update
                            </Link>
                        </Button>

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
                <Button type="primary">
                    <Link to={"/createwizard"}>
                        <PlusOutlined/> Create wizard
                    </Link>
                </Button>

                <Table
                    bordered
                    columns={columns}
                    dataSource={this.state.wizards}/>


            </div>
        );
    }
}
