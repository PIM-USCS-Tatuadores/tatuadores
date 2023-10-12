import Text from "@/components/text"
import Flexbox from "@/components/flexbox"

interface EmptyStateProps {
  icon: string,
  title: string,
  message: string
}

export default function EmptyState(props: EmptyStateProps) {
  return (
    <Flexbox
      direction={{ xs: 'column' }}
      gap={{ xs: 'small' }}
      alignItems={{ md: 'center' }}
      justifyContent={{ xs: 'center' }}
      style={{ height: '100%', transform: 'translateY(-10%)' }}
    >
      <Text types={{ xs: 'display' }}>
        {props.icon}
      </Text>

      <Text types={{ xs: 'body-1-bold', md: 'subtitle' }}>
        {props.title}
      </Text>

      <Text types={{ xs: 'body-1' }}>
        {props.message}
      </Text>
    </Flexbox>
  )
}
