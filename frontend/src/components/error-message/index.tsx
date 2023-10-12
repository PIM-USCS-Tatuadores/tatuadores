import Text from "@/components/text"
import style from './style.module.css'

interface ErrorMessageProps {
  message?: string
}

export default function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <>
      {message &&
        <Text
          tagName="p"
          role="alert"
          types={{ xs: 'body-2' }}
          className={style.errorMessage}
        >
          {message}
        </Text>
      }
    </>
  )
}
