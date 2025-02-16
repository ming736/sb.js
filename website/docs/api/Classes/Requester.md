# Requester

## Properties
### <small>string</small> language

## Methods
### <small>void</small> setSessionId(<small>newSessionId: string</small>)
### <small>\{ "User-Agent": string; "X-Requested-With": string; "X-Csrftoken": string; Referer: string; }</small> generateHeaders(<small>csrf: string</small>)
### <small>string</small> generateCookieHeader(<small>csrf: string</small>)
### <small>Promise</small> generateCsrfToken()
### <small>Promise</small> generateToken()
### <small>Promise</small> parseResponse(<small>response: Response</small>)
### <small>Promise</small> convertRequestOptions(<small>options: RequestOptions</small>)
Not intended for regular use, but is exposed in case.
### <small>Promise</small> request(<small>url: string</small>, <small>options: RequestOptions</small>)
Not intended for regular use, but is exposed in case.
