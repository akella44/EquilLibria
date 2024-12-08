import { FC } from "react"
import s from './Error.module.css'

export const Error: FC = () => {
  return (
    <h2 className={s.error}>Ошибка</h2>
  )
}
