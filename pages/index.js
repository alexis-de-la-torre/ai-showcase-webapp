import {Alert, Button, Card, Input, Select, Space, Tag, Typography} from "antd"
import Image from "next/image.js"
import {useState} from "react"
import withAuth from "../auth/withAuth.js"
import fetchClient from "../fetchClient.js"
import styled from "styled-components"

const westworldAddr = process.env.NEXT_PUBLIC_API_ADDR + "/api/v1/generations";

const StyledAlert = styled(Alert)`
  line-height: 1.1;
  font-size: x-small;
`

function GeneratePage() {
    const defaultPrompt = "painting of a beautiful woman surrounded by flowers"

    const [imgSrc, setImageSrc] =
      useState("https://storage.googleapis.com/ai-showcase-stg/006c810e-7d7f-4ef6-b7bf-36fef454677a.jpg")
    const [prompt, setPrompt] = useState(defaultPrompt)
    const [loading, setLoading] = useState(false)
    const [model, setModel] = useState("stable-diffusion")

    const [nextPrompt, setNextPrompt] = useState(defaultPrompt)

    const handleGenerate = () => {
        setLoading(true)

        const params =
          new URLSearchParams({ promp: nextPrompt, qty: 1 })

        fetchClient.get(westworldAddr + "/" + model + "?" + params)
          .then(res => res.data)
          .then(body => {
              setImageSrc(body.urls[0])
              setLoading(false)
              setPrompt(nextPrompt)
          })
          .catch(() => {
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
      <div style={{ paddingTop: 64 + 22, paddingRight: 22, paddingLeft: 22, minHeight: '90vh' }}>
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
              <Card>
                  <Space direction="vertical" style={{ width: '100%' }}>
                      <StyledAlert
                        message="Write anything, then press the button. An AI will try its best to generate an image based on your text."
                        type="info"
                        showIcon
                        closable
                      />

                      <Input.TextArea
                        allowClear
                        rows={3}
                        loading={loading}
                        onChange={handleWrite}
                        defaultValue={defaultPrompt}
                      />

                      <Space>
                          <Select
                            defaultValue="stable-diffusion"
                            onChange={handleModelChange}
                            options={[
                                { label: "Stable Diffusion", value: "stable-diffusion" },
                                { label: "Karlo", value: "karlo" },
                            ]}
                            style={{ minWidth: 150 }}
                          />

                          <Button
                            type="primary"
                            block
                            onClick={handleGenerate}
                            loading={loading}
                          >
                              Generate
                          </Button>
                      </Space>
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
                      <Tag>{model}</Tag>
                  </Space>
              </Card>
          </Space>
      </div>
    )
}

export default withAuth(GeneratePage)
