import { Children, cloneElement, isValidElement, ReactNode, useState } from 'react'
import style from './style.module.css'
import Icon from '../icon'
import Flexbox from '../flexbox'

interface ImageInputProps {
  url?: string,
  children: ReactNode
}

export default function ImageInput({ url, children }: ImageInputProps) {
  const [imageUrl, setImageUrl] = useState<string>(url || '')
  const child = Children.only(children)
  const props = { onChange: handleFileInput, multiple: false }
  const input = isValidElement(child) ? cloneElement(child, props) : ''

  function handleFileInput(event: InputEvent) {
    const input = event.target as HTMLInputElement
    const file = input.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      setImageUrl(url)
    }
  }

  return (
    <Flexbox
      tagName='label'
      justifyContent={{ xs: 'center' }}
      className={style.inputWrapper}
    >
      {imageUrl ?
        <picture className={style.imageWrapper}>
          <img
            src={imageUrl}
            className={style.image}
          />
        </picture>
        :
        <Flexbox
          direction={{ xs: 'column' }}
          alignItems={{ xs: 'center' }}
          justifyContent={{ xs: 'center' }}
          gap={{ xs: 'small' }}
        >
          <Icon
            name='photo'
            sizes={{ xs: 'large' }}
          />

          Adicionar imagem
        </Flexbox>
      }

      <div className={style.input}>
        {input}
      </div>
    </Flexbox>
  )
}
