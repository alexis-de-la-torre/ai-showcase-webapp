import {Input, Select, Space, Typography} from "antd"
import Image from "next/image.js"
import {useState} from "react"

const westworldAddr = "https://westworld.ai-showcase.stg.adlt.dev/api/v1/generations"

export default function GeneratePage() {
    const [imgSrc, setImageSrc] =
      useState("https://storage.googleapis.com/ai-showcase-stg/006c810e-7d7f-4ef6-b7bf-36fef454677a.jpg")
    const [prompt, setPrompt] = useState("painting of a beautiful woman surrounded by flowers")
    const [loading, setLoading] = useState(false)
    const [model, setModel] = useState("stable-diffusion")

    const handleGenerate = prompt => {
        setLoading(true)

        const params =
          new URLSearchParams({ promp: prompt, qty: 1 })

        fetch(westworldAddr + "/" + model + "?" + params)
          .then(res => res.json())
          .then(body => {
              setImageSrc(body.urls[0])
              setLoading(false)
              setPrompt(prompt)
          })
          .catch(() => {
              setLoading(false)
          });
    }

    const handleModelChange = model => {
        setModel(model)
    }

    return (
      <div style={{ paddingTop: 85, paddingRight: 26, paddingLeft: 26, minHeight: '90vh' }}>
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
              <Space direction="vertical">
                  <Input.Search
                    allowClear
                    enterButton="Generate"
                    size="large"
                    onSearch={handleGenerate}
                    loading={loading}
                  />

                  <Select
                    defaultValue="stable-diffusion"
                    onChange={handleModelChange}
                    options={[
                        { label: "Stable Diffusion", value: "stable-diffusion" },
                        { label: "Karlo", value: "karlo" },
                    ]}
                    size="large"
                    style={{ minWidth: 150 }}
                  />
              </Space>

              <Image
                width={780}
                 height={844}
                 src={imgSrc}
                 alt="alt"
                 layout="responsive"
              />

              <Typography.Paragraph>
                  {prompt}
              </Typography.Paragraph>
          </Space>
      </div>
    )
}
