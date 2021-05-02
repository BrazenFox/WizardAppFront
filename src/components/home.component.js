import React, {Component} from "react";
import wizardLogo from'./wizard.png';
const example1 = process.env.REACT_APP_PROXY;
const example2 = process.env.REACT_APP_SERVER_URL;
export default class Home extends Component {
    constructor(props) {
        super(props);

        this.state = {
            content: "Welcome to WizardApp"
        };
    }


    render() {
        return (

            <div className="container">
                <header>
                    <h1>{this.state.content}</h1>
                </header>
                <img  src={wizardLogo} />
            </div>


        );
    }
}
