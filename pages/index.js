import Image from 'next/image'
import styled from "styled-components"
import {Avatar, Button, Carousel, Col, Drawer, Popconfirm, Row, Space, Spin, Typography} from "antd"
import {useRef, useState} from "react"
import InfiniteScroll from 'react-infinite-scroll-component'

const Grid = styled.div`
    display: grid;
    gap: 2px;
    line-height: 0;

  @media screen and (max-width: 800px) {
    grid-template-columns: repeat(3, auto);
  }

  @media screen and (min-width: 800px) {
    grid-template-columns: repeat(4, auto);
  }
  
  @media screen and (min-width: 1200px) {
    grid-template-columns: repeat(6, auto);
  }
`;

const StyledDrawer = styled(Drawer)`
  .ant-drawer-body, 
  .ant-drawer-body > * {
    padding: 0;
  }
`

const StyledDiv = styled('div')`
    background-color: white;
    position:fixed;
    top:0;
    //width:100%;
    z-index:100;
    box-shadow: 0 -6px 10px 5px rgba(0,0,0,0.2);
`

const StyledText = styled(Typography.Paragraph)`
  //white-space: pre-line;
`

export async function getServerSideProps() {
    const res = await fetch("https://fake-ig.ai-showcase.stg.adlt.dev/api/v1/posts?pageSize=25&pageNo=0")
    const posts = await res.json();

    return {
        props: {
            postsInit: posts.content
        }
    }
}

export default function Home({postsInit}) {
    const [posts, setPosts] = useState(postsInit)

    const [isModalVisible, setModalVisible] = useState(false)
    const [currentPost, setCurrentPost] = useState(null)

    const [loading, setLoading] = useState(false)
    let [page, setPage] = useState(1)
    const [hasMore, setHasMore] = useState(true)

    const sendRequestRef = useRef(true)

    const loadMoreData = () => {
        if (loading) return

        if(sendRequestRef.current === true) {
            sendRequestRef.current = false;

            setLoading(true)

            fetch(`https://fake-ig.ai-showcase.stg.adlt.dev/api/v1/posts?pageSize=25&pageNo=${page}`)
              .then((res) => res.json())
              .then((body) => {
                  setPosts(current => {
                      return [...current, ...body.content]
                  });
                  setLoading(false);
                  setHasMore(!body.empty)
              })
              .catch(() => {
                  setLoading(false);
              });

            setPage(currentPage => {
                return page + 1
            });

            sendRequestRef.current = true;
        }
    }

    const showModal = post => {
        setCurrentPost(post)
        setModalVisible(true)
    };

    const refresh = () => {
        setPosts([])
        loadMoreData()
    }

    const handleClick = () => {
        if (currentPost == null) return;

        fetch("https://influencer.ai-showcase.stg.adlt.dev/api/v1/posts", {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "title": "",
                "description": currentPost.caption,
                "hashtags": [],
                "imageUrls": currentPost.imageUrls,
                "instagramId": "17841453531332190"
            })
        })
    }

    return (
        <div>
            <StyledDiv style={{
                height: 50,
                padding: 5,
                paddingLeft: 20,
                width: "100%",

            }}>
                <div style={{
                    marginLeft: "auto",
                    marginRight: "auto",
                    width: "fit-content",
                }}>
                    <Avatar src={"avatar.jpg"} size="large"/>
                </div>
            </StyledDiv>

            <div style={{marginTop: 50}}>
                <InfiniteScroll
                  next={loadMoreData}
                  hasMore={hasMore}
                  loader={<Spin />}
                  dataLength={posts.length}
                  pullDownToRefresh
                  refreshFunction={refresh}
                >
                    <section>
                        <Grid>
                            {posts?.map((post, i) => (
                              <div key={i} onClick={() => showModal(post)}>
                                  <Image width={780} height={844}
                                         src={post.imageUrls[0]} />
                              </div>
                            ))}
                        </Grid>
                    </section>
                </InfiniteScroll>
            </div>

            {currentPost !== null && (
              <StyledDrawer visible={isModalVisible}
                            onClose={() => setModalVisible(false)}
                            footer={null}>

                  <Carousel dotPosition={"top"} key={currentPost.id}>
                      {currentPost.imageUrls.map((image, i) => (
                        <Image key={i} width={780}
                               height={844} src={image} />
                      ))}
                  </Carousel>

                  <div style={{paddingLeft: 48, paddingRight: 24, marginTop: 12}}>
                      <Space direction={"vertical"} size="middle">
                          <StyledText
                            ellipsis={{ rows: 3, expandable: true, symbol: 'more' }}
                            key={currentPost.id}
                          >
                              {currentPost.caption}
                          </StyledText>

                          <Popconfirm
                            title="Sure?"
                            onConfirm={handleClick}
                          >
                              <Button loading={loading}>📷 Publish to Instagram</Button>
                          </Popconfirm>
                      </Space>
                  </div>
              </StyledDrawer>
            )}
        </div>
    )
}
