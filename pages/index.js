import {Button, Card, Input, Select, Space, Tag, Typography} from "antd"
import Image from "next/image.js"
import {useState} from "react"

const westworldAddr = "https://westworld.ai-showcase.stg.adlt.dev/api/v1/generations"

export default function GeneratePage() {
    const [imgSrc, setImageSrc] =
      useState("https://storage.googleapis.com/ai-showcase-stg/006c810e-7d7f-4ef6-b7bf-36fef454677a.jpg")
    const [prompt, setPrompt] = useState("painting of a beautiful woman surrounded by flowers")
    const [loading, setLoading] = useState(false)
    const [model, setModel] = useState("stable-diffusion")

    const [nextPrompt, setNextPrompt] = useState("")

    const handleGenerate = () => {
        setLoading(true)

        const params =
          new URLSearchParams({ promp: nextPrompt, qty: 1 })

        fetch(westworldAddr + "/" + model + "?" + params)
          .then(res => res.json())
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
      <div style={{ paddingTop: 70, paddingRight: 22, paddingLeft: 22, minHeight: '90vh' }}>
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
              <Card>
                  <Space direction="vertical" style={{ width: '100%' }}>
                      <Input.TextArea
                        allowClear
                        rows={2}
                        loading={loading}
                        onChange={handleWrite}
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
