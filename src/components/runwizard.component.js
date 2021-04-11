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
            notes: []
        };
        //console.log(this.state)
    }

    componentDidMount() {
        WizardService.getWizard(this.state.id).then(
            response => {
                debugger;
                //console.log(response.data)
                const name = response.data.name
                const creator = response.data.creator
                const pages = response.data.pages.map(page => ({
                    key: page.id, // I added this line
                    id: page.id,
                    name: page.name,
                    content: page.content,
                    type: page.type,
                    buttons: page.buttons.map(button => ({
                        key: button.id,
                        id: button.id,
                        name: button.name,
                        toPage: {
                            id: button.toPage.id,
                            name: button.toPage.name,
                            type: button.toPage.type
                        }
                    }))


                }))
                //console.log(pages)
                const current = pages.find(page => page.type === "START")
                const currentPage = {
                    key: current.id,
                    id: current.id,
                    name: current.name,
                    content: current.content,
                    type: current.type,
                    buttons: current.buttons.map(button => ({
                        key: button.id,
                        id: button.id,
                        name: button.name,
                        toPage: {
                            id: button.toPage.id,
                            name: button.toPage.name,
                            type: button.toPage.type
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

    currentP(toPageId, pageId, buttonId) {
        const currentPage = this.state.pages.find(page => page.id === toPageId)
        const notes = this.state.notes
        notes.push({
            pageId: pageId,
            buttonId: buttonId
        })
        this.setState({
            currentPage: currentPage,
            notes: notes
        })
        if (this.state.pages.find(page => page.id === toPageId).type === "FINISH") {
            console.log("FINISH")
            ResultService.createResult(AuthService.getCurrentUser().id, this.state.id, notes)
        }
        /*return (<></>
        )*/

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
                        (<Button key={button.key} onClick={() => this.currentP(button.toPage.id,this.state.currentPage.id, button.id)}>
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
