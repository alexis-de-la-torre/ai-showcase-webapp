import { LogoutOutlined, MailOutlined } from '@ant-design/icons';

import styled from "styled-components"
import {useUser} from "../auth/useUser.js"
import {Avatar, Button, Row, Space, Typography} from "antd"

import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';

const StyledDiv = styled("div")`
  padding-top: 86px;
  min-height: 90vh;

  padding-right: 22px;
  padding-left: 22px;

  @media (min-width: 768px) {
    padding-right: 10vw;
    padding-left: 10vw;
  }

  @media (min-width: 1100px) {
    padding-right: 20vw;
    padding-left: 20vw;
  }
`

const ProfilePage = () => {
    const { user, logout } = useUser();

    const currentUser = firebase.auth().currentUser

    console.log(currentUser)

    if (!user || !currentUser) return (
      <StyledDiv>
          <Typography>Could not load user info</Typography>
      </StyledDiv>
    )

    return (
      <StyledDiv>
      <Typography.Title>Profile</Typography.Title>

        <Space direction="vertical" size="large">
            <Space align="center" size="middle">
                <Avatar size={64} src={currentUser.photoURL} />

                <Space direction="vertical" size={0}>
                    <Typography.Title
                      level={3}
                      style={{ margin: 0 }}
                    >
                        {currentUser.displayName}
                    </Typography.Title>

                    <Space align="center">
                        <MailOutlined />
                        <Typography>{user.email}</Typography>
                    </Space>
                </Space>
            </Space>

            <Row>
                <Button
                  onClick={() => logout(true)}
                  icon={<LogoutOutlined />}
                >
                    Log Out
                </Button>
            </Row>
        </Space>
      </StyledDiv>
    );
};

export default ProfilePage;
