import '../styles/globals.css'
import 'antd/dist/antd.css';
import {Avatar, Button, Drawer, Layout, Menu, Space, Typography} from "antd"
import styled from "styled-components"
import { UploadOutlined, UserOutlined, VideoCameraOutlined, MenuOutlined, BulbOutlined, EyeOutlined } from '@ant-design/icons';
const { Header, Content, Footer } = Layout;
import React, {useState} from 'react';
import Link from "next/link.js"

const StyledHeader = styled(Header)`
  display: flex;
  align-items: center;
  background: white;
  justify-content: space-between;
  padding-left: 22px;
  padding-right: 22px;
  height: 54px;

  position:fixed;
  top:0;
  z-index:100;
  //box-shadow: 0 -6px 10px 5px rgba(0,0,0,0.2);
  
  width: 100vw;
  
  ul {
    margin: 0;
    padding: 0;
  }
`

const StyledDrawer = styled(Drawer)`
  .ant-drawer-body {
    padding: 0;
  }
`

function MyApp({ Component, pageProps }) {
    const [isMenuDrawerOpen, setIsMenuDrawerOpen] = useState(false)

    return (
    <Layout>
        <StyledHeader>
            <Typography.Title style={{margin: 0}} level={5}>🤖🎨 AI Image Generator</Typography.Title>

            <Button icon={<MenuOutlined />} type="ghost"
            onClick={() => setIsMenuDrawerOpen(true)}/>

            <StyledDrawer
              open={isMenuDrawerOpen}
              onClose={() => setIsMenuDrawerOpen(false)}
              placement="top"
            >
                <Menu
                  defaultSelectedKeys={['generate']}
                  onClick={() => setIsMenuDrawerOpen(false)}
                >
                    <Menu.Item key="generate" icon={<BulbOutlined/>}>
                        <Link href="/">
                            Generate
                        </Link>
                    </Menu.Item>
                    <Menu.Item key="view" icon={<EyeOutlined/>}>
                        <Link href="/view">
                            View
                        </Link>
                    </Menu.Item>
                </Menu>
            </StyledDrawer>
        </StyledHeader>

        <Layout>
          <Content>
              <Component {...pageProps} />
          </Content>
          <Footer
            style={{ textAlign: 'center'}}
          >
              Made by <a href="https://github.com/alexis-de-la-torre">Alexis De La Torre</a>
          </Footer>
        </Layout>
    </Layout>
    )
}

export default MyApp
