import React, {Component, Suspense, Fragment} from "react";
import {Button, Space, Popconfirm, Table, Tag, Card, Avatar} from 'antd';
import WizardService from "../services/wizard.service";
import AuthService from "../services/auth.service";
import ResultService from "../services/result.service";
import '../App.css'
import {Link} from "react-router-dom";

const {Meta} = Card
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
        WizardService.getWizardGraphQL(this.state.id).then(
            response => {
                debugger;
                //console.log(response.data)
                const name = response.data.getWizard.name
                const creator = response.data.getWizard.creator
                const pages = response.data.getWizard.pages.map(page => ({
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
            page: {id: pageId},
            button: {id: buttonId}
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
            <div className="form-wizard form-wizard-container">
                <div className="form-title">
                    <Avatar size={40}>{this.state.creator && this.state.creator.username.toUpperCase()}</Avatar>
                    "{this.state.name}"
                </div>
                <div className="form-name">{this.state.currentPage.name}</div>
                <div className="form-wizard form-content">{this.state.currentPage.content}</div>
                <div className="form-buttons">
                    {this.state.currentPage && this.state.currentPage.buttons.map((button) =>
                        (<Button key={button.key} className="form-button" type={"primary"}
                                 onClick={() => this.currentP(button.toPage.id, this.state.currentPage.id, button.id)}>
                            {button.name}
                        </Button>))}
                </div>
            </div>
        );
    }
}

