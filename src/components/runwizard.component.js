import React, {Component, Suspense, Fragment} from "react";
import {Button, Space, Popconfirm, Table, Tag} from 'antd';
import WizardService from "../services/wizard.service";
import AuthService from "../services/auth.service";
import ResultService from "../services/result.service";
import {Link} from "react-router-dom";


export default class RunWizard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentPage: "",
            id: this.props.match.params.id,
            name: "",
            creator: "",
            pages: [],
        };
        //console.log(this.state)
    }

    componentDidMount() {
        WizardService.getWizard(this.state.id).then(
            response => {
                debugger;
                console.log(response.data)
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
                        toPage: {
                            id: button.toPage.id,
                            name: button.toPage.name
                        }
                    }))


                }))
                const current = pages[0]//.find(page => page.number === 1)
                const currentPage = {
                    key: current.id,
                    id: current.id,
                    name: current.name,
                    content: current.content,
                    buttons: current.buttons.map(button => ({
                        key: button.id,
                        id: button.id,
                        name: button.name,
                        toPage: {
                            id: button.toPage.id,
                            name: button.toPage.name
                        }
                    }))
                }
                this.setState({
                    name: name,
                    creator: creator,
                    pages: pages,
                    currentPage: currentPage

                });
                //console.warn(this.state)
            },
            error => {
                console.warn(error)
                /*this.setState({
                    users:
                        (error.response &&
                            error.response.data &&
                            error.response.data.message) ||
                        error.message ||
                        error.toString()
                });*/
            }
        );


    }

    currentP(idnumber) {
        const p = this.state.pages.find(page => page.id === idnumber)
        //console.log(p)
        this.setState({currentPage: p})
        console.warn(this.state)
        ResultService.createResult(AuthService.getCurrentUser().id, this.state.id,"String")
        //console.log(this.state.currentPage, "!!!!!!!!!!!!!!")
        return (<></>
        )

    }


    render() {

        return (
            <>
                <div>
                    {this.state.name}
                </div>

                <div>

                    <li>{this.state.currentPage.name}</li>
                    <li>{this.state.currentPage.content}</li>
                    {this.state.currentPage && console.log(this.state.currentPage.buttons)}
                    {this.state.currentPage && this.state.currentPage.buttons.map((button) =>
                        (<Button key={button.key} onClick={() => this.currentP(button.toPage.id)}>
                            {button.name}
                        </Button>))}


                </div>

                {/* <dl>
                    {this.state.pages.map(page => (
                        // При отображении коллекций фрагменты обязательно должны иметь атрибут `key`
                        <Fragment key={page.id}>
                            <dt>{page.name}</dt>
                            <dd>{page.content}</dd>
                        </Fragment>
                    ))}
                </dl>*/}


            </>
        );
    }
}
