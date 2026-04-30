import http.server
import os
import socketserver
from functools import partial

PORT = 5000
HOST = "0.0.0.0"
DIRECTORY = os.path.join(os.path.dirname(os.path.abspath(__file__)), "public")


class NoCacheHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0")
        self.send_header("Pragma", "no-cache")
        self.send_header("Expires", "0")
        super().end_headers()


def main():
    handler = partial(NoCacheHandler, directory=DIRECTORY)
    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.TCPServer((HOST, PORT), handler) as httpd:
        print(f"Serving {DIRECTORY} at http://{HOST}:{PORT}")
        httpd.serve_forever()


if __name__ == "__main__":
    main()
