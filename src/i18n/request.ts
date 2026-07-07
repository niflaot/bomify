import { getRequestConfig } from 'next-intl/server'

import es from '../../messages/es.json'

export default getRequestConfig(() => ({
  locale: 'es',
  messages: es
}))
