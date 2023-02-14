import '../styles/globals.css'
import 'antd/dist/antd.css';
import {Layout, Menu, Space, Typography} from "antd"
import styled from "styled-components"
import { BulbOutlined, EyeOutlined, LogoutOutlined, LoginOutlined } from '@ant-design/icons';
const { Header, Content, Footer } = Layout;
import React, {useEffect} from 'react';
import Link from "next/link.js"

import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import {useUser} from "../auth/useUser.js"

const firebaseConfig = {
    apiKey: "AIzaSyD5LaNkP0J-fJMUOHBKXmf5FwB8PXYzgtA",
    authDomain: "adlt-2.firebaseapp.com",
    projectId: "adlt-2",
    storageBucket: "adlt-2.appspot.com",
    messagingSenderId: "270361315804",
    appId: "1:270361315804:web:7114ffa2b93b4172b7a719"
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig)
}

const StyledHeader = styled(Header)`
  display: flex;
  align-items: center;
  background: white;
  justify-content: space-between;
  padding-left: 22px;
  padding-right: 0;
  height: 64px;

  position:fixed;
  top:0;
  z-index:100;
  
  width: 100vw;
  
  ul {
    margin: 0;
    padding: 0;
  }
`

function MyApp({ Component, pageProps }) {
    const { user, logout } = useUser();

    useEffect(() => {
        // TODO: Figure out why timing breaks AuthUI

        let t;

        if (!user) {
            t = setTimeout(() => {
                console.log("No user, anonymous login")
                firebase.auth().signInAnonymously()
            }, 500)
        }

        return () => {
            clearTimeout(t)
        }
    }, [user])

    return (
      <Layout>
          <StyledHeader>
              <Link href="/">
                  <Space align="center" style={{ minWidth: 200, marginRight: 22 }}>
                      <Typography.Title
                        style={{margin: 0}}
                        level={5}
                      >
                          🤖🎨
                      </Typography.Title>
                      <Typography.Title
                        style={{margin: 0, lineHeight: 1}}
                        level={5}
                      >
                          AI Image Creator
                      </Typography.Title>
                  </Space>
              </Link>

              <Menu
                defaultSelectedKeys={['generate']}
                mode="horizontal"
                style={{ width: "50%" }}
              >
                  <Menu.Item key="generate" icon={<BulbOutlined/>}>
                      <Link href="/">
                          Generate
                      </Link>
                  </Menu.Item>
                  {/*<Menu.Item key="view" icon={<EyeOutlined/>}>*/}
                  {/*    <Link href="/view">*/}
                  {/*        View*/}
                  {/*    </Link>*/}
                  {/*</Menu.Item>*/}
                  {!user || (user && !user.email) && (
                    <Menu.Item key="login" icon={<LoginOutlined />}>
                        <Link href="/signin">
                            Sign In
                        </Link>
                    </Menu.Item>
                  )}
                  {user && user.email && <>
                        <Menu.Item key="logout" icon={<LogoutOutlined />}>
                            <Link href="#" legacyBehavior>
                                <a onClick={() => logout(false)}>Log Out</a>
                            </Link>
                        </Menu.Item>
                        <Menu.Item key="user">
                            {user.email}
                        </Menu.Item>
                  </>}
              </Menu>
          </StyledHeader>

          <Layout>
              <Content>
                  <Component {...pageProps} />
              </Content>
              <Footer
                style={{ textAlign: 'center'}}
              >
                  {/*Made by <a href="https://github.com/alexis-de-la-torre">Alexis De La Torre</a>*/}
                  <Typography.Text>--</Typography.Text>
              </Footer>
          </Layout>
      </Layout>
    )
}

export default MyApp
