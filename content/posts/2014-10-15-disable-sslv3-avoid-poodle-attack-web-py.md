---
title: "Disable SSLv3 to avoid POODLE attack in web.py"
tags: ["post", "encryption", "my-software", "python", "security"]
layout: post
---

An open source application that I contribute to uses web.py to provide a
web server platform for its services alongside the other platforms
available. I recently updated it to use a sane set of default ciphers
and to disable the SSLv3 protocol in order to avoid the POODLE attack
the Internet is currently buzzing about. Here's an abstract example so
that you can do this yourself at home.<!--more-->

```python
from web.wsgiserver import CherryPyWSGIServer
from web.wsgiserver.ssl_pyopenssl import pyOpenSSLAdapter
from OpenSSL import SSL

cert = '/home/haliphax/ssl.cer'
key = '/home/haliphax/ssl.key'
chain = '/home/haliphax/chain.cer'

CherryPyWSGIServer.ssl_adapter = pyOpenSSLAdapter(cert, key, chain)
CherryPyWSGIServer.ssl_adapter.context =
SSL.Context(SSL.SSLv23_METHOD)
CherryPyWSGIServer.ssl_adapter.context.set_options(SSL.OP_NO_SSLv3)
CherryPyWSGIServer.ssl_adapter.context.use_certificate_file(cert)
CherryPyWSGIServer.ssl_adapter.context.use_privatekey_file(key)

if chain:
    CherryPyWSGIServer.ssl_adapter.context.use_certificate_chain_file(chain)

CherryPyWSGIServer.ssl_adapter.context.set_cipher_list('ECDH+AESGCM:DH+AESGCM:ECDH+AES256:DH+AES256:ECDH+AES128:DH+AES:ECDH+3DES:DH+3DES:RSA+AESGCM:RSA+AES:RSA+3DES:!aNULL:!MD5:!DSS')

urls = ('/.*', 'hello')
app = web.application(urls, globals())
web.httpserver.runsimple(app.wsgifunc(), ('0.0.0.0', 443))
```
