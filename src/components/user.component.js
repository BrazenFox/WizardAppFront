import React, {Component, Suspense} from "react";
import {Button, Popconfirm, Space, Table, Tag} from 'antd';
import UserService from "../services/user.service";
import AuthService from "../services/auth.service";

const UserForm = React.lazy(() => import('./userform.component'))


export default class UserTable extends Component {
    constructor(props) {
        super(props);
        this.setUsers = this.setUsers.bind(this)
        this.state = {
            users: []
        };
    }


    deleteUser(id) {
        UserService.deleteUser(id).then(() => this.setUsers())
    }




   setUsers(){
        UserService.getUsers().then(
            response => {
                debugger;
                const users= response.data.map(user => ({
                    key: user.id, // I added this line
                    username: user.username,
                    password: user.password,
                    roles: user.roles,
                    id: user.id
                }))
                {console.warn(users)}
                this.setState({
                    users: users

                });
            },
            error => {
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


    componentDidMount() {
        this.setUsers()
    }


    render() {
        const columns = [
            {
                title: 'Username',
                dataIndex: 'username',
                key: 'username',
            },
            {
                title: 'Password',
                dataIndex: 'password',
                key: 'password',
            },
            {
                title: 'Roles',
                key: 'roles',
                dataIndex: 'roles',
                render: roles => (
                    <>
                        {roles.map(role => {
                            let color;
                            if (role.name === 'ADMIN') {
                                color = 'volcano';
                            } else if (role.name === 'MODERATOR') {
                                color = 'geekblue';
                            } else {
                                color = 'green';
                            }
                            return (
                                <Tag color={color} key={role}>
                                    {role.name}
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

                render: (text) =>

                    (<Space size="middle">
                        <Suspense fallback={<h1>downloading...</h1>}>
                            <UserForm id={text} set = {this.setUsers}/>
                        </Suspense>
                        <Popconfirm title="Sure to delete?" disabled={AuthService.getCurrentUser().id === text}
                                    onConfirm={() => this.deleteUser(text)}>
                            <Button type="primary" danger disabled={AuthService.getCurrentUser().id === text}>Delete
                            </Button>
                        </Popconfirm>
                    </Space>)
            },
        ];
        return (
            <div>

                <Suspense fallback={<h1>downloading...</h1>}>
                    <UserForm set = {this.setUsers}/>
                </Suspense>
                <Table columns={columns} dataSource={this.state.users}/>


            </div>
        );
    }
}
