import {
    Alert,
    Button,
    Card,
    Collapse,
    Divider,
    Form,
    Input,
    InputNumber,
    message,
    Select,
    Space,
    Tag,
    Typography
} from "antd"
import {ClockCircleOutlined} from '@ant-design/icons';
import Image from "next/image.js"
import {useEffect, useRef, useState} from "react"
import withAuth from "../auth/withAuth.js"
import fetchClient from "../fetchClient.js"
import styled from "styled-components"
import {useUser} from "../auth/useUser.js"

const API_ADDR =
  process.env.NEXT_PUBLIC_API_ADDR;

const DEFAULT_IMAGE =
  "https://storage.googleapis.com/ai-showcase-stg/006c810e-7d7f-4ef6-b7bf-36fef454677a.jpg"

const DEFAULT_PROMPT = "painting of a beautiful woman surrounded by flowers"

const DEFAULT_MODEL = "stable-diffusion"

const DEFAULT_STEPS = 35

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
  line-height: 1.4;
`

const Instructions = (
  <span>
      1. <strong>Write anything</strong> in the text box. <br/>
      2. <strong>Click</strong> the <strong>Generate</strong> button. <br/>
      3. An <strong>Artificial Intelligence</strong> Model will try its best to <strong>generate an image</strong> based on your text.
  </span>
)

function GeneratePage() {
    const { user } = useUser();

    const [messageApi, contextHolder] = message.useMessage()
    const [form] = Form.useForm();

    const textBox = useRef(null)
    const image = useRef(null)

    const [loading, setLoading] = useState(false)
    const [loadingRandom, setLoadingRandom] = useState(false)
    const [disabled, setDisabled] = useState(false)

    const [imgSrc, setImageSrc] = useState(DEFAULT_IMAGE)
    const [prompt, setPrompt] = useState(DEFAULT_PROMPT)
    const [model, setModel] = useState(DEFAULT_MODEL)

    useEffect(() => {
        if (textBox.current) {
            textBox.current.focus()
            window.scrollTo(0, 0)
        }
    }, [textBox])

    const handleGenerate = values => {
        if (values.prompt === "") {
            messageApi.open({
                type: 'warning',
                content: "Write something in the text box, or click on Generate Random.",
            });

            textBox.current.focus()

            return
        }

        if (!values.model) values.model = DEFAULT_MODEL
        if (!values.steps) values.steps = DEFAULT_STEPS

        window.dataLayer.push({
            event: 'GENERATE_EVENTS',
            eventProps: {
                action: 'generate click',
                category: 'interaction',
                label: `${values.prompt} - ${values.model} - ${values.steps} steps`,
                value: 1
            }
        });

        setLoading(true)

        setModel(values.model)

        const params = new URLSearchParams({
            promp: values.prompt,
            qty: 1,
            steps: values.steps,
        })

        fetchClient.get(API_ADDR + "/api/v1/generations/" + model + "?" + params)
          .then(res => res.data)
          .then(body => {
              window.dataLayer.push({
                  event: 'GENERATE_EVENTS',
                  eventProps: {
                      action: 'generate receive success',
                      category: 'interaction',
                      label: body.urls[0],
                      value: 1
                  }
              });

              setImageSrc(body.urls[0])
              setPrompt(values.prompt)

              image.current.scrollIntoView({
                  behavior: 'smooth',
                  block: 'center',
              })

              setLoading(false)
          })
          .catch(error => {
              window.dataLayer.push({
                  event: 'GENERATE_EVENTS',
                  eventProps: {
                      action: 'generate receive error',
                      category: 'interaction',
                      label: error.response ? error.response.status : '',
                      value: 1
                  }
              });

              if (error.response && error.response.status === 429) {
                  const msgAnon = "Generation limit reached, try again in an hour." +
                    " Or Sign In to enjoy a bigger limit."
                  const msgUser = "Generation limit reached, try again in an hour."

                  messageApi.open({
                      type: 'error',
                      content: user.email ? msgUser : msgAnon,
                  });
              } else {
                  messageApi.open({
                      type: 'error',
                      content: "There was an unexpected error, please try again later.",
                  });
              }

              console.error(error)

              setLoading(false)
          });
    }

    const handleRegenerate = () => {
        form.setFieldsValue({
            prompt: prompt
        })

        window.scrollTo(0, 0, {behavior: 'smooth'})

        form.submit()

        setDisabled(false)
    }

    const handleGenerateRandom = () => {
        setLoadingRandom(true)
        setDisabled(true)

        window.scrollTo(0, 0, {behavior: 'smooth'})

        const params = new URLSearchParams({
            promp: "<BOP>",
        })

        fetchClient.get(API_ADDR + "/api/v1/generations/prompt-parrot" + "?" + params)
          .then(res => res.data)
          .then(body => {
              console.log(body.prompts)

              form.setFieldsValue({
                  prompt: body.prompts[0]
              })


              form.submit()

              setDisabled(false)

              setLoadingRandom(false)
          })
          .catch(error => {
              window.dataLayer.push({
                  event: 'GENERATE_EVENTS',
                  eventProps: {
                      action: 'generate random receive error',
                      category: 'interaction',
                      label: error.response ? error.response.status : '',
                  }
              });

              messageApi.open({
                  type: 'error',
                  content: "There was an unexpected error, please try again later.",
              });

              setDisabled(false)

              setLoadingRandom(false)

              console.error(error)
          });
    }

    function handleKeyUp(event) {
        if (event.keyCode === 13) {
            form.submit();
        }
    }

    return (
      <StyledDiv>
          {contextHolder}
          <Space direction="vertical" size="middle" style={{width: '100%'}}>
              <StyledAlert
                message={Instructions}
                type="info"
                closable
              />

              <Card>
                  <Form
                    name="generate"
                    initialValues={{
                        prompt: "",
                        model: 'stable-diffusion',
                        steps: 35
                    }}
                    onFinish={handleGenerate}
                    form={form}
                    onKeyUp={handleKeyUp}
                  >
                      <Space direction="vertical" style={{width: '100%'}}>
                          <Form.Item
                            label="What do you want to see?"
                            name="prompt"
                            style={{margin: 0}}
                          >
                              <Input.TextArea
                                allowClear
                                rows={5}
                                loading={loading}
                                ref={textBox}
                              />
                          </Form.Item>

                          <StyledCollapse size="small" open>
                              <Collapse.Panel header="Advanced Options" key="0">
                                  <Form.Item label="Model" name="model">
                                      <Select
                                        options={[
                                            {
                                                label: "Stable Diffusion",
                                                value: "stable-diffusion",
                                            },
                                            {
                                                label: "Karlo",
                                                value: "karlo"
                                            },
                                        ]}
                                      />
                                  </Form.Item>

                                  <Form.Item label="Steps" name="steps">
                                      <InputNumber min={1} max={50}/>
                                  </Form.Item>
                              </Collapse.Panel>
                          </StyledCollapse>

                          <Form.Item style={{margin: 0}}>
                              <Button
                                type="primary"
                                block
                                loading={loading}
                                size="large"
                                htmlType="submit"
                                disabled={disabled}
                              >
                                  Generate
                              </Button>
                          </Form.Item>

                          <Button
                            block
                            loading={loadingRandom}
                            disabled={loading}
                            icon="🎲 "
                            onClick={handleGenerateRandom}
                          >
                              Generate Random
                          </Button>

                          <Space>
                              <Typography.Text style={{fontSize: "small"}} disabled>
                                  <ClockCircleOutlined/>
                              </Typography.Text>
                              <Typography.Text style={{fontSize: "small"}} disabled>
                                  ~11 Seconds to complete
                              </Typography.Text>
                          </Space>
                      </Space>
                  </Form>
              </Card>

              <Card
                cover={
                    <Image
                      width={780}
                      height={844}
                      src={imgSrc}
                      alt="alt"
                      layout="responsive"
                      ref={image}
                    />
                }
              >

                  <Space direction="vertical">
                      <Card.Meta description={prompt}/>

                      <Tag>{model === "karlo" ? "Created by Karlo" : "Created by Stable Diffusion"}</Tag>

                      <Divider style={{width: "100%"}}/>

                      <Button
                        onClick={handleRegenerate}
                        icon="🔄 "
                        disabled={loading}
                      >
                          Generate Again
                      </Button>

                      <Button
                        disabled={loading}
                        loading={loadingRandom}
                        icon="🎲 "
                        onClick={handleGenerateRandom}
                      >
                          Generate Random
                      </Button>
                  </Space>
              </Card>
          </Space>
      </StyledDiv>
    )
}

export default withAuth(GeneratePage)
