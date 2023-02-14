import {Alert, Button, Card, Collapse, Input, InputNumber, message, Select, Space, Tag, Typography} from "antd"
import Image from "next/image.js"
import {useState} from "react"
import withAuth from "../auth/withAuth.js"
import fetchClient from "../fetchClient.js"
import styled from "styled-components"

const westworldAddr = process.env.NEXT_PUBLIC_API_ADDR + "/api/v1/generations";

const StyledCollapse = styled(Collapse)`
  .ant-collapse-header {
    padding: 0;
  }
`

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

const StyledAlert = styled(Alert)`
  line-height: 1.3;
  font-size: x-small;
`

function GeneratePage() {
    const defaultPrompt = "painting of a beautiful woman surrounded by flowers"
    const defaultSteps = 35;

    const [messageApi, contextHolder] = message.useMessage()

    const [imgSrc, setImageSrc] =
      useState("https://storage.googleapis.com/ai-showcase-stg/006c810e-7d7f-4ef6-b7bf-36fef454677a.jpg")
    const [prompt, setPrompt] = useState(defaultPrompt)
    const [loading, setLoading] = useState(false)
    const [model, setModel] = useState("stable-diffusion")
    const [steps, setSteps] = useState(defaultSteps)

    const [nextPrompt, setNextPrompt] = useState(defaultPrompt)

    const handleGenerate = () => {
        setLoading(true)

        const params =
          new URLSearchParams({ promp: nextPrompt, qty: 1, steps: steps })

        fetchClient.get(westworldAddr + "/" + model + "?" + params)
          .then(res => res.data)
          .then(body => {
              console.log(body)

              setImageSrc(body.urls[0])
              setLoading(false)
              setPrompt(nextPrompt)
          })
          .catch(error => {
              if (error.response && error.response.status === 429) {
                  messageApi.open({
                      type: 'error',
                      content: "Generation limit reached, try again in an hour. Or Sign In to enjoy a bigger limit.",
                  });
              }

              console.error(error)

              setLoading(false)
          });
    }

    const handleModelChange = model => {
        setModel(model)
    }

    const handleWrite = ev => {
        setNextPrompt(ev.target.value)
    }

    return (
      <StyledDiv>
          {contextHolder}
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
              <StyledAlert
                message={<span><strong>Write anything</strong> in the text box, then press the button. <br/> An <strong>Artificial Intelligence</strong> Model will try its best to generate an image based on your text.</span>}
                type="info"
                showIcon
                closable
              />

              <Card>
                  <Space direction="vertical" style={{ width: '100%' }}>
                      <Input.TextArea
                        allowClear
                        rows={3}
                        loading={loading}
                        onChange={handleWrite}
                        defaultValue={defaultPrompt}
                      />

                      <StyledCollapse size="small" open>
                          <Collapse.Panel header="Advanced Options" key="0" >
                              <Space direction="vertical">
                                  <Space>
                                      <Typography>Model:</Typography>
                                      <Select
                                        defaultValue="stable-diffusion"
                                        onChange={handleModelChange}
                                        options={[
                                            { label: "Stable Diffusion", value: "stable-diffusion" },
                                            { label: "Karlo", value: "karlo" },
                                        ]}
                                        style={{ minWidth: 150 }}
                                      />
                                  </Space>

                                  <Space>
                                      <Typography>Steps:</Typography>
                                      <InputNumber
                                        min={1}
                                        max={50}
                                        defaultValue={defaultSteps}
                                        onChange={n => setSteps(n)}
                                        style={{ minWidth: 150 }}
                                      />
                                  </Space>
                              </Space>
                          </Collapse.Panel>
                      </StyledCollapse>



                          <Button
                            type="primary"
                            block
                            onClick={handleGenerate}
                            loading={loading}
                            size="large"
                          >
                              Generate
                          </Button>
                  </Space>
              </Card>

              <Card
                cover={
                  <Image
                    width={780}
                    height={844}
                    src={imgSrc}
                    alt="alt"
                    layout="responsive"
                  />
                }
              >

                  <Space direction="vertical">
                      <Card.Meta description={prompt}/>
                      <Tag>{model === "karlo" ? "Created by the Karlo AI Model" : "Created by the Stable Difussion AI Model"}</Tag>
                  </Space>
              </Card>
          </Space>
      </StyledDiv>
    )
}

export default withAuth(GeneratePage)
