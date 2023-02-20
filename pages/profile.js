import { LogoutOutlined } from '@ant-design/icons';

import styled from "styled-components"
import {useUser} from "../auth/useUser.js"
import {Button, Typography} from "antd"

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

    return (
      <StyledDiv>
          {user && <Typography.Paragraph>Signed In as: {user.email}</Typography.Paragraph>}
          <Button
            onClick={() => logout(true)}
            icon={<LogoutOutlined />}
          >
              Log Out
          </Button>
      </StyledDiv>
    );
};

export default ProfilePage;
