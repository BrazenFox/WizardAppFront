import React, {Component} from "react";
console.log(process.env)
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

            <header>
                <h1>{this.state.content}  +  {example1} +  {example2} </h1>
            </header>

        );
    }
}
