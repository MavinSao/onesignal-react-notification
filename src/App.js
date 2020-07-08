import './App.css';

import React, { Component } from 'react'
import OneSignal from 'react-onesignal';
import axios from 'axios'
export default class App extends Component {
    constructor() {
        super()
        this.state = {
            header: '',
            content: '',
            externalId: null,
            receivedId: null,

        }
    }
    componentWillMount() {
        let options = {
            allowLocalhostAsSecureOrigin: true,
            autoResubscribe: true,
            autoRegister: true,
            notifyButton: {
                enable: true,
                size: 'small',
                position: 'bottom-left',
                showCredit: true,
            }
        }
        OneSignal.initialize('7481e474-88d5-414e-9514-c425cf39e799', options);

    }
    componentDidMount() {
        this.get()
    }

    async setExId() {
        // Set external user ID
        console.log('set');

        OneSignal.setExternalUserId(this.state.externalId).then(res => {
            console.log(res);

        })
    }

    askPermision() {
        OneSignal.getNotificationPermission().then(val => {
            if (val === 'granted') {
                alert("Enabled")
            } else {
                OneSignal.registerForPushNotifications()
            }
        })


    }

    async get() {
        // OneSignal.setExternalUserId(1)
        let id = await OneSignal.getPlayerId()
        let exId = await OneSignal.getExternalUserId()
        alert(exId)
    }

    setNotiInfo = (e) => {
        let name = e.target.name
        let value = e.target.value
        this.setState({
            [name]: value
        })
    }

    pushNoti = () => {
        console.log('pushing');

        const noti = {
            app_id: "7481e474-88d5-414e-9514-c425cf39e799",
            "include_external_user_ids": [this.state.receivedId],
            headings: { "en": this.state.header },
            contents: { "en": this.state.content }
        }

        const headers = {
            "Content-Type": "application/json",
            Authorization: "Basic YjQzNDdlZDItMTU5Mi00ZWUzLWI3NzctNGQxMmFhYmM0NTA0",
        };
        axios.post('https://onesignal.com/api/v1/notifications', noti, { headers: headers }).then(res => {
            console.log(res);

        })

    }

    render() {
        return (
            <div style={{ marginLeft: "15px" }}>
                <h1>One Signal</h1>
                <h3>Set External Id</h3>
                <input type="text" placeholder="Enter External ID" name="externalId" onChange={this.setNotiInfo.bind(this)} />
                <button onClick={this.setExId.bind(this)}>Set External ID</button><br /><br />
                <button onClick={this.askPermision.bind(this)}>Ask Permission</button>
                <button onClick={this.get.bind(this)}>View ExID</button>
                <h2>Push Notification</h2>
                <form>
                    <table>
                        <tr>
                            <td>Header</td>
                            <td><input type="text" placeholder="Enter Header" name="header" onChange={this.setNotiInfo.bind(this)} /></td>
                        </tr>
                        <tr>
                            <td>Content</td>
                            <td><input type="text" placeholder="Enter Content" name="content" onChange={this.setNotiInfo.bind(this)} /></td>
                        </tr>
                        <tr>
                            <td>Received ID</td>
                            <td><input type="text" placeholder="Enter External ID" name="receivedId" onChange={this.setNotiInfo.bind(this)} /></td>
                        </tr>
                    </table>
                </form>
                <br />
                <button onClick={this.pushNoti.bind(this)}>Push Notification</button>

            </div>
        )
    }
}

