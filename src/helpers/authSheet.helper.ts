import { google } from 'googleapis'
import { CREDENTIALS_GOOGLE, SCOPE_GOOGLE } from '@/config'

export const authGoogle = new google.auth.GoogleAuth({
  keyFile: CREDENTIALS_GOOGLE,
  scopes: SCOPE_GOOGLE,
})
