import React from 'react'
// import { Button } from 'antd'// import Button from 'antd/lib/button'; 
import './App'
import { BrowserRouter, HashRouter, Route, Switch } from 'react-router-dom'
import Login from './pages/login/login';
import Admin from './pages/admin/admin';
// import 'antd/dist/antd.css';
//我是分支
export default class App extends React.Component {
    render() {
        return (
            <BrowserRouter>
                <Switch>
                    <Route path="/login" component={Login}></Route>
                    <Route path="/admin" component={Admin}></Route>
                </Switch>
            </BrowserRouter>
        )
    }

}