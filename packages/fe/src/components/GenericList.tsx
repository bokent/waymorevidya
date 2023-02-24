import { ReactNode, useEffect, useRef } from 'react'
import { Card, Flex, Image, Text, Button, Grid } from '@mantine/core'
import Autoplay from 'embla-carousel-autoplay'
import { IconEdit } from '@tabler/icons-react'
import formatDistance from 'date-fns/formatDistance'
import { Link } from 'react-router-dom'
import { Carousel } from '@mantine/carousel'
// import Slider from 'react-slick'
// import { AutoRotatingCarousel, Slide } from 'material-auto-rotating-carousel'

type GameCardProps = {
  name: string
  image: string
  updatedAt: Date
  displayActions: boolean
  editUrl: string
}

function GenericCard(props: GameCardProps) {
  return (
    <Card p="lg" sx={{ width: 210, height: 260 }}>
      <Card.Section>
        <Image fit="cover" src={props.image} height={120} width={250} />
      </Card.Section>

      <Text mt="md" weight={500} lineClamp={2}>
        {props.name}
      </Text>

      <Text size="sm" color="dimmed">
        {formatDistance(props.updatedAt, new Date(), { includeSeconds: true })}
      </Text>

      {props.displayActions && (
        <Flex>
          <Button
            variant="subtle"
            color="gray"
            compact
            mt="xs"
            size="xs"
            pr="0"
            component={Link}
            to={props.editUrl}
          >
            <IconEdit />
          </Button>
        </Flex>
      )}
    </Card>
  )
}

interface GenericItem {
  name: string
  imageUrl: string
  updatedAt: Date
}
type GenericListProps<T extends GenericItem> = {
  header?: ReactNode
  editUrl?: (item: T) => string
  data: T[]
  limit?: number
  diplayActions?: boolean
  mode?: 'grid' | 'slider'
  stopSlider?: boolean
}

export function GenericList<T extends GenericItem>(props: GenericListProps<T>) {
  const autoplay = useRef(Autoplay({ delay: 260 }))

  // useEffect(() => {
  //   if (props.stopSlider) {
  //     autoplay.current.stop()
  //   } else {
  //     autoplay.current.play()
  //   }
  // }, [props.stopSlider])

  if (props.mode === 'slider') {
    // return (
    //   <AutoRotatingCarousel open autoplay interval={300}>
    //     {props.data.slice(0, props.limit || 5).map((item: GenericItem) => (
    //       <Slide
    //         media={<img src={item.imageUrl} />}
    //         title={item.name}
    //         subtitle={formatDistance(item.updatedAt, new Date(), { includeSeconds: true })}
    //       />
    //     ))}
    //   </AutoRotatingCarousel>
    // )
    // Emba carousel and Mantine Carousel
    return (
      <>
        {props.header && <div>{props.header}</div>}
        <Carousel
          height={260}
          slideSize={250}
          loop
          align="start"
          slidesToScroll={2}
          mb="xl"
          plugins={[autoplay.current]}
        >
          {props.data.slice(0, props.limit || 5).map((item: GenericItem) => (
            <Carousel.Slide>
              <GenericCard
                name={item.name}
                image={item.imageUrl}
                updatedAt={item.updatedAt}
                editUrl=""
                displayActions={props.diplayActions ?? true}
              />
            </Carousel.Slide>
          ))}
        </Carousel>
      </>
    )
    // react-slick
    // return (
    //   <Slider dots={false} arrows={false} infinite slidesToShow={5} slidesToScroll={1}>
    //     {props.data.slice(0, props.limit || 5).map((item: GenericItem) => (
    //       <div>
    //         <GenericCard
    //           name={item.name}
    //           image={item.imageUrl}
    //           updatedAt={item.updatedAt}
    //           displayActions={props.diplayActions ?? true}
    //         />
    //       </div>
    //     ))}
    //   </Slider>
    // )
  }

  return (
    <>
      {props.header && <div>{props.header}</div>}
      <Grid mb="xl">
        {props.data.slice(0, props.limit || 5).map((item: T) => (
          <Grid.Col span="content" key={item.name}>
            <GenericCard
              name={item.name}
              image={item.imageUrl}
              updatedAt={item.updatedAt}
              displayActions={props.diplayActions ?? true}
              editUrl={props.editUrl ? props.editUrl(item) : ''}
            />
          </Grid.Col>
        ))}
      </Grid>
    </>
  )
}
