import React, {Component} from "react";
import {Table} from 'antd';
import AuthService from "../services/auth.service";
import ResultService from "../services/result.service";


export default class ResultTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            results: [],
        };
        console.log(this.props)
    }


    deleteResult(id) {
        ResultService.deleteResult(id).then(() => this.componentDidMount());

        //window.location.reload();
        //this.props.history.push('/user')
    }

    setValues() {
        ResultService.getResultsForCreator(AuthService.getCurrentUser().id, AuthService.getCurrentUser().roles).then(
            response => {
                console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
                const results = response.data.map(result => ({
                    key: result.id,
                    id: result.id,
                    creator: result.wizard.creator,
                    wizard: result.wizard.name,
                    user: result.user.username,
                    date: result.date,
                    notes: result.note.map(n => ({
                        key: n.page.id,
                        page: n.page.name,
                        button: n.button.name
                    }))

                }))
                console.log(results)
                this.setState({
                    results: results

                });

                console.warn(this.state.results)
            },
            error => {
                console.warn(error)
            }
        );
    }

    componentDidMount() {
        this.setValues()
    }


    render() {
        const columns = [
            {
                title: 'Creator',
                dataIndex: 'creator',
                key: 'creator',
            },
            {
                title: 'Wizard',
                dataIndex: 'wizard',
                key: 'wizard',
            },
            {
                title: 'User',
                dataIndex: 'user',
                key: 'user',
            },
            {
                title: 'Date',
                dataIndex: 'date',
                key: 'date',
            },
        ];
        const columnsNotes = [
            {
                title: 'Page',
                dataIndex: 'page',
                key: 'page',
                //render: text => <a>{text}</a>,
            },
            {
                title: 'Button',
                dataIndex: 'button',
                key: 'button',
            },
        ];

        function notesTable(data) {
            console.log(data)
            return <Table bordered
                          columns={columnsNotes}
                          dataSource={data}
            />
        }

        return (
            <div>
                <></>
                <Table
                    bordered
                    title={() => 'Results of the wizards you created'}
                    columns={columns}
                    expandIconColumnIndex={0}
                    expandable={{
                        expandedRowRender: record => <p style={{margin: 10}}>{notesTable(record.notes)}</p>,
                    }}
                    dataSource={this.state.results}/>
            </div>
        );
    }
}
