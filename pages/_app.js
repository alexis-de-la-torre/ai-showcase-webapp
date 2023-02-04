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
  padding: 22px;

  position:fixed;
  top:0;
  z-index:100;
  box-shadow: 0 -6px 10px 5px rgba(0,0,0,0.2);
  
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

const StyledSpace = styled(Space)`
  display: flex;
  justify-content: center;
`

function MyApp({ Component, pageProps }) {
    const [isMenuDrawerOpen, setIsMenuDrawerOpen] = useState(false)

    return (
    <Layout>
        <StyledHeader>
            <Avatar src={"avatar.jpg"} size="large"/>

            <Button icon={<MenuOutlined />} type="ghost"
            onClick={() => setIsMenuDrawerOpen(true)}/>

            <StyledDrawer
              open={isMenuDrawerOpen}
              onClose={() => setIsMenuDrawerOpen(false)}
              placement="left"
            >
                <Menu
                  defaultSelectedKeys={['generate']}
                  // items={[
                  //     {
                  //         key: 1,
                  //         icon: React.createElement(BulbOutlined),
                  //         label: "Generate",
                  //     },
                  //     {
                  //         key: 1,
                  //         icon: React.createElement(EyeOutlined),
                  //         label: "View",
                  //     }
                  // ]}
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
            style={{
              textAlign: 'center',
            }}
          >
            Ant Design ©2023 Created by Ant UED
          </Footer>
        </Layout>
    </Layout>
    )
}

// const StyledDiv = styled('div')`
//     background-color: white;
//     position:fixed;
//     top:0;
//     z-index:100;
//     box-shadow: 0 -6px 10px 5px rgba(0,0,0,0.2);
// `

// function MyApp({ Component, pageProps }) {
//   return <>
//     <StyledDiv style={{
//       height: 50,
//       padding: 5,
//       paddingLeft: 20,
//       width: "100%",
//     }}>
//       <div style={{
//         marginLeft: "auto",
//         marginRight: "auto",
//         width: "fit-content",
//       }}>
//         <Avatar src={"avatar.jpg"} size="large"/>
//       </div>
//     </StyledDiv>
//
//     <Component {...pageProps} />
//   </>
// }

export default MyApp
