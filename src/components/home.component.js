import React, {Component} from "react";

export default class Home extends Component {
    constructor(props) {
        super(props);

        this.state = {
            content: "Welcome to WizardApp"
        };
    }


    render() {
        return (

            <header>
                <h1>{this.state.content}</h1>
            </header>

        );
    }
}
