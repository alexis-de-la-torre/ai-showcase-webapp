import '../styles/globals.css'
import 'antd/dist/antd.css';
import {Avatar, Divider, Layout, Menu, Space, Typography} from "antd"
import styled from "styled-components"
import { UserOutlined } from '@ant-design/icons';
const { Header, Content, Footer } = Layout;
import React, {useEffect} from 'react';
import Link from "next/link.js"

import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import {useUser} from "../auth/useUser.js"
import Head from "next/head.js"
import Script from "next/script.js"
import TagManager from "react-gtm-module/dist/TagManager.js"

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
    const { user} = useUser();

    useEffect(() => {
        TagManager.initialize({ gtmId: 'GTM-5TXVP3Q' });
    }, [])

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
          <Head>
              <title>AI Image Creator - Free - No Signup - Generate Images with Text2Img Artificial Intelligence models</title>
          </Head>

          <Script>
              {`
                (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                      new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                      j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                      'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                  })(window,document,'script','dataLayer','GTM-5TXVP3Q');
              `}
          </Script>

          <Script strategy="lazyOnload" src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}`} />

          <Script strategy="lazyOnload">
              {`
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}
                    gtag('js', new Date());
                    gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}', {
                    page_path: window.location.pathname,
                    });
                `}
          </Script>

          <Script src="https://www.googleoptimize.com/optimize.js?id=OPT-NTG36X4"></Script>

          <noscript>
              <iframe src="https://www.googletagmanager.com/ns.html?id=GTM-5TXVP3Q"
                            height="0" width="0" style={{ display: "none", visibility: "hidden" }}>
              </iframe>
          </noscript>

          <StyledHeader>
              <Link href="/">
                  <Space align="center" style={{ minWidth: 180 }}>
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
                style={{ width: "100%" }}
              >
                  <Menu.Item key="generate" style={{ width: 80 }}>
                      <Link href="/">
                          Generate
                      </Link>
                  </Menu.Item>
                  {!user || (user && !user.email) && (
                    <Menu.Item key="login" style={{ width: 70 }}>
                        <Link href="/signin">
                            Sign In
                        </Link>
                    </Menu.Item>
                  )}
                  {user && user.email && <>
                        <Menu.Item key="user" style={{ width: 40 }}>
                            <Link href="/profile">
                                {user.currentUser ?
                                  <Avatar src={user.currentUser.photoURL} />
                                : <Avatar icon={<UserOutlined />} />}

                            </Link>
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
                  <Typography.Text>🤖🎨</Typography.Text>
              </Footer>
          </Layout>
      </Layout>
    )
}

export default MyApp
