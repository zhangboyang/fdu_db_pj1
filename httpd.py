#!/usr/bin/env python3

import os
import http.server
import socketserver

class eh_nocache_HTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_my_headers()
        http.server.SimpleHTTPRequestHandler.end_headers(self)
    def send_my_headers(self):
        self.send_header("Cache-Control", "no-store, no-cache, must-revalidate, post-check=0, pre-check=0")
        self.send_header("Pragma", "no-cache")
        self.send_header("Expires", "Thu, 19 Nov 1981 08:52:00 GMT")


# chdir to 'html'
os.chdir(os.path.join(os.path.dirname(os.path.realpath(__file__)), 'html'))

# run the server
httpd = socketserver.TCPServer(("127.0.0.1", 8000), eh_nocache_HTTPRequestHandler)
httpd.serve_forever()

