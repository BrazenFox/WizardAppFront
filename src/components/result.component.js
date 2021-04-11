import React, {Component, Suspense} from "react";
import {Button, Space, Popconfirm, Table, Tag} from 'antd';
import WizardService from "../services/wizard.service";
import AuthService from "../services/auth.service";
import ResultService from "../services/result.service";
import {Link} from "react-router-dom";


export default class ResultTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            results: []
        };
    }


    deleteWizard(id) {
        ResultService.deleteResult(id).then(() => this.componentDidMount());

        //window.location.reload();
        //this.props.history.push('/user')
    }

    componentDidMount() {

        ResultService.getResults(AuthService.getCurrentUser().id, AuthService.getCurrentUser().roles).then(
            response => {
                console.log(response.data)
                const results = response.data.map(result=>({
                    key:result.id,
                    id:result.id,
                    wizard: result.wizard.name,
                    user:result.user.username,
                    notes:result.note.map(n=>({
                        pageId:n.pageId,
                        buttonId:n.buttonId
                    }))

                }))
                console.log(results)
                this.setState({
                    results: results

                });
                console.warn(this.state.results)
            },
            error => {
                //console.warn(error)
            }
        );
    }


    render() {
        /*const columns = [
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
                /!*render: (text, dataSource) =>
                    this.state.users.length >= 1 ? (
                        <Popconfirm title="Sure to delete?" onConfirm={() => this.deleteUser(text)}>
                            <a>Delete</a>
                        </Popconfirm>
                    ) : null,*!/

            },
        ];*/
        return (<></>
           /* <div>
                <Table columns={columns} dataSource={this.state.results}/>
            </div>*/
        );
    }
}
