import React, {Component} from "react";
import {Button, Popconfirm, Space, Table} from 'antd';
import WizardService from "../services/wizard.service";
import {Link} from "react-router-dom";
import {PlusOutlined} from "@ant-design/icons";
import AuthService from "../services/auth.service";

export default class WizardTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            wizards: []
        };
    }


    deleteWizard(id) {
        WizardService.deleteWizardGraphQL(id).then(() => {
            this.componentDidMount()
        });

        //window.location.reload();
        //this.props.history.push('/user')
    }

    componentDidMount() {
        WizardService.getWizardsGraphQL().then(
            response => {
                debugger;
                const wizards = response.data.getWizards.map(wizard => ({
                    key: wizard.id, // I added this line
                    id: wizard.id,
                    name: wizard.name,
                    creator: wizard.creator.username,
                    creatorId:wizard.creator.id,
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
        const user = AuthService.getCurrentUser();
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
                        <Button type="primary"
                                disabled={!((user.roles.includes("MODERATOR") && user.id === this.state.wizards.find(wizard=>wizard.id===text).creatorId) || (user.roles.includes("ADMIN")))}>
                            <Link to={"/updatewizard/" + text}>
                                update
                            </Link>
                        </Button>

                        <Popconfirm title="Sure to delete?" onConfirm={() => this.deleteWizard(text)}>
                            <Button type="primary" danger disabled={!((user.roles.includes("MODERATOR") && user.id === this.state.wizards.find(wizard=>wizard.id===text).creatorId) || (user.roles.includes("ADMIN")))}>
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
